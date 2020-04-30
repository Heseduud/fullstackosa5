import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notifMsg, setNotifMsg] = useState(null)
  const [notifType, setNotifType] = useState(null)

  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll()
      .then(blogs => {
        setBlogs(sortBlogs(blogs))
      })
  }, [])

  useEffect(() => {
    const loggedBlogappUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedBlogappUserJSON) {
      const user = JSON.parse(loggedBlogappUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (newBlog) => {
    const added = await blogService.createBlog(newBlog)

    // Insert current user into res we got
    added.user = user
    setBlogs(blogs.concat(added))

    // AddBlog notif
    setNotifMsg(`New blog: ${added.title} by ${added.author} added!`)
    setNotifType('notif')
    setTimeout(() => {
      setNotifMsg(null)
      setNotifType(null)
    }, 2000)
  }

  const likeBlog = async (blog) => {
    await blogService.likeBlog(blog)
    setBlogs(sortBlogs(blogs))
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Delete ${blog.title}?`)) {
      const res = await blogService.removeBlog(blog)
      if (res === 204) {
        const newBlogs = blogs.filter(b => b.id !== blog.id)
        setBlogs(newBlogs)

        setNotifMsg(`${blog.title} by ${blog.author} deleted!`)
        setNotifType('notif')
        setTimeout(() => {
          setNotifMsg(null)
          setNotifType(null)
        }, 2000)
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      console.log(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
    } catch (ex) {
      console.log('error with login: ', ex)

      // Error w/ login notif
      setNotifMsg('Invalid username or password')
      setNotifType('error')
      setTimeout(() => {
        setNotifMsg(null)
        setNotifType(null)
      }, 2000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    // Logout Notif
    setNotifMsg('Logged out')
    setNotifType('notif')
    setTimeout(() => {
      setNotifMsg(null)
      setNotifType(null)
    }, 2000)

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const sortBlogs = (unsorted) => {
    /*
      Array.sort doesn't modify state directly according to react docs
      --> to achieve re-render we copy the array and then sort it
    */
    const sortedBlogs = [...unsorted].sort((a, b) => { return b.likes - a.likes })
    return sortedBlogs
  }

  if (user === null) {
    return (
      <div>
        <Notification msg={notifMsg} type={notifType}/>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification msg={notifMsg} type={notifType}/>
      <h2>Blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
      {blogs.map((blog) => <Blog blog={blog}
        likeHandler={likeBlog}
        deleteHandler={deleteBlog}
        currentUser={user} key={blog.id}/>)}
      <br/>

      <Togglable buttonLabel="New Note" ref={blogFormRef}>
        <NewBlogForm
          createBlog={addBlog}
        />
      </Togglable>
    </div>
  )
}

export default App