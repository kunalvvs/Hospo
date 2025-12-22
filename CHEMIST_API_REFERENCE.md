# Chemist & Medicine API Reference

Quick reference for all chemist-related API endpoints.

## Base URL
```
http://localhost:5000/api/chemists
```

---

## 📋 API Endpoints

### 1. Get All Chemists
**Endpoint:** `GET /api/chemists`  
**Auth Required:** No  
**Description:** Get all active and verified chemists

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "chemist123",
      "pharmacyName": "ABC Pharmacy",
      "email": "abc@pharmacy.com",
      "primaryPhone": "9876543210",
      "locality": "Sector 5",
      "city": "Delhi",
      "state": "Delhi",
      "latitude": "28.7041",
      "longitude": "77.1025",
      "rating": 4.5,
      "totalReviews": 120,
      "is24x7": false,
      "homeDelivery": true,
      "sameDayDelivery": true,
      "inventory": [...]
    }
  ]
}
```

---

### 2. Get Nearby Chemists
**Endpoint:** `GET /api/chemists/nearby`  
**Auth Required:** No  
**Description:** Get chemists near user location, sorted by distance

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latitude | Number | Yes* | User's latitude |
| longitude | Number | Yes* | User's longitude |
| radius | Number | No | Search radius in km (default: 10) |
| city | String | No | City name (fallback) |
| pincode | String | No | PIN code (fallback) |

*Either coordinates OR city/pincode required

**Example Request:**
```
GET /api/chemists/nearby?latitude=28.7041&longitude=77.1025&radius=10
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "chemist123",
      "pharmacyName": "ABC Pharmacy",
      "distance": 2.5,
      "latitude": "28.7041",
      "longitude": "77.1025",
      ...
    }
  ]
}
```

---

### 3. Search Medicines Globally
**Endpoint:** `GET /api/chemists/medicines/search`  
**Auth Required:** No  
**Description:** Search for medicines across all chemist inventories

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | String | Yes | Search query (min 2 characters) |
| category | String | No | Filter by category |
| prescriptionRequired | Boolean | No | Filter by prescription requirement |
| minPrice | Number | No | Minimum price filter |
| maxPrice | Number | No | Maximum price filter |

**Example Request:**
```
GET /api/chemists/medicines/search?query=paracetamol&category=tablets
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "medicine": {
        "id": "med123",
        "productId": "MED001",
        "name": "Paracetamol 500mg",
        "genericName": "Paracetamol",
        "manufacturer": "ABC Pharma",
        "formulation": "tablet",
        "strength": "500mg",
        "price": 30,
        "mrp": 35,
        "discount": 5,
        "category": "tablets",
        "prescriptionRequired": false,
        "quantity": 100,
        "mainImage": "https://..."
      },
      "chemist": {
        "id": "chemist123",
        "pharmacyName": "ABC Pharmacy",
        "city": "Delhi",
        "locality": "Sector 5",
        "pin": "110001",
        "primaryPhone": "9876543210",
        "latitude": "28.7041",
        "longitude": "77.1025",
        "rating": 4.5,
        "totalReviews": 120
      }
    }
  ]
}
```

---

### 4. Get Chemist by ID
**Endpoint:** `GET /api/chemists/:id`  
**Auth Required:** No  
**Description:** Get detailed information about a specific chemist

**Example Request:**
```
GET /api/chemists/673abc123def456789
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "chemist123",
    "pharmacyName": "ABC Pharmacy",
    "email": "abc@pharmacy.com",
    "primaryPhone": "9876543210",
    "address": "123 Main Street",
    "locality": "Sector 5",
    "city": "Delhi",
    "state": "Delhi",
    "pin": "110001",
    "latitude": "28.7041",
    "longitude": "77.1025",
    "rating": 4.5,
    "totalReviews": 120,
    "is24x7": false,
    "operatingHours": {
      "monday": { "open": "09:00", "close": "21:00", "closed": false },
      "tuesday": { "open": "09:00", "close": "21:00", "closed": false },
      ...
    },
    "homeDelivery": true,
    "sameDayDelivery": true,
    "cashOnDelivery": true,
    "onlineOrdering": true,
    "inventory": [
      {
        "_id": "med123",
        "productId": "MED001",
        "medicineName": "Paracetamol 500mg",
        "genericName": "Paracetamol",
        "quantity": 100,
        "price": 30,
        "mrp": 35,
        "productStatus": "active",
        ...
      }
    ]
  }
}
```

---

### 5. Check Chemist Availability
**Endpoint:** `GET /api/chemists/:id/availability`  
**Auth Required:** No  
**Description:** Check if chemist is currently open based on working hours

**Example Request:**
```
GET /api/chemists/673abc123def456789/availability
```

**Response (Open):**
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

**Response (Closed):**
```json
{
  "success": true,
  "isOpen": false,
  "currentDay": "monday",
  "openTime": "09:00",
  "closeTime": "21:00",
  "message": "Closed now"
}
```

**Response (24x7):**
```json
{
  "success": true,
  "isOpen": true,
  "is24x7": true,
  "message": "Open 24/7"
}
```

---

### 6. Place Medicine Order
**Endpoint:** `POST /api/chemists/orders`  
**Auth Required:** ✅ Yes (User)  
**Description:** Create a new medicine order

**Headers:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "chemistId": "673abc123def456789",
  "medicines": [
    {
      "productId": "MED001",
      "medicineName": "Paracetamol 500mg",
      "quantity": 2,
      "price": 30,
      "mrp": 35,
      "discount": 5,
      "prescriptionRequired": false
    },
    {
      "productId": "MED002",
      "medicineName": "Amoxicillin 500mg",
      "quantity": 1,
      "price": 120,
      "mrp": 150,
      "discount": 30,
      "prescriptionRequired": true
    }
  ],
  "prescriptionImage": "https://cloudinary.com/...",
  "deliveryType": "home-delivery",
  "paymentMethod": "cash",
  "deliveryAddress": {
    "street": "123 Main Street",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
  },
  "customerNotes": "Please call before delivery"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "order123",
    "orderNumber": "ORD1703123456789001",
    "user": "user123",
    "chemist": "chemist123",
    "medicines": [...],
    "subtotal": 180,
    "discount": 40,
    "deliveryCharge": 30,
    "totalAmount": 170,
    "status": "pending",
    "deliveryType": "home-delivery",
    "paymentMethod": "cash",
    "paymentStatus": "pending",
    "orderDate": "2024-12-21T10:30:00.000Z",
    "createdAt": "2024-12-21T10:30:00.000Z"
  }
}
```

