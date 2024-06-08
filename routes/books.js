const express = require('express');
const router = express.Router();
const {
  getBooks,
  addBook,
  getBook,
  updateBook,
  deleteBook,
  uploadBookCover,
  searchBook,
} = require('../controller/bookController');

router.get('/', getBooks);

router.post('/', addBook);

router.get('/:id', getBook);

router.put('/:id', updateBook);

router.delete('/:id', deleteBook);

router.post('/upload', uploadBookCover);

router.get('/search', searchBook);

module.exports = router;
