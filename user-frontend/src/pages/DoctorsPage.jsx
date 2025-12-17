import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Video,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaStethoscope, FaBriefcaseMedical, FaLocationDot } from "react-icons/fa6";
import { FaRunning } from "react-icons/fa";
import BottomNav from "@/components/BottomNav";
import { Link } from "react-router-dom";
import { IoStarSharp, IoStar } from "react-icons/io5";
import Header from "@/components/Header";
import { doctorAPI } from "../services/api";

const specializations = [
  { name: "Cardiology", icon: "❤️", doctors: 12, color: "bg-red-500" },
  { name: "Dentistry", icon: "🦷", doctors: 8, color: "bg-blue-500" },
  { name: "Dermatology", icon: "🔆", doctors: 15, color: "bg-orange-500" },
  { name: "Neurology", icon: "🧠", doctors: 10, color: "bg-purple-500" },
  { name: "Orthopedics", icon: "🦴", doctors: 14, color: "bg-green-500" },
  { name: "Pediatrics", icon: "👶", doctors: 11, color: "bg-pink-500" },
];

const DoctorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [topDoctors, setTopDoctors] = useState([]);
  const [nearbyDocs, setNearbyDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);
  
  // Fetch doctors when search query changes
  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        fetchDoctors(searchQuery);
      }, 500); // Debounce search
      return () => clearTimeout(timer);
    } else {
      fetchDoctors();
    }
  }, [searchQuery]);
  
  const fetchDoctors = async (search = '') => {
    try {
      setLoading(true);
      const params = search ? { search } : { limit: 10 };
      const response = await doctorAPI.getAllDoctors(params);
      
      if (response.success && response.doctors) {
        // Format doctors for display
        const formattedDoctors = response.doctors.map(doc => ({
          id: doc._id,
          name: doc.name,
          specialization: doc.primarySpecialization || 'General',
          experience: doc.experience ? `${doc.experience} years` : 'N/A',
          fee: doc.consultationFee || 500,
          clinic: doc.clinicHospitalName || 'Private Practice',
          city: doc.city || 'India',
          address: doc.clinicAddress || 'Not specified',
          available: true,
          link: `/doctors/${doc._id}`,
          rating: 4.5, // Default rating (can be enhanced later)
          distance: '2.5' // Default distance (can be enhanced with geolocation)
        }));
        
        setTopDoctors(formattedDoctors.slice(0, 5));
        setNearbyDocs(formattedDoctors);
        console.log('✅ Fetched doctors:', formattedDoctors.length);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-white pb-28">
      <div className="bg-dblue p-4 pt-8 sticky top-0 z-10">
        <Header title="Doctors" />

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for doctors, specializations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-black rounded-lg pl-12 pr-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6 bg-gray-100">
        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-black">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 ">
            <Link to="/book-appointment">
              <div className="bg-white shadow-md rounded-xl px-1.5 py-6 flex flex-col items-center justify-center hover:bg-gray-200 transition-colors">
                <div className="bg-blue-500/20 p-4 rounded-full mb-3">
                  <Calendar className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-center font-semibold text-black mb-1 text-md">
                  Book Appointment
                </h3>
                <p className="text-xs text-black text-center">
                  Schedule consultation
                </p>
              </div>
            </Link>
            <Link to="/video-consult">
              <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-200 transition-colors">
                <div className="bg-teal-500/20 p-4 rounded-full mb-3">
                  <Video className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="font-semibold mb-1 text-md text-black">
                  Video Consult
                </h3>
                <p className="text-xs text-center text-black">
                  Online consultation
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Emergency Consultation */}
        <Link to="/emergency">
          <div className="bg-dblue rounded-2xl p-5 flex items-center justify-between transition-all mt-3">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FaStethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-md">
                  Emergency Consultation
                </h3>
                <p className="text-xs text-blue-100">
                  Get immediate medical attention
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6" />
          </div>
        </Link>

        {/* Top Doctors */}
        <div>
          <div className="flex items-center justify-between mb-3 mt-2">
            <h2 className="text-lg font-semibold text-black">Top Doctors</h2>
            <Link to="/all-doctors" className="text-blue-400 text-sm">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : topDoctors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No doctors found. Try adjusting your search.
            </div>
          ) : (
            <div className="space-y-4">
              {topDoctors.map((doctor) => (
                <Link key={doctor.id} to={doctor.link}>
                  <div className="bg-white shadow-md rounded-xl p-4 hover:bg-gray-200 mb-2 transition-colors">
                    <div className="flex flex-col">
                      <div className="flex gap-4">
                        {/* Doctor Image */}
                        <div className="w-40 h-25 bg-dblue rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaStethoscope className="w-10 h-10 text-white" />
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-base text-black">
                              {doctor.name}
                            </h3>
                          </div>
                          <p className="flex flex-row text-xs text-gray-400 mb-1 gap-1">
                            <FaBriefcaseMedical /> {doctor.specialization}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                            <span className="flex items-center gap-1 text-pink-500">
                              <Briefcase className="w-3 h-3" />
                              {doctor.experience} Experience
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-400 font-semibold">
                              ₹{doctor.fee}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row mt-4 justify-between items-center w-full">
                      {/* Left side - Location */}
                      <div className="flex flex-row items-center">
                        <div className="text-black text-sm mr-1">
                          <FaLocationDot />
                        </div>
                        <div className="text-xs text-black">
                          {doctor.clinic}, {doctor.city}
                        </div>
                      </div>

                      {/* Right side - Rating */}
                      <div className="flex flex-row items-center text-yellow-400">
                        <div className="flex flex-row mr-1">
                          <IoStarSharp />
                          <IoStarSharp />
                          <IoStarSharp />
                          <IoStarSharp />
                          <IoStarSharp />
                        </div>
                        <div className="text-white text-xs">({doctor.rating})</div>
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
                        Video
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
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="text-lg sm:text-xl font-bold text-black mb-2">
          Nearby Doctors
        </div>

        {/* Scrollable Doctors List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : nearbyDocs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No doctors available at the moment.
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-3 scrollbar-hide">
            {nearbyDocs.map((items) => (
              <Link key={items.id} to={items.link}>
                <div className="flex flex-row bg-white shadow-md rounded-2xl p-4 min-w-[80vw] sm:min-w-[60vw] md:min-w-[40vw] lg:min-w-[30vw] flex-shrink-0 hover:shadow-blue-400/20 hover:scale-105 transition-transform duration-300">
                  {/* Doctor Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mr-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaStethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>

                  {/* Doctor Info */}
                  <div className="flex flex-col w-full">
                    {/* Name + Status */}
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm sm:text-base font-semibold text-black">
                        {items.name}
                      </div>
                      <div className="flex justify-center items-center text-[10px] sm:text-xs text-green-600 rounded-md bg-green-500/20 px-2 py-[2px]">
                        {items.available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>

                    {/* Specialization */}
                    <div className="text-blue-500 text-xs sm:text-sm font-medium">
                      {items.specialization}
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
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default DoctorsPage;
