const express = require('express')
const router = express.Router()

const accountRoutes = require('./account.js')

router.use('/account', accountRoutes)

module.exports = router
