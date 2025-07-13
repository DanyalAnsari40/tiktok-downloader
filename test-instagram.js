const axios = require('axios');

async function testInstagramDownload() {
  try {
    console.log('Testing Instagram download with a public video...');
    
    // Test with a public Instagram video (you can replace this with any public Instagram video URL)
    const testUrl = 'https://www.instagram.com/p/C8QZQZQZQZQ/'; // Replace with actual public Instagram URL
    
    const response = await axios.post('http://localhost:5000/api/download', {
      url: testUrl,
      platform: 'instagram'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });
    
    console.log('✅ Instagram download test response:');
    console.log('Success:', response.data.success);
    console.log('Status:', response.data.status);
    console.log('Message:', response.data.message);
    
    if (response.data.downloadUrl) {
      console.log('📥 Download URL:', response.data.downloadUrl);
    }
    
  } catch (error) {
    console.error('❌ Instagram download test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Wait for server to start, then test
setTimeout(testInstagramDownload, 3000); 