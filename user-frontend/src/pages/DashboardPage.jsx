import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  Clock,
  MapPin,
  Stethoscope,
  Pill,
  Ambulance,
  TestTube,
  Droplet,
  Heart,
  Hospital,
  ChevronRight,
  Activity,
  Briefcase,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { GiHamburgerMenu } from "react-icons/gi";
import UserSidebar from "@/components/UserSidebar";
import { Link, useNavigate } from "react-router-dom";
import { FaStethoscope, FaBriefcaseMedical, FaLocationDot } from "react-icons/fa6";
import { IoStarSharp } from "react-icons/io5";
import { getUserData, isAuthenticated, appointmentAPI } from "../services/api";

const featureCards = [
  {
    title: "Hospital",
    description: "Get medicines delivered to your door",
    icon: Hospital,
    background: "bg-pink-600",
    descriptionClass: "text-green-100",
    link: "/hospital",
  },
  {
    title: "Doctor",
    description: "Consult top specialists near you",
    icon: Stethoscope,
    background: "bg-blue-600",
    descriptionClass: "text-blue-100",
    link: "/doctors",
  },
  {
    title: "Chemist",
    description: "Get medicines delivered to your door",
    icon: Pill,
    background: "bg-purple-600",
    descriptionClass: "text-teal-100",
    link: "/chemist",
  },
  {
    title: "Ambulance",
    description: "Emergency help, just a tap away",
    icon: Ambulance,
    background: "bg-red-500",
    descriptionClass: "text-red-100",
    link: "/ambulance",
  },
  {
    title: "PathLab",
    description: "Book lab tests with home sample pickup",
    icon: TestTube,
    background: "bg-orange-500",
    descriptionClass: "text-orange-100",
    link: "/pathlab",
  },
];

const pathLabTests = [
  {
    price: "₹599",
    title: "Complete Blood Count",
    iconBg: "bg-red-800/10",
    iconColor: "text-red-400",
  },
  {
    price: "₹299",
    title: "Diabetes Screening",
    iconBg: "bg-green-800/10",
    iconColor: "text-green-400",
  },
  {
    price: "₹799",
    title: "Liver Function Test",
    iconBg: "bg-blue-800/10",
    iconColor: "text-blue-400",
  },
];

const featuredMeds = [
  {
    id: 1,
    img: "/doctor1.png",
    title: "Paracitamol 500mg",
    price: "$30",
    off: "15%",
  },
  {
    id: 2,
    img: "/doctor1.png",
    title: "Ibuprofen 400mg",
    price: "$25",
    off: "10%",
  },
  {
    id: 3,
    img: "/doctor1.png",
    title: "Aspirin 75mg",
    price: "$20",
    off: "20%",
  },
];

const ambulanceServices = [
  {
    title: "Basic Life Support",
    emoji: "🚑",
    badgeBg: "bg-blue-800/10",
  },
  {
    title: "Advanced Life Support",
    emoji: "🚨",
    badgeBg: "bg-red-800/10",
  },
  {
    title: "Long Distance Transfer",
    emoji: "🚐",
    badgeBg: "bg-purple-800/10",
  },
];

const healthTips = [
  {
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water daily.",
    icon: Droplet,
    iconBg: "bg-blue-800/10",
    iconColor: "text-blue-400",
    trailingIcon: Droplet,
    trailingColor: "text-blue-400",
  },
  {
    title: "Exercise",
    description: "Aim for 30 min of activity most days.",
    icon: Activity,
    iconBg: "bg-green-800/10",
    iconColor: "text-green-400",
    trailingIcon: Activity,
    trailingColor: "text-green-400",
  },
  {
    title: "Sleep Well",
    description: "Get 7-8 hours of quality sleep.",
    icon: Clock,
    iconBg: "bg-purple-800/10",
    iconColor: "text-purple-400",
    trailingIcon: Clock,
    trailingColor: "text-purple-400",
  },
  {
    title: "Eat Greens",
    description: "Include veggies and fruits in your diet.",
    icon: Heart,
    iconBg: "bg-red-800/10",
    iconColor: "text-red-400",
    trailingIcon: Heart,
    trailingColor: "text-red-400",
  },
  {
    title: "Mental Health",
    description: "Take breaks and manage stress.",
    icon: Heart,
    iconBg: "bg-pink-800/10",
    iconColor: "text-pink-400",
    trailingIcon: Activity,
    trailingColor: "text-pink-400",
  }
];

