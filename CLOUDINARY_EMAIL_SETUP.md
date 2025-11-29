# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com/)
2. Click **"Sign Up for Free"**
3. Complete registration
4. After login, go to **Dashboard**

## Step 2: Get Your Credentials

From your Cloudinary Dashboard, copy:
- **Cloud Name**
- **API Key**
- **API Secret**

## Step 3: Add to Backend .env

In `backend/.env`, add:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Step 4: Add to Render Environment Variables

In Render dashboard, add these environment variables:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

---

# Email (Gmail) Setup Guide

## Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**

## Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter: **Torion Healthcare**
5. Click **Generate**
6. Copy the 16-character password

## Step 3: Add to Backend .env

In `backend/.env`, add:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

## Step 4: Add to Render Environment Variables

In Render dashboard, add:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

---

# Testing Locally

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Registration:**
   - Register new doctor
   - Check your email for OTP
   - Enter OTP and verify
   - Upload profile photo
   - Check if image shows immediately

4. **Test File Uploads:**
   - Try uploading profile photo
   - Try uploading documents in other sections
   - Verify files are visible after save

---

# Render Environment Variables (Complete List)

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

---

# Vercel Environment Variables

```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

# Features Now Working

✅ **File Uploads to Cloudinary**
- Profile photos uploaded to cloud
- Documents (PDF, DOC, DOCX) uploaded to cloud
- Works in both local and production
- Files persist across deployments

✅ **Email OTP System**
- OTP sent to registered email
- Beautiful HTML email template
- 10-minute expiry
- 3 attempt limit
- Resend functionality

✅ **Profile Completion**
- Real-time calculation
- Updates as you fill sections
- Works with cloud-stored files

---

# Important Notes

- **Free Tiers:**
  - Cloudinary: 25 GB storage, 25 GB bandwidth/month
  - Gmail App Password: No limits
  
- **Security:**
  - Never commit .env files to Git
  - Use App Passwords, not your Gmail password
  - Cloudinary credentials are sensitive

- **Testing:**
  - Test email OTP in local environment first
  - Test file uploads in local before deploying
  - Verify Cloudinary uploads in Cloudinary dashboard

---

Ready to deploy! 🚀
