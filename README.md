# Book CRUD API

This project is a simple CRUD API for managing a collection of books. It provides endpoints for creating, reading, updating, and deleting books stored in a SQLite database. Each user can manage their own set of books, and Redis is used for caching to improve performance.

## Installation

1. Clone the repository:
   `git clone git@github.com:Mohanned-sameh/book-crud-api.git`
2. Install dependencies:
   `npm install`
3. Set up environment variables:
   Create a `.env` file in the root directory and define the `PORT` and `JWT_SECRET` variables.
   `PORT=3000`
   `JWT_SECRET="secret"`

## Usage

### API Endpoints

#### Authentication

##### POST /auth/register

- Description: Register a new user.
- Request Body: JSON object containing user details (username, password).
- Response: Returns a success message and the user's details.

##### POST /auth/login

- Description: Log in a user and get an authentication token.
- Request Body: JSON object containing user details (username, password).
- Response: Returns a JSON object containing the authentication token.

#### Books

##### GET /books

- Description: Retrieve all books for the authenticated user from the database.
- Query Parameters:
- `limit`: Maximum number of books to return per page (default: 10).
- `offset`: Number of books to skip (default: 0).
- Response: Returns a JSON array containing books.

##### POST /books

- Description: Add a new book for the authenticated user to the database.
- Request Body: JSON object containing book details (title, author, genre, publicationYear, bookCover).
- Response: Returns a success message if the book is added successfully.

##### GET /books/:id

- Description: Retrieve a specific book for the authenticated user from the database by ID.
- Request Parameter: `id` (Book ID)
- Response: Returns the book details in JSON format if found.

##### PUT /books/:id

- Description: Update a specific book for the authenticated user in the database by ID.
- Request Parameter: `id` (Book ID)
- Request Body: JSON object containing fields to update (title, author, genre, publicationYear).
- Response: Returns a success message if the book is updated successfully.

##### DELETE /books/:id

- Description: Delete a specific book for the authenticated user from the database by ID.
- Request Parameter: `id` (Book ID)
- Response: Returns a success message if the book is deleted successfully.

##### POST /books/upload

- Description: Upload a book cover for the authenticated user.
- Request Body: Form data containing the cover image file.
- Response: Returns the path to the uploaded cover image if successful.

##### GET /books/search

- Description: Search for books in the database.
- Query Parameter: `search` (Search term)
- Response: Returns a JSON array containing books matching the search criteria.

## Authentication and Authorization

This API uses JSON Web Token (JWT) for authentication. Each user must provide a valid token to access their own set of books.

### Example Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.id;
    next();
  });
};

module.exports = authenticateToken;
```

# Project Structure

- `app.js`: Main entry point for the application.
- `routes/books.js`: Contains routes for the books endpoint.
- `routes/auth.js`: Contains routes for authentication.
- `controller/bookController.js`: Controller for handling book-related logic, including CRUD operations, cover image uploads, and book searches.
- `controller/authController.js`: Controller for handling user registration and login.
- `middleware/authenticateToken.js`: Middleware for authenticating JWT tokens.
- `db/connect.js`: Connects to the SQLite database and creates tables if they don't exist.
- `.env`: Environment variables configuration file.

# Dependencies

- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `body-parser`: Parse incoming request bodies in a middleware before handlers.
- `compression`: Node.js compression middleware.
- `dotenv`: Loads environment variables from a .env file into process.env.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- `multer`: Middleware for handling multipart/form-data, used for uploading files.
- `ioredis`: Redis client for Node.js.
- `sqlite3`: SQLite client for Node.js.
- `jsonwebtoken`: JSON Web Token implementation for Node.js.
- `bcrypt`: Library to hash passwords.

# Redis Caching

The API uses Redis for caching database queries to improve performance. Cached data is stored with keys based on the request URL.

# Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.
