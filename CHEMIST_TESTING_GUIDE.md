# Chemist Dashboard - Quick Testing Guide

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB running
- Cloudinary account configured
- Environment variables set

---

## 1. Start Backend Server

```bash
cd backend
npm install
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
📡 Environment: development
MongoDB connected successfully
```

**Verify Backend:**
- Open: http://localhost:5000/api/health
- Should see: `{"success": true, "message": "Torion Backend API is running"}`

---

## 2. Start Frontend Server

```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
➜ Local:   http://localhost:3000/
```

**Verify Frontend:**
- Open: http://localhost:3000
- Should see the role selection page

---

## 3. Test Complete Flow

### Step 1: Register as Chemist

1. Go to http://localhost:3000
2. Click **"Chemist/Pharmacy"** role
3. Click **"New User? Sign Up"**
4. Fill registration form:
   ```
   Name: Test Pharmacy
   Email: test@pharmacy.com
   Phone: 9876543210
   Password: Test123
   ```
5. Click **"Sign Up"**
6. Verify OTP sent (check console logs)
7. Enter OTP: `123456` (default test OTP)
8. Should redirect to ChemistRegistration page

### Step 2: Complete Registration

**Option A: Complete Full Registration**

**Step 1 - Basic Identity:**
- Pharmacy Name: "MedPlus Pharmacy"
- Business Type: "Retail Pharmacy"
- Tagline: "Your Trusted Neighborhood Pharmacy"
- Click **"Next"**

**Step 2 - Address:**
- Locality: "Koramangala"
- City: "Bangalore"
- PIN: "560034"
- Landmark: "Near Metro Station"
- Click **"Next"**

**Step 3 - Contact:**
- Primary Phone: "9876543210"
- Mobile: "9876543210"
- Email: "test@pharmacy.com"
- Click **"Complete Registration"**

**Option B: Skip Registration**
- Click **"Skip for Now"** on any step
- Minimal profile created automatically

### Step 3: Test Dashboard

**After registration, you'll be on the dashboard:**

#### Test Home Section:
- Should show welcome message
- Profile completion percentage
- Quick stats

#### Test Identity Section:
1. Click **"Basic Identity"** from sidebar
2. Should see current pharmacy name and details
3. Click **"Edit Identity"**
4. Upload logo:
   - Click file input
   - Select an image (jpg/png)
   - Should see uploading message
   - Preview should appear
5. Edit fields:
   - Change pharmacy name
   - Update tagline
   - Add description
6. Click **"Save Changes"**
7. Should see success message
8. Page should refresh with new data

#### Test Address Section:
1. Click **"Address & Location"**
2. Click **"Edit"** (if available) or should show edit form
3. Update fields:
   - Shop Number: "A-101"
   - Building: "Metro Plaza"
   - Add latitude/longitude (optional)
4. Click **"Save Changes"**
5. Verify data persists

#### Test Contact Section:
1. Click **"Contact Details"**
2. Click **"Edit"**
3. Update:
   - Add WhatsApp number
   - Add website URL
   - Add social media links
4. Click **"Save Changes"**
5. Verify updates

#### Test License Section:
1. Click **"Licenses & Registration"**
2. Click **"Edit License Details"**
3. Fill license numbers:
   - Drug License: "DL-KA-123456"
   - GST: "29XXXXX1234X1ZX"
   - PAN: "ABCDE1234F"
4. Upload documents:
   - Drug License Certificate (PDF/Image)
   - GST Certificate
   - PAN Card
   - Shop License
5. Wait for uploads to complete
6. Click **"Save Changes"**
7. Verify "View Document" buttons appear
8. Click "View Document" - should open in new tab

---

## 4. Verify Data Persistence

### Test 1: Page Refresh
1. Click F5 to refresh page
2. All data should remain
3. Navigate through sections
4. Data should be intact

### Test 2: Logout and Re-login
1. Click **"Logout"**
2. Should redirect to home
3. Click **"Login"**
4. Enter credentials:
   ```
   Email: test@pharmacy.com
   Password: Test123
   ```
5. Should redirect to dashboard
6. All data should be present

### Test 3: Check MongoDB
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `chemists` collection
4. Find your test record
5. Verify all fields are saved:
   - `pharmacyName`, `businessType`, `tagline`
   - `logo` (Cloudinary URL)
   - `locality`, `city`, `pin`
   - `primaryPhone`, `mobile`, `contactEmail`
   - `drugLicenseNumber`, `drugLicenseCertificate` (Cloudinary URL)
   - etc.

### Test 4: Check Cloudinary
1. Login to Cloudinary dashboard
2. Navigate to Media Library
3. Go to `chemist_documents` folder
4. Should see all uploaded files:
   - Logo images
   - License documents
   - Certificates

---

## 5. Test Error Scenarios

### Test Unauthorized Access:
1. Open browser incognito mode
2. Go to: http://localhost:3000/chemist-dashboard
3. Should redirect to login page

### Test Invalid File Upload:
1. Go to Identity section edit mode
2. Try uploading a .txt file as logo
3. Should show error (file type not allowed)
4. Try uploading very large file (>10MB)
5. Should show error

### Test Network Error:
1. Stop backend server
2. Try to save changes in dashboard
3. Should show error message
4. Start backend again
5. Try saving - should work

### Test Invalid Data:
1. Edit Contact section
2. Enter invalid email format
3. Try to save
4. Backend should return validation error

---

## 6. API Testing (Optional - Using Postman/Thunder Client)

