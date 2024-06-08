const db = require('../db/connect');
const multer = require('multer');
const path = require('path');
const Redis = require('ioredis');
const redisClient = new Redis();

// Get all books from the database
exports.getBooks = async (req, res) => {
  try {
    const { search = '', limit = 10, offset = 0 } = req.query;

    let sql = 'SELECT * FROM books';
    let params = [];

    if (search.trim() !== '') {
      sql += ' WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const cacheKey = req.originalUrl || req.url;
    const cacheData = await redisClient.get(cacheKey);

    if (cacheData) {
      return res.json(JSON.parse(cacheData));
    }

    db.all(sql, params, (err, rows) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      redisClient.set(cacheKey, JSON.stringify(rows), 'EX', 3600); // Cache for 1 hour
      res.json(rows);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Add a new book to the database
exports.addBook = (req, res) => {
  try {
    const { title, author, genre, publicationYear, bookCover } = req.body;

    if (!title || !author || !genre || !publicationYear || !bookCover) {
      return res.status(400).send('Missing required fields');
    }

    db.run(
      'INSERT INTO books (title, author, genre, publicationYear) VALUES (?, ?, ?, ?)',
      [title, author, genre, publicationYear],
      (err) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        redisClient.del('/books');
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

    if (isNaN(id)) {
      return res.status(400).send('Invalid ID');
    }

    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json(row);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a specific book in the database
exports.updateBook = (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, publicationYear } = req.body;

    if (isNaN(id)) {
      return res.status(400).send('Invalid ID');
    }

    db.run(
      'UPDATE books SET title = ?, author = ?, genre = ?, publicationYear = ? WHERE id = ?',
      [title, author, genre, publicationYear, id],
      (err) => {
        if (err) {
          return res.status(500).send(err.message);
        }
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

    if (isNaN(id)) {
      return res.status(400).send('Invalid ID');
    }

    db.run('DELETE FROM books WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      redisClient.del(`/books/${id}`);
      res.send('Book deleted');
    });
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
    if (err) {
      return res.status(400).send(err);
    }
    res.send(`uploads/${req.file.filename}`);
  });
};

// Search for a book in the database
exports.searchBook = (req, res) => {
  try {
    const { search = '' } = req.query;

    if (search.trim() === '') {
      return res.status(400).send('Invalid search query');
    }

    db.all(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?',
      [`%${search}%`, `%${search}%`, `%${search}%`],
      (err, rows) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        res.json(rows);
      }
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};
