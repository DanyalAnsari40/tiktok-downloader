#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function installYtDlp() {
  console.log('🔧 Setting up yt-dlp for video downloading...\n');

  try {
    // Check if yt-dlp is already installed
    console.log('📋 Checking if yt-dlp is already installed...');
    await execAsync('py -m yt_dlp --version');
    console.log('✅ yt-dlp is already installed!\n');
    return true;
  } catch (err) {
    console.log('❌ yt-dlp not found. Installing...\n');
  }

  try {
    // Try to install yt-dlp using pip
    console.log('📦 Installing yt-dlp using pip...');
    await execAsync('pip install yt-dlp');
    console.log('✅ yt-dlp installed successfully using pip!\n');
    
    // Verify installation
    console.log('🔍 Verifying installation...');
    const { stdout } = await execAsync('py -m yt_dlp --version');
    console.log(`✅ yt-dlp version: ${stdout.trim()}\n`);
    
    return true;
  } catch (pipErr) {
    console.log('❌ pip installation failed. Trying alternative methods...\n');
    
    try {
      // Try using npm as alternative
      console.log('📦 Trying to install yt-dlp using npm...');
      await execAsync('npm install -g yt-dlp');
      console.log('✅ yt-dlp installed successfully using npm!\n');
      
      // Verify installation
      console.log('🔍 Verifying installation...');
      const { stdout } = await execAsync('py -m yt_dlp --version');
      console.log(`✅ yt-dlp version: ${stdout.trim()}\n`);
      
      return true;
    } catch (npmErr) {
      console.log('❌ npm installation also failed.\n');
      console.log('💡 Manual installation required:');
      console.log('   1. Install Python: https://www.python.org/downloads/');
      console.log('   2. Run: pip install yt-dlp');
      console.log('   3. Or download from: https://github.com/yt-dlp/yt-dlp\n');
      
      return false;
    }
  }
}

async function testYtDlp() {
  console.log('🧪 Testing yt-dlp functionality...\n');
  
  try {
    // Test with a simple YouTube URL
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    console.log(`🔗 Testing with URL: ${testUrl}`);
    
    const { stdout } = await execAsync(`py -m yt_dlp --dump-json "${testUrl}"`, { timeout: 30000 });
    const videoInfo = JSON.parse(stdout);
    
    if (videoInfo && videoInfo.title) {
      console.log(`✅ Test successful! Video title: "${videoInfo.title}"`);
      console.log('🎉 yt-dlp is working correctly!\n');
      return true;
    } else {
      console.log('❌ Test failed: No video info received\n');
      return false;
    }
  } catch (err) {
    console.log(`❌ Test failed: ${err.message}\n`);
    return false;
  }
}

async function main() {
  console.log('🚀 Video Downloader Backend Setup\n');
  console.log('This script will help you set up yt-dlp for video downloading.\n');
  
  const installed = await installYtDlp();
  
  if (installed) {
    const tested = await testYtDlp();
    
    if (tested) {
      console.log('🎊 Setup complete! Your video downloader is ready to use.');
      console.log('\n📝 Next steps:');
      console.log('   1. Start the server: npm run dev');
      console.log('   2. Test with a video URL');
      console.log('   3. Check the README.md for API documentation\n');
    } else {
      console.log('⚠️  Setup completed but testing failed.');
      console.log('   The service will still work with other APIs as fallbacks.\n');
    }
  } else {
    console.log('❌ Setup incomplete. Please install yt-dlp manually.');
    console.log('   The service will still work with other APIs as fallbacks.\n');
  }
}

// Run the setup
main().catch(console.error); 