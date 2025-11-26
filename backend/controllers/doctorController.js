const Doctor = require('../models/Doctor');

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.phone;
    delete updateData.role;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Update profile section (profile-summary, credentials, identity, clinic, online, fees)
// @route   PUT /api/doctors/profile/:section
// @access  Private
exports.updateSection = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const section = req.params.section;
    const updateData = req.body;

    // Validate section
    const validSections = ['profile-summary', 'profile', 'credentials', 'identity', 'clinic', 'online', 'fees'];
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid section: ${section}. Valid sections are: ${validSections.join(', ')}`
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully`,
      doctor
    });
  } catch (error) {
    console.error('Update Section Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating section',
      error: error.message
    });
  }
};

// @desc    Get all doctors (for admin)
// @route   GET /api/doctors
// @access  Private/Admin
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    console.error('Get All Doctors Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Get Doctor Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor',
      error: error.message
    });
  }
};

// @desc    Delete doctor account
// @route   DELETE /api/doctors/profile
// @access  Private
exports.deleteProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.doctor.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor account deleted successfully'
    });
  } catch (error) {
    console.error('Delete Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting profile',
      error: error.message
    });
  }
};

// @desc    Upload file (profile photo, documents, etc.)
// @route   POST /api/doctors/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return the file URL
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload File Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

// @desc    Calculate profile completion percentage
// @route   GET /api/doctors/profile-completion
// @access  Private
exports.getProfileCompletion = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Calculate completion percentage
    let totalFields = 0;
    let filledFields = 0;

    // Profile Summary (10 fields)
    const profileFields = ['profilePhoto', 'profileTitle', 'bio', 'languages', 'experience', 
                          'primarySpecialization', 'secondarySpecialization', 'servicesOffered'];
    profileFields.forEach(field => {
      totalFields++;
      if (doctor[field] && (Array.isArray(doctor[field]) ? doctor[field].length > 0 : doctor[field])) {
        filledFields++;
      }
    });

    // Medical Credentials (5 fields)
    const credentialFields = ['registrationNumber', 'registrationCouncil', 'registrationCertificate', 'degrees'];
    credentialFields.forEach(field => {
      totalFields++;
      if (doctor[field] && (Array.isArray(doctor[field]) ? doctor[field].length > 0 : doctor[field])) {
        filledFields++;
      }
    });

    // Identity Proof (3 fields)
    const identityFields = ['idType', 'idNumber', 'idDocument'];
    identityFields.forEach(field => {
      totalFields++;
      if (doctor[field]) filledFields++;
    });

    // Clinic Details (10 fields)
    const clinicFields = ['clinicName', 'clinicStreet', 'clinicCity', 'clinicState', 'clinicPincode', 
                         'clinicMobile', 'clinicTimings', 'consultationTypes', 'facilities'];
    clinicFields.forEach(field => {
      totalFields++;
      if (doctor[field] && (Array.isArray(doctor[field]) ? doctor[field].length > 0 : doctor[field])) {
        filledFields++;
      }
    });

    // Online Consultation (3 fields)
    totalFields += 3;
    if (doctor.onlineConsultation) filledFields++;
    if (doctor.onlineConsultationFee) filledFields++;
    if (doctor.consultationModes && doctor.consultationModes.length > 0) filledFields++;

    // Fees & Payment (4 fields)
    const feeFields = ['consultationFee', 'accountNumber', 'ifscCode', 'upiId'];
    feeFields.forEach(field => {
      totalFields++;
      if (doctor[field]) filledFields++;
    });

    const completionPercentage = Math.round((filledFields / totalFields) * 100);

    res.status(200).json({
      success: true,
      completionPercentage,
      filledFields,
      totalFields
    });
  } catch (error) {
    console.error('Profile Completion Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating profile completion',
      error: error.message
    });
  }
};
