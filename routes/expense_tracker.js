const express = require('express')
const router = express.Router()

const expense_tracker = require('./expense_tracker')

router.use('/expense_tracker', expense_tracker)

router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router