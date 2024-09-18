const fs = require('fs');
const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/api');

const app = express();

const port = process.env.PORT || 5001;

// Check if the .env file exists (for debugging purposes)
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('.env file exists at:', envPath);
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('Env file content:', envContent);
} else {
    console.log('.env file does not exist at the expected path:', envPath);
}

// Ensure DB connection string is defined
const dbConnectionString = process.env.DB_CONNECTION_STRING || 'mongodb+srv://Busola:Opeoluwa1@cluster0.qz8my.mongodb.net/todoApp?retryWrites=true&w=majority';

if (!dbConnectionString) {
    throw new Error('DB connection string not defined in environment variables');
}

// Log the DB URI to check if it's being set correctly
console.log('DB URI:', dbConnectionString);

// Connect to the database
mongoose.connect(dbConnectionString)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log('Error connecting to the database:', err));

// Override mongoose's deprecated promise with Node's promise
mongoose.Promise = global.Promise;

// Enable CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Use body-parser to handle JSON requests
app.use(bodyParser.json());

// Setup API routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    next();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

