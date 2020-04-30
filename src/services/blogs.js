import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createBlog = async (newBlog) => {
  console.log('token: ', token)
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.post(baseUrl, newBlog, config)
  return res.data
}

const likeBlog = async (blog) => {
  const blogToPut = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
  }

  const res = await axios.put(`${baseUrl}/${blog.id}`, blogToPut)

  /*
    Request returns only userid for some reason
    problem probably related to mongoose refs (backend)
    user doesnt change anyways so this works
  */
  res.data.user = blog.user
  return res.data
}

const removeBlog = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return res.status
}

export default { getAll, setToken, createBlog, likeBlog, removeBlog }