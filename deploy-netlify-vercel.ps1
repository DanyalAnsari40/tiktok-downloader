# TikTok Video Downloader - Netlify + Vercel Deployment Script

Write-Host "🚀 TikTok Video Downloader - Netlify + Vercel Deployment" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host ""
Write-Host "🔧 Step 1: Deploying Backend to Vercel..." -ForegroundColor Cyan
Set-Location backend
Write-Host "Running: vercel --prod" -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "📦 Step 2: Building Frontend for Netlify..." -ForegroundColor Cyan
Set-Location ../forntend
Write-Host "Running: npm run build" -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "✅ Deployment Steps Completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Backend deployed to Vercel ✅"
Write-Host "2. Frontend built in forntend/dist ✅"
Write-Host ""
Write-Host "🎨 Deploy Frontend to Netlify:" -ForegroundColor Cyan
Write-Host "   Option A: Drag forntend/dist folder to netlify.com"
Write-Host "   Option B: Connect GitHub repo to Netlify"
Write-Host ""
Write-Host "⚙️ Configure Environment Variables:" -ForegroundColor Cyan
Write-Host "   Frontend (Netlify): VITE_API_URL=https://your-backend-url.vercel.app"
Write-Host "   Backend (Vercel): CORS_ORIGINS=https://your-frontend-url.netlify.app"
Write-Host ""
Write-Host "🎉 Your app will be live after these steps!" -ForegroundColor Green 