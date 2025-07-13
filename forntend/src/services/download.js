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
      
      // Handle different types of responses - PRIORITIZE LOCAL DOWNLOADS
      if (result.isBlob) {
        // Blob URL - anti-download protection
        throw new Error(result.message || 'Video download blocked by anti-download protection');
      } else if (result.isDataUrl) {
        // Data URL - partial success
        throw new Error('Video frame captured but full download not available');
      } else if (result.downloadUrl.startsWith('/downloads/')) {
        // LOCAL FILE - PRIORITY: Download from backend
        console.log('📁 Triggering local file download:', result.downloadUrl);
        
        try {
          const fileResponse = await fetch(`http://localhost:5000${result.downloadUrl}`);
          console.log('📡 File response status:', fileResponse.status);
          
          if (fileResponse.ok) {
            const blob = await fileResponse.blob();
            console.log('📦 Blob created, size:', blob.size, 'bytes');
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${result.title || 'tiktok_video'}.mp4`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log('✅ File downloaded successfully via fetch from backend');
          } else {
            console.error('❌ File response not OK:', fileResponse.status, fileResponse.statusText);
            throw new Error('Failed to fetch file from backend');
          }
        } catch (fetchError) {
          console.error('❌ Fetch download failed:', fetchError);
          throw new Error('Failed to download video from server. Please try again.');
        }
      } else if (result.downloadUrl.startsWith('http')) {
        // External URL - ONLY if no local file available
        console.log('🌐 No local file available, trying external URL:', result.downloadUrl);
        
        // Fallback - try to download anyway
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `${result.title || 'tiktok_video'}.mp4`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('🔗 Download link clicked:', result.downloadUrl);
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