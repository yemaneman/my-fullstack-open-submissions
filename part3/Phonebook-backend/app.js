const express =require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const personsRouter= require('./controllers/persons')
const app = express()

const url = config.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/persons', personsRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app