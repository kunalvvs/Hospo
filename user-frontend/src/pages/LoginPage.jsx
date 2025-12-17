import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, setAuthToken, setUserData } from "../services/api";
import socketService from "../services/socket";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'mobile'
  
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error on input change
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        // Store auth token and user data
        setAuthToken(response.token);
        setUserData(response.user);

        console.log('✅ Token stored:', response.token);
        console.log('✅ User stored:', response.user);

        // Connect to Socket.io
        socketService.connect(response.user.id, 'patient');

        console.log('Email login successful, redirecting to home...');
        
        // Use window.location for reliable redirect
        window.location.href = '/';
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.sendOTP(formData.mobile);
      
      if (response.success) {
        setOtpSent(true);
        console.log('OTP sent successfully to', formData.mobile);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleMobileLogin = async (e) => {
    e.preventDefault();

    if (!formData.otp || formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Verify OTP - now returns token and user data
      const response = await authAPI.verifyOTP(formData.mobile, formData.otp);
      
      console.log('OTP verification response:', response);
      
      if (response.success && response.token && response.user) {
        // Store auth token and user data
        setAuthToken(response.token);
        setUserData(response.user);

        console.log('✅ Token stored:', response.token);
        console.log('✅ User stored:', response.user);

        // Connect to Socket.io
        socketService.connect(response.user.id, 'patient');

        console.log('Login successful, redirecting to home...');
        
        // Use window.location for reliable redirect
        window.location.href = '/';
      } else if (response.success && !response.token) {
        // User doesn't exist yet - redirect to signup
        setError("Account not found. Please sign up first.");
        setTimeout(() => {
          window.location.href = '/signup';
        }, 2000);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      
      // If user doesn't exist, suggest signup
      if (errorMessage.includes('not found') || errorMessage.includes('No user')) {
        setTimeout(() => {
          window.location.href = '/signup';
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center items-center">
          <div className="mb-3 w-[100px] bg-[#234F83] p-2 rounded-xl">
            <img
              src="/cosco.png"
              alt="DoctorSoap Logo"
              width="250"
              height="250"
              className="object-contain w-40 h-auto"
            />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#234F83] mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to access your account</p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex mb-6 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => {
              setLoginMethod("email");
              setOtpSent(false);
              setError("");
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-colors ${
              loginMethod === "email"
                ? "bg-[#234F83] text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => {
              setLoginMethod("mobile");
              setOtpSent(false);
              setError("");
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-colors ${
              loginMethod === "mobile"
                ? "bg-[#234F83] text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Mobile (OTP)
          </button>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 mb-6 border border-gray-200">
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

          {loginMethod === "email" ? (
            /* Email Login Form */
            <form onSubmit={handleEmailLogin}>
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">✉️</span>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 placeholder-gray-500 focus:border-[#234F83] focus:outline-none"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔒</span>
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 placeholder-gray-500 focus:border-[#234F83] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 px-8 py-3 bg-[#234F83] text-white rounded-lg font-medium hover:bg-[#1d3f6a] transition-colors disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            /* Mobile OTP Login Form */
            <form onSubmit={otpSent ? handleMobileLogin : (e) => { e.preventDefault(); handleSendOTP(); }}>
              {!otpSent ? (
                <>
                  <div className="relative mb-4">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">📱</span>
                    <input
                      type="tel"
                      placeholder="Mobile Number (10 digits)"
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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>📱 OTP Login:</strong> We'll send a 6-digit OTP to your mobile.
                      <br />
                      <span className="text-xs text-blue-600 mt-1 inline-block">For testing: Use OTP <strong>123456</strong></span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-3 bg-[#234F83] text-white rounded-lg font-medium hover:bg-[#1d3f6a] transition-colors disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-[#234F83] mr-3">📱</span>
                      <div>
                        <p className="text-gray-600 text-sm">Mobile Number</p>
                        <p className="text-gray-900 font-semibold">{formData.mobile}</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-4">
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

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800 text-center">
                      <strong>🎯 Test OTP:</strong> Use <strong className="text-2xl">123456</strong>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-3 bg-[#234F83] text-white rounded-lg font-medium hover:bg-[#1d3f6a] transition-colors disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="mt-4 w-full text-center text-[#234F83] hover:underline font-medium"
                  >
                    Change Number
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="text-[#234F83] hover:text-[#1d3f6a] font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
