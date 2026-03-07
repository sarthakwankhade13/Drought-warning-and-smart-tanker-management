# 🚂 Railway Database Setup Guide

## ✅ You've Already Done: Import Database to Railway

Great! Now let's configure your backend to connect to it.

---

## 📋 Step 1: Get Railway Connection Details

1. Go to your Railway dashboard: https://railway.app/dashboard
2. Click on your MySQL database service
3. Go to the **"Connect"** or **"Variables"** tab
4. Copy these values:

```
MYSQLHOST=mysql.railway.internal
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=FUJITSU
MYSQLDATABASE=railway
```

---

## 📝 Step 2: Update Your Backend .env File

Open `backend/.env` and update with your Railway credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Railway MySQL Database
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=xxxx
DB_USER=root
DB_PASSWORD=your_railway_password_here
DB_NAME=railway
DB_SSL=true

# Frontend URL (update after deploying frontend)
FRONTEND_URL=http://localhost:5173

# JWT Secret (generate a new one for production)
JWT_SECRET=your_jwt_secret_here

# WSI Weight Configuration
WSI_RAINFALL_WEIGHT=0.35
WSI_GROUNDWATER_WEIGHT=0.30
WSI_POPULATION_WEIGHT=0.20
WSI_STORAGE_WEIGHT=0.15

# Demand Calculation
DAILY_WATER_PER_CAPITA=55
HIGH_WSI_THRESHOLD=70
HIGH_WSI_ADJUSTMENT=1.20

# API Keys
WEATHER_API_KEY=
GOVERNMENT_API_KEY=
```

**Important**: Replace the Railway values with your actual credentials from Step 1!

---

## 🔐 Step 3: Generate Secure JWT Secret

Run this command to generate a secure JWT secret:

```bash
cd backend
node generate-jwt-secret.js
```

Copy the output and paste it as your `JWT_SECRET` in the `.env` file.

---

## 🧪 Step 4: Test the Connection

Test if your backend can connect to Railway:

```bash
cd backend
node test-cloud-db.js
```

**Expected Output**:
```
Testing cloud database connection...
Host: containers-us-west-xxx.railway.app
Database: railway
User: root
✅ Connection successful!
Database is accessible and ready to use.
```

**If you see errors**, check:
- ✅ DB_HOST is correct (no http://, just the hostname)
- ✅ DB_PORT is correct (usually 4 digits)
- ✅ DB_PASSWORD is correct (copy-paste from Railway)
- ✅ DB_SSL=true is set

---

## 🚀 Step 5: Start Your Backend

```bash
cd backend
npm install
npm run dev
```

Your backend should now connect to Railway MySQL! 🎉

---

## 🔍 Verify Tables Exist

Check if your tables were imported correctly:

```bash
# Connect to Railway MySQL
mysql -h YOUR_RAILWAY_HOST -P YOUR_PORT -u root -p railway

# Once connected, run:
SHOW TABLES;
```

You should see:
```
+---------------------------+
| Tables_in_railway         |
+---------------------------+
| Alerts                    |
| Allocations               |
| GroundwaterRecords        |
| RainfallRecords           |
| Tankers                   |
| Users                     |
| Villages                  |
| WaterShortageReports      |
+---------------------------+
```

---

## 📊 What Changed in database.js

The updated `backend/config/database.js` now includes:

1. **Port Support**: `port: process.env.DB_PORT || 3306`
   - Railway uses custom ports (not default 3306)

2. **SSL Configuration**: 
   ```javascript
   dialectOptions: {
     ssl: process.env.DB_SSL === 'true' ? {
       require: true,
       rejectUnauthorized: false
     } : false
   }
   ```
   - Railway requires SSL for secure connections

3. **Connection Timeout**: `connectTimeout: 60000`
   - Cloud databases need longer timeout (60 seconds)

---

## 🔄 Switch Between Local and Railway

### Use Railway (Cloud)
```env
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=xxxx
DB_USER=root
DB_PASSWORD=railway_password
DB_NAME=railway
DB_SSL=true
```

### Use Local MySQL
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=my1301SQL#
DB_NAME=water_governance
DB_SSL=false
```

Just comment/uncomment the section you want to use!

---

## 🆘 Troubleshooting

### Error: "connect ETIMEDOUT"
**Solution**: Check your internet connection and Railway host/port

### Error: "Access denied for user"
**Solution**: Double-check DB_PASSWORD in .env matches Railway

### Error: "Unknown database 'railway'"
**Solution**: Verify DB_NAME matches your Railway database name

### Error: "SSL connection error"
**Solution**: Make sure `DB_SSL=true` is set in .env

### Error: "Too many connections"
**Solution**: Railway free tier has connection limits. Close unused connections.

---

## 💡 Pro Tips

1. **Keep Local Backup**: Don't delete your local database yet
2. **Test First**: Always run `test-cloud-db.js` before starting server
3. **Monitor Usage**: Check Railway dashboard for connection count
4. **Use Connection Pooling**: Already configured (max: 5 connections)
5. **Environment Variables**: Never commit .env file to git

---

## 📈 Railway Free Tier Limits

- **Storage**: 1GB
- **Connections**: 20 concurrent
- **Hours**: 500 hours/month ($5 credit)
- **Bandwidth**: Unlimited

**Tip**: Monitor usage in Railway dashboard to stay within free tier.

---

## 🎯 Next Steps

1. ✅ Database imported to Railway
2. ✅ database.js updated with SSL support
3. ✅ .env configured with Railway credentials
4. ✅ Connection tested successfully
5. ⏭️ **Next**: Deploy backend to Render (see `YOUR_NEXT_STEPS.md`)

---

## 🔗 Useful Railway Commands

### Railway CLI (Optional)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# View logs
railway logs

# Open dashboard
railway open
```

---

## ✅ Checklist

- [ ] Got Railway connection details
- [ ] Updated backend/.env with Railway credentials
- [ ] Generated JWT secret
- [ ] Ran test-cloud-db.js successfully
- [ ] Started backend with npm run dev
- [ ] Verified tables exist in Railway
- [ ] Backend connects without errors

---

**All set?** Your backend is now connected to Railway MySQL! 🎉

**Next**: Follow `YOUR_NEXT_STEPS.md` Phase 2 to deploy your backend to Render.
