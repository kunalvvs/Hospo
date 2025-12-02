# 🧪 Hospital Module Testing Guide

## Prerequisites
- MongoDB running (local or Atlas)
- Backend server running on port 5000
- Frontend running on port 3000

## 📝 Step-by-Step Testing

### 1. Start Backend Server
```bash
cd backend
npm start
```
**Expected Output:**
```
🚀 Server running on port 5000
📡 Environment: development
✅ MongoDB Connected
```

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
**Expected Output:**
```
Local: http://localhost:3000/
```

---

## 🧪 Test Scenarios

### Test 1: Hospital Registration
1. Open http://localhost:3000/
2. Click "Hospital" role
3. Click "Register"
4. Fill registration form:
   - Name: City Hospital
   - Email: hospital@test.com
   - Phone: 9876543210
   - Password: password123
5. Click "Register"
6. **Expected:** Redirected to `/hospital-registration` (not dashboard!)
7. **Verify:** Check localStorage → `currentUser.registrationComplete` should be `false`

### Test 2: Complete Hospital Registration (3 Steps)

**Step 1: Basic Identity**
1. Hospital Name: City Medical Center
2. Practice Type: Hospital
3. Tagline: Your trusted healthcare partner
4. Upload Logo (optional)
5. Click "Next →"

**Step 2: Address & Location**
1. Street Address: 123 Main Street
2. Locality: Downtown
3. City: Mumbai
4. PIN Code: 400001
5. Landmark: Near Railway Station
6. Click "Next →"

**Step 3: Contact Details**
1. Main Phone: 9876543210
2. Email: contact@citymedical.com
3. Website: https://citymedical.com
4. OPD Hours: 9:00 AM - 5:00 PM
5. Emergency Hours: 24×7
6. Click "Complete Registration"

**Expected Result:**
- ✅ "Hospital registration completed successfully!" alert
- ✅ Logo uploaded to Cloudinary (if provided)
- ✅ Redirected to `/hospital-dashboard`
- ✅ Dashboard shows complete profile data

**Backend Verification:**
```bash
# Check MongoDB
# Hospital document should have:
{
  "hospitalName": "City Medical Center",
  "practiceType": "hospital",
  "registrationComplete": true,
  "logo": "https://res.cloudinary.com/...",
  "streetAddress": "123 Main Street",
  "city": "Mumbai",
  "mainPhone": "9876543210",
  ...
}
```

### Test 3: Hospital Login (With Complete Profile)
1. Logout from dashboard
2. Go to role selection → Hospital → Login
3. Email: hospital@test.com
4. Password: password123
5. Click "Login"

**Expected:**
- ✅ "Welcome City Medical Center!" alert
- ✅ Redirected to `/hospital-dashboard` (NOT registration!)
- ✅ Dashboard shows all saved data
- ✅ Profile details visible in "My Profile" section

### Test 4: Hospital Login (With Incomplete Profile)
1. Register new hospital: hospital2@test.com
2. Don't complete registration form (just register basic auth)
3. Logout
4. Login again with hospital2@test.com

**Expected:**
- ✅ Login successful
- ✅ Redirected to `/hospital-registration` (because registrationComplete = false)
- ✅ Can complete profile now

### Test 5: Edit Hospital Identity
1. Login to hospital dashboard
2. Go to "My Profile" section
3. Click "Edit" on Basic Identity card
4. Change Hospital Name: "City Medical Center Updated"
5. Change Tagline: "New tagline here"
6. Upload new logo (optional)
7. Click "Save Changes"

**Expected:**
- ✅ "Hospital identity updated successfully!" alert
- ✅ Logo uploads to Cloudinary (if changed)
- ✅ Changes saved to MongoDB
- ✅ Dashboard refreshes with new data
- ✅ localStorage updated

**Backend Verification:**
```bash
# Check backend logs
PUT /api/hospitals/profile/identity
✅ File uploaded to Cloudinary: { url: ... }
Response: { success: true, hospital: {...} }
```

### Test 6: Edit Address Details
1. Click "Edit" on Address card
2. Change City: "New Mumbai"
3. Change PIN Code: "400002"
4. Click "Save Changes"

**Expected:**
- ✅ "Address details updated successfully!" alert
- ✅ Changes saved to backend
- ✅ Dashboard shows updated address

### Test 7: Edit Contact Details
1. Click "Edit" on Contact card
2. Change Main Phone: "9999999999"
3. Change Website: "https://newwebsite.com"
4. Update social media links
5. Click "Save Changes"

**Expected:**
- ✅ "Contact details updated successfully!" alert
- ✅ Changes saved to backend
- ✅ Dashboard shows updated contact info

### Test 8: File Upload Testing
1. Edit hospital identity
2. Select a large logo file (> 5MB)
3. Try to save

**Expected:**
- ❌ Error: "Only images (JPEG, JPG, PNG) and documents (PDF, DOC, DOCX) are allowed!"
- OR: File size error if > 5MB limit

4. Select valid PNG/JPG file (< 5MB)
5. Save

**Expected:**
- ✅ File uploads to Cloudinary
- ✅ Progress indicator shows "Uploading..." or "Saving..."
- ✅ URL saved to database
- ✅ Logo displays in dashboard

### Test 9: Skip Registration
1. Register new hospital: hospital3@test.com
2. On registration page, click "Skip for Now"

**Expected:**
- ✅ Redirected to dashboard
- ✅ Dashboard shows minimal data
- ✅ `registrationComplete` = false
- ✅ Can edit profile later from dashboard

