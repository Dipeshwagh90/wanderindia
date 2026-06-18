import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorageObject } from '../hooks/useLocalStorage';
import '../styles/Cards.css';

// Fallback color mapping for placeholder backgrounds
const placeholderColors = {
  'Beach': '#87CEEB',
  'Mountain': '#8B7355',
  'Heritage': '#DAA520',
  'Adventure': '#228B22',
  'City': '#696969',
  'Spiritual': '#4169E1'
};

const DestinationCard = ({ destination }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { getItem, setItem } = useLocalStorageObject();

  useEffect(() => {
    const wishlist = getItem('wishlist') || [];
    setIsWishlisted(wishlist.some(item => item._id === destination._id));
  }, [destination._id, getItem]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    const wishlist = getItem('wishlist') || [];
    
    if (isWishlisted) {
      const updatedWishlist = wishlist.filter(item => item._id !== destination._id);
      setItem('wishlist', updatedWishlist);
    } else {
      wishlist.push(destination);
      setItem('wishlist', wishlist);
    }
    setIsWishlisted(!isWishlisted);
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
    <div className="destination-card">
      <button 
        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
        onClick={toggleWishlist}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isWishlisted ? '❤️' : '❤️'}
      </button>
      <div className="image-container" style={{ position: 'relative', overflow: 'hidden' }}>
        {!imageLoaded && (
          <div 
            className="image-placeholder"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '200px',
              background: fallbackBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '3rem',
              zIndex: 1
            }}
          >
            Location unavailable
          </div>
        )}
        <img 
          src={destination.image} 
          alt={destination.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            opacity: imageError ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
        {imageError && (
          <div 
            className="image-error"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '200px',
              background: fallbackBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white',
              fontSize: '2rem',
              zIndex: 2
            }}
          >
            <span style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Image not available</span>
          </div>
        )}
      </div>
      <h3>{destination.name}</h3>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span className="rating-badge">
          ⭐ {destination.rating}/5
        </span>
        <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
          {destination.category}
        </span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
        Best time: {destination.bestTime || 'Year-round'}
      </p>
      <Link to={`/destinations/${destination._id}`} style={{ marginTop: 'auto' }}>
        View Details →
      </Link>
    </div>
  );
};

export default DestinationCard;