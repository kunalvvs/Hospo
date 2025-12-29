import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getUserData } from '../services/api';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [groupedCart, setGroupedCart] = useState({});
  const user = getUserData();

  useEffect(() => {
    // Get cart from localStorage
    const savedCart = localStorage.getItem('medicineCart');
    
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      
      // Group items by chemist
      const grouped = parsedCart.reduce((acc, item) => {
        const chemistId = item.chemistId || 'unknown';
        if (!acc[chemistId]) {
          acc[chemistId] = {
            chemist: item.chemistInfo,
            items: []
          };
        }
        acc[chemistId].items.push(item);
        return acc;
      }, {});
      setGroupedCart(grouped);
    }
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('medicineCart', JSON.stringify(newCart));
  };

  const handleQuantityChange = (medicineId, change) => {
    const newCart = cart.map(item => {
      if (item._id === medicineId) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0 && newQuantity <= item.maxQuantity) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });
    updateCart(newCart);
    
    // Update grouped cart for real-time UI update
    const grouped = newCart.reduce((acc, item) => {
      const chemistId = item.chemistId || 'unknown';
      if (!acc[chemistId]) {
        acc[chemistId] = {
          chemist: item.chemistInfo,
          items: []
        };
      }
      acc[chemistId].items.push(item);
      return acc;
    }, {});
    setGroupedCart(grouped);
  };

  const handleRemoveItem = (medicineId) => {
    const newCart = cart.filter(item => item._id !== medicineId);
    updateCart(newCart);
    toast.success('Item removed from cart');
    
    // Regroup cart after removal
    const grouped = newCart.reduce((acc, item) => {
      const chemistId = item.chemistId || 'unknown';
      if (!acc[chemistId]) {
        acc[chemistId] = {
          chemist: item.chemistInfo,
          items: []
        };
      }
      acc[chemistId].items.push(item);
      return acc;
    }, {});
    setGroupedCart(grouped);
  };

  const handleClearCart = () => {
    updateCart([]);
    setGroupedCart({});
    toast.success('Cart cleared');
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    navigate('/checkout');
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalDiscount = cart.reduce((total, item) => {
    const discount = item.mrp - item.price;
    return total + (discount * item.quantity);
  }, 0);
  
  // Calculate total delivery charge across all chemists
  const deliveryCharge = Object.values(groupedCart).reduce((total, { chemist }) => {
    return total + (chemist?.homeDelivery ? 30 : 0);
  }, 0);
  
  const totalAmount = subtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pb-20">
        <div className="bg-dblue p-4 pt-8">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="text-white mr-3">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-white">Cart</h1>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add medicines to your cart to proceed</p>
          <button
            onClick={() => navigate('/chemist')}
            className="bg-dblue text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse Chemists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-60">
      {/* Header */}
      <div className="bg-dblue p-4  sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="text-white mr-3">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-white">Cart ({cart.length} items)</h1>
          </div>
          <button
            onClick={handleClearCart}
            className="text-white text-sm underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Cart Items Grouped by Chemist */}
      <div className="px-4 py-4">
        {Object.entries(groupedCart).map(([chemistId, { chemist, items }]) => (
          <div key={chemistId} className="mb-6">
            {/* Chemist Info Header */}
            {chemist && (
              <div className="bg-white p-4 mb-3 shadow-sm rounded-lg border-l-4 border-dblue">
                <p className="text-sm text-gray-600">Ordering from</p>
                <h3 className="font-semibold text-gray-800 text-lg">{chemist.pharmacyName}</h3>
                <p className="text-xs text-gray-500">{chemist.locality}, {chemist.city}</p>
                {chemist.homeDelivery && (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Home Delivery Available
                  </span>
                )}
              </div>
            )}

            {/* Medicines from this Chemist */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex gap-3">
                    {/* Medicine Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.mainImage ? (
                        <img
                          src={item.mainImage}
                          alt={item.medicineName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                          💊
                        </div>
                      )}
                    </div>

                    {/* Medicine Details */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">
                        {item.medicineName}
                      </h4>
                      {item.strength && (
                        <p className="text-xs text-gray-500 mb-2">{item.strength}</p>
                      )}

                      {/* Price */}
                      <div className="flex items-center mb-2">
                        <span className="text-blue-600 font-bold mr-2">₹{item.price}</span>
                        {item.mrp > item.price && (
                          <span className="text-gray-400 line-through text-xs">₹{item.mrp}</span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-dblue rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item._id, -1)}
                            disabled={item.quantity <= 1}
                            className="text-white px-3 py-1 disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, 1)}
                            disabled={item.quantity >= item.maxQuantity}
                            className="text-white px-3 py-1 disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-600 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="mt-3 pt-3 border-t flex justify-between">
                    <span className="text-sm text-gray-600">Item Total</span>
                    <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chemist Subtotal */}
            <div className="bg-blue-50 p-3 mt-3 rounded-lg border border-blue-100">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
                <span className="font-semibold text-blue-600">
                  ₹{items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Summary - Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg ">
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Bill Summary</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({cart.length} items)</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600 font-medium">-₹{totalDiscount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Charge</span>
              <span className="font-medium">
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold text-gray-800">Total Amount</span>
              <span className="font-bold text-dblue text-lg">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full bg-dblue text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
