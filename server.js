
const express = require('express');
const cors = require('cors');
const path = require('path');
const bookmarkRoutes = require('./server/routes/bookmarks');
const authRoutes = require('./server/routes/auth');
const aiRoutes = require('./server/routes/ai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
