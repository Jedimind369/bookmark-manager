
const express = require('express');
const cors = require('cors');
const path = require('path');
const bookmarkRoutes = require('./server/routes/bookmarks');
const authRoutes = require('./server/routes/auth');
const aiRoutes = require('./server/routes/ai');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
