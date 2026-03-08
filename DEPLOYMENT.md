# Deployment Guide

## Prerequisites
- ✅ Database on Railway (DONE)
- ✅ Code on GitHub
- Railway account
- Vercel account

## Step 1: Deploy Backend to Railway

### 1.1 Push Configuration Files to GitHub
```bash
git add Procfile railway.json nixpacks.toml DEPLOYMENT.md
git commit -m "Add Railway deployment configuration"
git push origin main
```

### 1.2 Deploy on Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect it's a Node.js project

### 1.3 Configure Environment Variables

In Railway dashboard, go to your backend service → Variables tab → Add these:

```
NODE_ENV=production
PORT=5000

# Database (use existing MySQL service variables)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQL_ROOT_PASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_SSL=true

# JWT Secret (copy from your local .env)
JWT_SECRET=your_jwt_secret_here

# WSI Configuration
WSI_RAINFALL_WEIGHT=0.35
WSI_GROUNDWATER_WEIGHT=0.30
WSI_POPULATION_WEIGHT=0.20
WSI_STORAGE_WEIGHT=0.15

# Demand Calculation
DAILY_WATER_PER_CAPITA=55
HIGH_WSI_THRESHOLD=70
HIGH_WSI_ADJUSTMENT=1.20

# API Keys (optional)
OPENWEATHER_API_KEY=71851869d16c0a869d6f18a04de310f6
WEATHER_API_KEY=8bd55672a7ec4256ad775646262302
```

### 1.4 Link MySQL Service

1. In Railway, click on your backend service
2. Go to Settings → Service Variables
3. Click "Add Variable Reference"
4. Select your MySQL service
5. This automatically connects backend to database

### 1.5 Get Backend URL

After deployment completes:
1. Go to Settings → Networking
2. Click "Generate Domain"
3. Copy the URL (e.g., `https://your-backend.up.railway.app`)

### 1.6 Update CORS

Add your Vercel frontend URL to CORS in `backend/server.js`:
```javascript
origin: [
  'http://localhost:5173',
  'https://your-frontend.vercel.app', // Add this
  process.env.FRONTEND_URL
]
```

## Step 2: Deploy Frontend to Vercel

### 2.1 Update Frontend Environment Variables

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2.2 Push to GitHub
```bash
git add frontend/.env.production
git commit -m "Add production environment config"
git push origin main
```

### 2.3 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.4 Add Environment Variables in Vercel

In Vercel dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2.5 Deploy

Click "Deploy" and wait for build to complete.

## Step 3: Final Configuration

### 3.1 Update Backend CORS

Add your Vercel URL to Railway backend environment variables:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

### 3.2 Test Your Deployment

1. Visit your Vercel URL
2. Try logging in with: `admin@water.gov` / `admin123`
3. Check if data loads correctly

## Troubleshooting

### Backend Issues
- Check Railway logs: Service → Deployments → View Logs
- Verify environment variables are set
- Ensure MySQL service is linked

### Frontend Issues
- Check Vercel logs: Deployment → Function Logs
- Verify API URL is correct
- Check browser console for CORS errors

### Database Issues
- Verify tables exist: Run `node init-db.js` locally first
- Check Railway MySQL is running
- Veri