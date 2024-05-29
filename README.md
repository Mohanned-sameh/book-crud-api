# Book CRUD API

This project is a simple CRUD API for managing a collection of books. It provides endpoints for creating, reading, updating, and deleting books stored in a SQLite database.

## Installation

1. Clone the repository:
   `git clone git@github.com:Mohanned-sameh/book-crud-api.git`

2. Install dependencies:
   `npm install`

3. Start the server:
   `node app.js`

## Usage

### API Endpoints

#### GET /books

- Description: Retrieve all books from the database.
- Response: Returns a JSON array containing all books.

#### POST /books

- Description: Add a new book to the database.
- Request Body: JSON object containing book details (title, author, genre, publicationYear).
- Response: Returns a success message if the book is added successfully.

#### GET /books/:id

- Description: Retrieve a specific book from the database by ID.
- Request Parameter: `id` (Book ID)
- Response: Returns the book details in JSON format if found.

#### PUT /books/:id

- Description: Update a specific book in the database by ID.
- Request Parameter: `id` (Book ID)
- Request Body: JSON object containing fields to update (title, author, genre, publicationYear).
- Response: Returns a success message if the book is updated successfully.

#### DELETE /books/:id

- Description: Delete a specific book from the database by ID.
- Request Parameter: `id` (Book ID)
- Response: Returns a success message if the book is deleted successfully.

## Project Structure

- `app.js`: Main entry point for the application.
- `routes/books.js`: Contains routes for the books endpoint.
- `db/connect.js`: Connects to the SQLite database and creates a table if it doesn't exist.

## Dependencies

- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `body-parser`: Parse incoming request bodies in a middleware before handlers.
- `sqlite3`: Asynchronous, non-blocking SQLite3 bindings for Node.js.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.
