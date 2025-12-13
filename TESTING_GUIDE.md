# 🧪 TESTING GUIDE - Ambulance Dashboard Restructuring

## Quick Test Procedure

### Prerequisites:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:5173
- ✅ MongoDB connected
- ✅ Valid ambulance account logged in

---

## Test 1: Driver Management - Add New Driver

### Steps:
1. Navigate to Dashboard → Driver Management
2. Click "➕ Add New Driver" button
3. Fill in the form:
   - **Personal Details**:
     - Driver Full Name: "Rajesh Kumar"
     - Date of Birth: "1985-05-15"
     - Gender: "Male"
     - Mobile: "9876543210"
     - Address: "123 MG Road, Bangalore"
     - Languages: "English, Hindi, Kannada"
   
   - **Emergency Contact**:
     - Name: "Sunita Kumar"
     - Relation: "Wife"
     - Phone: "9876543211"
   
   - **KYC Documents**:
     - ID Type: "Aadhaar Card"
     - ID Number: "1234 5678 9012"
     - Driving Licence Number: "KA01 20240001234"
     - Licence Expiry: "2028-12-31"
     - PAN: "ABCDE1234F"
   
   - **Qualifications**:
     - Driving Experience: "10" years
     - Emergency Vehicle Experience: "Yes"
     - Certification Type: "BLS"
     - Paramedic Training: "Basic EMT"
     - Defensive Driving: "Yes"

4. Click "💾 Add Driver"

### Expected Result:
- ✅ Success message appears
- ✅ Form closes
- ✅ New driver card appears in list view showing:
  - Name: "Driver #1: Rajesh Kumar"
  - Mobile: 9876543210
  - Gender: Male
  - Licence No: KA01 20240001234
  - Experience: 10 years
  - Certification: BLS
- ✅ Edit and Delete buttons visible on card

---

## Test 2: Driver Management - Edit Driver

### Steps:
1. Click "✏️ Edit" button on Rajesh Kumar's card
2. Form populates with all his data
3. Modify fields:
   - Change Mobile to "9999999999"
   - Change Experience to "12" years
   - Change Certification to "Advanced EMT"
4. Click "💾 Update Driver"

### Expected Result:
- ✅ Card updates immediately
- ✅ New mobile number shows: 9999999999
- ✅ Experience shows: 12 years
- ✅ Certification shows: Advanced EMT

---

## Test 3: Driver Management - Add Multiple Drivers

### Steps:
1. Click "➕ Add New Driver" again
2. Add second driver:
   - Name: "Priya Sharma"
   - Mobile: "8888888888"
   - Licence: "KA01 20230005678"
   - Experience: 5 years
3. Click "Add Driver"
4. Repeat for third driver:
   - Name: "Mohammed Ali"
   - Mobile: "7777777777"
   - Licence: "KA01 20220009012"
   - Experience: 8 years

### Expected Result:
- ✅ 3 driver cards display in grid
- ✅ Each card shows unique information
- ✅ All cards have Edit/Delete buttons
- ✅ Grid layout responsive (2 columns on desktop)

---

## Test 4: Driver Management - Delete Driver

### Steps:
1. Click "🗑️ Delete" on Priya Sharma's card
2. Confirmation dialog appears: "Are you sure you want to delete this driver?"
3. Click "OK" to confirm

### Expected Result:
- ✅ Priya's card disappears
- ✅ Only 2 cards remain (Rajesh and Mohammed)
- ✅ Success message shows
- ✅ Grid adjusts layout

---

## Test 5: Navigation - Merged Sections

### Steps:
1. Click on "KYC Documents" in sidebar (if still visible as old reference)
   - **OR** manually navigate to `/ambulance-dashboard?section=kyc`
2. Should see redirect notice
3. Click "Go to Driver Management" button
4. Repeat for "Qualifications" section
5. Repeat for "Vehicle Documents" section
6. Repeat for "Equipment" section

### Expected Result:
- ✅ All old sections show colorful redirect notice
- ✅ Message explains: "This section is now merged into [Parent Section]"
- ✅ Button navigates to correct parent section
- ✅ Parent section opens with full merged functionality

---

## Test 6: Data Persistence

### Steps:
1. With 2-3 drivers added, click browser refresh (F5)
2. Wait for page reload
3. Navigate back to Driver Management

### Expected Result:
- ✅ All driver cards still visible
- ✅ All data intact (names, phones, qualifications)
- ✅ No data loss after refresh

---

## Test 7: Responsive Design

### Steps:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different viewports:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1920px width
4. Navigate through Driver Management
5. Try Add/Edit/Delete operations

### Expected Result:
- ✅ **Mobile**: Single column layout, full-width cards, stacked buttons
- ✅ **Tablet**: 1-2 columns, readable text, proper spacing
- ✅ **Desktop**: 2-3 columns, hover effects, optimal use of space
- ✅ All operations work on all screen sizes
- ✅ No horizontal scrolling
- ✅ No overlapping elements

