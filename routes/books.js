const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../model/book')
const uploadPath = path.join('public', Book.coverImgBsePath)
const imageMimeTypes = ['images/jpeg', 'image/png', 'images/gif']
const Author = require('../model/author')
const upload = multer({
  dest: uploadPath, 
  fileFilter: ( req, file, cb) => {
    cb(null, imageMimeTypes.includes(file.mimetype))
  }
})

//All Books route
router.get('/', async (req, res) => {
  let query = Book.find()
  if ( req.query.title != null && req.query.tile != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if ( req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishedDate', req.query.publishedBefore)
  }
  if ( req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishedDate', req.query.publishedAfter)
  }
  try {
    const books = await query.exec()
    res.render('books/index', {
      books, 
      searchOptions: req.query
    })
  } catch (error) {
    res.redirect('/')
  }

})
//New Book route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})
//Create Book route
router.post('/',upload.single('cover'), async (req, res) => {
  const { body } = req
  const fileName =  req.file != null ? req.file.filename : null 
  const book = new Book({
    title: body.title,
    author: body.author,
    publishDate: new Date(body.publishDate), 
    pageCount: body.pageCount, 
    coverImageName: fileName, 
    description: body.description
  })
  try {
    const newBook = await book.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect('books')
  } catch (error) {
    book.coverImageName && removeBookCover(book.coverImageName)
    renderNewPage(res, book, true)
  }
})
function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    err && console.log(err);
  })
}
async function renderNewPage(res, book , hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors, 
      book
    }
    if(hasError) params.errorMessage = "Error creating new book"
    res.render('books/new', params )
  } catch (error) {
    res.redirect('/books')
  }
}

module.exports = router