const topDoctors = [
  {
    id: 1,
    name: "Dr. Amit Sharma",
    specialization: "Cardiologist",
    experience: "15 years",
    rating: 4.8,
    reviews: 892,
    fee: 800,
    image: "/doctor1.jpg",
    available: true,
    link: "/profile",
  },
  {
    id: 2,
    name: "Dr. Priya Mehta",
    specialization: "Dermatologist",
    experience: "12 years",
    rating: 4.9,
    reviews: 1024,
    fee: 700,
    image: "/doctor2.jpg",
    available: true,
  },
  {
    id: 3,
    name: "Dr. Rajesh Kumar",
    specialization: "Orthopedic",
    experience: "18 years",
    rating: 4.7,
    reviews: 756,
    fee: 900,
    image: "/doctor3.jpg",
    available: false,
  },
];

const topHospitals = [
  {
    id: 1,
    name: "Apollo Hospital",
    location: "Sarita Vihar, Delhi",
    departments: "50+",
    rating: 4.8,
    reviews: 1240,
    beds: "500+",
    emergency: true,
    type: "Multi-Specialty",
  },
  {
    id: 2,
    name: "Max Super Specialty",
    location: "Patparganj, Delhi",
    departments: "45+",
    rating: 4.7,
    reviews: 980,
    beds: "350+",
    emergency: true,
    type: "Super Specialty",
  },
  {
    id: 3,
    name: "Fortis Hospital",
    location: "Shalimar Bagh, Delhi",
    departments: "40+",
    rating: 4.6,
    reviews: 856,
    beds: "400+",
    emergency: true,
    type: "Multi-Specialty",
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [showsidebar, setShowsidebar] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const promoImages = ["/cola.jpg", "/cola.jpg", "/cola.jpg"];

  // Check authentication and get user data
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const user = getUserData();
    if (user) {
      setUserData(user);
      console.log('✅ User data loaded:', user);
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  // Fetch user appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userData) return;
      
      setLoadingAppointments(true);
      try {
        const response = await appointmentAPI.getMyAppointments('pending,confirmed');
        if (response.success && response.appointments) {
          setAppointments(response.appointments);
          console.log('✅ Appointments loaded:', response.appointments);
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [userData]);

  // Auto-slide effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoImages.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [promoImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-white pb-28">
      {showsidebar && <UserSidebar onClose={() => setShowsidebar(false)} />}

      <div className="bg-dblue pb-5 rounded-b-3xl sm:rounded-b-4xl">
        <div className="flex items-center justify-between p-4 pt-8">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              onClick={() => setShowsidebar(true)}
              className="text-lg sm:text-xl flex-shrink-0 cursor-pointer"
            >
              <GiHamburgerMenu />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold truncate">
              Hi, {userData?.name || 'User'} 👋
            </h1>
          </div>
          
          <div className="relative flex-shrink-0">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              2
            </span>
          </div>
        </div>

        <div className="px-4">
          <hr className="mb-4 mt-2 mx-auto w-[99%] " />
        </div>
        {/* Upcoming Appointment */}
        <div className="px-4">
          <h2 className="text-lg font-semibold mb-3">Upcoming Appointment</h2>
          {loadingAppointments ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 text-sm">Loading appointments...</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="bg-gradient-to-r from-blue-400 to-gray-800 rounded-2xl overflow-hidden flex flex-row">
              <div className="w-48 h-35 bg-blue-200 flex items-center justify-center shadow-xl overflow-hidden mx-auto">
                <img
                  src={appointments[0].doctor?.profilePhoto || "/doctor1.png"}
                  alt="Doctor"
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex-1 p-4 bg-white">
                <div className="flex items-start justify-between mb-1 gap-2">
                  <h3 className="text-base text-black sm:text-lg font-semibold truncate">
                    {appointments[0].doctor?.name || 'Dr. Name'}
                  </h3>
                  <span className={`text-xs rounded-xl p-1 font-medium whitespace-nowrap ${
                    appointments[0].status === 'confirmed' ? 'text-green-600 bg-green-100' :
                    appointments[0].status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                    'text-blue-600 bg-blue-100'
                  }`}>
                    {appointments[0].status.charAt(0).toUpperCase() + appointments[0].status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {appointments[0].doctor?.primarySpecialization || 'Specialist'}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm mb-1 text-black">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {new Date(appointments[0].appointmentDate).toLocaleDateString('en-US', { 
                      weekday: 'short', day: 'numeric', month: 'short' 
                    })} • {appointments[0].appointmentTime}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="truncate text-black">
                    {appointments[0].location?.hospital || appointments[0].doctor?.clinicName || 'Hospital'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-gray-400 mb-2">📅</div>
              <p className="text-gray-600 text-sm">No upcoming appointments</p>
              <Link to="/doctors" className="mt-3 inline-block text-blue-600 text-sm font-medium hover:underline">
                Book an appointment
              </Link>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-2xl flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
            <input
              type="text"
              placeholder="Search doctors, medicines, etc."
              className="bg-transparent flex-1 outline-none text-sm sm:text-base text-black placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="p-4 mt-4 m-2 ">
        <h2 className="text-lg font-semibold mb-4 text-black">Features</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {featureCards.map(
            (
              {
                title,
                description,
                icon: Icon,
                background,
                descriptionClass,
                link,
              },
              index
            ) => (
              <Link
                to={link}
                key={title}
                className={`${background} rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between min-h-[160px] sm:min-h-[180px]
                ${index === 0 ? "col-span-2 sm:col-span-2 lg:col-span-5" : ""}
                `}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1">
                    {title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm ${descriptionClass} line-clamp-2`}
                  >
                    {description}
                  </p>
                </div>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 mt-8 m-2 shadow-md rounded-2xl bg-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-black mb-1">
              Quick Actions
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Access your most used services
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="group bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[110px] hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-blue-500/25 border border-blue-500/20 hover:border-blue-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xs sm:text-sm text-white font-medium relative z-10">
              Book
            </span>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="group bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[110px] hover:from-purple-500 hover:to-purple-600 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-purple-500/25 border border-purple-500/20 hover:border-purple-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xs sm:text-sm text-white font-medium relative z-10">
              Order
            </span>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="group bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[110px] hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-red-500/25 border border-red-500/20 hover:border-red-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-pulse">
              <Ambulance className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xs sm:text-sm text-white font-medium relative z-10">
              Emergency
            </span>
            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
          </div>

          <div className="group bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[110px] hover:from-orange-500 hover:to-orange-600 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-orange-500/25 border border-orange-500/20 hover:border-orange-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <TestTube className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xs sm:text-sm text-white font-medium relative z-10">
              PathLab
            </span>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 mt-5 m-2">
        <h2 className="text-lg sm:text-xl font-bold text-black mb-4">
          Promotions & Offers
        </h2>

        {/* Slideshow Container */}
        <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-2xl shadow-lg">
          {/* Images */}
          {promoImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 translate-x-0"
                  : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <img
                src={img}
                alt={`Promo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Doctors */}
      <div className="p-2 mt-4 m-2">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Top Doctors
          </h2>
          <Link
            to="/doctors"
            className="text-blue-400 text-sm hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Scrollable Cards */}
        <div className="flex flex-row overflow-x-auto no-scrollbar gap-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
          {topDoctors.map((doctor) => (
            <Link
              key={doctor.id}
              to={`/doctors${doctor.link}`}
              className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[30vw] xl:w-[25vw]"
            >
              <div className="bg-white p-4 hover:bg-gray-100 transition-colors shadow-md rounded-2xl">
                {/* Doctor Card */}
                <div className="flex flex-row gap-4">
                  {/* Doctor Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaStethoscope className="w-14 h-14 text-white" />
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-black mb-1">
                      {doctor.name}
                    </h3>

                    <p className="flex items-center text-xs font-bold sm:text-sm text-black mb-1 gap-1">
                      <FaBriefcaseMedical /> MBBS, MD ({doctor.specialization})
                    </p>

                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-1 text-pink-500">
                        <Briefcase className="w-3 h-3" />
                        {doctor.experience} Experience
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-semibold text-sm sm:text-base">
                        ₹{doctor.fee}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full border border-gray-300 mt-2" />

                {/* Location & Rating */}
                <div className="flex flex-wrap justify-between items-center mt-2 text-black">
                  {/* Location */}
                  <div className="flex items-center text-xs sm:text-sm">
                    <FaLocationDot className="text-black mr-1" />
                    <span>Appllo Hospital, Delhi</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center text-yellow-400 mt-1 sm:mt-0">
                    <div className="flex mr-1">
                      <IoStarSharp />
                      <IoStarSharp />
                      <IoStarSharp />
                      <IoStarSharp />
                      <IoStarSharp />
                    </div>
                    <div className="text-gray-600 text-xs">(4.8)</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap justify-between items-center gap-0.5 mt-5">
                  <span className="bg-green-500/20 text-green-600 text-sm px-2 py-1 rounded-sm">
                    Available
                  </span>
                  <span className="bg-teal-500/20 text-teal-600 text-sm px-2 py-1 rounded-sm">
                    Top Choice
                  </span>
                  <span className="bg-blue-500/20 text-blue-600 text-sm px-2 py-1 rounded-sm">
                    Video
                  </span>
                  <span className="bg-yellow-500/20 text-yellow-600 text-sm px-2 py-1 rounded-sm">
                    In-Person
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Hospitals */}
      <div className="p-2 mt-4 m-2">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Top Hospitals
          </h2>
          <Link
            to="/hospital"
            className="text-blue-400 text-sm hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Scrollable Cards */}
        <div className="flex flex-row overflow-x-auto no-scrollbar gap-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
          {topHospitals.map((hospital) => (
            <Link
              key={hospital.id}
              to="/hospital"
              className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[30vw] xl:w-[25vw]"
            >
              <div className="bg-white p-4 hover:bg-gray-100 transition-colors shadow-md rounded-2xl">
                {/* Hospital Card */}
                <div className="flex flex-row gap-4">
                  {/* Hospital Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Hospital className="w-14 h-14 text-white" />
                  </div>

                  {/* Hospital Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-black mb-1">
                      {hospital.name}
                    </h3>

                    <p className="flex items-center text-xs font-bold sm:text-sm text-black mb-1 gap-1">
                      {hospital.type}
                    </p>

                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-1 text-purple-500">
                        <Briefcase className="w-3 h-3" />
                        {hospital.departments} Departments
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-semibold text-sm sm:text-base">
                        {hospital.beds} Beds
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full border border-gray-300 mt-2" />

                {/* Location & Rating */}
                <div className="flex flex-wrap justify-between items-center mt-2 text-black">
                  {/* Location */}
                  <div className="flex items-center text-xs sm:text-sm">
                    <FaLocationDot className="text-black mr-1" />
                    <span>{hospital.location}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center text-yellow-400 mt-1 sm:mt-0">
                    <div className="flex mr-1">
                      <IoStarSharp />
                      <IoStarSharp />
                      <IoStarSharp />
                      <IoStarSharp />
                      <IoStarSharp />
                    </div>
                    <div className="text-gray-600 text-xs">({hospital.rating})</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap justify-between items-center gap-0.5 mt-5">
                  {hospital.emergency && (
                    <span className="bg-red-500/20 text-red-600 text-sm px-2 py-1 rounded-sm">
                      24x7 Emergency
                    </span>
                  )}
                  <span className="bg-pink-500/20 text-pink-600 text-sm px-2 py-1 rounded-sm">
                    Top Rated
                  </span>
                  <span className="bg-blue-500/20 text-blue-600 text-sm px-2 py-1 rounded-sm">
                    ICU Available
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured PathLab Tests */}
      <div className=" p-2 mt-4 m-2 rounded-2xl ">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-black mb-1">
              PathLab Tests
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Book tests with home sample pickup
            </p>
          </div>
          <Link
            to="/pathlab"
            className="text-blue-400 text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap hover:text-blue-300 transition-colors"
          >
            View All <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-3 scrollbar-hide">
          {pathLabTests.map(({ price, title, duration, iconBg, iconColor }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-4 sm:p-5 min-w-[160px] sm:min-w-[180px] flex-shrink-0  hover:border-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-blue-500/20"
            >
              <div className="flex flex-row items-start justify-between mb-3 text-black">
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 ${iconBg} rounded-full flex items-center justify-center `}
                >
                  <Droplet className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-blue-400 text-xl sm:text-2xl font-bold">
                    {price}
                  </span>
                  <span className="text-gray-500 text-[10px] sm:text-xs">
                    onwards
                  </span>
                </div>
              </div>
              <h3
                className="text-black font-semibold text-sm sm:text-base line-clamp-2 leading-tight mt-6 "
                title={title}
              >
                {title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Medicines Tests */}
      <div className="p-2 mt-4 m-2 rounded-2xl ">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-black mb-1">
              Featured Medicines
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Book tests with home sample pickup
            </p>
          </div>
          <Link
            to="/chemist"
            className="text-blue-400 text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap hover:text-blue-300 transition-colors"
          >
            View All <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
        <div className="mt-4">
          {/* Featured Medicines Section */}
          <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-3 scrollbar-hide">
            {featuredMeds.map(({ id, img, title, price, off }) => (
              <div
                key={id}
                className="bg-white rounded-2xl text-black p-4 sm:p-5 min-w-[65vw] sm:min-w-[45vw] md:min-w-0 flex-shrink-0 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-blue-500/20 mx-auto"
              >
                <div className="flex flex-col gap-3 h-auto">
                  {/* Image */}
                  <div className="w-full h-[200px] aspect-square overflow-hidden rounded-xl">
                    <img
                      src={img}
                      alt={title}
                      className="object-cover w-full h-[200px] rounded-xl"
                    />
                  </div>

                  {/* Title */}
                  <div className="text-sm sm:text-base font-medium text-gray-800 text-left truncate">
                    {title}
                  </div>

                  {/* Price & Offer */}
                  <div className="flex flex-row justify-left items-left gap-2">
                    <div className="text-dblue font-semibold">{price}</div>
                    {off && (
                      <div className="text-xs text-center p-1 px-2 text-teal-600 bg-teal-600/10 rounded-md">
                        {off} OFF
                      </div>
                    )}
                  </div>

                  {/* Add Button */}
                  <div className="w-full text-center p-2 bg-dblue text-white rounded-lg hover:bg-blue-700 transition">
                    Add
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Ambulance Services */}
      <div className="p-2 mt-4 m-2 ">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-black mb-1">
              Featured Ambulance
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              24/7 ambulance at your doorstep
            </p>
          </div>
          <Link
            to="/ambulance"
            className="text-blue-400 text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap hover:text-blue-300 transition-colors"
          >
            View All <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-3 scrollbar-hide">
          {ambulanceServices.map(({ title, emoji, badgeBg }) => (
            <div
              key={title}
              className="group flex flex-col items-center justify-between bg-white rounded-2xl p-5 sm:p-6 min-w-[160px] sm:min-w-[190px] flex-shrink-0 relative transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-red-500/20"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 ${badgeBg} rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110`}
              >
                <span
                  className="text-3xl sm:text-4xl"
                  role="img"
                  aria-label={title}
                >
                  {emoji}
                </span>
              </div>
              <div className="w-full">
                <h3 className="text-black font-semibold text-sm sm:text-base text-center line-clamp-2 mb-2">
                  {title}
                </h3>
                <div className="flex items-center justify-center gap-1 text-green-400 text-xs">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Available Now</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      <div className="p-2 mt-0 m-2 ">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-black mb-1">
              Health Tips
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Daily wellness advice for you
            </p>
          </div>
          <button className="text-blue-400 text-xs sm:text-sm whitespace-nowrap hover:text-blue-300 transition-colors">
            See All
          </button>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {healthTips.map(
            (
              {
                title,
                description,
                icon: Icon,
                iconBg,
                iconColor,
                trailingIcon: TrailingIcon,
                trailingColor,
              },
              index
            ) => (
              <div
                key={title}
                className="group bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-blue-500/10"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110`}
                >
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-black font-bold text-sm sm:text-base mb-1.5">
                    {title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {description}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <TrailingIcon
                    className={`w-6 h-6 sm:w-7 sm:h-7 ${trailingColor} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  />
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div>
        <BottomNav />
      </div>
    </div>
  );
};

export default DashboardPage;
