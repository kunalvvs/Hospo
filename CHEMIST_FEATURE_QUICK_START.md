# Chemist Feature - Quick Start Checklist

## ✅ Pre-Launch Checklist

### 1. Backend Setup
- [ ] MongoDB is running and connected
- [ ] Environment variables configured (.env file)
  - [ ] `MONGODB_URI` set
  - [ ] `JWT_SECRET` set
  - [ ] `PORT` set (default: 5000)
- [ ] Dependencies installed: `npm install` in `backend/`
- [ ] Backend server running: `npm run dev`
- [ ] Backend accessible at: `http://localhost:5000`

### 2. Frontend Setup
- [ ] Dependencies installed: `npm install` in `user-frontend/`
- [ ] Environment variables configured (.env file)
  - [ ] `VITE_API_URL=http://localhost:5000/api`
- [ ] Frontend server running: `npm run dev`
- [ ] Frontend accessible at: `http://localhost:5173`

### 3. Database Requirements
- [ ] At least 1 chemist exists with:
  - [ ] `isActive: true`
  - [ ] `isVerified: true`
  - [ ] `verificationStatus: 'approved'`
  - [ ] `deletedAt: null`
  - [ ] `latitude` and `longitude` set (for location features)
  - [ ] `inventory` array has at least 1 medicine with `productStatus: 'active'`
  - [ ] `operatingHours` configured
- [ ] At least 1 user account created (role: 'patient')

### 4. Test Data Creation (Optional)

**Create Test Chemist:**
```javascript
// Use MongoDB Compass or mongosh
db.chemists.insertOne({
  pharmacyName: "Test Pharmacy",
  email: "test@pharmacy.com",
  password: "$2a$10$...", // hashed password
  primaryPhone: "9876543210",
  address: "123 Main Street",
  locality: "Sector 5",
  city: "Delhi",
  state: "Delhi",
  pin: "110001",
  latitude: "28.7041",
  longitude: "77.1025",
  isActive: true,
  isVerified: true,
  verificationStatus: "approved",
  deletedAt: null,
  rating: 4.5,
  totalReviews: 0,
  is24x7: false,
  operatingHours: {
    monday: { open: "09:00", close: "21:00", closed: false },
    tuesday: { open: "09:00", close: "21:00", closed: false },
    wednesday: { open: "09:00", close: "21:00", closed: false },
    thursday: { open: "09:00", close: "21:00", closed: false },
    friday: { open: "09:00", close: "21:00", closed: false },
    saturday: { open: "09:00", close: "21:00", closed: false },
    sunday: { open: "10:00", close: "18:00", closed: false }
  },
  homeDelivery: true,
  sameDayDelivery: true,
  cashOnDelivery: true,
  onlineOrdering: true,
  inventory: [
    {
      productId: "MED001",
      medicineName: "Paracetamol 500mg",
      genericName: "Paracetamol",
      manufacturer: "ABC Pharma",
      formulation: "tablet",
      strength: "500mg",
      quantity: 100,
      mrp: 35,
      price: 30,
      costPrice: 25,
      category: "tablets",
      subCategory: "fever",
      prescriptionRequired: false,
      productStatus: "active",
      mainImage: "https://via.placeholder.com/150",
      expiryDate: new Date("2025-12-31")
    }
  ]
})
```

---

## 🚀 Launch Steps

### Step 1: Start Backend
```bash
cd c:\Torion\Hospo\backend
npm run dev
```
**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected: mongodb://...
🔌 Socket.IO initialized
```

### Step 2: Start Frontend
```bash
cd c:\Torion\Hospo\user-frontend
npm run dev
```
**Expected Output:**
```
VITE v7.2.4 ready in 500 ms
➜ Local: http://localhost:5173/
➜ Network: use --host to expose
```

### Step 3: Open Browser
1. Navigate to: `http://localhost:5173/chemist`
2. Allow location permission (optional)
3. You should see chemist cards displayed

---

## 🧪 Quick Test Scenarios

### Test 1: View Chemists (30 seconds)
1. ✅ Go to `/chemist`
2. ✅ See chemist cards with name, location, status
3. ✅ Verify Open/Closed badges
4. ✅ Check distance (if location enabled)

