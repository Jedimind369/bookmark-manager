import express from 'express';

const app = express();
const port = 3000;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Basic test endpoint
app.get('/', (req, res) => {
  console.log('Received request from:', req.ip);
  res.send('Test server is working!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server with explicit host binding
const server = app.listen(port, '127.0.0.1', () => {
  console.log('Test server running at:');
  console.log(`- Local: http://127.0.0.1:${port}`);
  console.log(`- Try accessing: http://127.0.0.1:${port}/health`);
}); 