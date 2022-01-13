const express = require('express')
const router = express.Router()

const accountRoutes = require('./accounts.js')
const tablesRoutes = require('./tables.js')

router.use('/accounts', accountRoutes)
router.use('/tables', tablesRoutes)

module.exports = router
