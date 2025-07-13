const { downloadTikTok } = require('../services/tiktokService');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Download TikTok video
exports.downloadVideo = async (req, res) => {
  try {
    const { url } = req.body;
    
    // Validate input
    if (!url) {
      return res.status(400).json({ 
        success: false,
        msg: 'TikTok URL is required' 
      });
    }

    // Validate TikTok URL
    if (!url.includes('tiktok.com')) {
      return res.status(400).json({ 
        success: false,
        msg: 'Please provide a valid TikTok URL' 
      });
    }

    console.log('Downloading TikTok video:', url);

    // Download TikTok video
    const videoInfo = await downloadTikTok(url);

    console.log('Video info received:', videoInfo);

    // Check if download was successful
    if (videoInfo.status === 'error') {
      return res.status(500).json({
        success: false,
        msg: videoInfo.message || 'Failed to download TikTok video',
        error: videoInfo.error
      });
    }

    // Return the direct video URL for frontend to download
    if (videoInfo.downloadUrl && videoInfo.downloadUrl.startsWith('http')) {
      return res.json({
        success: true,
        downloadUrl: videoInfo.downloadUrl,
        title: videoInfo.title,
        author: videoInfo.author,
        thumbnail: videoInfo.thumbnail,
        duration: videoInfo.duration,
        platform: 'tiktok',
        status: 'success',
        apiUsed: videoInfo.apiUsed || 'external-api'
      });
    } else {
      // No valid download URL available
      return res.status(500).json({
        success: false,
        msg: 'No valid download URL found',
        error: 'No valid download URL found',
        ...videoInfo
      });
    }
  } catch (err) {
    console.error('Download error:', err.message);
    res.status(500).json({ 
      success: false,
      msg: 'Failed to download TikTok video. Please check the URL and try again.',
      error: err.message 
    });
  }
};

// Get download history (simplified - just return empty for now)
exports.getDownloadHistory = async (req, res) => {
  try {
    res.json({
      success: true,
      downloads: [],
      count: 0
    });
  } catch (err) {
    console.error('Get downloads error:', err.message);
    res.status(500).json({ msg: 'Failed to get download history' });
  }
};

// Get single download (simplified)
exports.getDownload = async (req, res) => {
  try {
    res.status(404).json({ msg: 'Download history not available without authentication' });
  } catch (err) {
    console.error('Get download error:', err.message);
    res.status(500).json({ msg: 'Failed to get download details' });
  }
};