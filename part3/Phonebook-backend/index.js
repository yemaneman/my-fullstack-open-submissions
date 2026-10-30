const express = require('express')
const morgan= require('morgan')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
let persons=[
    {
        "name":"yemane",
        "number":"098",
        "id":"1"

    },
    {
        "name":"yema",
        "number":"0988",
        "id":"2"
    },
    {
        "name":"yeman",
        "number":"0980",
        "id":"3"
    }
]

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.get('/api/persons', (request, response) => {
  response.json(persons)
  
})

app.get('/info',(request,response)=>{
    const personCount=persons.length
    const currentDate= new Date()
    response.send(`
        <p> phonebook has info for ${personCount} people </p>
        <p>${currentDate}
        `)
})
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}
app.post('/api/persons', (request, response) => {
  const body = request.body

 if(!body.name||!body.number){
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }


  const person = {
    name: body.name,
    number:body.number,
    important: body.important || false,
    id: generateId(),
  }

  const nameExists=persons.some(person=>person.name===body.name)
  if(nameExists){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
 
  persons = persons.concat(person)

  response.json(person)
  console.log(person)
})
app.get('/api/persons/:id',(request,response)=>{
    const id= request.params.id
    const person=persons.find(person=>person.id===id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})
    app.delete('/api/persons/:id',(request,response)=>{
        const id= request.params.id
        persons=persons.filter(person=>person.id!==id)
        response.json(persons)
        response.status(204).end()
        
    })

const PORT= 3001;
app.listen(PORT,(request,response)=>{
    console.log(`server runnig on port ${PORT}`)
})