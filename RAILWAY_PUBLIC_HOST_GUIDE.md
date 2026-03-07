# 🎯 Finding Your Railway PUBLIC Hostname

## Why You Need This

`mysql.railway.internal` only works when your code runs INSIDE Railway.
To connect from your laptop, you need the PUBLIC hostname.

---

## 🔍 Method 1: Railway Dashboard (Easiest)

### Step 1: Open Railway Dashboard
Go to: https://railway.app/dashboard

### Step 2: Click Your MySQL Database
You'll see your MySQL service card - click it

### Step 3: Look for "Connect" Tab
At the top, you'll see tabs:
- Overview
- **Connect** ← Click this
- Variables
- Settings

### Step 4: Find "Public Networking" Section
Scroll down to find a section that shows:

```
┌─────────────────────────────────────────┐
│  Public Networking                      │
├─────────────────────────────────────────┤
│  Host: containers-us-west-123.railway.app
│  Port: 6543                             │
└─────────────────────────────────────────┘
```

**Copy these two values!**

---

## 🔍 Method 2: Variables Tab

### Step 1: Click "Variables" Tab

### Step 2: Look for Variables WITHOUT "internal"

You might see:
```
MYSQLHOST = containers-us-west-123.railway.app  ← Use this!
MYSQL_URL = mysql://root:pass@containers-us-west-123.railway.app:6543/railway

NOT this:
MYSQL_PRIVATE_URL = mysql://root:pass@mysql.railway.internal:3306/railway
```

The one with `.railway.app` is the PUBLIC hostname!

---

## 🔍 Method 3: Connection String

Look for a variable like `MYSQL_URL` or `DATABASE_URL`:

```
mysql://root:FUJITSU@containers-us-west-123.railway.app:6543/railway
       └─┬─┘ └──┬──┘ └──────────────┬──────────────────┘ └┬─┘ └──┬──┘
       user  password            host                    port  database
```

Extract:
- **DB_HOST**: `containers-us-west-123.railway.app`
- **DB_PORT**: `6543`
- **DB_USER**: `root`
- **DB_PASSWORD**: `FUJITSU`
- **DB_NAME**: `railway`

---

## 📝 Update Your .env File

Once you have the public hostname and port, update `backend/.env`:

```env
# Railway MySQL Database Configuration (PUBLIC)
DB_HOST=containers-us-west-123.railway.app  # ← Your actual public host
DB_PORT=6543                                 # ← Your actual public port
DB_USER=root
DB_PASSWORD=FUJITSU
DB_NAME=railway
DB_SSL=true
```

---

## 🧪 Test Connection

```bash
cd backend
node test-cloud-db.js
```

**Success looks like:**
```
Testing cloud database connection...
Host: containers-us-west-123.railway.app
Database: railway
User: root
Port: 6543
SSL: true

✅ Connection successful!
Database is accessible and ready to use.
```

---

## 🆘 Troubleshooting

### Error: "ENOTFOUND mysql.railway.internal"
**Problem**: You're using the internal hostname
**Solution**: Get the public hostname (ends in `.railway.app`)

### Error: "Connection timeout"
**Problem**: Wrong port or hostname
**Solution**: Double-check the public port (usually NOT 3306)

### Error: "Access denied"
**Problem**: Wrong password
**Solution**: Verify DB_PASSWORD matches Railway

---

## 💡 Pro Tip: Railway CLI

If you can't find it in the dashboard, use Railway CLI:

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Show all variables
railway variables
```

Look for the variable with `.railway.app` in it!

---

## ✅ Checklist

- [ ] Opened Railway dashboard
- [ ] Found MySQL service
- [ ] Located "Connect" or "Variables" tab
- [ ] Found public hostname (ends in .railway.app)
- [ ] Found public port (usually 4 digits, NOT 3306)
- [ ] Updated backend/.env with public values
- [ ] Ran test-cloud-db.js successfully
- [ ] Saw "✅ Connection successful!"

---

## 🚀 Next Steps

Once your connection test succeeds:

1. ✅ Generate JWT secret: `node generate-jwt-secret.js`
2. ✅ Update JWT_SECRET in .env
3. ✅ Start backend: `npm run dev`
4. ✅ Deploy to Render (see YOUR_NEXT_STEPS.md)

---

**Need help?** Share a screenshot of your Railway dashboard and I can help identify the correct values!