**Error Response (Not Authenticated):**
```json
{
  "success": false,
  "message": "Not authorized, token required"
}
```

---

### 7. Get My Orders
**Endpoint:** `GET /api/chemists/orders/my-orders`  
**Auth Required:** ✅ Yes (User)  
**Description:** Get all orders placed by the logged-in user

**Headers:**
```
Authorization: Bearer {your_jwt_token}
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "order123",
      "orderNumber": "ORD1703123456789001",
      "chemist": {
        "_id": "chemist123",
        "pharmacyName": "ABC Pharmacy",
        "city": "Delhi",
        "locality": "Sector 5",
        "primaryPhone": "9876543210"
      },
      "medicines": [
        {
          "medicineName": "Paracetamol 500mg",
          "quantity": 2,
          "price": 30
        }
      ],
      "totalAmount": 170,
      "status": "pending",
      "orderDate": "2024-12-21T10:30:00.000Z",
      "createdAt": "2024-12-21T10:30:00.000Z"
    }
  ]
}
```

---

### 8. Add Rating & Review
**Endpoint:** `POST /api/chemists/:id/rating`  
**Auth Required:** ✅ Yes (User)  
**Description:** Submit or update a rating for a chemist

**Headers:**
```
Authorization: Bearer {your_jwt_token}
```

