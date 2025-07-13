const { downloadTikTok } = require('../services/tiktokService');
const { downloadWithMobileAPIs, getAvailableAPIs, testAPI } = require('../services/mobileDownloadService');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Download video using mobile-friendly APIs
exports.downloadVideo = async (req, res) => {
  try {
    const { url, useMobileAPIs = true } = req.body;
    
    // Validate input
    if (!url) {
      return res.status(400).json({ 
        success: false,
        msg: 'Video URL is required' 
      });
    }

    // Validate URL (support TikTok, Instagram, YouTube)
    const supportedPlatforms = ['tiktok.com', 'instagram.com', 'youtube.com', 'youtu.be'];
    const isValidUrl = supportedPlatforms.some(platform => url.includes(platform));
    
    if (!isValidUrl) {
      return res.status(400).json({ 
        success: false,
        msg: 'Please provide a valid TikTok, Instagram, or YouTube URL' 
      });
    }

    console.log('Downloading video:', url);

    let videoInfo;
    
    // Use mobile APIs if requested or for Instagram/YouTube
    if (useMobileAPIs || url.includes('instagram.com') || url.includes('youtube.com') || url.includes('youtu.be')) {
      videoInfo = await downloadWithMobileAPIs(url);
    } else {
      // Fallback to original TikTok service for TikTok URLs
      videoInfo = await downloadTikTok(url);
    }

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

// Experimental: Proxy video stream from external URL to client
exports.proxyVideo = async (req, res) => {
  const { url } = req.query;
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ success: false, msg: 'Invalid video URL for proxy.' });
  }
  try {
    const axiosResponse = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'video/mp4,video/*,*/*;q=0.9',
        'Referer': 'https://www.tiktok.com/'
      },
      timeout: 120000
    });
    res.setHeader('Content-Type', axiosResponse.headers['content-type'] || 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="tiktok_video.mp4"');
    axiosResponse.data.pipe(res);
  } catch (err) {
    console.error('Proxy video error:', err.message);
    res.status(500).json({ success: false, msg: 'Failed to proxy video.', error: err.message });
  }
};

// Get available APIs for a platform
exports.getAvailableAPIs = async (req, res) => {
  try {
    const { platform } = req.params;
    const apis = getAvailableAPIs(platform);
    
    res.json({
      success: true,
      platform: platform,
      apis: apis,
      count: apis.length
    });
  } catch (err) {
    console.error('Get APIs error:', err.message);
    res.status(500).json({ 
      success: false, 
      msg: 'Failed to get available APIs',
      error: err.message 
    });
  }
};

// Test API connectivity
exports.testAPI = async (req, res) => {
  try {
    const { apiName } = req.params;
    const result = await testAPI(apiName);
    
    res.json({
      success: result.success,
      api: apiName,
      message: result.message,
      status: result.status,
      error: result.error
    });
  } catch (err) {
    console.error('Test API error:', err.message);
    res.status(500).json({ 
      success: false, 
      msg: 'Failed to test API',
      error: err.message 
    });
  }
};