
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const auth = require('./middleware/auth');

const app = express();
const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL
});

app.use(cors());
app.use(express.json());

app.use('/api/bookmarks', auth, require('./routes/bookmarks'));
app.use('/api/ai', auth, require('./routes/ai'));

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
