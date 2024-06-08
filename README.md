# Book CRUD API

This project is a simple CRUD API for managing a collection of books. It provides endpoints for creating, reading, updating, and deleting books stored in a SQLite database.

## Installation

1. Clone the repository:
   `git clone git@github.com:Mohanned-sameh/book-crud-api.git`
2. Install dependencies:
   `npm install`
3. Set up environment variables:
   Create a `.env` file in the root directory and define the `PORT` variable.
   `ex: 
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379`

## Usage

### API Endpoints

#### GET /books

- Description: Retrieve all books from the database.
- Query Parameters:
- limit: Maximum number of books to return per page (default: 10).
- offset: Number of books to skip (default: 0).
- Response: Returns a JSON array containing books.

#### POST /books

- Description: Add a new book to the database.
- Request Body: JSON object containing book details (title, author, genre, publicationYear, bookCover).
- Response: Returns a success message if the book is added successfully.

#### GET /books/:id

- Description: Retrieve a specific book from the database by ID.
- Request Parameter: id (Book ID)
- Response: Returns the book details in JSON format if found.

#### PUT /books/:id

- Description: Update a specific book in the database by ID.
- Request Parameter: id (Book ID)
- Request Body: JSON object containing fields to update (title, author, genre, publicationYear).
- Response: Returns a success message if the book is updated successfully.

#### DELETE /books/:id

- Description: Delete a specific book from the database by ID.
- Request Parameter: id (Book ID)
- Response: Returns a success message if the book is deleted successfully.

#### POST /books/:id/cover

- Description: Upload or update the cover image for a specific book.
- Request Parameter: id (Book ID)
- Request Body: Form data containing the cover image file.
- Response: Returns the path to the uploaded cover image if successful.

#### GET /books/search

- Description: Search for books in the database.
- Query Parameter: search (Search term)
- Response: Returns a JSON array containing books matching the search criteria.

## Project Structure

- app.js: Main entry point for the application.
- routes/books.js: Contains routes for the books endpoint.
- controller/bookController.js: Controller for handling book-related logic, including CRUD operations, cover image uploads, and book searches.
- db/connect.js: Connects to the SQLite database and creates a table if it doesn't exist.
- .env: Environment variables configuration file.

## Dependencies

- express: Fast, unopinionated, minimalist web framework for Node.js.
- body-parser: Parse incoming request bodies in a middleware before handlers.
- compression: Node.js compression middleware.
- dotenv: Loads environment variables from a .env file into process.env.
- cors: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- multer: Middleware for handling multipart/form-data, used for uploading files.
- ioredis: A robust, performance-focused Redis client for Node.js.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## Contact

GitHub: [Mohanned sameh](github.com/mohanned-sameh)
LinkedIn: [Mohanned Sameh](linkedin/in/mohanned-sameh)
