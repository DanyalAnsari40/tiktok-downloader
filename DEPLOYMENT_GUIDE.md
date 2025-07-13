# 🚀 Deployment Guide: Netlify (Frontend) + Vercel (Backend)

## 📋 Prerequisites
- GitHub account
- Netlify account (free)
- Vercel account (free)

## 🔧 Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

## 🌐 Step 2: Deploy Backend to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Deploy Backend
```bash
cd backend
vercel
```

**Follow the prompts:**
- ✅ Set up and deploy? `Y`
- ✅ Which scope? `Select your account`
- ✅ Link to existing project? `N`
- ✅ What's your project's name? `tiktok-downloader-backend`
- ✅ In which directory is your code located? `./` (current directory)
- ✅ Want to override the settings? `N`

### 2.3 Get Your Backend URL
After deployment, Vercel will give you a URL like:
`https://tiktok-downloader-backend-xxxx.vercel.app`

**Save this URL!** You'll need it for the frontend.

## 🎨 Step 3: Deploy Frontend to Netlify

### 3.1 Method A: Drag & Drop (Easiest)

1. **Build your frontend:**
   ```bash
   cd forntend
   npm run build
   ```

2. **Go to [netlify.com](https://netlify.com)**
3. **Drag the `forntend/dist` folder** to the Netlify dashboard
4. **Your site will be deployed instantly!**

### 3.2 Method B: Connect GitHub Repository

1. **Go to [netlify.com](https://netlify.com)**
2. **Click "New site from Git"**
3. **Choose GitHub** and authorize
4. **Select your repository**
5. **Configure build settings:**
   - **Base directory:** `forntend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. **Click "Deploy site"**

### 3.3 Get Your Frontend URL
Netlify will give you a URL like:
`https://your-app-name.netlify.app`

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Frontend (Netlify)
1. **Go to your Netlify dashboard**
2. **Site settings → Environment variables**
3. **Add variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.vercel.app`

### 4.2 Backend (Vercel)
1. **Go to your Vercel dashboard**
2. **Project settings → Environment variables**
3. **Add variable:**
   - **Key:** `CORS_ORIGINS`
   - **Value:** `https://your-frontend-url.netlify.app`

## 🔄 Step 5: Redeploy

### 5.1 Redeploy Frontend
After setting environment variables in Netlify:
1. **Go to your site dashboard**
2. **Click "Trigger deploy"**
3. **Choose "Clear cache and deploy site"**

### 5.2 Redeploy Backend
After setting environment variables in Vercel:
1. **Go to your project dashboard**
2. **Click "Redeploy"**

## ✅ Step 6: Test Your App

1. **Open your frontend URL**
2. **Try downloading a TikTok video**
3. **Check the browser console for any errors**
4. **Verify the download works**

## 🐛 Troubleshooting

### Common Issues:

#### 1. CORS Errors
**Solution:** Make sure your backend CORS_ORIGINS includes your frontend URL exactly.

#### 2. API Not Found
**Solution:** Check that VITE_API_URL is set correctly in Netlify.

#### 3. Build Failures
**Solution:** 
- Check Node.js version (use 18)
- Clear cache and redeploy
- Check build logs in Netlify dashboard

#### 4. Download Not Working
**Solution:**
- Check Vercel function logs
- Verify yt-dlp is available on Vercel
- Test with a simple TikTok URL

## 📊 Monitoring

### Netlify Dashboard
- **Deploy status**
- **Build logs**
- **Environment variables**
- **Domain settings**

### Vercel Dashboard
- **Function logs**
- **Environment variables**
- **Performance metrics**
- **Error tracking**

## 🔗 Custom Domain (Optional)

### Netlify Custom Domain
1. **Site settings → Domain management**
2. **Add custom domain**
3. **Update DNS records**

### Vercel Custom Domain
1. **Project settings → Domains**
2. **Add domain**
3. **Update DNS records**

## 🎉 Success!

Your TikTok video downloader is now live with:
- ✅ **Frontend:** Netlify (free)
- ✅ **Backend:** Vercel (free)
- ✅ **Custom domain:** Optional
- ✅ **Automatic deployments:** On Git push

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review build logs
3. Verify environment variables
4. Test locally first

---

**Happy deploying! 🚀** 