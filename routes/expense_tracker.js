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

      // Calculate total amount from the fetched records
      const totalAmount = records.reduce((sum, record) => sum + Number(record.amount), 0);

      // Render the index.hbs file and pass records and totalAmount
      res.render('index', {
        records,
        matchedCategoryId,
        totalAmount // Pass the total amount to the view
      });
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

// Fetch specific record by ID and check access permissions
router.get('/:id/edit', (req, res, next) => {
  // The req.params.id is used to access the id parameter within the route handler.
  const id = req.params.id
  const userId = req.user.id // Store the user.id from the deserialized req.user

  recordList.findByPk(id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw: true
  })
    .then((record) => {
      if (!record) {
        req.flash('error', '找不到資料')
        return res.redirect('/expense_tracker')
      }

      // If the userId associated with this restaurant doesn't match the current logged-in user's userId (req.user.id), show an unauthorized error message
      if (record.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/expense_tracker')
      }
      console.log(record.date); // Log the date to check its value
      console.log(record.categoryId);
      res.render('edit', { record })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.post('/:id/edit', (req, res, next) => {
  const id = req.params.id
  const updateData = req.body // Contains all the updated fields
  const userId = req.user.id // Store the user.id from the deserialized req.user

  return recordList.findByPk(id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
    .then((record) => {
      if (!record) {
        req.flash('error', '找不到資料')
        return res.redirect('/expense_tracker')
      }
      if (record.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/expense_tracker')
      }

      //Make sure to use restaurant, not restaurantList, as this is an instance method.
      return record.update(updateData)  // No need to write { where: { id } } since we already fetched it using findByPk earlier.
        .then(() => {
          req.flash('success', '更新成功!')
          return res.redirect(`/expense_tracker`)
        })
    })
    .catch((error) => {
      error.errorMessage = '更新失敗:('
      next(error)
    })

})


module.exports = router