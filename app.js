// Purpose: Main entry point for the application
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');

// Load the environment variables
require('dotenv').config();

// Create an express application
const app = express();

// Define the middleware
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Define the port number
const port = process.env.PORT || 3000;

// Define the routes
app.use('/books', require('./routes/books'));
app.use('/auth', require('./routes/auth'));

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
