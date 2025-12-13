import { Link } from "react-router-dom";
import React from "react";

const AmbuDetailsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-white">
      {/* Header */}
      <div className="bg-gray-100 p-4 flex items-center">
        <Link to="/ambulance" className="mr-4 text-black">
          <svg
            className="w-6 h-6"
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
        </Link>
        <h1 className="text-xl font-semibold text-black">Basic Life Support</h1>
      </div>

      <div className="p-4">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="bg-white shadow-md w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="bg-dblue w-12 h-12 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-black">Basic Life Support</h2>
          <p className="text-gray-400 mb-4">For non-critical emergencies</p>
          <div className="bg-blue-600 px-6 py-2 rounded-full inline-block">
            <span className="text-white font-semibold">
              Response Time: 10-15 mins
            </span>
          </div>
        </div>

        {/* Service Details Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-black">Service Details</h2>
          <div className="space-y-3">
            <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400">Service Type</p>
                <p className="text-black font-semibold">Basic Life Support</p>
              </div>
            </div>

            <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400">Availability</p>
                <p className="text-black font-semibold">24/7 Available</p>
              </div>
            </div>

            <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400">Coverage Area</p>
                <p className="text-black font-semibold">City-wide coverage</p>
              </div>
            </div>

            <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v-3c0-1.1.9-2 2-2h2V7H9.5C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4h5c.83 0 1.5.67 1.5 1.5S15.33 7 14.5 7H13v2h2c1.1 0 2 .9 2 2v3h3v4H4z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400">Medical Staff</p>
                <p className="text-black font-semibold">Professional EMTs</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Included Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-black">What's Included</h2>
          <div className="bg-white shadow-md p-4 rounded-lg space-y-3">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-green-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-black">Professional Medical Staff</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-green-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-black">Basic Medical Equipment</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-green-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-black">GPS Tracking</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-green-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-black">Emergency Contact Support</span>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-black">Pricing</h2>
          <div className="bg-white shadow-md border border-blue-600 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 mr-2 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400">Base Price</p>
                <p className="text-2xl font-bold text-blue-400">₹500</p>
              </div>
            </div>

            <div className="border-t border-gray-600 pt-4">
              <h3 className="font-semibold mb-3 text-black">Additional Charges:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black">Distance Cost</span>
                  <span className="text-black">₹10/km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Emergency Fee</span>
                  <span className="text-black">₹200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Night Charges</span>
                  <span className="text-black">₹100</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            * Final price calculated based on distance and emergency type
          </p>
        </div>

        {/* Emergency Information Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-black">Emergency Information</h2>
          <div className="bg-red-900 border border-red-600 p-4 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 mr-3 text-red-500 mt-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-400 mb-2">
                  Emergency Response
                </h3>
                <p className="text-sm text-gray-300">
                  This service is designed for emergency situations. Response
                  time may vary based on location and traffic conditions. For
                  immediate medical emergencies, call 108.
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/ambulance/AmbuDetails/AmbuBooking"
            className="bg-dblue mt-4 text center flex justify-center items-center py-3 rounded-xl text-xl font-semibold"
          >
            CONFIRM
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AmbuDetailsPage;
