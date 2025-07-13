import api from './api';

export const downloadVideo = async (url) => {
  try {
    console.log('🚀 Starting TikTok download for URL:', url);
    const response = await api.post('/api/download', { url });
    const result = response.data;

    console.log('📥 Backend response received:', result);

    // Check for success status from backend
    if ((result.success || result.status === 'success') && result.downloadUrl) {
      console.log('✅ Download successful, preparing for device download...');

      // Detect mobile device
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isMobile) {
        // On mobile, use the backend proxy endpoint to bypass CORS
        const proxyUrl = `${import.meta.env.VITE_API_URL || ''}/api/download/proxy?url=${encodeURIComponent(result.downloadUrl)}`;
        window.open(proxyUrl, '_blank');
      } else {
        // On desktop, fetch as blob and trigger download
        try {
          const fileResponse = await fetch(result.downloadUrl);
          if (fileResponse.ok) {
            const blob = await fileResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${result.title || 'tiktok_video'}.mp4`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log('✅ File downloaded successfully via direct URL');
          } else {
            throw new Error('Failed to fetch file from direct video URL');
          }
        } catch (fetchError) {
          throw new Error('Failed to download video from direct video URL. Please try again.');
        }
      }
      return result;
    } else if (result.status === 'error') {
      throw new Error(result.message || 'Download failed');
    } else {
      throw new Error(result.msg || 'Download failed');
    }
  } catch (err) {
    const errorMsg = err.response?.data?.msg || err.response?.data?.error || err.message || 'Failed to download TikTok video';
    throw new Error(errorMsg);
  }
};