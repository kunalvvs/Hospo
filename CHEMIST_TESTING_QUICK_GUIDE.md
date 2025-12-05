# Chemist Dashboard - Quick Testing Guide

## Start the Application

### Terminal 1: Backend
```bash
cd backend
npm start
```
Expected output: `Server running on port 5000` and `MongoDB connected`

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
Expected output: `Local: http://localhost:5173`

## Test Sequence

### 1. Working Hours Section ⏰

**Edit Mode:**
1. Click sidebar menu → "Working Hours"
2. Click "Edit Working Hours" button
3. Set Monday opening time: `09:00`, closing time: `21:00`
4. Set Tuesday-Friday similar times
5. Check "24×7 Available" checkbox
6. Set Delivery Start: `10:00`, Delivery End: `20:00`
7. Click "Save Hours" button

**Verify:**
- Success message appears
- Returns to view mode
- Monday shows: `09:00 - 21:00`
- 24×7 shows: `Yes`
- Delivery times display correctly
- Refresh page → Data still there

---

### 2. License & Registration Section 📜

**Edit Mode:**
1. Click sidebar menu → "Licenses & Registration"
2. Click "Edit License Details" button
3. Fill Drug License Number: `DL12345`
4. Upload Drug License Certificate (PDF/JPG)
5. Fill GST Number: `27AABCU9603R1Z1`
6. Upload GST Certificate
7. Fill PAN Number: `ABCDE1234F`
8. Upload PAN Card
9. Upload Shop License
10. **Upload Owner/Manager Identity Proof** (Aadhar/DL)
11. **Fill Pharmacist Registration Number:** `PRC12345`
12. **Upload Pharmacist Registration Certificate**
13. Click "Save Changes"

**Verify:**
- All 10 fields show in view mode
- "View Document" buttons open files in new tab
- All numbers display correctly
- Format is clean and readable
- Refresh page → All data persists

---

### 3. Services & Facilities Section 🚚

**Edit Mode:**
1. Click sidebar menu → "Services & Facilities"
2. Click "Edit Services" button
3. Check these service boxes:
   - ✅ Prescription Fulfilment
   - ✅ Home Delivery
   - ✅ Same-day Delivery
   - ✅ Online Ordering
   - ✅ Cash on Delivery
4. Set "Medicine Substitutions": `Yes, with customer approval`
5. Set "Accept Online Orders": `Yes`
6. Set "Order Cutoff Time": `20:00`
7. Set "Max Delivery Radius": `5` km
8. Set "Minimum Order Value": `100` rupees
9. Fill "Refund Policy": `7 days return with prescription`
10. Fill "Prescription Verification": `Verify with local doctor or valid prescription copy`
11. Click "Save Services"

**Verify:**
- View mode shows all checked services as "Yes"
- View mode shows all settings values
- Refund policy text displays
- Refresh page → All data persists

---

### 4. Payments & Billing Section 💳

**Edit Mode:**
1. Click sidebar menu → "Payments & Billing"
2. Click "Edit Payment Settings" button
3. Check payment methods:
   - ✅ Cash
   - ✅ UPI
   - ✅ Mobile Wallets
4. Upload Cancelled Cheque (PDF/JPG)
5. Fill GSTIN: `27AABCU9603R1Z1`
6. Fill Legal Name: `ABC Pharmacy Private Limited`
7. Click "Save Payment Settings"

**Verify:**
- View mode shows: Cash: Yes, UPI: Yes, Wallets: Yes
- "View Document" button for cancelled cheque works
- GSTIN displays correctly
- Legal name displays correctly
- Refresh page → All data persists

---

### 5. Product Inventory Section 💊

**Add First Product:**
1. Click sidebar menu → "Product Inventory"
2. Click "Add Product" button
3. Fill form:
   - Product ID: `MED001`
   - Medicine Name: `Dolo 650`
   - Manufacturer: `Micro Labs`
   - Generic Name: `Paracetamol`
   - Formulation: `Tablet`
   - Strength: `650 mg`
   - Pack Description: `Strip of 15 tablets`
   - MRP: `30`
   - Selling Price: `28`
   - Cost Price: `20`
   - GST Slab: `12%`
   - Discount: `5`
   - Stock Quantity: `100`
   - Offer Tag: `5% Off`
4. Click "Add Product"

**Verify:**
- Success message: "Product added successfully!"
- Form resets to empty
- Automatically switches to product list view
- Product card shows all details

