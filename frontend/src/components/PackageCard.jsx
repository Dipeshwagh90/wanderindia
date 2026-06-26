import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorageObject } from '../hooks/useLocalStorage';
import { FaHeart, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import '../styles/Cards.css';

const PackageCard = ({ package: pkg }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { getItem, setItem } = useLocalStorageObject();

  useEffect(() => {
    const wishlist = getItem('packageWishlist') || [];
    setIsWishlisted(wishlist.some(item => item._id === pkg._id));
  }, [pkg._id, getItem]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    const wishlist = getItem('packageWishlist') || [];
    
    if (isWishlisted) {
      const updatedWishlist = wishlist.filter(item => item._id !== pkg._id);
      setItem('packageWishlist', updatedWishlist);
    } else {
      wishlist.push(pkg);
      setItem('packageWishlist', wishlist);
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

  return (
    <div className="package-card">
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '3rem',
              zIndex: 1
            }}
          >
            [Package]
          </div>
        )}
        <img 
          src={pkg.image} 
          alt={pkg.name}
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        <h3 className="card-title">{pkg.name}</h3>

        <div className="card-meta">
          <span className="category-tag">
            {pkg.destination?.name || 'Tour'}
          </span>
          {pkg.destination?.rating && (
            <span className="rating-badge">
              <FaStar /> {pkg.destination.rating}/5
            </span>
          )}
        </div>

        <p className="card-desc">
          Includes: {pkg.inclusions?.slice(0, 3).join(', ')}
          {pkg.inclusions?.length > 3 ? '...' : ''}
        </p>

        <div className="card-info-row">
          <div className="card-price">
            <span className="price-label">Price starts from</span>
            <span className="price-val">₹{pkg.price?.toLocaleString('en-IN')}</span>
          </div>
          <span className="card-duration">
            <FaCalendarAlt /> {pkg.duration} Days
          </span>
        </div>

        <Link to={`/packages/${pkg._id}`} className="card-btn">
          Explore Package <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;