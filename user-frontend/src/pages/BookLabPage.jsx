import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Navigation,
  Clock,
  Phone,
  MapPin,
  FileText,
  Calendar,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

const BookLabPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("13/11/2025");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");

  const labData = {
    name: "Lab Name",
    rating: 4.5,
    reviews: 150,
    distance: "1.2 km",
    status: "Open",
    workingHours: "8:00 AM - 8:00 PM",
    contact: "+91 98765 43210",
    address: "123, Health Street, Medical District, City - 123456",
    reportTime: "Available within 24-48 hours",
    tests: [
      {
        id: 1,
        name: "Complete Blood Count",
        duration: "24 hours",
        price: 599,
        icon: "🩸",
        bgColor: "bg-red-50",
      },
      {
        id: 2,
        name: "Diabetes Screening",
        duration: "6 hours",
        price: 299,
        icon: "💚",
        bgColor: "bg-green-50",
      },
      {
        id: 3,
        name: "Liver Function Test",
        duration: "24 hours",
        price: 799,
        icon: "⭐",
        bgColor: "bg-blue-50",
      },
      {
        id: 4,
        name: "Thyroid Profile",
        duration: "24 hours",
        price: 499,
        icon: "🔆",
        bgColor: "bg-yellow-50",
      },
      {
        id: 5,
        name: "Kidney Function Test",
        duration: "24 hours",
        price: 699,
        icon: "🔺",
        bgColor: "bg-purple-50",
      },
      {
        id: 6,
        name: "Lipid Profile",
        duration: "12 hours",
        price: 399,
        icon: "💙",
        bgColor: "bg-cyan-50",
      },
    ],
  };

  const handleBookTest = (test) => {
    console.log(`Booking test: ${test.name}`);
    // Add booking logic here
  };

  const handleBookSlot = () => {
    console.log(`Booking slot for ${selectedDate} at ${selectedTime}`);
    // Add slot booking logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full mr-4 "
          >
            <ArrowLeft className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-lg font-semibold text-black">Lab Details</h1>
        </div>
      </div>

      {/* Lab Header Card */}
      <div className="bg-blue-600 text-white p-8">
        <div className="flex flex-col items-center">
          {/* Lab Icon */}
          <div className="w-24 h-24 bg-blue-400 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-4xl">🏥</span>
          </div>

          {/* Lab Name */}
          <h2 className="text-2xl font-bold mb-3">{labData.name}</h2>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
              {labData.rating} ({labData.reviews} reviews)
            </span>
          </div>

          {/* Distance and Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Navigation className="w-4 h-4" />
              <span>{labData.distance}</span>
            </div>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
              {labData.status}
            </span>
          </div>
        </div>
      </div>

      {/* Lab Information */}
      <div className="bg-white m-4 rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold mb-6 text-black">Lab Information</h3>

        {/* Working Hours */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Working Hours</p>
            <p className="font-semibold text-gray-900">
              {labData.workingHours}
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Contact</p>
            <p className="font-semibold text-gray-900">{labData.contact}</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Address</p>
            <p className="font-semibold text-gray-900">{labData.address}</p>
          </div>
        </div>

        {/* Reports */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Reports</p>
            <p className="font-semibold text-gray-900">{labData.reportTime}</p>
          </div>
        </div>
      </div>

      {/* Available Tests */}
      <div className="px-4 mb-6">
        <h3 className="text-xl font-bold mb-4 text-black">Available Tests</h3>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {labData.tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              {/* Test Icon */}
              <div
                className={`w-full h-16 ${test.bgColor} rounded-2xl flex items-center justify-center mb-4`}
              >
                <span className="text-3xl">{test.icon}</span>
              </div>

              {/* Test Name */}
              <h4 className="font-semibold text-gray-900 mb-2">{test.name}</h4>

              {/* Duration */}
              <div className="flex items-center space-x-1 text-gray-500 text-sm mb-4">
                <Clock className="w-4 h-4" />
                <span>{test.duration}</span>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold text-blue-600 mb-2">
                ₹{test.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Booking Section */}
      <div className="px-4 mb-6">
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl">🚀</span>
            <h3 className="text-xl font-bold text-gray-900">Quick Booking</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Date Picker */}
            <div className="bg-white rounded-xl p-4 flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 outline-none font-medium text-gray-900"
                placeholder="Select date"
              />
            </div>

            {/* Time Picker */}
            <div className="bg-white rounded-xl p-4 flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <input
                type="text"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="flex-1 outline-none font-medium text-gray-900"
                placeholder="Select time"
              />
            </div>
          </div>

          {/* Book Test Slot Button */}
          <button
            onClick={handleBookSlot}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Book test slot
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default BookLabPage;
