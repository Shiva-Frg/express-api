const express = require('express')
const accountRoutes = express.Router()
const fs = require('fs')

const dataPath = './details/account.json'

const findeIndex = (data, id) => {
  const index = data.users.findIndex((item) => {
    return item.id === id
  })
  return index
}

const saveAccountData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync(dataPath, stringifyData)
}

const getAccountData = () => {
  const jsonData = fs.readFileSync(dataPath)
  return JSON.parse(jsonData)
}

accountRoutes.get('/', (req, res) => {
  try {
    const existAccounts = getAccountData()

    let page = 1
    let limit = 5
    if (req.query.page !== undefined && req.query.limit !== undefined) {
      page = req.query.page
      limit = req.query.limit
    }

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const users = existAccounts.users
    const result = users.slice(startIndex, endIndex)

    if (result.length !== 0) {
      res.send(result)
    } else {
      res.send('There is no user anymore!')
    }
  } catch (error) {
    res.status(500).send('Server Error!')
  }
})

accountRoutes.post('/', (req, res) => {
  try {
    const existAccounts = getAccountData()

    const newId = Math.floor(1000 + Math.random() * 9000)

    let user = null
    if (
      req.body.username !== undefined &&
      req.body.email !== undefined &&
      req.body.password !== undefined
    ) {
      user = {
        id: newId,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      }
      existAccounts.users.push(user)
      saveAccountData(existAccounts)
      res
        .status(200)
        .send(`new account with id:${newId} has been added successfully`)
    } else {
      res
        .status(400)
        .send(
          'There is not any data to add to the Database or your data do not have username or email or password'
        )
    }
  } catch (error) {
    res.status(500).send('Server Error!')
    console.log(error)
  }
})

accountRoutes.put('/:id', (req, res) => {
  try {
    let existAccounts = getAccountData()
    const userId = parseInt(req.params['id'])
    const userIndex = findeIndex(existAccounts, userId)
    if (userIndex) {
      existAccounts.users[userIndex] = { id: userId, ...req.body }
      saveAccountData(existAccounts)
      res.status(200).send(`Account with id:${req.params.id} has been updated`)
    } else {
      res.status(404).send(`Account with ID: ${userId} Not found!`)
    }
  } catch (error) {
    res.status(500).send('Server Error!')
  }
})

accountRoutes.delete('/:id', (req, res) => {
  try {
    let existAccounts = getAccountData()
    const userId = parseInt(req.params['id'])
    const userIndex = findeIndex(existAccounts, userId)
    if (userIndex) {
      existAccounts.users = existAccounts.users.filter((i) => i.id !== userId)
      saveAccountData(existAccounts)
      res.status(200).send(`Account with id:${req.params.id} has been deleted`)
    } else {
      res.status(404).send(`Account with ID: ${userId} Not found!`)
    }
  } catch (error) {
    res.status(500).send('Server Error!')
  }
})

module.exports = accountRoutes
