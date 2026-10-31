require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person.js') // Imports your mongoose model
const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// GET all persons from MongoDB
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// GET info route using database count
app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const currentDate = new Date()
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${currentDate}</p>
    `)
  })
})
// PUT (update) existing person's number or name
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // Find the person by ID and update them
  Person.findByIdAndUpdate(
    request.params.id, 
    { name, number }, 
    { returnDocument: 'after', runValidators: true }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// GET single person by ID from MongoDB
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // Good practice for handling invalid ObjectIds
})

// DELETE person from MongoDB
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// POST (add) new person to MongoDB
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  // Optional: check if name already exists in database
  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      })

      person.save()
        .then(savedPerson => {
          response.json(savedPerson)
          console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

const PORT =process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})