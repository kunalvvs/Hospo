import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  ThumbsUp,
  Clock,
  DollarSign,
  Video,
  User,
  Award,
  Languages,
  Briefcase,
  Mail,
  Phone,
} from "lucide-react";
import { doctorAPI } from "../services/api";

const DoctorProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDoctorProfile();
  }, [id]);
  
  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getDoctorById(id);
      
      if (response.success && response.doctor) {
        setDoctor(response.doctor);
        console.log('✅ Fetched doctor profile:', response.doctor);
      }
    } catch (error) {
      console.error('Failed to fetch doctor profile:', error);
      alert('Failed to load doctor profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    // Navigate to booking page with doctor ID
    navigate(`/book-appointment/${id}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Doctor not found</p>
          <button
            onClick={() => navigate('/doctors')}
            className="text-blue-600 hover:underline"
          >
            Back to Doctors List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header with Background */}
      <div className="relative h-48 bg-gradient-to-br from-[#234f83] to-blue-600">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors z-10"
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

        {/* Doctor Photo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
          <div className="relative">
            {doctor.profilePhoto ? (
              <img
                src={doctor.profilePhoto}
                alt={doctor.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-blue-600 flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="pt-20 px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{doctor.name}</h1>
          <p className="text-dblue font-semibold mb-1">{doctor.primarySpecialization || 'General Physician'}</p>
          <p className="text-sm text-gray-600">{doctor.degrees && doctor.degrees.length > 0 ? doctor.degrees.map(d => d.name).join(', ') : 'Medical Professional'}</p>

          {/* Stats Row */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Briefcase className="w-4 h-4 text-dblue" />
                <span className="text-lg font-bold text-gray-800">
                  {doctor.experience || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500">Years Exp</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-lg font-bold text-gray-800">
                  ₹{doctor.consultationFee || 500}
                </span>
              </div>
              <p className="text-xs text-gray-500">Consultation</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-lg font-bold text-gray-800">
                  {doctor.consultationDuration || '30'} min
                </span>
              </div>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
          </div>

          {/* Rating & Likes */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-800">4.5</span>
              <span className="text-sm text-gray-500">(200+)</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-800">500+</span>
              <span className="text-sm text-gray-500">likes</span>
            </div>
          </div>
        </div>

        {/* Consultation Types */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Consultation Type
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border-2 border-dblue bg-blue-50 p-3 rounded-lg text-center">
              <Video className="w-6 h-6 text-dblue mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-800">Video Consult</p>
              <p className="text-xs text-gray-500">Available Now</p>
            </div>
            <div className="border-2 border-gray-300 p-3 rounded-lg text-center">
              <User className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-800">In-Person</p>
              <p className="text-xs text-gray-500">Book Slot</p>
            </div>
          </div>
        </div>

        {/* Clinic Info */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex items-start space-x-3 mb-3">
            <Briefcase className="w-5 h-5 text-dblue mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {doctor.clinicHospitalName || 'Private Practice'}
              </p>
              <p className="text-xs text-gray-600">
                {doctor.clinicLocation && typeof doctor.clinicLocation === 'object' ? (
                  // If clinicLocation is an object with address, city, state
                  `${doctor.clinicLocation.address || ''}${doctor.clinicLocation.city ? `, ${doctor.clinicLocation.city}` : ''}${doctor.clinicLocation.state ? `, ${doctor.clinicLocation.state}` : ''}`
                ) : (
                  // Fallback to older structure
                  doctor.clinicAddress ? `${doctor.clinicAddress}${doctor.city ? `, ${doctor.city}` : ''}` : 'Address not provided'
                )}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Availability</p>
              <p className="text-xs text-gray-600">{doctor.availability || 'Contact for availability'}</p>
            </div>
          </div>
        </div>

        {/* Specializations */}
        {doctor.servicesOffered && doctor.servicesOffered.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-5 h-5 text-dblue" />
              <h3 className="text-sm font-semibold text-gray-800">Services Offered</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {doctor.servicesOffered.map((service, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-dblue px-3 py-1 rounded-full text-xs font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {doctor.languages && doctor.languages.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Languages className="w-5 h-5 text-dblue" />
              <h3 className="text-sm font-semibold text-gray-800">Languages Spoken</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {doctor.languages.map((lang, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* About */}
        {doctor.bio && (
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">About Doctor</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{doctor.bio}</p>
          </div>
        )}

        {/* Contact Details */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Contact Details</h3>
          <div className="space-y-3">
            {doctor.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-dblue" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href={`mailto:${doctor.email}`} className="text-sm font-semibold text-blue-600 hover:underline">
                    {doctor.email}
                  </a>
                </div>
              </div>
            )}
            {doctor.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-dblue" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <a href={`tel:${doctor.phone}`} className="text-sm font-semibold text-blue-600 hover:underline">
                    {doctor.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Professional Information
          </h3>
          <div className="space-y-3">
            {doctor.registrationNumber && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Registration No.</span>
                <span className="text-sm font-semibold text-gray-800">
                  {doctor.registrationNumber}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Years of Experience</span>
              <span className="text-sm font-semibold text-gray-800">
                {doctor.experience || 0} Years
              </span>
            </div>
            {doctor.degrees && doctor.degrees.length > 0 && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-2">Qualifications</span>
                <div className="space-y-1">
                  {doctor.degrees.map((degree, index) => (
                    <div key={index} className="text-sm font-semibold text-gray-800">
                      {degree.name} - {degree.university} ({degree.year})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Patient Reviews</h3>
            <button className="text-dblue text-sm font-semibold">View All</button>
          </div>

          {/* Sample Review */}
          <div className="border-t pt-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800">John Doe</p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm ml-1">5.0</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">2 days ago</p>
                <p className="text-sm text-gray-600">
                  Excellent doctor! Very patient and thorough in his examination.
                  Highly recommended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <button
          onClick={handleBookAppointment}
          className="w-full bg-dblue hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors"
        >
          Book Appointment - ₹{doctor.consultationFee || 500}
        </button>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
