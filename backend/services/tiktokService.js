const axios = require('axios');
const puppeteer = require('puppeteer');

exports.downloadTikTok = async (url) => {
  try {
    // Validate URL
    if (!url.includes('tiktok.com')) {
      throw new Error('Invalid TikTok URL');
    }

    console.log('Downloading TikTok video...');

    // Try yt-dlp method first (most reliable for TikTok)
    console.log('Trying yt-dlp method...');
    const ytdlpResult = await tryYtDlpMethod(url);
    if (ytdlpResult.success) {
      console.log('✅ Success with yt-dlp method');
      console.log('Video URL found:', ytdlpResult.downloadUrl);
      return {
        title: ytdlpResult.title || 'TikTok Video',
        author: ytdlpResult.author || 'Unknown',
        thumbnail: ytdlpResult.thumbnail || '',
        downloadUrl: ytdlpResult.downloadUrl,
        duration: ytdlpResult.duration || 0,
        platform: 'tiktok',
        status: 'success',
        apiUsed: 'yt-dlp'
      };
    }

    // Try enhanced web scraping that can handle blob URLs
    console.log('Trying enhanced web scraping method...');
    const scrapingResult = await tryEnhancedWebScraping(url);
    if (scrapingResult.success) {
      console.log('✅ Success with enhanced web scraping');
      console.log('Video URL found:', scrapingResult.downloadUrl);
      return {
        title: scrapingResult.title || 'TikTok Video',
        author: scrapingResult.author || 'Unknown',
        thumbnail: scrapingResult.thumbnail || '',
        downloadUrl: scrapingResult.downloadUrl,
        duration: scrapingResult.duration || 0,
        platform: 'tiktok',
        status: 'success',
        apiUsed: 'enhanced-web-scraping'
      };
    }

    // Try TikTok APIs as fallback
    console.log('Trying TikTok APIs...');
    const apiResult = await tryTikTokAPIs(url);
    if (apiResult.success) {
      console.log('✅ Success with TikTok API');
      return {
        title: apiResult.title || 'TikTok Video',
        author: apiResult.author || 'Unknown',
        thumbnail: apiResult.thumbnail || '',
        downloadUrl: apiResult.downloadUrl,
        duration: apiResult.duration || 0,
        platform: 'tiktok',
        status: 'success',
        apiUsed: 'tiktok-api'
      };
    }

    // All methods failed
    throw new Error('All TikTok download methods failed. Please try again later or use a different video.');

  } catch (err) {
    console.error('TikTok download error:', err.message);
    
    return {
      title: 'TikTok Video (Error)',
      author: 'Unknown',
      thumbnail: 'https://via.placeholder.com/300x400/ff0000/ffffff?text=TikTok+Error',
      downloadUrl: '',
      duration: 0,
      platform: 'tiktok',
      status: 'error',
      message: 'Failed to download TikTok video. All methods are currently unavailable. Please try again later or use a different video.',
      error: err.message
    };
  }
};

// yt-dlp method for TikTok downloads
async function tryYtDlpMethod(url) {
  try {
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);
    
    // Check if yt-dlp is installed
    try {
      await execAsync('py -m yt_dlp --version');
    } catch (err) {
      console.log('yt-dlp not found, trying to install...');
      // Try to install yt-dlp using pip
      try {
        await execAsync('py -m pip install yt-dlp');
      } catch (installErr) {
        console.error('Failed to install yt-dlp:', installErr.message);
        return { success: false, error: 'yt-dlp not available' };
      }
    }
    
    console.log('Using yt-dlp for TikTok download...');
    
    // Use yt-dlp to get video info
    const { stdout } = await execAsync(`py -m yt_dlp --dump-json --format "best" "${url}"`, { timeout: 300000 }); // 5 minutes timeout
    const videoInfo = JSON.parse(stdout);
    
    if (videoInfo && videoInfo.url) {
      return {
        success: true,
        title: videoInfo.title || 'TikTok Video',
        author: videoInfo.uploader || videoInfo.channel || 'Unknown',
        thumbnail: videoInfo.thumbnail || '',
        downloadUrl: videoInfo.url,
        duration: videoInfo.duration || 0
      };
    } else {
      throw new Error('No video URL found in yt-dlp output');
    }
    
  } catch (err) {
    console.error('yt-dlp method failed:', err.message);
    return { success: false, error: err.message };
  }
}

// Enhanced web scraping method for TikTok
async function tryEnhancedWebScraping(url) {
  let browser;
  
  try {
    console.log('Starting enhanced web scraping for TikTok...');
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate to TikTok video
    console.log('Navigating to TikTok video...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for video to load
    await page.waitForTimeout(5000);
    
    // Try to find video element
    const videoElement = await page.$('video');
    if (!videoElement) {
      throw new Error('No video element found on page');
    }
    
    // Get video source
    const videoSrc = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video ? video.src : null;
    });
    
    if (!videoSrc) {
      throw new Error('No video source found');
    }
    
    console.log('Video source found:', videoSrc);
    
    // Get video metadata
    const metadata = await page.evaluate(() => {
      const video = document.querySelector('video');
      const title = document.querySelector('h1')?.textContent || 'TikTok Video';
      const author = document.querySelector('[data-e2e="browse-username"]')?.textContent || 'Unknown';
      
      return {
        title: title.trim(),
        author: author.trim(),
        duration: video ? video.duration : 0
      };
    });
    
    // Get thumbnail
    const thumbnail = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video ? video.poster : '';
    });
    
    await browser.close();
    
    return {
      success: true,
      title: metadata.title,
      author: metadata.author,
      thumbnail: thumbnail,
      downloadUrl: videoSrc,
      duration: metadata.duration
    };
    
  } catch (err) {
    console.error('Enhanced web scraping failed:', err.message);
    if (browser) {
      await browser.close();
    }
    return { success: false, error: err.message };
  }
}

// TikTok API methods
async function tryTikTokAPIs(url) {
  const apis = [
    // TikWM API
    async () => {
      try {
        const response = await axios.post('https://tikwm.com/api/', {
          url: url
        }, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000
        });
        
        if (response.data && response.data.data && response.data.data.play) {
          return {
            success: true,
            title: response.data.data.title || 'TikTok Video',
            author: response.data.data.author || 'Unknown',
            thumbnail: response.data.data.cover || '',
            downloadUrl: response.data.data.play,
            duration: 0
          };
        }
        throw new Error('Invalid response from TikWM API');
      } catch (err) {
        throw new Error(`TikWM API failed: ${err.message}`);
      }
    },
    
    // TTSave API
    async () => {
      try {
        const response = await axios.post('https://ttsave.app/api/convert', {
          url: url
        }, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000
        });
        
        if (response.data && response.data.url) {
          return {
            success: true,
            title: response.data.title || 'TikTok Video',
            author: response.data.author || 'Unknown',
            thumbnail: response.data.thumbnail || '',
            downloadUrl: response.data.url,
            duration: 0
          };
        }
        throw new Error('Invalid response from TTSave API');
      } catch (err) {
        throw new Error(`TTSave API failed: ${err.message}`);
      }
    }
  ];
  
  for (let i = 0; i < apis.length; i++) {
    try {
      console.log(`Trying TikTok API ${i + 1}...`);
      const result = await apis[i]();
      if (result.success) {
        return result;
      }
    } catch (err) {
      console.log(`TikTok API ${i + 1} failed:`, err.message);
    }
  }
  
  return { success: false, error: 'All TikTok APIs failed' };
}