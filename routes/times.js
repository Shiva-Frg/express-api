const express = require('express')
const { queryResult } = require('pg-promise')
const timesRoutes = express.Router()
const db = require('../db/')

//Functions
const checkEmptyFields = async (req) => {
  let fields = ['startOfBooking', 'endOfBooking', 'reserved']

  let emptyFields = []

  fields.map((item) => {
    if (item in req.body === false) {
      emptyFields.push(item)
    }
  })
  string = emptyFields.length > 1 ? 'fields' : 'field'

  return { emptyFields, string }
}

const checkTimeExist = async (id) => {
  let time = null

  await db
    .func('findtimewithidintimestable', [id], queryResult.one)
    .then((rows) => {
      time = rows
    })
    .catch((error) => {
      console.log(error)
    })

  return time
}

//Routes
timesRoutes.get('/', async (req, res) => {
  let page = 1
  let limit = 5
  if (req.query.page !== undefined && req.query.limit !== undefined) {
    page = req.query.page
    limit = req.query.limit
  }

  await db
    .func('gettimeslist', [page, limit])
    .then((rows) => {
      let total = 0
      let contentOfTimes = null
      rows.length !== 0 ? (total = rows[0].totalrecords) : (total = 0)
      rows.length !== 0
        ? (contentOfTimes = rows)
        : (contentOfTimes = 'There is no time anymore!')
      rows.map((item) => delete item.totalrecords)
      res.status(200).send({
        pageIndex: page,
        totalRecords: total,
        times: contentOfTimes,
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: 'failed', message: 'Error from server' })
    })
})

timesRoutes.get('/:id', async (req, res) => {
  const timeExist = await checkTimeExist(req.params.id)
  if (timeExist) {
    res.status(200).send({
      status: 'success',
      message: 'Time founded!',
      time: timeExist,
    })
  } else {
    res.status(404).send({
      status: 'failed',
      message: `Time with ID: ${req.params.id} not found!`,
    })
  }
})

timesRoutes.post('/', async (req, res) => {
  const { emptyFields, string } = await checkEmptyFields(req)
  let timeExists = false

  if (emptyFields.length === 0) {
    await db
      .func(
        'checktimeexistsatpostdata',
        [req.body.startOfBooking, req.body.endOfBooking],
        queryResult.one
      )
      .then((row) => {
        timeExists = row.checktimeexistsatpostdata
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send({ status: 'failed', message: 'Error from server' })
      })

    if (timeExists === false) {
      await db
        .func(
          'addtimetotimestable',
          [req.body.startOfBooking, req.body.endOfBooking, req.body.reserved],
          queryResult.one
        )
        .then((row) => {
          res.status(200).send({
            status: 'success',
            message: `new time with ID: ${row.addtimetotimestable} has been added successfully`,
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
        message: 'a time with this title does exists',
      })
    }
  } else {
    res.status(400).send({
      status: 'failed',
      message: `Your data does'nt have ${emptyFields} ${string}`,
    })
  }
})

timesRoutes.delete('/', async (req, res) => {
  if (req.body.id) {
    const timeExist = checkTimeExist(req.body.id)
    if (timeExist) {
      await db
        .func('deletetime', [req.body.id])
        .then(() => {
          res.status(200).send({
            status: 'success',
            message: `Time with ID: ${req.body.id} has been deleted successfully`,
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
        message: `Time with ID: ${req.body.id} Not found!`,
      })
    }
  } else {
    res.status(400).send({
      status: 'failed',
      message: `Your data does'nt have the id field!`,
    })
  }
})

module.exports = timesRoutes
