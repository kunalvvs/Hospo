const Hospital = require('../models/Hospital');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc    Get hospital profile
// @route   GET /api/hospitals/profile
// @access  Private (Hospital)
exports.getProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id)
      .populate('linkedDoctors', 'name email phone primarySpecialization');
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    res.status(200).json({
      success: true,
      hospital
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hospital profile',
      error: error.message
    });
  }
};

// @desc    Update hospital profile
// @route   PUT /api/hospitals/profile
// @access  Private (Hospital)
exports.updateProfile = async (req, res) => {
  try {
    console.log('========= Hospital Update Profile ==========');
    console.log('User from token:', req.user);
    console.log('Hospital ID:', req.user?.id);
    console.log('Update data:', JSON.stringify(req.body, null, 2));
    
    const hospitalId = req.user.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;

    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!hospital) {
      console.error('Hospital not found with ID:', hospitalId);
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    console.log('✅ Hospital updated successfully');
    res.status(200).json({
      success: true,
      message: 'Hospital profile updated successfully',
      hospital
    });
  } catch (error) {
    console.error('❌ Update Profile Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error updating hospital profile',
      error: error.message
    });
  }
};

// @desc    Update profile section (identity, address, contact, facilities, etc.)
// @route   PUT /api/hospitals/profile/:section
// @access  Private (Hospital)
exports.updateSection = async (req, res) => {
  try {
    const hospitalId = req.user.id;
    const section = req.params.section;
    const updateData = req.body;

    // Validate section
    const validSections = ['identity', 'address', 'contact', 'facilities', 'kyc', 'bank'];
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid section: ${section}. Valid sections are: ${validSections.join(', ')}`
      });
    }

    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully`,
      hospital
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

// @desc    Add doctor to hospital
// @route   POST /api/hospitals/doctors/:doctorId
// @access  Private (Hospital)
exports.addDoctor = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    // Check if doctor already linked
    if (hospital.linkedDoctors.includes(req.params.doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already linked to this hospital'
      });
    }

    hospital.linkedDoctors.push(req.params.doctorId);
    await hospital.save();

    const updatedHospital = await Hospital.findById(req.user.id)
      .populate('linkedDoctors', 'name email phone primarySpecialization');

    res.status(200).json({
      success: true,
      message: 'Doctor added successfully',
      hospital: updatedHospital
    });
  } catch (error) {
    console.error('Add Doctor Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding doctor',
      error: error.message
    });
  }
};

// @desc    Remove doctor from hospital
// @route   DELETE /api/hospitals/doctors/:doctorId
// @access  Private (Hospital)
exports.removeDoctor = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    hospital.linkedDoctors.pull(req.params.doctorId);
    await hospital.save();

    const updatedHospital = await Hospital.findById(req.user.id)
      .populate('linkedDoctors', 'name email phone primarySpecialization');

    res.status(200).json({
      success: true,
      message: 'Doctor removed successfully',
      hospital: updatedHospital
    });
  } catch (error) {
    console.error('Remove Doctor Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing doctor',
      error: error.message
    });
  }
};

// @desc    Get all hospitals (Public)
// @route   GET /api/hospitals
// @access  Public
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isVerified: true, isActive: true })
      .select('-password -accountDetails')
      .populate('linkedDoctors', 'name primarySpecialization');

    res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals
    });
  } catch (error) {
    console.error('Get All Hospitals Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hospitals',
      error: error.message
    });
  }
};

// @desc    Upload file (logo, documents, etc.)
// @route   POST /api/hospitals/upload
// @access  Private (Hospital)
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary using buffer
    const uploadStream = (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadOptions = {
          folder: 'torion-healthcare/hospitals',
          resource_type: 'auto',
        };

        // Add transformation only for images
        if (req.file.mimetype.startsWith('image/')) {
          uploadOptions.transformation = [{ width: 1000, height: 1000, crop: 'limit' }];
        }

        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await uploadStream(req.file.buffer);

    console.log('✅ File uploaded to Cloudinary:', {
      url: result.secure_url,
      publicId: result.public_id
    });

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl: result.secure_url,
      publicId: result.public_id,
      filename: req.file.originalname
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

// @desc    Add/Update Room
// @route   POST /api/hospitals/rooms
// @access  Private (Hospital)
exports.addRoom = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    hospital.rooms.push(req.body);
    await hospital.save();

    res.status(200).json({
      success: true,
      message: 'Room added successfully',
      hospital
    });
  } catch (error) {
    console.error('Add Room Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding room',
      error: error.message
    });
  }
};

// @desc    Update Room
// @route   PUT /api/hospitals/rooms/:roomId
// @access  Private (Hospital)
exports.updateRoom = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    const room = hospital.rooms.id(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    Object.keys(req.body).forEach(key => {
      room[key] = req.body[key];
    });

    await hospital.save();

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      hospital
    });
  } catch (error) {
    console.error('Update Room Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating room',
      error: error.message
    });
  }
};

// @desc    Delete Room
// @route   DELETE /api/hospitals/rooms/:roomId
// @access  Private (Hospital)
exports.deleteRoom = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    hospital.rooms.pull(req.params.roomId);
    await hospital.save();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
      hospital
    });
  } catch (error) {
    console.error('Delete Room Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting room',
      error: error.message
    });
  }
};

// @desc    Add Procedure
// @route   POST /api/hospitals/procedures
// @access  Private (Hospital)
exports.addProcedure = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    hospital.procedures.push(req.body);
    await hospital.save();

    res.status(200).json({
      success: true,
      message: 'Procedure added successfully',
      hospital
    });
  } catch (error) {
    console.error('Add Procedure Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding procedure',
      error: error.message
    });
  }
};

// @desc    Update Procedure
// @route   PUT /api/hospitals/procedures/:procedureId
// @access  Private (Hospital)
exports.updateProcedure = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    const procedure = hospital.procedures.id(req.params.procedureId);
    
    if (!procedure) {
      return res.status(404).json({
        success: false,
        message: 'Procedure not found'
      });
    }

    Object.keys(req.body).forEach(key => {
      procedure[key] = req.body[key];
    });

    await hospital.save();

    res.status(200).json({
      success: true,
      message: 'Procedure updated successfully',
      hospital
    });
  } catch (error) {
    console.error('Update Procedure Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating procedure',
      error: error.message
    });
  }
};

// @desc    Delete Procedure
// @route   DELETE /api/hospitals/procedures/:procedureId
// @access  Private (Hospital)
exports.deleteProcedure = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    hospital.procedures.pull(req.params.procedureId);
    await hospital.save();

    res.status(200).json({
      success: true,
      message: 'Procedure deleted successfully',
      hospital
    });
  } catch (error) {
    console.error('Delete Procedure Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting procedure',
      error: error.message
    });
  }
};
