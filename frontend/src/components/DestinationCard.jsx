import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorageObject } from '../hooks/useLocalStorage';
import { FaHeart, FaStar } from 'react-icons/fa';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
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
        {isWishlisted ? <FaHeart /> : <FiHeart />}
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
              height: '220px',
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
              height: '220px',
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

      <div className="card-content">
        <h3 className="card-title">{destination.name}</h3>
        
        <div className="card-meta">
          <span className="rating-badge">
            <FaStar /> {destination.rating}/5
          </span>
          <span className="category-tag">
            {destination.category}
          </span>
        </div>
        
        <p className="card-desc">
          {destination.description || 'Discover the magical, cultural, and historic locations of this destination.'}
        </p>
        
        <div className="card-info-row">
          <span className="card-extra-info">
            Best time: {destination.bestTimeToVisit || destination.bestTime || 'Year-round'}
          </span>
        </div>

        <Link to={`/destinations/${destination._id}`} className="card-btn">
          View Details <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;