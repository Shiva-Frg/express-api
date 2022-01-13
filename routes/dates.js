const express = require('express')
const { queryResult } = require('pg-promise')
const datesRoutes = express.Router()
const db = require('../db/')

//Functions
const checkEmptyFields = async (req) => {
  let fields = []
  req.method === 'PUT' ? (fields = ['id', 'date']) : (fields = ['date'])

  let emptyFields = []

  fields.map((item) => {
    if (item in req.body === false) {
      emptyFields.push(item)
    }
  })
  string = emptyFields.length > 1 ? 'fields' : 'field'

  return { emptyFields, string }
}

const checkDateExist = async (id) => {
  let date = null

  await db
    .func('finddatewithidindatestable', [id], queryResult.one)
    .then((rows) => {
      date = rows
    })
    .catch((error) => {
      console.log(error)
    })

  return date
}

//Routes
datesRoutes.get('/', async (req, res) => {
  let page = 1
  let limit = 5
  if (req.query.page !== undefined && req.query.limit !== undefined) {
    page = req.query.page
    limit = req.query.limit
  }

  await db
    .func('getdateslist', [page, limit])
    .then((rows) => {
      let total = 0
      let contentOfDates = null
      rows.length !== 0 ? (total = rows[0].totalrecords) : (total = 0)
      rows.length !== 0
        ? (contentOfDates = rows)
        : (contentOfDates = 'There is no date anymore!')
      rows.map((item) => delete item.totalrecords)
      res.status(200).send({
        pageIndex: page,
        totalRecords: total,
        dates: contentOfDates,
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: 'failed', message: 'Error from server' })
    })
})

datesRoutes.get('/:id', async (req, res) => {
  const dateExist = await checkDateExist(req.params.id)
  if (dateExist) {
    res.status(200).send({
      status: 'success',
      message: 'Date founded!',
      date: dateExist,
    })
  } else {
    res.status(404).send({
      status: 'failed',
      message: `Date with ID: ${req.params.id} not found!`,
    })
  }
})

datesRoutes.post('/', async (req, res) => {
  const { emptyFields, string } = await checkEmptyFields(req)
  let dateExists = false

  if (emptyFields.length === 0) {
    await db
      .func('checkdateexistsatpostdata', [req.body.date], queryResult.one)
      .then((row) => {
        dateExists = row.checkdateexistsatpostdata
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send({ status: 'failed', message: 'Error from server' })
      })

    if (dateExists === false) {
      await db
        .func('adddatetodates', [req.body.date], queryResult.one)
        .then((row) => {
          res.status(200).send({
            status: 'success',
            message: `new date with ID: ${row.adddatetodates} has been added successfully`,
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
        message: 'a date with this title does exists',
      })
    }
  } else {
    res.status(400).send({
      status: 'failed',
      message: `Your data does'nt have ${emptyFields} ${string}`,
    })
  }
})

datesRoutes.put('/', async (req, res) => {
  // let param = []
  // Object.keys(req.body).map((item) => {
  //   param.push(item)
  // })

  const { emptyFields, string } = await checkEmptyFields(req)
  const checkDateId = emptyFields.find((item) => item === 'id')

  if (checkDateId) {
    res.status(400).send({
      status: 'failed',
      message: `Your data does'nt have the id field!`,
    })
  } else {
    if (emptyFields.length !== 0) {
      res.status(400).send({
        status: 'failed',
        message: `Your data does'nt have ${emptyFields} ${string}`,
      })
    } else {
      const dateExist = await checkDateExist(req.body.id)
      if (dateExist) {
        await db
          .func('updatedate', [req.body.id, req.body.date])
          .then(() => {
            res.status(200).send({
              status: 'success',
              message: `Date with ID: ${req.body.id} has been updated successfully`,
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
          message: `Date with ID: ${req.body.id} Not found!`,
        })
      }
    }
  }
})

datesRoutes.delete('/', async (req, res) => {
  if (req.body.id) {
    const dateExist = checkDateExist(req.body.id)
    if (dateExist) {
      await db
        .func('deletedate', [req.body.id])
        .then(() => {
          res.status(200).send({
            status: 'success',
            message: `Date with ID: ${req.body.id} has been deleted successfully`,
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
        message: `Date with ID: ${req.body.id} Not found!`,
      })
    }
  } else {
    res.status(400).send({
      status: 'failed',
      message: `Your data does'nt have the id field!`,
    })
  }
})

module.exports = datesRoutes
