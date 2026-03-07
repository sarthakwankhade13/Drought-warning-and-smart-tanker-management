# 🔑 Railway Credentials - Where to Find Them

## 📍 Step-by-Step: Getting Your Railway Database Credentials

### Step 1: Open Railway Dashboard
Go to: https://railway.app/dashboard

### Step 2: Select Your Project
Click on the project where you created the MySQL database

### Step 3: Click on MySQL Service
You'll see a card/box labeled "MySQL" - click on it

### Step 4: Go to Variables Tab
Look for tabs at the top: Overview | **Variables** | Settings | Metrics
Click on **Variables**

---

## 📋 Copy These Values

You'll see variables like this in Railway:

```
MYSQLHOST = containers-us-west-123.railway.app
MYSQLPORT = 6379
MYSQLUSER = root
MYSQLPASSWORD = AbCdEfGhIjKlMnOpQrStUvWxYz123456
MYSQLDATABASE = railway
```

---

## 🔄 Map to Your .env File

Copy the Railway values to your `backend/.env` file like this:

| Railway Variable | Your .env Variable | Example Value |
|-----------------|-------------------|---------------|
| `MYSQLHOST` | `DB_HOST` | `containers-us-west-123.railway.app` |
| `MYSQLPORT` | `DB_PORT` | `6379` |
| `MYSQLUSER` | `DB_USER` | `root` |
| `MYSQLPASSWORD` | `DB_PASSWORD` | `AbCdEfGhIjKlMnOpQrStUvWxYz123456` |
| `MYSQLDATABASE` | `DB_NAME` | `railway` |

---

## 📝 Your backend/.env Should Look Like This

```env
# Railway MySQL Database
DB_HOST=containers-us-west-123.railway.app
DB_PORT=6379
DB_USER=root
DB_PASSWORD=AbCdEfGhIjKlMnOpQrStUvWxYz123456
DB_NAME=railway
DB_SSL=true
```

**Important Notes**:
- ✅ Don't include `http://` or `https://` in DB_HOST
- ✅ DB_PORT is usually 4 digits (like 6379, 3306, etc.)
- ✅ DB_PASSWORD is case-sensitive - copy it exactly
- ✅ Always set `DB_SSL=true` for Railway

---

## 🎯 Alternative: Use Connection String

Railway also provides a connection string. If you see:

```
MYSQL_URL = mysql://root:password@host:port/database
```

You can extract the values:
```
mysql://[DB_USER]:[DB_PASSWORD]@[DB_HOST]:[DB_PORT]/[DB_NAME]
```

**Example**:
```
mysql://root:AbCdEf123@containers-us-west-123.railway.app:6379/railway
```

Breaks down to:
- DB_USER = `root`
- DB_PASSWORD = `AbCdEf123`
- DB_HOST = `containers-us-west-123.railway.app`
- DB_PORT = `6379`
- DB_NAME = `railway`

---

## ✅ Verify Your Configuration

After updating `.env`, test the connection:

```bash
cd backend
node test-cloud-db.js
```

**Success Output**:
```
Testing cloud database connection...
Host: containers-us-west-123.railway.app
Database: railway
User: root
✅ Connection successful!
Database is accessible and ready to use.
```

**Error Output** (if credentials are wrong):
```
❌ Connection failed: Access denied for user 'root'@'...'
```

If you see an error:
1. Double-check you copied the password correctly
2. Verify the host and port match Railway
3. Make sure DB_SSL=true is set

---

## 🔒 Security Reminder

**Never commit your .env file to git!**

Your `.gitignore` already includes `.env`, so it won't be pushed to GitHub. ✅

To verify:
```bash
git status
```

You should NOT see `backend/.env` in the list of files to commit.

---

## 📸 Visual Guide

### Railway Dashboard Layout:
```
┌─────────────────────────────────────────┐
│  Railway Dashboard                      │
├─────────────────────────────────────────┤
│  Your Project Name                      │
│                                         │
│  ┌─────────────┐  ┌─────────────┐     │
│  │   MySQL     │  │   (empty)   │     │
│  │   Database  │  │             │     │
│  └─────────────┘  └─────────────┘     │
│       ↑                                 │
│   Click here                            │
└─────────────────────────────────────────┘
```

### After Clicking MySQL:
```
┌─────────────────────────────────────────┐
│  MySQL Service                          │
├─────────────────────────────────────────┤
│  [Overview] [Variables] [Settings]      │
│                  ↑                      │
│              Click here                 │
├─────────────────────────────────────────┤
│  MYSQLHOST                              │
│  containers-us-west-123.railway.app     │
│                                         │
│  MYSQLPORT                              │
│  6379                                   │
│                                         │
│  MYSQLUSER                              │
│  root                                   │
│                                         │
│  MYSQLPASSWORD                          │
│  AbCdEfGhIjKlMnOpQrStUvWxYz123456      │
│                                         │
│  MYSQLDATABASE                          │
│  railway                                │
└─────────────────────────────────────────┘
```

---

## 🆘 Can't Find Variables Tab?

Try these alternatives:

### Option 1: Connect Tab
Some Railway versions have a "Connect" tab instead of "Variables"
- Click **Connect**
- Look for connection details there

### Option 2: Settings Tab
- Click **Settings**
- Scroll down to "Connection Details" or "Environment Variables"

### Option 3: Railway CLI
```bash
railway variables
```

---

## 💡 Pro Tip: Save Credentials Securely

Create a backup of your credentials (NOT in git):

1. Create a file: `railway-credentials.txt` (locally only)
2. Add to `.gitignore` if not already there
3. Store in password manager (recommended)

**Example backup format**:
```
Railway MySQL Credentials
========================
Host: containers-us-west-123.railway.app
Port: 6379
User: root
Password: AbCdEfGhIjKlMnOpQrStUvWxYz123456
Database: railway
SSL: Required (true)

Created: 2026-03-07
Project: Water Governance System
```

---

## ✅ Final Checklist

- [ ] Found Railway dashboard
- [ ] Clicked on MySQL service
- [ ] Located Variables/Connect tab
- [ ] Copied all 5 credentials (host, port, user, password, database)
- [ ] Updated backend/.env file
- [ ] Set DB_SSL=true
- [ ] Ran test-cloud-db.js successfully
- [ ] Backend connects without errors

---

**All credentials copied?** Great! Now test the connection:

```bash
cd backend
node test-cloud-db.js
```

If successful, you're ready to move to the next phase! 🎉
