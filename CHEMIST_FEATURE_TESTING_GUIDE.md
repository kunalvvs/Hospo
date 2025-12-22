# Chemist & Medicine Ordering Feature - Testing Guide

## Overview
This guide explains how to test the newly implemented chemist profiles and medicine ordering feature in the User Frontend.

## ✅ Features Implemented

### 1. **Backend APIs** (Complete)
- ✅ Get all chemists
- ✅ Get nearby chemists (geolocation-based with distance calculation)
- ✅ Search medicines globally across all chemist inventories
- ✅ Check chemist working hours availability (Open/Closed status)
- ✅ Place medicine orders
- ✅ Get user's order history
- ✅ Add ratings and reviews for chemists
- ✅ Get chemist ratings

### 2. **Frontend Pages** (Complete)
- ✅ ChemistPage: Browse chemists and search medicines
- ✅ ChemistDetail: View individual chemist profile and order medicines
- ✅ Real-time search functionality
- ✅ Location-based nearby chemists sorting
- ✅ Add to cart and place orders
- ✅ Rating and review system

## 🚀 Getting Started

### Prerequisites
1. MongoDB running and connected
2. Backend server running on port 5000
3. User frontend running on port 5173
4. Chemist data in database (active, verified chemists with inventory)

### Starting the Servers

#### Backend
```bash
cd c:\Torion\Hospo\backend
npm install
npm run dev
```

#### User Frontend
```bash
cd c:\Torion\Hospo\user-frontend
npm install
npm run dev
```

## 📋 Testing Scenarios

### 1. View All Chemists

**Test Case 1.1: Browse Chemists**
- Navigate to `/chemist` page
- ✅ Should display all active, verified chemists
- ✅ Each chemist card should show:
  - Pharmacy name
  - Location (city, locality)
  - Rating and review count
  - Open/Closed status (✅ or ❌)
  - Services (Home Delivery, Same Day, COD, etc.)
  - Distance (if location enabled)
  - Medicine count

**Expected Result:**
```
✅ Open chemists shown in green badge
❌ Closed chemists shown in red badge
🔴 24x7 chemists shown as "24x7" in green
```

**Test Case 1.2: Nearby Chemists (Geolocation)**
- Allow browser location permission
- ✅ Should show "Showing nearby chemists" with map pin icon
- ✅ Chemists sorted by distance (closest first)
- ✅ Each chemist shows distance in km

**Expected Result:**
```
📍 Location enabled
Chemists sorted: 0.5 km, 1.2 km, 2.5 km, etc.
```

---

### 2. Search Medicines Globally

**Test Case 2.1: Search by Medicine Name**
- Type in search bar: "Paracetamol" (wait 500ms for debounce)
- ✅ Should search across ALL chemist inventories
- ✅ Results show medicine details + chemist info
- ✅ Can click "View Shop" to see chemist profile

**Expected Result:**
```
Search Results (X):
Medicine: Paracetamol 500mg
Price: ₹30 (10% OFF)
Chemist: ABC Pharmacy, City Center • 2.5 km away
[View Shop] button
```

**Test Case 2.2: Search Minimum Length**
- Type 1 character: "P"
- ✅ Should not trigger search (minimum 2 characters)
- Type 2 characters: "Pa"
- ✅ Should trigger search after 500ms

**Test Case 2.3: Clear Search**
- Click "Clear" button
- ✅ Search results cleared
- ✅ Returns to chemists list view

---

### 3. View Individual Chemist Profile

**Test Case 3.1: Open Chemist Details**
- Click any chemist card from the list
- ✅ Navigate to `/chemist/{id}`
- ✅ Should show complete chemist information:
  - Pharmacy name
  - Full address
  - Phone (clickable - opens dialer)
  - Email (clickable - opens email)
  - Rating with "Rate Now" button
  - Open/Closed status
  - Services badges

**Test Case 3.2: View Medicines Inventory**
- Scroll down to medicines grid
- ✅ Should display all active medicines
- ✅ Each medicine card shows:
  - Image (or default icon)
  - Medicine name
  - Strength
  - Price and MRP
  - Stock availability
  - Add to Cart button

**Test Case 3.3: Filter by Category**
- Click category filter buttons (All, tablets, syrup, etc.)
- ✅ Only medicines of selected category shown
- ✅ Active category highlighted in blue

