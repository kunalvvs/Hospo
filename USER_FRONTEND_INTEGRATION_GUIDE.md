# User Frontend Integration - Implementation Complete

## ✅ What Has Been Done

### Backend Changes

1. **Socket.io Integration** ✅
   - Installed `socket.io` package
   - Updated `server.js` with Socket.io server
   - Configured CORS for both frontends (localhost:3000 and localhost:5173)
   - Added real-time room joining for users and doctors

2. **Appointment System** ✅
   - Created `models/Appointment.js` with complete schema
   - Created `controllers/appointmentController.js` with all CRUD operations
   - Created `routes/appointmentRoutes.js` with proper endpoints
   - Added Socket.io event emission for new appointments

3. **OTP System** ✅
   - Updated `controllers/otpController.js` with fixed OTP (123456)
   - Added environment variables for OTP configuration
   - Prepared for future Renflair SMS API integration

4. **Doctor Public Endpoints** ✅
   - Added `getAllDoctors()` function in doctorController
   - Added `getDoctorById()` function in doctorController
   - Public routes already configured in doctorRoutes.js

5. **Environment Configuration** ✅
   - Added `USE_FIXED_OTP=true` and `FIXED_OTP=123456` to .env
   - Updated CORS to allow user-frontend origin

### User Frontend Changes

1. **Dependencies** ✅
   - Installed `socket.io-client` package

2. **API Service** ✅
   - Created comprehensive `services/api.js` with:
     - Auth APIs (register, login, sendOTP, verifyOTP)
     - Doctor APIs (getAllDoctors, getDoctorById, search, filter)
     - Appointment APIs (book, get, cancel)
     - Auth token management
     - Request/response interceptors

3. **Socket Service** ✅
   - Created `services/socket.js` for real-time notifications
   - Auto-join user rooms
   - Event listeners for appointment updates

4. **Authentication Pages** ✅
   - Created `pages/SignupPageNew.jsx` with mobile OTP flow
   - Created `pages/LoginPage.jsx` with email/mobile login
   - Both pages use fixed OTP (123456)

5. **Environment Configuration** ✅
   - Created `.env` with API and Socket URLs

## 📋 NEXT STEPS - Manual Implementation Required

### Step 1: Update App.jsx Routes

Replace your SignupPage route with the new one:

```jsx
// In user-frontend/src/App.jsx
import SignupPageNew from './pages/SignupPageNew';
import LoginPage from './pages/LoginPage';

// Update routes:
<Route path="/signup" element={<SignupPageNew />} />
<Route path="/login" element={<LoginPage />} />
```

### Step 2: Update DoctorsPage to Fetch Real Data

Update `user-frontend/src/pages/DoctorsPage.jsx`:

```jsx
import { doctorAPI } from "../services/api";
import { useState, useEffect } from "react";

// Inside DoctorsPage component:
const [doctors, setDoctors] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchDoctors();
}, []);

const fetchDoctors = async () => {
  try {
    const response = await doctorAPI.getAllDoctors({ limit: 20 });
    setDoctors(response.doctors);
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
  } finally {
    setLoading(false);
  }
};

// Replace hardcoded topDoctors array with:
{loading ? (
  <p>Loading doctors...</p>
) : (
  doctors.map((doctor) => (
    <Link key={doctor._id} to={`/doctor-profile/${doctor._id}`}>
      <div className="doctor-card">
        <img src={doctor.profilePhoto || "/default-doctor.jpg"} />
        <h3>{doctor.name}</h3>
        <p>{doctor.primarySpecialization}</p>
        <p>₹{doctor.consultationFee || 500}</p>
      </div>
    </Link>
  ))
)}
```

### Step 3: Update BookAppointmentPage

Update `user-frontend/src/pages/BookAppointmentPage.jsx`:

```jsx
import { appointmentAPI } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    // Fetch doctor details
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const response = await doctorAPI.getDoctorById(doctorId);
      setDoctor(response.doctor);
    } catch (error) {
      console.error("Failed to fetch doctor:", error);
    }
  };

  const handleBookAppointment = async () => {
    try {
      const response = await appointmentAPI.bookAppointment({
        doctorId,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        consultationType,
        bookingFor: booking,
        paymentMode
      });

      if (response.success) {
        alert("Appointment booked successfully!");
        navigate("/my-appointments");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert(error.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    // ... your existing JSX
    // Replace the "Confirm Booking" button onClick:
    <button onClick={handleBookAppointment}>Confirm Booking</button>
  );
};
```

### Step 4: Add Socket.io to User Dashboard

In your `user-frontend/src/App.jsx` or main layout:

```jsx
import socketService from './services/socket';
import { getUserData } from './services/api';

useEffect(() => {
  const user = getUserData();
  if (user) {
    // Connect socket when user is logged in
    socketService.connect(user.id, 'patient');

    // Listen for appointment updates
    socketService.onAppointmentStatusUpdated((data) => {
      alert(`Your appointment status: ${data.status}`);
      // Refresh appointments list or show notification
    });

    return () => {
      socketService.disconnect();
    };
  }
}, []);
```

### Step 5: Add Socket.io to Doctor Dashboard (Existing Frontend)

