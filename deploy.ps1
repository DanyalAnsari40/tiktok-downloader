# TikTok Video Downloader - Deployment Script (PowerShell)

Write-Host "🚀 TikTok Video Downloader - Deployment Script" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host ""
Write-Host "📦 Building frontend..." -ForegroundColor Cyan
Set-Location forntend
npm run build

Write-Host ""
Write-Host "🌐 Deploying frontend to Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "🔧 Deploying backend to Vercel..." -ForegroundColor Cyan
Set-Location ../backend
vercel --prod

Write-Host ""
Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Get your frontend URL from Vercel dashboard"
Write-Host "2. Get your backend URL from Vercel dashboard"
Write-Host "3. Set environment variables:"
Write-Host "   - Frontend: VITE_API_URL=https://your-backend-url.vercel.app"
Write-Host "   - Backend: CORS_ORIGINS=https://your-frontend-url.vercel.app"
Write-Host ""
Write-Host "🎉 Your app is now live!" -ForegroundColor Green 