**Test Case 3.4: Search within Chemist**
- Type medicine name in search box
- ✅ Filters medicines in real-time
- ✅ Works with generic name search too

---

### 4. Add to Cart & Place Order

**Test Case 4.1: Add Medicine to Cart**
- Click "Add to Cart" on any medicine
- ✅ Button changes to quantity selector (-  [1]  +)
- ✅ Toast notification: "Added to cart"
- ✅ Cart icon in header shows badge count

**Test Case 4.2: Adjust Quantity**
- Click (+) to increase quantity
- ✅ Quantity increases
- ✅ Cannot exceed available stock
- Click (-) to decrease
- ✅ Quantity decreases
- ✅ If quantity = 0, removes from cart

**Test Case 4.3: Cart Footer Display**
- Add items to cart
- ✅ Fixed footer appears at bottom
- ✅ Shows: "X items in cart"
- ✅ Shows: "Total: ₹XXX"
- ✅ "Place Order" button visible

**Test Case 4.4: Place Order (Authenticated)**
- Login as user
- Add medicines to cart
- Click "Place Order"
- ✅ Order created successfully
- ✅ Toast: "Order placed successfully"
- ✅ Navigates to `/orders` page
- ✅ Cart cleared

**Test Case 4.5: Place Order (Not Authenticated)**
- Logout
- Add medicines to cart
- Click "Place Order"
- ✅ Toast: "Please login to place order"
- ✅ Redirects to `/login`

---

### 5. Rating & Review System

**Test Case 5.1: Submit Rating**
- Open chemist detail page
- Click "Rate Now" button
- ✅ Modal opens with star rating
- Select star rating (1-5)
- ✅ Stars fill up to selected rating
- (Optional) Add review text
- Click "Submit"
- ✅ Rating submitted
- ✅ Toast: "Rating submitted successfully"
- ✅ Modal closes
- ✅ Chemist's average rating updates

**Test Case 5.2: Update Existing Rating**
- Submit a rating for a chemist
- Click "Rate Now" again
- ✅ Submit new rating
- ✅ Previous rating updated (not duplicated)

**Test Case 5.3: Rating without Login**
- Logout
- Click "Rate Now"
- ✅ Toast: "Please login to rate"
- ✅ Redirects to `/login`

---

### 6. Working Hours (Open/Closed Status)

**Test Case 6.1: Check 24x7 Chemist**
- Find chemist with `is24x7: true`
- ✅ Badge shows "24x7" in green
- ✅ Status API returns `{ isOpen: true, is24x7: true }`

**Test Case 6.2: Check Open Chemist**
- Current time is within operating hours (e.g., 9 AM - 9 PM)
- ✅ Badge shows "Open" in green
- ✅ Status API returns `{ isOpen: true }`

**Test Case 6.3: Check Closed Chemist**
- Current time is outside operating hours
- ✅ Badge shows "Closed" in red
- ✅ Status API returns `{ isOpen: false, message: "Closed now" }`

**Test Case 6.4: Check Closed Day**
- Chemist has `operatingHours.monday.closed: true`
- On Monday:
- ✅ Badge shows "Closed" in red
- ✅ Status API returns `{ isOpen: false, message: "Closed today" }`

---

## 🧪 API Testing with Postman/Thunder Client

### 1. Get All Chemists
```
GET http://localhost:5000/api/chemists
```
**Expected Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### 2. Get Nearby Chemists
```
GET http://localhost:5000/api/chemists/nearby?latitude=28.7041&longitude=77.1025&radius=10
```
**Expected Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "pharmacyName": "ABC Pharmacy",
      "distance": 2.5,
      ...
    }
  ]
}
```

### 3. Search Medicines
```
GET http://localhost:5000/api/chemists/medicines/search?query=paracetamol
```
**Expected Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "medicine": {
        "id": "...",
        "name": "Paracetamol 500mg",
        "price": 30,
        ...
      },
      "chemist": {
        "id": "...",
        "pharmacyName": "ABC Pharmacy",
        ...
      }
    }
  ]
}
```

### 4. Check Availability
```
GET http://localhost:5000/api/chemists/{chemistId}/availability
```
**Expected Response:**
```json
{
  "success": true,
  "isOpen": true,
  "currentDay": "monday",
  "openTime": "09:00",
  "closeTime": "21:00",
  "message": "Open now"
}
```

