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
  const [lastDownloadUrl, setLastDownloadUrl] = useState(null);
  const [showMobileError, setShowMobileError] = useState(false);
  const { downloadVideo } = useContext(DownloadContext);

  // Helper: Detect if user is on mobile
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  // Helper: Detect if user is on mobile but has enabled desktop site (window width > 900px)
  const isMobileDesktopSite = isMobile && window.innerWidth > 900;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsDownloading(true);
    setProgress(0);
    setDownloadStatus('Starting download...');
    setError('');
    setShowPostDownload(false);
    setLastDownloadUrl(null);
    setShowMobileError(false);

    try {
      // If on mobile but desktop site is enabled, treat as desktop
      const result = await downloadVideo(url, (progressData) => {
        setProgress(progressData.progress || 0);
        setDownloadStatus(progressData.status || 'Downloading...');
      }, isMobileDesktopSite);

      // If a valid downloadUrl is returned, show post-download popup (even on mobile)
      if (result && result.downloadUrl) {
        setDownloadStatus('Download completed!');
        setUrl(''); // Clear URL after successful download
        setShowPostDownload(true);
        setLastDownloadUrl(result.downloadUrl);
        setTimeout(() => {
          setIsDownloading(false);
          setProgress(0);
          setDownloadStatus('');
        }, 2000);
        return;
      }

      // If no valid downloadUrl, treat as error
      throw new Error(result && result.message ? result.message : 'Download failed. Please try again.');
    } catch (error) {
      console.error('Download failed:', error);
      setError(error.message || 'Download failed. Please try again.');
      setDownloadStatus('Download failed!');
      // Only show mobile error popup if there is no valid downloadUrl
      if (isMobile && !isMobileDesktopSite) {
        setShowMobileError(true);
      }
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
        setDownloadStatus('');
        setError('');
      }, 3000);
    }
  };

  // Handler for Save to Device button
  const handleSaveToDevice = () => {
    if (lastDownloadUrl) {
      window.open(lastDownloadUrl, '_blank');
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
        {error && !showMobileError && (
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
            {isMobile && lastDownloadUrl && (
              <>
                <Button onClick={handleSaveToDevice} className="download-btn" style={{ marginBottom: 12 }}>
                  Save to Device
                </Button>
                <div style={{ marginBottom: 16, fontSize: 15 }}>
                  <b>How to add to your gallery:</b>
                  <ul style={{ textAlign: 'left', margin: '8px 0 0 0', paddingLeft: 18 }}>
                    <li><b>Android:</b> Open the <b>Files</b> or <b>Downloads</b> app, find the video, and move or share it to your Gallery/Photos app.</li>
                    <li><b>iPhone/iPad:</b> Open the <b>Files</b> app, go to Downloads, tap the video, then tap <b>Share</b> &rarr; <b>Save Video</b> to add it to Photos.</li>
                  </ul>
                </div>
              </>
            )}
            <Button onClick={() => setShowPostDownload(false)} className="download-btn" style={{ marginTop: 8 }}>
              OK
            </Button>
          </div>
        </div>
      )}

      {/* Mobile-friendly error popup with animation and Desktop Site tip */}
      {showMobileError && (
        <div className="download-popup">
          <div className="download-popup-content" style={{ textAlign: 'center', animation: 'shake 0.5s' }}>
            <div style={{ fontSize: 48, marginBottom: 12, color: '#fe2c55', animation: 'bounce 1s infinite alternate' }}>📱</div>
            <h3 style={{ color: '#fe2c55', marginBottom: 10 }}>Download Not Supported on Mobile</h3>
            <p style={{ color: '#444', marginBottom: 16 }}>
              Sorry, due to TikTok and browser restrictions, some videos cannot be downloaded directly on mobile devices.<br />
              <b>For best results, please use a desktop browser.</b>
            </p>
            <div style={{ background: '#fff7f7', borderRadius: 12, padding: 12, margin: '12px 0', color: '#fe2c55', fontWeight: 500, animation: 'fadeIn 0.7s' }}>
              <span style={{ fontSize: 18, marginRight: 6 }}>💡</span>
              <span>Tip: Tap your browser menu and select <b>“Desktop Site”</b> for better download success on mobile!</span>
            </div>
            <Button onClick={() => setShowMobileError(false)} className="download-btn" style={{ marginTop: 8 }}>
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadForm;