import React, { useState } from "react";
import { ArrowLeft, Check, Calendar, Clock, User, Users, CreditCard, Wallet, Droplet, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { BsFillBuildingsFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

const BookTestPage = () => {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingFor, setBookingFor] = useState("myself");
  const [paymentMode, setPaymentMode] = useState("");
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
  });

  const availableTests = [
    {
      id: 1,
      name: "Complete Blood Count",
      price: "₹599",
      duration: "24 hours",
      icon: Droplet,
      color: "text-red-400",
    },
    {
      id: 2,
      name: "Diabetes Screening",
      price: "₹299",
      duration: "6 hours",
      icon: Heart,
      color: "text-green-400",
    },
    {
      id: 3,
      name: "Liver Function Test",
      price: "₹799",
      duration: "12 hours",
      icon: Star,
      color: "text-blue-400",
    },
    {
      id: 4,
      name: "Thyroid Profile",
      price: "₹499",
      duration: "24 hours",
      icon: User,
      color: "text-yellow-400",
    },
    {
      id: 5,
      name: "Kidney Function Test",
      price: "₹699",
      duration: "18 hours",
      icon: Droplet,
      color: "text-purple-400",
    },
    {
      id: 6,
      name: "Lipid Profile",
      price: "₹549",
      duration: "12 hours",
      icon: Heart,
      color: "text-pink-400",
    },
  ];

  const nearbyLabs = [
    {
      id: 1,
      name: "HealthCare Diagnostics",
      rating: 4.8,
      reviews: 245,
      distance: "1.2 Km",
      address: "Sector 18, Noida",
    },
    {
      id: 2,
      name: "BrainCare Diagnostics",
      rating: 4.6,
      reviews: 189,
      distance: "2.5 Km",
      address: "Sarita Vihar, Delhi",
    },
    {
      id: 3,
      name: "MediLab Centre",
      rating: 4.7,
      reviews: 312,
      distance: "3.1 Km",
      address: "Lajpat Nagar, Delhi",
    },
    {
      id: 4,
      name: "CityPath Laboratory",
      rating: 4.5,
      reviews: 156,
      distance: "1.8 Km",
      address: "Greater Kailash, Delhi",
    },
  ];

  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const paymentModes = [
    { id: "razorpay", name: "Razorpay", icon: CreditCard },
    { id: "cod", name: "Cash on Delivery", icon: Wallet },
  ];

  const handleBookingForChange = (value) => {
    setBookingFor(value);
    if (value === "someone") {
      setShowProfileDetails(true);
    } else {
      setShowProfileDetails(false);
    }
  };

  const handleProfileDetailsChange = (field, value) => {
    setProfileDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookTest = () => {
    if (!selectedTest || !selectedLab || !selectedDate || !selectedTime || !paymentMode) {
      alert("Please fill all required fields");
      return;
    }
    if (bookingFor === "someone" && (!profileDetails.name || !profileDetails.age || !profileDetails.gender || !profileDetails.phone)) {
      alert("Please fill patient details");
      return;
    }
    // Handle booking logic here
    alert("Test booked successfully!");
    navigate("/pathlab");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-dblue p-4 pt-8 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-white">Book Test</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Select Test Section */}
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-black mb-2">Select Test</h2>
          <p className="text-sm text-gray-500 mb-4">Choose a test from the list below</p>
          <div className="space-y-3">
            {availableTests.map((test) => {
              const Icon = test.icon;
              return (
                <button
                  key={test.id}
                  onClick={() => setSelectedTest(test.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedTest === test.id
                      ? "border-dblue bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${test.color}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-black text-sm">{test.name}</p>
                        <p className="text-xs text-gray-500">Results in {test.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-dblue font-semibold">{test.price}</span>
                      {selectedTest === test.id && (
                        <div className="w-6 h-6 bg-dblue rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Lab Section */}
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-black mb-2">Select Lab</h2>
          <p className="text-sm text-gray-500 mb-4">Choose a lab from nearby options</p>
          <div className="space-y-3">
            {nearbyLabs.map((lab) => (
              <button
                key={lab.id}
                onClick={() => setSelectedLab(lab.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedLab === lab.id
                    ? "border-dblue bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BsFillBuildingsFill className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-black text-sm">{lab.name}</h3>
                      {selectedLab === lab.id && (
                        <div className="w-6 h-6 bg-dblue rounded-full flex items-center justify-center ml-2">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{lab.address}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-black font-medium">{lab.rating}</span>
                        <span className="text-gray-500">({lab.reviews} reviews)</span>
                      </div>
                      <div className="text-gray-600">• {lab.distance}</div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Appointment Section */}
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-black mb-2">Schedule Appointment</h2>
          <p className="text-sm text-gray-500 mb-4">Select your preferred date and time</p>
          
          {/* Date Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-dblue focus:outline-none text-black"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Select Time Slot
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? "bg-dblue text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking For Section */}
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-black mb-2">Booking For</h2>
          <p className="text-sm text-gray-500 mb-4">Who is this test for?</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => handleBookingForChange("myself")}
              className={`p-4 rounded-xl border-2 transition-all ${
                bookingFor === "myself"
                  ? "border-dblue bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <User className={`w-6 h-6 mx-auto mb-2 ${bookingFor === "myself" ? "text-dblue" : "text-gray-400"}`} />
              <p className="text-sm font-medium text-black">Myself</p>
            </button>
            <button
              onClick={() => handleBookingForChange("someone")}
              className={`p-4 rounded-xl border-2 transition-all ${
                bookingFor === "someone"
                  ? "border-dblue bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Users className={`w-6 h-6 mx-auto mb-2 ${bookingFor === "someone" ? "text-dblue" : "text-gray-400"}`} />
              <p className="text-sm font-medium text-black">Someone Else</p>
            </button>
          </div>

          {/* Profile Details for Someone Else */}
          {showProfileDetails && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-sm font-semibold text-black mb-3">Patient Details</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={profileDetails.name}
                onChange={(e) => handleProfileDetailsChange("name", e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-dblue focus:outline-none text-black placeholder-gray-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Age"
                  value={profileDetails.age}
                  onChange={(e) => handleProfileDetailsChange("age", e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-dblue focus:outline-none text-black placeholder-gray-400"
                />
                <select
                  value={profileDetails.gender}
                  onChange={(e) => handleProfileDetailsChange("gender", e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-dblue focus:outline-none text-black"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={profileDetails.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    handleProfileDetailsChange("phone", value);
                  }
                }}
                maxLength="10"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-dblue focus:outline-none text-black placeholder-gray-400"
              />
            </div>
          )}
        </div>

        {/* Payment Mode Section */}
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-black mb-2">Payment Mode</h2>
          <p className="text-sm text-gray-500 mb-4">Choose your payment method</p>
          
          <div className="space-y-3">
            {paymentModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setPaymentMode(mode.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    paymentMode === mode.id
                      ? "border-dblue bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${paymentMode === mode.id ? "bg-dblue" : "bg-gray-100"} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${paymentMode === mode.id ? "text-white" : "text-gray-600"}`} />
                      </div>
                      <span className="font-medium text-black">{mode.name}</span>
                    </div>
                    {paymentMode === mode.id && (
                      <div className="w-6 h-6 bg-dblue rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Book Test Button */}
        <button
          onClick={handleBookTest}
          className="w-full bg-dblue text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          Book Test Slot
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default BookTestPage;