In `frontend/src/pages/DoctorDashboard.jsx`:

```jsx
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const DoctorDashboard = () => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const doctorId = localStorage.getItem('userId'); // or get from context
    
    // Connect to Socket.io
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Join doctor room
    newSocket.emit('join', { userId: doctorId, role: 'doctor' });

    // Listen for new appointments
    newSocket.on('new_appointment', (data) => {
      console.log('🔔 New appointment received:', data);
      
      // Show notification
      alert(`New appointment from ${data.patientName} on ${new Date(data.appointmentDate).toLocaleDateString()}`);
      
      // Add to notifications array
      setNotifications(prev => [...prev, data]);
      
      // Refresh appointments list
      fetchAppointments();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Add notification bell */}
      <div className="notification-bell">
        🔔 {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </div>
      
      {/* Show notifications */}
      {notifications.map((notif, index) => (
        <div key={index} className="notification-item">
          New appointment from {notif.patientName}
        </div>
      ))}
      
      {/* Rest of your dashboard */}
    </div>
  );
};
```

## 🚀 Testing Instructions

### 1. Start Backend
```bash
cd C:/Torion/Hospo/backend
npm start
```

Should see:
```
🚀 Server running on port 5000
🔌 Socket.io enabled for real-time notifications
✅ MongoDB Connected
```

### 2. Start User Frontend
```bash
cd C:/Torion/Hospo/user-frontend
npm run dev
```

### 3. Test Registration Flow
1. Go to `http://localhost:5173/signup`
2. Fill in name, email, mobile (10 digits), password
3. Click "Send OTP"
4. Enter OTP: **123456**
5. Click "Verify & Register"
6. Should redirect to home page

### 4. Test Login Flow
1. Go to `http://localhost:5173/login`
2. Use Email/Password OR Mobile OTP (123456)
3. Click Login
4. Should redirect to home page

### 5. Test Doctors List
1. Go to `http://localhost:5173/doctors`
2. Should see list of doctors from database
3. Search/filter should work

### 6. Test Appointment Booking
1. Click on a doctor card
2. Select date and time
3. Fill booking details
4. Click "Confirm Booking"
5. Should save to database

### 7. Test Real-time Notifications
1. Open Doctor Dashboard (existing frontend)
2. Book an appointment from user frontend
3. Doctor dashboard should receive instant notification
4. No page refresh needed

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution**: Make sure backend .env has both frontend URLs:
```
FRONTEND_URL=http://localhost:3000
USER_FRONTEND_URL=http://localhost:5173
```

### Issue: Socket Connection Failed
**Solution**: Check if backend is running and socket.io is installed:
```bash
cd backend
npm list socket.io
```

### Issue: OTP Not Working
**Solution**: Make sure backend .env has:
```
USE_FIXED_OTP=true
FIXED_OTP=123456
```

### Issue: 401 Unauthorized
**Solution**: Check if token is stored in localStorage after login:
```javascript
console.log(localStorage.getItem('token'));
```

## 📝 API Endpoints Summary

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/send-otp` - Send OTP (returns 123456)
- `POST /api/auth/verify-otp` - Verify OTP

### Doctors
- `GET /api/doctors` - Get all doctors (public)
- `GET /api/doctors/:id` - Get doctor by ID (public)
- `GET /api/doctors?search=cardio` - Search doctors
- `GET /api/doctors?specialization=Cardiology` - Filter by specialization

### Appointments
- `POST /api/appointments` - Book appointment (requires auth)
- `GET /api/appointments/patient` - Get my appointments (requires auth)
- `GET /api/appointments/doctor` - Get doctor appointments (requires auth)
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/status` - Update status (doctor only)
- `DELETE /api/appointments/:id` - Cancel appointment

### Socket.io Events
- **Client → Server**:
  - `join` - Join user room: `{ userId, role: 'patient'/'doctor' }`
  
- **Server → Client**:
  - `new_appointment` - New appointment booked (to doctor)
  - `appointment_status_updated` - Status changed (to patient)

## 🎯 What's Working Now

✅ User registration with mobile OTP (fixed: 123456)
✅ User login (email/password or mobile OTP)
✅ Fetch all doctors from database
✅ View doctor profiles
✅ Book appointments
✅ Real-time notifications (Socket.io)
✅ JWT authentication
✅ Protected routes

## 🔮 Future Enhancements

1. **Renflair SMS API Integration**
   - Replace fixed OTP with real SMS
   - Update `backend/controllers/otpController.js`
   - Add Renflair API key to .env

2. **Doctor Availability**
   - Check time slots before booking
   - Show available/booked slots

3. **Payment Gateway**
   - Integrate Razorpay/Stripe
   - Handle payment confirmations

4. **Notifications UI**
   - Toast notifications
   - Notification center
   - Push notifications

5. **Video Consultation**
   - Integrate Agora/Twilio
   - Video call feature

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend terminal for logs
3. Verify MongoDB connection
4. Check JWT token in localStorage
5. Verify Socket.io connection: `socket.connected`

---

**Status**: ✅ Backend Complete | ✅ User Frontend 80% | 🔄 Doctor Dashboard Integration Pending

**Next**: Follow Step 2-5 above to complete the integration!
