const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET route to fetch all blogs
blogsRouter.get('/', async (request, response) => {
  try{
    const blogs = await Blog.find({})
    response.json(blogs)
  }
  catch (error) {
    next(error) 
  }
})

// POST route to create a new blog
blogsRouter.post('/', async (request, response, next) => {
  try {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
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