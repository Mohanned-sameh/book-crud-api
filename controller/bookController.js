const db = require('../db/connect');
const multer = require('multer');
const path = require('path');

// Get all books from the database
exports.getBooks = (req, res) => {
  const { search = '', limit = 10, offset = 0 } = req.query;

  let sql = 'SELECT * FROM books';
  let params = [];

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

  db.run(
    'INSERT INTO books (title, author, genre, publicationYear) VALUES (?, ?, ?, ?)',
    [title, author, genre, publicationYear],
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
  const { title, author, genre, publicationYear } = req.body;

  if (isNaN(id)) res.status(400).send('Invalid ID');

  db.run(
    'UPDATE books SET title = ?, author = ?, genre = ?, publicationYear = ? WHERE id = ?',
    [title, author, genre, publicationYear, id],
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

// Upload a book cover
exports.uploadBookCover = (req, res) => {
  const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) return cb(null, true);
      cb('Error: Images only types jpeg, jpg, png, gif!');
    },
  }).single('bookCover');

  upload(req, res, (err) => {
    if (err) res.status(400).send(err);
    res.send(`uploads/${req.file.filename}`);
  });
};

// Search for a book in the database
exports.searchBook = (req, res) => {
  const { search = '' } = req.query;

  if (search.trim() === '') res.status(400).send('Invalid search query');

  db.all(
    'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?',
    [`%${search}%`, `%${search}%`, `%${search}%`],
    (err, rows) => {
      if (err) res.status(500).send(err.message);
      res.json(rows);
    }
  );
};
