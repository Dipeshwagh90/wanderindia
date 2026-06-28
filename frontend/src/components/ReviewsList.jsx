import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ReviewCard from './ReviewCard';
import '../styles/ReviewsList.css';

const ReviewsList = ({ destinationId, packageId, refresh, currentUserId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchReviews();
  }, [destinationId, packageId, refresh]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const url = destinationId 
        ? `/reviews/destination/${destinationId}`
        : `/reviews/package/${packageId}`;

      const response = await axiosInstance.get(url);
      
      // Sort reviews based on sortBy value
      let sortedReviews = [...response.data];
      if (sortBy === 'helpful') {
        sortedReviews.sort((a, b) => b.helpful - a.helpful);
      } else if (sortBy === 'rating-high') {
        sortedReviews.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'rating-low') {
        sortedReviews.sort((a, b) => a.rating - b.rating);
      }

      setReviews(sortedReviews);

      // Calculate average rating
      if (sortedReviews.length > 0) {
        const avgRating = (sortedReviews.reduce((sum, review) => sum + review.rating, 0) / sortedReviews.length).toFixed(1);
        setAverageRating(avgRating);
      }
      setError('');
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewDelete = (reviewId) => {
    setReviews(reviews.filter(review => review._id !== reviewId));
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    
    let sortedReviews = [...reviews];
    if (newSort === 'helpful') {
      sortedReviews.sort((a, b) => b.helpful - a.helpful);
    } else if (newSort === 'rating-high') {
      sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (newSort === 'rating-low') {
      sortedReviews.sort((a, b) => a.rating - b.rating);
    } else {
      sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setReviews(sortedReviews);
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  if (error) {
    return <div className="reviews-error">{error}</div>;
  }

  return (
    <div className="reviews-list-container">
      <div className="reviews-header">
        <div className="reviews-stats">
          <div className="rating-summary">
            <div className="average-rating">
              <span className="rating-number">{averageRating}</span>
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(averageRating) ? 'star-filled' : 'star-empty'}>
                    -
                  </span>
                ))}
              </div>
              <span className="review-count">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          </div>
        </div>

        <div className="reviews-sort">
          <label htmlFor="sort-select">Sort by:</label>
          <select id="sort-select" value={sortBy} onChange={handleSortChange}>
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
      </div>

      <div className="reviews-content">
        {reviews.length > 0 ? (
          <div className="reviews-grid">
            {reviews.map(review => (
              <ReviewCard 
                key={review._id} 
                review={review}
                onDelete={handleReviewDelete}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
