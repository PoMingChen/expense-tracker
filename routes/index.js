const express = require('express')
const router = express.Router()

const root = require('./root.js')
const users = require('./users.js')
const expense_tracker = require('./expense_tracker.js')
const authHandler = require('../middlewares/auth-handler.js')

router.use('/', root) // makes all root routes accessible at the base level
router.use('/expense_tracker', authHandler, expense_tracker)
router.use('/users', users)

module.exports = router