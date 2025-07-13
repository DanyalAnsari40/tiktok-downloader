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

    // If we have a download URL, try to download the actual file
    if (videoInfo.downloadUrl && videoInfo.downloadUrl.startsWith('http')) {
      try {
        console.log('Attempting to download TikTok video file from:', videoInfo.downloadUrl);
        
        // Create downloads directory if it doesn't exist
        const downloadsDir = path.join(__dirname, '..', 'downloads');
        if (!fs.existsSync(downloadsDir)) {
          fs.mkdirSync(downloadsDir, { recursive: true });
          console.log('Created downloads directory:', downloadsDir);
        }

        // Generate unique filename
        const timestamp = Date.now();
        const safeTitle = (videoInfo.title || 'tiktok_video').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
        const filename = `tiktok_${safeTitle}_${timestamp}.mp4`;
        const filepath = path.join(downloadsDir, filename);

        console.log('Saving TikTok video to:', filepath);

        // Try yt-dlp first for better success rate
        let downloadSuccess = false;
        try {
          console.log('Trying yt-dlp for direct download...');
          
          // Use yt-dlp to download TikTok video
          const ytdlpProcess = exec(`py -m yt_dlp -o "${filepath}" --format "best" "${url}"`, { timeout: 300000 });
          
          // Track progress
          let progress = 0;
          ytdlpProcess.stdout?.on('data', (data) => {
            const output = data.toString();
            console.log('yt-dlp output:', output);
            
            // Extract progress from yt-dlp output if available
            if (output.includes('%')) {
              const match = output.match(/(\d+(?:\.\d+)?)%/);
              if (match) {
                progress = parseFloat(match[1]);
                console.log(`Download progress: ${progress}%`);
              }
            }
          });
          
          await new Promise((resolve, reject) => {
            ytdlpProcess.on('close', (code) => {
              if (code === 0) {
                resolve();
              } else {
                reject(new Error(`yt-dlp exited with code ${code}`));
              }
            });
            
            ytdlpProcess.on('error', reject);
          });
          
          console.log('yt-dlp download completed');
          
          // Check if file was created
          if (fs.existsSync(filepath)) {
            const stats = fs.statSync(filepath);
            if (stats.size > 0) {
              console.log('yt-dlp download successful. File size:', stats.size, 'bytes');
              downloadSuccess = true;
            }
          }
        } catch (ytdlpError) {
          console.log('yt-dlp download failed, trying HTTP download...');
          console.error('yt-dlp error:', ytdlpError.message);
          
          // Check if it's a timeout error
          if (ytdlpError.code === 'ETIMEDOUT' || ytdlpError.message.includes('timeout')) {
            throw new Error('Download timed out. The video might be too long or the server is slow. Please try again.');
          }
        }

        // If yt-dlp failed, try HTTP download with better headers
        if (!downloadSuccess) {
          console.log('Trying HTTP download with enhanced headers...');
          
          // Enhanced headers for TikTok videos
          const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'video/mp4,video/*,*/*;q=0.9',
            'Accept-Encoding': 'identity',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Referer': 'https://www.tiktok.com/',
            'Sec-Fetch-Dest': 'video',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site',
            'Range': 'bytes=0-'
          };

          const videoResponse = await axios({
            method: 'GET',
            url: videoInfo.downloadUrl,
            responseType: 'stream',
            timeout: 120000, // 2 minutes for video download
            headers: headers
          });

          // Check if we got a valid video response
          const contentType = videoResponse.headers['content-type'];
          console.log('Response content-type:', contentType);
          
          if (!contentType || !contentType.includes('video')) {
            console.log('Warning: Response does not appear to be a video file');
          }

          // Save the video file
          const writer = fs.createWriteStream(filepath);
          let downloadSize = 0;
          
          videoResponse.data.on('data', (chunk) => {
            downloadSize += chunk.length;
            console.log(`Downloaded ${downloadSize} bytes...`);
          });

          videoResponse.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on('finish', () => {
              console.log('Video download completed. File size:', downloadSize, 'bytes');
              resolve();
            });
            writer.on('error', (err) => {
              console.error('Error writing file:', err);
              reject(err);
            });
          });

          // Check if file was actually created and has content
          const stats = fs.statSync(filepath);
          console.log('File saved successfully. Size:', stats.size, 'bytes');

          if (stats.size === 0) {
            throw new Error('Downloaded file is empty');
          }
          
          downloadSuccess = true;
        }

        if (downloadSuccess) {
          // Return the local file URL
          const localDownloadUrl = `/downloads/${filename}`;
          
          console.log('Returning local download URL:', localDownloadUrl);
          
          res.json({ 
            success: true,
            downloadUrl: localDownloadUrl,
            localFile: filepath,
            fileSize: fs.statSync(filepath).size,
            title: videoInfo.title,
            author: videoInfo.author,
            thumbnail: videoInfo.thumbnail,
            duration: videoInfo.duration,
            platform: 'tiktok',
            status: 'success',
            apiUsed: videoInfo.apiUsed || 'yt-dlp'
          });
        } else {
          throw new Error('All download methods failed');
        }
      } catch (downloadError) {
        console.error('Failed to download TikTok video file:', downloadError.message);
        
        res.json({ 
          success: false,
          message: 'TikTok video download failed. Please try again later.',
          error: downloadError.message,
          title: videoInfo.title,
          author: videoInfo.author,
          thumbnail: videoInfo.thumbnail,
          duration: videoInfo.duration,
          platform: 'tiktok',
          status: 'error'
        });
      }
    } else {
      // No download URL available
      console.log('No valid download URL available');
      res.json({ 
        success: true,
        downloadUrl: videoInfo.downloadUrl, 
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