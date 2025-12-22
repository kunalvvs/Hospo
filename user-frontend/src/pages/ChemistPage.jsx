import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Search, MapPin, Clock, Star, Phone } from "lucide-react";
import { IoBagAddSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { FaPersonDress } from "react-icons/fa6";
import { Link } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { chemistAPI } from "../services/api";
import { toast } from "react-hot-toast";

const ChemistPage = () => {
  const [chemists, setChemists] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("chemists"); // "chemists" or "medicines"

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

  // Get user location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Fetch chemists based on location
  useEffect(() => {
    if (userLocation) {
      fetchNearbyChemists();
    } else {
      fetchAllChemists();
    }
  }, [userLocation]);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to fetching all chemists
          fetchAllChemists();
        }
      );
    } else {
      console.log("Geolocation not supported");
      fetchAllChemists();
    }
  };

  // Fetch all chemists (fallback)
  const fetchAllChemists = async () => {
    try {
      setLoading(true);
      const response = await chemistAPI.getAllChemists();
      if (response.success) {
        // Check availability for each chemist
        const chemistsWithAvailability = await Promise.all(
          response.data.map(async (chemist) => {
            try {
              const availabilityRes = await chemistAPI.checkAvailability(
                chemist._id
              );
              return {
                ...chemist,
                isOpen: availabilityRes.isOpen || false,
                is24x7: availabilityRes.is24x7 || false,
              };
            } catch (error) {
              console.error('Error checking availability for chemist:', chemist._id, error);
              return { ...chemist, isOpen: false };
            }
          })
        );
        setChemists(chemistsWithAvailability);
      }
    } catch (error) {
      console.error("Error fetching chemists:", error);
      toast.error("Failed to load chemists");
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby chemists based on user location
  const fetchNearbyChemists = async () => {
    try {
      setLoading(true);
      const response = await chemistAPI.getNearbyChemists(
        userLocation.latitude,
        userLocation.longitude,
        10 // 10km radius
      );
      if (response.success) {
        // Check availability for each chemist
        const chemistsWithAvailability = await Promise.all(
          response.data.map(async (chemist) => {
            try {
              const availabilityRes = await chemistAPI.checkAvailability(
                chemist._id
              );
              return {
                ...chemist,
                isOpen: availabilityRes.isOpen || false,
                is24x7: availabilityRes.is24x7 || false,
              };
            } catch (error) {
              console.error('Error checking availability for chemist:', chemist._id, error);
              return { ...chemist, isOpen: false };
            }
          })
        );
        setChemists(chemistsWithAvailability);
      }
    } catch (error) {
      console.error("Error fetching nearby chemists:", error);
      toast.error("Failed to load nearby chemists");
      // Fallback to all chemists
      fetchAllChemists();
    } finally {
      setLoading(false);
    }
  };

  // Search medicines globally
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setActiveTab("chemists");
      return;
    }

    try {
      setSearchLoading(true);
      setActiveTab("medicines");
      const response = await chemistAPI.searchMedicines(query);

      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Error searching medicines:", error);
      toast.error("Failed to search medicines");
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-black rounded-lg pl-12 pr-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Location indicator */}
        {userLocation && (
          <div className="mt-2 flex items-center text-white text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Showing nearby chemists</span>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="px-4 mb-6 mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-xl shadow-sm flex items-center hover:shadow-md transition-all duration-200 cursor-pointer"
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

      {/* Search Results or Chemists List */}
      {searchLoading ? (
        <div className="px-4 text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dblue mx-auto"></div>
          <p className="text-gray-600 mt-4">Searching medicines...</p>
        </div>
      ) : activeTab === "medicines" && searchResults.length > 0 ? (
        // Medicine Search Results
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Search Results ({searchResults.length})
            </h2>
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
                setActiveTab("chemists");
              }}
              className="text-blue-600 text-sm"
            >
              Clear
            </button>
          </div>

          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex gap-4">
                  {/* Medicine Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {result.medicine.mainImage ? (
                      <img
                        src={result.medicine.mainImage}
                        alt={result.medicine.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <IoBagAddSharp className="text-3xl" />
                      </div>
                    )}
                  </div>

                  {/* Medicine Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {result.medicine.name}
                    </h3>
                    {result.medicine.genericName && (
                      <p className="text-xs text-gray-500 mb-1">
                        {result.medicine.genericName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mb-2">
                      {result.medicine.manufacturer} • {result.medicine.strength}
                    </p>

                    {/* Price */}
                    <div className="flex items-center mb-2">
                      <span className="text-blue-600 font-bold mr-2">
                        ₹{result.medicine.price}
                      </span>
                      {result.medicine.mrp > result.medicine.price && (
                        <>
                          <span className="text-gray-400 line-through text-sm mr-2">
                            ₹{result.medicine.mrp}
                          </span>
                          <span className="text-green-600 text-xs">
                            {Math.round(
                              ((result.medicine.mrp - result.medicine.price) /
                                result.medicine.mrp) *
                                100
                            )}
                            % OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* Chemist Info */}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {result.chemist.pharmacyName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {result.chemist.locality}, {result.chemist.city}
                            {result.chemist.distance && (
                              <span className="ml-2">
                                • {result.chemist.distance} km away
                              </span>
                            )}
                          </p>
                        </div>
                        <Link
                          to={`/chemist/${result.chemist.id}`}
                          className="bg-dblue text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                          View Shop
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "medicines" && searchQuery ? (
        <div className="px-4 text-center py-8">
          <p className="text-gray-600">No medicines found for "{searchQuery}"</p>
        </div>
      ) : loading ? (
        <div className="px-4 text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dblue mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading chemists...</p>
        </div>
      ) : (
        // Chemists List
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {userLocation ? "Nearby Chemists" : "All Chemists"} (
              {chemists.length})
            </h2>
          </div>

          {chemists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No chemists found nearby</p>
              {userLocation && (
                <button
                  onClick={fetchAllChemists}
                  className="mt-4 text-blue-600 underline"
                >
                  Show all chemists
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {chemists.map((chemist, index) => (
                <Link
                  to={`/chemist/${chemist._id}`}
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all block"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {chemist.pharmacyName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>
                          {chemist.locality}, {chemist.city}
                          {chemist.distance && (
                            <span className="ml-2 text-blue-600 font-medium">
                              • {chemist.distance} km away
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Rating */}
                      {chemist.rating > 0 && (
                        <div className="flex items-center mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-medium">
                            {chemist.rating}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({chemist.totalReviews} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Open/Closed Status */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                        chemist.is24x7 || chemist.isOpen
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {chemist.is24x7
                        ? "24x7"
                        : chemist.isOpen
                        ? "Open"
                        : "Closed"}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {chemist.homeDelivery && (
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        Home Delivery
                      </span>
                    )}
                    {chemist.sameDayDelivery && (
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                        Same Day
                      </span>
                    )}
                    {chemist.onlineOrdering && (
                      <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">
                        Online Order
                      </span>
                    )}
                    {chemist.cashOnDelivery && (
                      <span className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded">
                        COD Available
                      </span>
                    )}
                  </div>

                  {/* Contact */}
                  {chemist.primaryPhone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-1" />
                      <span>{chemist.primaryPhone}</span>
                    </div>
                  )}

                  {/* Medicines Count */}
                  {chemist.inventory && chemist.inventory.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">
                          {chemist.inventory.length}
                        </span>{" "}
                        medicines available
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ChemistPage;
