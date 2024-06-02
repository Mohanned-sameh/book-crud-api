// Purpose: Main entry point for the application
const express = require('express');
const bodyparser = require('body-parser');
const compression = require('compression');
const cors = require('cors');

// Load the environment variables
require('dotenv').config();

// Create an express application
const app = express();

// Define the middleware
app.use(cors());
app.use(compression());

// Define the port number
const port = process.env.PORT || 3000;

// Define the middleware
app.use(bodyparser.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Define the routes
app.use('/books', require('./routes/books'));

// Start the server
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
