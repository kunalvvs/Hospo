const Chemist = require('../models/Chemist');
const ChemistOrder = require('../models/ChemistOrder');
const ChemistRating = require('../models/ChemistRating');
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
          accountDetails: updateData.accountDetails
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

// @desc    Get nearby chemists based on location
// @route   GET /api/chemists/nearby
// @access  Public
const getNearbyChemists = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, city, pincode } = req.query;

    let chemists;

    if (latitude && longitude) {
      // Use geospatial query if coordinates provided
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const radiusInKm = parseFloat(radius);

      chemists = await Chemist.find({
        isActive: true,
        isVerified: true,
        deletedAt: null,
        latitude: { $exists: true, $ne: '' },
        longitude: { $exists: true, $ne: '' }
      }).select('-password');

      // Calculate distance and filter
      chemists = chemists.map(chemist => {
        const chemistLat = parseFloat(chemist.latitude);
        const chemistLng = parseFloat(chemist.longitude);
        
        // Haversine formula
        const R = 6371; // Earth radius in km
        const dLat = (chemistLat - lat) * Math.PI / 180;
        const dLon = (chemistLng - lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat * Math.PI / 180) * Math.cos(chemistLat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        return {
          ...chemist.toObject(),
          distance: parseFloat(distance.toFixed(2))
        };
      }).filter(chemist => chemist.distance <= radiusInKm)
        .sort((a, b) => a.distance - b.distance);

    } else if (city || pincode) {
      // Fallback to city/pincode filter
      const query = {
        isActive: true,
        isVerified: true,
        deletedAt: null
      };

      if (city) {
        query.city = new RegExp(city, 'i');
      }
      if (pincode) {
        query.pin = pincode;
      }

      chemists = await Chemist.find(query).select('-password');
    } else {
      // Return all chemists if no location provided
      chemists = await Chemist.find({
        isActive: true,
        isVerified: true,
        deletedAt: null
      }).select('-password').limit(20);
    }

    res.status(200).json({
      success: true,
      count: chemists.length,
      data: chemists
    });
  } catch (error) {
    console.error('Error in getNearbyChemists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby chemists',
      error: error.message
    });
  }
};

