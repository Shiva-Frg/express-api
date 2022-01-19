const express = require('express')
const { queryResult } = require('pg-promise')
const usersRoutes = express.Router()
const db = require('../db')

// Functions
const checkEmptyFields = async (req) => {
  let fields = []
  req.method === 'PUT'
    ? (fields = ['id', 'email', 'password'])
    : (fields = ['name', 'family', 'email', 'username', 'mobile', 'password'])

  let emptyFields = []
  let msg = ''

  fields.map((item) => {
    if (req.method === 'PUT' && 'username' in req.body === true) {
      msg = 'You can not update your username! just Email and Password.'
    } else if (item in req.body === false) {
      emptyFields.push(item)
    }
  })
  string = emptyFields.length > 1 ? 'fields' : 'field'

  return { emptyFields, string, msg }
}

const checkUserExist = async (id) => {
  let user = null

  await db
    .func('finduserwithidinuserstable', [id], queryResult.one)
    .then((rows) => {
      user = rows
    })
    .catch((error) => {
      console.log(error)
    })

  return user
}

// Routes
usersRoutes.get('/', async (req, res) => {
  let page = 1
  let limit = 5
  if (req.query.page !== undefined && req.query.limit !== undefined) {
    page = req.query.page
    limit = req.query.limit
  }

  await db
    .func('getuserslist', [page, limit])
    .then((rows) => {
      let total = 0
      let contentOfUsers = null
      rows.length !== 0 ? (total = rows[0].totalrecords) : (total = 0)
      rows.length !== 0
        ? (contentOfUsers = rows)
        : (contentOfUsers = 'There is no user anymore!')
      rows.map((item) => delete item.totalrecords)
      res.status(200).send({
        pageIndex: page,
        totalRecords: total,
        users: contentOfUsers,
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: 'failed', message: 'Error from server' })
    })
})

usersRoutes.get('/:id', async (req, res) => {
  const userExist = await checkUserExist(req.params.id)
  if (userExist) {
    res.status(200).send({
      status: 'success',
      message: 'User founded!',
      user: userExist,
    })
  } else {
    res.status(404).send({
      status: 'failed',
      message: `User with ID: ${req.params.id} not found!`,
    })
  }
})

usersRoutes.post('/', async (req, res) => {
  const { emptyFields, string } = await checkEmptyFields(req)
  let userExists = false

  if (emptyFields.length === 0) {
    await db
      .func(
        'checkuserexistsatpostdata',
        [req.body.username, req.body.email],
        queryResult.one
      )
      .then((row) => {
        userExists = row.checkuserexistsatpostdata
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send({ status: 'failed', message: 'Error from server' })
      })

    if (userExists === false) {
      await db
        .func(
          'addusertouserstable',
          [req.body.username, req.body.email, req.body.password],
          queryResult.one
        )
        .then((row) => {
          res.status(200).send({
            status: 'success',
            message: `new user with ID: ${row.addusertouserstable} has been added successfully`,
          })
        })
        .catch((error) => {
          console.log(error)
          res
            .status(500)
            .send({ status: 'failed', message: 'Error from server' })
        })
    } else {
      res.status(404).send({
        status: 'failed',
        message: 'a user with this username and email does exists',
      })
    }
  } else {
    res.status(400).send({
      status: 'failed',
      message: `Your data does'nt have ${emptyFields} ${string}`,
    })
  }
})

usersRoutes.put('/', async (req, res) => {
  const { emptyFields, string, msg } = await checkEmptyFields(req)
  const checkUserId = emptyFields.find((item) => item === 'id')

  if (checkUserId) {
    res.status(400).send({
      status: 'failed',
      message: `Your data does'nt have the id field!`,
    })
  } else {
    if (msg !== '') {
      res.status(400).send({ status: 'failed', message: msg })
    } else if (emptyFields.length !== 0 && msg === '') {
      res.status(400).send({
        status: 'failed',
        message: `Your data does'nt have ${emptyFields} ${string}`,
      })
    } else {
      const userExist = await checkUserExist(req.body.id)
      if (userExist) {
        await db
          .func('updateuser', [req.body.id, req.body.email, req.body.password])
          .then(() => {
            res.status(200).send({
              status: 'success',
              message: `user with ID: ${req.body.id} has been updated successfully`,
            })
          })
          .catch((error) => {
            console.log(error)
            res
              .status(500)
              .send({ status: 'failed', message: 'Error from server' })
          })
      } else {
        res.status(404).send({
          status: 'failed',
          message: `User with ID: ${req.body.id} Not found!`,
        })
      }
    }
  }
})

usersRoutes.delete('/', async (req, res) => {
  if (req.body.id) {
    const userExist = checkUserExist(req.body.id)
    if (userExist) {
      await db
        .func('deleteuser', [req.body.id])
        .then(() => {
          res.status(200).send({
            status: 'success',
            message: `User with ID: ${req.body.id} has been deleted successfully`,
          })
        })
        .catch((error) => {
          console.log(error)
          res
            .status(500)
            .send({ status: 'failed', message: 'Error from server' })
        })
    } else {
      res.status(404).send({
        status: 'failed',
        message: `User with ID: ${req.body.id} Not found!`,
      })
    }
  } else {
    res.status(400).send({
      status: 'failed',
      message: `Your data does'nt have the id field!`,
    })
  }
})

module.exports = usersRoutes
