# Quick Start Guide - Torion Healthcare

## 🚀 Get Started in 5 Minutes

### Step 1: Get Cloudinary Credentials (2 minutes)

1. Go to [cloudinary.com](https://cloudinary.com/)
2. Click "Sign Up for Free"
3. After login, copy from Dashboard:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 2: Get Gmail App Password (2 minutes)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select: **Mail** → **Other (Custom name)** → Enter "Torion"
5. Click **Generate** → Copy the 16-character password

### Step 3: Configure Backend (.env)

Open `backend/.env` and update:

```env
# Already configured
PORT=5000
MONGODB_URI=mongodb+srv://doctorsoap:Torion2305@cluster6996.j5sqo30.mongodb.net/torion
JWT_SECRET=b555982a04be0ec1863a0e738f0f3b15c091ff3d11d86225257da00c5edc4e78
JWT_EXPIRE=30d
NODE_ENV=development

# Add your Cloudinary credentials
CLOUDINARY_CLOUD_NAME=paste_your_cloud_name_here
CLOUDINARY_API_KEY=paste_your_api_key_here
CLOUDINARY_API_SECRET=paste_your_api_secret_here

# Add your Gmail credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=paste_app_password_here
```

### Step 4: Start Backend

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected
✅ Server running on port 5000
```

### Step 5: Start Frontend

Open new terminal:

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

### Step 6: Test Everything (1 minute)

1. **Open:** http://localhost:3000
2. **Register** with your real email
3. **Check email** for OTP (check spam if needed)
4. **Verify OTP** → Login
5. **Upload profile photo** → Verify it shows
6. **Fill one section** → Click Save
7. **Refresh page** → Verify data persists

---

## ✅ Verification Checklist

After testing locally:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Registration works
- [ ] Email with OTP received
- [ ] OTP verification works
- [ ] Login successful
- [ ] Dashboard loads
- [ ] Profile photo uploads
- [ ] Image shows immediately
- [ ] Image URL starts with `https://res.cloudinary.com/`
- [ ] PDF upload works
- [ ] Data saves correctly
- [ ] Data persists after refresh
- [ ] Profile completion updates

---

## 🚀 Deploy to Production

### Backend to Render:

1. Go to [render.com](https://render.com/)
2. Create **Web Service** from GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add **Environment Variables** (10 total):
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
5. **Deploy** → Copy backend URL

### Frontend to Vercel:

1. Go to [vercel.com](https://vercel.com/)
2. Import GitHub repo
3. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
4. Add **Environment Variable**:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. **Deploy** → Copy frontend URL

### Update CORS:

1. Go back to Render
2. Update environment variable:
   ```
   FRONTEND_URL=https://your-actual-app.vercel.app
   ```
3. Redeploy

---

## 📱 Test Production

1. Visit your Vercel URL
2. Register with real email
3. Check email for OTP
4. Upload profile photo
5. Fill sections → Save
6. Verify everything works!

---

## 🆘 Troubleshooting

### Email not received?
- Check spam folder
- Verify Gmail App Password is correct
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Look at backend logs for "Email sent successfully"

### Image not uploading?
- Check Cloudinary credentials
- Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET
- Check file size < 5MB
- Check Cloudinary dashboard quota

### Data not saving?
- Check MongoDB connection
- Check JWT token in browser localStorage
- Check browser console for errors
- Check backend logs

### CORS error in production?
- Verify FRONTEND_URL matches Vercel URL exactly
- Include `https://` prefix
- No trailing slash
- Redeploy backend after changing

---

## 📚 Documentation

- **COMPLETE_FIXES_SUMMARY.md** - What was fixed and how
- **CLOUDINARY_EMAIL_SETUP.md** - Detailed setup guides
- **TESTING_INSTRUCTIONS.md** - Complete testing checklist
- **DEPLOYMENT_GUIDE.md** - Full deployment instructions

---

## 🎯 Features Working

✅ Email OTP verification after registration  
✅ Profile photo upload (Cloudinary)  
✅ Document upload system (PDF, DOC, DOCX)  
✅ All 6 sections save correctly  
✅ Real-time profile completion tracking  
✅ Data persistence across sessions  
✅ Production-ready (Vercel + Render)  
✅ Future-ready for Admin & User panels  

---

## 🎉 You're All Set!

Your doctor dashboard is production-ready with:
- ☁️ Cloud file storage (Cloudinary)
- 📧 Email OTP system (Gmail)
- 💾 Persistent data (MongoDB Atlas)
- 🔒 Secure authentication (JWT)
- 🚀 Ready to deploy (Render + Vercel)

**Need help?** Check the detailed documentation files!

**Ready to deploy?** Follow the deployment sections above!

**Happy coding! 🚀**
