const express = require('express')
const accountRoutes = express.Router()
const db = require('../db/')

accountRoutes.get('/', (req, res) => {
  let page = 1
  let limit = 5
  if (req.query.page !== undefined && req.query.limit !== undefined) {
    page = req.query.page
    limit = req.query.limit
  }

  db.func('getuserslist', [page, limit])
    .then((rows) => {
      res.json(rows)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send('Error from server')
    })
})

accountRoutes.get('/:id', (req, res) => {
  db.func('finduser', [req.params.id])
    .then((rows) => {
      res.json(rows)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send('Error from server')
    })
})

accountRoutes.post('/', (req, res) => {
  if (
    req.body.username !== undefined &&
    req.body.email !== undefined &&
    req.body.password !== undefined
  ) {
    db.func('AddUsers', [req.body.username, req.body.email, req.body.password])
      .then(() => {
        res.status(200).send(`new account with id: has been added successfully`)
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send('Error from server')
      })
  } else {
    let fields = ['username', 'email', 'password']
    let emptyFields = []
    fields.map((item) => {
      if (item in req.body === false) {
        emptyFields.push(item)
      }
    })
    console.log(emptyFields)
    res.status(400).send(`Your data does'nt have ${emptyFields} fields`)
  }
})

accountRoutes.put('/:id', (req, res) => {
  db.func('updateuser', [req.params.id, req.body.email, req.body.password])
    .then(() => {
      res.status(200).send({
        status: 'success',
        message: `user with id: ${req.params.id} has been updated successfully`,
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send('Error from server')
    })
})

accountRoutes.delete('/:id', (req, res) => {
  db.func('deleteuser', [req.params.id])
    .then(() => {
      res.status(200).send({
        status: 'success',
        message: `user with id: ${req.params.id} has been deleted successfully`,
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send('Error from server')
    })
})

module.exports = accountRoutes
