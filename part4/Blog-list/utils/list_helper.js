const _ = require('lodash')
const Blog=require('../models/blog')
const dummy = (blogs) => {
  return 1;
}
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f9",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  }

]
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
const totalLikes=(blogs)=>{
  const reducer=(sum,blog)=>{
    return sum+blog.likes;
  }
  return blogs.reduce(reducer,0)
}

const favoriteBlog=(blogs)=>{
    if(blogs.length===0) return null
    return blogs.reduce((prev,current)=>current.likes>prev.likes?current:prev)
}

const mostBlogs=(blogs)=>{
    const counts = _.countBy(blogs, 'author')

  
  const authorArray = Object.keys(counts).map(author => ({
    author: author,
    blogs: counts[author]
  }))

  
  return _.maxBy(authorArray, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

 
  const grouped = _.groupBy(blogs, 'author')

  const authorLikes = Object.keys(grouped).map(author => {
    
    const totalLikes = grouped[author].reduce((sum, blog) => sum + blog.likes, 0)
    
    return {
      author: author,
      likes: totalLikes
    }
  })

  return _.maxBy(authorLikes, 'likes')
 }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogs,
  blogsInDb
}
