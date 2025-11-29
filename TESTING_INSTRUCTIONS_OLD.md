# Testing Instructions - Doctor Dashboard System

## Prerequisites
- ✅ Backend running on http://localhost:5000
- ✅ MongoDB connected to Atlas
- Frontend should be running on http://localhost:3000

---

## Start the Servers

### Backend (Already Running)
```bash
cd backend
npm start
```
Server will start on port 5000

### Frontend
```bash
cd frontend
npm run dev
```
Server will start on port 3000

---

## Test 1: Complete Registration Flow

### Step 1: Go to Role Selection
1. Open browser: http://localhost:3000
2. You should see the role selection page
3. Click on **"Doctor"** role

### Step 2: Register New Account
1. You'll be redirected to Registration page
2. Fill in the form:
   - **Name:** Dr. John Smith
   - **Phone:** 9876543210
   - **Email:** john.smith@example.com
   - **Password:** password123
   - **Confirm Password:** password123
3. Click **"Register"**
4. ✅ Should redirect to Doctor Registration (3-step form)
5. ❌ Should NOT show OTP verification
6. ✅ Should see success alert: "Registration successful! Welcome Dr. John Smith"

### Step 3: Complete Doctor Registration (3 Steps)

#### Step 1 - Profile Information
1. **Full Name:** Dr. John Smith (pre-filled)
2. **Email:** john.smith@example.com
3. **Date of Birth:** 1990-01-15
4. **Gender:** Male
5. **Languages Spoken:** English, Hindi, Tamil
6. **Bio:** Experienced cardiologist with 10 years of practice
7. Click **"Next: Medical Credentials →"**

#### Step 2 - Medical Credentials
1. **Registration Number:** MCI12345
2. **Registration Council:** Medical Council of India
3. **Registration Year:** 2013
4. **Years of Experience:** 10
5. **Qualifications:** MBBS, MD Cardiology
6. **Specializations:** Cardiology, Internal Medicine
7. **Awards:** Best Doctor Award 2022
8. Click **"Next: Clinic Details →"**

#### Step 3 - Clinic Details
1. **Clinic Name:** Smith Heart Clinic
2. **Clinic Address:** 123 Medical Street, Near City Hospital
3. **City:** Mumbai
4. **State:** Maharashtra
5. **Pincode:** 400001
6. **Clinic Phone:** 9876543210
7. **Clinic Email:** clinic@smith.com
8. **Working Days:** Select Mon, Tue, Wed, Thu, Fri (click buttons)
9. **Start Time:** 09:00
10. **End Time:** 18:00
11. **Consultation Fee:** 500
12. **Follow-up Fee:** 300
13. Check **"Offer Online Consultation"**
14. **Online Consultation Fee:** 400
15. Click **"Complete Registration ✓"**

#### Expected Result:
- ✅ Success overlay appears: "Registration Successful!"
- ✅ After 2 seconds, redirects to Doctor Dashboard
- ✅ Dashboard shows all filled information

---

## Test 2: Login Flow

### Step 1: Logout
1. In Doctor Dashboard, click **"Logout"** button at top-right
2. You'll be redirected to role selection

### Step 2: Go to Login
1. From role selection, select **"Doctor"** role
2. Click **"Already have an account? Login"** link
3. You'll be on Login page

### Step 3: Login with Credentials
1. **Email:** john.smith@example.com
2. **Password:** password123
3. Click **"Login"**

#### Expected Result:
- ✅ No "Invalid credentials" error
- ✅ Success alert: "Welcome Dr. John Smith!"
- ✅ Redirects to Doctor Dashboard
- ✅ Dashboard shows all previously saved data

---

## Test 3: Dashboard Data Loading

### Expected Dashboard Sections:
1. **Overview Section:**
   - Shows welcome message
   - Display statistics (enquiries, reviews)

2. **Profile Summary Section (View Mode):**
   - ✅ Profile Photo placeholder
   - ✅ Profile Title
   - ✅ Bio/About: "Experienced cardiologist with 10 years of practice"
   - ✅ Languages: English, Hindi, Tamil (badges)
   - ✅ Experience: 10 years
   - ✅ Specializations displayed

3. **Medical Credentials Section (View Mode):**
   - ✅ Registration Number: MCI12345
   - ✅ Registration Council: Medical Council of India
   - ✅ Degrees displayed
   - ✅ All credential info visible

4. **Clinic Details Section (View Mode):**
   - ✅ Clinic Name: Smith Heart Clinic
   - ✅ Full address displayed
   - ✅ Contact information
   - ✅ Working days and timings
   - ✅ Consultation fees: ₹500

5. **Online Consultation Section (View Mode):**
   - ✅ Status: Enabled
   - ✅ Fee: ₹400
   - ✅ Consultation modes

6. **Fees & Payment Section (View Mode):**
   - ✅ Consultation Fee: ₹500
   - ✅ Bank details (if filled)

---

