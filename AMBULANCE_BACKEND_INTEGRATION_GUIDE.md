# Ambulance Dashboard Backend Integration - Complete Guide

## ✅ COMPLETED TASKS

### 1. Backend Infrastructure ✅

#### A. Ambulance Model (`backend/models/Ambulance.js`)
**Status**: ✅ COMPLETE - Comprehensive 700+ line model created

**Features Implemented**:
- **Authentication Fields**: serviceName, email, phone, password, role
- **Account Details Section**: contactPerson, businessType, serviceArea, registrationComplete
- **Driver Details Section**: driverName, driverDOB, driverAge, driverGender, driverMobile, driverAlternateMobile, driverPermanentAddress, driverCurrentAddress, driverPhoto, driverLanguages, emergencyContact (3 fields)
- **KYC Documents Section**: governmentIdType, governmentIdNumber, governmentIdFile, drivingLicence (4 fields + file), panCard (2 fields), policeVerification, medicalCertificate, driverPassportPhoto, backgroundCheck, addressProof
- **Qualifications Section**: firstAidCertificate (3 fields), basicLifeSupportCertificate (3 fields), advancedLifeSupportCertificate (3 fields), trainingCertificates, additionalQualifications
- **Vehicle Details Section**: vehicleType, vehicleNumber, vehicleMake, vehicleModel, vehicleYear, vehicleColor, chassisNumber, engineNumber, vehicleOwnership, ownerName, seatingCapacity, stretcherCapacity, acAvailable, oxygenCylinder, ventilatorAvailable
- **Vehicle Documents Section**: registrationCertificate (3 fields), insurancePolicy (5 fields), fitnessLessCertificate (3 fields), pollutionCertificate (3 fields), permitDocument (4 fields), roadTaxReceipt (2 fields), vehiclePhotos (array)
- **Equipment Section**: medicalEquipment (array with 5 fields each), 12 boolean equipment checklist fields, equipmentNotes, lastEquipmentCheck
- **Pricing & Payment Section**: baseRate, perKmCharge, minimumCharge, oxygenCharge, ventilatorCharge, doctorOnBoardCharge, nurseOnBoardCharge, waitingCharges, nightCharges, tollCharges, parkingCharges, paymentModes (5 booleans), cancellationCharges, cancellationPolicy, refundPolicy, gstNumber, gstRegistered
- **Bank Details Section**: bankDetails (nested 7 fields), upiId
- **Operations Section**: serviceAvailability, operatingHours (7 days with 3 fields each), serviceCities, serviceRadius, intercityService, interstateService, currentStatus, currentLocation (4 fields)
- **Statistics**: totalTrips, completedTrips, cancelledTrips, rating, totalReviews, totalDistance, totalRevenue
- **Verification**: verificationStatus, verificationNotes, verifiedAt, verifiedBy, isActive, isBlocked, blockReason, profileCompletion
- **Documents Array**: For additional documents with docType, docName, docUrl, uploadedAt
- **Timestamps**: lastActive, createdAt, updatedAt

**Pre-save Middleware**:
- ✅ Password hashing with bcrypt
- ✅ Mobile/phone field syncing
- ✅ Auto-calculate driver age from DOB
- ✅ Update updatedAt timestamp

**Methods**:
- ✅ `comparePassword()` - for login authentication
- ✅ `calculateProfileCompletion()` - calculates completion based on 50 key fields

#### B. Ambulance Controller (`backend/controllers/ambulanceController.js`)
**Status**: ✅ COMPLETE - 600+ line controller with all CRUD operations

**API Endpoints Implemented**:
1. `getProfile()` - GET /api/ambulances/profile (Protected)
2. `updateProfile()` - PUT /api/ambulances/profile (Protected)
3. `updateSection()` - PUT /api/ambulances/profile/:section (Protected)
   - Valid sections: account, driver, kyc, qualifications, vehicle, documents, equipment, pricing, payment, bank, operations, location, status
4. `uploadFile()` - POST /api/ambulances/upload (Protected)
   - Supports Cloudinary upload with streaming
   - Handles both fieldName updates and docType document array additions
5. `getProfileCompletion()` - GET /api/ambulances/profile-completion (Protected)
6. `addEquipment()` - POST /api/ambulances/equipment (Protected)
7. `updateEquipment()` - PUT /api/ambulances/equipment/:equipmentId (Protected)
8. `deleteEquipment()` - DELETE /api/ambulances/equipment/:equipmentId (Protected)
9. `getDocuments()` - GET /api/ambulances/documents (Protected)
10. `deleteDocument()` - DELETE /api/ambulances/documents/:docId (Protected)
11. `updateLocation()` - PUT /api/ambulances/location (Protected)
12. `updateStatus()` - PUT /api/ambulances/status (Protected)
13. `getAllAmbulances()` - GET /api/ambulances (Public with filters)
14. `getAmbulanceById()` - GET /api/ambulances/:id (Public)
15. `deleteProfile()` - DELETE /api/ambulances/profile (Protected)

