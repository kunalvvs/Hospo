import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const roles = [
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Healthcare Professional',
      icon: '🩺',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'chemist',
      title: 'Chemist',
      description: 'Pharmacy Professional',
      icon: '💊',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'user',
      title: 'Patient',
      description: 'Healthcare Seeker',
      icon: '👤',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 'hospital',
      title: 'Hospital',
      description: 'Medical Institution',
      icon: '🏥',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      id: 'pathlab',
      title: 'Pathlab',
      description: 'Diagnostic Center',
      icon: '🔬',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    {
      id: 'ambulance',
      title: 'Ambulance',
      description: 'Emergency Services',
      icon: '🚑',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    }
  ];

  const handleRoleSelect = (role) => {
    // Save selected role to localStorage
    localStorage.setItem('userRole', role);
    
    // Navigate to registration page
    navigate('/register');
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-content">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo">
            <img src="public\images\cosco.png" alt="logo" />
          </div>
          <p className="tagline">Healthcare at your fingertips</p>
        </div>

        {/* Title */}
        <div className="selection-header">
          <h2>Select Your Role</h2>
          <p>Choose how you want to continue</p>
        </div>

        {/* Role Cards */}
        <div className="role-cards-container">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`role-card ${hoveredCard === role.id ? 'hovered' : ''}`}
              onClick={() => handleRoleSelect(role.id)}
              onMouseEnter={() => setHoveredCard(role.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="role-icon-wrapper">
                <div 
                  className="role-icon"
                  style={{ background: role.gradient }}
                >
                  <span className="icon-emoji">{role.icon}</span>
                </div>
              </div>
              <div className="role-info">
                <h3>{role.title}</h3>
                <p>{role.description}</p>
              </div>
              <div className="arrow-icon">→</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="footer-text">
          <p>By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