// @desc    Search medicines globally across all chemists
// @route   GET /api/chemists/medicines/search
// @access  Public
const searchMedicines = async (req, res) => {
  try {
    const { query, category, prescriptionRequired, minPrice, maxPrice } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const searchRegex = new RegExp(query, 'i');
    const filters = {
      isActive: true,
      isVerified: true,
      deletedAt: null,
      'inventory.productStatus': 'active'
    };

    const chemists = await Chemist.find(filters).select('-password');

    const results = [];

    chemists.forEach(chemist => {
      chemist.inventory.forEach(medicine => {
        if (medicine.productStatus !== 'active') return;

        const matchesSearch = searchRegex.test(medicine.medicineName) ||
                            searchRegex.test(medicine.genericName) ||
                            searchRegex.test(medicine.manufacturer);

        const matchesCategory = !category || medicine.category === category;
        const matchesPrescription = prescriptionRequired === undefined ||
                                   medicine.prescriptionRequired === (prescriptionRequired === 'true');
        const matchesPrice = (!minPrice || medicine.price >= parseFloat(minPrice)) &&
                           (!maxPrice || medicine.price <= parseFloat(maxPrice));

        if (matchesSearch && matchesCategory && matchesPrescription && matchesPrice) {
          results.push({
            medicine: {
              id: medicine._id,
              productId: medicine.productId,
              name: medicine.medicineName,
              genericName: medicine.genericName,
              manufacturer: medicine.manufacturer,
              formulation: medicine.formulation,
              strength: medicine.strength,
              price: medicine.price,
              mrp: medicine.mrp,
              discount: medicine.discount,
              category: medicine.category,
              prescriptionRequired: medicine.prescriptionRequired,
              quantity: medicine.quantity,
              mainImage: medicine.mainImage
            },
            chemist: {
              id: chemist._id,
              pharmacyName: chemist.pharmacyName,
              city: chemist.city,
              locality: chemist.locality,
              pin: chemist.pin,
              primaryPhone: chemist.primaryPhone,
              latitude: chemist.latitude,
              longitude: chemist.longitude,
              rating: chemist.rating,
              totalReviews: chemist.totalReviews
            }
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error in searchMedicines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search medicines',
      error: error.message
    });
  }
};

// @desc    Check chemist working hours availability
// @route   GET /api/chemists/:id/availability
// @access  Public
const checkAvailability = async (req, res) => {
  try {
    const chemist = await Chemist.findById(req.params.id).select('operatingHours is24x7');

    if (!chemist) {
      return res.status(404).json({
        success: false,
        message: 'Chemist not found'
      });
    }

    if (chemist.is24x7) {
      return res.status(200).json({
        success: true,
        isOpen: true,
        is24x7: true,
        message: 'Open 24/7'
      });
    }

    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight

    const todayHours = chemist.operatingHours?.[currentDay];

    if (!todayHours || todayHours.closed) {
      return res.status(200).json({
        success: true,
        isOpen: false,
        message: 'Closed today'
      });
    }

    const openTime = todayHours.open?.split(':');
    const closeTime = todayHours.close?.split(':');

    if (!openTime || !closeTime) {
      return res.status(200).json({
        success: true,
        isOpen: false,
        message: 'Operating hours not set'
      });
    }

    const openMinutes = parseInt(openTime[0]) * 60 + parseInt(openTime[1]);
    const closeMinutes = parseInt(closeTime[0]) * 60 + parseInt(closeTime[1]);

    const isOpen = currentTime >= openMinutes && currentTime <= closeMinutes;

    res.status(200).json({
      success: true,
      isOpen,
      currentDay,
      openTime: todayHours.open,
      closeTime: todayHours.close,
      message: isOpen ? 'Open now' : 'Closed now'
    });
  } catch (error) {
    console.error('Error in checkAvailability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: error.message
    });
  }
};

// @desc    Place medicine order
// @route   POST /api/chemists/orders
// @access  Private (User)
const placeOrder = async (req, res) => {
  try {
    const { chemistId, medicines, deliveryAddress, deliveryType, paymentMethod, prescriptionImage, customerNotes } = req.body;

    // Validate required fields
    if (!chemistId || !medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide chemist and medicines'
      });
    }

    // Get chemist details
    const chemist = await Chemist.findById(chemistId);
    if (!chemist || !chemist.isActive || !chemist.isVerified) {
      return res.status(404).json({
        success: false,
        message: 'Chemist not available'
      });
    }

    // Calculate order amount
    let subtotal = 0;
    let totalDiscount = 0;

    medicines.forEach(item => {
      subtotal += item.price * item.quantity;
      if (item.discount) {
        totalDiscount += item.discount * item.quantity;
      }
    });

    const deliveryCharge = deliveryType === 'home-delivery' ? 30 : 0;
    const totalAmount = subtotal - totalDiscount + deliveryCharge;

    // Generate order number
    const count = await ChemistOrder.countDocuments();
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const orderNumber = `ORD-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    // Create order
    const order = await ChemistOrder.create({
      orderNumber,
      user: req.user.id,
      chemist: chemistId,
      medicines,
      prescriptionImage: prescriptionImage || '',
      subtotal,
      discount: totalDiscount,
      deliveryCharge,
      totalAmount,
      deliveryAddress,
      deliveryType: deliveryType || 'home-delivery',
      paymentMethod: paymentMethod || 'cash',
      customerNotes: customerNotes || ''
    });

    // Emit socket event to chemist
    const io = req.app.get('io');
    if (io) {
      io.to(`chemist_${chemistId}`).emit('new_order', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        medicineCount: medicines.length
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Error in placeOrder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/chemists/orders/my-orders
// @access  Private (User)
const getMyOrders = async (req, res) => {
  try {
    const orders = await ChemistOrder.find({ user: req.user.id })
      .populate('chemist', 'pharmacyName city locality primaryPhone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error in getMyOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// @desc    Get orders for a specific chemist (chemist's dashboard)
// @route   GET /api/chemists/orders/chemist-orders
// @access  Private (Chemist)
const getChemistOrders = async (req, res) => {
  try {
    // Get chemist profile to find chemist ID
    const chemist = await Chemist.findOne({ email: req.user.email });
    
    if (!chemist) {
      return res.status(404).json({
        success: false,
        message: 'Chemist profile not found'
      });
    }

    // Fetch all orders for this chemist
    const orders = await ChemistOrder.find({ chemist: chemist._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error in getChemistOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chemist orders',
      error: error.message
    });
  }
};

// @desc    Add rating and review
// @route   POST /api/chemists/:id/rating
// @access  Private (User)
const addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const chemistId = req.params.id;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if user already rated
    let existingRating = await ChemistRating.findOne({
      user: userId,
      chemist: chemistId
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review || '';
      await existingRating.save();
    } else {
      // Create new rating
      existingRating = await ChemistRating.create({
        user: userId,
        chemist: chemistId,
        rating,
        review: review || ''
      });
    }

    // Recalculate chemist's average rating
    const ratings = await ChemistRating.find({ chemist: chemistId });
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await Chemist.findByIdAndUpdate(chemistId, {
      rating: parseFloat(avgRating.toFixed(1)),
      totalReviews: ratings.length
    });

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: existingRating
    });
  } catch (error) {
    console.error('Error in addRating:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add rating',
      error: error.message
    });
  }
};

// @desc    Get chemist ratings
// @route   GET /api/chemists/:id/ratings
// @access  Public
const getChemistRatings = async (req, res) => {
  try {
    const ratings = await ChemistRating.find({ chemist: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (error) {
    console.error('Error in getChemistRatings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ratings',
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
  getChemistById,
  getNearbyChemists,
  searchMedicines,
  checkAvailability,
  placeOrder,
  getMyOrders,
  getChemistOrders,
  addRating,
  getChemistRatings
};
