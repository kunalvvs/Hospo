# Deploy Backend to Vercel

## Why Move from Render to Vercel?
- ✅ Vercel **doesn't block SMTP ports** (587/465) - email will work!
- ✅ Faster cold starts than Render free tier
- ✅ Better integration with frontend (same platform)
- ✅ Automatic environment variable management

## Steps to Deploy Backend to Vercel

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Navigate to Backend Folder
```bash
cd backend
```

### 3. Login to Vercel
```bash
vercel login
```

### 4. Deploy Backend
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `torion-backend` (or your preferred name)
- **Directory?** → `./` (current directory)
- **Override settings?** → No

### 5. Add Environment Variables
After initial deployment, add your environment variables:

```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add FRONTEND_URL
vercel env add NODE_ENV
```

Or add them via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your `torion-backend` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

```
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret-key
EMAIL_USER=innovativenewss@gmail.com
EMAIL_PASSWORD=fzxdywjqordtosvt
CLOUDINARY_CLOUD_NAME=hospo
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### 6. Deploy Production
```bash
vercel --prod
```

### 7. Update Frontend API URL
After deployment, you'll get a URL like: `https://torion-backend.vercel.app`

Update your **frontend environment variables** on Vercel:
1. Go to frontend project settings
2. Update `VITE_API_URL` to your new backend URL
3. Redeploy frontend

Or update locally and redeploy:
```bash
# In frontend folder
# Update .env.production
VITE_API_URL=https://torion-backend.vercel.app
```

### 8. Test the Deployment
```bash
# Test health endpoint
curl https://torion-backend.vercel.app/api/health

# Expected response:
{
  "success": true,
  "message": "Torion Backend API is running",
  "timestamp": "2025-11-26T..."
}
```

## Important Notes

### Email Will Work on Vercel! ✅
Unlike Render, Vercel allows SMTP connections, so your Gmail email system will work properly.

### Environment Variables Required
Make sure ALL environment variables are set in Vercel:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_USER` - Gmail address (innovativenewss@gmail.com)
- `EMAIL_PASSWORD` - Gmail App Password (fzxdywjqordtosvt)
- `CLOUDINARY_CLOUD_NAME` - hospo
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `FRONTEND_URL` - Your Vercel frontend URL
- `NODE_ENV` - production

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (local development)
- Your `FRONTEND_URL` environment variable

### Files Created for Vercel
- ✅ `backend/vercel.json` - Vercel configuration
- ✅ `backend/.vercelignore` - Files to ignore during deployment
- ✅ Updated `backend/server.js` - Serverless export for Vercel

### Monitoring
- View logs: https://vercel.com/dashboard → Your Project → Deployments → View Logs
- Check function executions and errors in real-time

## Troubleshooting

### Issue: "Cannot find module"
**Solution:** Run `npm install` in backend folder before deploying

### Issue: "Database connection failed"
**Solution:** Check MONGODB_URI environment variable in Vercel dashboard

### Issue: "CORS error"
**Solution:** Update FRONTEND_URL environment variable with your actual frontend URL

### Issue: Email still not working
**Solution:** 
1. Verify EMAIL_USER and EMAIL_PASSWORD are correct in Vercel
2. Check Vercel logs for email-related errors
3. Ensure Gmail App Password has no spaces

## Advantages of Vercel Backend

✅ **SMTP Works** - No blocked ports, emails send successfully
✅ **Global CDN** - Fast response times worldwide
✅ **Auto-scaling** - Handles traffic spikes automatically
✅ **Zero Config** - Just deploy and it works
✅ **Free Tier** - Generous limits for hobby projects
✅ **Same Platform** - Frontend and backend on same provider

## Next Steps After Deployment

1. ✅ Test registration with OTP email
2. ✅ Test file uploads to Cloudinary
3. ✅ Test all doctor dashboard features
4. ✅ Update any documentation with new backend URL
5. ✅ Delete Render deployment (optional)

Your backend will now work perfectly with email OTP! 🎉
