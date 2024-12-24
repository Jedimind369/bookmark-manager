
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Replit auth middleware
app.use((req, res, next) => {
  const userId = req.headers['x-replit-user-id'];
  const userName = req.headers['x-replit-user-name'];
  
  if (!userId && req.path !== '/') {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (userId) {
    req.user = { id: userId, name: userName };
  }
  next();
});

app.get('/api/auth/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