**Features**:
- ✅ Error handling for all operations
- ✅ Cloudinary file upload with streaming
- ✅ Field syncing (phone/mobile)
- ✅ Document management
- ✅ Equipment CRUD operations
- ✅ Location tracking
- ✅ Status management
- ✅ Public API for user/admin queries

#### C. Ambulance Routes (`backend/routes/ambulanceRoutes.js`)
**Status**: ✅ COMPLETE - All routes registered

**Routes Registered**:
- ✅ Profile management routes (GET, PUT, DELETE)
- ✅ Section-based update routes
- ✅ File upload routes with multer middleware
- ✅ Equipment management routes
- ✅ Document management routes
- ✅ Location and status update routes
- ✅ Public routes for browsing ambulances
- ✅ All routes properly protected with `protect` middleware

#### D. Server Integration (`backend/server.js`)
**Status**: ✅ COMPLETE - Ambulance routes registered

```javascript
app.use('/api/ambulances', require('./routes/ambulanceRoutes'));
```

---

### 2. Frontend Integration ✅

#### A. API Service (`frontend/src/services/api.js`)
**Status**: ✅ COMPLETE - Full ambulanceAPI object added

**Methods Implemented**:
1. `getProfile()` - Fetch ambulance profile
2. `updateProfile(data)` - Update complete profile
3. `updateSection(section, data)` - Update specific section
4. `uploadFile(file, fieldName, docType)` - File upload with Cloudinary
5. `getProfileCompletion()` - Get completion percentage
6. `addEquipment(equipmentData)` - Add new equipment
7. `updateEquipment(equipmentId, equipmentData)` - Update equipment
8. `deleteEquipment(equipmentId)` - Delete equipment
9. `getDocuments()` - Get all documents
10. `deleteDocument(docId)` - Delete document
11. `updateLocation(locationData)` - Update GPS location
12. `updateStatus(status)` - Update availability status
13. `getAllAmbulances(filters)` - Public search
14. `getAmbulanceById(id)` - Public view
15. `deleteProfile()` - Delete account

#### B. Registration Form (`frontend/src/pages/AmbulanceRegistration.jsx`)
**Status**: ✅ COMPLETE - Backend integrated

**Changes Made**:
- ✅ Imported `ambulanceAPI` from services
- ✅ Added `loading` state for async operations
- ✅ Updated `handleSubmit()` to call `ambulanceAPI.updateProfile()`
- ✅ Implemented file uploads for all 8 document fields:
  - driverPhoto
  - governmentIdFile
  - drivingLicenceFile
  - panCardFile
  - policeVerification
  - medicalCertificate
  - driverPassportPhoto
  - backgroundCheck
- ✅ Updated `handleSkip()` to save minimal data via API
- ✅ Added loading states to buttons ("Completing Registration...", "Processing...")
- ✅ Proper error handling with user-friendly messages
- ✅ All 45+ form fields mapped to backend model
- ✅ Stores response data in localStorage
- ✅ Navigates to dashboard after successful registration

**Data Flow**:
```
Registration Form → ambulanceAPI.updateProfile() → Backend Controller → MongoDB → Response → Dashboard
```

#### C. Dashboard (`frontend/src/pages/AmbulanceDashboard.jsx`)
**Status**: 🔄 PARTIALLY COMPLETE - Core infrastructure done, sections need completion

**Completed Features**:
1. ✅ **Imports**: Added `ambulanceAPI` import
2. ✅ **State Management**:
   - Added all edit states for 10 sections
   - Added `profileCompletion` state
   - Added `editFormData` state
   - Added `uploadingFile` state
   - Added `documents` state
3. ✅ **Data Loading (`useEffect`)**:
   - Loads profile from backend via `ambulanceAPI.getProfile()`
   - Fetches profile completion percentage
   - Fetches documents list
   - Proper error handling (404 redirects to registration)
   - Falls back to cached data if API fails
   - Shows loading spinner
4. ✅ **Common Handlers**:
   - `handleEditSection(section)` - Generic edit handler for all sections
   - `handleInputChange(field, value)` - Form input handler
   - `handleSaveSection(section)` - Saves via `ambulanceAPI.updateSection()`
   - `handleCancelEdit()` - Cancels edit mode
   - `handleFileUpload(e, fieldName, docType)` - File upload handler
   - `handleViewDocument(url)` - Opens document in new tab
   - `handleDeleteDocument(docId)` - Deletes document
