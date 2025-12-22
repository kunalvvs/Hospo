import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Upload, CreditCard, Wallet, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { chemistAPI, getUserData } from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [chemist, setChemist] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [prescriptionImage, setPrescriptionImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [customerNotes, setCustomerNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  
  const user = getUserData();

  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    const savedCart = localStorage.getItem('medicineCart');
    const savedChemist = localStorage.getItem('cartChemist');
    
    if (!savedCart || JSON.parse(savedCart).length === 0) {
      toast.error('Cart is empty');
      navigate('/cart');
      return;
    }

    setCart(JSON.parse(savedCart));
    if (savedChemist) {
      setChemist(JSON.parse(savedChemist));
    }

    // Pre-fill user address if available
    if (user && user.address) {
      setDeliveryAddress({
        street: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || ''
      });
    }
  }, [navigate]);

  const requiresPrescription = cart.some(item => item.prescriptionRequired);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload to your backend/cloudinary
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setPrescriptionImage(data.url);
        toast.success('Prescription uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
      toast.error('Please fill all address fields');
      return;
    }

    if (requiresPrescription && !prescriptionImage) {
      toast.error('Prescription required for some medicines');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setPlacing(true);

    try {
      const orderData = {
        chemistId: chemist._id,
        medicines: cart.map(item => ({
          productId: item.productId,
          medicineName: item.medicineName,
          quantity: item.quantity,
          price: item.price,
          mrp: item.mrp,
          discount: item.mrp - item.price,
          prescriptionRequired: item.prescriptionRequired || false
        })),
        prescriptionImage: prescriptionImage || '',
        deliveryType: 'home-delivery',
        paymentMethod,
        deliveryAddress,
        customerNotes
      };

      const response = await chemistAPI.placeOrder(orderData);
      
      if (response.success) {
        toast.success('Order placed successfully!');
        
        // Clear cart
        localStorage.removeItem('medicineCart');
        localStorage.removeItem('cartChemist');
        
        // Navigate to orders page
        navigate('/orders');
      } else {
        toast.error(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalDiscount = cart.reduce((total, item) => {
    const discount = item.mrp - item.price;
    return total + (discount * item.quantity);
  }, 0);
  const deliveryCharge = chemist?.homeDelivery ? 30 : 0;
  const totalAmount = subtotal + deliveryCharge;

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="w-5 h-5" />;
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'upi':
      case 'wallet':
        return <Wallet className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'cash':
        return 'Cash on Delivery';
      case 'card':
        return 'Credit/Debit Card';
      case 'upi':
        return 'UPI Payment';
      case 'wallet':
        return 'Digital Wallet';
      default:
        return method.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      {/* Header */}
      <div className="bg-dblue p-4  sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="text-white mr-3">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-white">Checkout</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Chemist Info */}
        {chemist && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Ordering from</h3>
            <p className="font-medium">{chemist.pharmacyName}</p>
            <p className="text-sm text-gray-600">{chemist.locality}, {chemist.city}</p>
          </div>
        )}

        {/* Delivery Address */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <MapPin className="w-5 h-5 text-dblue mr-2" />
            <h3 className="font-semibold text-gray-800">Delivery Address</h3>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Street Address"
              value={deliveryAddress.street}
              onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={deliveryAddress.city}
                onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="State"
                value={deliveryAddress.state}
                onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            
            <input
              type="text"
              placeholder="Pincode"
              value={deliveryAddress.pincode}
              onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Prescription Upload (if required) */}
        {requiresPrescription && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <Upload className="w-5 h-5 text-dblue mr-2" />
              <h3 className="font-semibold text-gray-800">Upload Prescription</h3>
              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Required</span>
            </div>
            
            {prescriptionImage ? (
              <div className="relative">
                <img src={prescriptionImage} alt="Prescription" className="w-full h-40 object-cover rounded-lg" />
                <button
                  onClick={() => setPrescriptionImage('')}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-dblue">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload prescription</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading && <span className="text-xs text-blue-600 mt-2">Uploading...</span>}
              </label>
            )}
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
          
          <div className="space-y-2">
            {chemist?.paymentMethods?.map((method) => (
              <label
                key={method}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === method ? 'border-dblue bg-blue-50' : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  {getPaymentMethodIcon(method)}
                  <span className="ml-2">{getPaymentMethodLabel(method)}</span>
                </div>
              </label>
            )) || (
              // Default payment methods if chemist hasn't set any
              <>
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-dblue bg-blue-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>Cash on Delivery</span>
                </label>
                
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-dblue bg-blue-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Wallet className="w-5 h-5 mr-2" />
                  <span>UPI Payment</span>
                </label>
                
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-dblue bg-blue-50' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 mr-2" />
                  <span>Credit/Debit Card</span>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Additional Notes (Optional)</h3>
          <textarea
            placeholder="Add any special instructions for delivery..."
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            rows={3}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
          
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.medicineName} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-t pt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-₹{totalDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charge</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Amount</span>
                <span className="text-dblue text-lg">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button - Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="w-full bg-dblue text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {placing ? 'Placing Order...' : `Place Order (₹${totalAmount.toFixed(2)})`}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
