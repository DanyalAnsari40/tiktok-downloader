import React, { createContext, useContext, useState } from 'react';
import { downloadVideo as apiDownloadVideo } from '../services/download';

const DownloadContext = createContext();

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error('useDownload must be used within a DownloadProvider');
  }
  return context;
};

export const DownloadContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const downloadVideo = async (url, progressCallback) => {
    console.log('🎯 DownloadContext: Starting download for URL:', url);
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Start with initial progress
      if (progressCallback) {
        console.log('📊 Progress: 0% - Starting download...');
        progressCallback({
          progress: 0,
          status: 'Starting download...'
        });
      }

      // Quick initial processing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (progressCallback) {
        console.log('📊 Progress: 15% - Analyzing video...');
        progressCallback({
          progress: 15,
          status: 'Analyzing video...'
        });
      }

      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (progressCallback) {
        console.log('📊 Progress: 35% - Preparing download...');
        progressCallback({
          progress: 35,
          status: 'Preparing download...'
        });
      }

      // Start the actual download
      console.log('🚀 DownloadContext: Calling API download...');
      const result = await apiDownloadVideo(url);
      console.log('✅ DownloadContext: API download completed successfully');
      
      // Quick processing simulation
      if (progressCallback) {
        console.log('📊 Progress: 70% - Processing video...');
        progressCallback({
          progress: 70,
          status: 'Processing video...'
        });
      }

      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (progressCallback) {
        console.log('📊 Progress: 85% - Finalizing...');
        progressCallback({
          progress: 85,
          status: 'Finalizing...'
        });
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Complete the progress
      if (progressCallback) {
        console.log('📊 Progress: 100% - Download completed!');
        progressCallback({
          progress: 100,
          status: 'Download completed!'
        });
      }

      setSuccess('Video downloaded successfully!');
      return result;
    } catch (err) {
      console.error('💥 DownloadContext: Download error:', err);
      setError(err.message || 'Download failed. Please try again.');
      throw err;
    } finally {
      console.log('🏁 DownloadContext: Download process finished');
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const value = {
    downloadVideo,
    isLoading,
    error,
    success,
    clearError,
    clearSuccess
  };

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
};

export { DownloadContext };
