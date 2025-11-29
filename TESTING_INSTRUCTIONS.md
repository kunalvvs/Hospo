# Complete Testing Guide - Updated with Cloudinary & Email OTP

## Pre-Deployment Testing (Local)

### Setup Requirements

1. **Install Dependencies:**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure Environment Variables:**
   
   **Backend (.env):**
   - Cloudinary credentials (get from cloudinary.com)
   - Gmail credentials (App Password)
   - See `CLOUDINARY_EMAIL_SETUP.md` for detailed setup

3. **Start Services:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

---

## Test Checklist

### ✅ 1. Registration & Email OTP Flow

**Steps:**
1. Go to http://localhost:3000
2. Click "Register as Doctor"
3. Fill registration form with valid email
4. Click "Register"
5. **Check:** Email received with OTP
6. Enter OTP on verification page
7. **Check:** Redirected to login

**Expected Results:**
- ✅ Registration successful
- ✅ Email with OTP received within 30 seconds
- ✅ OTP format: 6-digit number
- ✅ Beautiful HTML email template
- ✅ OTP verification works
- ✅ Redirect to login page

**Troubleshooting:**
- Email not received? Check Gmail App Password in .env
- Check spam folder
- Check terminal logs for "Email sent successfully"
- Verify EMAIL_USER and EMAIL_PASSWORD are correct

---

### ✅ 2. Login & Dashboard Access

**Steps:**
1. Login with registered email/password
2. **Check:** JWT token stored in localStorage
3. **Check:** Redirected to dashboard
4. **Check:** Profile completion bar visible

**Expected Results:**
- ✅ Login successful
- ✅ Dashboard loads with 6 sections
- ✅ Profile completion shows initial percentage
- ✅ Welcome message with doctor name

---

### ✅ 3. Profile Photo Upload (Cloudinary)

**Steps:**
1. Go to "Profile Summary" section
2. Click "Choose File" under Profile Photo
3. Select an image (JPG/PNG, < 5MB)
4. **Check:** Image preview appears immediately
5. **Check:** Console shows Cloudinary URL
6. Click "Save Profile"
7. **Check:** Success message
8. Refresh page (F5)
9. **Check:** Image still visible

**Expected Results:**
- ✅ Image uploads to Cloudinary
- ✅ Image URL starts with: `https://res.cloudinary.com/`
- ✅ Image displays immediately after upload
- ✅ Image persists after page refresh
- ✅ Profile completion percentage increases

**Verify in Cloudinary Dashboard:**
1. Login to cloudinary.com
2. Go to Media Library
3. Check folder: `torion-healthcare`
4. Verify uploaded image exists

**Troubleshooting:**
- Upload fails? Check CLOUDINARY credentials in .env
- 401 error? API credentials incorrect
- Image not showing? Check browser console
- No URL returned? Check backend logs

---

### ✅ 4. Document Upload (PDF/DOC)

**Steps:**
1. Go to "Credentials & Certificates" section
2. Upload Medical License (PDF)
3. Upload Degree Certificate (PDF/DOC)
4. **Check:** File names appear
5. **Check:** Cloudinary URLs in console
6. Click "Save Credentials"
7. Refresh page
8. **Check:** Documents still listed
9. Click document link
10. **Check:** Opens in new tab from Cloudinary

**Expected Results:**
- ✅ PDFs/DOCs upload successfully
- ✅ Cloudinary URL returned
- ✅ Document links work
- ✅ Documents accessible after refresh
- ✅ Profile completion increases

---

### ✅ 5. All Sections Save Handler Test

Test each section individually:

**a) Profile Summary:**
- ✅ Upload profile photo (Cloudinary)
- ✅ Fill: Profile Title, Bio
- ✅ Add: Languages (multiple)
- ✅ Enter: Years of Experience
- ✅ Select: Specializations
- ✅ Add: Services Offered
- ✅ Click "Save Profile"
- ✅ Verify success message
- ✅ Refresh and check persistence

**b) Credentials & Certificates:**
- ✅ Upload Medical License (PDF)
- ✅ Upload Degree Certificate
- ✅ Enter Registration Number
- ✅ Add Additional Certifications
- ✅ Click "Save Credentials"
- ✅ Verify documents accessible

**c) Identity & Verification:**
- ✅ Enter Aadhar Number
- ✅ Enter PAN Number
- ✅ Upload Government ID
- ✅ Enter verification details
- ✅ Click "Save Identity Details"
- ✅ Verify data saved

**d) Clinic Details:**
- ✅ Enter Clinic Name
- ✅ Fill Complete Address
- ✅ Add Facilities (multiple)
- ✅ Set Operating Hours
- ✅ Upload Clinic Photos (multiple)
- ✅ Click "Save Clinic Details"
- ✅ Verify all images show

**e) Online Consultation:**
- ✅ Select Video Platforms
- ✅ Set Availability Slots
- ✅ Enter Meeting Links
- ✅ Configure consultation settings
- ✅ Click "Save Consultation Settings"
- ✅ Verify all data saved

