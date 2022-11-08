const express = require('express')
const router = express.Router()
const Books = require('../model/book')

router.get('/', async (req, res) => {
  let books
  try {
    books = await Books.find().sort({createdAt: 'desc'}).limit(3).exec()
    res.render('index', { books })
  } catch (error) {
    books = []
  }
})

module.exports = router