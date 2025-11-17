import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Demo credentials
    if (formData.email === 'admin@torion.com' && formData.password === 'admin123') {
      const adminUser = {
        email: formData.email,
        role: 'admin',
        name: 'Admin User',
        isAdmin: true
      };
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use admin@torion.com / admin123');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo">⚙️</div>
          <h1>Admin Panel</h1>
          <p>Torion Healthcare Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="admin-error-message">{error}</div>}
          
          <div className="admin-form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@torion.com"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Login to Admin Panel
          </button>
        </form>

        <div className="admin-login-footer">
          <p className="demo-note">🎭 Demo Mode - Use: admin@torion.com / admin123</p>
          <a href="/" className="back-to-home">← Back to Home</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
