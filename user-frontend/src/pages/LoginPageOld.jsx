import React, { useState } from "react";
import { Phone, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const LoginPageOld = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleContinue = () => {
    setShowOTP(true);
  };

  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleBack = () => {
    setShowOTP(false);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleVerifyOTP = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white text-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* App Icon */}
        <div className="mb-3 bg-[#234F83] p-2 rounded-xl">
          <img
            src="/cosco.png"
            alt="Hospo Logo"
            width="250"
            height="250"
            className="object-contain w-40 h-auto"
          />
        </div>

        {/* Welcome Text */}
        <p className="text-[#234F83] text-center mb-12 text-lg">
          Healthcare at your fingertips
        </p>

        {/* Login Form */}
        <div className="w-full max-w-sm bg-[#234F83]-800/50 backdrop-blur-sm rounded-3xl p-4 border shadow-md border-[#234F83]/50">
          {showOTP ? (
            <>
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[#234F83] mb-4 hover:text-[#234F83]/40 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <p className="text-[#234F83] text-center mb-2 text-base">
                Enter the 6-digit OTP sent to
              </p>
              <p className="text-[#234F83] text-center mb-6 text-sm font-medium">
                +91 {mobileNumber}
              </p>

              {/* OTP Input */}
              <div className="mb-6">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      className="w-10 h-10 bg-white border-2 border-[#234F83]/50 rounded-xl text-center text-[#234F83] text-xl font-bold focus:outline-none focus:border-[#234F83] transition-colors"
                      maxLength="1"
                    />
                  ))}
                </div>
              </div>

              {/* Verify OTP Button */}
              <button
                onClick={handleVerifyOTP}
                className="w-full bg-[#234F83] hover:bg-[#234F83]/80 text-white font-semibold py-4 rounded-2xl text-lg transition-colors duration-200 shadow-lg"
              >
                Verify OTP
              </button>
            </>
          ) : (
            <>
              <p className="text-black text-center mb-6 text-sm">
                Login with your mobile number to continue
              </p>

              {/* Mobile Number Input */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                    <Phone className="w-5 h-5 text-[#234F83] mr-2" />
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setMobileNumber(value);
                      }
                    }}
                    maxLength="10"
                    className="w-full bg-white border-2 border-[#234F83]/50 rounded-2xl pl-12 pr-4 py-4 text-[#234F83] text-lg focus:outline-none focus:border-[#234F83] transition-colors"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full bg-[#234F83] hover:bg-[#234F83]/80 text-white font-semibold py-4 rounded-2xl text-lg transition-colors duration-200 shadow-lg"
              >
                Continue
              </button>

              {/* Terms and Privacy */}
              <p className="text-[#234F83] text-[10px] text-center mt-4 leading-relaxed">
                By continuing, you agree to our{" "}
                <span className="text-[#234F83] underline cursor-pointer">
                  Terms
                </span>{" "}
                and{" "}
                <span className="text-[#234F83] underline cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bottom Links */}
      <div className="pb-8 px-6 text-center space-y-4">
        <p className="text-[#234F83]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#234F83] font-medium cursor-pointer"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPageOld;
