import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bed, Stethoscope, User, Briefcase, Scissors, DollarSign, Calendar, CheckCircle2 } from "lucide-react";

// Major Expenses Component
const MajorExpensesSection = () => {
  const [activeTab, setActiveTab] = useState("rooms");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: "",
    checkOutDate: "",
    numberOfDays: 1,
  });

  // Sample Data - Replace with API calls
  const roomsData = [
    {
      room_id: 1,
      room_type: "General Ward",
      room_name: "Ward A - Bed 101",
      floor: "1st Floor",
      charge_per_day: 1500,
      max_patients: 6,
      description: "Shared ward with basic amenities",
      status: "Active",
      available: true,
    },
    {
      room_id: 2,
      room_type: "Semi Private",
      room_name: "Room 201",
      floor: "2nd Floor",
      charge_per_day: 3000,
      max_patients: 2,
      description: "Semi-private room with attached bathroom",
      status: "Active",
      available: true,
    },
    {
      room_id: 3,
      room_type: "Private",
      room_name: "Room 301",
      floor: "3rd Floor",
      charge_per_day: 5000,
      max_patients: 1,
      description: "Private room with AC, TV, and attached bathroom",
      status: "Active",
      available: false,
    },
    {
      room_id: 4,
      room_type: "Deluxe",
      room_name: "Deluxe Suite 401",
      floor: "4th Floor",
      charge_per_day: 8000,
      max_patients: 1,
      description: "Deluxe room with all modern amenities, sofa bed for attendant",
      status: "Active",
      available: true,
    },
    {
      room_id: 5,
      room_type: "ICU",
      room_name: "ICU - Bed 12",
      floor: "Ground Floor",
      charge_per_day: 12000,
      max_patients: 1,
      description: "Intensive Care Unit with 24/7 monitoring",
      status: "Active",
      available: true,
    },
  ];

  const proceduresData = [
    {
      procedure_id: 1,
      procedure_name: "Appendectomy",
      procedure_type: "Major Surgery",
      base_charge: 45000,
      ot_charges: 15000,
      anesthesia_charge: 8000,
      doctor_fee_default: 20000,
      description: "Surgical removal of the appendix",
      status: "Active",
    },
    {
      procedure_id: 2,
      procedure_name: "C-Section",
      procedure_type: "Major Surgery",
      base_charge: 55000,
      ot_charges: 18000,
      anesthesia_charge: 10000,
      doctor_fee_default: 25000,
      description: "Cesarean section delivery",
      status: "Active",
    },
    {
      procedure_id: 3,
      procedure_name: "Endoscopy",
      procedure_type: "Minor Procedure",
      base_charge: 8000,
      ot_charges: 3000,
      anesthesia_charge: 2000,
      doctor_fee_default: 5000,
      description: "Diagnostic endoscopic examination",
      status: "Active",
    },
  ];

  const doctorsData = [
    {
      doctor_id: 1,
      name: "Dr. Rajesh Kumar",
      specialization: "General Physician",
      visit_type: "OPD/IPD",
      visit_fee_opd: 500,
      visit_fee_ipd_per_visit: 800,
      consultation_fee_emergency: 1500,
      experience: 15,
      status: "Active",
    },
    {
      doctor_id: 2,
      name: "Dr. Priya Sharma",
      specialization: "Cardiologist",
      visit_type: "OPD/Consultation",
      visit_fee_opd: 1200,
      visit_fee_ipd_per_visit: 2000,
      consultation_fee_emergency: 3000,
      experience: 12,
      status: "Active",
    },
    {
      doctor_id: 3,
      name: "Dr. Amit Patel",
      specialization: "Surgeon",
      visit_type: "Surgery/IPD",
      visit_fee_opd: 1000,
      visit_fee_ipd_per_visit: 1500,
      consultation_fee_emergency: 2500,
      experience: 18,
      status: "Active",
    },
  ];

  const nursingServices = [
    {
      service_id: 1,
      service_name: "Special Nursing Care",
      charge_type: "per_day",
      charge_amount: 2000,
      status: "Active",
    },
    {
      service_id: 2,
      service_name: "Attendant Service",
      charge_type: "per_day",
      charge_amount: 800,
      status: "Active",
    },
    {
      service_id: 3,
      service_name: "Physiotherapy Visit",
      charge_type: "per_visit",
      charge_amount: 600,
      status: "Active",
    },
  ];

  const miscServices = [
    {
      service: "Physiotherapy Session",
      charge: 500,
      status: "Active",
    },
    {
      service: "Ambulance Service",
      charge: 1500,
      status: "Active",
    },
    {
      service: "Wheelchair Charges",
      charge: 200,
      status: "Active",
    },
    {
      service: "Oxygen Cylinder (per day)",
      charge: 800,
      status: "Active",
    },
  ];

  const calculateTotalCost = () => {
    let total = 0;
    if (selectedRoom) {
      total += selectedRoom.charge_per_day * bookingDetails.numberOfDays;
    }
    if (selectedProcedure) {
      total +=
        selectedProcedure.base_charge +
        selectedProcedure.ot_charges +
        selectedProcedure.anesthesia_charge +
        selectedProcedure.doctor_fee_default;
    }
    if (selectedDoctor) {
      total += selectedDoctor.visit_fee_ipd_per_visit;
    }
    return total;
  };

  const tabs = [
    { id: "rooms", label: "Rooms & Boards", icon: Bed },
    { id: "procedures", label: "Procedures", icon: Scissors },
    { id: "doctors", label: "Doctors", icon: Stethoscope },
    { id: "nursing", label: "Nursing", icon: User },
    { id: "misc", label: "Services", icon: Briefcase },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <DollarSign className="w-7 h-7 text-dblue mr-2" />
        Major Expenses & Booking
      </h2>

      {/* Tabs */}
      <div className="flex overflow-x-auto mb-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-dblue border-b-2 border-dblue"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Rooms & Boards Tab */}
      {activeTab === "rooms" && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Available Rooms
            </h3>
            <div className="grid gap-4">
              {roomsData.map((room) => (
                <div
                  key={room.room_id}
                  onClick={() => room.available && setSelectedRoom(room)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRoom?.room_id === room.room_id
                      ? "border-dblue bg-blue-50"
                      : room.available
                      ? "border-gray-200 hover:border-blue-300"
                      : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-3 py-1 bg-dblue text-white text-xs font-semibold rounded-full">
                          {room.room_type}
                        </span>
                        {room.available ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Available
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                            Occupied
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg">
                        {room.room_name}
                      </h4>
                      <p className="text-sm text-gray-600">{room.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-dblue">
                        ₹{room.charge_per_day}
                      </p>
                      <p className="text-xs text-gray-500">per day</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                    <span>📍 {room.floor}</span>
                    <span>👥 Max: {room.max_patients} patients</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          {selectedRoom && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">
                Select Stay Duration
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={bookingDetails.checkInDate}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        checkInDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dblue focus:border-dblue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={bookingDetails.checkOutDate}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        checkOutDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dblue focus:border-dblue"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Days
                </label>
                <input
                  type="number"
                  min="1"
                  value={bookingDetails.numberOfDays}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      numberOfDays: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dblue focus:border-dblue"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Medical Procedures Tab */}
      {activeTab === "procedures" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Medical Procedures
          </h3>
          <div className="grid gap-4">
            {proceduresData.map((procedure) => (
              <div
                key={procedure.procedure_id}
                onClick={() => setSelectedProcedure(procedure)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedProcedure?.procedure_id === procedure.procedure_id
                    ? "border-dblue bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        {procedure.procedure_type}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      {procedure.procedure_name}
                    </h4>
                    <p className="text-sm text-gray-600">{procedure.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">Base Charge</p>
                    <p className="font-bold text-dblue">₹{procedure.base_charge}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">OT Charges</p>
                    <p className="font-bold text-dblue">₹{procedure.ot_charges}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">Anesthesia</p>
                    <p className="font-bold text-dblue">
                      ₹{procedure.anesthesia_charge}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">Doctor Fee</p>
                    <p className="font-bold text-dblue">
                      ₹{procedure.doctor_fee_default}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-right">
                    <span className="text-gray-600">Total: </span>
                    <span className="text-xl font-bold text-dblue">
                      ₹
                      {procedure.base_charge +
                        procedure.ot_charges +
                        procedure.anesthesia_charge +
                        procedure.doctor_fee_default}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctors Tab */}
      {activeTab === "doctors" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Doctor & Specialist Fees
          </h3>
          <div className="grid gap-4">
            {doctorsData.map((doctor) => (
              <div
                key={doctor.doctor_id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedDoctor?.doctor_id === doctor.doctor_id
                    ? "border-dblue bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg">
                      {doctor.name}
                    </h4>
                    <p className="text-dblue font-medium">{doctor.specialization}</p>
                    <p className="text-sm text-gray-600">
                      {doctor.experience} years experience
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <p className="text-gray-600 mb-1">OPD Visit</p>
                    <p className="font-bold text-dblue">₹{doctor.visit_fee_opd}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <p className="text-gray-600 mb-1">IPD Visit</p>
                    <p className="font-bold text-dblue">
                      ₹{doctor.visit_fee_ipd_per_visit}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <p className="text-gray-600 mb-1">Emergency</p>
                    <p className="font-bold text-dblue">
                      ₹{doctor.consultation_fee_emergency}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nursing Services Tab */}
      {activeTab === "nursing" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Nursing & Staff Charges
          </h3>
          <div className="grid gap-3">
            {nursingServices.map((service) => (
              <div
                key={service.service_id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {service.service_name}
                    </h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {service.charge_type.replace("_", " ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-dblue">
                      ₹{service.charge_amount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {service.charge_type === "per_day" ? "per day" : "per visit"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Miscellaneous Services Tab */}
      {activeTab === "misc" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Miscellaneous Services
          </h3>
          <div className="grid gap-3">
            {miscServices.map((service, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-800">{service.service}</h4>
                  <p className="text-xl font-bold text-dblue">₹{service.charge}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Summary */}
      {(selectedRoom || selectedProcedure || selectedDoctor) && (
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-dblue">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" />
            Selected Items Summary
          </h3>
          <div className="space-y-3">
            {selectedRoom && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedRoom.room_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {bookingDetails.numberOfDays} days × ₹
                    {selectedRoom.charge_per_day}
                  </p>
                </div>
                <p className="text-lg font-bold text-dblue">
                  ₹{selectedRoom.charge_per_day * bookingDetails.numberOfDays}
                </p>
              </div>
            )}
            {selectedProcedure && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedProcedure.procedure_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Including OT, Anesthesia & Doctor Fee
                  </p>
                </div>
                <p className="text-lg font-bold text-dblue">
                  ₹
                  {selectedProcedure.base_charge +
                    selectedProcedure.ot_charges +
                    selectedProcedure.anesthesia_charge +
                    selectedProcedure.doctor_fee_default}
                </p>
              </div>
            )}
            {selectedDoctor && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{selectedDoctor.name}</p>
                  <p className="text-sm text-gray-600">IPD Visit Fee</p>
                </div>
                <p className="text-lg font-bold text-dblue">
                  ₹{selectedDoctor.visit_fee_ipd_per_visit}
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-dblue flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">
              Estimated Total:
            </span>
            <span className="text-3xl font-bold text-dblue">
              ₹{calculateTotalCost().toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            * Final charges may vary based on actual services used
          </p>
        </div>
      )}
    </div>
  );
};

const BookHospitalPage = () => {
  const navigate = useNavigate();
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const keypoints = [
    "24/7 Emergency Services",
    "Modern ICU Facilities",
    "Experienced Doctors",
    "Advanced Surgery Rooms",
    "Free Ambulance Service",
    "Insurance Accepted",
    "Digital Health Records",
  ];

  const treatments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
    "ENT",
    "Ophthalmology",
    "Psychiatry",
    "General Surgery",
    "Dental",
    "Urology",
    "Nephrology",
    "Gastroenterology",
    "Oncology",
    "Pulmonology",
    "Emergency Medicine",
    "Radiology",
    "Pathology",
    "Physiotherapy",
    "Anesthesiology",
  ];

  const handleBooking = () => {
    alert("Booking functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="relative">
        <div className="relative h-64">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
            alt="Hospital"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-white text-2xl font-bold mb-2">
              City General Hospital
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= 4 ? "text-yellow-400" : "text-gray-400"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-white ml-2 text-sm">4.5 (2,450 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>


                  {/* Pricing */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Consultation Fee</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-dblue">₹500</span>
                <span className="text-lg text-gray-400 line-through">₹100,000</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">General Consultation</p>
            </div>
            <div className="bg-green-500 text-white px-4 py-2 rounded-full">
              <span className="font-bold">99% OFF</span>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg
                className="w-5 h-5 text-dblue"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Call Now</p>
              <p className="text-sm font-semibold text-gray-800">+91 98765 43210</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Open 24/7</p>
              <p className="text-sm font-semibold text-gray-800">Always Open</p>
            </div>
          </div>
        </div>


                  {/* About */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">About Hospital</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            City General Hospital is a multi-specialty hospital providing comprehensive
            healthcare services. With state-of-the-art facilities and a team of
            experienced doctors, we are committed to delivering quality healthcare to
            our patients. Our hospital is equipped with the latest medical technology
            and offers a wide range of treatments across various specialties.
          </p>
        </div>

        {/* Address */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Location</p>
              <p className="text-sm text-gray-600">
                123 Medical Plaza, Main Road, City Center, State - 110001
              </p>
            </div>
          </div>
        </div>

          {/* Major Expenses Section */}
        <MajorExpensesSection />

        {/* Key Highlights */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Key Highlights</h2>
          <div className="space-y-2">
            {keypoints.map((point, index) => (
              <div key={index} className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-700">{point}</span>
              </div>
            ))}
          </div>
        </div>

      


        {/* Treatments & Specialties */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Treatments & Specialties
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {treatments.map((treatment, index) => (
              <button
                key={index}
                onClick={() => setSelectedTreatment(treatment)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedTreatment === treatment
                    ? "bg-dblue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {treatment}
              </button>
            ))}
          </div>
        </div>

      

        {/* Facilities */}
        <div className="bg-white p-4 rounded-lg shadow mb-20">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Facilities</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-dblue"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600">Parking</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-600">Pharmacy</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-600">Cafeteria</p>
            </div>
          </div>
        </div>

      
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <button
          onClick={handleBooking}
          className="w-full bg-dblue hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors"
        >
          Book Appointment Now
        </button>
      </div>
    </div>
  );
};

export default BookHospitalPage;
