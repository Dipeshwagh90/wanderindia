import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorageObject } from '../hooks/useLocalStorage';
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
              height: '150px',
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
              height: '150px',
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
      <h3>{pkg.name}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span className="rating-badge" style={{ fontSize: '1.1rem', fontWeight: 'bold', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
          ₹{pkg.price?.toLocaleString()}
        </span>
      </div>
      <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
        <p style={{ margin: '0.25rem 0' }}>
          Duration: <strong>{pkg.duration}</strong>
        </p>
        <p style={{ margin: '0.25rem 0' }}>
          Includes: {pkg.inclusions?.slice(0, 2).join(', ')}...
        </p>
      </div>
      <Link to={`/packages/${pkg._id}`} style={{ marginTop: 'auto' }}>
        Explore Package →
      </Link>
    </div>
  );
};

export default PackageCard;