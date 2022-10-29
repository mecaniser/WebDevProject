const express = require('express')
const router = express.Router()
//All authors route
router.get('/', (req, res) => {
  res.render('authors/index')
})
//All authors route
router.get('/new', (req, res) => {
  res.render('authors/new')
})
//All authors route
router.post('/', (req, res) => {
  res.send('Create')
})

module.exports = router