5. ✅ **Account Details Section**:
   - View mode shows all 6 fields with "Not set" fallback
   - Edit mode with form inputs for all fields
   - Save/Cancel buttons with backend integration
   - Uses `handleEditSection('account')` and `handleSaveSection('account')`
   - All fields: serviceName, contactPerson, mobile, email, businessType, serviceArea

**Remaining Work** (⚠️ TO BE COMPLETED):

The following sections exist in the dashboard but need similar backend integration:

1. **Driver Details Section** (lines ~600-800):
   - Currently has old handlers (editedData)
   - Needs: Update to use `editFormData` and `handleSaveSection('driver')`
   - Fields: 12+ driver fields + emergency contact

2. **KYC Documents Section** (lines ~800-900):
   - Needs: File upload integration for 6+ documents
   - Needs: View/Delete document buttons
   - Fields: government ID, driving licence, PAN, etc.

3. **Qualifications Section** (lines ~900-1000):
   - Needs: File upload for certificates
   - Needs: Date fields for issue/expiry
   - Fields: First Aid, BLS, ALS certificates

4. **Vehicle Details Section** (lines ~1000-1100):
   - Needs: Edit mode with all vehicle fields
   - Fields: 15+ vehicle fields

5. **Vehicle Documents Section** (lines ~1100-1200):
   - Needs: File upload for 5+ documents
   - Needs: Date fields for issue/expiry
   - Fields: RC, insurance, fitness, PUC, permit, road tax

6. **Equipment Section** (lines ~1200-1400):
   - Needs: Equipment list with add/edit/delete
   - Needs: Checkbox list for standard equipment
   - Fields: medicalEquipment array + 12 boolean fields

7. **Pricing & Payment Section** (lines ~1400-1600):
   - Needs: Edit mode with all pricing fields
   - Needs: Payment modes checkboxes
   - Fields: 15+ pricing and payment fields

8. **Bank Details Section** (lines ~1600-1800):
   - Needs: Nested bankDetails object handling
   - Fields: 7 bank fields + UPI ID

9. **Operations Section** (lines ~1800-1900):
   - Needs: Operating hours for 7 days
   - Needs: Service coverage fields
   - Fields: availability, hours, coverage areas

---

## 🔧 HOW TO COMPLETE REMAINING SECTIONS

### Pattern to Follow (Use Account Section as Template):

```jsx
{activeSection === 'SECTION_NAME' && (
  <section className="dashboard-section">
    <div className="section-header">
      <h2>📋 Section Title</h2>
      <p>Section description</p>
    </div>

    {!isEditingSECTION ? (
      {/* VIEW MODE */}
      <>
        <div className="info-display">
          <div className="info-row">
            <label>Field Label:</label>
            <span>{ambulanceData.fieldName || 'Not set'}</span>
          </div>
          {/* Repeat for all fields */}
        </div>

        <div className="form-actions">
          <button className="btn-secondary" onClick={() => handleEditSection('SECTION_NAME')}>
            ✏️ Edit Details
          </button>
        </div>
      </>
    ) : (
      {/* EDIT MODE */}
      <>
        <div className="form-grid">
          <div className="form-group">
            <label>Field Label *</label>
            <input
              type="text"
              value={editFormData.fieldName || ''}
              onChange={(e) => handleInputChange('fieldName', e.target.value)}
              placeholder="Enter value"
            />
          </div>
          {/* Repeat for all fields */}
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={() => handleSaveSection('SECTION_NAME')}>
            💾 Save Changes
          </button>
          <button className="btn-secondary" onClick={handleCancelEdit}>
            ❌ Cancel
          </button>
        </div>
      </>
    )}
  </section>
)}
```

### For File Upload Fields:

```jsx
<div className="form-group">
  <label>Document Name</label>
  {uploadingFile ? (
    <p>Uploading... Please wait</p>
  ) : (
    <>
      <input
        type="file"
        onChange={(e) => handleFileUpload(e, 'fieldName')}
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        id="fieldName-upload"
      />
      <label htmlFor="fieldName-upload" className="upload-btn">
        📁 Upload Document
      </label>
      
      {ambulanceData.fieldName && (
        <button 
          className="btn-view" 
          onClick={() => handleViewDocument(ambulanceData.fieldName)}
        >
          👁️ View
        </button>
      )}
    </>
  )}
</div>
```

