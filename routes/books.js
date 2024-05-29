// This file contains the routes for the books endpoint
const express = require('express').Router();
const db = require('../db/connect');

const pagination = (req, res, next) => {
  const { limit = 10, offset = 0 } = req.query;
  req.limit = parseInt(limit);
  req.offset = parseInt(offset);
  next();
};

// Define the routes for the books endpoint here
express.get('/', pagination, (req, res) => {
  const { limit, offset } = req;
  // Get paginated books from the database
  db.all(
    'SELECT * FROM books LIMIT ? OFFSET ?',
    [limit, offset],
    (err, rows) => {
      if (err) res.status(500).send(err.message);

      res.json(rows);
    }
  );
});

express.post('/', (req, res) => {
  // Add a new book to the database
  const { title, author, genre, publicationYear } = req.body;

  if (!title || !author || !genre || !publicationYear)
    res.status(400).send('Missing required fields');

  db.run(
    'INSERT INTO books (title, author, genre, publicationYear) VALUES (?, ?, ?, ?)',
    [title, author, genre, publicationYear],
    (err) => {
      if (err) res.status(500).send(err.message);

      res.status(201).send('Book added to database');
    }
  );
});

express.get('/:id', (req, res) => {
  // Get a specific book from the database
  const { id } = req.params;

  if (isNaN(id)) res.status(400).send('Invalid ID');

  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    if (err) res.status(500).send(err.message);
    res.json(row);
  });
});

express.put('/:id', (req, res) => {
  // Update a specific book in the database
  const { id } = req.params;
  const { title, author, genre, publicationYear } = req.body;

  if (title) db.run('UPDATE books SET title = ? WHERE id = ?', [title, id]);
  if (author) db.run('UPDATE books SET author = ? WHERE id = ?', [author, id]);
  if (genre) db.run('UPDATE books SET genre = ? WHERE id = ?', [genre, id]);
  if (publicationYear)
    db.run('UPDATE books SET publicationYear = ? WHERE id = ?', [
      publicationYear,
      id,
    ]);
  if (!title && !author && !genre && !publicationYear)
    res.status(400).send('No valid fields to update');

  res.send('Book updated');
});

express.delete('/:id', (req, res) => {
  // Delete a specific book from the database
  const { id } = req.params;

  if (isNaN(id)) res.status(400).send('Invalid ID');

  db.run('DELETE FROM books WHERE id = ?', [id], (err) => {
    if (err) res.status(500).send(err.message);

    res.send('Book deleted');
  });
});

// Export the express router
module.exports = express;
