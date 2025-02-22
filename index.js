const express = require('express')
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
      "id": "5",
      "name": "Testti mies",
      "number": "1293-1239932-391293"
    }
]

app.use(express.json())

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(person => person.id === request.params.id)

  if (person) {
    return response.json(person)
  } else {
    response.status(404)
    return response.send('No person found with this id.')
  }
})

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(person => person.id !== request.params.id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  const dateNow = new Date(Date.now()).toString()
  const responseText = `
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${dateNow}</p>
  `
  response.send(responseText)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})