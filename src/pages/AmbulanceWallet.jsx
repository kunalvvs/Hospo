import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AmbulanceWallet.css';

const AmbulanceWallet = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [ambulanceData, setAmbulanceData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock wallet data
  const [walletData] = useState({
    currentBalance: 45750.50,
    pendingAmount: 8900.00,
    totalEarnings: 185640.00,
    thisMonthEarnings: 23400.00,
    lastPayout: 12500.00,
    lastPayoutDate: '2025-11-08',
    nextPayoutDate: '2025-11-15'
  });

  // Mock transaction history
  const [transactions] = useState([
    { id: 1, type: 'earning', patient: 'Rajesh Kumar', amount: 1200, date: '2025-11-13', time: '10:30 AM', status: 'completed', bookingId: 'BK001' },
    { id: 2, type: 'earning', patient: 'Priya Sharma', amount: 2500, date: '2025-11-12', time: '02:15 PM', status: 'completed', bookingId: 'BK002' },
    { id: 3, type: 'payout', amount: 12500, date: '2025-11-08', time: '11:00 AM', status: 'success', reference: 'PAY20251108001' },
    { id: 4, type: 'earning', patient: 'Amit Patel', amount: 1800, date: '2025-11-11', time: '08:45 AM', status: 'completed', bookingId: 'BK003' },
    { id: 5, type: 'earning', patient: 'Sneha Reddy', amount: 3200, date: '2025-11-10', time: '05:20 PM', status: 'completed', bookingId: 'BK004' },
    { id: 6, type: 'payout', amount: 15000, date: '2025-11-01', time: '10:30 AM', status: 'success', reference: 'PAY20251101001' },
    { id: 7, type: 'earning', patient: 'Vikram Singh', amount: 2100, date: '2025-11-09', time: '01:15 PM', status: 'pending', bookingId: 'BK005' },
  ]);

  // Mock payout history
  const [payouts] = useState([
    { id: 1, amount: 12500, date: '2025-11-08', status: 'success', reference: 'PAY20251108001', account: '****4567', method: 'Bank Transfer' },
    { id: 2, amount: 15000, date: '2025-11-01', status: 'success', reference: 'PAY20251101001', account: '****4567', method: 'Bank Transfer' },
    { id: 3, amount: 18500, date: '2025-10-25', status: 'success', reference: 'PAY20251025001', account: '****4567', method: 'Bank Transfer' },
    { id: 4, amount: 14200, date: '2025-10-18', status: 'success', reference: 'PAY20251018001', account: '****4567', method: 'Bank Transfer' },
  ]);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    const ambulanceDataString = localStorage.getItem('ambulanceData');
    
    if (!userString) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userString);
      
      if (userData.role !== 'ambulance') {
        alert('Access denied. This page is only for ambulance services.');
        navigate('/');
        return;
      }

      if (ambulanceDataString) {
        setAmbulanceData(JSON.parse(ambulanceDataString));
      }
      
      setCurrentUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleRequestPayout = () => {
    alert('Payout request submitted! You will receive ₹' + walletData.currentBalance.toFixed(2) + ' within 2-3 working days.');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f7fa'
      }}>
        Loading...
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="ambulance-wallet">
      {/* Header */}
      <header className="wallet-header">
        <button className="back-btn" onClick={() => navigate('/ambulance-dashboard')}>
          ← Back to Dashboard
        </button>
        <div className="wallet-header-content">
          <h1>💳 My Wallet</h1>
          <p>{ambulanceData?.serviceName || 'Ambulance Service'}</p>
        </div>
      </header>

      <div className="wallet-container">
        {/* Balance Card */}
        <div className="balance-section">
          <div className="balance-card main-balance">
            <div className="balance-header">
              <h3>💰 Current Balance</h3>
              <span className="balance-icon">💵</span>
            </div>
            <div className="balance-amount">₹{walletData.currentBalance.toFixed(2)}</div>
            <button className="payout-btn" onClick={handleRequestPayout}>
              Request Payout
            </button>
          </div>

          <div className="balance-grid">
            <div className="balance-card">
              <h4>⏳ Pending Amount</h4>
              <p className="amount pending">₹{walletData.pendingAmount.toFixed(2)}</p>
              <small>Under processing</small>
            </div>
            <div className="balance-card">
              <h4>📊 Total Earnings</h4>
              <p className="amount total">₹{walletData.totalEarnings.toFixed(2)}</p>
              <small>Lifetime earnings</small>
            </div>
            <div className="balance-card">
              <h4>📅 This Month</h4>
              <p className="amount month">₹{walletData.thisMonthEarnings.toFixed(2)}</p>
              <small>November 2025</small>
            </div>
          </div>
        </div>

        {/* Payout Info */}
        <div className="payout-info-card">
          <div className="payout-info-item">
            <span className="label">💸 Last Payout:</span>
            <span className="value">₹{walletData.lastPayout.toFixed(2)} on {walletData.lastPayoutDate}</span>
          </div>
          <div className="payout-info-item">
            <span className="label">📆 Next Scheduled Payout:</span>
            <span className="value">{walletData.nextPayoutDate}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="wallet-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            💳 Transactions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'payouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('payouts')}
          >
            💸 Payouts
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="earnings-chart">
                <h3>📈 Earnings Overview</h3>
                <div className="chart-placeholder">
                  <div className="chart-bars">
                    <div className="chart-bar" style={{ height: '60%' }}>
                      <span className="bar-value">₹5.2k</span>
                      <span className="bar-label">Week 1</span>
                    </div>
                    <div className="chart-bar" style={{ height: '80%' }}>
                      <span className="bar-value">₹7.8k</span>
                      <span className="bar-label">Week 2</span>
                    </div>
                    <div className="chart-bar" style={{ height: '50%' }}>
                      <span className="bar-value">₹4.1k</span>
                      <span className="bar-label">Week 3</span>
                    </div>
                    <div className="chart-bar active" style={{ height: '70%' }}>
                      <span className="bar-value">₹6.3k</span>
                      <span className="bar-label">Week 4</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="quick-stats">
                <h3>📋 Quick Stats</h3>
                <div className="stats-list">
                  <div className="stat-item">
                    <span className="stat-label">🚑 Total Rides Completed</span>
                    <span className="stat-value">247</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">⭐ Average Rating</span>
                    <span className="stat-value">4.8/5.0</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">💰 Average Earning per Ride</span>
                    <span className="stat-value">₹751</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">⏱️ Average Response Time</span>
                    <span className="stat-value">8 mins</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="transactions-content">
              <div className="transactions-header">
                <h3>💳 Transaction History</h3>
                <select className="filter-dropdown">
                  <option>All Transactions</option>
                  <option>Earnings Only</option>
                  <option>Payouts Only</option>
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>

              <div className="transactions-list">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                    <div className="transaction-icon">
                      {transaction.type === 'earning' ? '💵' : '💸'}
                    </div>
                    <div className="transaction-details">
                      <h4>
                        {transaction.type === 'earning' 
                          ? `Ride - ${transaction.patient}` 
                          : 'Payout to Bank'}
                      </h4>
                      <p className="transaction-meta">
                        {transaction.date} • {transaction.time}
                        {transaction.bookingId && (
                          <span className="booking-id"> • {transaction.bookingId}</span>
                        )}
                        {transaction.reference && (
                          <span className="reference"> • Ref: {transaction.reference}</span>
                        )}
                      </p>
                    </div>
                    <div className="transaction-amount">
                      <span className={`amount ${transaction.type}`}>
                        {transaction.type === 'earning' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                      </span>
                      <span className={`status-badge ${transaction.status}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div className="payouts-content">
              <div className="payouts-header">
                <h3>💸 Payout History</h3>
                <button className="btn-primary" onClick={handleRequestPayout}>
                  Request New Payout
                </button>
              </div>

              <div className="payout-schedule-info">
                <div className="info-card">
                  <h4>📅 Payout Schedule</h4>
                  <p>Payouts are processed every Friday. Minimum payout amount: ₹500</p>
                </div>
                <div className="info-card">
                  <h4>🏦 Bank Account</h4>
                  <p>HDFC Bank - ****4567 (Savings)</p>
                  <button className="btn-link">Change Account</button>
                </div>
              </div>

              <div className="payouts-list">
                {payouts.map((payout) => (
                  <div key={payout.id} className="payout-item">
                    <div className="payout-icon">💸</div>
                    <div className="payout-details">
                      <h4>Payout - {payout.reference}</h4>
                      <p className="payout-meta">
                        {payout.date} • {payout.method} • {payout.account}
                      </p>
                    </div>
                    <div className="payout-amount">
                      <span className="amount">₹{payout.amount.toFixed(2)}</span>
                      <span className={`status-badge ${payout.status}`}>
                        {payout.status === 'success' ? '✓ Success' : payout.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmbulanceWallet;
