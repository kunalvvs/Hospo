import React, { useState } from "react";
import {
  Search,
  Briefcase,
} from "lucide-react";
import { FaStethoscope, FaBriefcaseMedical, FaLocationDot } from "react-icons/fa6";
import { FaRunning } from "react-icons/fa";
import BottomNav from "@/components/BottomNav";
import { Link } from "react-router-dom";
import { IoStarSharp, IoStar } from "react-icons/io5";
import Header from "@/components/Header";

const specializations = [
  { name: "Cardiology", icon: "❤️", hospital: 12, color: "bg-red-500" },
  { name: "Dentistry", icon: "🦷", hospital: 8, color: "bg-blue-500" },
  { name: "Dermatology", icon: "🔆", hospital: 15, color: "bg-orange-500" },
  { name: "Neurology", icon: "🧠", hospital: 10, color: "bg-purple-500" },
  { name: "Orthopedics", icon: "🦴", hospital: 14, color: "bg-green-500" },
  { name: "Pediatrics", icon: "👶", hospital: 11, color: "bg-pink-500" },
];

const tophospital = [
  {
    id: 1,
    name: "Aim Hospital",
    specialization: "100",
    experience: "Cardiology specialization",
    rating: 4.8,
    reviews: 892,
    fee: 800,
    image: "/hospital1.jpg",
    available: true,
    link: "/bookhospital",
  },
  {
    id: 2,
    name: "Aim Hospital",
    specialization: "200",
    experience: "Dentistry specialization",
    rating: 4.9,
    reviews: 1024,
    fee: 700,
    image: "/hospital2.jpg",
    available: true,
  },
  {
    id: 3,
    name: "Aim Hospital",
    specialization: "300",
    experience: "Dermatology specialization",
    rating: 4.7,
    reviews: 756,
    fee: 900,
    image: "/hospital3.jpg",
    available: false,
  },
];

const nearbyDocs = [
  {
    id: 1,
    name: "Aim Hospital",
    specialization: "Cardiologist",
    status: "available",
    address: "Mumbai",
    fee: 800,
    rating: "4.7",
    distance: "1.4",
    link: "/profile",
  },
  {
    id: 2,
    name: "Aim Hospital",
    specialization: "Cardiologist",
    status: "available",
    address: "Delhi",
    fee: 800,
    rating: "4.7",
    distance: "1.4",
    link: "/profile",
  },
  {
    id: 3,
    name: "Aim Hospital",
    specialization: "Cardiologist",
    status: "available",
    address: "Hariyana",
    fee: 800,
    rating: "4.7",
    distance: "1.4",
    link: "/profile",
  },
];

const HospitalPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 text-white pb-28">
      <div className="bg-dblue p-4 pt-8 sticky top-0 z-10">
        <Header title="Hospital" />

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for Hospital, specializations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-black rounded-lg pl-12 pr-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4  bg-gray-100">
        {/* Popular Specializations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">
              Popular Specializations
            </h2>
            <Link to="/specializations" className="text-blue-400 text-sm">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {specializations.map((spec, idx) => (
              <Link
                key={idx}
                to={`/specialization/${spec.name.toLowerCase()}`}
              >
                <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center transition-colors">
                  <div
                    className={`${spec.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2`}
                  >
                    {spec.icon}
                  </div>
                  <h3 className="font-medium text-sm text-center text-black mb-1">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {spec.hospital} Hospital
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top hospital */}
        <div>
          <div className="flex items-center justify-between my-3">
            <h2 className="text-lg font-semibold text-black">Top hospital</h2>
            <Link to="/all-hospital" className="text-blue-400 text-sm">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {tophospital.map((hospital) => (
              <Link key={hospital.id} to={`/hospital${hospital.link}`}>
                <div className="bg-white shadow-md rounded-xl p-4 hover:bg-gray-200 mb-2 transition-colors">
                  <div className="flex flex-col">
                    <div className="flex gap-4">
                      {/* hospital Image */}
                      <div className="w-40 h-25 bg-dblue rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaStethoscope className="w-10 h-10 text-white" />
                      </div>

                      {/* hospital Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-base text-black">
                            {hospital.name}
                          </h3>
                        </div>
                        <p className="flex flex-row text-xs text-gray-400 mb-1 gap-1">
                          <FaBriefcaseMedical /> Total hospitals Available (
                          {hospital.specialization})
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                          <span className="flex items-center gap-1 text-pink-500">
                            <Briefcase className="w-3 h-3" />
                            {hospital.experience} Experience
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-400 font-semibold">
                            ₹{hospital.fee}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row gap-3 mt-3">
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                      Available
                    </span>
                    <span className="bg-teal-500/20 text-teal-400 text-xs px-2 py-1 rounded-full">
                      Top Choice
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                      Virtual
                    </span>
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                      In-Person
                    </span>
                  </div>
                </div>
                <div></div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="text-lg sm:text-xl font-bold text-black mb-2">
          Nearby Hospital
        </div>

        {/* Scrollable hospital List */}
        <div className="flex flex-col gap-3 pb-3 scrollbar-hide">
          {nearbyDocs.map((items) => (
            <div
              key={items.id}
              className="flex flex-row bg-white shadow-md rounded-2xl p-4 min-w-[80vw] sm:min-w-[60vw] md:min-w-[40vw] lg:min-w-[30vw] flex-shrink-0 hover:shadow-blue-400/20 hover:scale-105 transition-transform duration-300"
            >
              {/* hospital Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 mr-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaStethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              {/* hospital Info */}
              <div className="flex flex-col w-full">
                {/* Name + Status */}
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm sm:text-base font-semibold text-black">
                    {items.name}
                  </div>
                  <div className="flex justify-center items-center text-[10px] sm:text-xs text-green-600 rounded-md bg-green-500/20 px-2 py-[2px]">
                    {items.status}
                  </div>
                </div>

                {/* Degree */}
                <div className="text-blue-500 text-xs sm:text-sm font-medium">
                  {items.degree}
                </div>

                {/* Address */}
                <div className="flex items-center text-[10px] sm:text-xs text-gray-700 mt-1">
                  <FaLocationDot className="mr-1 text-black text-[11px]" />
                  <span className="truncate">{items.address}</span>
                </div>

                {/* Fee */}
                <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-row">
                    <div className="text-yellow-400 flex justify-center items-center mr-1">
                      <IoStar />
                    </div>
                    <div className="text-black text-xs mr-4">{items.rating}</div>
                    <div className="text-black text-sm justify-center items-center mr-1">
                      <FaRunning />
                    </div>
                    <div className="text-black text-xs">{items.distance} km</div>
                  </div>
                  <div className="font-medium text-blue-500 bg-blue-500/10 px-2 py-[2px] rounded text-xs sm:text-sm">
                    ₹{items.fee}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default HospitalPage;
