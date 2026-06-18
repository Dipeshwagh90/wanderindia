import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaHeadset, 
  FaMapMarkerAlt, 
  FaChevronUp 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Packages', path: '/packages' },
    { name: 'About Us', path: '/about' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms of Service', path: '#' },
    { name: 'Cookie Policy', path: '#' }
  ];

  return (
    <footer className="footer-enhanced">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <h3 className="footer-title">WanderIndia</h3>
            </div>
            <p className="footer-description">
              Discover the magic of India with our expertly curated travel experiences. From the Himalayas to the beaches of Goa, we bring your travel dreams to life.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" className="social-link">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter" className="social-link">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" className="social-link">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="social-link">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Info */}
          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-info">
              <li className="footer-info-item">
                <span className="info-icon"><FaEnvelope /></span>
                <a href="mailto:support@wanderindia.com" className="info-link">support@wanderindia.com</a>
              </li>
              <li className="footer-info-item">
                <span className="info-icon"><FaPhoneAlt /></span>
                <a href="tel:+919876543210" className="info-link">+91 9876 543 210</a>
              </li>
              <li className="footer-info-item">
                <span className="info-icon"><FaHeadset /></span>
                <span className="info-text">24/7 Available</span>
              </li>
              <li className="footer-info-item">
                <span className="info-icon"><FaMapMarkerAlt /></span>
                <span className="info-text">Mumbai, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4 className="footer-heading">Newsletter</h4>
            <p className="footer-newsletter-desc">
              Subscribe to get travel tips, destination guides, and exclusive offers delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-group">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  {subscribed ? 'Subscribed!' : 'Subscribe'}
                </button>
              </div>
              {subscribed && (
                <p className="success-message">Thanks for subscribing! Check your email.</p>
              )}
            </form>
          </div>
        </div>

        {/* Footer Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} WanderIndia. All rights reserved.</p>
          </div>
          <div className="footer-legal">
            {legalLinks.map((link, index) => (
              <div key={link.path}>
                <Link to={link.path} className="legal-link">{link.name}</Link>
                {index < legalLinks.length - 1 && <span className="divider">•</span>}
              </div>
            ))}
          </div>
          <button className="back-to-top-btn" onClick={scrollToTop} title="Back to top">
            <FaChevronUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;