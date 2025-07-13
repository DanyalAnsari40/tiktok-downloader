# TikTok Video Downloader

A modern, elegant TikTok video downloader built with React and Node.js. Download TikTok videos without watermarks in high quality.

## ✨ Features

- 🎵 **TikTok-only focus** - Optimized for TikTok videos
- 🚀 **Fast downloads** - Efficient download process
- 🎨 **Modern UI** - Beautiful, responsive design
- 📱 **Mobile-friendly** - Works on all devices
- 🔒 **No watermarks** - Clean video downloads
- 💯 **Free forever** - No registration required

## 🚀 Free Hosting Options

### Option 1: Vercel (Recommended)

#### Frontend Deployment (Vercel)
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend:**
   ```bash
   cd forntend
   vercel
   ```
   - Follow the prompts
   - Choose "Create new project"
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Set Environment Variable:**
   - Go to Vercel dashboard
   - Add environment variable: `VITE_API_URL=https://your-backend-url.vercel.app`

#### Backend Deployment (Vercel)
1. **Deploy Backend:**
   ```bash
   cd backend
   vercel
   ```
   - Follow the prompts
   - Choose "Create new project"

2. **Set Environment Variables:**
   - Go to Vercel dashboard
   - Add: `CORS_ORIGINS=https://your-frontend-url.vercel.app`

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend on Netlify
1. **Build the project:**
   ```bash
   cd forntend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag `forntend/dist` folder to Netlify
   - Or connect your GitHub repository

#### Backend on Railway
1. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend folder

2. **Set Environment Variables:**
   - `NODE_ENV=production`
   - `CORS_ORIGINS=https://your-netlify-app.netlify.app`

### Option 3: Render (Both)

#### Frontend on Render
1. **Create Static Site:**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Backend on Render
1. **Create Web Service:**
   - Connect your GitHub repository
   - Build command: `npm install`
   - Start command: `npm start`

## 🛠️ Local Development

### Prerequisites
- Node.js 16+ 
- Python 3.8+ (for yt-dlp)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd video-downloader
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../forntend
   npm install
   ```

3. **Install yt-dlp:**
   ```bash
   pip install yt-dlp
   ```

4. **Start development servers:**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd forntend
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📁 Project Structure

```
video-downloader/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── forntend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-domain.com
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com
```

## 🎯 Usage

1. **Open the app** in your browser
2. **Paste a TikTok URL** in the input field
3. **Click Download** to start the process
4. **Wait for completion** - the video will download automatically

## 🚀 Deployment Checklist

### Before Deployment
- [ ] Update API URLs in frontend
- [ ] Set environment variables
- [ ] Test local build
- [ ] Check CORS settings

### After Deployment
- [ ] Test the live app
- [ ] Verify downloads work
- [ ] Check mobile responsiveness
- [ ] Monitor error logs

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check CORS_ORIGINS environment variable
   - Ensure frontend URL is included

2. **Download Failures:**
   - Verify yt-dlp is installed
   - Check TikTok URL format
   - Monitor server logs

3. **Build Errors:**
   - Clear node_modules and reinstall
   - Check Node.js version (16+)
   - Verify all dependencies

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review server logs
3. Create an issue on GitHub

---

**Happy downloading! 🎵** 