**Request Body:**
```json
{
  "rating": 5,
  "review": "Excellent service! Fast delivery and genuine medicines."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rating submitted successfully",
  "data": {
    "_id": "rating123",
    "user": "user123",
    "chemist": "chemist123",
    "rating": 5,
    "review": "Excellent service! Fast delivery and genuine medicines.",
    "helpfulCount": 0,
    "isVerified": false,
    "createdAt": "2024-12-21T10:30:00.000Z"
  }
}
```

**Validation Errors:**
```json
{
  "success": false,
  "message": "Rating must be between 1 and 5"
}
```

---

### 9. Get Chemist Ratings
**Endpoint:** `GET /api/chemists/:id/ratings`  
**Auth Required:** No  
**Description:** Get all ratings and reviews for a chemist

**Example Request:**
```
GET /api/chemists/673abc123def456789/ratings
```

**Response:**
```json
{
  "success": true,
  "count": 120,
  "data": [
    {
      "_id": "rating123",
      "user": {
        "_id": "user123",
        "name": "John Doe"
      },
      "rating": 5,
      "review": "Excellent service! Fast delivery and genuine medicines.",
      "helpfulCount": 15,
      "isVerified": true,
      "createdAt": "2024-12-21T10:30:00.000Z"
    },
    {
      "_id": "rating124",
      "user": {
        "_id": "user124",
        "name": "Jane Smith"
      },
      "rating": 4,
      "review": "Good pharmacy, but delivery was slightly delayed.",
      "helpfulCount": 8,
      "isVerified": false,
      "createdAt": "2024-12-20T15:20:00.000Z"
    }
  ]
}
```

---

## 🔐 Authentication

### Getting Auth Token

1. **Register/Login:**
```
POST /api/auth/login
Body: { "email": "user@example.com", "password": "password123", "role": "patient" }
```

2. **Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

3. **Use Token:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🧪 Testing with cURL

### Get All Chemists
```bash
curl http://localhost:5000/api/chemists
```

### Get Nearby Chemists
```bash
curl "http://localhost:5000/api/chemists/nearby?latitude=28.7041&longitude=77.1025&radius=10"
```

### Search Medicines
```bash
curl "http://localhost:5000/api/chemists/medicines/search?query=paracetamol"
```

### Place Order (with Auth)
```bash
curl -X POST http://localhost:5000/api/chemists/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chemistId": "673abc123def456789",
    "medicines": [{
      "productId": "MED001",
      "medicineName": "Paracetamol 500mg",
      "quantity": 2,
      "price": 30,
      "mrp": 35
    }],
    "deliveryType": "home-delivery",
    "paymentMethod": "cash",
    "deliveryAddress": {
      "street": "123 Main Street",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110001"
    }
  }'
```

### Add Rating (with Auth)
```bash
curl -X POST http://localhost:5000/api/chemists/673abc123def456789/rating \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "review": "Excellent service!"
  }'
```

---

## 📊 Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Request successful |
| 201 | Created | Order/Rating created |
| 400 | Bad Request | Invalid input (e.g., rating > 5) |
| 401 | Unauthorized | Missing/invalid auth token |
| 404 | Not Found | Chemist not found |
| 500 | Server Error | Database/server issue |

---

## 🔄 Order Status Flow

```
pending → accepted → processing → ready → out-for-delivery → delivered
                ↓
              rejected
                ↓
             cancelled
```

---

## 💡 Tips

1. **Search Optimization**: Use at least 2 characters for medicine search
2. **Distance Calculation**: Haversine formula used for accuracy
3. **Debouncing**: Frontend implements 500ms debounce for search
4. **Rating Uniqueness**: One rating per user per chemist (updates existing)
5. **Working Hours**: Checked server-side based on current time
6. **Socket.IO**: Orders trigger real-time notifications to chemists

---

For detailed testing instructions, see [CHEMIST_FEATURE_TESTING_GUIDE.md](./CHEMIST_FEATURE_TESTING_GUIDE.md)
