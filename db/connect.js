// Purpose: Connect to the SQLite database and create a table if it doesn't exist.
const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./db/books.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to the books database.');
});

// Create a table if it doesn't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`,
    (err) => {
      if (err) console.error('Error creating users table:', err.message);
      else console.log('Users table ready.');
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      genre TEXT UNIQUE
    )`,
    (err) => {
      if (err) console.error('Error creating genres table:', err.message);
      else console.log('Genres table ready.');
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      genre_id INTEGER,
      user_id INTEGER,
      bookCover TEXT,
      FOREIGN KEY (genre_id) REFERENCES genres(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    (err) => {
      if (err) console.error('Error creating books table:', err.message);
      else console.log('Books table ready.');
    }
  );
});

// Export the database connection
module.exports = db;
