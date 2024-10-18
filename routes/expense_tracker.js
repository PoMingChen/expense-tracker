const express = require('express')
const router = express.Router()
const db = require('../models')
const { literal } = require('sequelize');  // Import literal here
const recordList = db.Record

// Retrieve all spending records for the user from the database to show at index.hbs
router.get('/', (req, res, next) => {
  let matchedCategoryId = req.query.categoryId;
  const userId = req.user.id;

  if (!matchedCategoryId) {
    matchedCategoryId = null;  // If no category is selected or categoryId is an empty string, set it to null
  } else {
    matchedCategoryId = parseInt(matchedCategoryId, 10); // Convert categoryId to integer if it's present
  }

  // Build the base where-condition (only by userId)
  let whereCondition = { userId };

  // If the user has selected a category, add the category condition
  if (matchedCategoryId) {
    whereCondition.categoryId = matchedCategoryId;
  }

  recordList.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: whereCondition, // Use the dynamically generated where-condition
    raw: true
  })
    .then((records) => {

      // Calculate total amount from the fetched records
      const totalAmount = records.reduce((sum, record) => sum + Number(record.amount), 0);

      // Render the index.hbs file and pass records and totalAmount
      res.render('index', {
        records,
        matchedCategoryId,
        totalAmount
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

// Create a new spending record in the database
router.post('/', (req, res, next) => {
  const { name, date, category, amount } = req.body;
  const userId = req.user.id

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
  const id = req.params.id // The req.params.id is used to access the id parameter within the route handler.
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

      // If the userId associated with this spending record doesn't match the current logged-in user's userId (req.user.id), show an unauthorized error message
      if (record.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/expense_tracker')
      }

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

      //Make sure to use record, not recordList, as this is an instance method.
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

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

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

      return record.destroy()// No need to write { where: { id } } since we already fetched it using findByPk earlier.
        .then(() => {
          req.flash('success', '刪除成功!')
          return res.redirect('/expense_tracker')
        })
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
})

module.exports = router