### 5. Place Order (Requires Auth Token)
```
POST http://localhost:5000/api/chemists/orders
Headers: Authorization: Bearer {token}
Body:
{
  "chemistId": "...",
  "medicines": [
    {
      "productId": "MED001",
      "medicineName": "Paracetamol 500mg",
      "quantity": 2,
      "price": 30,
      "mrp": 35,
      "discount": 5
    }
  ],
  "deliveryType": "home-delivery",
  "paymentMethod": "cash",
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
  }
}
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderNumber": "ORD1234567890123",
    "status": "pending",
    ...
  }
}
```

### 6. Get My Orders (Requires Auth)
```
GET http://localhost:5000/api/chemists/orders/my-orders
Headers: Authorization: Bearer {token}
```

### 7. Add Rating (Requires Auth)
```
POST http://localhost:5000/api/chemists/{chemistId}/rating
Headers: Authorization: Bearer {token}
Body:
{
  "rating": 5,
  "review": "Excellent service!"
}
```

### 8. Get Ratings
```
GET http://localhost:5000/api/chemists/{chemistId}/ratings
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to load chemists"
**Cause:** Backend not running or MongoDB not connected
**Solution:**
```bash
cd backend
npm run dev
# Check MongoDB connection in logs
```

### Issue 2: Location not working
**Cause:** Browser location permission denied
**Solution:**
- Allow location permission in browser
- Fallback: Shows all chemists (not sorted by distance)

### Issue 3: Search not working
**Cause:** Query less than 2 characters or API error
**Solution:**
- Type at least 2 characters
- Wait 500ms for debounce
- Check network tab for API errors

### Issue 4: "Please login to place order"
**Cause:** User not authenticated
**Solution:**
- Login at `/login`
- Token stored in localStorage
- Retry order placement

### Issue 5: Empty chemist list
**Cause:** No chemists in database OR chemists not verified/active
**Solution:**
```javascript
// Check database
db.chemists.find({ isActive: true, isVerified: true })

// Ensure chemists have:
// - isActive: true
// - isVerified: true
// - verificationStatus: 'approved'
// - deletedAt: null
```

---

## 📊 Expected Database Structure

### Chemist Document (Sample)
```javascript
{
  _id: ObjectId("..."),
  pharmacyName: "ABC Pharmacy",
  email: "abc@pharmacy.com",
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
  rating: 4.5,
  totalReviews: 120,
  is24x7: false,
  operatingHours: {
    monday: { open: "09:00", close: "21:00", closed: false },
    // ... other days
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
      category: "tablets",
      prescriptionRequired: false,
      productStatus: "active",
      mainImage: "https://...",
      expiryDate: "2025-12-31"
    }
  ]
}
```

---

## ✅ Testing Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can view all chemists
- [ ] Location permission works
- [ ] Nearby chemists sorted by distance
- [ ] Search medicines works (2+ chars)
- [ ] Search results display correctly
- [ ] Can open chemist detail page
- [ ] Chemist info displays completely
- [ ] Medicines grid loads
- [ ] Category filter works
- [ ] Medicine search within chemist works
- [ ] Add to cart works
- [ ] Quantity adjustment works
- [ ] Cart total calculates correctly
- [ ] Place order requires login
- [ ] Order placed successfully
- [ ] Rating modal opens
- [ ] Rating submission works
- [ ] Rating updates chemist's average
- [ ] Open/Closed status shows correctly
- [ ] 24x7 chemists marked properly
- [ ] Service badges display
- [ ] Phone/email links work
- [ ] Toast notifications appear
- [ ] Navigation works correctly

---

## 🎯 Next Steps (Optional Enhancements)

1. **Socket.IO Real-time Updates**
   - Chemist receives notification when order placed
   - User receives notification when order status changes

2. **Order Tracking**
   - Create MyOrdersPage to show order history
   - Order status updates (pending → accepted → delivered)
   - Cancel order functionality

3. **Prescription Upload**
   - Add file upload for prescription-required medicines
   - Cloudinary integration

4. **Payment Integration**
   - Razorpay/Stripe payment gateway
   - Online payment support

5. **Advanced Filters**
   - Filter by price range
   - Filter by rating
   - Filter by services (home delivery, COD, etc.)

---

## 📞 Support

For issues or questions:
- Check browser console for errors
- Check network tab for API responses
- Verify MongoDB data structure
- Check backend logs

**Happy Testing!** 🎉
