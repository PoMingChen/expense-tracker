const express = require('express')
const router = express.Router()
const db = require('../models')
const { literal } = require('sequelize');  // Import literal here
const recordList = db.Record



// don't load the file itself
// const expense_tracker = require('./expense_tracker.js')
// router.use('/expense_tracker', expense_tracker)

// router.get('/', (req, res) => {
//   res.render('index') // renders the index.hbs file
// })

router.get('/', (req, res, next) => {
  const matchedCategoryId = req.query.categoryId;  // Retrieve the selected category from the query
  console.log(matchedCategoryId);
  const userId = req.user.id;

  // Build the base where condition (only by userId)
  let whereCondition = { userId };

  // If the user has selected a category, add the category condition
  if (matchedCategoryId) {
    whereCondition.categoryId = matchedCategoryId;
  }

  // Retrieve all restaurants for the user from the database
  recordList.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: whereCondition, // Use the dynamically generated where condition
    raw: true
  })
    .then((records) => {

      console.log(matchedCategoryId);
      res.render('index',
        {
          records,
          matchedCategoryId
        })  // Render the page with the matched restaurants
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:(' // Set error message
      next(error) // Pass to error handler middleware
    })
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
  return recordList.create({
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