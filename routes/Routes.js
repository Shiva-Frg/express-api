const express = require('express')
const router = express.Router()

const usersRoutes = require('./users.js')
const tablesRoutes = require('./tables.js')
const datesRoutes = require('./dates.js')
const timesRoutes = require('./times.js')

router.use('/accounts', usersRoutes)
router.use('/tables', tablesRoutes)
router.use('/dates', datesRoutes)
router.use('/times', timesRoutes)

module.exports = router
