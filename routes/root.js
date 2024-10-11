const express = require('express')
const router = express.Router()
const passport = require('passport')

// router.get('/', (req, res) => {
//   res.render('index')
// })

router.get('/register', (req, res) => {
  return res.render('register')
})
router.get('/login', (req, res) => {
  return res.render('login')
})

module.exports = router