require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const downloadRoutes = require('./routes/downloadRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();

// Get CORS origins from environment or use defaults
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://tiktok-downloader-frontend.vercel.app',
      'https://tiktok-downloader.vercel.app'
    ];

// CORS configuration
app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve downloaded files (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use('/downloads', express.static(path.join(__dirname, 'downloads')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TikTok Downloader API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/download', downloadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Frontend URLs: ${corsOrigins.join(', ')}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});