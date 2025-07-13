import React, { useState, useContext } from 'react';
import { DownloadContext } from '../../context/DownloadContext';
import Button from '../UI/Button';
import Loader from '../UI/Loader';
import './DownloadForm.css';

const DownloadForm = () => {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [error, setError] = useState('');
  const [showPostDownload, setShowPostDownload] = useState(false);
  const { downloadVideo } = useContext(DownloadContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsDownloading(true);
    setProgress(0);
    setDownloadStatus('Starting download...');
    setError('');
    setShowPostDownload(false);

    try {
      await downloadVideo(url, (progressData) => {
        setProgress(progressData.progress || 0);
        setDownloadStatus(progressData.status || 'Downloading...');
      });
      setDownloadStatus('Download completed!');
      setUrl(''); // Clear URL after successful download
      setShowPostDownload(true);
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
        setDownloadStatus('');
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setError(error.message || 'Download failed. Please try again.');
      setDownloadStatus('Download failed!');
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
        setDownloadStatus('');
        setError('');
      }, 3000);
    }
  };

  // Detect mobile device
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div className="download-form-container">
      <form onSubmit={handleSubmit} className="download-form">
        <div className="input-group">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste TikTok video URL here..."
            className="url-input"
            disabled={isDownloading}
          />
          <Button 
            type="submit" 
            disabled={!url.trim() || isDownloading}
            className="download-btn"
          >
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </div>
        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </form>

      {/* Download Animation Popup */}
      {isDownloading && (
        <div className="download-popup">
          <div className="download-popup-content">
            <div className="progress-circle">
              <div className="progress-circle-inner">
                <div className="progress-text">{Math.round(progress)}%</div>
              </div>
              <svg className="progress-ring" width="120" height="120">
                <circle
                  className="progress-ring-bg"
                  stroke="#e0e0e0"
                  strokeWidth="8"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                />
                <circle
                  className="progress-ring-fill"
                  stroke="#fe2c55"
                  strokeWidth="8"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
            </div>
            <div className="download-status">{downloadStatus}</div>
            <Loader />
          </div>
        </div>
      )}

      {/* Post-download popup for mobile instructions */}
      {showPostDownload && (
        <div className="download-popup">
          <div className="download-popup-content">
            <h3 style={{ color: '#fe2c55', marginBottom: 12 }}>Video Saved!</h3>
            <p style={{ marginBottom: 16 }}>
              The video has been saved to your device's Downloads folder.
            </p>
            {isMobile && (
              <div style={{ marginBottom: 16, fontSize: 15 }}>
                <b>How to add to your gallery:</b>
                <ul style={{ textAlign: 'left', margin: '8px 0 0 0', paddingLeft: 18 }}>
                  <li><b>Android:</b> Open the <b>Files</b> or <b>Downloads</b> app, find the video, and move or share it to your Gallery/Photos app.</li>
                  <li><b>iPhone/iPad:</b> Open the <b>Files</b> app, go to Downloads, tap the video, then tap <b>Share</b> &rarr; <b>Save Video</b> to add it to Photos.</li>
                </ul>
              </div>
            )}
            <Button onClick={() => setShowPostDownload(false)} className="download-btn" style={{ marginTop: 8 }}>
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadForm;