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
    "CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY,title TEXT,author TEXT,genre TEXT,publicationYear INTEGER,bookCover TEXT DEFAULT 'https://via.placeholder.com/150',userId INTEGER,FOREIGN KEY(userId) REFERENCES users(id))",
    (err) => {
      if (err) console.error('Error creating table:', err.message);
      else console.log('Books table ready.');
    }
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)',
    (err) => {
      if (err) console.error('Error creating table:', err.message);
      else console.log('Users table ready.');
    }
  );
});

// Export the database connection
module.exports = db;
