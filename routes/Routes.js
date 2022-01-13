const express = require('express')
const router = express.Router()

const accountRoutes = require('./accounts.js')
const tablesRoutes = require('./tables.js')
const datesRoutes = require('./dates.js')

router.use('/accounts', accountRoutes)
router.use('/tables', tablesRoutes)
router.use('/dates', datesRoutes)

module.exports = router
