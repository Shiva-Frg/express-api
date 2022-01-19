const express = require('express')
const { queryResult } = require('pg-promise')
const timesRoutes = express.Router()
const db = require('../db/')

//Functions
const validateFields = async (req) => {
  let fields = ['startOfBooking', 'endOfBooking', 'reserved']

  let emptyFields = []
  let wrongFields = []
  let string = ``
  let msg = ``

  fields.map((item) => {
    if (item in req.body === false) {
      emptyFields.push(item)
    } else {
      if (
        (item === 'startOfBooking' || item === 'endOfBooking') &&
        (req.body[item].length > 5 || req.body[item].length < 5)
      ) {
        wrongFields.push(`${item} must be have 5 character like 15:05`)
      } else if (
        item === 'reserved' &&
        req.body[item] !== 'ready' &&
        req.body[item] !== 'reserved'
      ) {
        wrongFields.push(`${item} must be (ready) or (reserved)`)
      }
    }
  })

  string = emptyFields.length > 1 ? 'fields' : 'field'

  if (emptyFields.length > 0 && wrongFields.length > 0) {
    msg = `Your data does'nt have ${emptyFields} ${string} and ${wrongFields}`
  } else if (emptyFields.length > 0 && wrongFields.length === 0) {
    msg = `Your data does'nt have ${emptyFields} ${string}`
  } else if (emptyFields.length === 0 && wrongFields.length > 0) {
    msg = `${wrongFields}`
  }

  return { msg }
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
  const { msg } = await validateFields(req)
  let timeExists = false

  if (msg === ``) {
    req.body.reserved
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
      message: `${msg}`,
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
