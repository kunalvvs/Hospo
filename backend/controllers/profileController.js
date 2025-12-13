const Ambulance = require('../models/Ambulance');
const cloudinary = require('../config/cloudinary');

// ==================== DRIVER PROFILE CRUD ====================

// @desc    Get all driver profiles
// @route   GET /api/ambulances/drivers
// @access  Private
exports.getDrivers = async (req, res) => {
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
      drivers: ambulance.drivers || []
    });
  } catch (error) {
    console.error('Get Drivers Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drivers',
      error: error.message
    });
  }
};

// @desc    Add new driver profile
// @route   POST /api/ambulances/drivers
// @access  Private
exports.addDriver = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const driverData = req.body;

    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    // Initialize drivers array if it doesn't exist
    if (!ambulance.drivers) {
      ambulance.drivers = [];
    }

    // Add new driver
    ambulance.drivers.push(driverData);
    await ambulance.save();

    // Get the newly added driver (last item in array)
    const newDriver = ambulance.drivers[ambulance.drivers.length - 1];

    res.status(201).json({
      success: true,
      message: 'Driver added successfully',
      driver: newDriver,
      ambulance
    });
  } catch (error) {
    console.error('Add Driver Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding driver',
      error: error.message
    });
  }
};

// @desc    Update driver profile
// @route   PUT /api/ambulances/drivers/:driverId
// @access  Private
exports.updateDriver = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const { driverId } = req.params;
    const updateData = req.body;

    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    // Find driver by subdocument _id
    const driver = ambulance.drivers.id(driverId);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Update driver fields
    Object.keys(updateData).forEach(key => {
      driver[key] = updateData[key];
    });

    await ambulance.save();

    res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      driver,
      ambulance
    });
  } catch (error) {
    console.error('Update Driver Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating driver',
      error: error.message
    });
  }
};

// @desc    Delete driver profile
// @route   DELETE /api/ambulances/drivers/:driverId
// @access  Private
exports.deleteDriver = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const { driverId } = req.params;

    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    // Find driver index
    const driverIndex = ambulance.drivers.findIndex(
      d => d._id.toString() === driverId
    );

    if (driverIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Remove driver from array using pull
    ambulance.drivers.pull(driverId);
    await ambulance.save();

    res.status(200).json({
      success: true,
      message: 'Driver deleted successfully',
      ambulance
    });
  } catch (error) {
    console.error('Delete Driver Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting driver',
      error: error.message
    });
  }
};

// ==================== VEHICLE PROFILE CRUD ====================

// @desc    Get all vehicle profiles
// @route   GET /api/ambulances/vehicles
// @access  Private
exports.getVehicles = async (req, res) => {
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
      vehicles: ambulance.vehicles || []
    });
  } catch (error) {
    console.error('Get Vehicles Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
};

// @desc    Add new vehicle profile
// @route   POST /api/ambulances/vehicles
// @access  Private
exports.addVehicle = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const vehicleData = req.body;

    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    // Initialize vehicles array if it doesn't exist
    if (!ambulance.vehicles) {
      ambulance.vehicles = [];
    }

    // Add new vehicle
    ambulance.vehicles.push(vehicleData);
    await ambulance.save();

    // Get the newly added vehicle (last item in array)
    const newVehicle = ambulance.vehicles[ambulance.vehicles.length - 1];

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      vehicle: newVehicle,
      ambulance
    });
  } catch (error) {
    console.error('Add Vehicle Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding vehicle',
      error: error.message
    });
  }
};

// @desc    Update vehicle profile
// @route   PUT /api/ambulances/vehicles/:vehicleId
// @access  Private
exports.updateVehicle = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const { vehicleId } = req.params;
    const updateData = req.body;

    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    // Find vehicle by subdocument _id
    const vehicle = ambulance.vehicles.id(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Update vehicle fields
    Object.keys(updateData).forEach(key => {
      vehicle[key] = updateData[key];
    });

    await ambulance.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle,
      ambulance
    });
  } catch (error) {
    console.error('Update Vehicle Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle',
      error: error.message
    });
  }
};

// @desc    Delete vehicle profile
// @route   DELETE /api/ambulances/vehicles/:vehicleId
// @access  Private
exports.deleteVehicle = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const { vehicleId } = req.params;

    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    // Find vehicle index
    const vehicleIndex = ambulance.vehicles.findIndex(
      v => v._id.toString() === vehicleId
    );

    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Remove vehicle from array using pull
    ambulance.vehicles.pull(vehicleId);
    await ambulance.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
      ambulance
    });
  } catch (error) {
    console.error('Delete Vehicle Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vehicle',
      error: error.message
    });
  }
};

