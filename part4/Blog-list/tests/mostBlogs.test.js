const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
    { title: 'Blog 1', author: 'Edsger W. Dijkstra', likes: 12 },
    { title: 'Blog 2', author: 'Robert C. Martin', likes: 5 },
    { title: 'Blog 3', author: 'Robert C. Martin', likes: 1 },
    { title: 'Blog 4', author: 'Robert C. Martin', likes: 2 },
    { title: 'Blog 5', author: 'Michael Chan', likes: 7 }
  ]
describe('most blogs', () => {
    test('returns the author with the highest number of blog posts', () => {
      const result = listHelper.mostBlogs(blogs)
      
      // Robert C. Martin wrote 3 blogs, which is the most in this list
      assert.deepStrictEqual(result, {
        author: 'Robert C. Martin',
        blogs: 3
      })
    }
    )
   });