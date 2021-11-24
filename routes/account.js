const express = require('express')
const accountRoutes = express.Router()
const fs = require('fs')

const dataPath = './details/account.json'

const saveAccountData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync(dataPath, stringifyData)
}

const getAccountData = () => {
  const jsonData = fs.readFileSync(dataPath)
  return JSON.parse(jsonData)
}

accountRoutes.post('/addaccount', (req, res) => {
  const existAccounts = getAccountData()
  const newId = Math.floor(1000 + Math.random() * 9000)
  existAccounts[newId] = req.body
  saveAccountData(existAccounts)
  res.send(`new account with id:${newId} has been added successfully`)
})

accountRoutes.get('/userslist', (req, res) => {
  const existAccounts = getAccountData()
  res.send(existAccounts)
})

accountRoutes.put('/update/:id', (req, res) => {
  const existAccounts = getAccountData()
  const userId = req.params['id']
  existAccounts[userId] = req.body
  saveAccountData(existAccounts)
  res.send(`new user with id:${req.params.id} has been updated`)
})

accountRoutes.delete('/delete/:id', (req, res) => {
  const existAccounts = getAccountData()
  const userId = req.params['id']
  delete existAccounts[userId]
  saveAccountData(existAccounts)
  res.send(`new user with id:${req.params.id} has been deleted`)
})

module.exports = accountRoutes
