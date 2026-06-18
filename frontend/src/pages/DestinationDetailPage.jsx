import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { destinations as fallbackDestinations } from '../data/destinations';
import ReviewForm from '../components/ReviewForm';
import ReviewsList from '../components/ReviewsList';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/DestinationDetailPage.css';

// Fallback color mapping for placeholder backgrounds
const placeholderColors = {
  'Beach': '#87CEEB',
  'Mountain': '#8B7355',
  'Heritage': '#DAA520',
  'Adventure': '#228B22',
  'City': '#696969',
  'Spiritual': '#4169E1'
};

const DestinationDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshReviews, setRefreshReviews] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await axiosInstance.get(`/destinations/${id}`);
        setDestination(res.data);
      } catch (err) {
        console.error('Error fetching destination details, using static fallback:', err);
        const fallback = fallbackDestinations.find(dest => dest._id === id);
        setDestination(fallback || null);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading destination details..." />;
  }

  if (!destination) {
    return (
      <div className="destination-not-found">
        <h2>Destination not found</h2>
        <p>Sorry, the destination you're looking for doesn't exist.</p>
      </div>
    );
  }

  const handleReviewSubmitted = (newReview) => {
    setRefreshReviews(!refreshReviews);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const fallbackBgColor = placeholderColors[destination.category] || '#9370DB';

  return (
    <div className="destination-detail-page">
      <div className="destination-hero">
        <div style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden' }}>
          {!imageLoaded && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: fallbackBgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '5rem',
                zIndex: 1
              }}
            >
              [Location]
            </div>
          )}
          <img 
            src={destination.image} 
            alt={destination.name} 
            className="destination-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ 
              opacity: imageError ? 0 : 1,
              transition: 'opacity 0.3s ease',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {imageError && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: fallbackBgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'white',
                fontSize: '4rem',
                zIndex: 2
              }}
            >
              <span style={{ fontSize: '1rem', marginTop: '1rem' }}>Image not available</span>
            </div>
          )}
        </div>
        <div className="destination-overlay">
          <div className="destination-content">
            <h1>{destination.name}</h1>
            <div className="destination-meta">
              <span className="category-badge">{destination.category}</span>
              <span className="rating-badge">⭐ {destination.rating}/5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="destination-container">
        <div className="destination-main">
          <section className="info-section">
            <h2>About This Destination</h2>
            <p className="description">{destination.description}</p>
          </section>

          <section className="info-section">
            <h2>Best Time to Visit</h2>
            <p className="best-time">{destination.bestTimeToVisit}</p>
          </section>

          <section className="info-section">
            <h2>Things to Do</h2>
            <ul className="things-to-do">
              {destination.thingsToDo.map((thing, index) => (
                <li key={index} className="todo-item">
                  <span className="todo-icon">*</span>
                  <span>{thing}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="info-section map-section">
            <h2>Location</h2>
            <div className="map-placeholder">
              <div className="map-container">
                <iframe
                  title={`Map of ${destination.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(destination.name.replace(/^[^\w]*/, '').trim())}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            </div>
          </section>
        </div>

        <aside className="destination-sidebar">
          <div className="quick-info-card">
            <h3>Quick Info</h3>
            <div className="info-item">
              <span className="label">Category</span>
              <span className="value">{destination.category}</span>
            </div>
            <div className="info-item">
              <span className="label">Rating</span>
              <span className="value">⭐ {destination.rating}/5</span>
            </div>
          </div>

          <div className="quick-info-card" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
            <h3 style={{ margin: 0 }}>Ready to Visit?</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Start your adventure now in {destination.name}</p>
            <Link 
              to={`/book?destination=${encodeURIComponent(destination.name.replace(/^[^\w]*/, '').trim())}`} 
              className="cta-button" 
              style={{ width: '100%', display: 'inline-flex', justifyContent: 'center', boxSizing: 'border-box', textDecoration: 'none' }}
            >
              Book Destination
            </Link>
          </div>
        </aside>
      </div>

      <div className="reviews-main-container">
        {user ? (
          <ReviewForm 
            destinationId={id}
            packageId={null}
            onReviewSubmitted={handleReviewSubmitted}
            userName={user.name || 'User'}
            userEmail={user.email || ''}
          />
        ) : (
          <div className="login-prompt">
            <p>! Please <strong>log in</strong> to share your review</p>
          </div>
        )}

        <ReviewsList 
          destinationId={id}
          packageId={null}
          refresh={refreshReviews}
          currentUserId={user?._id || user?.id}
        />
      </div>
    </div>
  );
};

export default DestinationDetailPage;