const mongoose = require('mongoose')
const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minlength:3,
    required :true
  },
  number:{
    type:String,
    validate: {
      validator: function(v) {
        // Checks if it matches 2-3 digits, a hyphen, and has a total length of at least 8
        return /^\d{2,3}-\d+$/.test(v) && v.length >= 8
      },
      message: props => `${props.value} is not a valid phone number! It must be at least 8 characters long and formatted as XX-XXXXXX or XXX-XXXXX.`
    }
  }
})

// Add toJSON transformation so _id becomes id and __v is deleted (crucial for Full Stack Open frontend compatibility)
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)