**f) Fees & Payment:**
- ✅ Set In-Clinic Fees
- ✅ Set Online Consultation Fees
- ✅ Add Bank Details
- ✅ Select Payment Methods
- ✅ Enter UPI/PayTM details
- ✅ Click "Save Payment Details"
- ✅ Verify payment info saved

---

### ✅ 6. Profile Completion Real-Time Tracking

**Steps:**
1. Start with empty profile
2. **Check:** Initial percentage (should be ~20-30%)
3. Complete "Profile Summary"
4. **Check:** Percentage increases immediately
5. Complete each section one by one
6. **Check:** Percentage updates after each save
7. Complete all sections
8. **Check:** Reaches 100%
9. Refresh page
10. **Check:** Still shows 100%

**Expected Results:**
- ✅ Real-time calculation without refresh
- ✅ Updates visible immediately
- ✅ Accurate percentage calculation
- ✅ Persists after logout/login

---

### ✅ 7. Data Persistence Test

**Steps:**
1. Fill all 6 sections completely
2. Click "Logout"
3. Close browser
4. Reopen browser
5. Login again
6. Navigate through all sections
7. **Check:** All text data present
8. **Check:** All images load from Cloudinary
9. **Check:** All documents accessible
10. **Check:** Profile completion accurate

**Expected Results:**
- ✅ All data persists
- ✅ File URLs work (Cloudinary)
- ✅ No data loss
- ✅ Images load fast (CDN)

---

### ✅ 8. Error Handling Tests

**Test these scenarios:**

**a) Invalid File Type:**
- Upload .exe or .zip file
- **Expected:** Error message shown
- **Expected:** Upload prevented

**b) File Too Large:**
- Upload >5MB file
- **Expected:** Error message "File too large"
- **Expected:** Upload rejected

**c) Network Error Simulation:**
- Open DevTools → Network
- Set to "Offline"
- Try saving data
- **Expected:** Error message
- Go back "Online"
- Try again
- **Expected:** Save successful

**d) Invalid OTP:**
- Enter wrong OTP code
- **Expected:** Error message
- **Expected:** Attempts remaining shown
- After 3 attempts
- **Expected:** OTP expired, request new

**e) Expired OTP:**
- Wait 11 minutes after OTP sent
- Try verifying
- **Expected:** "OTP expired" message
- **Expected:** Can request new OTP

---

## Production Deployment Testing

### After deploying to Vercel & Render:

### ✅ 1. Backend Health Check
- Visit: `https://your-backend.onrender.com/api/health`
- **Check:** Returns `{"success": true, "message": "API is running"}`
- **Check:** No 500 errors

### ✅ 2. Frontend Loading
- Visit: `https://your-app.vercel.app`
- **Check:** Page loads < 3 seconds
- **Check:** No console errors
- **Check:** All routes work

### ✅ 3. Full Registration Flow (Production)
- Register with real email
- **Check:** OTP email received
- **Check:** Email from correct sender
- Complete verification
- **Check:** Can login successfully

