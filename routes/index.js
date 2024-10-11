const express = require('express')
const router = express.Router()

const root = require('./root.js')
const users = require('./users.js')

router.use('/', root) // makes all root routes accessible at the base level
router.use('/users', users)

module.exports = router