const { test, beforeEach, describe, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('../utils/list_helper')

let token = null

const newBlog = {
  title: "React pattern",
  author: "Michael Cha",
  url: "https://reactpatterns.com/",
  likes: 7
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Create a test user for authentication
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  const savedUser = await user.save()

  // Generate a token for the test user
  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }
  token = jwt.sign(userForToken, process.env.SECRET)

  await Blog.insertMany(helper.blogs)
})

describe("blogs test", () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.blogs.length)
  })

  test('a specific blog is within the returned blog', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(e => e.title)
    assert.strictEqual(contents.includes("Go To Statement Considered Harmful"), true)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a valid blog can be added', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, helper.blogs.length + 1)
    assert(contents.includes('React pattern'))
  })

  test('blog posts have an id property instead of _id', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body.length > 0)
    const blog = response.body[0]
    assert.strictEqual(typeof blog.id, 'string')
    assert.strictEqual(typeof blog._id, 'undefined')
  })

  test('blog post without likes property defaults to 0 likes', async () => {
    const newBlogWithoutLikes = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htm"
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is not added', async () => {
    const invalidBlog = {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.htm",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.blogs.length)
  })

  test('blog without url is not added', async () => {
    const invalidBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.blogs.length)
  })

  test('adding a new blog fails with 401 Unauthorized if token is missing', async () => {
    const unauthenticatedBlog = {
      title: "Unauthorized Blog",
      author: "No One",
      url: "http://example.com",
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(unauthenticatedBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.blogs.length)
  })

  test('a blog can be deleted', async () => {
    
    const newBlog = {
      title: "Blog to delete",
      author: "Tester",
      url: "http://example.com/delete",
      likes: 1
    }

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogToDelete = postResponse.body
    const blogsAtStart = await helper.blogsInDb()

    
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogData = {
      title: "Updated Blog Title",
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1 
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, updatedBlogData.title)
    assert.strictEqual(response.body.likes, updatedBlogData.likes)
  })
})

after(async () => {
  await mongoose.connection.close()
})