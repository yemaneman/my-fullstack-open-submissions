import { useState } from 'react'
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const addBlog=(event) => {

    event.preventDefault()
    createBlog (
      {
        title,
        author,
        url
      })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return(
    <div className='form-card'>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div className='form-group'>
          <label>
                title:
            <input
              type="text"
              value={title}
              placeholder='Write the title here'
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
              placeholder='Write the author here'
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
              placeholder='Write the url here'
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit" className='btn-primary'>create</button>
      </form>
    </div>
  )
}
export default BlogForm