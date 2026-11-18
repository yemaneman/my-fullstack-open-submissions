import { useState, useEffect,useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/blogForm'
import './index.css'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })
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
      console.error('Login failed:', exception)
      notify('Wrong username or password','error')
    }
  }
  const handleLikeOf = async (id) => {
    const blogToUpdate = blogs.find(b => b.id === id)
    const updatedBlog = {
      ...blogToUpdate,
      user: blogToUpdate.user.id || blogToUpdate.user,
      likes: blogToUpdate.likes + 1,
    }

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog))
    } catch (error) {
      console.error('Failed to update likes', error)
    }
  }
  const blogFormRef=useRef()
  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(
        blogObject
      )
      setBlogs(blogs.concat(newBlog))
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    } catch (exception) {
      console.error('Failed to create blog:', exception)
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
        console.error('Failed to delete blog:', exception)
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
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
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
            <Togglable buttonLabel='createNewBlog' ref={blogFormRef}>
              <BlogForm createBlog={createBlog}/>
            </Togglable>
            <div className='blogs-section'>
              <h2>blogs</h2>
              {sortedBlogs.map(blog =>
                <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} handleLike={() => handleLikeOf(blog.id)} />)}
            </div>
          </div>

        )
      }

    </div>
  )
}

export default App