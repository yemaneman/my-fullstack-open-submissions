const { test,beforeEach,describe, after } = require('node:test')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)
const Blog=require('../models/blog')
const helper=require('../utils/list_helper')
const newBlog = {
  title: "React pattern",
  author: "Michael Cha",
  url: "https://reactpatterns.com/",
  likes: 7
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogs)
})
describe("blogs test",()=>{
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 3)
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
test(' a valid blog can be added', async () => {
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)
  assert.strictEqual(response.body.length, helper.blogs.length+1)
  assert(contents.includes('React patterns'))
})
test('blog posts have an id property instead of _id',async()=>{
  const response= await api.get('/api/blogs')
  assert(response.body.length>0)
  const blog=response.body[0]
  assert.strictEqual(typeof blog.id, 'string')
  assert.strictEqual(typeof blog._id, 'undefined')

})
test('blog post without likes property defaults to 0 likes', async () => {
  const newBlogWithoutLikes = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htm"
    // likes is intentionally left out
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.likes, 0)
})
test('blog without title is not added', async () => {
  const newBlog = {
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.htm",
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.blogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.blogs.length)
})
test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
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