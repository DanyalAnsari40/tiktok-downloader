const axios = require('axios');

// Mobile-friendly download APIs configuration
const MOBILE_APIS = {
  // TikTok APIs
  ttsave: {
    name: 'TTSave.app',
    baseUrl: 'https://ttsave.app/api',
    endpoints: {
      tiktok: '/tiktok',
      instagram: '/instagram'
    },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
    },
    extract: (response, platform) => {
      if (response.data?.data) {
        const data = response.data.data;
        return {
          success: true,
          title: data.title || `${platform} Video`,
          author: data.author || 'Unknown',
          thumbnail: data.thumbnail || data.cover || '',
          downloadUrl: data.download_url || data.url || data.play,
          duration: data.duration || 0,
          platform: platform
        };
      }
      return { success: false };
    }
  },

  allinone: {
    name: 'AllInOne.tools',
    baseUrl: 'https://allinone.tools/api',
    endpoints: {
      tiktok: '/tiktok/download',
      instagram: '/instagram/download'
    },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
    },
    extract: (response, platform) => {
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        return {
          success: true,
          title: data.title || `${platform} Video`,
          author: data.author || 'Unknown',
          thumbnail: data.thumbnail || '',
          downloadUrl: data.download_url || data.url,
          duration: data.duration || 0,
          platform: platform
        };
      }
      return { success: false };
    }
  },

  noonshot: {
    name: 'TikTok.NoonShot.com',
    baseUrl: 'https://tiktok.noonshot.com/api',
    endpoints: {
      tiktok: '/download'
    },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
    },
    extract: (response, platform) => {
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        return {
          success: true,
          title: data.title || `${platform} Video`,
          author: data.author || 'Unknown',
          thumbnail: data.thumbnail || '',
          downloadUrl: data.download_url || data.url,
          duration: data.duration || 0,
          platform: platform
        };
      }
      return { success: false };
    }
  },

  // Instagram Reels APIs
  snapsave: {
    name: 'SnapSave',
    baseUrl: 'https://snapsave.app/api',
    endpoints: {
      instagram: '/instagram/download'
    },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
    },
    extract: (response, platform) => {
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        return {
          success: true,
          title: data.title || 'Instagram Reel',
          author: data.author || 'Unknown',
          thumbnail: data.thumbnail || '',
          downloadUrl: data.download_url || data.url,
          duration: data.duration || 0,
          platform: 'instagram'
        };
      }
      return { success: false };
    }
  }
};

// RapidAPI configuration (requires API key)
const RAPIDAPI_CONFIG = {
  name: 'RapidAPI TikTok/Instagram',
  baseUrl: 'https://tiktok-video-no-watermark2.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
    'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  method: 'GET',
  extract: (response, platform) => {
    if (response.data?.data) {
      const data = response.data.data;
      return {
        success: true,
        title: data.title || `${platform} Video`,
        author: data.author || 'Unknown',
        thumbnail: data.cover || '',
        downloadUrl: data.play || data.download_url,
        duration: data.duration || 0,
        platform: platform
      };
    }
    return { success: false };
  }
};

// Helper function to detect platform from URL
const detectPlatform = (url) => {
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return 'unknown';
};

// Main download function that tries multiple mobile-friendly APIs
exports.downloadWithMobileAPIs = async (url) => {
  try {
    const platform = detectPlatform(url);
    
    if (platform === 'unknown') {
      throw new Error('Unsupported platform. Please provide a TikTok, Instagram, or YouTube URL.');
    }

    console.log(`Processing ${platform} URL with mobile APIs:`, url);

    // Define which APIs to try based on platform
    const apisToTry = [];
    
    if (platform === 'tiktok') {
      apisToTry.push(
        { api: 'ttsave', endpoint: 'tiktok' },
        { api: 'allinone', endpoint: 'tiktok' },
        { api: 'noonshot', endpoint: 'tiktok' }
      );
    } else if (platform === 'instagram') {
      apisToTry.push(
        { api: 'ttsave', endpoint: 'instagram' },
        { api: 'allinone', endpoint: 'instagram' },
        { api: 'snapsave', endpoint: 'instagram' }
      );
    }

    // Try RapidAPI if key is available
    if (process.env.RAPIDAPI_KEY) {
      apisToTry.push({ api: 'rapidapi', endpoint: platform });
    }

    // Try each API
    for (const { api, endpoint } of apisToTry) {
      try {
        console.log(`Trying ${api} API for ${platform}...`);
        
        let response;
        const apiConfig = api === 'rapidapi' ? RAPIDAPI_CONFIG : MOBILE_APIS[api];
        
        if (!apiConfig) {
          console.log(`API config not found for ${api}`);
          continue;
        }

        const requestConfig = {
          method: apiConfig.method,
          url: `${apiConfig.baseUrl}${apiConfig.endpoints[endpoint]}`,
          headers: apiConfig.headers,
          timeout: 15000
        };

        if (apiConfig.method === 'POST') {
          requestConfig.data = { url: url };
        } else if (apiConfig.method === 'GET') {
          requestConfig.params = { url: url };
        }

        response = await axios(requestConfig);
        
        const result = apiConfig.extract(response, platform);
        if (result.success) {
          console.log(`✅ Success with ${apiConfig.name}`);
          return {
            ...result,
            status: 'success',
            apiUsed: apiConfig.name
          };
        }
      } catch (err) {
        console.log(`${api} API failed:`, err.message);
        continue;
      }
    }

    // If all APIs fail, throw error
    throw new Error(`Unable to download this ${platform} video. Please try a different video or try again later.`);

  } catch (err) {
    console.error('Mobile API download error:', err.message);
    
    return {
      title: 'Video Download (Error)',
      author: 'Unknown',
      thumbnail: 'https://via.placeholder.com/300x400/ff0000/ffffff?text=Download+Failed',
      downloadUrl: '',
      duration: 0,
      platform: 'unknown',
      status: 'error',
      message: err.message || 'Failed to download video. Please try again.',
      error: err.message
    };
  }
};

// Function to get available APIs for a platform
exports.getAvailableAPIs = (platform) => {
  const available = [];
  
  if (platform === 'tiktok') {
    available.push(
      { name: 'TTSave.app', url: 'https://ttsave.app/' },
      { name: 'AllInOne.tools', url: 'https://allinone.tools/' },
      { name: 'TikTok.NoonShot.com', url: 'https://tiktok.noonshot.com/' }
    );
  } else if (platform === 'instagram') {
    available.push(
      { name: 'TTSave.app', url: 'https://ttsave.app/' },
      { name: 'AllInOne.tools', url: 'https://allinone.tools/' },
      { name: 'SnapSave', url: 'https://snapsave.app/' }
    );
  }

  if (process.env.RAPIDAPI_KEY) {
    available.push({ name: 'RapidAPI', url: 'https://rapidapi.com' });
  }

  return available;
};

// Function to test API connectivity
exports.testAPI = async (apiName) => {
  try {
    const apiConfig = MOBILE_APIS[apiName];
    if (!apiConfig) {
      throw new Error(`API ${apiName} not found`);
    }

    const response = await axios({
      method: 'GET',
      url: apiConfig.baseUrl,
      headers: apiConfig.headers,
      timeout: 5000
    });

    return {
      success: true,
      api: apiName,
      status: response.status,
      message: `${apiName} API is accessible`
    };
  } catch (err) {
    return {
      success: false,
      api: apiName,
      error: err.message,
      message: `${apiName} API is not accessible`
    };
  }
}; 