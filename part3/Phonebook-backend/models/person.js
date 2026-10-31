const mongoose = require('mongoose')
require('dotenv').config()
// Use your connection string (Note: since your DNS SRV lookup worked earlier or failed, use whatever works reliably, but keeping your format here)
const url = process.env.MONGODB_URI;
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Add toJSON transformation so _id becomes id and __v is deleted (crucial for Full Stack Open frontend compatibility)
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

// CHECK: Is this file being run directly from the command line?
if (require.main === module) {
  if (process.argv.length < 4) {
    console.log('Please provide both name and number as arguments: node mongo.js <password> <name> <number>')
    process.exit(1)
  }

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  // If required by index.js, just export the model
  module.exports = Person
}