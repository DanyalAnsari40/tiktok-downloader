# Netlify Frontend Deployment Guide

## Option 1: Deploy from GitHub Repository (Recommended)

### Step 1: Connect Repository
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select repository: `DanyalAnsari40/tiktok-downloader`

### Step 2: Configure Build Settings
```
Base directory: forntend
Build command: npm run build
Publish directory: dist
Node version: 18
```

### Step 3: Add Environment Variables
Click "Show advanced" and add:
- **Key:** `VITE_API_URL`
- **Value:** `https://tiktok-downloader-self.vercel.app`

### Step 4: Deploy
Click "Deploy site"

## Option 2: Update Existing Site

### Step 1: Connect Git to Existing Site
1. Go to your site: `tik-downloader.netlify.app`
2. Site settings → Build & deploy
3. Click "Connect to Git"
4. Select repository: `DanyalAnsari40/tiktok-downloader`

### Step 2: Configure Settings
```
Base directory: forntend
Build command: npm run build
Publish directory: dist
```

### Step 3: Add Environment Variable
- Go to Site settings → Environment variables
- Add: `VITE_API_URL` = `https://tiktok-downloader-self.vercel.app`

### Step 4: Trigger Deploy
- Go to Deploys tab
- Click "Trigger deploy"

## Option 3: Manual Upload (Current Method)

If you prefer to keep using drag & drop:

### Step 1: Build Locally
```bash
cd forntend
npm install
npm run build
```

### Step 2: Upload dist folder
- Drag the `forntend/dist` folder to Netlify
- Add environment variable in site settings

## Environment Variables Required

**For all methods, add this environment variable:**
- **Key:** `VITE_API_URL`
- **Value:** `https://tiktok-downloader-self.vercel.app`

## Troubleshooting

### Build Fails
- Check Node.js version (use 18 or latest)
- Make sure all dependencies are in package.json
- Check build logs for errors

### API Not Working
- Verify environment variable is set correctly
- Check browser console for CORS errors
- Test backend health: https://tiktok-downloader-self.vercel.app/api/health

### Site Not Loading
- Check if build completed successfully
- Verify publish directory is correct
- Check deployment logs

## Your Current Setup
- **Repository:** https://github.com/DanyalAnsari40/tiktok-downloader
- **Backend:** https://tiktok-downloader-self.vercel.app/
- **Frontend:** https://tik-downloader.netlify.app/ 