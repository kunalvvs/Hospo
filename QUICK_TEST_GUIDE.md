# Quick Test Guide - OTP & Registration Fixes

## ✅ ALL ISSUES FIXED

### What Was Fixed:
1. ✅ **Skip button now works** in both Doctor and Hospital registration
2. ✅ **Complete Registration button saves data** successfully
3. ✅ **OTP verification works** for all roles (Doctor, Hospital, etc.)

---

## 🧪 TESTING INSTRUCTIONS

### Test 1: Hospital Registration (Full Flow)

**Step 1: Register Hospital**
1. Go to http://localhost:3000
2. Click "Hospital" role
3. Fill in registration form:
   - Name: Test Hospital
   - Email: hospital@test.com
   - Phone: 9999999999
   - Password: test123
   - Confirm: test123
4. Click "Register"

**Step 2: Verify OTP**
- ✅ Registration should succeed
- ✅ Alert shows "OTP sent to hospital@test.com"
- ✅ **In Development Mode:** OTP will appear in alert and browser console
- ✅ Navigate to OTP verification page
- ✅ Enter the 6-digit OTP
- ✅ Click "Verify & Complete Registration"

**Expected Result:**
- ✅ "OTP verified successfully!" message
- ✅ Redirect to Hospital Registration form
- ✅ No "Please provide email/phone and OTP" error

**Step 3: Complete Profile (or Skip)**

**Option A - Complete Full Registration:**
1. Fill Step 1: Hospital Name, Practice Type, Logo
2. Click "Next" → Step 2: Address, Location
3. Click "Next" → Step 3: Contact, Hours
4. Click "Complete Registration"
5. ✅ Should save successfully
6. ✅ Redirect to Hospital Dashboard

**Option B - Skip Registration:**
1. Click "Skip Registration →" button at top
2. ✅ Should save minimal data
3. ✅ Alert: "Registration skipped. You can complete your profile later..."
4. ✅ Redirect to Hospital Dashboard

---

### Test 2: Doctor Registration (Full Flow)

**Step 1: Register Doctor**
1. Go to http://localhost:3000
2. Click "Doctor" role
3. Fill registration:
   - Name: Dr. Test
   - Email: doctor@test.com
   - Phone: 8888888888
   - Password: test123
4. Click "Register"

**Step 2: Verify OTP**
- ✅ OTP sent (check console for OTP in development)
- ✅ Enter 6-digit OTP
- ✅ Verify successfully
- ✅ Redirect to Doctor Registration

**Step 3: Fill Profile (or Skip)**

**Option A - Complete:**
1. Profile Section: Fill bio, languages, experience
2. Click "Next"
3. Credentials: Registration number, qualifications
4. Click "Next"
5. Clinic Details: Name, address, fees
6. Click "Complete Registration ✓"
7. ✅ Should save and redirect to dashboard

**Option B - Skip:**
1. On any section, click "Skip for Now"
2. ✅ Should save current data
3. ✅ Redirect to dashboard
4. ✅ Can complete profile later

---

### Test 3: OTP Error Scenarios

**Test Invalid OTP:**
1. Register user
2. Enter wrong OTP (e.g., 111111)
3. ✅ Should show: "Invalid OTP. 2 attempts remaining."
4. Enter wrong again
5. ✅ Should show: "Invalid OTP. 1 attempts remaining."
6. Enter wrong 3rd time
7. ✅ Should show: "Too many failed attempts. Please request a new OTP."

**Test Resend OTP:**
1. Register user
2. Wait 30 seconds (countdown timer)
3. Click "Resend OTP"
4. ✅ New OTP generated (check console)
5. ✅ Old OTP inputs cleared
6. Enter new OTP
7. ✅ Should verify successfully

---

## 🔍 HOW TO SEE OTP IN DEVELOPMENT

### Method 1: Browser Alert
- After registration, OTP appears in alert message
- Example: "Registration successful! OTP sent to test@test.com\n\nDevelopment OTP: 327298"

### Method 2: Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for: `Development OTP: 327298`

### Method 3: Backend Terminal
1. Check backend terminal
2. Look for: `📱 OTP for test@test.com: 327298`

---

## 🐛 TROUBLESHOOTING

### If OTP Verification Fails:

**1. Check Browser Console:**
```javascript
// Look for these logs:
"Verifying OTP:", { email: "...", phone: "...", otp: "..." }
"OTP verification response:", { success: true/false }
```

**2. Check localStorage:**
```javascript
// Open Console and run:
JSON.parse(localStorage.getItem('pendingRegistration'))

// Should show:
{
  email: "test@test.com",
  phone: "9999999999", 
  token: "eyJhbGc...",
  role: "hospital",
  ...
}
```

**3. Check Backend Logs:**
```
✅ User verified in hospital collection
```

### If Skip Button Doesn't Work:

**Check:**
1. Token exists: `localStorage.getItem('token')`
2. User logged in: `localStorage.getItem('currentUser')`
3. Backend server running on port 5000
4. No CORS errors in console

### If Complete Registration Fails:

**Check:**
1. All required fields filled
2. Token present in request headers
3. Backend error logs
4. Network tab in DevTools for 401/403 errors

---

## ✅ SUCCESS INDICATORS

### Registration Success:
- ✅ "Registration successful!" alert
- ✅ OTP appears in console/alert
- ✅ Redirect to /verify-otp page

### OTP Verification Success:
- ✅ "✅ OTP verified successfully!" alert
- ✅ Redirect to role registration page
- ✅ User data in localStorage with isVerified: true

### Skip Success:
- ✅ "Registration skipped..." alert
- ✅ Redirect to dashboard
- ✅ registrationComplete: false in database

### Complete Success:
- ✅ "Registration completed successfully!" alert
- ✅ Redirect to dashboard
- ✅ registrationComplete: true in database

---

## 📝 WHAT TO CHECK IN DATABASE

### After Registration:
```javascript
// Check MongoDB collection (doctors or hospitals)
{
  _id: ObjectId("..."),
  name: "Test Hospital",
  email: "test@test.com",
  phone: "9999999999",
  role: "hospital",
  isVerified: false,  // Before OTP verification
  registrationComplete: false,
  ...
}
```

### After OTP Verification:
```javascript
{
  ...
  isVerified: true,  // ✅ Changed to true
  emailVerified: true,
  ...
}
```

### After Skip:
```javascript
{
  ...
  isVerified: true,
  registrationComplete: false,  // ✅ Still false
  ...
}
```

### After Complete Registration:
```javascript
{
  ...
  isVerified: true,
  registrationComplete: true,  // ✅ Now true
  hospitalName: "Test Hospital",
  practiceType: "Multi-Specialty",
  city: "Mumbai",
  // ... all filled data
}
```

---

## 🎯 KEY POINTS

1. **OTP works for ALL roles** - Doctor, Hospital, Chemist, Ambulance, Pathlab, Patient, Admin
2. **Development mode shows OTP** - Check console/alert/backend logs
3. **Skip button saves state** - Can complete profile later
4. **Complete button requires token** - Automatically included by API interceptor
5. **Data saves to correct collection** - No more mixing doctor/hospital data

---

## 🚀 READY TO TEST!

Both servers are running:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:3000

Try registering as Doctor or Hospital and test:
- ✅ Full registration flow
- ✅ OTP verification  
- ✅ Skip functionality
- ✅ Complete profile functionality

All should work perfectly now! 🎉
