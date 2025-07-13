const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/download';

// Test functions
async function testAvailableAPIs() {
  console.log('🔍 Testing Available APIs...');
  
  try {
    // Test TikTok APIs
    const tiktokResponse = await axios.get(`${BASE_URL}/apis/tiktok`);
    console.log('✅ TikTok APIs:', tiktokResponse.data.apis);
    
    // Test Instagram APIs
    const instagramResponse = await axios.get(`${BASE_URL}/apis/instagram`);
    console.log('✅ Instagram APIs:', instagramResponse.data.apis);
    
  } catch (error) {
    console.error('❌ Error testing available APIs:', error.message);
  }
}

async function testAPIConnectivity() {
  console.log('\n🔍 Testing API Connectivity...');
  
  const apis = ['ttsave', 'allinone', 'noonshot'];
  
  for (const api of apis) {
    try {
      const response = await axios.get(`${BASE_URL}/test-api/${api}`);
      console.log(`✅ ${api}: ${response.data.message}`);
    } catch (error) {
      console.log(`❌ ${api}: ${error.response?.data?.message || error.message}`);
    }
  }
}

async function testDownload() {
  console.log('\n🔍 Testing Download with Mobile APIs...');
  
  // Test with a sample TikTok URL (you can replace this with a real URL)
  const testUrl = 'https://www.tiktok.com/@example/video/1234567890';
  
  try {
    const response = await axios.post(`${BASE_URL}`, {
      url: testUrl,
      useMobileAPIs: true
    });
    
    if (response.data.success) {
      console.log('✅ Download successful!');
      console.log('📱 API Used:', response.data.apiUsed);
      console.log('📹 Title:', response.data.title);
      console.log('👤 Author:', response.data.author);
      console.log('🔗 Download URL:', response.data.downloadUrl);
    } else {
      console.log('❌ Download failed:', response.data.msg);
    }
  } catch (error) {
    console.error('❌ Error testing download:', error.response?.data?.msg || error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Testing Mobile APIs Integration\n');
  
  await testAvailableAPIs();
  await testAPIConnectivity();
  await testDownload();
  
  console.log('\n✅ Mobile APIs test completed!');
  console.log('\n📱 Key Features:');
  console.log('• Mobile-optimized user agents');
  console.log('• Automatic API fallback');
  console.log('• Support for TikTok, Instagram, YouTube');
  console.log('• 15-second timeout with retry logic');
  console.log('• Comprehensive error handling');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests }; 