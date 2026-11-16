import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(parsedUser.token)
      return parsedUser
    }
    return null
})
  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  setUser(null)
  blogService.setToken(null)
}
const handleLogin = async (event) => {
  event.preventDefault()

  try {
    const user = await loginService.login({
      username, 
      password,
    })
    notify(`Welcome back, ${user.name}!`)
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )

    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')

  } catch (exception) {
    console.error("Login failed:", exception)
    notify('Wrong username or password','error')
  }
}
const createBlog = async (event) => {
  event.preventDefault()

  try {
    const newBlog = await blogService.create({
      title,
      author,
      url
    })

    setBlogs(blogs.concat(newBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
    notify(`a new blog ${newBlog.title} by ${newBlog.author} added`)
  } catch (exception) {
    console.error("Failed to create blog:", exception)
    notify('Failed to create blog', 'error')
  }
}
const deleteBlog = async (id) => {
  const blogToDelete = blogs.find(b => b.id === id)
  
  const ok = window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)
  
  if (ok) {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      notify(`Removed blog ${blogToDelete.title} by ${blogToDelete.author}`)
    } catch (exception) {
      console.error("Failed to delete blog:", exception)
      notify('Failed to delete blog', 'error')
    }
  }
}
const loginForm = () => (
  <form onSubmit={handleLogin} className="form-card">
    <div className='form-group'>
      <label>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </label>
    </div>
    <div className='form-group'>
      <label>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </label>
    </div>
    <button type="submit" className='btn-primary'>login</button>
  </form>
)
const blogForm = () => (
  <div className='form-card'>
    <h2>create new</h2>
    <form onSubmit={createBlog}>
      <div className='form-group'>
        <label>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div className='form-group'>
        <label>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div className='form-group'>
        <label>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <button type="submit" className='btn-primary'>create</button>
    </form>
  </div>
)
  return (
    <div className='app-container'>
      <Notification message={notification.message} type={notification.type} />
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          {loginForm()}
        </div>
      ):
      ( 
      <div >
         <div className='user-bar'>
            <span>{user.name} logged in{' '}</span> 
            <button onClick={handleLogout} className='btn-logout'>logout</button>
          </div>
          {blogForm()}
          <div className='blogs-section'>
            <h2>blogs</h2>
            {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} />)}
          </div>
      </div>
        
      )
      }
      
    </div>
  )
}

export default App