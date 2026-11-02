const personsRouter=require('express').Router()
const logger=require('../utils/logger')
const Person=require('../models/person')
personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
personsRouter.put('/:id', (request, response, next) => {
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
personsRouter.get('/:id', (request, response, next) => {
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

personsRouter.post('/', (request, response, next) => {
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
          logger.info(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})
personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
module.exports=personsRouter
