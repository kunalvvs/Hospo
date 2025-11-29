# Deployment Guide - Vercel (Frontend) & Render (Backend)

## Backend Deployment on Render

### Step 1: Prepare Backend for Render

1. Create `.gitignore` in backend folder (if not exists)
2. Push code to GitHub repository
3. Go to [Render Dashboard](https://dashboard.render.com/)

### Step 2: Create Web Service on Render

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   ```
   Name: torion-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main (or your default branch)
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

### Step 3: Add Environment Variables

In Render dashboard, add these environment variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://doctorsoap:Torion2305@cluster6996.j5sqo30.mongodb.net/torion
JWT_SECRET=b555982a04be0ec1863a0e738f0f3b15c091ff3d11d86225257da00c5edc4e78
JWT_EXPIRE=30d
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Important:** See `CLOUDINARY_EMAIL_SETUP.md` for detailed instructions on getting Cloudinary and Gmail credentials.

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy
3. Get your backend URL: `https://torion-backend.onrender.com`

---

## Frontend Deployment on Vercel

### Step 1: Update API Base URL

The frontend has been updated to use environment variables.

Create `.env` file in frontend folder:
```
VITE_API_URL=https://torion-backend.onrender.com/api
```

For local development, create `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

**Option B: Using Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### Step 3: Add Environment Variables in Vercel

In Project Settings → Environment Variables:
```
VITE_API_URL = https://torion-backend.onrender.com/api
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy
3. Get your frontend URL: `https://torion-frontend.vercel.app`

---

## Post-Deployment Configuration

### Update CORS in Backend

After getting your Vercel URL, update backend CORS settings:

In `backend/server.js`, the CORS is already configured to accept your frontend URL through environment variables.

Add this to Render environment variables:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## Testing Deployed Application

1. **Backend Health Check:**
   ```
   https://torion-backend.onrender.com/api/health
   ```

2. **Frontend:**
   ```
   https://your-app.vercel.app
   ```

3. **Test Registration Flow:**
   - Register → OTP → Complete Profile → Dashboard
   - Upload files → Save sections → Check persistence

---

## Important Notes

### Render (Backend)
- ✅ Free tier available (with limitations)
- ✅ Automatic HTTPS
- ✅ Automatic deployments from GitHub
- ⚠️ Free tier spins down after inactivity (cold starts)
- ⚠️ Free tier has 750 hours/month limit

### Vercel (Frontend)
- ✅ Free tier for personal projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from GitHub
- ✅ Zero cold starts

### File Uploads
✅ **Cloudinary Integration Active**
- All files (images, PDFs, documents) uploaded to Cloudinary
- Works in both local and production environments
- Free tier: 25 GB storage, 25 GB bandwidth/month
- Files persist across deployments
- Setup guide: `CLOUDINARY_EMAIL_SETUP.md`

### Email OTP System
✅ **Gmail Integration Active**
- OTP sent via email after registration
- Beautiful HTML email template
- 10-minute expiry with 3 attempt limit
- Setup guide: `CLOUDINARY_EMAIL_SETUP.md`

---

## Deployment Checklist

### Backend
- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] Environment variables added
- [ ] MongoDB connection tested
- [ ] Backend URL obtained
- [ ] CORS configured with frontend URL

### Frontend
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variable `VITE_API_URL` set
- [ ] Build successful
- [ ] Frontend URL obtained
- [ ] Can access registration page

### Integration Testing
- [ ] Registration works
- [ ] OTP verification works
- [ ] Login works
- [ ] Dashboard loads data
- [ ] Profile editing works
- [ ] File uploads work
- [ ] Data persists after logout/login

---

## Troubleshooting

### Issue: Frontend can't connect to backend
**Solution:** Check CORS settings and ensure `VITE_API_URL` is correct

### Issue: MongoDB connection failed
**Solution:** Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for all IPs)

### Issue: File uploads not working
**Solution:** Check Render logs, may need cloud storage solution

### Issue: 500 errors in production
**Solution:** Check Render logs for detailed error messages

---

## Commands Quick Reference

### Deploy Backend to Render
```bash
# Push to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main

# Render will auto-deploy
```

### Deploy Frontend to Vercel
```bash
cd frontend
vercel --prod
```

### Check Logs
- **Render:** Dashboard → Your Service → Logs
- **Vercel:** Dashboard → Your Project → Deployments → View Logs

---

## Environment Variables Summary

### Backend (Render)
```
PORT=5000
MONGODB_URI=mongodb+srv://doctorsoap:Torion2305@cluster6996.j5sqo30.mongodb.net/torion
JWT_SECRET=b555982a04be0ec1863a0e738f0f3b15c091ff3d11d86225257da00c5edc4e78
JWT_EXPIRE=30d
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend (Vercel)
```
VITE_API_URL=https://torion-backend.onrender.com/api
```

---

## Production URLs (After Deployment)

- **Backend:** `https://torion-backend.onrender.com`
- **Frontend:** `https://torion.vercel.app` (or your custom domain)
- **API Health:** `https://torion-backend.onrender.com/api/health`

---

## Next Steps After Deployment

1. **Setup Services:**
   - Create Cloudinary account (see `CLOUDINARY_EMAIL_SETUP.md`)
   - Generate Gmail App Password (see `CLOUDINARY_EMAIL_SETUP.md`)
   - Add credentials to Render environment variables

2. **Custom Domain:** Add custom domain in Vercel settings

3. **Analytics:** Add Google Analytics or Vercel Analytics

4. **Monitoring:** Set up error tracking (Sentry, LogRocket)

5. **Future Enhancements:**
   - SMS OTP integration (Twilio)
   - Admin Panel integration
   - User Panel integration
   - Payment gateway integration

---

Ready to deploy! 🚀