### For Array Fields (Equipment Example):

```jsx
{/* Add Equipment Form */}
{isAddingEquipment && (
  <div className="equipment-form">
    <input
      type="text"
      value={equipmentFormData.name}
      onChange={(e) => setEquipmentFormData({...equipmentFormData, name: e.target.value})}
      placeholder="Equipment name"
    />
    {/* Other fields */}
    <button onClick={handleAddEquipmentSubmit}>Add Equipment</button>
  </div>
)}

{/* Equipment List */}
{ambulanceData.medicalEquipment && ambulanceData.medicalEquipment.map((item, index) => (
  <div key={index} className="equipment-item">
    <span>{item.name}</span>
    <span>{item.quantity}</span>
    <button onClick={() => handleEditEquipment(item._id)}>Edit</button>
    <button onClick={() => handleDeleteEquipment(item._id)}>Delete</button>
  </div>
))}
```

---

## 📋 STEP-BY-STEP COMPLETION CHECKLIST

### Step 1: Driver Details Section
- [ ] Update to use `isEditingDriver` state
- [ ] Add all 12+ fields to edit form
- [ ] Update handleEditDriver to use `handleEditSection('driver')`
- [ ] Update save button to call `handleSaveSection('driver')`
- [ ] Add driverPhoto upload field
- [ ] Test save/cancel functionality

### Step 2: KYC Documents Section
- [ ] Add file upload for governmentIdFile
- [ ] Add file upload for drivingLicenceFile  
- [ ] Add file upload for panCardFile
- [ ] Add file upload for policeVerification
- [ ] Add file upload for medicalCertificate
- [ ] Add file upload for driverPassportPhoto
- [ ] Add View buttons for all documents
- [ ] Test all uploads

### Step 3: Qualifications Section
- [ ] Add edit mode with `isEditingQualifications`
- [ ] Add file uploads for 3 certificate types
- [ ] Add date fields for issue/expiry dates
- [ ] Implement save/cancel
- [ ] Test certificate uploads

### Step 4: Vehicle Details Section
- [ ] Add edit mode with `isEditingVehicle`
- [ ] Add all 15+ vehicle fields
- [ ] Add dropdowns for vehicleType, vehicleOwnership
- [ ] Add number inputs for year, capacity fields
- [ ] Add checkboxes for features (AC, oxygen, ventilator)
- [ ] Implement save/cancel
- [ ] Test data persistence

### Step 5: Vehicle Documents Section
- [ ] Add edit mode with `isEditingDocuments`
- [ ] Add file upload for RC
- [ ] Add file upload for insurance
- [ ] Add file upload for fitness certificate
- [ ] Add file upload for PUC
- [ ] Add file upload for permit
- [ ] Add file upload for road tax
- [ ] Add date fields for all issue/expiry dates
- [ ] Add View buttons for all documents
- [ ] Test all document uploads

### Step 6: Equipment Section
- [ ] Add equipment add/edit form
- [ ] Implement `handleAddEquipment()` using `ambulanceAPI.addEquipment()`
- [ ] Implement `handleEditEquipment()` using `ambulanceAPI.updateEquipment()`
- [ ] Implement `handleDeleteEquipment()` using `ambulanceAPI.deleteEquipment()`
- [ ] Add 12 equipment checkboxes (stretcher, wheelchair, etc.)
- [ ] Add equipment list display
- [ ] Test CRUD operations

### Step 7: Pricing & Payment Section
- [ ] Add edit mode with `isEditingPricing`
- [ ] Add number inputs for all rates (base, perKm, minimum, etc.)
- [ ] Add checkboxes for payment modes (cash, card, UPI, etc.)
- [ ] Add GST fields
- [ ] Add cancellation policy fields
- [ ] Implement save/cancel
- [ ] Test pricing updates

### Step 8: Bank Details Section
- [ ] Add edit mode with `isEditingBank`
- [ ] Add nested bankDetails fields (7 fields)
- [ ] Add UPI ID field
- [ ] Handle nested object updates properly
- [ ] Implement save/cancel
- [ ] Test bank details save

### Step 9: Operations Section
- [ ] Add edit mode with `isEditingOperations`
- [ ] Add serviceAvailability dropdown
- [ ] Add operating hours for all 7 days (21 fields total)
- [ ] Add service coverage fields (cities, radius)
- [ ] Add intercity/interstate checkboxes
- [ ] Implement save/cancel
- [ ] Test operations settings

