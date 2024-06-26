const db = require('../db/connect');
const multer = require('multer');
const path = require('path');
const Redis = require('ioredis');
const redisClient = new Redis();

// Get all books from the database
exports.getBooks = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const cacheData = await redisClient.get(
      `/books?limit=${limit}&offset=${offset}`
    );

    if (
      cacheData ==
      db.all(
        `SELECT * FROM books WHERE user_id = ${req.userId} LIMIT ${limit} OFFSET ${offset}`
      )
    ) {
      return res.json(JSON.parse(cacheData));
    }

    db.all(
      `SELECT * FROM books WHERE user_id = ${req.userId} LIMIT ${limit} OFFSET ${offset}`,
      [req.userId, limit, offset],
      (err, rows) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        redisClient.set(cacheKey, JSON.stringify(rows));
        res.json(rows);
      }
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addBook = (req, res) => {
  try {
    const { title, author, genre } = req.body;

    db.run(
      'INSERT INTO books (title, author, genre_id, user_id) VALUES (?, ?, ?, ?)',
      [title, author, genre, req.userId],
      (err) => {
        if (err) return res.status(500).send(err.message);
        redisClient.delete(cacheKey);
        res.send('Book added');
      }
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get a specific book from the database
exports.getBook = (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) return res.status(400).send('Invalid ID');

    db.get(
      'SELECT * FROM books WHERE id = ? AND user_id = ?',
      [id, req.userId],
      (err, row) => {
        if (err) return res.status(500).send(err.message);
        if (!row) return res.status(404).send('Book not found');

        res.json(row);
      }
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a specific book in the database
exports.updateBook = (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre } = req.body;

    if (isNaN(id)) return res.status(400).send('Invalid ID');

    db.run(
      'UPDATE books SET title = ?, author = ?, genre_id = ?, WHERE id = ? AND user_id = ?',
      [title, author, genre, id, req.userId],
      (err) => {
        if (err) return res.status(500).send(err.message);
        redisClient.del(`/books/${id}`);
        res.send('Book updated');
      }
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a specific book from the database
exports.deleteBook = (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) return res.status(400).send('Invalid ID');

    db.run(
      'DELETE FROM books WHERE id = ? AND user_id = ?',
      [id, req.userId],
      (err) => {
        if (err) return res.status(500).send(err.message);

        redisClient.del(`/books/${id}`);
        res.send('Book deleted');
      }
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
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
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) return cb(null, true);
      cb('Error: Images only!');
    },
  }).single('bookCover');

  upload(req, res, (err) => {
    if (err) return res.status(400).send(err.message);
    res.send(
      `/${req.file.path.replace(/\\/g, '/').replace('public', 'uploads')}`
    );
  });
};

// Search for a book in the database
exports.searchBook = async (req, res) => {
  const { search = '' } = req.query;

  const cacheData = await redisClient.get(`/books/search?search=${search}`);

  if (cacheData) return res.json(JSON.parse(cacheData));

  db.all(
    `SELECT * FROM books WHERE title LIKE '%${search}%' AND user_id = ${req.userId}`,
    (err, rows) => {
      if (err) return res.status(500).send(err.message);
      redisClient.set(cacheKey, JSON.stringify(rows));
      res.json(rows);
    }
  );
};
