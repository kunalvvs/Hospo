const Pathlab = require('../models/Pathlab');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc    Get pathlab profile
// @route   GET /api/pathlabs/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const pathlabId = req.pathlab?.id || req.user?.id;
    const pathlab = await Pathlab.findById(pathlabId);
    
    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
      });
    }

    res.status(200).json({
      success: true,
      pathlab
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

// @desc    Update pathlab profile
// @route   PUT /api/pathlabs/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const pathlabId = req.pathlab?.id || req.user?.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.role;

    // Allow email and phone updates but keep them in sync
    if (updateData.email) {
      updateData.primaryEmail = updateData.email;
    }
    if (updateData.phone) {
      updateData.primaryMobile = updateData.phone;
    }

    const pathlab = await Pathlab.findByIdAndUpdate(
      pathlabId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      pathlab
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

// @desc    Update pathlab profile section
// @route   PUT /api/pathlabs/profile/:section
// @access  Private
exports.updateSection = async (req, res) => {
  try {
    const pathlabId = req.pathlab?.id || req.user?.id;
    const section = req.params.section;
    const updateData = req.body;

    // Validate section
    const validSections = ['identity', 'registration', 'director', 'address', 'contact', 'services', 'facilities', 'equipment', 'staff', 'payment', 'banking', 'collection', 'reports'];
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid section: ${section}. Valid sections are: ${validSections.join(', ')}`
      });
    }

    const pathlab = await Pathlab.findByIdAndUpdate(
      pathlabId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `${section} section updated successfully`,
      pathlab
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

// @desc    Add test to catalog
// @route   POST /api/pathlabs/tests
// @access  Private
exports.addTest = async (req, res) => {
  try {
    const pathlabId = req.pathlab?.id || req.user?.id;
    const testData = req.body;

    const pathlab = await Pathlab.findById(pathlabId);
    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
      });
    }

    // Add test to catalog
    if (!pathlab.testsCatalog) {
      pathlab.testsCatalog = [];
    }
    pathlab.testsCatalog.push(testData);
    await pathlab.save();

    res.status(201).json({
      success: true,
      message: 'Test added successfully',
      pathlab
    });
  } catch (error) {
    console.error('Add Test Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding test',
      error: error.message
    });
  }
};

// @desc    Update test in catalog
// @route   PUT /api/pathlabs/tests/:testId
// @access  Private
exports.updateTest = async (req, res) => {
  try {
    const pathlabId = req.pathlab?.id || req.user?.id;
    const testId = req.params.testId;
    const updateData = req.body;

    const pathlab = await Pathlab.findById(pathlabId);
    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
      });
    }

    // Find and update test
    const testIndex = pathlab.testsCatalog.findIndex(test => test._id.toString() === testId);
    if (testIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    pathlab.testsCatalog[testIndex] = { ...pathlab.testsCatalog[testIndex].toObject(), ...updateData };
    await pathlab.save();

    res.status(200).json({
      success: true,
      message: 'Test updated successfully',
      pathlab
    });
  } catch (error) {
    console.error('Update Test Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating test',
      error: error.message
    });
  }
};

// @desc    Delete test from catalog
// @route   DELETE /api/pathlabs/tests/:testId
// @access  Private
exports.deleteTest = async (req, res) => {
  try {
    const pathlabId = req.pathlab?.id || req.user?.id;
    const testId = req.params.testId;

    const pathlab = await Pathlab.findById(pathlabId);
    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
      });
    }

    // Remove test
    pathlab.testsCatalog = pathlab.testsCatalog.filter(test => test._id.toString() !== testId);
    await pathlab.save();

    res.status(200).json({
      success: true,
      message: 'Test deleted successfully',
      pathlab
    });
  } catch (error) {
    console.error('Delete Test Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting test',
      error: error.message
    });
  }
};

// @desc    Get all pathlabs (for public listing)
// @route   GET /api/pathlabs
// @access  Public
exports.getAllPathlabs = async (req, res) => {
  try {
    const pathlabs = await Pathlab.find({ isActive: true, isVerified: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pathlabs.length,
      pathlabs
    });
  } catch (error) {
    console.error('Get All Pathlabs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pathlabs',
      error: error.message
    });
  }
};

// @desc    Get pathlab by ID (for public view)
// @route   GET /api/pathlabs/:id
// @access  Public
exports.getPathlabById = async (req, res) => {
  try {
    const pathlab = await Pathlab.findById(req.params.id).select('-password');

    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
      });
    }

    res.status(200).json({
      success: true,
      pathlab
    });
  } catch (error) {
    console.error('Get Pathlab By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pathlab',
      error: error.message
    });
  }
};

// @desc    Delete pathlab profile
// @route   DELETE /api/pathlabs/profile
// @access  Private
exports.deleteProfile = async (req, res) => {
  try {
    const pathlabId = req.pathlab?.id || req.user?.id;
    
    const pathlab = await Pathlab.findByIdAndDelete(pathlabId);

    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
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

// @desc    Upload file to Cloudinary
// @route   POST /api/pathlabs/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const pathlabId = req.pathlab?.id || req.user?.id;
    const fieldName = req.body.fieldName;
    const docType = req.body.docType; // For documents array

    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'pathlab_documents',
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
          // Update pathlab profile with file URL
          const pathlab = await Pathlab.findById(pathlabId);
          
          if (!pathlab) {
            return res.status(404).json({
              success: false,
              message: 'Pathlab not found'
            });
          }

          // If docType is provided, add to documents array
          if (docType) {
            if (!pathlab.documents) {
              pathlab.documents = [];
            }
            pathlab.documents.push({
              docType: docType,
              docName: req.file.originalname,
              url: result.secure_url,
              uploadedAt: new Date()
            });
          }

          // If fieldName is provided, update specific field
          if (fieldName) {
            pathlab[fieldName] = result.secure_url;
          }

          await pathlab.save();

          res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id,
            pathlab
          });
        } catch (updateError) {
          console.error('Update Error after upload:', updateError);
          res.status(500).json({
            success: false,
            message: 'File uploaded but failed to update profile',
            error: updateError.message
          });
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error('Upload File Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

// @desc    Get all documents for pathlab
// @route   GET /api/pathlabs/documents
// @access  Private
exports.getDocuments = async (req, res) => {
  try {
    const pathlabId = req.pathlab?.id || req.user?.id;
    const pathlab = await Pathlab.findById(pathlabId);

    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
      });
    }

    res.status(200).json({
      success: true,
      documents: pathlab.documents || [],
      licenseDocuments: {
        labRegistrationCert: pathlab.labRegistrationCert,
        clinicalEstablishmentCert: pathlab.clinicalEstablishmentCert,
        drugsDiagnosticLicense: pathlab.drugsDiagnosticLicense,
        gstDocument: pathlab.gstDocument,
        panDocument: pathlab.panDocument,
        ownerIdProof: pathlab.ownerIdProof,
        NABLCertificate: pathlab.NABLCertificate,
        ISOCertificate: pathlab.ISOCertificate,
        otherCertifications: pathlab.otherCertifications || []
      }
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

// @desc    Delete document from pathlab
// @route   DELETE /api/pathlabs/documents/:docId
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const pathlabId = req.pathlab?.id || req.user?.id;
    const docId = req.params.docId;

    const pathlab = await Pathlab.findById(pathlabId);
    
    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
      });
    }

    // Remove document from array
    if (pathlab.documents) {
      pathlab.documents = pathlab.documents.filter(doc => doc._id.toString() !== docId);
      await pathlab.save();
    }

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      pathlab
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

// @desc    Get profile completion percentage
// @route   GET /api/pathlabs/profile-completion
// @access  Private
exports.getProfileCompletion = async (req, res) => {
  try {
    const pathlabId = req.pathlab?.id || req.user?.id;
    const pathlab = await Pathlab.findById(pathlabId);

    if (!pathlab) {
      return res.status(404).json({
        success: false,
        message: 'Pathlab not found'
      });
    }

    // Calculate completion percentage based on filled fields
    let filledFields = 0;
    let totalFields = 0;

    // Basic fields (5 fields)
    const basicFields = ['name', 'email', 'phone', 'labType', 'businessType'];
    basicFields.forEach(field => {
      totalFields++;
      if (pathlab[field]) filledFields++;
    });

    // Address fields (6 fields)
    const addressFields = ['doorNo', 'street', 'city', 'state', 'pincode', 'locality'];
    addressFields.forEach(field => {
      totalFields++;
      if (pathlab[field] || pathlab.address?.[field]) filledFields++;
    });

    // Registration fields (2 fields)
    const regFields = ['registrationNumber', 'licenseNumber'];
    regFields.forEach(field => {
      totalFields++;
      if (pathlab[field]) filledFields++;
    });

    // Contact fields (4 fields)
    const contactFields = ['alternatePhone', 'whatsappNumber', 'workingHours', 'sampleCollectionHours'];
    contactFields.forEach(field => {
      totalFields++;
      if (pathlab[field]) filledFields++;
    });

    // Director fields (2 fields)
    const directorFields = ['directorName', 'authorizedPerson'];
    directorFields.forEach(field => {
      totalFields++;
      if (pathlab[field]) filledFields++;
    });

    // Services (1 field)
    totalFields++;
    if (pathlab.services && pathlab.services.length > 0) filledFields++;

    // Facilities (1 field)
    totalFields++;
    if (pathlab.facilities && pathlab.facilities.length > 0) filledFields++;

    // Tests Catalog (1 field)
    totalFields++;
    if (pathlab.testsCatalog && pathlab.testsCatalog.length > 0) filledFields++;

    // Staff (1 field)
    totalFields++;
    if (pathlab.totalStaff && pathlab.totalStaff > 0) filledFields++;

    // Bank details (3 fields)
    if (pathlab.bankDetails) {
      const bankFields = ['accountNumber', 'ifscCode', 'accountHolderName'];
      bankFields.forEach(field => {
        totalFields++;
        if (pathlab.bankDetails[field]) filledFields++;
      });
    } else {
      totalFields += 3;
    }

    const completionPercentage = Math.round((filledFields / totalFields) * 100);

    res.status(200).json({
      success: true,
      completionPercentage,
      filledFields,
      totalFields
    });
  } catch (error) {
    console.error('Get Profile Completion Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating profile completion',
      error: error.message
    });
  }
};