// ==================== MIGRATION HELPERS ====================

// @desc    Migrate legacy single driver to drivers array
// @route   POST /api/ambulances/migrate-driver
// @access  Private
exports.migrateLegacyDriver = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    // Check if there's legacy driver data
    if (!ambulance.driverName) {
      return res.status(400).json({
        success: false,
        message: 'No legacy driver data to migrate'
      });
    }

    // Check if already migrated
    if (ambulance.drivers && ambulance.drivers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Driver already migrated'
      });
    }

    // Collect all driver-related fields
    const driverData = {
      driverName: ambulance.driverName,
      driverDOB: ambulance.driverDOB,
      driverAge: ambulance.driverAge,
      driverGender: ambulance.driverGender,
      driverMobile: ambulance.driverMobile,
      driverAlternateMobile: ambulance.driverAlternateMobile,
      driverPermanentAddress: ambulance.driverPermanentAddress,
      driverCurrentAddress: ambulance.driverCurrentAddress,
      driverPhoto: ambulance.driverPhoto,
      driverLanguages: ambulance.driverLanguages,
      driverExperience: ambulance.driverExperience,
      driverQualification: ambulance.driverQualification,
      emergencyContactName: ambulance.emergencyContactName,
      emergencyContactRelation: ambulance.emergencyContactRelation,
      emergencyContactPhone: ambulance.emergencyContactPhone,
      // KYC
      governmentIdType: ambulance.governmentIdType,
      governmentIdNumber: ambulance.governmentIdNumber,
      governmentIdFile: ambulance.governmentIdFile,
      drivingLicenceNumber: ambulance.drivingLicenceNumber,
      drivingLicenceIssue: ambulance.drivingLicenceIssue,
      drivingLicenceExpiry: ambulance.drivingLicenceExpiry,
      drivingLicenceFile: ambulance.drivingLicenceFile,
      licenseType: ambulance.licenseType,
      panCard: ambulance.panCard,
      panCardFile: ambulance.panCardFile,
      policeVerification: ambulance.policeVerification,
      medicalCertificate: ambulance.medicalCertificate,
      driverPassportPhoto: ambulance.driverPassportPhoto,
      backgroundCheck: ambulance.backgroundCheck,
      addressProof: ambulance.addressProof,
      // Qualifications
      drivingExperienceYears: ambulance.drivingExperienceYears,
      emergencyVehicleExperience: ambulance.emergencyVehicleExperience,
      emergencyVehicleExperienceYears: ambulance.emergencyVehicleExperienceYears,
      certificationType: ambulance.certificationType,
      certificationCourseName: ambulance.certificationCourseName,
      issuingOrganization: ambulance.issuingOrganization,
      certificateExpiry: ambulance.certificateExpiry,
      certificationCertificateFile: ambulance.certificationCertificateFile,
      paramedicTraining: ambulance.paramedicTraining,
      defensiveDrivingCertificate: ambulance.defensiveDrivingCertificate,
      defensiveDrivingCertificateFile: ambulance.defensiveDrivingCertificateFile,
      communicationSkills: ambulance.communicationSkills
    };

    // Initialize drivers array and add the migrated driver
    ambulance.drivers = [driverData];
    await ambulance.save();

    res.status(200).json({
      success: true,
      message: 'Legacy driver data migrated successfully',
      driver: ambulance.drivers[0],
      ambulance
    });
  } catch (error) {
    console.error('Migrate Driver Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error migrating driver data',
      error: error.message
    });
  }
};

