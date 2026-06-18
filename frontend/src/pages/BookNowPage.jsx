import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import PaymentProcessor from '../components/PaymentProcessor';
import { 
  FaCreditCard, 
  FaMobileAlt, 
  FaUniversity, 
  FaMoneyBillWave 
} from 'react-icons/fa';

const BookNowPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    destination: '',
    package: '',
    date: '',
    numPeople: 1,
    packageType: 'standard',
    specialRequests: '',
    paymentMethod: 'credit_card'
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchFormData = async () => {
      try {
        const [destRes, pkgRes] = await Promise.all([
          axiosInstance.get('/destinations'),
          axiosInstance.get('/packages')
        ]);
        setDestinations(destRes.data);
        setPackages(pkgRes.data);
        
        // Parse search params for pre-filling
        const packageIdParam = searchParams.get('packageId');
        const destinationParam = searchParams.get('destination');
        const packageTypeParam = searchParams.get('packageType');
        
        let initialFormState = {};
        if (packageIdParam) {
          initialFormState.package = packageIdParam;
          const matchedPkg = pkgRes.data.find(p => p._id === packageIdParam);
          if (matchedPkg) {
            const destObj = matchedPkg.destination;
            const destName = destObj?.name || destRes.data.find(d => d._id === destObj)?.name || '';
            initialFormState.destination = destName.replace(/^[^\w]*/, '').trim();
          }
        } else if (destinationParam) {
          initialFormState.destination = decodeURIComponent(destinationParam);
        }
        
        if (packageTypeParam) {
          initialFormState.packageType = packageTypeParam;
        }

        setFormData(prev => ({
          ...prev,
          ...initialFormState
        }));
      } catch (err) {
        console.error('Error fetching destinations/packages for booking form:', err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchFormData();
  }, [isAuthenticated, searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePackageChange = (e) => {
    const pkgId = e.target.value;
    const selectedPkg = packages.find(p => p._id === pkgId);
    
    let destName = '';
    if (selectedPkg) {
      const destObj = selectedPkg.destination;
      destName = destObj?.name || destinations.find(d => d._id === destObj)?.name || '';
      destName = destName.replace(/^[^\w]*/, '').trim();
    }
    
    setFormData(prev => ({
      ...prev,
      package: pkgId,
      destination: destName || prev.destination
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (formData.numPeople < 1) newErrors.numPeople = 'At least 1 person required';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post('/bookings', formData);
      setBookingResponse(response.data);
      setSubmitted(true);
      setErrors({});
    } catch (error) {
      console.error('Error submitting booking:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to confirm booking. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="book-now-page" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <h1>Login Required</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem' }}>
          You must be logged in to book a trip. Create an account or log in to continue.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" className="cta-button">Login</Link>
          <Link to="/register" className="cta-secondary">Create Account</Link>
        </div>
      </div>
    );
  }

  if (loadingData) {
    return <LoadingSpinner message="Setting up your booking form..." />;
  }

  if (submitted) {
    return (
      <div className="booking-success">
        <h1 className="success-title">Booking Submitted!</h1>
        
        <div className="success-content-wrapper">
          <div className="success-left-col">
            {/* Booking Details (Bill First) */}
            <div className="booking-details">
              <h2>Booking Details & Bill</h2>
              <div>
                <div>
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Travelers:</strong> {formData.numPeople}</p>
                </div>
                <div>
                  <p><strong>Destination:</strong> {formData.destination}</p>
                  <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString('en-IN')}</p>
                  <p><strong>Package:</strong> {formData.packageType.charAt(0).toUpperCase() + formData.packageType.slice(1)}</p>
                  <p><strong>Payment Method:</strong> {bookingResponse?.paymentMethod === 'cash' ? 'CASH / PAY ON ARRIVAL' : ((bookingResponse?.paymentMethod || formData.paymentMethod).replace('_', ' ').toUpperCase())}</p>
                </div>
              </div>
              <div className="success-bill-total">
                <span className="success-bill-label">Total Amount Charged</span>
                <span className="success-bill-amount">
                  ₹{bookingResponse?.totalAmount?.toLocaleString('en-IN') || '0'}
                </span>
              </div>
              {formData.specialRequests && (
                <div className="success-special-requests">
                  <p><strong>Special Requests:</strong> {formData.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Status Alert Banner */}
            <div className={`success-status-alert ${bookingResponse?.status === 'confirmed' ? 'status-cash' : 'status-online'}`}>
              <p><strong>Booking Status:</strong> <span className="status-value">{bookingResponse?.status === 'confirmed' ? 'Confirmed' : 'Pending (Unpaid)'}</span></p>
              <p className="status-desc">
                {bookingResponse?.status === 'confirmed' 
                  ? (bookingResponse?.paymentMethod === 'cash' 
                      ? 'Your booking is confirmed! You can complete the cash payment upon check-in or arrival at the destination.' 
                      : 'Your booking and payment are confirmed! A confirmation email has been sent.') 
                  : 'Your booking has been registered. Please complete the payment to secure your reservation.'}
              </p>
            </div>

            <p className="confirmation-message">
              Thank you for booking with us! Keep your confirmation number safe for future reference.
            </p>
            <div className="success-actions">
              <Link to="/packages" className="cta-button">Back to Packages</Link>
              <Link to="/dashboard" className="cta-secondary">View Dashboard</Link>
            </div>
          </div>

          <div className="success-right-col">
            {/* Confirmation Number */}
            <div className="success-conf-card">
              <h3 className="success-conf-title">Confirmation Number</h3>
              <p className="success-conf-value">
                {bookingResponse?.confirmationNumber || 'CONF-PENDING'}
              </p>
            </div>

            {bookingResponse?.status === 'confirmed' ? (
              bookingResponse?.qrCode && (
                <div className="success-qr-card animate-fadeIn">
                  <h3 className="success-qr-title">Check-in QR Code</h3>
                  <span className="success-qr-status-badge status-cash">
                    Booking Status: Confirmed / Paid
                  </span>
                  <div className="success-qr-img-wrap">
                    <img 
                      src={bookingResponse.qrCode} 
                      alt="Booking QR Code" 
                      className="success-qr-img"
                    />
                  </div>
                  <p className="success-qr-text">
                    Show this QR code at arrival/check-in for verification
                  </p>
                </div>
              )
            ) : (
              <PaymentProcessor 
                booking={bookingResponse} 
                onPaymentSuccess={(updatedBooking) => setBookingResponse(updatedBooking)} 
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-now-page">
      <div className="book-now-header">
        <h1>Book Your Adventure</h1>
        <p>Fill in your details to start your Indian journey</p>
      </div>

      <form onSubmit={handleSubmit} className="book-now-form">
        <div className="form-group name-group">
          <label htmlFor="name">Full Name *</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            placeholder="Your full name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group email-group">
          <label htmlFor="email">Email Address *</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            placeholder="your@email.com"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group phone-group">
          <label htmlFor="phone">Phone Number *</label>
          <input 
            type="tel" 
            id="phone"
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
            placeholder="10-digit phone number"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="form-group destination-group">
          <label htmlFor="destination">Destination *</label>
          <select 
            id="destination"
            name="destination" 
            value={formData.destination} 
            onChange={handleChange}
          >
            <option value="">-- Select Destination --</option>
            {destinations.map(d => {
              const cleanName = d.name.replace(/^[^\w]*/, '').trim();
              return (
                <option key={d._id} value={cleanName}>
                  {d.name}
                </option>
              );
            })}
          </select>
          {errors.destination && <span className="error">{errors.destination}</span>}
        </div>

        <div className="form-group date-group">
          <label htmlFor="date">Travel Date *</label>
          <input 
            type="date" 
            id="date"
            name="date" 
            value={formData.date} 
            onChange={handleChange}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>

        <div className="form-group travelers-group">
          <label htmlFor="numPeople">Number of Travelers *</label>
          <input 
            type="number" 
            id="numPeople"
            name="numPeople" 
            value={formData.numPeople} 
            onChange={handleChange}
            min="1"
            max="20"
          />
          {errors.numPeople && <span className="error">{errors.numPeople}</span>}
        </div>

        <div className="form-group tour-package-group">
          <label htmlFor="package">Tour Package (Optional)</label>
          <select 
            id="package"
            name="package" 
            value={formData.package} 
            onChange={handlePackageChange}
          >
            <option value="">-- Custom / No Package --</option>
            {packages.map(p => (
              <option key={p._id} value={p._id}>
                {p.name.replace(/^[^\w]*/, '').trim()} (₹{p.price.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group package-group">
          <label htmlFor="packageType">Package Tier</label>
          <select 
            id="packageType"
            name="packageType" 
            value={formData.packageType} 
            onChange={handleChange}
          >
            <option value="standard">Standard - Comfortable & Economical</option>
            <option value="premium">Premium - Added Comforts & Services</option>
            <option value="luxury">Luxury - 5-Star Experience</option>
          </select>
        </div>

        <div className="form-group payment-group">
          <label>Payment Method *</label>
          <div className="payment-options-grid">
            {[
              { id: 'credit_card', label: 'Credit Card', icon: <FaCreditCard /> },
              { id: 'debit_card', label: 'Debit Card', icon: <FaCreditCard /> },
              { id: 'upi', label: 'UPI', icon: <FaMobileAlt /> },
              { id: 'net_banking', label: 'Net Banking', icon: <FaUniversity /> },
              { id: 'cash', label: 'Cash / Pay on Arrival', icon: <FaMoneyBillWave /> }
            ].map(method => (
              <label 
                key={method.id} 
                className={`payment-option-card ${formData.paymentMethod === method.id ? 'active' : ''}`}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value={method.id} 
                  checked={formData.paymentMethod === method.id}
                  onChange={handleChange}
                  className="payment-radio-input"
                />
                <span className="payment-option-icon">{method.icon}</span>
                <span className="payment-option-label">{method.label}</span>
              </label>
            ))}
          </div>
          {errors.paymentMethod && <span className="error">{errors.paymentMethod}</span>}
        </div>

        <div className="form-group requests-group">
          <label htmlFor="specialRequests">Special Requests (Optional)</label>
          <textarea 
            id="specialRequests"
            name="specialRequests" 
            value={formData.specialRequests} 
            onChange={handleChange}
            placeholder="Any special requirements or preferences?"
          />
        </div>

        <div className="submit-group">
          <button 
            type="submit" 
            className="cta-button" 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
          {errors.submit && <span className="error" style={{ marginTop: '1rem', display: 'block' }}>{errors.submit}</span>}
        </div>
      </form>
    </div>
  );
};

export default BookNowPage;