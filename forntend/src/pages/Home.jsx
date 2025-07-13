import React from 'react';
import DownloadForm from '../components/Download/DownloadForm';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="tiktok-icon">🎵</span>
            TikTok Video Downloader
          </h1>
          <p className="hero-subtitle">
            Download TikTok videos without watermark in high quality
          </p>
        </div>
      </div>
      
      <div className="download-section">
        <DownloadForm />
      </div>
      
      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Download</h3>
            <p>Download videos instantly with our optimized servers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>No Watermark</h3>
            <p>Get clean videos without any watermarks or logos</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>High Quality</h3>
            <p>Download videos in the best available quality</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🆓</div>
            <h3>Free Forever</h3>
            <p>No registration, no limits, completely free</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;