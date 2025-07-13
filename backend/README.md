# Video Downloader Backend

A comprehensive video downloader backend service that supports multiple platforms including TikTok, Instagram, and YouTube with multiple fallback APIs for maximum reliability.

## Features

- **Multi-Platform Support**: TikTok, Instagram, YouTube
- **Multiple API Fallbacks**: Each platform has multiple API options for maximum success rate
- **yt-dlp Integration**: Uses yt-dlp for reliable video extraction
- **Web Scraping**: Advanced web scraping with Puppeteer for difficult cases
- **Error Handling**: Comprehensive error handling and fallback mechanisms

## Supported APIs

### TikTok APIs

| API / Tool                     | Type                                     | Link                                                                 |
| ------------------------------ | ---------------------------------------- | -------------------------------------------------------------------- |
| ✅ **tikwm.com API**            | REST API                                 | [https://tikwm.com/api/](https://tikwm.com/api/)                     |
| ✅ **TTSave.app API**           | REST API                                 | [https://ttsave.app/api](https://ttsave.app/api)                     |
| ✅ **SnapTik unofficial**       | No official API (web scrape / form POST) | [https://snaptik.app/](https://snaptik.app/)                         |
| ✅ **allinone.tools API**       | Multi-platform API                       | [https://allinone.tools/](https://allinone.tools/)                   |
| ✅ **yt-dlp (via yt-dlp-exec)** | Open source CLI tool (use in Node)       | [https://github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp) |
| ✅ **RapidAPI TikTok Downloader** | REST API                              | [https://rapidapi.com/](https://rapidapi.com/)                       |

### Instagram APIs

| API / Tool                          | Type                                                  | Link                                                                                                                                                                                                             |
| ----------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **RapidAPI Instagram Downloader** | REST API                                              | [https://rapidapi.com/solutionsbynotnull/api/instagram-downloader-download-instagram-videos-and-photos/](https://rapidapi.com/solutionsbynotnull/api/instagram-downloader-download-instagram-videos-and-photos/) |
| ✅ **SaveInsta**                     | Unofficial endpoint (usually used by scraper proxies) | [https://saveinsta.app/](https://saveinsta.app/)                                                                                                                                                               |
| ✅ **allinone.tools API**            | Multi-platform API                                    | [https://allinone.tools/](https://allinone.tools/)                                                                                                                                                               |
| ✅ **yt-dlp (via yt-dlp-exec)**      | Open source CLI tool                                  | [https://github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp)                                                                                                                                           |

### YouTube APIs

| API / Tool                     | Type                                     | Link                                                                 |
| ------------------------------ | ---------------------------------------- | -------------------------------------------------------------------- |
| ✅ **yt-dlp (via yt-dlp-exec)** | Open source CLI tool (use in Node)       | [https://github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp) |
| ✅ **YouTube oEmbed API**        | Official YouTube API                     | [https://oembed.com/](https://oembed.com/)                           |

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install yt-dlp (optional but recommended):
```bash
pip install yt-dlp
```

3. Set up environment variables (optional):
```bash
# Create .env file
RAPIDAPI_KEY=your_rapidapi_key_here
```

## Usage

### API Endpoints

#### Download TikTok Video
```http
POST /api/download/tiktok
Content-Type: application/json

{
  "url": "https://www.tiktok.com/@username/video/1234567890"
}
```

#### Download Instagram Video
```http
POST /api/download/instagram
Content-Type: application/json

{
  "url": "https://www.instagram.com/p/ABC123/"
}
```

#### Download YouTube Video
```http
POST /api/download/youtube
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### Response Format

```json
{
  "title": "Video Title",
  "author": "Author Name",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "downloadUrl": "https://example.com/video.mp4",
  "duration": 120,
  "platform": "tiktok|instagram|youtube",
  "status": "success|error",
  "methodUsed": "yt-dlp|rapidapi|savefrom|etc",
  "message": "Optional message for errors"
}
```

## API Priority Order

### TikTok
1. **yt-dlp** (most reliable)
2. **Enhanced Web Scraping** (Puppeteer)
3. **TikWM.com API**
4. **TTSave.app API**
5. **SnapTik Unofficial**
6. **AllInOne.tools API**
7. **RapidAPI TikTok Downloader**
8. **Alternative Scraping**

### Instagram
1. **SaveFrom API** (most reliable)
2. **RapidAPI Instagram Downloader**
3. **Instagram Downloader API**
4. **Instagram Mobile API**
5. **SaveInsta API**
6. **AllInOne.tools API**
7. **yt-dlp**
8. **Puppeteer Scraping** (fallback)

### YouTube
1. **yt-dlp** (most reliable)
2. **YouTube oEmbed API** (fallback)

## Configuration

### RapidAPI Keys (Optional)

For better reliability, you can add your RapidAPI keys to the environment variables:

```bash
# .env file
RAPIDAPI_KEY=your_rapidapi_key_here
```

### yt-dlp Configuration

The service will automatically try to install yt-dlp if it's not found. You can also install it manually:

```bash
# Using pip
pip install yt-dlp

# Using npm (alternative)
npm install -g yt-dlp
```

## Error Handling

The service includes comprehensive error handling:

- **Invalid URLs**: Validates platform-specific URL formats
- **API Failures**: Automatically tries next API in the priority list
- **Network Issues**: Timeout handling and retry logic
- **Rate Limiting**: Graceful handling of API rate limits
- **Blob URLs**: Special handling for Instagram's anti-download protection

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running in Production
```bash
npm start
```

### Testing
```bash
npm test
```

## Troubleshooting

### Common Issues

1. **yt-dlp not found**: The service will try to install it automatically, but you can install it manually with `pip install yt-dlp`

2. **API rate limits**: The service automatically tries multiple APIs, so if one is rate-limited, it will use another

3. **Blob URLs**: Instagram sometimes returns blob URLs which can't be downloaded directly. The service will inform you when this happens

4. **Private videos**: Some videos may be private or unavailable. The service will return an appropriate error message

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
DEBUG=true npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see LICENSE file for details.

## Disclaimer

This service is for educational purposes only. Please respect the terms of service of the platforms you're downloading from and ensure you have the right to download the content. 