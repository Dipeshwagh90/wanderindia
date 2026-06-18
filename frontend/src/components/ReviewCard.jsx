import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ReviewCard.css';

const ReviewCard = ({ review, onDelete, currentUserId }) => {
  const [helpful, setHelpful] = useState(review.helpful);
  const [notHelpful, setNotHelpful] = useState(review.notHelpful);
  const [hasVoted, setHasVoted] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleHelpful = async () => {
    if (hasVoted) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/reviews/${review._id}/helpful`
      );
      setHelpful(response.data.helpful);
      setHasVoted(true);
    } catch (err) {
      console.error('Failed to mark as helpful:', err);
    }
  };

  const handleNotHelpful = async () => {
    if (hasVoted) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/reviews/${review._id}/not-helpful`
      );
      setNotHelpful(response.data.notHelpful);
      setHasVoted(true);
    } catch (err) {
      console.error('Failed to mark as not helpful:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:5000/api/reviews/${review._id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        onDelete(review._id);
      } catch (err) {
        console.error('Failed to delete review:', err);
      }
    }
  };

  const isOwner = currentUserId && review.user === currentUserId;

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user-info">
          <span className="review-user-name">{review.userName}</span>
          <span className="review-date">{formatDate(review.createdAt)}</span>
        </div>
        <div className="review-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < review.rating ? 'star-filled' : 'star-empty'}>
              -
            </span>
          ))}
        </div>
      </div>

      <div className="review-title">{review.title}</div>
      
      <div className="review-comment">{review.comment}</div>

      <div className="review-footer">
        <div className="review-actions">
          <button 
            className={`helpful-btn ${hasVoted ? 'disabled' : ''}`}
            onClick={handleHelpful}
            disabled={hasVoted}
            title={hasVoted ? 'You have already voted' : 'Mark as helpful'}
          >
            Helpful ({helpful})
          </button>
          <button 
            className={`not-helpful-btn ${hasVoted ? 'disabled' : ''}`}
            onClick={handleNotHelpful}
            disabled={hasVoted}
            title={hasVoted ? 'You have already voted' : 'Mark as not helpful'}
          >
            Not Helpful ({notHelpful})
          </button>
        </div>
        
        {isOwner && (
          <button 
            className="delete-btn"
            onClick={handleDelete}
            title="Delete your review"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
