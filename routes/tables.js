const express = require('express')
const { queryResult } = require('pg-promise')
const tablesRoutes = express.Router()
const db = require('../db/')

//Functions
const checkEmptyFields = async (req) => {
  let fields = []
  req.method === 'PUT'
    ? (fields = ['id', 'title', 'people'])
    : (fields = ['title', 'people'])

  let emptyFields = []

  fields.map((item) => {
    if (item in req.body === false) {
      emptyFields.push(item)
    }
  })
  string = emptyFields.length > 1 ? 'fields' : 'field'

  return { emptyFields, string }
}

const checkTableExist = async (id) => {
  let table = null

  await db
    .func('findtablewithidintablestable', [id], queryResult.one)
    .then((rows) => {
      table = rows
    })
    .catch((error) => {
      console.log(error)
    })

  return table
}

//Routes
tablesRoutes.get('/', async (req, res) => {
  let page = 1
  let limit = 5
  if (req.query.page !== undefined && req.query.limit !== undefined) {
    page = req.query.page
    limit = req.query.limit
  }

  await db
    .func('gettableslist', [page, limit])
    .then((rows) => {
      let total = 0
      let contentOfTables = null
      rows.length !== 0 ? (total = rows[0].totalrecords) : (total = 0)
      rows.length !== 0
        ? (contentOfTables = rows)
        : (contentOfTables = 'There is no table anymore!')
      rows.map((item) => delete item.totalrecords)
      res.status(200).send({
        pageIndex: page,
        totalRecords: total,
        tables: contentOfTables,
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: 'failed', message: 'Error from server' })
    })
})

tablesRoutes.get('/:id', async (req, res) => {
  const tableExist = await checkTableExist(req.params.id)
  if (tableExist) {
    res.status(200).send({
      status: 'success',
      message: 'Table founded!',
      table: tableExist,
    })
  } else {
    res.status(404).send({
      status: 'failed',
      message: `Table with ID: ${req.params.id} not found!`,
    })
  }
})

tablesRoutes.post('/', async (req, res) => {
  const { emptyFields, string } = await checkEmptyFields(req)
  let tableExists = false

  if (emptyFields.length === 0) {
    await db
      .func('checktableexistsatpostdata', [req.body.title], queryResult.one)
      .then((row) => {
        tableExists = row.checktableexistsatpostdata
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send({ status: 'failed', message: 'Error from server' })
      })

    if (tableExists === false) {
      await db
        .func(
          'addtabletotablestable',
          [req.body.title, req.body.people],
          queryResult.one
        )
        .then((row) => {
          res.status(200).send({
            status: 'success',
            message: `new table with ID: ${row.addtabletotablestable} has been added successfully`,
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
        message: 'a table with this title does exists',
      })
    }
  } else {
    res.status(400).send({
      status: 'failed',
      message: `Your data does'nt have ${emptyFields} ${string}`,
    })
  }
})

tablesRoutes.put('/', async (req, res) => {
  // let param = []
  // Object.keys(req.body).map((item) => {
  //   param.push(item)
  // })

  const { emptyFields, string } = await checkEmptyFields(req)
  const checkTableId = emptyFields.find((item) => item === 'id')

  if (checkTableId) {
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
      const tableExist = await checkTableExist(req.body.id)
      if (tableExist) {
        await db
          .func('updatetable', [req.body.id, req.body.title, req.body.people])
          .then(() => {
            res.status(200).send({
              status: 'success',
              message: `Table with ID: ${req.body.id} has been updated successfully`,
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
          message: `Table with ID: ${req.body.id} Not found!`,
        })
      }
    }
  }
})

tablesRoutes.delete('/', async (req, res) => {
  if (req.body.id) {
    const tableExist = checkTableExist(req.body.id)
    if (tableExist) {
      await db
        .func('deletetable', [req.body.id])
        .then(() => {
          res.status(200).send({
            status: 'success',
            message: `Table with ID: ${req.body.id} has been deleted successfully`,
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
        message: `Table with ID: ${req.body.id} Not found!`,
      })
    }
  } else {
    res.status(400).send({
      status: 'failed',
      message: `Your data does'nt have the id field!`,
    })
  }
})

module.exports = tablesRoutes
