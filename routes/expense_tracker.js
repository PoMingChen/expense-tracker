const express = require('express')
const router = express.Router()
const db = require('../models')
const { literal } = require('sequelize');  // Import literal here
const record = db.Record



// don't load the file itself
// const expense_tracker = require('./expense_tracker.js')
// router.use('/expense_tracker', expense_tracker)

router.get('/', (req, res) => {
  res.render('index') // renders the index.hbs file
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res, next) => { // don't forget to next parameter
  // const formData = req.body
  const { name, date, category, amount } = req.body;
  const userId = req.user.id

  console.log(req.body)

  // Create a new record in the database using formData
  return record.create({
    name,
    date,
    amount,
    categoryId: category,
    userId
  })
    .then(() => {
      req.flash('success', '新增成功!')
      return res.redirect('/expense_tracker')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗:('
      next(error)
    })
})

module.exports = router