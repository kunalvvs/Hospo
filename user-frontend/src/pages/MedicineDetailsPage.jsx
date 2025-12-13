import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Pill, Clock, Shield, Info } from "lucide-react";

const MedicineDetailsPage = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const medicine = {
    name: "Paracetamol",
    genericName: "Acetaminophen",
    strength: "500mg",
    manufacturer: "Apollo Pharmacy",
    price: 30,
    originalPrice: 50,
    discount: 40,
    rating: 4.5,
    reviews: 1250,
    inStock: true,
    prescriptionRequired: false,
    form: "Tablet",
    packSize: "Strip of 10 tablets",
    expiryDate: "Dec 2025",
    usage: "Pain relief and fever reduction",
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${medicine.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
          <h1 className="text-lg font-semibold text-gray-800">Medicine Details</h1>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div className="bg-white p-8 flex items-center justify-center">
        <div className="w-48 h-48 bg-blue-50 rounded-lg flex items-center justify-center">
          <Pill className="w-24 h-24 text-dblue" />
        </div>
      </div>

      {/* Medicine Info */}
      <div className="bg-white p-4 mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {medicine.name}
            </h2>
            <p className="text-sm text-gray-500 mb-1">{medicine.genericName}</p>
            <p className="text-sm text-gray-600">
              {medicine.strength} | {medicine.form}
            </p>
          </div>
          {!medicine.prescriptionRequired && (
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              No Rx Required
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-semibold text-gray-800">
              {medicine.rating}
            </span>
            <span className="ml-1 text-sm text-gray-500">
              ({medicine.reviews} reviews)
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              medicine.inStock
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {medicine.inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        <div className="flex items-baseline space-x-3 mb-2">
          <span className="text-3xl font-bold text-dblue">₹{medicine.price}</span>
          <span className="text-lg text-gray-400 line-through">
            ₹{medicine.originalPrice}
          </span>
          <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
            {medicine.discount}% OFF
          </span>
        </div>

        <p className="text-sm text-gray-500">
          By {medicine.manufacturer} | {medicine.packSize}
        </p>
      </div>

      {/* Product Details */}
      <div className="bg-white p-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Product Details</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Info className="w-5 h-5 text-dblue" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Usage</p>
              <p className="text-sm text-gray-600">{medicine.usage}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Form</p>
              <p className="text-sm text-gray-600">{medicine.form}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Expiry Date</p>
              <p className="text-sm text-gray-600">{medicine.expiryDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dosage Information */}
      <div className="bg-white p-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          Dosage Information
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                General Instructions
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Take as directed by your healthcare provider</li>
                <li>Do not exceed recommended dosage</li>
                <li>Can be taken with or without food</li>
                <li>Store in a cool, dry place</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Side Effects */}
      <div className="bg-white p-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Common Side Effects</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">
            Most side effects are mild and temporary. Consult your doctor if any
            persist:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Nausea</li>
            <li>Stomach upset</li>
            <li>Allergic reactions (rare)</li>
          </ul>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-white p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-dblue mb-2">Important Note</h4>
          <p className="text-sm text-gray-600">
            This information is for reference only. Always consult your healthcare
            provider before starting any new medication. Keep medicines out of reach
            of children.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-700">Quantity:</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                quantity <= 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-dblue text-white hover:bg-blue-700"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="text-xl font-bold text-gray-800 w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 10}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                quantity >= 10
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-dblue text-white hover:bg-blue-700"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-dblue">
              ₹{medicine.price * quantity}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!medicine.inStock}
            className={`flex-1 py-4 rounded-xl font-bold transition-colors ${
              medicine.inStock
                ? "bg-dblue text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {medicine.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailsPage;
