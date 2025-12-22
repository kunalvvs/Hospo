import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, MapPin, Phone } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { chemistAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState({ active: [], completed: [], cancelled: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await chemistAPI.getMyOrders();
      if (response.success) {
        // Categorize orders by status
        const active = [];
        const completed = [];
        const cancelled = [];

        response.data.forEach(order => {
          if (order.status === 'delivered') {
            completed.push(order);
          } else if (order.status === 'cancelled' || order.status === 'rejected') {
            cancelled.push(order);
          } else {
            active.push(order);
          }
        });

        setOrders({ active, completed, cancelled });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'out-for-delivery':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
      case 'accepted':
      case 'processing':
      case 'ready':
        return 'bg-yellow-100 text-yellow-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'processing':
        return 'Processing';
      case 'ready':
        return 'Ready for Pickup';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'rejected':
        return 'Rejected';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in_transit':
        return 'In Transit';
      case 'processing':
        return 'Processing';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-4 hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">
            Order #{order.orderNumber}
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            Placed on {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium w-fit ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        {order.medicines.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <div className="flex-1">
              <p className="text-sm md:text-base text-gray-800 font-medium">{item.medicineName}</p>
              <p className="text-xs md:text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm md:text-base font-semibold text-gray-800">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Total Amount */}
      <div className="flex justify-between items-center py-3 border-t border-b mb-4">
        <span className="text-sm md:text-base font-semibold text-gray-800">Total Amount</span>
        <span className="text-lg md:text-xl font-bold text-blue-600">₹{order.totalAmount}</span>
      </div>

      {/* Chemist Info */}
      {order.chemist && (
        <div className="mb-4">
          <div className="flex items-start text-sm md:text-base text-gray-700">
            <Package className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">{order.chemist.pharmacyName}</p>
              <p className="text-xs text-gray-600">{order.chemist.locality}, {order.chemist.city}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Address */}
      {order.deliveryAddress && (
        <div className="mb-4">
          <div className="flex items-start text-sm md:text-base text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-1" />
            <span>
              {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </span>
          </div>
        </div>
      )}

      {/* Order Date */}
      <div className="flex items-center text-sm md:text-base text-gray-700 mb-4">
        <Clock className="w-4 h-4 mr-2 text-blue-600" />
        <span>
          {order.status === 'delivered' && order.deliveredAt
            ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
            : `Ordered on ${new Date(order.orderDate).toLocaleDateString()}`}
        </span>
      </div>

      {/* Cancel Reason */}
      {order.status === 'cancelled' && order.cancelReason && (
        <div className="bg-red-50 rounded-xl p-3 mb-4">
          <p className="text-xs md:text-sm text-red-700">
            <strong>Cancellation Reason:</strong> {order.cancelReason}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        {order.status === 'in_transit' && (
          <>
            <button className="flex-1 bg-[#234f83] text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-blue-700 transition-colors">
              Track Order
            </button>
            <button className="flex-1 bg-red-100 text-red-600 py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-red-200 transition-colors">
              Cancel Order
            </button>
          </>
        )}
        
        {order.status === 'processing' && (
          <button className="w-full bg-red-600 text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-red-700 transition-colors">
            Cancel Order
          </button>
        )}

        {order.status === 'delivered' && (
          <>
            <button className="flex-1 bg-green-600 text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-green-700 transition-colors">
              Download Invoice
            </button>
            <button className="flex-1 bg-blue-100 text-blue-600 py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-blue-200 transition-colors">
              Reorder
            </button>
          </>
        )}

        {order.status === 'cancelled' && (
          <button className="w-full bg-[#234f83] text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-blue-700 transition-colors">
            Order Again
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#234f83] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-purple-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium text-sm md:text-base">Back</span>
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">My Orders</h1>
          <p className="text-sm md:text-base text-purple-100 mt-2">Track and manage your medicine orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dblue"></div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm p-2 mb-6 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                    activeTab === 'active'
                      ? 'bg-[#234f83] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Active ({orders.active.length})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                    activeTab === 'completed'
                      ? 'bg-[#234f83] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Completed ({orders.completed.length})
                </button>
                <button
                  onClick={() => setActiveTab('cancelled')}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                    activeTab === 'cancelled'
                      ? 'bg-[#234f83] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Cancelled ({orders.cancelled.length})
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div>
              {orders[activeTab].length > 0 ? (
                orders[activeTab].map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">No Orders</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-6">You don't have any {activeTab} orders</p>
                  <button
                    onClick={() => navigate('/chemist')}
                    className="bg-[#234f83] text-white py-3 px-6 rounded-lg font-medium text-sm md:text-base hover:bg-purple-700 transition-colors"
                  >
                    Order Medicines
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MyOrdersPage;
