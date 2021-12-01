const express = require('express')
const app = express()
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const routes = require('./routes/Routes')

app.use('/', routes)

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRUD Express API with Swagger',
      version: '1.0.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000/',
      },
    ],
  },
  apis: ['./routes/docs.js'],
}

const specs = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.listen(3000)
