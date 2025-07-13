const axios = require('axios');

exports.downloadTikTok = async (url) => {
  try {
    // Validate URL
    if (!url.includes('tiktok.com')) {
      throw new Error('Invalid TikTok URL');
    }

    console.log('Processing TikTok URL:', url);

    // Try multiple downloader services
    const services = [
      {
        name: 'TikWM',
        url: 'https://tikwm.com/api/',
        method: 'POST',
        data: { url: url },
        extract: (response) => {
          if (response.data?.data?.play) {
            return {
              success: true,
              title: response.data.data.title || 'TikTok Video',
              author: response.data.data.author || 'Unknown',
              thumbnail: response.data.data.cover || '',
              downloadUrl: response.data.data.play,
              duration: 0
            };
          }
          return { success: false };
        }
      },
      {
        name: 'SnapTik',
        url: 'https://snaptik.app/abc',
        method: 'POST',
        data: { url: url },
        extract: (response) => {
          if (response.data?.url) {
            return {
              success: true,
              title: 'TikTok Video',
              author: 'Unknown',
              thumbnail: '',
              downloadUrl: response.data.url,
              duration: 0
            };
          }
          return { success: false };
        }
      }
    ];

    // Try each service
    for (const service of services) {
      try {
        console.log(`Trying ${service.name}...`);
        
        const response = await axios({
          method: service.method,
          url: service.url,
          data: service.data,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000
        });

        const result = service.extract(response);
        if (result.success) {
          console.log(`✅ Success with ${service.name}`);
          return {
            title: result.title,
            author: result.author,
            thumbnail: result.thumbnail,
            downloadUrl: result.downloadUrl,
            duration: result.duration,
            platform: 'tiktok',
            status: 'success',
            apiUsed: service.name
          };
        }
      } catch (err) {
        console.log(`${service.name} failed:`, err.message);
        continue;
      }
    }

    // If all services fail, return a helpful error
    throw new Error('Unable to download this TikTok video. Please try a different video or try again later.');

  } catch (err) {
    console.error('TikTok download error:', err.message);
    
    return {
      title: 'TikTok Video (Error)',
      author: 'Unknown',
      thumbnail: 'https://via.placeholder.com/300x400/ff0000/ffffff?text=Download+Failed',
      downloadUrl: '',
      duration: 0,
      platform: 'tiktok',
      status: 'error',
      message: err.message || 'Failed to download TikTok video. Please try again.',
      error: err.message
    };
  }
};