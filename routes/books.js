const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
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
  res.send('All Books')
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
    // res.redirect(`books/${newBook.id}`)
    res.redirect('books')
  } catch (error) {
    renderNewPage(res, book, true)
  }
})
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