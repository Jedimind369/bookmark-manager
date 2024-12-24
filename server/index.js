
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');

const app = express();
const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth routes
app.get('/api/auth/user', async (req, res) => {
  try {
    const response = await fetch('/__replauthuser');
    const userData = await response.json();
    res.json(userData);
  } catch (error) {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Bookmark routes
app.use('/api/bookmarks', authMiddleware, require('./routes/bookmarks'));

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
