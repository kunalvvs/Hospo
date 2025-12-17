import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* -------------------- Step Indicator -------------------- */
const StepIndicator = ({ currentStep }) => (
  <div className="flex justify-center mb-8">
    {[1, 2, 3, 4, 5].map((step) => (
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

/* -------------------- Step 1: Welcome -------------------- */
const Step1Welcome = () => (
  <div className="text-left">
    <h2 className="text-2xl font-bold text-dblue mb-4">
      Welcome to Hospo
    </h2>
    <p className="text-gray-700 mb-8">
      Let's get started with your health journey. We'll guide you through a few
      simple steps to create your account.
    </p>

    <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-[#234F83] mb-4">
        What you'll get:
      </h3>
      <div className="space-y-3 text-left">
        {[
          { icon: "👨‍⚕️", text: "Access to qualified doctors" },
          { icon: "💊", text: "Order medicines online" },
          { icon: "📍", text: "Health tips and guidance" },
          { icon: "⏰", text: "Easy appointment booking" },
        ].map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="text-[#234F83] mr-3">{item.icon}</span>
            <span className="text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* -------------------- Step 2: Personal Details -------------------- */
const Step2PersonalDetails = ({ formData, updateFormData }) => (
  <div>
    <h2 className="text-2xl font-bold text-[#234F83] mb-4">Personal Details</h2>
    <p className="text-gray-700 mb-6">
      Please provide your basic information to get started
    </p>

    <div className="space-y-4">
      {[
        { icon: "👤", placeholder: "Full Name", type: "text", key: "fullName" },
        { icon: "✉️", placeholder: "Email Address", type: "email", key: "email" },
        { icon: "📱", placeholder: "Mobile Number", type: "tel", key: "mobile" },
      ].map((field) => (
        <div key={field.key} className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {field.icon}
          </span>
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.key]}
            onChange={(e) => {
              if (field.key === 'mobile') {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  updateFormData(field.key, value);
                }
              } else {
                updateFormData(field.key, e.target.value);
              }
            }}
            maxLength={field.key === 'mobile' ? 10 : undefined}
            className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 placeholder-gray-500 focus:border-[#234F83] focus:outline-none"
          />
        </div>
      ))}
    </div>
  </div>
);

/* -------------------- Step 3: Additional Details -------------------- */
const Step3AdditionalDetails = ({ formData, updateFormData }) => (
  <div>
    <h2 className="text-2xl font-bold text-[#234F83] mb-4">
      Additional Details
    </h2>
    <p className="text-gray-700 mb-6">
      Help us personalize your health experience
    </p>

    <div className="space-y-6">
      <div>
        <label className="block text-gray-900 font-semibold mb-3">Gender</label>
        <div className="flex space-x-2">
          {["Male", "Female", "Other"].map((gender) => (
            <button
              key={gender}
              onClick={() => updateFormData("gender", gender)}
              className={`px-6 py-3 rounded-lg border font-medium transition-colors ${
                formData.gender === gender
                  ? "bg-[#234F83] border-[#234F83] text-white"
                  : "bg-white border-gray-400 text-gray-700 hover:border-[#234F83]"
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-900 font-semibold mb-3">
          Date of Birth
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            📅
          </span>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 focus:border-[#234F83] focus:outline-none"
          />
        </div>
        {!formData.dateOfBirth && (
          <p className="text-red-500 text-sm mt-2">
            Please select your date of birth
          </p>
        )}
      </div>
    </div>
  </div>
);

/* -------------------- Step 4: Health Info -------------------- */
const Step4HealthInfo = ({ formData, updateFormData }) => (
  <div>
    <h2 className="text-2xl font-bold text-[#234F83] mb-4">
      Health Information
    </h2>
    <p className="text-gray-700 mb-6">
      This helps us provide better health recommendations
    </p>

    <div className="space-y-4">
      {[
        { icon: "📏", placeholder: "Height (cm)", key: "height" },
        { icon: "⚖️", placeholder: "Weight (kg)", key: "weight" },
      ].map((field) => (
        <div key={field.key} className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {field.icon}
          </span>
          <input
            type="number"
            placeholder={field.placeholder}
            value={formData[field.key]}
            onChange={(e) => updateFormData(field.key, e.target.value)}
            className="w-full bg-white border border-gray-400 rounded-lg px-12 py-4 text-gray-900 placeholder-gray-500 focus:border-[#234F83] focus:outline-none"
          />
        </div>
      ))}

      {formData.bmi > 0 && (
        <div className="bg-[#f0f6fc] border border-[#234F83] rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-[#234F83] mr-3">📊</span>
            <div>
              <p className="text-gray-700 text-sm">Your BMI</p>
              <p className="text-[#234F83] text-2xl font-bold">{formData.bmi}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

/* -------------------- Step 5: OTP Verification -------------------- */
const Step5OTPVerification = ({ formData }) => (
  <div>
    <h2 className="text-2xl font-bold text-[#234F83] mb-4">Verify OTP</h2>
    <p className="text-gray-700 mb-6">
      We've sent a 4-digit OTP to {formData.mobile}
    </p>

    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <span className="text-[#234F83] mr-3">📱</span>
        <div>
          <p className="text-gray-600 text-sm">Mobile Number</p>
          <p className="text-gray-900 font-semibold">{formData.mobile}</p>
        </div>
      </div>
    </div>

    <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center mb-6">
      <span className="text-[#234F83] text-4xl mb-4 block">👤</span>
      <h3 className="text-[#234F83] font-semibold text-lg mb-2">
        Ready to Register
      </h3>
      <p className="text-gray-700 text-sm">
        Click the button below to create your account. We'll send an OTP to
        verify your mobile number.
      </p>
    </div>
  </div>
);

/* -------------------- Main Signup Page -------------------- */
const SignupPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    bmi: 0,
    otp: "",
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "height" || field === "weight") {
        const height = parseFloat(updated.height);
        const weight = parseFloat(updated.weight);
        if (height > 0 && weight > 0) {
          const bmi = weight / (height / 100) ** 2;
          updated.bmi = Math.round(bmi * 10) / 10;
        }
      }

      return updated;
    });
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const register = () => navigate("/dashboard");

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Welcome />;
      case 2:
        return (
          <Step2PersonalDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <Step3AdditionalDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <Step4HealthInfo
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return <Step5OTPVerification formData={formData} />;
      default:
        return <Step1Welcome />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="flex justify-center items-center">
          <div className="mb-3 w-[100px] bg-[#234F83] p-2 rounded-xl">
            <img
              src="/cosco.png"
              alt="Hospo Logo"
              width="250"
              height="250"
              className="object-contain w-40 h-auto"
            />
          </div>
        </div>
        <div className="text-center mb-8">
          <p className="text-gray-600">Create your account in just a few steps</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        <div className="bg-white shadow-md rounded-2xl p-6 mb-6 border border-gray-200">
          {renderStep()}
        </div>

        <div
          className={`${
            currentStep === 1 ? "w-full" : "flex justify-between items-center"
          } mb-4`}
        >
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Previous
            </button>
          )}

          <button
            onClick={currentStep === 5 ? register : nextStep}
            className={`px-8 py-3 bg-[#234F83] text-white rounded-lg font-medium hover:bg-[#1d3f6a] transition-colors ${
              currentStep === 1 ? "w-full" : ""
            }`}
          >
            {currentStep === 5 ? "Register" : "Next"}
          </button>
        </div>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/" className="text-[#234F83] hover:text-[#1d3f6a]">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
