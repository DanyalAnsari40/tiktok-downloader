import { motion } from 'framer-motion';


export default function About() {
  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>About Video Downloader</h1>
      
      <div className="about-content">
        <p>
          Video Downloader is a powerful and user-friendly application that allows you to download 
          videos from popular social media platforms like TikTok and Instagram. Our platform provides 
          a secure, fast, and reliable way to save your favorite videos for offline viewing.
        </p>
        
        <h2>Features</h2>
        <ul>
          <li><strong>Multi-Platform Support:</strong> Download videos from TikTok and Instagram</li>
          <li><strong>High Quality:</strong> Get videos in the best available quality</li>
          <li><strong>No Watermarks:</strong> Clean downloads without platform watermarks</li>
          <li><strong>Fast Downloads:</strong> Quick processing and download speeds</li>
          <li><strong>User Dashboard:</strong> Track your download history</li>
          <li><strong>Secure:</strong> Your data is protected with encryption</li>
        </ul>
        
        <h2>How It Works</h2>
        <p>
          Simply paste the URL of the video you want to download, select the platform, and click 
          download. Our system will process the video and provide you with a direct download link. 
          The process is quick, secure, and doesn't require any software installation.
        </p>
        
        <h2>Supported Platforms</h2>
        <ul>
          <li><strong>TikTok:</strong> Download TikTok videos without watermarks</li>
          <li><strong>Instagram:</strong> Download Instagram posts, reels, and stories</li>
        </ul>
        
        <h2>Privacy & Security</h2>
        <p>
          We take your privacy seriously. We don't store your downloaded videos on our servers, 
          and all download links are temporary. Your personal information is encrypted and never 
          shared with third parties.
        </p>
        
        <h2>Terms of Use</h2>
        <p>
          Please ensure you have the right to download the content you're accessing. Respect 
          copyright laws and only download content you own or have permission to download. 
          We are not responsible for any misuse of downloaded content.
        </p>
      </div>
    </motion.div>
  );
}