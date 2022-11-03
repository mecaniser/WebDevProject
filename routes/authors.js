const express = require('express')
const router = express.Router()
const Author = require('../model/author')

//All authors route
router.get('/', (req, res) => {
  res.render('authors/index')
})
//New authors route
router.get('/new', (req, res) => {
  res.render('authors/new', {
    author: new Author()
  })
})
//Create authors route
router.post('/', (req, res) => {
  res.send(req.body.name)
})

module.exports = router