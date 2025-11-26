# Torion Healthcare Platform - Backend API

## 🚀 Tech Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure
```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── doctorController.js  # Doctor CRUD operations
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   └── Doctor.js            # Doctor schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── doctorRoutes.js      # Doctor endpoints
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── server.js                # Entry point
```

## 🔧 Installation

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env`

4. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on: **http://localhost:5000**

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. Register Doctor
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Dr. John Doe",
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor registered successfully",
  "token": "jwt_token_here",
  "doctor": {
    "id": "doctor_id",
    "name": "Dr. John Doe",
    "phone": "9876543210",
    "role": "doctor"
  }
}
```

#### 2. Login Doctor
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "doctor": {
    "id": "doctor_id",
    "name": "Dr. John Doe",
    "phone": "9876543210",
    "role": "doctor",
    "isVerified": false
  }
}
```

#### 3. Get Current Doctor
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Doctor Routes (`/api/doctors`)

#### 1. Get Doctor Profile
```http
GET /api/doctors/profile
Authorization: Bearer {token}
```

#### 2. Update Complete Profile
```http
PUT /api/doctors/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "profileTitle": "Dr. John Doe, MBBS, MD",
  "bio": "Experienced cardiologist...",
  "experience": 10,
  "primarySpecialization": "Cardiology",
  ...
}
```

#### 3. Update Specific Section
```http
PUT /api/doctors/profile/:section
Authorization: Bearer {token}
Content-Type: application/json

Sections: profile, credentials, identity, clinic, online, fees

Example:
PUT /api/doctors/profile/profile
{
  "profileTitle": "Dr. John Doe, MBBS",
  "bio": "Experienced doctor",
  "languages": ["English", "Hindi"],
  "experience": 10
}
```

#### 4. Get All Doctors (Public)
```http
GET /api/doctors
```

#### 5. Get Doctor by ID (Public)
```http
GET /api/doctors/:id
```

#### 6. Delete Profile
```http
DELETE /api/doctors/profile
Authorization: Bearer {token}
```

## 📊 Doctor Schema Fields

### Profile Summary
- profilePhoto
- profileTitle
- bio
- languages (array)
- otherLanguages
- experience
- primarySpecialization
- secondarySpecialization
- servicesOffered (array)
- otherServices

### Medical Credentials
- registrationNumber
- registrationCouncil
- registrationCertificate
- degrees (array of objects)
- degreeCertificates (array)

### Identity Proof
- idType
- idNumber
- idDocument
- signaturePhoto

### Clinic Details
- clinicName
- clinicStreet
- clinicLandmark
- clinicCity
- clinicState
- clinicPincode
- clinicLocation (lat, lng)
- clinicLandline
- clinicMobile
- clinicTimings (array)
- consultationTypes (array)
- facilities (array)
- clinicPhotos (array)
- ownershipProof

### Online Consultation
- onlineConsultation (boolean)
- onlineConsultationFee
- consultationModes (array)
- slotDuration
- bufferTime
- availableSchedule (array)
- cancellationPolicy
- cancellationPolicyDetails

### Fees & Payment
- consultationFee
- accountHolderName
- accountNumber
- ifscCode
- bankName
- branchName
- accountType
- upiId
- bankDocument

## 🔐 Authentication

All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

Token is received after successful registration or login.

## 🎯 Features

✅ **Complete Authentication System**
- User registration with password hashing
- Secure login with JWT
- Token-based authentication
- Password comparison with bcrypt

✅ **Doctor Profile Management**
- Complete profile CRUD operations
- Section-wise updates (profile, credentials, identity, clinic, online, fees)
- 60+ fields support
- All dashboard data stored in MongoDB

✅ **Security**
- Password hashing with bcryptjs
- JWT token authentication
- Protected routes with middleware
- Role-based access control ready

✅ **Error Handling**
- Comprehensive error messages
- Validation errors
- Database errors
- Authentication errors

## 🧪 Testing the API

### Using cURL:

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "phone": "9876543210",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "password": "password123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/doctors/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman:
1. Import the endpoints
2. Set Authorization type to "Bearer Token"
3. Paste your JWT token
4. Test all endpoints

## 🔄 Integration with Frontend

The backend is ready to be integrated with your React frontend. Update the API base URL in your frontend:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 📝 Next Steps

1. ✅ Backend setup complete
2. ⏳ Connect frontend to backend
3. ⏳ Add file upload functionality (Multer)
4. ⏳ Add email/SMS OTP verification
5. ⏳ Add admin panel backend
6. ⏳ Add patient backend
7. ⏳ Deploy to production

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB URI is correct in `.env`
- Ensure network access is allowed in MongoDB Atlas
- Check firewall settings

**Port Already in Use:**
- Change PORT in `.env` file
- Kill existing process on port 5000

**JWT Token Invalid:**
- Check if JWT_SECRET matches between frontend and backend
- Verify token is being sent in Authorization header
- Check token expiration

## 📞 Support

For issues or questions, check the server logs for detailed error messages.
