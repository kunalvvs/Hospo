import React, { useState } from "react";
import Header from "@/components/Header";
import { Search } from "lucide-react";
import { IoBagAddSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { FaPersonDress } from "react-icons/fa6";
import { Link } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const ChemistPage = () => {
  const medicines = [
    {
      name: "Analgesics",
      price: "₹30",
      discount: "15% OFF",
      image: "/med1.jpg",
      link: "/chemist/medicine",
    },
    {
      name: "Antipyretics",
      price: "₹80",
      discount: "12% OFF",
      image: "/med2.jpg",
      link: "/chemist/medicine",
    },
    {
      name: "Antibiotics",
      price: "₹120",
      discount: "20% OFF",
      image: "/med3.jpg",
      link: "/chemist/medicine",
    },
    {
      name: "Antivirals",
      price: "₹60",
      discount: "14% OFF",
      image: "/med4.jpg",
      link: "/chemist/medicine",
    },
    {
      name: "Antifungals",
      price: "₹45",
      discount: "10% OFF",
      image: "/med5.jpg",
      link: "/chemist/medicine",
    },
    {
      name: "Antiseptics",
      price: "₹90",
      discount: "18% OFF",
      image: "/med6.jpg",
      link: "/chemist/medicine",
    },
  ];

  const categories = [
    {
      id: 1,
      title: "Medicines",
      subtitle: "Prescription & OTC",
      icons: <IoBagAddSharp />,
      iconbg: "bg-blue-600/10 text-blue-600",
    },
    {
      id: 2,
      title: "Health Care",
      subtitle: "Supplements and Vitamins",
      icons: <FaHeart />,
      iconbg: "bg-green-600/10 text-green-600",
    },
    {
      id: 3,
      title: "Baby Care",
      subtitle: "Diapers And Products",
      icons: <IoPeopleSharp />,
      iconbg: "bg-pink-600/10 text-pink-600",
    },
    {
      id: 4,
      title: "Personal Care",
      subtitle: "Hygiene and Beauty",
      icons: <FaPersonDress />,
      iconbg: "bg-orange-600/10 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-dblue p-4 pt-8 sticky top-0 z-10">
        <Header title="Chemist" />

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for medicines, tablets, or syrups..."
            className="w-full bg-white text-black rounded-lg pl-12 pr-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6 mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-xl shadow-sm flex items-center hover:shadow-md transition-all duration-200"
            >
              <div
                className={`${item.iconbg} w-12 h-12 flex items-center justify-center rounded-full text-xl mr-3 flex-shrink-0`}
              >
                {item.icons}
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Medicines / Featured Medicines */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">All Medicines</h2>
          <button className="text-blue-600 text-sm flex items-center">
            View All
            <svg
              className="w-4 h-4 ml-1"
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
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {medicines.map((medicine, index) => (
            <Link to={medicine.link} key={index} className="bg-white rounded-lg p-3">
              <button className="absolute mt-2 ml-2">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <div className="bg-gray-100 rounded-lg mb-3 h-32 flex items-center justify-center">
                <img
                  src={medicine.image}
                  alt="none"
                  className="w-full h-full rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                {medicine.name}
              </h3>
              <div className="flex items-center mb-2">
                <span className="text-blue-600 font-bold mr-2">
                  {medicine.price}
                </span>
                <span className="text-green-600 text-xs">
                  {medicine.discount}
                </span>
              </div>
              <button className="w-full bg-dblue text-white py-2 rounded-lg font-semibold">
                Add
              </button>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <BottomNav />
      </div>
    </div>
  );
};

export default ChemistPage;
