const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      consultationType,
      bookingFor,
      paymentMode,
      symptoms,
      notes
    } = req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctor, date, and time'
      });
    }

    // Get patient info from authenticated user
    const patientId = req.user?.id || req.patient?.id;
    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get doctor info
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if doctor is available at the requested time
    // TODO: Add availability check logic

    // Create appointment
    const appointment = await Appointment.create({
      patient: patientId,
      patientName: patient.name,
      patientPhone: patient.phone,
      patientEmail: patient.email,
      doctor: doctorId,
      doctorName: doctor.name,
      appointmentDate,
      appointmentTime,
      consultationType: consultationType || 'In-Person',
      bookingFor: bookingFor || 'Self',
      consultationFee: doctor.consultationFee || 500,
      paymentMode: paymentMode || 'Online',
      symptoms,
      notes,
      location: {
        hospital: doctor.clinicHospitalName,
        address: doctor.clinicAddress
      }
    });

    // Emit socket event for real-time notification to doctor
    const io = req.app.get('io');
    if (io) {
      io.to(`doctor_${doctorId}`).emit('new_appointment', {
        appointmentId: appointment._id,
        patientName: appointment.patientName,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        consultationType: appointment.consultationType,
        createdAt: appointment.createdAt
      });
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Book Appointment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking appointment',
      error: error.message
    });
  }
};

// @desc    Get appointments for a patient
// @route   GET /api/appointments/patient
// @access  Private (Patient)
exports.getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user?.id || req.patient?.id;
    const { status } = req.query;

    const query = { patient: patientId };
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name primarySpecialization profilePhoto consultationFee clinicName clinicHospitalName clinicStreet clinicCity clinicState')
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Get Patient Appointments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// @desc    Get appointments for a doctor
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user?.id || req.doctor?.id;
    const { status, date } = req.query;

    const query = { doctor: doctorId };
    if (status) {
      query.status = status;
    }
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name phone email profilePhoto')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Get Doctor Appointments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name phone email profilePhoto')
      .populate('doctor', 'name specialization profilePhoto consultationFee');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Get Appointment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['confirmed', 'cancelled', 'completed', 'no-show'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Emit socket event to patient
    const io = req.app.get('io');
    if (io) {
      io.to(`patient_${appointment.patient}`).emit('appointment_status_updated', {
        appointmentId: appointment._id,
        status: appointment.status
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated',
      appointment
    });
  } catch (error) {
    console.error('Update Appointment Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment status',
      error: error.message
    });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Cancel Appointment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
};
