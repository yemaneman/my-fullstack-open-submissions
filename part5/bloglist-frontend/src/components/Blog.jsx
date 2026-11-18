import { useState } from 'react'
const Blog = ({ blog, deleteBlog,handleLike }) => {
  const [showDetails, setShowDetails] = useState(false)
  const toggleDetails = () => {
    setShowDetails((prev) => !prev)
  }
  return (
    <div className="blog-card">
      <div className="blog-content">
        <div className="blog-header">
          <span className="blog-title">{blog.title}</span>{' '}
          <span className="blog-author">by {blog.author}</span>{' '}
          <button onClick={toggleDetails} className="btn-toggle">
            {showDetails ? 'hide' : 'show'}
          </button>
        </div>

        {showDetails && (
          <div className="blog-details">
            <div className="blog-url">{blog.url}</div>
            <div className="blog-likes">
          Likes: {blog.likes}
              <button onClick={handleLike}>like</button>
            </div>
            <div className="blog-likes">
              {blog.author}
            </div>
            <div>
              <button onClick={() => deleteBlog(blog.id)} className="btn-delete">
            remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog