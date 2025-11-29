# Backend Integration Guide - Doctor Dashboard

## ✅ Backend Setup Complete!

**Backend Server Status:** Running on `http://localhost:5001`  
**Database:** MongoDB Atlas - Connected ✅  
**JWT Authentication:** Configured ✅

---

## 📁 Backend Structure

```
backend/
├── server.js              # Express server entry point
├── config/
│   └── database.js        # MongoDB connection
├── models/
│   └── Doctor.js          # Doctor schema with 60+ fields
├── routes/
│   ├── authRoutes.js      # /api/auth - Register, Login, Get Profile
│   └── doctorRoutes.js    # /api/doctors - CRUD operations
├── middleware/
│   └── auth.js            # JWT verification middleware
└── package.json           # Dependencies
```

---

## 🔐 Authentication Flow

### 1. **Register New Doctor**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Dr. John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123",
  "role": "doctor"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "doctor": { ... }
}
```

### 2. **Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "doctor": { ... }
}
```

### 3. **Get Current Doctor Profile**
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { ... }
}
```

---

## 📊 Doctor Profile APIs

### Get Profile
```
GET /api/doctors/profile
Authorization: Bearer <token>
```

### Update Complete Profile
```
PUT /api/doctors/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "profileTitle": "Dr. John Doe, MBBS, MD",
  "bio": "Experienced cardiologist...",
  "experience": 10,
  "primarySpecialization": "Cardiology",
  "languages": ["English", "Hindi"],
  "clinicName": "Heart Care Clinic",
  "clinicCity": "Mumbai",
  "consultationFee": 500,
  ...all other fields
}
```

### Update Specific Section
```
PUT /api/doctors/profile/profile-summary
PUT /api/doctors/profile/credentials
PUT /api/doctors/profile/identity
PUT /api/doctors/profile/clinic
PUT /api/doctors/profile/online
PUT /api/doctors/profile/fees

Body: Section-specific fields only
```

---

## 🔧 Frontend Integration

### 1. Update Login Component

Replace localStorage logic with API calls:

```javascript
import { authAPI } from '../services/api';

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await authAPI.login({
      email: email,
      password: password
    });
    
    // Store user data
    localStorage.setItem('currentUser', JSON.stringify(response.doctor));
    
    // Navigate based on role
    if (response.doctor.role === 'doctor') {
      navigate('/doctor-dashboard');
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed');
  }
};
```

### 2. Update Register Component

```javascript
import { authAPI } from '../services/api';

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const response = await authAPI.register({
      name: name,
      email: email,
      phone: phone,
      password: password,
      role: role
    });
    
    localStorage.setItem('currentUser', JSON.stringify(response.doctor));
    navigate('/verify-otp');
  } catch (error) {
    alert(error.response?.data?.message || 'Registration failed');
  }
};
```

### 3. Update DoctorDashboard Component

Replace all save handlers with API calls:

```javascript
import { doctorAPI } from '../services/api';

// Load profile on mount
useEffect(() => {
  const loadProfile = async () => {
    try {
      const response = await doctorAPI.getProfile();
      setDoctorData(response.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };
  
  if (currentUser) {
    loadProfile();
  }
}, [currentUser]);

// Update save handlers
const handleSaveProfile = async () => {
  try {
    await doctorAPI.updateSection('profile-summary', {
      profilePhoto: doctorData.profilePhoto,
      profileTitle: doctorData.profileTitle,
      bio: doctorData.bio,
      languages: doctorData.languages,
      experience: doctorData.experience,
      primarySpecialization: doctorData.primarySpecialization,
      secondarySpecialization: doctorData.secondarySpecialization,
      servicesOffered: doctorData.servicesOffered,
      otherServices: doctorData.otherServices
    });
    
    setIsEditingProfile(false);
    alert('Profile saved successfully!');
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to save profile');
  }
};

// Similar for other sections...
const handleSaveCredentials = async () => { ... };
const handleSaveIdentity = async () => { ... };
const handleSaveClinic = async () => { ... };
const handleSaveOnline = async () => { ... };
const handleSaveFees = async () => { ... };
```

---

## 🧪 Testing the Backend

### Using Thunder Client / Postman

1. **Register a doctor:**
   - POST `http://localhost:5001/api/auth/register`
   - Body: `{ "name": "Test Doctor", "email": "test@test.com", "phone": "9999999999", "password": "test123", "role": "doctor" }`
   - Copy the `token` from response

2. **Get profile:**
   - GET `http://localhost:5001/api/auth/me`
   - Headers: `Authorization: Bearer <paste-token-here>`

3. **Update profile:**
   - PUT `http://localhost:5001/api/doctors/profile`
   - Headers: `Authorization: Bearer <token>`
   - Body: Profile data

### Using curl

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"9999999999","password":"test123","role":"doctor"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔒 Security Features

✅ **Password hashing** with bcryptjs (12 rounds)  
✅ **JWT tokens** for authentication  
✅ **Protected routes** with auth middleware  
✅ **Input validation** on all endpoints  
✅ **MongoDB injection** protection  
✅ **CORS enabled** for frontend  

---

## 📝 Doctor Schema Fields (60+ fields)

All fields from your dashboard are stored in MongoDB:

- **Profile:** profilePhoto, profileTitle, bio, languages, experience, specializations, services
- **Credentials:** registrationNumber, registrationCouncil, certificates, degrees
- **Identity:** idType, idNumber, documents
- **Clinic:** name, address (full), phones, timings, facilities, photos
- **Online:** enabled, fee, modes, slots, schedule, policies
- **Fees:** consultation fees, bank details (full), UPI, documents

---

## 🚀 Next Steps

1. ✅ Backend running on port 5001
2. ✅ Frontend API service configured
3. ⏳ Update Login.jsx to use `authAPI.login()`
4. ⏳ Update Register.jsx to use `authAPI.register()`
5. ⏳ Update DoctorDashboard.jsx save handlers to use `doctorAPI.updateSection()`
6. ⏳ Test complete flow: Register → Login → Dashboard → Edit → Save

---

## 📞 Support

**Backend Server:** http://localhost:5001  
**API Docs:** http://localhost:5001/api  
**MongoDB:** Connected to Atlas  

**Environment Variables:**
- `PORT=5001`
- `MONGODB_URI=mongodb+srv://doctorsoap:...`
- `JWT_SECRET=b555982a04be0ec1863a0e738f0f3b15c091ff3d11d86225257da00c5edc4e78`

All set! Backend is fully functional and ready for frontend integration! 🎉
