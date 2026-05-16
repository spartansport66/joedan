const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const supabase = require('./supabase');

// CORS configuration for production (Vercel)
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', require('./routes'));

app.get('/', (req, res) => {
  res.json({
    message: 'Joedan E-commerce API',
    status: 'running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint for Vercel
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

// Test Supabase connection
supabase.from('categories').select('count', { count: 'exact' }).then(({ error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('✓ Supabase connected successfully');
  }
});

// Start server only if running locally or not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with Supabase`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app for Vercel serverless functions
module.exports = app;
