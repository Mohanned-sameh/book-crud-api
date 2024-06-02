const db = require('../db/connect');
const multer = require('multer');
const path = require('path');

// Get all books from the database
exports.getBooks = (req, res) => {
  const { search = '', limit = 10, offset = 0 } = req.query;

  let sql = 'SELECT * FROM books';
  let params = [];

  if (search.trim() !== '') {
    sql += ' WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?';
    params = Array(3).fill(`%${search}%`);
  }

  sql += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) res.status(500).send(err.message);
    res.json(rows);
  });
};

// Add a new book to the database
exports.addBook = (req, res) => {
  const { title, author, genre, publicationYear, bookCover } = req.body;

  if (!title || !author || !genre || !publicationYear || !bookCover)
    res.status(400).send('Missing required fields');

  const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      );
    },
  });

  const upload = multer({
    storage: storage,
  }).single('bookCover');

  upload(req, res, (err) => {
    if (err) res.status(500).send(err.message);
  });

  db.run(
    'INSERT INTO books (title, author, genre, publicationYear, bookCover) VALUES (?, ?, ?, ?, ?)',
    [title, author, genre, publicationYear, bookCover],
    (err) => {
      if (err) res.status(500).send(err.message);
    }
  );
  res.send('Book added');
};

// Get a specific book from the database
exports.getBook = (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) res.status(400).send('Invalid ID');

  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    if (err) res.status(500).send(err.message);
    res.json(row);
  });
};

// Update a specific book in the database
exports.updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, genre, publicationYear, bookCover } = req.body;

  if (isNaN(id)) res.status(400).send('Invalid ID');

  const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      );
    },
  });

  const upload = multer({
    storage: storage,
  }).single('bookCover');

  db.run(
    'UPDATE books SET title = ?, author = ?, genre = ?, publicationYear = ?, bookCover = ? WHERE id = ?',
    [title, author, genre, publicationYear, bookCover, id],
    (err) => {
      if (err) res.status(500).send(err.message);
    }
  );
  res.send('Book updated');
};

// Delete a specific book from the database
exports.deleteBook = (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) res.status(400).send('Invalid ID');

  db.run('DELETE FROM books WHERE id = ?', [id], (err) => {
    if (err) res.status(500).send(err.message);
  });
  res.send('Book deleted');
};