### Step 10: Testing & Verification
- [ ] Test complete registration flow
- [ ] Test login and dashboard load
- [ ] Test all section edits and saves
- [ ] Test all file uploads
- [ ] Test document view/delete
- [ ] Test equipment CRUD
- [ ] Verify profile completion percentage updates
- [ ] Test with actual backend API (not localhost mock)
- [ ] Test error scenarios (network failure, invalid data)
- [ ] Cross-browser testing

---

## 🔑 KEY INTEGRATION POINTS

### Authentication Flow
```
1. User registers → POST /api/auth/register (role: ambulance)
2. Receives JWT token → Stored in localStorage
3. Token auto-attached to all API requests via interceptor
4. Dashboard loads → GET /api/ambulances/profile
```

### Data Flow
```
Dashboard Load:
  useEffect() → ambulanceAPI.getProfile() → Backend → MongoDB → Response → setState()

Edit Section:
  Click Edit → handleEditSection() → setEditFormData() → Show Form

Save Section:
  Click Save → handleSaveSection() → ambulanceAPI.updateSection() → Backend → MongoDB → 
  Response → setAmbulanceData() → localStorage → Success Message → Exit Edit Mode

Upload File:
  Select File → handleFileUpload() → ambulanceAPI.uploadFile() → Cloudinary → 
  Backend Updates DB → Response → setAmbulanceData() → Success Message
```

### Error Handling
- Network errors → Show user-friendly message, fall back to cached data
- 404 errors → Redirect to registration
- 401 errors → Clear token, redirect to login (handled by API interceptor)
- Validation errors → Show field-specific errors

---

## 🚀 NEXT STEPS

1. **Complete Remaining Dashboard Sections** (Steps 1-9 above)
2. **Add Profile Completion Bar** in Dashboard header showing `profileCompletion` percentage
3. **Add Document Upload Progress** indicators for better UX
4. **Implement Real-time Location Tracking** using `ambulanceAPI.updateLocation()`
5. **Add Status Toggle** (Available/On-Trip/Offline) using `ambulanceAPI.updateStatus()`
6. **Create Admin Panel Integration** for ambulance verification
7. **Add User Dashboard Integration** for booking ambulances
8. **Implement Notifications** for new bookings
9. **Add Rating & Review System**
10. **Performance Testing** with large datasets

---

## ⚠️ IMPORTANT NOTES

### Don't Modify These Files (Already Complete):
- ✅ `backend/models/Ambulance.js`
- ✅ `backend/controllers/ambulanceController.js`
- ✅ `backend/routes/ambulanceRoutes.js`
- ✅ `backend/server.js` (ambulance routes section)
- ✅ `frontend/src/services/api.js` (ambulanceAPI object)
- ✅ `frontend/src/pages/AmbulanceRegistration.jsx`

### Files to Complete:
- 🔄 `frontend/src/pages/AmbulanceDashboard.jsx` (9 sections remaining)

### Testing Checklist:
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected and running
- [ ] Cloudinary credentials configured in .env
- [ ] JWT_SECRET configured in .env
- [ ] Test user registered with role 'ambulance'
- [ ] Token stored in localStorage after login
- [ ] API calls working (check Network tab)
- [ ] File uploads working (check Cloudinary dashboard)
- [ ] Data persisting in MongoDB (check with Compass/Studio)

---

## 📞 TROUBLESHOOTING

### Issue: Profile not loading
**Solution**: Check if token is valid in localStorage, verify backend is running, check MongoDB connection

### Issue: File upload failing
**Solution**: Verify Cloudinary credentials in .env, check file size limits, ensure multer middleware is working

### Issue: Section not saving
**Solution**: Check Network tab for error response, verify section name matches validSections array in controller, check data format

### Issue: 404 on dashboard
**Solution**: Ensure ambulance profile was created during registration, check if registration completed successfully

---

## ✅ SUCCESS CRITERIA

Your ambulance dashboard is fully integrated when:
- ✅ All 10 sections can be edited and saved
- ✅ All file uploads work and display correctly
- ✅ Profile completion percentage updates dynamically
- ✅ Data persists across page refreshes
- ✅ All documents can be viewed and deleted
- ✅ Equipment can be added, edited, and deleted
- ✅ Location and status can be updated
- ✅ No console errors on normal operations
- ✅ Loading states show during async operations
- ✅ Error messages are user-friendly
- ✅ Authentication flow works end-to-end
- ✅ Data syncs between frontend and MongoDB

---

**Created**: December 11, 2025
**Status**: Backend 100% Complete | Frontend 40% Complete
**Estimated Completion Time**: 4-6 hours for remaining sections
**Priority**: Complete sections in order (Driver → KYC → Qualifications → Vehicle → Documents → Equipment → Pricing → Bank → Operations)
