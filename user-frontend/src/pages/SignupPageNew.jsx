import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, setAuthToken, setUserData } from "../services/api";
import socketService from "../services/socket";

/* -------------------- Step Indicator -------------------- */
const StepIndicator = ({ currentStep }) => (
  <div className="flex justify-center mb-8">
    {[1, 2].map((step) => (
      <div
        key={step}
        className={`w-12 h-12 rounded-full flex items-center justify-center mx-2 border font-semibold
          ${
            step < currentStep
              ? "bg-[#234F83] border-[#234F83] text-white"
              : step === currentStep
              ? "bg-[#234F83] text-white"
              : "bg-gray-200 border-gray-400 text-gray-600"
          }`}
      >
        {step < currentStep ? "✓" : step}
      </div>
    ))}
  </div>
);

/* -------------------- Signup Page -------------------- */
const SignupPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error on input change
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
      setError("Please fill all required fields");
      return false;
    }

    if (formData.mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSendOTP = async () => {
    if (!validateStep1()) return;

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.sendOTP(formData.mobile);
      
      if (response.success) {
        setOtpSent(true);
        setCurrentStep(2);
        console.log('OTP sent successfully to', formData.mobile);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    if (!formData.otp) {
      setError("Please enter OTP");
      return;
    }

    if (formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Verify OTP (this also marks phone as verified)
      const otpResponse = await authAPI.verifyOTP(formData.mobile, formData.otp);
      
      if (!otpResponse.success) {
        setError("Invalid OTP. Please try again.");
        setLoading(false);
        return;
      }

      // Step 2: Register user (phone is now verified)
      const registerResponse = await authAPI.register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        password: formData.password
      });

      if (registerResponse.success) {
        // Store auth token and user data
        setAuthToken(registerResponse.token);
        setUserData(registerResponse.user);

        console.log('✅ Token stored:', registerResponse.token);
        console.log('✅ User stored:', registerResponse.user);

        // Connect to Socket.io
        socketService.connect(registerResponse.user.id, 'patient');

        console.log('Registration successful, redirecting to home...');
        
        // Use window.location for reliable redirect
        window.location.href = '/';
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex justify-center items-center">
          <div className="mb-3 w-[100px] bg-[#234F83] p-2 rounded-xl">
            <img
              src="/cosco.png"
              alt="hospo Logo"
              width="250"
              height="250"
              className="object-contain w-40 h-auto"
            />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#234F83] mb-2">Create Account</h1>
          <p className="text-gray-600">Join Hospo for better healthcare</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        <div className="bg-white shadow-md rounded-2xl p-6 mb-6 border border-gray-200">
          {currentStep === 1 ? (
            /* Step 1: Personal Details */
            <div>
              <h2 className="text-2xl font-bold text-[#234F83] mb-4">Personal Details</h2>
              <p className="text-gray-700 mb-6">Enter your details to create an account</p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✓ {success}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">👤</span>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 placeholder-gray-500 focus:border-[#234F83] focus:outline-none"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">✉️</span>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 placeholder-gray-500 focus:border-[#234F83] focus:outline-none"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">📱</span>
                  <input
                    type="tel"
                    placeholder="Mobile Number (10 digits) *"
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        updateFormData('mobile', value);
                      }
                    }}
                    maxLength={10}
                    className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 placeholder-gray-500 focus:border-[#234F83] focus:outline-none"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔒</span>
                  <input
                    type="password"
                    placeholder="Password (min 6 characters) *"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 placeholder-gray-500 focus:border-[#234F83] focus:outline-none"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔒</span>
                  <input
                    type="password"
                    placeholder="Confirm Password *"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 placeholder-gray-500 focus:border-[#234F83] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>📱 OTP Verification:</strong> We'll send a 6-digit OTP to your mobile number for verification.
                  <br />
                  <span className="text-xs text-blue-600 mt-1 inline-block">For testing: Use OTP <strong>123456</strong></span>
                </p>
              </div>
            </div>
          ) : (
            /* Step 2: OTP Verification */
            <div>
              <h2 className="text-2xl font-bold text-[#234F83] mb-4">Verify OTP</h2>
              <p className="text-gray-700 mb-6">
                Enter the 6-digit OTP sent to <strong>{formData.mobile}</strong>
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✓ {success}
                </div>
              )}

              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-[#234F83] mr-3">📱</span>
                  <div>
                    <p className="text-gray-600 text-sm">Mobile Number</p>
                    <p className="text-gray-900 font-semibold">{formData.mobile}</p>
                  </div>
                </div>
              </div>

              <div className="relative mb-6">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔢</span>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      updateFormData('otp', value);
                    }
                  }}
                  maxLength={6}
                  className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 text-center text-2xl tracking-widest placeholder-gray-500 focus:border-[#234F83] focus:outline-none"
                  required
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 text-center">
                  <strong>🎯 Test OTP:</strong> Use <strong className="text-2xl">123456</strong> to verify
                </p>
              </div>

              <button
                onClick={handleSendOTP}
                className="mt-4 w-full text-center text-[#234F83] hover:underline font-medium"
              >
                Resend OTP
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`${currentStep === 1 ? "w-full" : "flex justify-between items-center"} mb-4`}>
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(1)}
              disabled={loading}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}

          <button
            onClick={currentStep === 1 ? handleSendOTP : handleVerifyAndRegister}
            disabled={loading}
            className={`px-8 py-3 bg-[#234F83] text-white rounded-lg font-medium hover:bg-[#1d3f6a] transition-colors disabled:opacity-50 ${
              currentStep === 1 ? "w-full" : ""
            }`}
          >
            {loading ? "Processing..." : currentStep === 1 ? "Send OTP" : "Verify & Register"}
          </button>
        </div>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-[#234F83] hover:text-[#1d3f6a] font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
