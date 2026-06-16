# 🚀 CitySphere Deployment Guide

Complete deployment instructions for CitySphere on various platforms.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] MongoDB Atlas cluster with connection string
- [ ] Mapbox access token
- [ ] Node.js 18+ installed locally
- [ ] Git installed
- [ ] Accounts on deployment platforms

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts to link/create project
```

**Configuration:**
1. Go to Vercel Dashboard → Project Settings
2. Set environment variables if needed
3. Configure custom domain (optional)

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Navigate to frontend
cd frontend

# Deploy
netlify deploy --prod
```

**Or via Web UI:**
1. Go to [netlify.com](https://netlify.com)
2. Drag `frontend` folder to deploy area
3. Configure site settings

### Option 3: Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy --only hosting
```

**firebase.json:**
```json
{
  "hosting": {
    "public": "frontend",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

---

## 🖥️ Backend Deployment

### Option 1: Render (Recommended)

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`

5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret
   NODE_ENV=production
   PORT=10000
   ```

6. Deploy!

### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository
4. Add Environment Variables
5. Railway auto-detects Node.js

**railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Option 3: Vercel Serverless

**vercel.json (in backend folder):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

```bash
cd backend
vercel
```

### Option 4: Heroku

```bash
# Login
heroku login

# Create app
heroku create citysphere-api

# Set environment variables
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your-secret"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

**Procfile:**
```
web: node server.js
```

---

## 🍃 MongoDB Atlas Setup

### 1. Create Cluster

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Build a Cluster → Shared (Free)
4. Choose closest region
5. Create cluster

### 2. Database Access

1. Database Access → Add New Database User
2. Set username and strong password
3. Set privileges: Atlas Admin

### 3. Network Access

1. Network Access → Add IP Address
2. For development: Add Current IP
3. For production: Allow Access from Anywhere (0.0.0.0/0)

### 4. Get Connection String

1. Clusters → Connect → Drivers
2. Select Node.js
3. Copy connection string
4. Replace `<password>` with your password

**Example:**
```
mongodb+srv://citysphere:your_password@cluster0.abc123.mongodb.net/citysphere?retryWrites=true&w=majority
```

---

## 🔄 Connecting Frontend to Backend

After deploying both:

1. Update `frontend/scripts/main.js`:

```javascript
const CONFIG = {
    API_BASE: 'https://your-backend-url.onrender.com/api',
    MAPBOX_TOKEN: 'pk.your-mapbox-token'
};
```

2. Redeploy frontend

### CORS Configuration

Ensure backend allows frontend origin:

**In server.js:**
```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://your-frontend.vercel.app',
        'https://citysphere.netlify.app'
    ],
    credentials: true
}));
```

---

## 🗺️ Mapbox Setup

1. Create account at [mapbox.com](https://mapbox.com)
2. Go to Account → Tokens
3. Create new token or use default public token
4. Add to frontend configuration

---

## 📊 Environment Variables Summary

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/citysphere
JWT_SECRET=your-super-secret-key-min-32-chars
PORT=5000
NODE_ENV=production
OPENAI_API_KEY=sk-optional-for-ai-features
```

### Frontend (config in main.js)
```javascript
const CONFIG = {
    API_BASE: 'https://your-api.onrender.com/api',
    MAPBOX_TOKEN: 'pk.your-mapbox-token'
};
```

---

## ✅ Deployment Checklist

### Pre-deployment
- [ ] Test locally with production env vars
- [ ] Remove console.logs (or use proper logging)
- [ ] Verify all API endpoints work
- [ ] Check CORS configuration

### Backend
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Environment variables set
- [ ] Deployed and running

### Frontend
- [ ] API_BASE updated to production URL
- [ ] Mapbox token configured
- [ ] Deployed and accessible

### Post-deployment
- [ ] Test all features
- [ ] Verify API connections
- [ ] Check error handling
- [ ] Monitor logs for issues

---

## 🔧 Troubleshooting

### CORS Errors
- Verify frontend URL is in CORS whitelist
- Check if credentials: true matches withCredentials in fetch

### MongoDB Connection Failed
- Verify connection string format
- Check network access whitelist
- Verify username/password

### API Not Responding
- Check server logs on deployment platform
- Verify PORT configuration
- Check environment variables are set

### Maps Not Loading
- Verify Mapbox token is valid
- Check token permissions
- Look for console errors

---

## 📈 Scaling Tips

1. **MongoDB**: Upgrade cluster tier for more connections
2. **Backend**: Use load balancer with multiple instances
3. **Frontend**: Use CDN for static assets
4. **Caching**: Implement Redis for frequently accessed data
5. **Monitoring**: Set up error tracking (Sentry, LogRocket)

---

<p align="center">Happy Deploying! 🚀</p>
