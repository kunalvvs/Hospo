import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  ChevronRight,
  User,
  Video,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { FaStethoscope, FaRegUser, FaUserAlt, FaUserSecret } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { MdOutlineCreditCard } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { doctorAPI, appointmentAPI, getUserData } from "../services/api";

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [consultationType, setConsultationType] = useState("in-person");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("Morning");
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [booking, setBooking] = useState("myself");
  const [paymentMode, setPaymentMode] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  
  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);
  
  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getDoctorById(id);
      
      if (response.success && response.doctor) {
        setDoctor(response.doctor);
        console.log('✅ Fetched doctor for booking:', response.doctor);
      }
    } catch (error) {
      console.error('Failed to fetch doctor details:', error);
      alert('Failed to load doctor details. Please try again.');
      navigate('/doctors');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = {
    Morning: [
      { time: "09:00", available: true },
      { time: "09:30", available: true },
      { time: "10:00", available: false },
      { time: "10:30", available: true },
      { time: "11:00", available: true },
      { time: "11:30", available: true },
    ],
    Afternoon: [
      { time: "12:00", available: true },
      { time: "12:30", available: false },
      { time: "01:00", available: true },
      { time: "01:30", available: true },
      { time: "02:00", available: true },
      { time: "02:30", available: true },
    ],
    Evening: [
      { time: "05:00", available: true },
      { time: "05:30", available: true },
      { time: "06:00", available: true },
      { time: "06:30", available: false },
      { time: "07:00", available: true },
      { time: "07:30", available: true },
    ],
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPast = date < today;
      days.push({ date, day, isPast });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };
  
  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    
    try {
      setSubmitting(true);
      const userData = getUserData();
      
      if (!userData) {
        alert('Please login to book appointment');
        navigate('/login');
        return;
      }
      
      const appointmentData = {
        doctorId: id, // Backend expects 'doctorId', not 'doctor'
        appointmentDate: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`, // Format without timezone conversion
        appointmentTime: selectedTime,
        consultationType: consultationType === 'in-person' ? 'In-Person' : 'Video',
        bookingFor: booking === 'myself' ? 'Self' : 'Someone Else',
        paymentMode: paymentMode === 'cod' ? 'Cash' : paymentMode === 'online' ? 'Online' : 'Card',
        symptoms: '',
        notes: ''
      };
      
      console.log('📤 Booking appointment with data:', appointmentData);
      
      const response = await appointmentAPI.bookAppointment(appointmentData);
      
      if (response.success) {
        alert('Appointment booked successfully!');
        navigate('/my-appointments');
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const calculateFees = () => {
    return doctor?.consultationFee || 500;
  };
  
  const calculateGST = () => {
    return Math.round(calculateFees() * 0.18);
  };
  
  const calculateTotal = () => {
    return calculateFees() + calculateGST();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Doctor not found</p>
          <button
            onClick={() => navigate('/doctors')}
            className="text-blue-600 hover:underline"
          >
            Back to Doctors List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black pb-6 px-4">
      {/* Header */}
      <div className="bg-gray-100 p-4 pt-8 flex items-center gap-4">
        <button 
          onClick={() => navigate(`/doctors/${id}`)}
          className="text-black"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Book Appointment</h1>
      </div>

      {/* Doctor Info Card */}
      <div className="mb-6">
        <div className="bg-white shadow-md rounded-2xl p-4 flex gap-4">
          {/* Doctor Image */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaStethoscope className="w-12 h-12 text-white" />
          </div>

          {/* Doctor Details */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1 text-black">{doctor.name}</h2>
            <p className="text-gray-400 text-sm mb-1 flex items-center gap-1">
              <span>🏥</span> {doctor.primarySpecialization || 'General Physician'}
            </p>
            <p className="text-pink-400 text-sm font-medium mb-2">
              {doctor.experience || 0} Year Experience
            </p>
            <p className="text-teal-400 text-lg font-semibold">₹{doctor.consultationFee || 500}</p>
          </div>
        </div>
      </div>

      {/* Hospital/Clinic */}
      <div className="mb-6">
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 border border-gray-300 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-gray-700 text-sm">Hospital/Clinic</h3>
              <p className="text-black font-medium ">{doctor.clinicHospitalName || 'Private Practice'}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Consultation Type */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3">Consultation Type</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setConsultationType("in-person")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
              consultationType === "in-person"
                ? "bg-dblue text-white"
                : "bg-white text-black shadow-md"
            }`}
          >
            <User className="w-5 h-5" />
            In-Person
          </button>
          <button
            onClick={() => setConsultationType("video")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
              consultationType === "video"
                ? "bg-dblue text-white"
                : "bg-white text-black shadow-md"
            }`}
          >
            <Video className="w-5 h-5" />
            Video
          </button>
        </div>
      </div>

      {/* Select Date & Time */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-black" />
          Select Date & Time
        </h3>

        {/* Calendar */}
        <div className="bg-white shadow-md rounded-2xl p-4 mb-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <h4 className="text-lg font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-gray-500 font-medium py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayObj, idx) => {
              if (!dayObj) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const isSelected = isSameDate(selectedDate, dayObj.date);
              const isToday = isSameDate(new Date(), dayObj.date);

              return (
                <button
                  key={idx}
                  onClick={() => !dayObj.isPast && setSelectedDate(dayObj.date)}
                  disabled={dayObj.isPast}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    dayObj.isPast
                      ? "text-gray-600 cursor-not-allowed"
                      : isSelected
                      ? "bg-dblue text-white shadow-lg shadow-blue-500/50 scale-105"
                      : isToday
                      ? "bg-gray-200 text-black border border-gray-300"
                      : "bg-gray-200 text-black border border-gray-300"
                  }`}
                >
                  {dayObj.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="bg-blue-100 border border-blue-300 text-dblue rounded-xl p-3 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-dblue" />
            <span className="text-sm">
              Selected:{" "}
              <span className="font-semibold">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </span>
          </div>
        )}

        {/* Period Selection */}
        {selectedDate && (
          <>
            <h4 className="text-base font-semibold mb-3 mt-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Available Time Slots
            </h4>
            <div className="flex gap-3 mb-4">
              {["Morning", "Afternoon", "Evening"].map((period) => {
                return (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setSelectedTime(null);
                    }}
                    className={`flex-1 py-3 px-2 rounded-xl font-medium transition-all ${
                      selectedPeriod === period
                        ? "bg-dblue text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-200 text-black border-black"
                    }`}
                  >
                    <div className="text-sm">{period}</div>
                  </button>
                );
              })}
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-3 gap-3">
              {timeSlots[selectedPeriod].map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    !slot.available
                      ? "bg-white text-black cursor-not-allowed line-through"
                      : selectedTime === slot.time
                      ? "bg-dblue text-white border-2 border-blue-400 shadow-lg shadow-blue-500/30"
                      : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col bg-white shadow-md rounded-2xl p-4 mb-4">
        <div className="flex flex-row">
          <div className="text-black mr-2 flex justify-center items-center text-lg">
            <FaRegUser />
          </div>
          <div className="font-bold text-lg">Booking For</div>
        </div>
        <div className="flex flex-row mt-5 gap-2">
          <div
            onClick={() => setBooking("myself")}
            className={`flex flex-row justify-center items-center rounded-3xl p-4 border border-blue-500 cursor-pointer ${
              booking === "myself" ? "bg-dblue text-white border border-dblue" : ""
            }`}
          >
            <div className="mr-2">
              <FaUserAlt />
            </div>
            <div>Myself</div>
          </div>
          <div
            onClick={() => setBooking("other")}
            className={`flex flex-row justify-center items-center rounded-3xl p-4 border border-blue-500 cursor-pointer ${
              booking === "other" ? "bg-dblue text-white" : ""
            }`}
          >
            <div className="mr-2">
              <FaUserSecret />
            </div>
            <div>Someone Else</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white shadow-md rounded-2xl p-4 mb-4">
        <div className="flex flex-row">
          <div className="text-dblue mr-2 flex justify-center items-center text-lg">
            <FaRegUser />
          </div>
          <div className="font-bold text-lg">Payment Mode</div>
        </div>
        <div className="flex flex-row mt-5 flex-wrap gap-2">
          <div
            onClick={() => setPaymentMode("razor")}
            className={`flex flex-row justify-center items-center rounded-3xl p-4 border border-blue-500 cursor-pointer ${
              paymentMode === "razor" ? "bg-dblue text-white" : ""
            }`}
          >
            <div className="mr-2">
              <CiCreditCard1 />
            </div>
            <div>Razor Pay</div>
          </div>
          <div
            onClick={() => setPaymentMode("indian")}
            className={`flex flex-row justify-center items-center rounded-3xl p-4 border border-blue-500 cursor-pointer ${
              paymentMode === "indian" ? "bg-dblue text-white" : ""
            }`}
          >
            <div className="mr-2">
              <MdOutlineCreditCard />
            </div>
            <div>Indian Pay</div>
          </div>
          <div
            onClick={() => setPaymentMode("cod")}
            className={`flex flex-row justify-center items-center rounded-3xl p-4 border border-blue-500 cursor-pointer ${
              paymentMode === "cod" ? "bg-dblue text-white" : ""
            }`}
          >
            <div className="mr-2">
              <BsCash />
            </div>
            <div>Cash on Delivery</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white shadow-md rounded-2xl p-4 mb-4">
        <div className="flex flex-row gap-2">
          <div className="w-full flex justify-center items-center ">
            <input
              type="text"
              placeholder="You have a coupon?"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full h-full rounded-xl p-2 border border-gray-300 focus:ring-0 outline-none transition-colors duration-300"
            />
          </div>
          <div className="bg-dblue text-white px-3 py-2 rounded-2xl cursor-pointer">Apply</div>
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-2xl shadow-md p-4 mb-4 gap-2">
        <div className="text-xl font-bold">Pricing Breakdown</div>
        <div className="flex flex-row justify-between">
          <div>Fees</div>
          <div>₹{calculateFees()}</div>
        </div>
        <div className="flex flex-row justify-between">
          <div>GST (18%)</div>
          <div>₹{calculateGST()}</div>
        </div>
        <div className="border border-gray-300" />
        <div className="flex flex-row justify-between">
          <div>Payable Amount</div>
          <div>₹{calculateTotal()}</div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="px-4 mt-8 pb-8">
        <button
          onClick={handleConfirmBooking}
          disabled={!selectedDate || !selectedTime || submitting}
          className={`w-full font-semibold py-4 rounded-xl transition-all ${
            selectedDate && selectedTime && !submitting
              ? "bg-dblue text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {submitting 
            ? "Booking..." 
            : selectedDate && selectedTime
            ? "Confirm Appointment"
            : "Please select date and time"}
        </button>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
