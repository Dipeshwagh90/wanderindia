import React from 'react';
import { 
  FaCompass, 
  FaCalendarAlt, 
  FaMapMarkedAlt, 
  FaHeadset, 
  FaAward, 
  FaUserTie, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaClock, 
  FaInfoCircle, 
  FaGlobe 
} from 'react-icons/fa';

const AboutPage = () => {
  const team = [
    { name: 'Rajesh Kumar', role: 'Founder & Travel Expert', initials: 'RK' },
    { name: 'Priya Sharma', role: 'Head of Operations', initials: 'PS' },
    { name: 'Arjun Singh', role: 'Guide & Local Expert', initials: 'AS' }
  ];

  const offerings = [
    {
      title: 'Curated Packages',
      description: 'Carefully selected destination packages for every type of traveler - from adventure seekers to culture enthusiasts.',
      icon: <FaCompass />
    },
    {
      title: 'Flexible Booking',
      description: 'Transparent pricing, flexible cancellation policies, and booking options that work for your schedule.',
      icon: <FaCalendarAlt />
    },
    {
      title: 'Expert Guidance',
      description: 'Professional guidance on accommodations, local tours, and hidden gems you won\'t find elsewhere.',
      icon: <FaMapMarkedAlt />
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support to ensure your journey is smooth and worry-free.',
      icon: <FaHeadset />
    },
    {
      title: 'Local Expertise',
      description: 'Connect with experienced local guides who share insider knowledge and authentic experiences.',
      icon: <FaUserTie />
    },
    {
      title: 'Quality Assured',
      description: 'All partnerships vetted and tested for quality, safety, and authentic cultural experiences.',
      icon: <FaAward />
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="about-badge">
            <FaInfoCircle style={{ marginRight: '0.4rem' }} /> Who We Are
          </span>
          <h1>About WanderIndia</h1>
          <p>
            WanderIndia is dedicated to making travel simple, inspiring, and unforgettable. We bring India's rich culture, scenic beauty, and authentic adventures to every journey.
          </p>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="about-section story-section">
        <div className="story-grid">
          <div className="story-narrative">
            <h2>Our Story</h2>
            <p>
              Since 2023, WanderIndia has helped thousands of travelers explore the best of India with thoughtfully curated trips and dependable local support. We started as a small group of passionate explorers and built a service that values authenticity, comfort, and discovery above all else.
            </p>
            <p>
              Our journey began with a simple dream: to make travel accessible and memorable for everyone. Today, we've grown into a trusted platform that connects travelers with authentic Indian experiences, preserving heritage and supporting local communities.
            </p>
          </div>
          <div className="story-highlight-card">
            <div className="highlight-icon">
              <FaGlobe />
            </div>
            <h3>Authentic Journeys</h3>
            <p>Connecting explorers with the real, untouched India through micro-local guides and customized schedules.</p>
            <div className="highlight-stat">
              <div>
                <span className="stat-num">50+</span>
                <span className="stat-lbl">Destinations</span>
              </div>
              <div>
                <span className="stat-num">10k+</span>
                <span className="stat-lbl">Happy Travelers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="about-section offerings-section">
        <div className="section-title-wrap">
          <h2>What We Offer</h2>
          <p>Discover the features that make traveling with WanderIndia a premium experience.</p>
        </div>
        <div className="offerings-grid">
          {offerings.map((item, idx) => (
            <div key={idx} className="offering-card">
              <div className="offering-icon-wrap">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section team-section">
        <div className="section-title-wrap">
          <h2>Our Team</h2>
          <p>Our dedicated experts combine local knowledge and travel expertise to craft seamless journeys.</p>
        </div>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-avatar-circle">
                <span>{member.initials}</span>
              </div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="about-section contact-section">
        <div className="contact-grid">
          <div className="contact-info-block">
            <h2>Get In Touch</h2>
            <p>Have questions or want to plan your custom Indian adventure? Our travel specialists are here to guide you every step of the way.</p>
            
            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="detail-icon-box">
                  <FaEnvelope />
                </div>
                <div>
                  <span className="detail-lbl">Email Address</span>
                  <a href="mailto:support@wanderindia.com" className="detail-val">support@wanderindia.com</a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon-box">
                  <FaPhoneAlt />
                </div>
                <div>
                  <span className="detail-lbl">Phone Number</span>
                  <a href="tel:+919876543210" className="detail-val">+91 9876 543 210</a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon-box">
                  <FaClock />
                </div>
                <div>
                  <span className="detail-lbl">Response Time</span>
                  <span className="detail-val-text">We respond within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-aesthetic-card">
            <h3>Ready to Explore?</h3>
            <p>Your journey of a lifetime is just one booking away. Let's make your dream trip a reality.</p>
            <a href="/packages" className="cta-button">Browse Travel Packages</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;