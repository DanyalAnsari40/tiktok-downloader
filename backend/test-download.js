const axios = require('axios');

async function testDownload() {
  try {
    console.log('Testing download with URL: https://vt.tiktok.com/ZSBVN8pFu/');
    
    const response = await axios.post('http://localhost:5000/api/download', {
      url: 'https://vt.tiktok.com/ZSBVN8pFu/',
      platform: 'tiktok'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 seconds timeout
    });
    
    console.log('✅ Download successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.downloadUrl) {
      console.log('📥 Download URL:', response.data.downloadUrl);
      console.log('📁 Local file path:', response.data.localFile);
      console.log('📊 File size:', response.data.fileSize, 'bytes');
    }
    
  } catch (error) {
    console.error('❌ Download failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Wait a bit for server to start, then test
setTimeout(testDownload, 3000); 