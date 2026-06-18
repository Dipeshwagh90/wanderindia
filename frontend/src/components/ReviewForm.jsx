import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import '../styles/ReviewForm.css';

const ReviewForm = ({ destinationId, packageId, onReviewSubmitted, userName, userEmail }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const validateReview = () => {
    const trimmedTitle = title.trim();
    const trimmedComment = comment.trim();

    if (!trimmedTitle) {
      setError('Please enter a review title.');
      return false;
    }

    if (trimmedTitle.length < 5) {
      setError('Review title must be at least 5 characters long.');
      return false;
    }

    if (trimmedTitle.length > 100) {
      setError('Review title cannot exceed 100 characters.');
      return false;
    }

    if (!trimmedComment) {
      setError('Please enter a review comment.');
      return false;
    }

    if (trimmedComment.length < 10) {
      setError('Review must be at least 10 characters long.');
      return false;
    }

    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a valid rating between 1 and 5.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateReview()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        destinationId: destinationId || null,
        packageId: packageId || null,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        userName,
        userEmail
      };

      const response = await axiosInstance.post(
        '/reviews',
        reviewData
      );

      setRating(5);
      setTitle('');
      setComment('');
      setError('');
      onReviewSubmitted(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Share Your Experience</h3>
      
      {error && <div className="review-error">{error}</div>}

      <div className="form-group">
        <label>Rating</label>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              -
            </span>
          ))}
          <span className="rating-value">{rating}/5</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="title">Review Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience in a few words"
          maxLength="100"
          required
        />
        <small>{title.length}/100</small>
      </div>

      <div className="form-group">
        <label htmlFor="comment">Your Review</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your detailed experience, tips, and recommendations..."
          rows="5"
          minLength="10"
          required
        />
        <small>{comment.length} characters (minimum 10)</small>
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
