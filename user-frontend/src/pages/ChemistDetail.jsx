import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  ShoppingCart,
  Search,
} from "lucide-react";
import { chemistAPI, getUserData } from "../services/api";
import { toast } from "react-hot-toast";

const ChemistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chemist, setChemist] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState("");

  const user = getUserData();

  useEffect(() => {
    fetchChemistDetails();
    fetchAvailability();
    fetchRatings();
    loadCartFromStorage();
  }, [id]);

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('medicineCart');
    const savedChemist = localStorage.getItem('cartChemist');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Only load cart if it's from the same chemist
      if (savedChemist && JSON.parse(savedChemist)._id === id) {
        setCart(parsedCart);
      }
    }
  };

  const saveCartToStorage = (newCart) => {
    localStorage.setItem('medicineCart', JSON.stringify(newCart));
    if (chemist) {
      localStorage.setItem('cartChemist', JSON.stringify({
        _id: chemist._id,
        pharmacyName: chemist.pharmacyName,
        locality: chemist.locality,
        city: chemist.city,
        homeDelivery: chemist.homeDelivery
      }));
    }
  };

  const fetchChemistDetails = async () => {
    try {
      setLoading(true);
      const response = await chemistAPI.getChemistById(id);
      if (response.success) {
        setChemist(response.data);
      }
    } catch (error) {
      console.error("Error fetching chemist details:", error);
      toast.error("Failed to load chemist details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await chemistAPI.checkAvailability(id);
      if (response.success) {
        setAvailability(response.data);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await chemistAPI.getRatings(id);
      if (response.success) {
        setRatings(response.data);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleAddToCart = (medicine) => {
    const existingItem = cart.find((item) => item._id === medicine._id);

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item._id === medicine._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...medicine, quantity: 1, maxQuantity: medicine.quantity }];
    }
    setCart(newCart);
    saveCartToStorage(newCart);
    toast.success("Added to cart");
  };

  const handleRemoveFromCart = (medicineId) => {
    const existingItem = cart.find((item) => item._id === medicineId);

    let newCart;
    if (existingItem.quantity > 1) {
      newCart = cart.map((item) =>
        item._id === medicineId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    } else {
      newCart = cart.filter((item) => item._id !== medicineId);
    }
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const showMedicineDetail = (medicine) => {
    setSelectedMedicine(medicine);
    setShowMedicineModal(true);
  };

  const handleSubmitRating = async () => {
    if (!user) {
      toast.error("Please login to rate");
      navigate("/login");
      return;
    }

    try {
      await chemistAPI.addRating(id, newRating, newReview);
      toast.success("Rating submitted successfully");
      setShowRatingModal(false);
      setNewRating(5);
      setNewReview("");
      fetchRatings();
      fetchChemistDetails();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating");
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // Navigate to cart page
    navigate('/cart');
  };

  const filteredMedicines = chemist?.inventory?.filter((medicine) => {
    const matchesSearch =
      searchQuery === "" ||
      medicine.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || medicine.category === selectedCategory;

    return matchesSearch && matchesCategory && medicine.productStatus === "active";
  });

  const categories = [
    "all",
    ...new Set(
      chemist?.inventory
        ?.filter((m) => m.productStatus === "active")
        .map((m) => m.category) || []
    ),
  ];

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!chemist) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Chemist not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="bg-dblue p-1 sticky top-0 z-10 shadow-md">
        <div className="flex items-center mb-1">
          <button
            onClick={() => navigate(-1)}
            className="text-white mr-3 hover:bg-white/10 p-2 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-white flex-1">
            {chemist.pharmacyName}
          </h1>
          <button
            onClick={() => navigate("/cart")}
            className="relative text-white hover:bg-white/10 p-2 rounded-lg"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Chemist Info Card */}
      <div className="bg-white p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              {chemist.pharmacyName}
            </h2>

            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                {chemist.shopNumber} {chemist.building}, {chemist.locality}, {chemist.city},{" "}
                {chemist.state} - {chemist.pin}
              </span>
            </div>

            {chemist.primaryPhone && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Phone className="w-4 h-4 mr-1" />
                <a
                  href={`tel:${chemist.primaryPhone}`}
                  className="text-blue-600 hover:underline"
                >
                  {chemist.primaryPhone}
                </a>
              </div>
            )}

            {chemist.email && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Mail className="w-4 h-4 mr-1" />
                <a
                  href={`mailto:${chemist.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {chemist.email}
                </a>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
              <span className="font-semibold">{chemist.rating || 0}</span>
              <span className="text-sm text-gray-500 ml-1">
                ({chemist.totalReviews || 0} reviews)
              </span>
              <button
                onClick={() => setShowRatingModal(true)}
                className="ml-4 text-sm text-blue-600 hover:underline"
              >
                Rate Now
              </button>
            </div>
          </div>

          {/* Status Badge */}
          {availability && (
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                availability.is24x7 || availability.isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <Clock className="w-3 h-3 mr-1" />
              {availability.is24x7
                ? "24x7"
                : availability.isOpen
                ? "Open"
                : "Closed"}
            </div>
          )}
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 pt-3 border-t">
          {chemist.homeDelivery && (
            <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
              🚚 Home Delivery
            </span>
          )}
          {chemist.sameDayDelivery && (
            <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
              ⚡ Same Day Delivery
            </span>
          )}
          {chemist.cashOnDelivery && (
            <span className="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full">
              💵 COD Available
            </span>
          )}
          {chemist.onlineOrdering && (
            <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">
              🛒 Online Ordering
            </span>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-lg pl-10 pr-4 py-3 border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-dblue text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {category === "all" ? "All" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines Grid */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Available Medicines ({filteredMedicines?.length || 0})
        </h3>

        {filteredMedicines && filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredMedicines.map((medicine) => {
              const cartItem = cart.find((item) => item._id === medicine._id);

              return (
                <div
                  key={medicine._id}
                  className="bg-white rounded-lg p-3 shadow-sm"
                >
                  {/* Medicine Image - Clickable */}
                  <div 
                    onClick={() => showMedicineDetail(medicine)}
                    className="bg-gray-100 rounded-lg mb-3 h-32 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80"
                  >
                    {medicine.mainImage ? (
                      <img
                        src={medicine.mainImage}
                        alt={medicine.medicineName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-4xl">💊</div>
                    )}
                  </div>

                  {/* Medicine Details - Clickable */}
                  <div onClick={() => showMedicineDetail(medicine)} className="cursor-pointer">
                    <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                      {medicine.medicineName}
                    </h4>
                    {medicine.strength && (
                      <p className="text-xs text-gray-500 mb-2">
                        {medicine.strength}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-2">
                    <span className="text-blue-600 font-bold mr-2">
                      ₹{medicine.price}
                    </span>
                    {medicine.mrp > medicine.price && (
                      <>
                        <span className="text-gray-400 line-through text-xs">
                          ₹{medicine.mrp}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="mb-2">
                    {medicine.quantity > 0 ? (
                      <span className="text-xs text-green-600">
                        In Stock ({medicine.quantity})
                      </span>
                    ) : (
                      <span className="text-xs text-red-600">Out of Stock</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  {cartItem ? (
                    <div className="flex items-center justify-between bg-dblue rounded-lg text-white">
                      <button
                        onClick={() => handleRemoveFromCart(medicine._id)}
                        className="px-3 py-2 font-bold"
                      >
                        -
                      </button>
                      <span className="font-semibold">{cartItem.quantity}</span>
                      <button
                        onClick={() => handleAddToCart(medicine)}
                        className="px-3 py-2 font-bold"
                        disabled={cartItem.quantity >= medicine.quantity}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(medicine)}
                      disabled={medicine.quantity === 0}
                      className={`w-full py-2 rounded-lg font-semibold ${
                        medicine.quantity > 0
                          ? "bg-dblue text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">No medicines found</p>
        )}
      </div>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">
                {cart.length} items in cart
              </p>
              <p className="text-lg font-bold text-gray-800">
                Total: ₹{cartTotal.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="bg-dblue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Rate {chemist.pharmacyName}
            </h3>

            {/* Star Rating */}
            <div className="flex items-center justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= newRating
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Review Text */}
            <textarea
              placeholder="Write your review (optional)"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 bg-dblue text-white py-2 rounded-lg font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medicine Detail Modal */}
      {showMedicineModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedMedicine.medicineName}
              </h3>
              <button
                onClick={() => setShowMedicineModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg mb-4 h-64 flex items-center justify-center overflow-hidden">
              {selectedMedicine.mainImage ? (
                <img
                  src={selectedMedicine.mainImage}
                  alt={selectedMedicine.medicineName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-6xl">💊</div>
              )}
            </div>

            {/* Additional Images */}
            {selectedMedicine.additionalImages && selectedMedicine.additionalImages.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">More Images</h4>
                <div className="grid grid-cols-4 gap-2">
                  {selectedMedicine.additionalImages.map((img, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg h-20 overflow-hidden">
                      <img
                        src={img}
                        alt={`${selectedMedicine.medicineName} ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                        onClick={() => {
                          setSelectedMedicine({
                            ...selectedMedicine,
                            mainImage: img
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medicine Details */}
            <div className="space-y-3">
              {selectedMedicine.genericName && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Generic Name:</span>
                  <p className="text-gray-800">{selectedMedicine.genericName}</p>
                </div>
              )}

              {selectedMedicine.manufacturer && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Manufacturer:</span>
                  <p className="text-gray-800">{selectedMedicine.manufacturer}</p>
                </div>
              )}

              {selectedMedicine.formulation && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Formulation:</span>
                  <p className="text-gray-800 capitalize">{selectedMedicine.formulation}</p>
                </div>
              )}

              {selectedMedicine.strength && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Strength:</span>
                  <p className="text-gray-800">{selectedMedicine.strength}</p>
                </div>
              )}

              {selectedMedicine.category && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Category:</span>
                  <p className="text-gray-800 capitalize">{selectedMedicine.category}</p>
                </div>
              )}

              {selectedMedicine.subCategory && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Sub-Category:</span>
                  <p className="text-gray-800 capitalize">{selectedMedicine.subCategory}</p>
                </div>
              )}

              {selectedMedicine.expiryDate && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Expiry Date:</span>
                  <p className="text-gray-800">
                    {new Date(selectedMedicine.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedMedicine.batchNumber && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Batch Number:</span>
                  <p className="text-gray-800">{selectedMedicine.batchNumber}</p>
                </div>
              )}

              <div className="border-t pt-3">
                <span className="text-sm font-semibold text-gray-600">Prescription Required:</span>
                <p className={`font-semibold ${selectedMedicine.prescriptionRequired ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedMedicine.prescriptionRequired ? 'Yes - Prescription Needed' : 'No - Available OTC'}
                </p>
              </div>

              {/* Price Section */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-600">₹{selectedMedicine.price}</span>
                  {selectedMedicine.mrp > selectedMedicine.price && (
                    <div>
                      <span className="text-gray-400 line-through mr-2">₹{selectedMedicine.mrp}</span>
                      <span className="text-green-600 font-semibold">
                        {Math.round(((selectedMedicine.mrp - selectedMedicine.price) / selectedMedicine.mrp) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {selectedMedicine.quantity > 0 ? (
                    <span className="text-green-600">In Stock ({selectedMedicine.quantity} available)</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </p>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  handleAddToCart(selectedMedicine);
                  setShowMedicineModal(false);
                }}
                disabled={selectedMedicine.quantity === 0}
                className={`w-full py-3 rounded-lg font-semibold ${
                  selectedMedicine.quantity > 0
                    ? 'bg-dblue text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedMedicine.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChemistDetail;