// @desc    Migrate legacy single vehicle to vehicles array
// @route   POST /api/ambulances/migrate-vehicle
// @access  Private
exports.migrateLegacyVehicle = async (req, res) => {
  try {
    const ambulanceId = req.ambulance?.id || req.user?.id;
    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    // Check if there's legacy vehicle data
    if (!ambulance.vehicleRegistrationNumber) {
      return res.status(400).json({
        success: false,
        message: 'No legacy vehicle data to migrate'
      });
    }

    // Check if already migrated
    if (ambulance.vehicles && ambulance.vehicles.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle already migrated'
      });
    }

    // Collect all vehicle-related fields
    const vehicleData = {
      vehicleType: ambulance.vehicleType,
      vehicleRegistrationNumber: ambulance.vehicleRegistrationNumber,
      vehicleMake: ambulance.vehicleMake,
      vehicleModel: ambulance.vehicleModel,
      manufacturingYear: ambulance.manufacturingYear,
      vehicleColor: ambulance.vehicleColor,
      chassisNumber: ambulance.chassisNumber,
      engineNumber: ambulance.engineNumber,
      ownershipType: ambulance.ownershipType,
      commercialPermitNumber: ambulance.commercialPermitNumber,
      ownerName: ambulance.ownerName,
      seatingCapacity: ambulance.seatingCapacity,
      stretcherCapacity: ambulance.stretcherCapacity,
      acAvailable: ambulance.acAvailable,
      oxygenCylinder: ambulance.oxygenCylinder,
      ventilatorAvailable: ambulance.ventilatorAvailable,
      // Documents
      rcFront: ambulance.rcFront,
      rcBack: ambulance.rcBack,
      insurancePolicyNumber: ambulance.insurancePolicyNumber,
      insuranceCompany: ambulance.insuranceCompany,
      insuranceExpiryDate: ambulance.insuranceExpiryDate,
      insuranceCopy: ambulance.insuranceCopy,
      pucCertificateNumber: ambulance.pucCertificateNumber,
      pucValidUntil: ambulance.pucValidUntil,
      pucCertificate: ambulance.pucCertificate,
      fitnessCertificate: ambulance.fitnessCertificate,
      roadPermit: ambulance.roadPermit,
      ambulanceConversionCertificate: ambulance.ambulanceConversionCertificate,
      manufacturerFitmentCertificate: ambulance.manufacturerFitmentCertificate,
      invoicePurchaseBill: ambulance.invoicePurchaseBill,
      vehiclePhotos: ambulance.vehiclePhotos,
      // Equipment
      hasStretcher: ambulance.hasStretcher,
      stretcherType: ambulance.stretcherType,
      stretcherQuantity: ambulance.stretcherQuantity,
      stretcherCondition: ambulance.stretcherCondition,
      stretcherLastMaintenance: ambulance.stretcherLastMaintenance,
      hasOxygenCylinder: ambulance.hasOxygenCylinder,
      oxygenQuantity: ambulance.oxygenQuantity,
      oxygenCapacity: ambulance.oxygenCapacity,
      oxygenLastRefill: ambulance.oxygenLastRefill,
      oxygenRegulatorCondition: ambulance.oxygenRegulatorCondition,
      hasAmbuBag: ambulance.hasAmbuBag,
      ambuBagAdultQty: ambulance.ambuBagAdultQty,
      ambuBagPediatricQty: ambulance.ambuBagPediatricQty,
      ambuBagCondition: ambulance.ambuBagCondition,
      hasSuctionMachine: ambulance.hasSuctionMachine,
      suctionQuantity: ambulance.suctionQuantity,
      suctionStatus: ambulance.suctionStatus,
      suctionLastMaintenance: ambulance.suctionLastMaintenance,
      hasBPApparatus: ambulance.hasBPApparatus,
      hasPulseOximeter: ambulance.hasPulseOximeter,
      hasGlucometer: ambulance.hasGlucometer,
      hasThermometer: ambulance.hasThermometer,
      hasSplints: ambulance.hasSplints,
      hasCervicalCollar: ambulance.hasCervicalCollar,
      hasImmobilizationBoard: ambulance.hasImmobilizationBoard,
      hasWoundDressings: ambulance.hasWoundDressings,
      hasIVSets: ambulance.hasIVSets,
      hasCannulas: ambulance.hasCannulas,
      hasSyringes: ambulance.hasSyringes,
      medicalSuppliesExpiryDate: ambulance.medicalSuppliesExpiryDate,
      hasEmergencyDrugsKit: ambulance.hasEmergencyDrugsKit,
      emergencyDrugsList: ambulance.emergencyDrugsList,
      emergencyDrugsExpiry: ambulance.emergencyDrugsExpiry,
      hasFireExtinguisher: ambulance.hasFireExtinguisher,
      hasFirstAidBox: ambulance.hasFirstAidBox,
      hasSurgicalMasks: ambulance.hasSurgicalMasks,
      hasGloves: ambulance.hasGloves,
      hasDisinfectant: ambulance.hasDisinfectant,
      hasHandSanitizer: ambulance.hasHandSanitizer,
      equipmentNotes: ambulance.equipmentNotes,
      lastEquipmentCheck: ambulance.lastEquipmentCheck
    };

    // Initialize vehicles array and add the migrated vehicle
    ambulance.vehicles = [vehicleData];
    await ambulance.save();

    res.status(200).json({
      success: true,
      message: 'Legacy vehicle data migrated successfully',
      vehicle: ambulance.vehicles[0],
      ambulance
    });
  } catch (error) {
    console.error('Migrate Vehicle Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error migrating vehicle data',
      error: error.message
    });
  }
};