### ✅ 4. File Uploads (Production)
- Upload profile photo
- **Check:** Image visible immediately
- **Check:** Image URL is Cloudinary (starts with https://res.cloudinary.com/)
- Upload PDF document
- **Check:** Document opens in browser
- **Check:** No 404 errors

### ✅ 5. Data Persistence (Production)
- Fill complete profile
- Logout and login
- **Check:** All data still there
- **Redeploy backend on Render**
- Login again
- **Check:** Files still accessible (Cloudinary!)
- **Check:** No data loss

### ✅ 6. CORS Check (Production)
- Open browser console
- Try all API operations
- **Check:** No CORS errors
- **Check:** All requests succeed
- **Check:** JWT authentication works

---

## Performance Testing

### ✅ 1. Page Load Time
- Clear cache
- Reload page
- **Target:** < 3 seconds
- **Check:** Images lazy load
- **Check:** No blocking resources

### ✅ 2. File Upload Speed
- Upload 5MB image
- **Target:** < 10 seconds to Cloudinary
- **Check:** Progress indicator visible
- **Check:** Success message shows

### ✅ 3. Dashboard Navigation
- Switch between all 6 sections
- **Target:** Instant switching
- **Check:** No flickering
- **Check:** Smooth animations

### ✅ 4. API Response Times
- Check Network tab in DevTools
- **Target:** < 500ms for most requests
- **Target:** < 2s for file uploads
- **Check:** No timeout errors

---

## Browser Compatibility

Test full flow on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (macOS/iOS)
- ✅ Edge (latest)
- ✅ Mobile Chrome (Android)
- ✅ Mobile Safari (iOS)

---

## Common Issues & Solutions

### Issue: Email not sending
**Solutions:**
1. Check Gmail App Password is correct
2. Verify 2FA enabled on Gmail
3. Check EMAIL_USER format: `your-email@gmail.com`
4. Check backend logs for email errors
5. Check spam/junk folder
6. Try different email provider (not Gmail) to test

### Issue: Image not uploading to Cloudinary
**Solutions:**
1. Check CLOUDINARY credentials match dashboard
2. Verify Cloud Name (no spaces)
3. Check API Key and Secret are correct
4. Check file size < 5MB
5. Check file type (JPG/PNG/PDF only)
6. Check Cloudinary quota in dashboard
7. Check backend logs for Cloudinary errors

### Issue: Image shows locally but not in production
**Solutions:**
1. Check Cloudinary env vars on Render
2. Verify URL starts with `https://res.cloudinary.com/`
3. Check CORS settings on Cloudinary
4. Check browser console for image load errors

### Issue: Data not saving
**Solutions:**
1. Check MongoDB connection string
2. Verify JWT token in localStorage
3. Check backend logs for errors
4. Check API endpoint URLs
5. Verify CORS configuration
6. Check request payload in Network tab

### Issue: Profile completion stuck
**Solutions:**
1. Check all required fields filled
2. Refresh browser (hard refresh: Ctrl+F5)
3. Check backend calculation endpoint
4. Verify MongoDB data updated
5. Check console for calculation errors

### Issue: CORS error in production
**Solutions:**
1. Check FRONTEND_URL on Render matches Vercel URL exactly
2. Include protocol: `https://your-app.vercel.app`
3. No trailing slash
4. Redeploy backend after changing
5. Clear browser cache

### Issue: OTP resend not working
**Solutions:**
1. Wait 30 seconds between requests
2. Check backend OTP store not full
3. Verify email service working
4. Check rate limiting not triggered

---

## Test Results Template

```
Test Date: ___________
Tester: ___________
Environment: [ ] Local  [ ] Production

=== Core Functionality ===
Registration & Email OTP:  [ ] Pass  [ ] Fail  Notes: __________
Login & Dashboard:         [ ] Pass  [ ] Fail  Notes: __________
Profile Photo Upload:      [ ] Pass  [ ] Fail  Notes: __________
Document Upload:           [ ] Pass  [ ] Fail  Notes: __________

=== All Sections ===
Profile Summary:           [ ] Pass  [ ] Fail  Notes: __________
Credentials:               [ ] Pass  [ ] Fail  Notes: __________
Identity:                  [ ] Pass  [ ] Fail  Notes: __________
Clinic Details:            [ ] Pass  [ ] Fail  Notes: __________
Online Consultation:       [ ] Pass  [ ] Fail  Notes: __________
Fees & Payment:            [ ] Pass  [ ] Fail  Notes: __________

=== Advanced ===
Profile Completion:        [ ] Pass  [ ] Fail  Notes: __________
Data Persistence:          [ ] Pass  [ ] Fail  Notes: __________
Error Handling:            [ ] Pass  [ ] Fail  Notes: __________
Cloudinary Integration:    [ ] Pass  [ ] Fail  Notes: __________
Email OTP System:          [ ] Pass  [ ] Fail  Notes: __________

=== Production Only ===
CORS Configuration:        [ ] Pass  [ ] Fail  Notes: __________
File Persistence:          [ ] Pass  [ ] Fail  Notes: __________
Performance:               [ ] Pass  [ ] Fail  Notes: __________

Critical Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________

Minor Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________
```

---

## Ready for Production Checklist

Before deploying, verify:
- ✅ All local tests pass
- ✅ Cloudinary account created and configured
- ✅ Gmail App Password generated and tested
- ✅ Environment variables documented in .env.example
- ✅ No sensitive data hardcoded
- ✅ .env files in .gitignore
- ✅ MongoDB connection secure
- ✅ CORS configured for production URL
- ✅ Error handling implemented
- ✅ File upload size limits set
- ✅ OTP expiry working correctly

---

## Future Testing (Admin & User Panels)

When connecting Admin and User panels:

### Admin Panel Tests:
- [ ] Admin can view all doctor registrations
- [ ] Admin can approve/reject doctors
- [ ] Admin can view uploaded documents
- [ ] Admin can moderate content
- [ ] Admin dashboard analytics work

### User Panel Tests:
- [ ] Users can search approved doctors
- [ ] Users can view doctor profiles with images
- [ ] Users can book appointments
- [ ] Users can see doctor availability
- [ ] User-doctor messaging works

### Integration Tests:
- [ ] Doctor approval reflects in user search
- [ ] Profile updates sync to user view
- [ ] Appointment booking updates availability
- [ ] Role-based access control works
- [ ] Data flows correctly between panels

---

## Monitoring & Maintenance

### Weekly Checks:
- [ ] Check Cloudinary storage usage
- [ ] Check email sending limits
- [ ] Review error logs on Render
- [ ] Check MongoDB storage
- [ ] Monitor API response times

### Monthly Checks:
- [ ] Review Cloudinary quota
- [ ] Check for security updates
- [ ] Review user feedback
- [ ] Optimize database queries
- [ ] Update dependencies

---

All systems configured! 🚀

**Next Steps:**
1. Follow `CLOUDINARY_EMAIL_SETUP.md` to get credentials
2. Test locally with real Cloudinary & Gmail
3. Deploy to Render & Vercel
4. Test production deployment
5. Ready for users!
