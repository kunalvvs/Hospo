const Ambulance = require('../models/Ambulance');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc    Get ambulance profile
// @route   GET /api/ambulances/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const ambulance = await Ambulance.findById(ambulanceId);
    
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    res.status(200).json({
      success: true,
      ambulance
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

// @desc    Update ambulance profile
// @route   PUT /api/ambulances/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.role;

    // Sync phone and mobile fields
    if (updateData.phone) {
      updateData.mobile = updateData.phone;
    }
    if (updateData.mobile) {
      updateData.phone = updateData.mobile;
    }

    const ambulance = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      ambulance
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

// @desc    Update ambulance profile section
// @route   PUT /api/ambulances/profile/:section
// @access  Private
exports.updateSection = async (req, res) => {
  const section = req.params.section;
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const updateData = req.body;

    // Validate section
    const validSections = [
      'account', 'driver', 'kyc', 'qualifications', 'vehicle', 
      'documents', 'vehicleDocuments', 'equipment', 'pricing', 'payment', 'bank', 
      'operations', 'location', 'status'
    ];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid section: ${section}. Valid sections are: ${validSections.join(', ')}`
      });
    }

    const ambulance = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `${section} section updated successfully`,
      ambulance
    });
  } catch (error) {
    console.error('Update Section Error:', error);
    res.status(500).json({
      success: false,
      message: `Error updating ${section} section`,
      error: error.message
    });
  }
};

// @desc    Upload file to Cloudinary
// @route   POST /api/ambulances/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { fieldName, docType } = req.body;

    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ambulances',
        resource_type: 'auto'
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return res.status(500).json({
            success: false,
            message: 'Error uploading file to cloud storage',
            error: error.message
          });
        }

        try {
          // Update ambulance profile with file URL
          const updateData = {};
          
          if (fieldName) {
            updateData[fieldName] = result.secure_url;
          }
          
          // If docType is provided, add to documents array
          if (docType) {
            const ambulance = await Ambulance.findById(ambulanceId);
            if (!ambulance.documents) {
              ambulance.documents = [];
            }
            
            ambulance.documents.push({
              docType: docType,
              docName: req.file.originalname,
              docUrl: result.secure_url,
              uploadedAt: new Date()
            });
            
            await ambulance.save();
            
            return res.status(200).json({
              success: true,
              message: 'File uploaded successfully',
              fileUrl: result.secure_url,
              ambulance
            });
          }

          const ambulance = await Ambulance.findByIdAndUpdate(
            ambulanceId,
            { $set: updateData },
            { new: true, runValidators: false }
          );

          res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            fileUrl: result.secure_url,
            ambulance
          });
        } catch (dbError) {
          console.error('Database Update Error:', dbError);
          res.status(500).json({
            success: false,
            message: 'File uploaded but error updating database',
            error: dbError.message,
            fileUrl: result.secure_url
          });
        }
      }
    );

    // Stream the file buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

// @desc    Get profile completion percentage
// @route   GET /api/ambulances/profile-completion
// @access  Private
exports.getProfileCompletion = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const ambulance = await Ambulance.findById(ambulanceId);
    
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    const completion = ambulance.calculateProfileCompletion();
    
    res.status(200).json({
      success: true,
      profileCompletion: completion
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

// @desc    Add medical equipment
// @route   POST /api/ambulances/equipment
// @access  Private
exports.addEquipment = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const equipmentData = req.body;

    const ambulance = await Ambulance.findById(ambulanceId);
    
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    if (!ambulance.medicalEquipment) {
      ambulance.medicalEquipment = [];
    }

    ambulance.medicalEquipment.push(equipmentData);
    await ambulance.save();

    res.status(201).json({
      success: true,
      message: 'Equipment added successfully',
      ambulance
    });
  } catch (error) {
    console.error('Add Equipment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding equipment',
      error: error.message
    });
  }
};

// @desc    Update medical equipment
// @route   PUT /api/ambulances/equipment/:equipmentId
// @access  Private
exports.updateEquipment = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const equipmentId = req.params.equipmentId;
    const updateData = req.body;

    const ambulance = await Ambulance.findById(ambulanceId);
    
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    const equipment = ambulance.medicalEquipment.id(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    Object.assign(equipment, updateData);
    await ambulance.save();

    res.status(200).json({
      success: true,
      message: 'Equipment updated successfully',
      ambulance
    });
  } catch (error) {
    console.error('Update Equipment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating equipment',
      error: error.message
    });
  }
};

// @desc    Delete medical equipment
// @route   DELETE /api/ambulances/equipment/:equipmentId
// @access  Private
exports.deleteEquipment = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const equipmentId = req.params.equipmentId;

    const ambulance = await Ambulance.findById(ambulanceId);
    
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    ambulance.medicalEquipment.pull(equipmentId);
    await ambulance.save();

    res.status(200).json({
      success: true,
      message: 'Equipment deleted successfully',
      ambulance
    });
  } catch (error) {
    console.error('Delete Equipment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting equipment',
      error: error.message
    });
  }
};

// @desc    Get all documents
// @route   GET /api/ambulances/documents
// @access  Private
exports.getDocuments = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const ambulance = await Ambulance.findById(ambulanceId).select('documents');
    
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    res.status(200).json({
      success: true,
      documents: ambulance.documents || []
    });
  } catch (error) {
    console.error('Get Documents Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/ambulances/documents/:docId
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const docId = req.params.docId;

    const ambulance = await Ambulance.findById(ambulanceId);
    
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    ambulance.documents.pull(docId);
    await ambulance.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      ambulance
    });
  } catch (error) {
    console.error('Delete Document Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
};

// @desc    Update current location
// @route   PUT /api/ambulances/location
// @access  Private
exports.updateLocation = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const { latitude, longitude, address } = req.body;

    const ambulance = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      {
        $set: {
          currentLocation: {
            latitude,
            longitude,
            address,
            lastUpdated: new Date()
          },
          lastActive: new Date()
        }
      },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      location: ambulance.currentLocation
    });
  } catch (error) {
    console.error('Update Location Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating location',
      error: error.message
    });
  }
};

// @desc    Update current status (available/on-trip/offline/maintenance)
// @route   PUT /api/ambulances/status
// @access  Private
exports.updateStatus = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const { status } = req.body;

    const validStatuses = ['available', 'on-trip', 'offline', 'maintenance'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
      });
    }

    const ambulance = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      {
        $set: {
          currentStatus: status,
          lastActive: new Date()
        }
      },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      currentStatus: ambulance.currentStatus
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};

// @desc    Get all ambulances (public)
// @route   GET /api/ambulances
// @access  Public
exports.getAllAmbulances = async (req, res) => {
  try {
    const { 
      city, 
      vehicleType, 
      status, 
      availability,
      minRating 
    } = req.query;

    let query = { isActive: true };

    if (city) {
      query.serviceArea = new RegExp(city, 'i');
    }

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    if (status) {
      query.currentStatus = status;
    }

    if (availability) {
      query.serviceAvailability = availability;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const ambulances = await Ambulance.find(query)
      .select('-password -documents')
      .sort('-rating -totalTrips');

    res.status(200).json({
      success: true,
      count: ambulances.length,
      ambulances
    });
  } catch (error) {
    console.error('Get All Ambulances Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ambulances',
      error: error.message
    });
  }
};

// @desc    Get ambulance by ID (public)
// @route   GET /api/ambulances/:id
// @access  Public
exports.getAmbulanceById = async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id)
      .select('-password -documents');

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    res.status(200).json({
      success: true,
      ambulance
    });
  } catch (error) {
    console.error('Get Ambulance By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ambulance',
      error: error.message
    });
  }
};

// @desc    Delete ambulance profile
// @route   DELETE /api/ambulances/profile
// @access  Private
exports.deleteProfile = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    
    const ambulance = await Ambulance.findByIdAndDelete(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
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

module.exports = exports;
