import React, { useState } from "react";
import {
  Search,
  Clock,
  Plus,
  Navigation,
  Package,
  Droplet,
  Heart,
  Star,
  User,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { BsFillBuildingsFill, BsFillSendFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const PathlabPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Blood Tests", "Diabetes", "Liver", "Thyroid"];

  const quickActions = [
    {
      icon: Plus,
      label: "Book Test",
      color: "bg-blue-500 border-blue-500/30",
      link: "/pathlab/booktest",
    },
    {
      icon: Navigation,
      label: "Find Lab",
      color: "bg-teal-500 border-teal-500/30",
    },
    {
      icon: Package,
      label: "Packages",
      color: "bg-green-500 border-green-500/30",
    },
  ];

  const nearbylabs = [
    {
      title: "HealthCare Diagnostics",
      rating: 4.5,
      reviews: 123,
      distance: "1.2 Km",
      status: "Open",
    },
    {
      title: "BrainCare Diagnostics",
      rating: 4.5,
      reviews: 123,
      distance: "1.2 Km",
      status: "Open",
    },
  ];

  const availableTests = [
    {
      id: 1,
      name: "Complete Blood Count",
      duration: "24 hours",
      price: "₹599",
      icon: Droplet,
      color: "bg-red-500/20",
      iconColor: "text-red-400",
    },
    {
      id: 2,
      name: "Diabetes Screening",
      duration: "6 hours",
      price: "₹299",
      icon: Heart,
      color: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    {
      id: 3,
      name: "Liver Function Test",
      duration: "12 hours",
      price: "₹799",
      icon: Star,
      color: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      id: 4,
      name: "Thyroid Profile",
      duration: "24 hours",
      price: "₹499",
      icon: User,
      color: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
    },
    {
      id: 5,
      name: "Kidney Funtion Test",
      duration: "24 hours",
      price: "₹699",
      icon: User,
      color: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      id: 6,
      name: "Lipid Profile",
      duration: "12 hours",
      price: "₹399",
      icon: Heart,
      color: "bg-green-500/20",
      iconColor: "text-green-300",
    }
  ];

  return (
    <div className="min-h-screen bg-white text-white pb-20">
      <div className="bg-dblue p-4 pt-8 sticky top-0 z-10">
        <Header title="PathLab" />

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for doctors, specializations..."
            className="w-full bg-white text-black rounded-lg pl-12 pr-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 pb-4 pt-8">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-dblue text-white"
                  : "bg-white text-black border border-gray-700 shadow-md"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-3 pb-6">
        <h2 className="text-lg font-semibold mb-3 text-black">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const ButtonComponent = action.link ? Link : 'button';
            return (
              <ButtonComponent
                key={index}
                to={action.link}
                className={`${action.color} border rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform`}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100/30 border border-gray-100 p-2 rounded-xl">
                  <Icon className="w-8 h-8" />
                </div>
                <span className="text-xs font-medium pb-1">{action.label}</span>
              </ButtonComponent>
            );
          })}
        </div>
      </div>

      {/* Available Tests */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">Available Tests</h2>
          <button className="text-blue-500 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {availableTests.map((test) => {
            const Icon = test.icon;
            return (
              <div
                key={test.id}
                className="bg-white border shadow-md border-gray-700 rounded-2xl  hover:border-gray-600 transition-colors"
              >
                <div
                  className={`${test.color} w-full h-16 rounded-t-2xl flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-8 h-8 ${test.iconColor}`} />
                </div>

                <div className="px-3 pb-3">
                  <h3 className="font-medium text-sm mb-4 text-black leading-tight">
                    {test.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-semibold text-lg">
                      {test.price}
                    </span>
                    <button className="text-blue-500 text-xs font-medium px-3 py-1.5 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors">
                      Book
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">Nearby Labs</h2>
          <button className="text-blue-500 text-sm font-medium">
            View All
          </button>
        </div>

        {nearbylabs.map((item) => {
          return (
            <div
              key={item.title}
              className="flex items-center gap-3 mb-2 bg-white shadow-md border border-gray-700 rounded-xl p-4"
            >
              <div className="flex-shrink-0 p-2 bg-blue-500 rounded-lg text-2xl text-white">
                <BsFillBuildingsFill />
              </div>
              <div className="flex-1">
                <div className="font-bold mb-1 text-[15px] text-black">
                  {item.title}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 w-4 h-4" />
                    <span className="text-sm text-black">{item.rating}</span>
                  </div>
                  <span className="text-xs text-black">
                    ({item.reviews} Reviews)
                  </span>
                </div>
                <div className="flex items-center ">
                  <div className="flex items-center gap-1 text-sm text-gray-300 mr-3">
                    <BsFillSendFill className="w-4 h-4 text-black " />
                    <span className="text-black">{item.distance}</span>
                  </div>
                  <div className="bg-green-500/10  text-green-400 rounded-lg text-xs p-1 ">
                    {item.status}
                  </div>
                </div>
              </div>
              <Link
                to="/pathlab/bookLab"
                className="flex-shrink-0 px-2 py-1 text-xs text-blue-500 border border-blue-500 bg-blue-500/10 rounded-lg font-medium hover:bg-blue-500/20 transition-colors"
              >
                Book
              </Link>
            </div>
          );
        })}
      </div>

      <div>
        <BottomNav />
      </div>
    </div>
  );
};

export default PathlabPage;
