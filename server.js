import express from 'express';
import cors from 'cors';

const app = express();
const port = 4000;

// Enable CORS for all routes
app.use(cors());

// Basic test endpoint
app.get('/', (req, res) => {
  console.log('Received request:', req.method, req.url);
  res.send('Server is working!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running at:`);
  console.log(`- Local: http://localhost:${port}`);
  console.log(`- Network: http://0.0.0.0:${port}`);
}); 