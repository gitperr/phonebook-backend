require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('reqBody', function (req, res) {
  let postBody = {
    name: "",
    number: ""
  }
  
  postBody.name = req.body.name;
  postBody.number = req.body.number;
  return JSON.stringify(postBody)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

app.get('/api/persons', (request, response) => {
  let persons = []
  Person.find({}).then(result => {
    result.forEach(person => {
      persons = persons.concat(person)
    })
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (!person) {
      return response.status(404).json({ error: 'Person not found' })
    }
    response.json(person)
  })
  .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  if (!request.body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!request.body.number) {
    return response.status(400).json({
        error: 'number missing'
    })
  }

  person = new Person({
    name: request.body.name,
    number: request.body.number
  }
  )

  person.save()
    .then(savedPerson => {
      response.status(201)
      response.json(savedPerson)
    })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.get('/info', (request, response) => {
  const dateNow = new Date(Date.now()).toString()
  const responseText = `
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${dateNow}</p>
  `
  response.send(responseText)
})

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})