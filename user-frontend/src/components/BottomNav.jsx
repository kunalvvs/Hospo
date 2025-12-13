import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Pill, Ambulance, TestTube, Hospital } from 'lucide-react';
import { IoHomeOutline } from "react-icons/io5";

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-3">
        <Link to="/dashboard" className="flex flex-col items-center gap-1">
          <IoHomeOutline className="w-5 h-5 text-black" />
          <span className="text-xs text-black font-medium">Home</span>
        </Link>
        <Link to="/doctors" className="flex flex-col items-center gap-1">
          <Stethoscope className="w-5 h-5 text-black" />
          <span className="text-xs text-black">Doctor</span>
        </Link>
        <Link to="/chemist" className="flex flex-col items-center gap-1">
          <Pill className="w-5 h-5 text-black" />
          <span className="text-xs text-black">Chemist</span>
        </Link>
        <Link to="/hospital" className="flex flex-col items-center gap-1">
          <Hospital className="w-5 h-5 text-black" />
          <span className="text-xs text-black">Hospitals</span>
        </Link>
        <Link to="/pathlab" className="flex flex-col items-center gap-1">
          <TestTube className="w-5 h-5 text-black" />
          <span className="text-xs text-black">Pathology</span>
        </Link>
        <Link to="/ambulance" className="flex flex-col items-center gap-1">
          <Ambulance className="w-5 h-5 text-black" />
          <span className="text-xs text-black">Ambulance</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
