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
  const { downloadVideo } = useContext(DownloadContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsDownloading(true);
    setProgress(0);
    setDownloadStatus('Starting download...');
    setError('');

    try {
      await downloadVideo(url, (progressData) => {
        setProgress(progressData.progress || 0);
        setDownloadStatus(progressData.status || 'Downloading...');
      });
      
      setDownloadStatus('Download completed!');
      setUrl(''); // Clear URL after successful download
      
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
    </div>
  );
};

export default DownloadForm;