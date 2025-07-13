import api from './api';

export const downloadVideo = async (url) => {
  try {
    console.log('🚀 Starting TikTok download for URL:', url);
    const response = await api.post('/api/download', { url });
    const result = response.data;
    
    console.log('📥 Backend response received:', result);
    
    // Check for success status from backend
    if ((result.success || result.status === 'success') && result.downloadUrl) {
      console.log('✅ Download successful, triggering browser download...');
      
      // Always use the direct downloadUrl from the backend
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
          console.error('❌ File response not OK:', fileResponse.status, fileResponse.statusText);
          throw new Error('Failed to fetch file from direct video URL');
        }
      } catch (fetchError) {
        console.error('❌ Fetch download failed:', fetchError);
        throw new Error('Failed to download video from direct video URL. Please try again.');
      }
      return result;
    } else if (result.status === 'error') {
      console.log('❌ Backend returned error:', result.message);
      throw new Error(result.message || 'Download failed');
    } else {
      console.log('❓ Unexpected response format:', result);
      throw new Error(result.msg || 'Download failed');
    }
  } catch (err) {
    console.error('💥 Download error:', err);
    const errorMsg = err.response?.data?.msg || err.response?.data?.error || err.message || 'Failed to download TikTok video';
    throw new Error(errorMsg);
  }
};