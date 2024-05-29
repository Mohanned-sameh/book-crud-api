const express = require('express').Router();
const db = require('../db/connect');

express.get('/', (req, res) => {
  // Get all books from the database
  const { search = '', limit = 10, offset = 0 } = req.query;

  // Set the initial query and parameters
  let sql = 'SELECT * FROM books';
  let params = [];

  // If a search query is provided, filter the results
  if (search.trim() !== '') {
    sql += ' WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?';
    params = Array(3).fill(`%${search}%`);
  }

  // Add a limit and offset to the query
  sql += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  // Execute the query
  db.all(sql, params, (err, rows) => {
    if (err) res.status(500).send(err.message);
    res.json(rows);
  });
});

express.post('/', (req, res) => {
  // Add a new book to the database
  const { title, author, genre, publicationYear } = req.body;

  // Check if the required fields are provided
  if (!title || !author || !genre || !publicationYear)
    res.status(400).send('Missing required fields');

  // Insert the book into the database
  db.run(
    'INSERT INTO books (title, author, genre, publicationYear) VALUES (?, ?, ?, ?)',
    [title, author, genre, publicationYear],
    (err) => {
      if (err) res.status(500).send(err.message);
    }
  );
  res.send('Book added');
});

express.get('/:id', (req, res) => {
  // Get a specific book from the database
  const { id } = req.params;

  // Check if the ID is a number
  if (isNaN(id)) res.status(400).send('Invalid ID');

  // Get the book from the database
  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    if (err) res.status(500).send(err.message);
    res.json(row);
  });
});

express.put('/:id', (req, res) => {
  // Update a specific book in the database
  const { id } = req.params;

  // Check if the ID is a number
  const { title, author, genre, publicationYear } = req.body;

  // Check if any fields were provided
  if (!title && !author && !genre && !publicationYear)
    res.status(400).send('No valid fields to update');

  if (title) db.run('UPDATE books SET title = ? WHERE id = ?', [title, id]);
  if (author) db.run('UPDATE books SET author = ? WHERE id = ?', [author, id]);
  if (genre) db.run('UPDATE books SET genre = ? WHERE id = ?', [genre, id]);
  if (publicationYear)
    db.run('UPDATE books SET publicationYear = ? WHERE id = ?', [
      publicationYear,
      id,
    ]);

  res.send('Book updated');
});

express.delete('/:id', (req, res) => {
  // Delete a specific book from the database
  const { id } = req.params;

  // Check if the ID is a number
  if (isNaN(id)) res.status(400).send('Invalid ID');

  // Delete the book from the database
  db.run('DELETE FROM books WHERE id = ?', [id], (err) => {
    if (err) res.status(500).send(err.message);
  });
  res.send('Book deleted');
});

// Export the express router
module.exports = express;
