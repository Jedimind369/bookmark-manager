const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmarks');
const aiRoutes = require('./routes/ai');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/ai', aiRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB connection is ready');
      res.status(200).json({ status: 'OK', message: 'Connected to MongoDB' });
    } else {
      console.error('Health check failed: Not connected to MongoDB');
      res.status(503).json({ status: 'ERROR', message: 'Not connected to MongoDB' });
    }
  } catch (error) {
    console.error('Error in health check route:', error);
    res.status(500).json({ status: 'ERROR', message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    // Start the server only after successful database connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Instead of exiting, start the server anyway
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (without MongoDB connection)`);
    });
  }
};

connectToMongoDB();

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({ 
    status: 'ERROR', 
    message,
    path: req.path
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app; // Export the app for testing purposes