**Add Second Product:**
1. Click "Close" to return to main view
2. Click "Add Product" again
3. Fill form:
   - Medicine Name: `Crocin Advance`
   - Manufacturer: `GSK`
   - Generic Name: `Paracetamol`
   - Formulation: `Tablet`
   - Strength: `500 mg`
   - MRP: `20`
   - Selling Price: `18`
   - Stock Quantity: `200`
4. Click "Add Product"

**View All Products:**
1. Click "View All Products" button
2. Verify:
   - Shows 2 product cards
   - Both products display all details
   - MRP, Selling Price shown with ₹ symbol
   - Discount and Offer tags visible
   - Delete button on each card

**Delete Product:**
1. Click "Delete" on second product (Crocin)
2. Confirm deletion
3. Verify:
   - Success message appears
   - Only 1 product remains
   - Button now shows: "View All Products (1)"

**Verify Persistence:**
- Click "Close" and open again → Product still there
- Refresh page → Product persists
- Check MongoDB → Inventory array has product data

---

## Database Verification

### Check MongoDB Data

```javascript
// Connect to MongoDB
use <your-database-name>

// Find your chemist record
db.chemists.findOne({ email: "your-chemist-email" })

// Verify sections exist:
// - operatingHours: { monday: {open, close}, ... }
// - is24x7: true/false
// - ownerIdentityProof: "cloudinary_url"
// - pharmacistRegistrationNumber: "PRC12345"
// - pharmacistCertificate: "cloudinary_url"
// - services: { prescriptionFulfilment: true, ... }
// - serviceSettings: { substitutionAllowed: "Yes, with...", ... }
// - paymentSettings: { paymentMethods: {cash: true, ...}, ... }
// - inventory: [{ medicineName: "Dolo 650", ... }]
```

---

## Troubleshooting

### Error: "Failed to save"
**Check:**
1. Backend terminal for error messages
2. MongoDB connection status
3. Network tab in browser (status code)
4. Required fields filled

### Error: "Uploading..." stuck
**Check:**
1. `backend/config/cloudinary.js` has valid credentials
2. File size < 10MB
3. File format is PDF, JPG, JPEG, or PNG
4. Backend terminal for Cloudinary errors

### Data not displaying
**Check:**
1. Refresh page to reload from backend
2. Check localStorage: `localStorage.getItem('chemistData')`
3. Check MongoDB for saved data
4. Check browser console for errors

### Product not adding
**Check:**
1. Required fields filled: Medicine Name, MRP, Selling Price
2. Backend terminal for validation errors
3. MongoDB inventory array structure
4. Network tab for API response

---

## Success Criteria ✅

All tests pass when:
- ✅ Working Hours saves and displays all days + delivery times
- ✅ License shows all 10 fields with proper formatting
- ✅ Services saves all 10 checkboxes + 7 settings
- ✅ Payments saves payment methods + GST + cheque
- ✅ Inventory adds products with all 13 fields
- ✅ Inventory view shows product list with delete
- ✅ All file uploads work and files accessible
- ✅ All data persists after page refresh
- ✅ No console errors during any operation
- ✅ MongoDB contains all saved data

---

## Performance Check

### Expected Response Times
- Page load: < 2 seconds
- Section save: < 1 second
- File upload: 2-5 seconds (depends on file size)
- Inventory add: < 1 second
- Product list load: < 500ms

### Network Tab Check
```
GET /api/chemist/profile → 200 OK (returns full data)
PUT /api/chemist/profile/section → 200 OK (returns updated data)
POST /api/chemist/profile/upload → 200 OK (returns file URL)
```

---

## Final Verification Checklist

- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] MongoDB connected
- [ ] All 5 sections tested
- [ ] Working Hours: Edit, Save, View working
- [ ] License: All 10 fields working, uploads successful
- [ ] Services: All 10 checkboxes + settings working
- [ ] Payments: All 4 methods + GST + cheque working
- [ ] Inventory: Add, View, Delete working
- [ ] All file uploads working
- [ ] All data persisting after refresh
- [ ] No console errors
- [ ] MongoDB has all data
- [ ] Cloudinary has all uploaded files

---

## Report Issues

If any test fails, note:
1. Section name
2. Exact error message
3. Browser console errors
4. Backend terminal errors
5. Network tab status code
6. Screenshot of issue

This will help diagnose the problem quickly.

---

## Completion

When all tests pass, the Chemist Dashboard is fully functional and ready for production use! 🎉
