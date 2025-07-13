#!/bin/bash

echo "🚀 TikTok Video Downloader - Deployment Script"
echo "=============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo ""
echo "📦 Building frontend..."
cd forntend
npm run build

echo ""
echo "🌐 Deploying frontend to Vercel..."
vercel --prod

echo ""
echo "🔧 Deploying backend to Vercel..."
cd ../backend
vercel --prod

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Get your frontend URL from Vercel dashboard"
echo "2. Get your backend URL from Vercel dashboard"
echo "3. Set environment variables:"
echo "   - Frontend: VITE_API_URL=https://your-backend-url.vercel.app"
echo "   - Backend: CORS_ORIGINS=https://your-frontend-url.vercel.app"
echo ""
echo "🎉 Your app is now live!" 