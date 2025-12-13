import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, MapPin, Phone } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  const orders = {
    active: [
      {
        id: 'ORD001',
        items: [
          { name: 'Paracetamol 500mg', quantity: 2, price: 30 },
          { name: 'Vitamin D3 Tablets', quantity: 1, price: 450 }
        ],
        totalAmount: 510,
        orderDate: '22 Jun 2025',
        expectedDelivery: '24 Jun 2025',
        status: 'in_transit',
        deliveryAddress: 'House No. 123, Sector 45, Delhi - 110001',
        trackingSteps: [
          { label: 'Order Placed', completed: true, time: '22 Jun, 10:30 AM' },
          { label: 'Order Confirmed', completed: true, time: '22 Jun, 11:00 AM' },
          { label: 'Shipped', completed: true, time: '23 Jun, 09:15 AM' },
          { label: 'Out for Delivery', completed: false, time: '' },
          { label: 'Delivered', completed: false, time: '' }
        ]
      },
      {
        id: 'ORD002',
        items: [
          { name: 'Crocin Advance', quantity: 1, price: 25 }
        ],
        totalAmount: 25,
        orderDate: '23 Jun 2025',
        expectedDelivery: '25 Jun 2025',
        status: 'processing',
        deliveryAddress: 'House No. 123, Sector 45, Delhi - 110001',
        trackingSteps: [
          { label: 'Order Placed', completed: true, time: '23 Jun, 03:20 PM' },
          { label: 'Order Confirmed', completed: true, time: '23 Jun, 03:45 PM' },
          { label: 'Shipped', completed: false, time: '' },
          { label: 'Out for Delivery', completed: false, time: '' },
          { label: 'Delivered', completed: false, time: '' }
        ]
      }
    ],
    completed: [
      {
        id: 'ORD003',
        items: [
          { name: 'Dolo 650', quantity: 2, price: 60 },
          { name: 'Cough Syrup', quantity: 1, price: 120 }
        ],
        totalAmount: 180,
        orderDate: '15 Jun 2025',
        deliveredDate: '17 Jun 2025',
        status: 'delivered',
        deliveryAddress: 'House No. 123, Sector 45, Delhi - 110001'
      },
      {
        id: 'ORD004',
        items: [
          { name: 'Calcium Tablets', quantity: 1, price: 350 }
        ],
        totalAmount: 350,
        orderDate: '10 Jun 2025',
        deliveredDate: '12 Jun 2025',
        status: 'delivered',
        deliveryAddress: 'House No. 123, Sector 45, Delhi - 110001'
      }
    ],
    cancelled: [
      {
        id: 'ORD005',
        items: [
          { name: 'Multivitamin Pack', quantity: 1, price: 600 }
        ],
        totalAmount: 600,
        orderDate: '08 Jun 2025',
        cancelledDate: '09 Jun 2025',
        status: 'cancelled',
        cancelReason: 'Ordered by mistake'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_transit':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
            Order #{order.id}
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            Placed on {order.orderDate}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium w-fit ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <div className="flex-1">
              <p className="text-sm md:text-base text-gray-800 font-medium">{item.name}</p>
              <p className="text-xs md:text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm md:text-base font-semibold text-gray-800">₹{item.price}</p>
          </div>
        ))}
      </div>

      {/* Total Amount */}
      <div className="flex justify-between items-center py-3 border-t border-b mb-4">
        <span className="text-sm md:text-base font-semibold text-gray-800">Total Amount</span>
        <span className="text-lg md:text-xl font-bold text-blue-600">₹{order.totalAmount}</span>
      </div>

      {/* Delivery Address */}
      {order.deliveryAddress && (
        <div className="mb-4">
          <div className="flex items-start text-sm md:text-base text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-1" />
            <span>{order.deliveryAddress}</span>
          </div>
        </div>
      )}

      {/* Tracking Steps for Active Orders */}
      {order.status === 'in_transit' && order.trackingSteps && (
        <div className="mb-4 bg-blue-50 rounded-xl p-4">
          <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-3">Order Tracking</h4>
          <div className="space-y-3">
            {order.trackingSteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex flex-col items-center mr-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  {index < order.trackingSteps.length - 1 && (
                    <div className={`w-0.5 h-8 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm md:text-base font-medium ${
                    step.completed ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  {step.time && (
                    <p className="text-xs md:text-sm text-gray-600">{step.time}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expected/Delivered Date */}
      {order.expectedDelivery && order.status !== 'cancelled' && (
        <div className="flex items-center text-sm md:text-base text-gray-700 mb-4">
          <Clock className="w-4 h-4 mr-2 text-blue-600" />
          <span>
            {order.status === 'delivered' 
              ? `Delivered on ${order.deliveredDate}`
              : `Expected delivery: ${order.expectedDelivery}`}
          </span>
        </div>
      )}

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
              <OrderCard key={order.id} order={order} />
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
      </div>

      <BottomNav />
    </div>
  );
};

export default MyOrdersPage;
