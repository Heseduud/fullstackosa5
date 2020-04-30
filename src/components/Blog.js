import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeHandler, currentUser, deleteHandler }) => {

  const [show, setShow] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleShowButton = (event) => {
    event.preventDefault()
    setShow(!show)
  }

  const handleLike = (event) => {
    event.preventDefault()
    console.log('Liked: ', blog)
    blog.likes += 1
    setLikes(blog.likes)
    likeHandler(blog)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    console.log('Removing: ', blog)
    deleteHandler(blog)
  }

  if (show) {
    /*
      Username is unique so we can check this with them
      token is passed anyways with request so backend doesnt
      accept unvalid deletes
    */
    if (currentUser.username === blog.user.username) {
      return (
        <div style={blogStyle} className='blog'>
          {blog.title} {blog.author} <button onClick={handleShowButton}>Hide</button> <br/>
          {blog.url} <br/>
          Likes: {likes} <button id="likeButton" onClick={handleLike}>Like</button> <br/>
          {blog.user.name} <br/>
          <button id="removeBlogButton" onClick={handleRemove}>Remove</button>
        </div>
      )
    }

    return (
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author} <button onClick={handleShowButton}>Hide</button> <br/>
        {blog.url} <br/>
        Likes: {likes} <button id="likeButton" onClick={handleLike}>Like</button> <br/>
        {blog.user.name} <br/>
      </div>
    )
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} <button id="blogShowButton" onClick={handleShowButton}>Show</button>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeHandler: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  deleteHandler: PropTypes.func.isRequired
}

export default Blog