---

## Test 8: Other Sections (Regression Test)

### Steps:
1. Navigate to "Account Details" - verify it still works
2. Navigate to "Pricing & Payment" - verify it works
3. Navigate to "Operations" - verify service hours editing works
4. Navigate to "Bank Details" - verify bank info editing works
5. Try editing and saving in each section

### Expected Result:
- ✅ All other sections unaffected by driver/vehicle restructuring
- ✅ Edit/Save functionality works
- ✅ No console errors
- ✅ Data persists after save

---

## Test 9: Form Validation

### Steps:
1. Click "Add New Driver"
2. Leave required fields empty (marked with *)
3. Try to save
4. Enter invalid data:
   - Mobile with 9 digits (should be 10)
   - Future date for DOB
   - Past date for licence expiry
5. Try to save

### Expected Result:
- ✅ Required field validation triggers
- ✅ Browser shows validation messages
- ✅ Form doesn't submit with invalid data
- ✅ User can correct and resubmit

---

## Test 10: File Upload (Driver Photo)

### Steps:
1. Edit existing driver or add new driver
2. Scroll to "Driver Photo" field
3. Click "Upload Photo" button
4. Select an image file (.jpg, .png)
5. Wait for upload to complete
6. Save driver

### Expected Result:
- ✅ File uploads to Cloudinary
- ✅ URL stored in database
- ✅ "View Current" button appears after upload
- ✅ Clicking "View Current" opens image in new tab
- ✅ Image persists after page reload

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to add driver"
**Cause**: Backend not running or JWT token expired  
**Solution**: 
- Check backend terminal for errors
- Verify backend running on port 5000
- Try logging out and logging back in

### Issue 2: Driver card doesn't appear after save
**Cause**: Frontend not refreshing data  
**Solution**:
- Check browser console for errors
- Manually refresh page (F5)
- Verify API call succeeded (Network tab)

### Issue 3: Edit form doesn't populate
**Cause**: Driver object missing fields  
**Solution**:
- Check driver data structure in MongoDB
- Verify all fields are being returned by API
- Check console.log in handleEditDriver

### Issue 4: Delete doesn't work
**Cause**: Confirmation dialog blocked or API error  
**Solution**:
- Check browser's popup blocker
- Verify driver._id is valid
- Check backend logs for deletion errors

### Issue 5: Responsive layout broken
**Cause**: CSS not loaded or cache issue  
**Solution**:
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Verify AmbulanceDashboard.css loaded in Network tab

---

## 📊 Test Results Template

```
Date: _____________
Tester: _____________

Test 1 - Add New Driver:        [  ] Pass  [  ] Fail  Notes: ________________
Test 2 - Edit Driver:            [  ] Pass  [  ] Fail  Notes: ________________
Test 3 - Multiple Drivers:       [  ] Pass  [  ] Fail  Notes: ________________
Test 4 - Delete Driver:          [  ] Pass  [  ] Fail  Notes: ________________
Test 5 - Merged Sections:        [  ] Pass  [  ] Fail  Notes: ________________
Test 6 - Data Persistence:       [  ] Pass  [  ] Fail  Notes: ________________
Test 7 - Responsive Design:      [  ] Pass  [  ] Fail  Notes: ________________
Test 8 - Regression Test:        [  ] Pass  [  ] Fail  Notes: ________________
Test 9 - Form Validation:        [  ] Pass  [  ] Fail  Notes: ________________
Test 10 - File Upload:           [  ] Pass  [  ] Fail  Notes: ________________

Overall Status: [  ] All Pass  [  ] Some Failures  [  ] Major Issues

Issues Found:
1. ________________________________________________________________
2. ________________________________________________________________
3. ________________________________________________________________

Recommendations:
________________________________________________________________
________________________________________________________________
```

---

## 🚀 Next Steps After Testing

1. **If All Tests Pass**:
   - Mark Driver section as production-ready ✅
   - Proceed with Vehicle section implementation
   - Plan user training/onboarding

2. **If Tests Fail**:
   - Document failures with screenshots
   - Review error logs (browser console + backend)
   - Fix issues one by one
   - Re-test after each fix

3. **After Driver Tests Pass**:
   - Implement Vehicle Management UI (similar structure)
   - Run same tests for Vehicle section
   - Integration test: Add 2 drivers + 3 vehicles
   - Performance test: 10+ drivers, 10+ vehicles

---

## 📞 Support During Testing

**Check These First**:
1. Browser console (F12) - any red errors?
2. Backend terminal - any error logs?
3. Network tab - API calls returning 200 OK?
4. MongoDB Compass - data actually saved?

**Still Stuck?**
- Review RESTRUCTURING_COMPLETE_SUMMARY.md
- Check API_TESTING_GUIDE.md in backend folder
- Verify environment variables (.env)
- Try incognito mode (cache issues)

---

**Happy Testing! 🎉**
