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
  // const jsonData = fs.readFile(dataPath, 'utf-8', (err, data) => {
  //   const page = req.query.page
  //   const limit = req.query.limit
  //   const startIndex = (page - 1) * limit
  //   const endIndex = page * limit
  //   const parsedData = JSON.parse(data)
  //   const users = parsedData.users
  //   const result = users.slice(startIndex, endIndex)
  //   return result
  // })
  const jsonData = fs.readFileSync(dataPath)
  return JSON.parse(jsonData)
}

accountRoutes.get('/', (req, res) => {
  try {
    const existAccounts = getAccountData()

    const page = req.query.page
    const limit = req.query.limit
    if (!page) {
      page = 1
    }
    if (!limit) {
      limit = 5
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
    existAccounts.users.push({ id: newId, ...req.body })
    saveAccountData(existAccounts)
    res
      .status(200)
      .send(`new account with id:${newId} has been added successfully`)
  } catch (error) {
    res.status(500).send('Server Error!')
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
      res.status(200).send(`new user with id:${req.params.id} has been updated`)
    } else {
      res.status(404).send(`User with ID: ${userId} Not found!`)
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
      res.status(200).send(`new user with id:${req.params.id} has been deleted`)
    } else {
      res.status(404).send(`User with ID: ${userId} Not found!`)
    }
  } catch (error) {
    res.status(500).send('Server Error!')
  }
})

module.exports = accountRoutes
