import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
  FaCreditCard, 
  FaMobileAlt, 
  FaUniversity, 
  FaLock, 
  FaCopy, 
  FaCheckCircle, 
  FaSpinner,
  FaMoneyBillWave
} from 'react-icons/fa';

const PaymentProcessor = ({ booking, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  // Net banking states
  const [selectedBank, setSelectedBank] = useState('');
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankUsername, setBankUsername] = useState('');
  const [bankPassword, setBankPassword] = useState('');
  const [bankOtp, setBankOtp] = useState('');
  const [bankStep, setBankStep] = useState(1); // 1 = Login, 2 = OTP

  // UPI states
  const [upiCopied, setUpiCopied] = useState(false);
  const [isChoosingMethod, setIsChoosingMethod] = useState(false);

  const changePaymentMethod = async (newMethod) => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.put(`/bookings/${booking._id}/payment-method`, { paymentMethod: newMethod });
      if (onPaymentSuccess) {
        onPaymentSuccess(response.data);
      }
      setIsChoosingMethod(false);
    } catch (err) {
      console.error('Failed to change payment method:', err);
      setError(err.response?.data?.message || 'Failed to update payment method.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('pay.wanderindia@icici');
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const processPayment = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axiosInstance.put(`/bookings/${booking._id}/pay`);
      setSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(response.data);
      }
    } catch (err) {
      console.error('Payment processing failed:', err);
      setError(err.response?.data?.message || 'Payment verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Card validation & submission
  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardName.trim()) {
      setError('Cardholder name is required.');
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry)) {
      setError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cardCvv.length < 3) {
      setError('Please enter a valid CVV.');
      return;
    }
    processPayment();
  };

  // Format card number
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted.substring(0, 19));
  };

  // Format expiry date
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setCardExpiry(value.substring(0, 5));
  };

  // Net banking submit
  const handleBankPay = () => {
    if (!selectedBank) {
      setError('Please select your bank.');
      return;
    }
    setShowBankModal(true);
    setBankStep(1);
    setError('');
  };

  const handleBankLogin = (e) => {
    e.preventDefault();
    if (!bankUsername.trim() || !bankPassword.trim()) {
      setError('Username and password are required.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBankStep(2);
      setError('');
    }, 1500);
  };

  const handleBankOtpSubmit = (e) => {
    e.preventDefault();
    if (bankOtp.length < 4) {
      setError('Please enter a valid OTP.');
      return;
    }
    setShowBankModal(false);
    processPayment();
  };

  if (success) {
    return (
      <div className="payment-success-card">
        <FaCheckCircle className="payment-success-icon-check animate-bounce" />
        <h3>Payment Successful!</h3>
        <p>Your booking is now confirmed. Enjoy your adventure!</p>
      </div>
    );
  }

  if (isChoosingMethod) {
    return (
      <div className="payment-processor-container">
        {error && <div className="payment-error-alert">{error}</div>}
        <div className="payment-method-panel method-selector-panel animate-fadeIn">
          <div className="payment-header-row">
            <FaCreditCard className="panel-method-icon" />
            <div>
              <h3>Choose Payment Method</h3>
              <p>Select a different option to complete payment</p>
            </div>
          </div>

          <div className="payment-switch-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { id: 'credit_card', label: 'Credit Card', icon: <FaCreditCard /> },
              { id: 'debit_card', label: 'Debit Card', icon: <FaCreditCard /> },
              { id: 'upi', label: 'UPI', icon: <FaMobileAlt /> },
              { id: 'net_banking', label: 'Net Banking', icon: <FaUniversity /> },
              { id: 'cash', label: 'Cash / Pay on Arrival', icon: <FaMoneyBillWave /> }
            ].map(method => (
              <button
                key={method.id}
                type="button"
                className={`bank-card-option ${booking.paymentMethod === method.id ? 'selected' : ''}`}
                style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '1rem 1.5rem', gap: '1.25rem', width: '100%', border: '1px solid var(--border)' }}
                onClick={() => changePaymentMethod(method.id)}
                disabled={loading}
              >
                <span style={{ fontSize: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                  {method.icon}
                </span>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontWeight: '700', fontSize: '1rem', color: 'var(--text)' }}>
                    {method.label}
                  </span>
                  {booking.paymentMethod === method.id && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>
                      (Currently Selected)
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="cta-secondary"
            onClick={() => setIsChoosingMethod(false)}
            disabled={loading}
            style={{ width: '100%', padding: '1rem' }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-processor-container">
      {error && <div className="payment-error-alert">{error}</div>}

      {/* UPI Payment View */}
      {booking.paymentMethod === 'upi' && (
        <div className="payment-method-panel upi-panel">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button 
              type="button"
              className="copy-btn" 
              onClick={() => setIsChoosingMethod(true)}
              style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}
            >
              ← Switch Payment Method
            </button>
          </div>
          <div className="payment-header-row">
            <FaMobileAlt className="panel-method-icon" />
            <div>
              <h3>Pay with UPI</h3>
              <p>Scan and complete payment instantly</p>
            </div>
          </div>

          <div className="upi-qr-wrapper">
            {booking.qrCode ? (
              <div className="upi-qr-box">
                <img src={booking.qrCode} alt="UPI Payment QR Code" className="upi-qr-image" />
                <span className="upi-scan-indicator"></span>
              </div>
            ) : (
              <div className="qr-error">QR code generation failed. Please use UPI ID.</div>
            )}
            
            <div className="upi-details">
              <span className="amount-badge">Total Amount: ₹{booking.totalAmount.toLocaleString('en-IN')}</span>
              <p className="upi-id-label">Wander India Official UPI ID:</p>
              <div className="upi-id-row">
                <code>pay.wanderindia@icici</code>
                <button onClick={handleCopyUPI} className="copy-btn" title="Copy UPI ID">
                  {upiCopied ? 'Copied!' : <FaCopy />}
                </button>
              </div>
            </div>
          </div>

          <div className="upi-apps-row">
            <span className="apps-title">Supported Apps</span>
            <div className="upi-apps-grid">
              <div className="upi-app-badge gpay">Google Pay</div>
              <div className="upi-app-badge phonepe">PhonePe</div>
              <div className="upi-app-badge paytm">Paytm</div>
              <div className="upi-app-badge bhim">BHIM</div>
            </div>
          </div>

          <button 
            onClick={processPayment} 
            disabled={loading} 
            className="payment-action-button upi-action"
          >
            {loading ? <><FaSpinner className="spinner-icon" /> Verifying Payment...</> : 'I have completed the payment'}
          </button>
        </div>
      )}

      {/* Credit/Debit Card Payment View */}
      {(booking.paymentMethod === 'credit_card' || booking.paymentMethod === 'debit_card') && (
        <div className="payment-method-panel card-panel">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button 
              type="button"
              className="copy-btn" 
              onClick={() => setIsChoosingMethod(true)}
              style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}
            >
              ← Switch Payment Method
            </button>
          </div>
          <div className="payment-header-row">
            <FaCreditCard className="panel-method-icon" />
            <div>
              <h3>Pay by Card</h3>
              <p>Secure payment using 128-bit encryption</p>
            </div>
          </div>

          {/* Interactive Card Visualization */}
          <div className={`interactive-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
            <div className="card-inner">
              {/* Card Front */}
              <div className="card-front">
                <div className="card-chip"></div>
                <div className="card-network-logo">VISA</div>
                <div className="card-number-display">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="card-details-row">
                  <div className="card-detail-item">
                    <span className="card-detail-label">CARDHOLDER</span>
                    <span className="card-detail-value">{cardName.toUpperCase() || 'YOUR NAME HERE'}</span>
                  </div>
                  <div className="card-detail-item">
                    <span className="card-detail-label">EXPIRES</span>
                    <span className="card-detail-value">{cardExpiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              {/* Card Back */}
              <div className="card-back">
                <div className="card-magnetic-strip"></div>
                <div className="card-signature-panel">
                  <div className="card-cvv-display">{cardCvv || '•••'}</div>
                </div>
                <p className="card-back-text">Authorized signature. Secure booking checkout powered by WanderIndia.</p>
              </div>
            </div>
          </div>

          {/* Card Form */}
          <form onSubmit={handleCardSubmit} className="card-form-grid">
            <div className="form-group-card">
              <label>Cardholder Name</label>
              <input 
                type="text" 
                placeholder="e.g. John Doe"
                value={cardName} 
                onChange={(e) => setCardName(e.target.value.slice(0, 24))}
                onFocus={() => setIsFlipped(false)}
                required
              />
            </div>
            
            <div className="form-group-card">
              <label>Card Number</label>
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000"
                value={cardNumber} 
                onChange={handleCardNumberChange}
                onFocus={() => setIsFlipped(false)}
                required
              />
            </div>

            <div className="form-group-half">
              <div className="form-group-card">
                <label>Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  value={cardExpiry} 
                  onChange={handleExpiryChange}
                  onFocus={() => setIsFlipped(false)}
                  required
                />
              </div>

              <div className="form-group-card">
                <label>CVV</label>
                <input 
                  type="password" 
                  placeholder="123"
                  value={cardCvv} 
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="payment-action-button card-action"
            >
              {loading ? (
                <><FaSpinner className="spinner-icon" /> Processing Card...</>
              ) : (
                <><FaLock /> Pay ₹{booking.totalAmount.toLocaleString('en-IN')}</>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Net Banking Payment View */}
      {booking.paymentMethod === 'net_banking' && (
        <div className="payment-method-panel bank-panel">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button 
              type="button"
              className="copy-btn" 
              onClick={() => setIsChoosingMethod(true)}
              style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}
            >
              ← Switch Payment Method
            </button>
          </div>
          <div className="payment-header-row">
            <FaUniversity className="panel-method-icon" />
            <div>
              <h3>Net Banking</h3>
              <p>Select your bank to proceed with the transfer</p>
            </div>
          </div>

          <div className="bank-selection-grid">
            {[
              { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
              { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
              { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
              { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
              { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK' },
              { id: 'pnb', name: 'Punjab National Bank', code: 'PNB' }
            ].map(bank => (
              <button 
                key={bank.id}
                type="button"
                className={`bank-card-option ${selectedBank === bank.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedBank(bank.id);
                  setError('');
                }}
              >
                <span className="bank-code-logo">{bank.code}</span>
                <span className="bank-name-label">{bank.name}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleBankPay} 
            disabled={loading} 
            className="payment-action-button bank-action"
          >
            Proceed to Bank Portal (₹{booking.totalAmount.toLocaleString('en-IN')})
          </button>

          {/* Secure Bank Login Modal Mock */}
          {showBankModal && (
            <div className="bank-modal-overlay">
              <div className="bank-modal-container">
                <div className="bank-modal-header">
                  <h3>Secure Gateway - {selectedBank.toUpperCase()} Portal</h3>
                  <button onClick={() => setShowBankModal(false)} className="close-modal-btn">×</button>
                </div>
                
                {bankStep === 1 ? (
                  <form onSubmit={handleBankLogin} className="bank-modal-form">
                    <p className="bank-notice">WanderIndia is requesting payment of ₹{booking.totalAmount.toLocaleString('en-IN')}</p>
                    {error && <div className="payment-error-alert">{error}</div>}
                    
                    <div className="form-group-card">
                      <label>NetBanking Username</label>
                      <input 
                        type="text" 
                        value={bankUsername} 
                        onChange={(e) => setBankUsername(e.target.value)}
                        placeholder="Enter Username"
                        required 
                      />
                    </div>
                    
                    <div className="form-group-card">
                      <label>Password</label>
                      <input 
                        type="password" 
                        value={bankPassword} 
                        onChange={(e) => setBankPassword(e.target.value)}
                        placeholder="Enter Password"
                        required 
                      />
                    </div>

                    <button type="submit" disabled={loading} className="bank-portal-btn">
                      {loading ? <FaSpinner className="spinner-icon" /> : 'Log In & Authorize'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleBankOtpSubmit} className="bank-modal-form">
                    <p className="bank-notice">A 6-digit One Time Password (OTP) has been sent to your registered mobile number ending in •••• 9876.</p>
                    {error && <div className="payment-error-alert">{error}</div>}

                    <div className="form-group-card">
                      <label>Enter OTP</label>
                      <input 
                        type="text" 
                        value={bankOtp} 
                        onChange={(e) => setBankOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        placeholder="Enter OTP"
                        required 
                      />
                    </div>

                    <button type="submit" disabled={loading} className="bank-portal-btn final-pay">
                      {loading ? <FaSpinner className="spinner-icon" /> : 'Confirm & Pay'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentProcessor;
