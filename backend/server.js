require('dotenv').config();
const express = require('express');
const cors = require('cors');
const downloadRoutes = require('./routes/downloadRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();

// Get CORS origins from environment or use defaults
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://tik-downloader.netlify.app'
    ];

// CORS configuration
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TikTok Downloader API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: corsOrigins
  });
});

// Routes
app.use('/api/download', downloadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableRoutes: ['/api/health', '/api/download/tiktok']
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// For Vercel, export the app
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  // For local development
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Frontend URLs: ${corsOrigins.join(', ')}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
  });
}