### Get Profile:
```
GET http://localhost:5000/api/chemists/profile
Headers: 
  Authorization: Bearer <your-jwt-token>
```

### Update Profile:
```
PUT http://localhost:5000/api/chemists/profile
Headers:
  Authorization: Bearer <your-jwt-token>
  Content-Type: application/json
Body:
{
  "pharmacyName": "Updated Pharmacy Name",
  "tagline": "New tagline"
}
```

### Update Specific Section:
```
PUT http://localhost:5000/api/chemists/profile/identity
Headers:
  Authorization: Bearer <your-jwt-token>
  Content-Type: application/json
Body:
{
  "pharmacyName": "New Name",
  "businessType": "retail-pharmacy",
  "tagline": "Updated tagline"
}
```

### Upload File:
```
POST http://localhost:5000/api/chemists/upload
Headers:
  Authorization: Bearer <your-jwt-token>
Body: form-data
  file: <select file>
  fieldName: logo
```

---

## 7. Expected Results Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Registration completes successfully
- [ ] Registration data saves to MongoDB
- [ ] Dashboard loads with saved data
- [ ] Identity section displays correctly
- [ ] Logo upload works
- [ ] Logo displays after upload
- [ ] All text fields save correctly
- [ ] Address section saves
- [ ] Contact section saves
- [ ] License section displays
- [ ] License file uploads work
- [ ] View document buttons work
- [ ] All files upload to Cloudinary
- [ ] Data persists after page refresh
- [ ] Data persists after logout/login
- [ ] MongoDB has all data
- [ ] Cloudinary has all files
- [ ] Error messages display correctly
- [ ] Loading states show during operations
- [ ] Success messages show after saves

---

## 8. Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Check if MongoDB is running: `mongod --version`
2. Verify MONGODB_URI in `.env`
3. Check MongoDB Compass can connect

### Issue: "Cloudinary upload failed"
**Solution:**
1. Verify Cloudinary credentials in `.env`:
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
2. Check Cloudinary dashboard is accessible
3. Verify internet connection

### Issue: "Token expired" or "Unauthorized"
**Solution:**
1. Check if token exists: `localStorage.getItem('token')`
2. Logout and login again
3. Verify JWT_SECRET in backend `.env`
4. Check token expiry time setting

### Issue: "File upload shows uploading but never completes"
**Solution:**
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify file size (should be < 10MB)
4. Check Cloudinary credentials
5. Try smaller file

### Issue: "Data not showing after refresh"
**Solution:**
1. Check if API call succeeds in network tab
2. Verify fetchChemistData() is called
3. Check localStorage fallback
4. Verify MongoDB has the data
5. Check authentication token

### Issue: "Save Changes doesn't work"
**Solution:**
1. Open browser console for errors
2. Check network tab for API call
3. Verify request payload
4. Check backend logs
5. Verify authentication token
6. Check field names match model

---

## 9. Browser Console Commands (for debugging)

### Check Authentication:
```javascript
// Check if token exists
localStorage.getItem('token')

// Check current user
JSON.parse(localStorage.getItem('currentUser'))

// Check chemist data
JSON.parse(localStorage.getItem('chemistData'))
```

### Manual API Test:
```javascript
// Get profile
fetch('http://localhost:5000/api/chemists/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(console.log)
```

### Clear All Data (for fresh start):
```javascript
localStorage.clear()
location.reload()
```

---

## 10. Performance Testing

### Test Upload Speed:
1. Upload 1MB image - should complete in < 5 seconds
2. Upload 5MB PDF - should complete in < 15 seconds
3. Multiple uploads should queue properly

### Test Load Speed:
1. Dashboard should load in < 2 seconds
2. Section changes should be instant
3. Edit mode should open immediately
4. Save should complete in < 3 seconds

---

## 11. Mobile Testing

1. Open Chrome DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone 12, etc.)
4. Test all sections:
   - Sidebar should collapse to hamburger menu
   - Forms should be responsive
   - File upload should work on mobile
   - All buttons should be tappable

---

## 12. Final Verification

After all tests pass:

1. **Code Quality:**
   - [ ] No console errors
   - [ ] No network errors
   - [ ] No eslint warnings

2. **Data Integrity:**
   - [ ] All fields save correctly
   - [ ] Files upload successfully
   - [ ] Data persists across sessions
   - [ ] MongoDB data is complete

3. **User Experience:**
   - [ ] UI is responsive
   - [ ] Loading states work
   - [ ] Error messages are clear
   - [ ] Success messages show
   - [ ] Navigation works smoothly

4. **Security:**
   - [ ] Authentication required
   - [ ] JWT token working
   - [ ] Unauthorized access blocked
   - [ ] File types validated

---

## 📝 Test Report Template

```
Date: ___________
Tester: ___________

✅ Backend Setup: Pass/Fail
✅ Frontend Setup: Pass/Fail
✅ Registration: Pass/Fail
✅ Dashboard Load: Pass/Fail
✅ Identity Section: Pass/Fail
✅ Address Section: Pass/Fail
✅ Contact Section: Pass/Fail
✅ License Section: Pass/Fail
✅ File Uploads: Pass/Fail
✅ Data Persistence: Pass/Fail
✅ Error Handling: Pass/Fail
✅ Mobile Responsive: Pass/Fail

Issues Found:
1. ___________
2. ___________

Notes:
___________
___________
```

---

## 🎉 Success!

If all tests pass, the Chemist Dashboard is **fully functional** and ready for production deployment!

---

**Document Version:** 1.0
**Last Updated:** 2025-11-14
