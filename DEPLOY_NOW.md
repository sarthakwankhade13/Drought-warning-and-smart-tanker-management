# 🚀 Deploy Your Water Governance System

## ✅ What's Ready:
- ✅ Backend connected to Railway MySQL
- ✅ JWT secret generated
- ✅ Environment variables configured
- ✅ Code tested locally

---

## 📋 Deployment Steps

### STEP 1: Push to GitHub (5 minutes)

#### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

#### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `water-governance-system`
3. Make it **Private** (recommended)
4. Don't initialize with README (you already have one)
5. Click "Create repository"

#### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/water-governance-system.git
git branch -M main
git push -u origin main
```

---

### STEP 2: Deploy Backend to Render (10 minutes)

#### 2.1 Sign Up for Render
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)

#### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `water-governance-system`

#### 2.3 Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `water-governance-backend`
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **Free** (for testing)

#### 2.4 Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these variables one by one:

```
NODE_ENV=production
PORT=10000
DB_HOST=trolley.proxy.rlwy.net
DB_PORT=39917
DB_USER=root
DB_PASSWORD=PUTAgSvWAONtsXRhxopIUWDyNRYIlTMt
DB_NAME=water_governance
DB_SSL=false
JWT_SECRET=678f12fddd6a65762a479cd1258ed65df4d1cab49eda48f2c702082dbfd5d08cd0b06e84db1f3723f276126ce8f64cb76646153843645b6ab608430526d0a4a2
WSI_RAINFALL_WEIGHT=0.35
WSI_GROUNDWATER_WEIGHT=0.30
WSI_POPULATION_WEIGHT=0.20
WSI_STORAGE_WEIGHT=0.15
DAILY_WATER_PER_CAPITA=55
HIGH_WSI_THRESHOLD=70
HIGH_WSI_ADJUSTMENT=1.20
OPENWEATHER_API_KEY=71851869d16c0a869d6f18a04de310f6
WEATHER_API_KEY=8bd55672a7ec4256ad775646262302
```

**Important**: We'll add `FRONTEND_URL` after deploying the frontend!

#### 2.5 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Your backend will be at: `https://water-governance-backend.onrender.com`

#### 2.6 Test Backend
Once deployed, test it:
```bash
curl https://water-governance-backend.onrender.com/api/health
```

You should see: `{"status":"ok","message":"Water Governance API is running"}`

---

### STEP 3: Deploy Frontend to Vercel (10 minutes)

#### 3.1 Create Production Environment File
Create `frontend/.env.production` with:

```env
VITE_API_URL=https://water-governance-backend.onrender.com/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

**Replace** `water-governance-backend` with your actual Render service name!

#### 3.2 Commit the Change
```bash
git add frontend/.env.production
git commit -m "Add production environment config"
git push origin main
```

#### 3.3 Sign Up for Vercel
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended)

#### 3.4 Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository: `water-governance-system`
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3.5 Add Environment Variables
In "Environment Variables" section:

```
VITE_API_URL=https://water-governance-backend.onrender.com/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

#### 3.6 Deploy
1. Click "Deploy"
2. Wait 3-5 minutes
3. Your frontend will be at: `https://water-governance-system.vercel.app`

---

### STEP 4: Update CORS (5 minutes)

#### 4.1 Get Your Vercel URL
After Vercel deployment completes, copy your URL (e.g., `https://water-governance-system.vercel.app`)

#### 4.2 Update Render Environment Variables
1. Go to Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Add new variable:

```
FRONTEND_URL=https://water-governance-system.vercel.app
```

(Replace with your actual Vercel URL)

#### 4.3 Redeploy Backend
1. Click "Manual Deploy" → "Deploy latest commit"
2. Wait 2-3 minutes

---

## 🎉 You're Live!

Your application is now deployed:

- **Frontend**: https://water-governance-system.vercel.app
- **Backend**: https://water-governance-backend.onrender.com
- **Database**: Railway MySQL (cloud)

---

## 🧪 Test Your Deployment

### Test Backend
```bash
curl https://water-governance-backend.onrender.com/api/health
```

### Test Frontend
1. Open your Vercel URL
2. Try logging in
3. Check that data loads
4. Open browser DevTools → Network tab
5. Verify API calls go to Render backend

---

## 🔄 Automatic Deployments

Now whenever you push to GitHub:
- ✅ Render automatically redeploys backend
- ✅ Vercel automatically redeploys frontend

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

---

## 🆘 Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify all environment variables are set
- Check Railway database is accessible

### Frontend can't reach backend
- Verify `VITE_API_URL` in Vercel matches Render URL
- Check `FRONTEND_URL` in Render matches Vercel URL
- Look for CORS errors in browser console

### Database connection fails
- Verify Railway credentials in Render environment variables
- Check Railway database is running
- Test connection with `node test-cloud-db.js` locally

---

## 💰 Free Tier Limits

- **Railway**: 500 hours/month, $5 credit
- **Render**: 750 hours/month (sleeps after 15 min inactivity)
- **Vercel**: Unlimited deployments

**Note**: Render free tier sleeps after 15 minutes. First request after sleep takes ~30 seconds to wake up.

---

## 📝 Next Steps After Deployment

1. ✅ Test all features on production
2. ✅ Share your Vercel URL with users
3. ✅ Monitor Render logs for errors
4. ✅ Set up custom domain (optional)
5. ✅ Add monitoring/alerts (optional)

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **GitHub Repository**: https://github.com/YOUR_USERNAME/water-governance-system

---

**Ready to deploy?** Start with STEP 1! 🚀
