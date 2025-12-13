import { Link } from "react-router-dom";
import React, { useState } from "react";

const AmbuBookingPage = () => {
  const [selectedService, setSelectedService] = useState("Basic Life Support");

  const services = [
    {
      name: "Basic Life Support",
      basePrice: "₹500",
      pricePerKm: "₹10",
    },
    {
      name: "Advanced Life Support",
      basePrice: "₹1200",
      pricePerKm: "₹10",
    },
    {
      name: "Long Distance Transfer",
      basePrice: "₹2000",
      pricePerKm: "₹10",
    },
    {
      name: "Elderly Care Transport",
      basePrice: "₹600",
      pricePerKm: "₹10",
    },
    {
      name: "Neonatal Transport",
      basePrice: "₹1500",
      pricePerKm: "₹10",
    },
    {
      name: "Airport Transfer",
      basePrice: "₹1800",
      pricePerKm: "₹10",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-white">
      {/* Header */}
      <div className="bg-dblue p-4 flex items-center">
        <Link to="/ambulance/AmbuDetails" className="mr-4">
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
        <h1 className="text-xl font-semibold">Book Ambulance</h1>
      </div>

      <div className="p-4">
        {/* Location Details Section */}
        <div className="bg-white shadow-md p-4 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <svg
              className="w-5 h-5 mr-2 text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <h2 className="text-lg font-semibold text-black">Location Details</h2>
          </div>

          <div className="space-y-3">
            <div className="bg-white shadow-md p-3  border border-dblue rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-black">Pickup Location</span>
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

            <div className="bg-white shadow-md p-3 border border-dblue rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-black">Destination</span>
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

        {/* Select Service Section */}
        <div className="bg-white shadow-md p-4 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <svg
              className="w-5 h-5 mr-2 text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
            <h2 className="text-lg font-semibold text-black">Select Service</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => setSelectedService(service.name)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedService === service.name
                    ? "bg-dblue border border-blue-500"
                    : "bg-white shadow-md border border-gray-600 text-black"
                }`}
              >
                <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
                <p
                  className={`text-xs ${
                    selectedService === service.name ? "text-white" : "text-black"
                  }`}
                >
                  Base price: {service.basePrice}
                </p>
                <p
                  className={`text-xs ${
                    selectedService === service.name ? "text-white" : "text-black"
                  }`}
                >
                  Price / Km: {service.pricePerKm}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <button className="w-full bg-dblue text-white py-4 rounded-lg font-semibold text-lg">
          Select Locations to Continue
        </button>
      </div>
    </div>
  );
};

export default AmbuBookingPage;
