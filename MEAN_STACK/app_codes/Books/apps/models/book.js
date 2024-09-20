var mongoose = require('mongoose');

// Database connection string
var dbHost = 'mongodb://localhost:27017/test';

// Connect to the MongoDB database
mongoose.connect(dbHost)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Enable mongoose debugging
mongoose.set('debug', true);

// Define the book schema
var bookSchema = new mongoose.Schema({
  name: String,
  isbn: { type: String, index: true },
  author: String,
  pages: Number
});

// Create the Book model from the schema
var Book = mongoose.model('Book', bookSchema);

// Export the Book model
module.exports = Book;

