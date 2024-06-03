const express = require('express').Router();
const {
  getBooks,
  addBook,
  getBook,
  updateBook,
  deleteBook,
  uploadBookCover,
} = require('../controller/bookController');

express.get('/', (req, res) => {
  // get all books from the database
  getBooks(req, res);
});

express.post('/upload', (req, res) => {
  // Upload a book cover
  uploadBookCover(req, res);
});

express.post('/', (req, res) => {
  // Add a new book to the database
  addBook(req, res);
});

express.get('/:id', (req, res) => {
  // Get a specific book from the database
  getBook(req, res);
});

express.put('/:id', (req, res) => {
  // Update a specific book in the database
  updateBook(req, res);
});

express.delete('/:id', (req, res) => {
  // Delete a specific book from the database
  deleteBook(req, res);
});

// Export the express router
module.exports = express;
