const Chemist = require('../models/Chemist');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc    Get chemist profile
// @route   GET /api/chemists/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const chemist = await Chemist.findById(req.user.id).select('-password');
    
    if (!chemist) {
      return res.status(404).json({
        success: false,
        message: 'Chemist profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: chemist
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update chemist profile
// @route   PUT /api/chemists/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    // Remove sensitive fields that shouldn't be updated directly
    const updateFields = { ...req.body };
    delete updateFields.password;
    delete updateFields.email;
    delete updateFields.phone;
    delete updateFields.role;

    const chemist = await Chemist.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!chemist) {
      return res.status(404).json({
        success: false,
        message: 'Chemist not found'
      });
    }

    // Calculate profile completion
    chemist.calculateProfileCompletion();
    await chemist.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: chemist
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// @desc    Update specific section of chemist profile
// @route   PUT /api/chemists/profile/:section
// @access  Private
const updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const updateData = req.body;

    let updateFields = {};

    switch (section) {
      case 'identity':
        updateFields = {
          pharmacyName: updateData.pharmacyName,
          businessType: updateData.businessType,
          tagline: updateData.tagline,
          logo: updateData.logo,
          description: updateData.description,
          establishedYear: updateData.establishedYear
        };
        break;

      case 'address':
        updateFields = {
          shopNumber: updateData.shopNumber,
          building: updateData.building,
          locality: updateData.locality,
          city: updateData.city,
          state: updateData.state,
          pin: updateData.pin,
          landmark: updateData.landmark,
          latitude: updateData.latitude,
          longitude: updateData.longitude,
          branches: updateData.branches
        };
        break;

      case 'contact':
        updateFields = {
          primaryPhone: updateData.primaryPhone,
          mobile: updateData.mobile,
          whatsappNumber: updateData.whatsappNumber,
          contactEmail: updateData.contactEmail,
          website: updateData.website,
          facebook: updateData.facebook,
          instagram: updateData.instagram,
          twitter: updateData.twitter
        };
        break;

      case 'kyc':
      case 'license':
        updateFields = {
          drugLicenseNumber: updateData.drugLicenseNumber,
          drugLicenseCertificate: updateData.drugLicenseCertificate,
          drugLicenseExpiry: updateData.drugLicenseExpiry,
          gstNumber: updateData.gstNumber,
          gstCertificate: updateData.gstCertificate,
          panNumber: updateData.panNumber,
          panCard: updateData.panCard,
          shopLicense: updateData.shopLicense,
          ownerIdentityProof: updateData.ownerIdentityProof,
          pharmacistRegistrationNumber: updateData.pharmacistRegistrationNumber,
          pharmacistCertificate: updateData.pharmacistCertificate
        };
        break;

      case 'hours':
      case 'operatingHours':
        updateFields = {
          operatingHours: updateData.operatingHours,
          is24x7: updateData.is24x7,
          deliveryStartTime: updateData.deliveryStartTime,
          deliveryEndTime: updateData.deliveryEndTime,
          nightServiceAvailable: updateData.nightServiceAvailable
        };
        break;

      case 'services':
        updateFields = {
          services: updateData.services,
          serviceSettings: updateData.serviceSettings
        };
        break;

      case 'inventory':
        updateFields = {
          inventory: updateData.inventory
        };
        break;
      
      case 'payments':
      case 'paymentSettings':
        updateFields = {
          paymentSettings: updateData.paymentSettings,
          'accountDetails.upiId': updateData.upiId
        };
        break;

      case 'bankDetails':
      case 'bank':
        updateFields = {
          accountDetails: updateData.accountDetails || updateData
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid section specified'
        });
    }

    const chemist = await Chemist.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!chemist) {
      return res.status(404).json({
        success: false,
        message: 'Chemist not found'
      });
    }

    // Calculate profile completion
    chemist.calculateProfileCompletion();
    await chemist.save();

    res.status(200).json({
      success: true,
      message: `${section} section updated successfully`,
      data: chemist
    });
  } catch (error) {
    console.error('Error in updateSection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update section',
      error: error.message
    });
  }
};

// @desc    Upload file to Cloudinary
// @route   POST /api/chemists/upload
// @access  Private
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { fieldName } = req.body;

    if (!fieldName) {
      return res.status(400).json({
        success: false,
        message: 'Field name is required'
      });
    }

    // Upload to Cloudinary using buffer
    const uploadStream = (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadOptions = {
          folder: 'torion-healthcare/chemists',
          resource_type: 'auto', // Automatically detect file type
        };

        // Add transformation only for images, not for PDFs or documents
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
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type
    });

    // Update chemist profile with file URL
    try {
      const updateData = { [fieldName]: result.secure_url };
      
      const chemist = await Chemist.findByIdAndUpdate(
        req.user.id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!chemist) {
        return res.status(404).json({
          success: false,
          message: 'Chemist not found'
        });
      }

      // Calculate profile completion
      chemist.calculateProfileCompletion();
      await chemist.save();

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        fileUrl: result.secure_url,
        publicId: result.public_id,
        filename: req.file.originalname,
        format: result.format,
        resourceType: result.resource_type,
        data: chemist
      });
    } catch (dbError) {
      console.error('Database update error:', dbError);
      res.status(500).json({
        success: false,
        message: 'File uploaded but failed to update profile',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error('Error in uploadFile:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};

// @desc    Delete chemist profile (soft delete)
// @route   DELETE /api/chemists/profile
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const chemist = await Chemist.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          isActive: false,
          deletedAt: new Date()
        }
      },
      { new: true }
    ).select('-password');

    if (!chemist) {
      return res.status(404).json({
        success: false,
        message: 'Chemist not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
      data: chemist
    });
  } catch (error) {
    console.error('Error in deleteProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile',
      error: error.message
    });
  }
};

// @desc    Get profile completion percentage
// @route   GET /api/chemists/profile-completion
// @access  Private
const getProfileCompletion = async (req, res) => {
  try {
    const chemist = await Chemist.findById(req.user.id).select('-password');
    
    if (!chemist) {
      return res.status(404).json({
        success: false,
        message: 'Chemist not found'
      });
    }

    const completion = chemist.calculateProfileCompletion();
    await chemist.save();

    res.status(200).json({
      success: true,
      data: {
        profileCompletion: completion,
        registrationComplete: chemist.registrationComplete,
        isVerified: chemist.isVerified
      }
    });
  } catch (error) {
    console.error('Error in getProfileCompletion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile completion',
      error: error.message
    });
  }
};

// @desc    Get all chemists (public)
// @route   GET /api/chemists
// @access  Public
const getAllChemists = async (req, res) => {
  try {
    const chemists = await Chemist.find({ 
      isActive: true,
      isVerified: true,
      deletedAt: null
    }).select('-password');

    res.status(200).json({
      success: true,
      count: chemists.length,
      data: chemists
    });
  } catch (error) {
    console.error('Error in getAllChemists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chemists',
      error: error.message
    });
  }
};

// @desc    Get chemist by ID (public)
// @route   GET /api/chemists/:id
// @access  Public
const getChemistById = async (req, res) => {
  try {
    const chemist = await Chemist.findOne({
      _id: req.params.id,
      isActive: true,
      deletedAt: null
    }).select('-password');

    if (!chemist) {
      return res.status(404).json({
        success: false,
        message: 'Chemist not found'
      });
    }

    res.status(200).json({
      success: true,
      data: chemist
    });
  } catch (error) {
    console.error('Error in getChemistById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chemist',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateSection,
  uploadFile,
  deleteProfile,
  getProfileCompletion,
  getAllChemists,
  getChemistById
};
