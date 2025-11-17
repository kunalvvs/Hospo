import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('enquiries');
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(35);
  const [enquiryFilter, setEnquiryFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Doctor profile data state
  const [doctorData, setDoctorData] = useState({
    profileTitle: '',
    bio: '',
    languages: [],
    awards: '',
    specializations: [],
    experience: '',
    registrationNumber: '',
    registrationCouncil: '',
    registrationYear: '',
    medicalDegree: '',
    clinicName: '',
    clinicAddress: '',
    clinicPhone: '',
    clinicEmail: '',
    workingDays: [],
    consultationFee: '',
    followUpFee: '',
    onlineConsultation: false,
    onlineConsultationFee: ''
  });
  
  // Mock data for enquiries
  const [enquiries] = useState([
    { id: 1, patient: 'Rajesh Kumar', phone: '9876543210', message: 'Need appointment for knee pain', status: 'new', date: '2025-11-13' },
    { id: 2, patient: 'Priya Sharma', phone: '9876543211', message: 'Follow-up consultation needed', status: 'pending', date: '2025-11-12' },
    { id: 3, patient: 'Amit Patel', phone: '9876543212', message: 'Emergency consultation request', status: 'new', date: '2025-11-13' },
    { id: 4, patient: 'Sunita Singh', phone: '9876543213', message: 'General checkup inquiry', status: 'completed', date: '2025-11-11' },
  ]);
  
  // Mock data for reviews
  const [reviews, setReviews] = useState([
    { id: 1, patient: 'Rajesh Kumar', rating: 5, comment: 'Excellent doctor, very caring and knowledgeable', date: '2025-11-10' },
    { id: 2, patient: 'Priya Sharma', rating: 4, comment: 'Good experience, but waiting time was long', date: '2025-11-09' },
    { id: 3, patient: 'Amit Patel', rating: 5, comment: 'Best doctor in the city! Highly recommended', date: '2025-11-08' },
    { id: 4, patient: 'Sunita Singh', rating: 4, comment: 'Professional and patient-friendly', date: '2025-11-07' },
  ]);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    patientName: '',
    rating: 0,
    comment: ''
  });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    const doctorDataString = localStorage.getItem('doctorData');
    
    if (!userString) {
      console.log('No user found, redirecting to login');
      setLoading(false);
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userString);
      console.log('User data:', userData);
      
      if (userData.role !== 'doctor') {
        alert('Access denied. This page is only for doctors.');
        setLoading(false);
        navigate('/');
        return;
      }
      
      // Load doctor data from localStorage if available
      if (doctorDataString) {
        setDoctorData(JSON.parse(doctorDataString));
      }
      
      setCurrentUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('doctorData');
    navigate('/');
  };

  // Handler to update doctor data
  const handleDoctorDataChange = (field, value) => {
    setDoctorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler to save doctor data to localStorage
  const handleSaveDoctorData = (section) => {
    localStorage.setItem('doctorData', JSON.stringify(doctorData));
    alert(`${section} saved successfully!`);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.patientName.trim() && newReview.rating > 0 && newReview.comment.trim()) {
      const review = {
        id: reviews.length + 1,
        patient: newReview.patientName,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0]
      };
      setReviews([review, ...reviews]);
      setNewReview({ patientName: '', rating: 0, comment: '' });
      setShowReviewForm(false);
      alert('Review submitted successfully!');
    } else {
      alert('Please fill all fields and select a rating');
    }
  };

  const menuItems = [
    { id: 'enquiries', icon: '🏠', label: 'Home' },
    { id: 'profile', icon: '👤', label: 'Profile Summary' },
    { id: 'credentials', icon: '🎓', label: 'Medical Credentials' },
    { id: 'identity', icon: '🆔', label: 'Identity Proof (KYC)' },
    { id: 'clinic', icon: '🏥', label: 'Clinic Details' },
    { id: 'online', icon: '💻', label: 'Online Consultation' },
    { id: 'fees', icon: '💰', label: 'Fees & Payment' },
    { id: 'reviews', icon: '⭐', label: 'Reviews & Ratings' }
  ];
  
  // Calculate filtered enquiries
  const filteredEnquiries = enquiries.filter(enq => {
    if (enquiryFilter === 'all') return true;
    return enq.status === enquiryFilter;
  });
  
  // Calculate stats
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const pendingEnquiries = enquiries.filter(e => e.status === 'pending').length;
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f7fa',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="doctor-dashboard">
      {/* Mobile Menu Toggle */}
      <button 
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'hidden' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon">☰</span>
      </button>

      {/* Left Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
              <img src="/images/cosco.png" alt="logo" />

            <p>Doctor Portal</p>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3>DOCTOR</h3>
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.id === 'enquiries' && newEnquiries > 0 && (
                  <span className="badge">{newEnquiries}</span>
                )}
              </button>
            ))}
          </div>

          <button className="nav-item logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>Doctor Dashboard</p>
          <p className="version">v1.0.0</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div>
            <h1>Doctor Dashboard</h1>
            <p>Welcome, Dr. {currentUser.name}</p>
          </div>
          <div className="user-info">
            <span className="user-badge">👨‍⚕️ Doctor</span>
            <span className="user-phone">📱 {currentUser.phone}</span>
          </div>
        </header>
        
        {/* Profile Completion Bar */}
        <div className="profile-completion-section">
          <div className="completion-header">
            <div>
              <h3>Profile Completion</h3>
              <p>Complete your profile to attract more patients</p>
            </div>
            <span className="completion-percentage">{profileCompletion}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${profileCompletion}%` }}></div>
          </div>
          <div className="completion-tips">
            <p>📝 Add profile photo and bio</p>
            <p>🎓 Upload credentials</p>
            <p>🏥 Complete clinic details</p>
          </div>
        </div>

        <div className="content-body">
          {/* Profile Summary Section */}
          {activeSection === 'profile' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>👤 Profile Summary (Public-Facing)</h2>
                <p>This information will be visible to patients</p>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Profile Photo</label>
                  <div className="photo-upload">
                    <div className="photo-preview">
                      <span className="placeholder-icon">📷</span>
                      <p>Upload Professional Headshot</p>
                      <small>Recommended: JPG/PNG, 500x500px</small>
                    </div>
                    <button className="btn-secondary">Upload Photo</button>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Profile Title / Designation</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Dr. Anil Kumar, MBBS, MD (Pediatrics)"
                    value={doctorData.profileTitle || ''}
                    onChange={(e) => handleDoctorDataChange('profileTitle', e.target.value)}
                  />
                  <small>Include your name, degree, and specialization</small>
                </div>

                <div className="form-group full-width">
                  <label>Short Bio / About</label>
                  <textarea 
                    rows="4"
                    placeholder="Write a brief summary about your experience, approach, and expertise (1-3 lines)"
                    value={doctorData.bio || ''}
                    onChange={(e) => handleDoctorDataChange('bio', e.target.value)}
                  ></textarea>
                  <small>Keep it concise and patient-friendly</small>
                </div>

                <div className="form-group">
                  <label>Languages Spoken</label>
                  <div className="multi-select">
                    <label className="checkbox-label">
                      <input type="checkbox" /> Hindi
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> English
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Marathi
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Bengali
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Tamil
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Telugu
                    </label>
                  </div>
                  <input type="text" placeholder="Other languages..." className="mt-2" />
                </div>

                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input 
                    type="number" 
                    placeholder="e.g., 10"
                    value={doctorData.experience || ''}
                    onChange={(e) => handleDoctorDataChange('experience', e.target.value)}
                  />
                  <small>Total years of clinical experience</small>
                </div>

                <div className="form-group full-width">
                  <label>Specializations / Sub-specialities</label>
                  <input 
                    type="text" 
                    placeholder="Primary specialization"
                    value={doctorData.primarySpecialization || ''}
                    onChange={(e) => handleDoctorDataChange('primarySpecialization', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Secondary specialization (optional)" 
                    className="mt-2"
                    value={doctorData.secondarySpecialization || ''}
                    onChange={(e) => handleDoctorDataChange('secondarySpecialization', e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Services / Treatments Offered</label>
                  <div className="multi-select">
                    <label className="checkbox-label">
                      <input type="checkbox" /> General OPD
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Teleconsultation
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Vaccination
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Health Checkup
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Emergency Consultation
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Home Visit
                    </label>
                  </div>
                  <textarea 
                    rows="2" 
                    placeholder="Other services..." 
                    className="mt-2"
                  ></textarea>
                </div>

                <div className="form-actions full-width">
                  <button className="btn-primary" onClick={() => handleSaveDoctorData('Profile')}>Save Profile</button>
                  <button className="btn-secondary">Preview Public Profile</button>
                </div>
              </div>
            </section>
          )}

          {/* Medical Credentials Section */}
          {activeSection === 'credentials' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🎓 Medical Credentials & Education</h2>
                <p>Verification critical - Required for practice authorization</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Medical Registration / Licence Number *</label>
                  <input type="text" placeholder="Enter NMC/State Medical Council registration number" required />
                  <small>State Medical Council / NMC (MCI) number</small>
                </div>

                <div className="form-group">
                  <label>Registration Council Name / Issuing State *</label>
                  <select required>
                    <option value="">Select council</option>
                    <option>Delhi Medical Council</option>
                    <option>Maharashtra Medical Council</option>
                    <option>Karnataka Medical Council</option>
                    <option>Tamil Nadu Medical Council</option>
                    <option>National Medical Commission (NMC)</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Registration Certificate (Scan/Photo) *</label>
                  <div className="file-upload">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                    <p>Upload PDF or image of your registration licence</p>
                    <small>Maximum file size: 5MB</small>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Degrees / Qualifications</label>
                  <div className="degree-list">
                    <div className="degree-item">
                      <input type="text" placeholder="Degree name (e.g., MBBS)" />
                      <input type="text" placeholder="College/University" />
                      <input type="number" placeholder="Year" />
                      <button className="btn-icon">➕</button>
                    </div>
                  </div>
                  <button className="btn-secondary mt-2">+ Add Another Degree</button>
                </div>

                <div className="form-group full-width">
                  <label>Degree Certificate(s) Upload</label>
                  <div className="file-upload">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                    <p>Upload scanned copies of your degree certificates</p>
                    <small>You can select multiple files</small>
                  </div>
                </div>

                <div className="form-actions full-width">
                  <button className="btn-primary">Save Credentials</button>
                  <button className="btn-secondary">Submit for Verification</button>
                </div>
              </div>
            </section>
          )}

          {/* Identity Proof Section */}
          {activeSection === 'identity' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🆔 Identity Proof (KYC)</h2>
                <p>Government-issued ID verification required</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Government Photo ID Type *</label>
                  <select required>
                    <option value="">Select ID type</option>
                    <option>Aadhaar Card</option>
                    <option>Passport</option>
                    <option>PAN Card</option>
                    <option>Driving Licence</option>
                    <option>Voter ID</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>ID Number</label>
                  <input type="text" placeholder="Enter ID number (optional)" />
                  <small>Privacy protected - encrypted storage</small>
                </div>

                <div className="form-group full-width">
                  <label>Government ID (Scan/Photo) *</label>
                  <div className="file-upload">
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" />
                    <p>Upload clear photo/scan of your government ID</p>
                    <small>Front side required, back side optional</small>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Photo of Signature / Prescription Pad</label>
                  <div className="file-upload">
                    <input type="file" accept=".jpg,.jpeg,.png" />
                    <p>Upload photo to verify practice name (optional)</p>
                    <small>Helps in authenticating your practice</small>
                  </div>
                </div>

                <div className="form-actions full-width">
                  <button className="btn-primary" onClick={() => handleSaveDoctorData('Identity Details')}>Save Identity Details</button>
                  <button className="btn-secondary">Verify KYC</button>
                </div>
              </div>
            </section>
          )}

          {/* Clinic Details Section */}
          {activeSection === 'clinic' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🏥 Clinic Details</h2>
                <p>Information about your practice location and facilities</p>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Practice / Clinic Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter clinic name (must be unique)"
                    value={doctorData.clinicName || ''}
                    onChange={(e) => handleDoctorDataChange('clinicName', e.target.value)}
                    required 
                  />
                  <small>Should not be too generic - must be searchable</small>
                </div>

                <div className="form-group full-width">
                  <label>Practice Address *</label>
                  <input type="text" placeholder="Building / Street" required />
                  <input type="text" placeholder="Landmark" className="mt-2" />
                  <div className="address-row mt-2">
                    <input type="text" placeholder="City" />
                    <input type="text" placeholder="State" />
                    <input type="text" placeholder="Pincode" />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Map Location / Geo Coordinates</label>
                  <div className="map-placeholder">
                    <p>📍 Click to pin your clinic location on map</p>
                    <button className="btn-secondary">Open Map</button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Clinic Phone Number(s) *</label>
                  <input type="tel" placeholder="Landline" />
                  <input type="tel" placeholder="Mobile" className="mt-2" />
                </div>

                <div className="form-group">
                  <label>Clinic Timings / OPD Hours *</label>
                  <div className="timing-slot">
                    <select>
                      <option>Monday - Friday</option>
                      <option>Monday - Saturday</option>
                      <option>Custom Days</option>
                    </select>
                    <div className="time-inputs mt-2">
                      <input type="time" placeholder="Start" />
                      <span>to</span>
                      <input type="time" placeholder="End" />
                    </div>
                  </div>
                  <button className="btn-secondary mt-2">+ Add Another Session</button>
                </div>

                <div className="form-group full-width">
                  <label>Consultation Types Available</label>
                  <div className="multi-select">
                    <label className="checkbox-label">
                      <input type="checkbox" /> In-person
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Home Visit
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Teleconsultation
                    </label>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Facilities / Amenities</label>
                  <div className="multi-select">
                    <label className="checkbox-label">
                      <input type="checkbox" /> Parking Available
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Wheelchair Access
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Lab Facilities
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Pharmacy
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Air Conditioned
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Credit/Debit Cards
                    </label>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Clinic Photos</label>
                  <div className="file-upload">
                    <input type="file" accept=".jpg,.jpeg,.png" multiple />
                    <p>Upload photos of reception, consultation room, building exterior</p>
                    <small>Multiple photos help improve listing visibility</small>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Ownership Proof (if applicable)</label>
                  <div className="file-upload">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                    <p>Registration certificate, invoice, or prescription copy</p>
                    <small>To prove association with practice name</small>
                  </div>
                </div>

                <div className="form-actions full-width">
                  <button className="btn-primary" onClick={() => handleSaveDoctorData('Clinic Details')}>Save Clinic Details</button>
                  <button className="btn-secondary">Preview Listing</button>
                </div>
              </div>
            </section>
          )}

          {/* Online Consultation Section */}
          {activeSection === 'online' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>💻 Online Consultation Settings</h2>
                <p>Configure your virtual clinic and teleconsultation preferences</p>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Enable Online Consultations</label>
                  <div className="toggle-switch">
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                    <span>Enable teleconsultation services</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Consultation Fee (Online) *</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input type="number" placeholder="Per session amount" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Consultation Mode</label>
                  <div className="multi-select">
                    <label className="checkbox-label">
                      <input type="checkbox" /> Video Call
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Audio Call
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Chat
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Slot Duration</label>
                  <select>
                    <option>15 minutes</option>
                    <option>20 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Buffer Time Between Slots</label>
                  <select>
                    <option>No buffer</option>
                    <option>5 minutes</option>
                    <option>10 minutes</option>
                    <option>15 minutes</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Available Days & Time Slots</label>
                  <div className="schedule-builder">
                    <div className="day-schedule">
                      <label className="checkbox-label">
                        <input type="checkbox" /> Monday
                      </label>
                      <div className="time-inputs">
                        <input type="time" />
                        <span>to</span>
                        <input type="time" />
                      </div>
                    </div>
                    <div className="day-schedule">
                      <label className="checkbox-label">
                        <input type="checkbox" /> Tuesday
                      </label>
                      <div className="time-inputs">
                        <input type="time" />
                        <span>to</span>
                        <input type="time" />
                      </div>
                    </div>
                    <div className="day-schedule">
                      <label className="checkbox-label">
                        <input type="checkbox" /> Wednesday
                      </label>
                      <div className="time-inputs">
                        <input type="time" />
                        <span>to</span>
                        <input type="time" />
                      </div>
                    </div>
                  </div>
                  <button className="btn-secondary mt-2">Copy to All Days</button>
                </div>

                <div className="form-group full-width">
                  <label>Cancellation / Reschedule Policy</label>
                  <select>
                    <option>Allow up to 1 hour before appointment</option>
                    <option>Allow up to 2 hours before appointment</option>
                    <option>Allow up to 4 hours before appointment</option>
                    <option>Allow up to 24 hours before appointment</option>
                    <option>No cancellation allowed</option>
                  </select>
                  <textarea 
                    rows="2" 
                    placeholder="Additional policy details (optional)" 
                    className="mt-2"
                  ></textarea>
                </div>

                <div className="form-actions full-width">
                  <button className="btn-primary">Save Consultation Settings</button>
                  <button className="btn-secondary">Test Virtual Room</button>
                </div>
              </div>
            </section>
          )}

          {/* Enquiries Section */}
          {activeSection === 'enquiries' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📩 Patient Enquiries</h2>
                <p>Manage patient queries and appointment requests</p>
              </div>
              
              {/* Enquiry Stats */}
              <div className="enquiry-stats">
                <div className="stat-card">
                  <span className="stat-icon">📊</span>
                  <div>
                    <h4>Total Enquiries</h4>
                    <p className="stat-number">{totalEnquiries}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🆕</span>
                  <div>
                    <h4>New Enquiries</h4>
                    <p className="stat-number">{newEnquiries}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">⏳</span>
                  <div>
                    <h4>Pending</h4>
                    <p className="stat-number">{pendingEnquiries}</p>
                  </div>
                </div>
              </div>
              
              {/* Filter Tabs */}
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${enquiryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setEnquiryFilter('all')}
                >
                  All ({totalEnquiries})
                </button>
                <button 
                  className={`filter-tab ${enquiryFilter === 'new' ? 'active' : ''}`}
                  onClick={() => setEnquiryFilter('new')}
                >
                  New ({newEnquiries})
                </button>
                <button 
                  className={`filter-tab ${enquiryFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setEnquiryFilter('pending')}
                >
                  Pending ({pendingEnquiries})
                </button>
                <button 
                  className={`filter-tab ${enquiryFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setEnquiryFilter('completed')}
                >
                  Completed
                </button>
              </div>
              
              {/* Enquiry List */}
              <div className="enquiry-list">
                {filteredEnquiries.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No enquiries found</p>
                  </div>
                ) : (
                  filteredEnquiries.map((enquiry) => (
                    <div key={enquiry.id} className="enquiry-card">
                      <div className="enquiry-header">
                        <div>
                          <h4>{enquiry.patient}</h4>
                          <p className="enquiry-phone">📱 {enquiry.phone}</p>
                        </div>
                        <span className={`status-badge ${enquiry.status}`}>
                          {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                        </span>
                      </div>
                      <p className="enquiry-message">{enquiry.message}</p>
                      <div className="enquiry-footer">
                        <span className="enquiry-date">📅 {enquiry.date}</span>
                        <div className="enquiry-actions">
                          <button className="btn-secondary" onClick={() => alert('Reply feature coming soon!')}>Reply</button>
                          <button className="btn-primary" onClick={() => alert('Mark as completed!')}>Mark Complete</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Reviews & Ratings Section */}
          {activeSection === 'reviews' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>⭐ Reviews & Ratings</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? '✕ Cancel' : '✏️ Write a Review'}
                </button>
              </div>

              {/* New Review Form */}
              {showReviewForm && (
                <div className="review-form-card">
                  <h3>Write Your Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        value={newReview.patientName}
                        onChange={(e) => setNewReview({...newReview, patientName: e.target.value})}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Your Rating *</label>
                      <div className="star-rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star-input ${star <= (hoverRating || newReview.rating) ? 'filled' : ''}`}
                            onClick={() => setNewReview({...newReview, rating: star})}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-text">
                          {newReview.rating > 0 ? `${newReview.rating} Star${newReview.rating > 1 ? 's' : ''}` : 'Select rating'}
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Your Review *</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="Share your experience with this doctor..."
                        rows="4"
                        required
                      ></textarea>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        Submit Review
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowReviewForm(false);
                          setNewReview({ patientName: '', rating: 0, comment: '' });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Rating Summary */}
              <div className="rating-summary">
                <div className="rating-overview">
                  <div className="average-rating">
                    <h1>{averageRating}</h1>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(averageRating) ? 'star filled' : 'star'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p>{reviews.length} reviews</p>
                  </div>
                  <div className="rating-breakdown">
                    <div className="rating-row">
                      <span>5 ⭐</span>
                      <div className="rating-bar">
                        <div className="rating-bar-fill" style={{ width: `${(reviews.filter(r => r.rating === 5).length / reviews.length) * 100}%` }}></div>
                      </div>
                      <span>{reviews.filter(r => r.rating === 5).length}</span>
                    </div>
                    <div className="rating-row">
                      <span>4 ⭐</span>
                      <div className="rating-bar">
                        <div className="rating-bar-fill" style={{ width: `${(reviews.filter(r => r.rating === 4).length / reviews.length) * 100}%` }}></div>
                      </div>
                      <span>{reviews.filter(r => r.rating === 4).length}</span>
                    </div>
                    <div className="rating-row">
                      <span>3 ⭐</span>
                      <div className="rating-bar">
                        <div className="rating-bar-fill" style={{ width: `${(reviews.filter(r => r.rating === 3).length / reviews.length) * 100}%` }}></div>
                      </div>
                      <span>{reviews.filter(r => r.rating === 3).length}</span>
                    </div>
                    <div className="rating-row">
                      <span>2 ⭐</span>
                      <div className="rating-bar">
                        <div className="rating-bar-fill" style={{ width: `${(reviews.filter(r => r.rating === 2).length / reviews.length) * 100}%` }}></div>
                      </div>
                      <span>{reviews.filter(r => r.rating === 2).length}</span>
                    </div>
                    <div className="rating-row">
                      <span>1 ⭐</span>
                      <div className="rating-bar">
                        <div className="rating-bar-fill" style={{ width: `${(reviews.filter(r => r.rating === 1).length / reviews.length) * 100}%` }}></div>
                      </div>
                      <span>{reviews.filter(r => r.rating === 1).length}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reviews List */}
              <div className="reviews-list">
                <h3>Patient Reviews</h3>
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">{review.patient.charAt(0)}</div>
                        <div>
                          <h4>{review.patient}</h4>
                          <span className="review-date">📅 {review.date}</span>
                        </div>
                      </div>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'star filled' : 'star'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <div className="review-actions">
                      <button className="btn-secondary" onClick={() => alert('Thank you message sent!')}>Thank Reviewer</button>
                      <button className="btn-secondary" onClick={() => alert('Report feature coming soon!')}>Report</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Fees & Payment Section */}
          {activeSection === 'fees' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>💰 Fees & Payment Details</h2>
                <p>Configure consultation fees and payment methods</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Consultation Fee (In-Person) *</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input 
                      type="number" 
                      placeholder="Clinic consultation fee" 
                      value={doctorData.consultationFee || ''}
                      onChange={(e) => handleDoctorDataChange('consultationFee', e.target.value)}
                      required 
                    />
                  </div>
                  <small>This fee will be displayed on your listing</small>
                </div>

                <div className="form-group">
                  <label>Consultation Fee (Online) *</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input 
                      type="number" 
                      placeholder="Online consultation fee"
                      value={doctorData.onlineConsultationFee || ''}
                      onChange={(e) => handleDoctorDataChange('onlineConsultationFee', e.target.value)}
                      required 
                    />
                  </div>
                  <small>Can be different from in-person fee</small>
                </div>

                <div className="form-group full-width">
                  <h3>Bank Account Details (For Payouts)</h3>
                  <small>Required for receiving payments from online consultations</small>
                </div>

                <div className="form-group">
                  <label>Account Holder Name *</label>
                  <input type="text" placeholder="As per bank records" required />
                </div>

                <div className="form-group">
                  <label>Bank Account Number *</label>
                  <input type="text" placeholder="Enter account number" required />
                </div>

                <div className="form-group">
                  <label>IFSC Code *</label>
                  <input type="text" placeholder="e.g., SBIN0001234" required />
                </div>

                <div className="form-group">
                  <label>Bank Name</label>
                  <input type="text" placeholder="Name of your bank" />
                </div>

                <div className="form-group">
                  <label>Branch Name</label>
                  <input type="text" placeholder="Branch location" />
                </div>

                <div className="form-group">
                  <label>Account Type</label>
                  <select>
                    <option>Savings Account</option>
                    <option>Current Account</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <h3>UPI Details (Alternative)</h3>
                  <small>Provide UPI ID for faster payouts</small>
                </div>

                <div className="form-group">
                  <label>UPI ID</label>
                  <input type="text" placeholder="yourname@upi" />
                  <small>Format: username@bankname</small>
                </div>

                <div className="form-group full-width">
                  <label>Cancelled Cheque / Bank Statement</label>
                  <div className="file-upload">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                    <p>Upload cancelled cheque or bank statement for verification</p>
                    <small>Required for account verification</small>
                  </div>
                </div>

                <div className="form-actions full-width">
                  <button className="btn-primary" onClick={() => handleSaveDoctorData('Payment Details')}>Save Payment Details</button>
                  <button className="btn-secondary">Verify Bank Account</button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
