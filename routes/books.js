const express = require('express');
const {
  getBooks,
  addBook,
  getBook,
  updateBook,
  deleteBook,
  uploadBookCover,
} = require('../controller/bookController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, (req, res) => {
  getBooks(req, res);
});

router.post('/', auth, (req, res) => {
  addBook(req, res);
});

router.get('/:id', auth, (req, res) => {
  getBook(req, res);
});

router.put('/:id', auth, (req, res) => {
  updateBook(req, res);
});

router.delete('/:id', auth, (req, res) => {
  deleteBook(req, res);
});

router.post('/upload', auth, (req, res) => {
  uploadBookCover(req, res);
});

router.get('/search', auth, (req, res) => {
  searchBook(req, res);
});

module.exports = router;
