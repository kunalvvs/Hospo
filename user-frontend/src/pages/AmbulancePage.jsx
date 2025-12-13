import React from "react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const AmbulancePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-white pb-20">
      {/* Header */}
      <div className="bg-dblue p-4 pt-8 sticky top-0 z-10">
        <Header title="Ambulance" />

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for doctors, specializations..."
            className="w-full bg-white text-black rounded-lg pl-12 pr-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="p-4">
        {/* Quick Services */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Quick Services
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white shadow-md p-4 rounded-lg text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <p className="text-sm text-black">Hospital Transfer</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded-lg text-center">
              <div className="bg-red-600 w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 8h2v8H4V8zm4-1h2v10H8V7zm4-3h2v14h-2V4z" />
                </svg>
              </div>
              <p className="text-sm text-black">Medical Emergency</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded-lg text-center">
              <div className="bg-green-600 w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
              <p className="text-sm text-black">Airport Transfer</p>
            </div>
          </div>
        </div>

        {/* Location Selection */}
        <div className="bg-white shadow-md p-4 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <svg
              className="w-5 h-5 mr-2 text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-black">
              Location Selection
            </h3>
          </div>

          <div className="space-y-3">
            <div className="bg-dblue p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-400">Pickup Location</p>
                  <p className="text-sm">Select pickup location</p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            <div className="bg-dblue p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-400">Destination</p>
                  <p className="text-sm">Select destination</p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Ambulance Services */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">
              Ambulance Services
            </h2>
            <button className="text-blue-400 text-sm">View All</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Basic Life Support */}
            <Link
              to="/ambulance/basic-life-support"
              className="bg-blue-50 border-2 border-blue-200 shadow-md p-4 rounded-lg hover:border-blue-400 transition-all"
            >
              <div className="bg-blue-600 w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 8h2v8H4V8zm4-1h2v10H8V7zm4-3h2v14h-2V4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-center text-black mb-1">
                Basic Life Support
              </h3>
              <p className="text-xs text-gray-600 text-center mb-3">
                For non-critical emergencies
              </p>
              <div className="flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">₹500</span>
                <svg
                  className="w-4 h-4 ml-2 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>

            {/* Advanced Life Support */}
            <Link
              to="/ambulance/advanced-life-support"
              className="bg-red-50 border-2 border-red-200 shadow-md p-4 rounded-lg hover:border-red-400 transition-all"
            >
              <div className="bg-red-600 w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-center text-black mb-1">
                Advanced Life Support
              </h3>
              <p className="text-xs text-gray-600 text-center mb-3">
                For critical emergencies
              </p>
              <div className="flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">₹1200</span>
                <svg
                  className="w-4 h-4 ml-2 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>

            {/* Long Distance Transfer */}
            <Link
              to="/ambulance/long-distance-transfer"
              className="bg-green-50 border-2 border-green-200 shadow-md p-4 rounded-lg hover:border-green-400 transition-all"
            >
              <div className="bg-green-600 w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-center text-black mb-1">
                Long Distance Transfer
              </h3>
              <p className="text-xs text-gray-600 text-center mb-3">
                Inter-city transfers
              </p>
              <div className="flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">₹2000</span>
                <svg
                  className="w-4 h-4 ml-2 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>

            {/* Elderly Care Transport */}
            <Link
              to="/ambulance/elderly-care-transport"
              className="bg-orange-50 border-2 border-orange-300 shadow-md p-4 rounded-lg hover:border-orange-400 transition-all"
            >
              <div className="bg-orange-500 w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-center text-black mb-1">
                Elderly Care Transport
              </h3>
              <p className="text-xs text-gray-600 text-center mb-3">
                Specialized elderly transport
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-orange-600 font-bold text-lg">₹800</span>
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>

            {/* Neonatal Transport */}
            <Link
              to="/ambulance/neonatal-transport"
              className="bg-pink-50 border-2 border-pink-200 shadow-md p-4 rounded-lg hover:border-pink-400 transition-all"
            >
              <div className="bg-pink-500 w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-center text-black mb-1">
                Neonatal Transport
              </h3>
              <p className="text-xs text-gray-600 text-center mb-3">
                Specialized baby transport
              </p>
              <div className="flex items-center justify-center">
                <span className="text-pink-600 font-bold text-lg">₹1500</span>
                <svg
                  className="w-4 h-4 ml-2 text-pink-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>

            {/* Airport Transfer */}
            <Link
              to="/ambulance/airport-transfer"
              className="bg-purple-50 border-2 border-purple-200 shadow-md p-4 rounded-lg hover:border-purple-400 transition-all"
            >
              <div className="bg-purple-600 w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-center text-black mb-1">
                Airport Transfer
              </h3>
              <p className="text-xs text-gray-600 text-center mb-3">
                Airport to hospital transfer
              </p>
              <div className="flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">₹1800</span>
                <svg
                  className="w-4 h-4 ml-2 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div>
        <BottomNav />
      </div>
    </div>
  );
};

export default AmbulancePage;
