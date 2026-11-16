const Blog = ({ blog, deleteBlog }) => {
  return (
    <div className="blog-card">
      <div className="blog-content">
        <span className="blog-title">{blog.title}</span>
        <span className="blog-author">by {blog.author}</span>
      </div>
      <button onClick={() => deleteBlog(blog.id)} className="btn-delete">
        remove
      </button>
    </div>
  )
}

export default Blog