### Test 10: API Direct Testing (Postman/Thunder Client)

**1. Register Hospital:**
```
POST http://localhost:5000/api/auth/register
Headers: Content-Type: application/json
Body:
{
  "name": "Test Hospital",
  "email": "test@hospital.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "hospital"
}

Expected Response: 201
{
  "success": true,
  "message": "Hospital registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test Hospital",
    "email": "test@hospital.com",
    "phone": "9876543210",
    "role": "hospital"
  }
}
```

**2. Login Hospital:**
```
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "test@hospital.com",
  "password": "password123",
  "role": "hospital"
}

Expected Response: 200
{
  "success": true,
  "message": "Login successful",
  "token": "...",
  "user": { ... }
}
```

**3. Get Hospital Profile:**
```
GET http://localhost:5000/api/hospitals/profile
Headers: 
  Authorization: Bearer <token>

Expected Response: 200
{
  "success": true,
  "hospital": {
    "_id": "...",
    "name": "Test Hospital",
    "hospitalName": "...",
    "registrationComplete": false,
    ...
  }
}
```

**4. Update Profile:**
```
PUT http://localhost:5000/api/hospitals/profile
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "hospitalName": "Test Medical Center",
  "city": "Mumbai",
  "mainPhone": "9876543210",
  "registrationComplete": true
}

Expected Response: 200
{
  "success": true,
  "message": "Hospital profile updated successfully",
  "hospital": { ... }
}
```

**5. Upload File:**
```
POST http://localhost:5000/api/hospitals/upload
Headers: 
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
Body: (form-data)
  file: <select image file>

Expected Response: 200
{
  "success": true,
  "message": "File uploaded successfully",
  "fileUrl": "https://res.cloudinary.com/...",
  "publicId": "...",
  "filename": "logo.png"
}
```

---

## ✅ Success Indicators

### Frontend Success:
- ✅ Hospital can register
- ✅ Login redirects correctly (registration vs dashboard)
- ✅ Registration form saves all data
- ✅ Logo uploads work
- ✅ Dashboard loads profile from backend
- ✅ Edit profile saves to backend
- ✅ Loading states show during API calls
- ✅ Error handling works (shows alerts)

### Backend Success:
- ✅ Hospital model saves to MongoDB
- ✅ Password hashes correctly
- ✅ JWT token generated
- ✅ File uploads to Cloudinary
- ✅ Profile updates work
- ✅ Section updates work
- ✅ Role-based auth works (only hospital can access)

### Database Verification:
```bash
# MongoDB Compass or CLI
db.hospitals.find({ email: "hospital@test.com" })

# Should see:
{
  "_id": ObjectId("..."),
  "name": "City Hospital",
  "email": "hospital@test.com",
  "phone": "9876543210",
  "password": "$2a$10$..." (hashed),
  "role": "hospital",
  "hospitalName": "City Medical Center",
  "practiceType": "hospital",
  "logo": "https://res.cloudinary.com/...",
  "streetAddress": "123 Main Street",
  "city": "Mumbai",
  "registrationComplete": true,
  "isVerified": false,
  "verificationStatus": "pending",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Hospital routes not found" (404)
**Solution:** Make sure `backend/server.js` has:
```javascript
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
```

### Issue 2: "No file uploaded" error
**Solution:** Check:
- Multer middleware in route: `upload.single('file')`
- Frontend sends FormData with correct field name: `formData.append('file', file)`

### Issue 3: "Not authorized to access this route"
**Solution:** Check:
- Token stored in localStorage as 'authToken' or 'token'
- Token sent in Authorization header: `Bearer <token>`
- Middleware in route: `protect` and `authorize('hospital')`

### Issue 4: "Hospital not found" (404) after login
**Solution:** 
- Hospital profile doesn't exist yet
- Should redirect to registration
- Check `registrationComplete` flag

### Issue 5: Logo not uploading
**Solution:** Check:
- Cloudinary config in `backend/config/cloudinary.js`
- Environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- File size < 5MB
- File type: PNG, JPG, JPEG, PDF, DOC, DOCX

### Issue 6: "Invalid role specified" error
**Solution:** Make sure registration sends `"role": "hospital"` in body

---

## 📊 Expected Backend Logs

**Successful Registration:**
```
POST /api/auth/register 201 - - ms
✅ Hospital registered successfully
```

**Successful Login:**
```
POST /api/auth/login 200 - - ms
✅ Login successful for hospital@test.com
```

**Profile Update:**
```
PUT /api/hospitals/profile 200 - - ms
✅ Hospital profile updated
```

**File Upload:**
```
POST /api/hospitals/upload 200 - - ms
✅ File uploaded to Cloudinary: { url: 'https://...', publicId: '...' }
```

---

## 🎯 Testing Completion Checklist

- [ ] Backend server starts without errors
- [ ] Frontend connects to backend
- [ ] Hospital registration works
- [ ] Login redirects to registration (incomplete profile)
- [ ] Registration form saves all 3 steps
- [ ] Logo upload works
- [ ] Login redirects to dashboard (complete profile)
- [ ] Dashboard loads data from backend
- [ ] Edit identity saves to backend
- [ ] Edit address saves to backend
- [ ] Edit contact saves to backend
- [ ] Skip registration works
- [ ] File size/type validation works
- [ ] Token authentication works
- [ ] Role authorization works (only hospital can access)
- [ ] MongoDB stores data correctly
- [ ] Cloudinary stores files correctly

---

## ✨ All Tests Passing = Hospital Module 100% Functional! 🎉
