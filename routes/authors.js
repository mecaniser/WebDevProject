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
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save()
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`)

  } catch (error) {
    res.render('authors/new', {
      author,
      errorMessage: 'Error creating new author'
    })
  }
})

module.exports = router