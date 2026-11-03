const _ = require('lodash')
const dummy = (blogs) => {
  return 1;
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
  mostLikes
}