### Test 2: Search Medicines (1 minute)
1. ✅ Type "Paracetamol" in search bar
2. ✅ Wait for results (500ms debounce)
3. ✅ Verify medicines from all chemists shown
4. ✅ Click "View Shop" to open chemist

### Test 3: Place Order (2 minutes)
1. ✅ Click any chemist card
2. ✅ Browse medicines
3. ✅ Click "Add to Cart" on a medicine
4. ✅ Click "Place Order"
5. ✅ If not logged in: Redirects to login
6. ✅ If logged in: Order created, navigates to /orders

### Test 4: Rate Chemist (1 minute)
1. ✅ Open chemist detail page
2. ✅ Click "Rate Now"
3. ✅ Select stars (1-5)
4. ✅ (Optional) Add review text
5. ✅ Click Submit
6. ✅ Rating saved, average updated

---

## 📋 Feature Verification

### Backend APIs Working?
```bash
# Test in browser or Postman:
curl http://localhost:5000/api/chemists
curl "http://localhost:5000/api/chemists/nearby?latitude=28.7041&longitude=77.1025"
curl "http://localhost:5000/api/chemists/medicines/search?query=para"
```

### Frontend Pages Loading?
- [ ] `/chemist` - Chemist list page
- [ ] `/chemist/{id}` - Chemist detail page
- [ ] Search bar working
- [ ] Location permission prompt (if geolocation used)

### Key Features Working?
- [ ] Chemists display with correct data
- [ ] Open/Closed status shows correctly
- [ ] Distance calculation (if location enabled)
- [ ] Medicine search returns results
- [ ] Add to cart functionality
- [ ] Place order flow (login check)
- [ ] Rating submission
- [ ] Toast notifications

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /api/chemists"
**Fix:** Backend not running. Start with `npm run dev` in `backend/`

### Issue: Empty chemist list
**Fix:** Check database has active chemists:
```javascript
db.chemists.find({ isActive: true, isVerified: true }).count()
```

### Issue: Location not working
**Fix:** Allow browser location permission or test with city/pincode fallback

### Issue: Search returns nothing
**Fix:** Ensure chemists have medicines in inventory with `productStatus: 'active'`

### Issue: "Please login" on every action
**Fix:** User not logged in. Go to `/login` and login first

### Issue: CORS errors
**Fix:** Check backend CORS configuration:
```javascript
// backend/server.js should have:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 📖 Documentation References

1. **[CHEMIST_FEATURE_IMPLEMENTATION_SUMMARY.md](./CHEMIST_FEATURE_IMPLEMENTATION_SUMMARY.md)**
   - Complete feature overview
   - All files created/modified
   - Technical architecture

2. **[CHEMIST_FEATURE_TESTING_GUIDE.md](./CHEMIST_FEATURE_TESTING_GUIDE.md)**
   - Detailed test cases
   - Expected results
   - API testing examples

3. **[CHEMIST_API_REFERENCE.md](./CHEMIST_API_REFERENCE.md)**
   - All API endpoints
   - Request/response formats
   - cURL examples

---

## 🎯 Success Criteria

Your feature is working correctly if:

✅ Chemist list page loads with chemists
✅ Location-based sorting works (if permission granted)
✅ Medicine search returns results from all chemists
✅ Can navigate to individual chemist pages
✅ Medicine inventory displays correctly
✅ Add to cart functionality works
✅ Order placement requires authentication
✅ Authenticated users can place orders
✅ Rating system works (create and update)
✅ Open/Closed status calculated correctly
✅ Toast notifications appear for actions
✅ No console errors
✅ Responsive design works on mobile/desktop

---

## 💾 Backup Reminder

Before deploying to production:

- [ ] Backup current database
- [ ] Test with real chemist data
- [ ] Verify all API endpoints
- [ ] Test authentication flow
- [ ] Check error handling
- [ ] Verify Socket.IO notifications (if implemented)
- [ ] Test on mobile devices
- [ ] Performance test with many chemists
- [ ] Security audit (SQL injection, XSS, etc.)

---

## 🚀 Ready to Go!

If all checkboxes above are checked, your Chemist & Medicine Ordering Feature is ready for use!

**Next Actions:**
1. Populate database with real chemist data
2. Test thoroughly with real users
3. Monitor error logs
4. Gather user feedback
5. Iterate and improve

**Happy Testing!** 🎉
