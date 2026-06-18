import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import PaymentProcessor from '../components/PaymentProcessor';
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaUsers, 
  FaPlane, 
  FaChevronDown, 
  FaChevronUp, 
  FaCompass, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle,
  FaMapMarkerAlt
} from 'react-icons/fa';

const UserDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activePaymentBooking, setActivePaymentBooking] = useState(null);

  const handlePaymentSuccess = (bookingId, updatedBooking) => {
    setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, ...updatedBooking } : b));
    setActivePaymentBooking(null);
  };

  const handleCancelBooking = async (e, bookingId) => {
    e.stopPropagation();
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.");
    if (!confirmCancel) return;

    try {
      const response = await axiosInstance.put(`/bookings/${bookingId}/cancel`);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, ...response.data } : b));
      alert("Booking successfully cancelled.");
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert(err.response?.data?.message || "Failed to cancel booking. Please try again.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBookings();
    }
  }, [isAuthenticated]);

  const fetchUserBookings = async () => {
    try {
      const response = await axiosInstance.get('/bookings/my');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      'credit_card': 'Credit Card',
      'debit_card': 'Debit Card',
      'upi': 'UPI',
      'net_banking': 'Net Banking',
      'cash': 'Cash / Pay on Arrival'
    };
    return labels[method] || method;
  };

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending' || !b.status).length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return booking.status === 'pending' || !booking.status;
    return booking.status === activeFilter;
  });

  if (!isAuthenticated) {
    return (
      <div className="user-dashboard" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <FaUserCircle size={80} style={{ color: 'var(--muted)', marginBottom: '1.5rem' }} />
        <h1>Login Required</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
          Please log in to view your profile dashboard and manage your bookings.
        </p>
        <Link to="/login" className="cta-button">Go to Login</Link>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Retrieving your account details..." />;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-grid">
        {/* Left Panel: Profile & Stats Summary */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-header">
              <FaUserCircle className="profile-avatar" />
              <div className="profile-name-details">
                <h2>{user?.name}</h2>
                <span className="profile-role-badge">Traveler</span>
              </div>
            </div>

            <div className="profile-contact-info">
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>{user?.email}</span>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-box">
                <span className="stat-count">{totalBookings}</span>
                <span className="stat-title">Total Trips</span>
              </div>
              <div className="stat-box">
                <span className="stat-count count-confirmed">{confirmedBookings}</span>
                <span className="stat-title">Confirmed</span>
              </div>
              <div className="stat-box">
                <span className="stat-count count-pending">{pendingBookings}</span>
                <span className="stat-title">Pending</span>
              </div>
            </div>

            <Link to="/packages" className="cta-button sidebar-cta">
              <FaCompass style={{ marginRight: '0.5rem' }} /> Book New Trip
            </Link>
          </div>
        </aside>

        {/* Right Panel: Trips bookings list */}
        <main className="dashboard-main-content">
          <div className="main-header">
            <div>
              <h1>Welcome back, {user?.name}!</h1>
              <p>Manage and track all your Indian adventures here.</p>
            </div>
          </div>

          {/* Bookings Filter Tabs */}
          <div className="dashboard-filters">
            {[
              { id: 'all', label: 'All Trips', count: totalBookings },
              { id: 'confirmed', label: 'Confirmed', count: confirmedBookings },
              { id: 'pending', label: 'Pending', count: pendingBookings },
              { id: 'cancelled', label: 'Cancelled', count: cancelledBookings }
            ].map(tab => (
              <button
                key={tab.id}
                className={`filter-tab-btn ${activeFilter === tab.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
                <span className="tab-badge">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Trips List */}
          {filteredBookings.length > 0 ? (
            <div className="bookings-list">
              {filteredBookings.map(booking => {
                const isExpanded = expandedBooking === booking._id;
                const dateObj = new Date(booking.date);
                
                return (
                  <div 
                    key={booking._id} 
                    className={`booking-ticket-card ${isExpanded ? 'expanded' : ''} status-${booking.status || 'pending'}`}
                    onClick={() => setExpandedBooking(isExpanded ? null : booking._id)}
                  >
                    <div className="ticket-main-section">
                      <div className="ticket-info">
                        <div className="ticket-destination">
                          <FaMapMarkerAlt className="dest-icon" />
                          <div>
                            <h3>{booking.destination}</h3>
                            <span className="package-tag">
                              {booking.packageType?.charAt(0).toUpperCase() + booking.packageType?.slice(1)} Tier
                            </span>
                          </div>
                        </div>

                        <div className="ticket-meta-grid">
                          <div className="meta-item">
                            <FaCalendarAlt className="meta-icon" />
                            <div>
                              <span className="meta-label">Date</span>
                              <span className="meta-value">{dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>

                          <div className="meta-item">
                            <FaUsers className="meta-icon" />
                            <div>
                              <span className="meta-label">Travelers</span>
                              <span className="meta-value">{booking.numPeople} Passenger{booking.numPeople > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ticket-right-section">
                        {booking.confirmationNumber && (
                          <div className="confirmation-block">
                            <span className="conf-label">CONFIRMATION</span>
                            <span className="conf-value">{booking.confirmationNumber}</span>
                          </div>
                        )}
                        
                        <div className={`status-badge-pill status-${booking.status || 'pending'}`}>
                          {booking.status === 'confirmed' && <FaCheckCircle />}
                          {(booking.status === 'pending' || !booking.status) && <FaClock />}
                          {booking.status === 'cancelled' && <FaTimesCircle />}
                          <span>{(booking.status || 'pending').toUpperCase()}</span>
                        </div>

                        <div className="ticket-toggle-arrow">
                          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Inner Details */}
                    {isExpanded && (
                      <div className="ticket-expanded-details" onClick={(e) => e.stopPropagation()}>
                        <div className="details-grid">
                          <div className="detail-column">
                            <h4>Contact Details</h4>
                            <p><strong>Primary Contact:</strong> {booking.name}</p>
                            <p><strong>Email Address:</strong> {booking.email}</p>
                            <p><strong>Phone Number:</strong> {booking.phone}</p>
                          </div>
                          
                          <div className="detail-column">
                            <h4>Booking Info</h4>
                            <p><strong>Booking ID:</strong> <code>{booking._id}</code></p>
                            <p><strong>Total Cost:</strong> ₹{(booking.totalAmount || (booking.package?.price ? booking.package.price * booking.numPeople : 5000 * booking.numPeople)).toLocaleString('en-IN')}</p>
                            <p><strong>Payment Method:</strong> {getPaymentMethodLabel(booking.paymentMethod)}</p>
                            <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>

                        {booking.specialRequests && (
                          <div className="special-requests-block">
                            <h4>Special Requests</h4>
                            <p>{booking.specialRequests}</p>
                          </div>
                        )}

                        {booking.status === 'confirmed' || booking.paymentMethod === 'cash' ? (
                          booking.qrCode && (
                            <div className="qr-code-section">
                              <div className="qr-container">
                                <h4>{booking.paymentMethod === 'cash' ? 'Check-in QR Code' : 'Payment Verification QR Code'}</h4>
                                <img 
                                  src={booking.qrCode} 
                                  alt="Payment Verification QR Code" 
                                  className="qr-image"
                                />
                                <p>
                                  {booking.paymentMethod === 'cash' 
                                    ? 'Show this QR code at arrival for check-in and cash payment verification.'
                                    : 'Scan this QR code during check-in for ticket verification.'}
                                </p>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="dashboard-payment-section">
                            {activePaymentBooking === booking._id ? (
                              <div className="dashboard-inline-payment" onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                                  <button 
                                    className="cta-secondary cancel-pay-btn" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActivePaymentBooking(null);
                                    }}
                                    style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', minWidth: 'auto' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <PaymentProcessor 
                                  booking={booking} 
                                  onPaymentSuccess={(updatedBooking) => handlePaymentSuccess(booking._id, updatedBooking)} 
                                />
                              </div>
                            ) : (
                              <div className="pending-payment-notice">
                                <div className="notice-content">
                                  <h4>Payment Pending</h4>
                                  <p>Your booking is registered but unpaid. Please complete payment to confirm your booking.</p>
                                </div>
                                <button 
                                  className="cta-button pay-now-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActivePaymentBooking(booking._id);
                                  }}
                                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', width: 'auto' }}
                                >
                                  Complete Payment Now
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {booking.status !== 'cancelled' && (
                          <div className="cancel-booking-section" style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="cta-secondary cancel-booking-btn"
                              onClick={(e) => handleCancelBooking(e, booking._id)}
                              style={{ 
                                background: 'rgba(239, 68, 68, 0.06)', 
                                border: '1px solid rgba(239, 68, 68, 0.15)', 
                                color: '#ef4444', 
                                padding: '0.6rem 1.25rem', 
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: '600'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
                                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)';
                              }}
                            >
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-bookings-state">
              <FaPlane className="empty-icon" />
              <h3>No bookings found</h3>
              <p>You don't have any trips matching the active status filter.</p>
              <Link to="/packages" className="cta-button">Browse Tour Packages</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboardPage;