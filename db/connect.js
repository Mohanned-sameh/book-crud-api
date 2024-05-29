// Purpose: Connect to the SQLite database and create a table if it doesn't exist.
const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./db/books.db', (err) => {
  if (err) console.error(err.message);
});

// Create a table if it doesn't exist
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, genre TEXT, publicationYear INTEGER)'
  );
});

// Export the database connection
module.exports = db;
