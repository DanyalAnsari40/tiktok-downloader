const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function testQualitySelection() {
  const testUrl = 'https://www.tiktok.com/@tiktok/video/7231890692682085638'; // Public TikTok video
  const qualities = ['best', '720p', '480p', '360p'];
  
  console.log('🧪 Testing Quality Selection with yt-dlp');
  console.log('=====================================\n');
  
  for (const quality of qualities) {
    console.log(`📹 Testing quality: ${quality}`);
    
    try {
      // Build quality format string
      let formatString = 'best';
      if (quality !== 'best') {
        formatString = `best[height<=${quality.replace('p', '')}]`;
      }
      
      console.log(`   Format string: ${formatString}`);
      
      // Test yt-dlp with quality selection
      const { stdout } = await execAsync(`py -m yt_dlp --dump-json --format "${formatString}" "${testUrl}"`, { timeout: 300000 }); // 5 minutes timeout
      const videoInfo = JSON.parse(stdout);
      
      if (videoInfo && videoInfo.url) {
        console.log(`   ✅ Success! Video URL found`);
        console.log(`   📺 Title: ${videoInfo.title || 'Unknown'}`);
        console.log(`   👤 Author: ${videoInfo.uploader || 'Unknown'}`);
        console.log(`   ⏱️ Duration: ${videoInfo.duration || 0} seconds`);
        console.log(`   🔗 URL: ${videoInfo.url.substring(0, 100)}...`);
        console.log('');
      } else {
        console.log(`   ❌ No video URL found`);
        console.log('');
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
    }
  }
  
  console.log('✅ Quality selection test completed!');
}

// Run the test
testQualitySelection().catch(console.error); 