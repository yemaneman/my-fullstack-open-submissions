const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
blogsRouter.get('/', async (request, response) => {
  try{
    const blogs = await Blog.find({}).populate('user',{username:1,name:1,id:1})
    response.json(blogs)
  }
  catch (error) {
    next(error) 
  }
})

// POST route to create a new blog
blogsRouter.post('/', async (request, response, next) => {
  try {
    const body=request.body
    const user = request.user
    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
   
    const blog = new Blog( {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  }
)
    const savedBlog = await blog.save()
    user.blogs=user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error) 
  }
})
blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end() // Not found
    }
  } catch (error) {
    next(error) 
  }
})
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    
    const user = request.user
    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end() 
  } catch (error) {
    next(error)
  }
})
// PUT update a blog by ID
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blog,
      { returnDocument: 'after', runValidators: true, context: 'query' }
    )

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end() // Blog not found
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter