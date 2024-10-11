const express = require('express')
const router = express.Router()


// don't load the file itself
// const expense_tracker = require('./expense_tracker.js')
// router.use('/expense_tracker', expense_tracker)

router.get('/', (req, res) => {
  res.render('index') // renders the index.hbs file
})

module.exports = router