# Vercel Backend Deployment Guide

## Step 1: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import repository: `DanyalAnsari40/tiktok-downloader`
5. Configure settings:
   - **Framework Preset:** Node.js
   - **Root Directory:** `backend`
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`
   - **Development Command:** `npm run dev`

## Step 2: Environment Variables

Add these environment variables in Vercel:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `CORS_ORIGINS` | `https://tik-downloader.netlify.app` |

## Step 3: Deploy

Click "Deploy" and wait for deployment to complete.

## Step 4: Get Backend URL

Your backend URL will be something like:
`https://tiktok-downloader-backend.vercel.app`

## Step 5: Update Frontend

1. Go to [netlify.com](https://netlify.com)
2. Find your site: `tik-downloader.netlify.app`
3. Go to Site settings → Environment variables
4. Add environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-vercel-backend-url.vercel.app`
5. Trigger a new deploy

## Step 6: Test

- Frontend: https://tik-downloader.netlify.app/
- Backend: https://your-vercel-backend-url.vercel.app

## Troubleshooting

If you get CORS errors:
1. Make sure `CORS_ORIGINS` includes your Netlify URL
2. Check that the environment variable is set correctly in Vercel

If downloads don't work:
1. Check Vercel logs for errors
2. Make sure yt-dlp is working in the Vercel environment
3. Test the backend URL directly: `https://your-backend-url.vercel.app/api/health` 