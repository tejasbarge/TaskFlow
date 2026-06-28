const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Allow JSON body parsing

// Basic route to check if API is alive
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Task Tracker API is active and running.' });
});

// Mount CRUD routes
app.use('/api/tasks', taskRoutes);

// Error Handling Middleware for unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ message: `Resource not found - ${req.originalUrl}` });
});

// Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in production/development on port ${PORT}`);
});
