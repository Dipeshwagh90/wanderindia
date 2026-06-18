import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { packages as fallbackPackages } from '../data/packages';
import { destinations as fallbackDestinations } from '../data/destinations';
import ReviewForm from '../components/ReviewForm';
import ReviewsList from '../components/ReviewsList';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/PackageDetailPage.css';

const PackageDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshReviews, setRefreshReviews] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axiosInstance.get(`/packages/${id}`);
        setPkg(res.data);
      } catch (err) {
        console.error('Error fetching package details, using fallback static data:', err);
        const fallbackPkg = fallbackPackages.find(p => p._id === id);
        if (fallbackPkg) {
          const fallbackDest = fallbackDestinations.find(d => d._id === fallbackPkg.destination);
          setPkg({
            ...fallbackPkg,
            destination: fallbackDest // Populate fallback destination like the backend
          });
        } else {
          setPkg(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const destination = pkg?.destination;

  if (loading) {
    return <LoadingSpinner message="Loading tour package details..." />;
  }

  if (!pkg) {
    return (
      <div className="package-not-found">
        <h2>Package not found</h2>
        <p>Sorry, the package you're looking for doesn't exist.</p>
      </div>
    );
  }

  const handleReviewSubmitted = (newReview) => {
    setRefreshReviews(!refreshReviews);
  };

  return (
    <div className="package-detail-page">
      <div className="package-hero">
        <div className="package-header">
          <div className="package-header-content">
            <h1>{pkg.name}</h1>
            <p className="destination-link">
              {destination?.name || 'Destination'}
            </p>
            <div className="package-badges">
              <span className="price-badge">₹{pkg.price.toLocaleString()}</span>
              <span className="duration-badge">{pkg.duration} Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="package-container">
        <div className="package-main">
          <section className="package-section">
            <h2>Package Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Price:</span>
                <span className="detail-value">₹{pkg.price.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">{pkg.duration} Days</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Destination:</span>
                <span className="detail-value">{destination?.name || 'N/A'}</span>
              </div>
            </div>
          </section>

          <section className="package-section">
            <h2>What's Included</h2>
            <ul className="inclusions-list">
              {pkg.inclusions.map((inc, index) => (
                <li key={index} className="inclusion-item">
                  <span className="check-icon">-</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="package-section">
            <h2>Itinerary</h2>
            <div className="itinerary">
              {pkg.itinerary.map((day, index) => (
                <div key={day.day} className="itinerary-day">
                  <div className="day-header">
                    <span className="day-number">Day {day.day}</span>
                    <div className="day-connector">
                      {index < pkg.itinerary.length - 1 && <div className="connector-line"></div>}
                    </div>
                  </div>
                  <div className="day-content">
                    <p>{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="package-sidebar">
          <div className="booking-card">
            <h3>Ready to Book?</h3>
            <div className="price-display">
              <span className="price-label">Total Price</span>
              <span className="price-amount">₹{pkg.price.toLocaleString()}</span>
            </div>
            <Link 
              to={`/book?packageId=${pkg._id}&destination=${encodeURIComponent(destination?.name.replace(/^[^\w]*/, '').trim() || '')}`} 
              className="book-btn"
              style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', width: '100%', boxSizing: 'border-box' }}
            >
              Book Now
            </Link>
            <p className="terms">*Terms and conditions apply</p>
          </div>

          <div className="quick-stats">
            <div className="stat">
              <span className="stat-icon">⭐</span>
              <div>
                <span className="stat-label">Highly Rated</span>
              </div>
            </div>
            <div className="stat">
              <span className="stat-icon">(+)</span>
              <div>
                <span className="stat-label">{pkg.duration} Days of Adventure</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="reviews-main-container">
        {user ? (
          <ReviewForm 
            destinationId={null}
            packageId={id}
            onReviewSubmitted={handleReviewSubmitted}
            userName={user.name || 'User'}
            userEmail={user.email || ''}
          />
        ) : (
          <div className="login-prompt">
            <p>Please <strong>log in</strong> to share your review</p>
          </div>
        )}

        <ReviewsList 
          destinationId={null}
          packageId={id}
          refresh={refreshReviews}
          currentUserId={user?._id || user?.id}
        />
      </div>
    </div>
  );
};

export default PackageDetailPage;