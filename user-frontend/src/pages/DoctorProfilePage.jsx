import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

const DoctorProfilePage = () => {
  const navigate = useNavigate();

  const doctor = {
    name: "Dr. Rajesh Kumar",
    photo:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    specialization: "General Physician",
    qualifications: "MBBS, MD",
    experience: 8,
    consultationFee: 500,
    consultationTime: "15 min",
    rating: 4.8,
    reviews: 2456,
    likes: 3200,
    languages: ["English", "Hindi", "Tamil"],
    clinicName: "HealthCare Clinic",
    clinicAddress: "123 Medical Street, City Center, 110001",
    availability: "Mon-Sat, 9 AM - 6 PM",
    about:
      "Dr. Rajesh Kumar is a highly experienced General Physician with over 8 years of practice. He specializes in treating common health issues and providing preventive care. Known for his patient-friendly approach and accurate diagnoses.",
    specializations: [
      "Fever & Infections",
      "Diabetes Management",
      "Hypertension",
      "Respiratory Issues",
      "Digestive Disorders",
      "Preventive Care",
    ],
  };

  const handleBookAppointment = async () => {
    // Simulate async navigation
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/doctors/bookapointment");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header with Background */}
      <div className="relative h-48 bg-gradient-to-br from-dblue to-blue-600">
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
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="pt-20 px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{doctor.name}</h1>
          <p className="text-dblue font-semibold mb-1">{doctor.specialization}</p>
          <p className="text-sm text-gray-600">{doctor.qualifications}</p>

          {/* Stats Row */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Briefcase className="w-4 h-4 text-dblue" />
                <span className="text-lg font-bold text-gray-800">
                  {doctor.experience}
                </span>
              </div>
              <p className="text-xs text-gray-500">Years Exp</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-lg font-bold text-gray-800">
                  ₹{doctor.consultationFee}
                </span>
              </div>
              <p className="text-xs text-gray-500">Consultation</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-lg font-bold text-gray-800">
                  {doctor.consultationTime}
                </span>
              </div>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
          </div>

          {/* Rating & Likes */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-800">{doctor.rating}</span>
              <span className="text-sm text-gray-500">({doctor.reviews})</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-800">{doctor.likes}</span>
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
                {doctor.clinicName}
              </p>
              <p className="text-xs text-gray-600">{doctor.clinicAddress}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Availability</p>
              <p className="text-xs text-gray-600">{doctor.availability}</p>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="w-5 h-5 text-dblue" />
            <h3 className="text-sm font-semibold text-gray-800">Specializations</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {doctor.specializations.map((spec, index) => (
              <span
                key={index}
                className="bg-blue-100 text-dblue px-3 py-1 rounded-full text-xs font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
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

        {/* About */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">About Doctor</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{doctor.about}</p>
        </div>

        {/* Professional Info */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Professional Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Registration No.</span>
              <span className="text-sm font-semibold text-gray-800">
                MCI-12345678
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Years of Experience</span>
              <span className="text-sm font-semibold text-gray-800">
                {doctor.experience} Years
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Patients Treated</span>
              <span className="text-sm font-semibold text-gray-800">5000+</span>
            </div>
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
          Book Appointment - ₹{doctor.consultationFee}
        </button>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