## Test 4: Edit and Save Functionality

### Test Edit Profile Section:
1. Scroll to **Profile Summary** section
2. Click **"Edit Profile"** button (pencil icon)
3. Section becomes editable with input fields
4. Modify the bio:
   - **Old:** "Experienced cardiologist with 10 years of practice"
   - **New:** "Leading cardiologist specializing in interventional cardiology with 10+ years of experience"
5. Click **"Save"** button (checkmark icon)

#### Expected Result:
- ✅ Alert: "Profile saved successfully!"
- ✅ Section returns to view mode
- ✅ Shows updated bio
- ✅ Refresh page - changes persist

### Test Edit Clinic Details:
1. Scroll to **Clinic Details** section
2. Click **"Edit Clinic"** button
3. Modify consultation fee:
   - **Old:** 500
   - **New:** 600
4. Click **"Save"** button

#### Expected Result:
- ✅ Alert: "Clinic Details saved successfully!"
- ✅ Shows ₹600 as consultation fee
- ✅ Refresh page - fee shows ₹600

---

## Test 5: Verify MongoDB Database

### Check Database:
1. Open MongoDB Compass or Atlas web interface
2. Connect to: `mongodb+srv://doctorsoap:Torion2305@cluster6996.j5sqo30.mongodb.net/`
3. Select database: **torion**
4. Open collection: **doctors**

### Verify Doctor Document:
```json
{
  "_id": "...",
  "name": "Dr. John Smith",
  "email": "john.smith@example.com",
  "phone": "9876543210",
  "role": "doctor",
  "bio": "Leading cardiologist specializing in interventional cardiology with 10+ years of experience",
  "languages": ["English", "Hindi", "Tamil"],
  "experience": 10,
  "registrationNumber": "MCI12345",
  "registrationCouncil": "Medical Council of India",
  "clinicName": "Smith Heart Clinic",
  "clinicCity": "Mumbai",
  "consultationFee": 600,
  "onlineConsultation": true,
  "onlineConsultationFee": 400,
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### Expected:
- ✅ Doctor document exists
- ✅ All fields saved correctly
- ✅ Password is hashed (not plain text)
- ✅ Email is unique
- ✅ Updated fields reflect latest changes

---

## Test 6: Error Handling

### Test Duplicate Email Registration:
1. Try to register another doctor with same email
2. **Expected:** Error message "Email already registered"

### Test Duplicate Phone Registration:
1. Try to register with different email but same phone
2. **Expected:** Error message "Phone number already registered"

### Test Invalid Login:
1. Try to login with wrong password
2. **Expected:** Error message "Invalid credentials"

### Test Invalid Email:
1. Try to login with non-existent email
2. **Expected:** Error message "Invalid credentials"

---

## Common Issues & Solutions

### Issue 1: "Invalid credentials" on Login
**Cause:** Email not matching in database
**Solution:** 
- Check MongoDB for exact email used during registration
- Ensure no extra spaces in email field
- Email is case-insensitive

### Issue 2: Dashboard shows empty data
**Cause:** Profile not loaded from backend
**Solution:**
- Check browser console for errors
- Verify JWT token in localStorage
- Check backend logs for API errors
- Ensure backend is running

### Issue 3: Registration form data not saving
**Cause:** API call failing
**Solution:**
- Open browser DevTools → Network tab
- Check PUT /api/doctors/profile request
- Look for error in response
- Verify backend is running

### Issue 4: Backend not starting
**Cause:** Port 5000 already in use
**Solution:**
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Then restart backend
cd backend
npm start
```

---

## Browser Console Commands

### Check Current User:
```javascript
JSON.parse(localStorage.getItem('currentUser'))
```

### Check JWT Token:
```javascript
localStorage.getItem('token')
```

### Check Doctor Data:
```javascript
JSON.parse(localStorage.getItem('doctorData'))
```

### Clear All Data (Fresh Start):
```javascript
localStorage.clear()
location.reload()
```

---

## API Testing with cURL

### Test Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Test",
    "email": "test@example.com",
    "phone": "9999999999",
    "password": "test123"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.smith@example.com",
    "password": "password123"
  }'
```

### Test Get Profile (replace TOKEN):
```bash
curl http://localhost:5000/api/doctors/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Success Criteria ✅

After all tests, you should have:

- [x] Successfully registered a doctor account
- [x] Completed 3-step registration form
- [x] Logged in with email and password
- [x] Dashboard loaded with all saved data
- [x] Edited and saved profile information
- [x] Edited and saved clinic details
- [x] Changes persisted after page refresh
- [x] Doctor document exists in MongoDB
- [x] All fields saved correctly in database
- [x] No console errors in browser
- [x] No errors in backend logs

---

## Support

If any test fails:
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify MongoDB connection
4. Ensure both servers are running
5. Clear localStorage and try again
6. Check network tab in DevTools for failed API calls

All systems should be **fully functional** now! 🎉
