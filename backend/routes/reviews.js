const express = require('express');
const Review = require('../models/review');
const User = require('../models/user');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all reviews for a destination
router.get('/destination/:destinationId', async (req, res) => {
  try {
    const reviews = await Review.find({ destinationId: req.params.destinationId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all reviews for a package
router.get('/package/:packageId', async (req, res) => {
  try {
    const reviews = await Review.find({ packageId: req.params.packageId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews by user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new review
router.post('/', auth, async (req, res) => {
  const { destinationId, packageId, rating, title, comment, userName, userEmail } = req.body;

  if (!destinationId && !packageId) {
    return res.status(400).json({ message: 'Either destinationId or packageId must be provided' });
  }

  if (!rating || !title || !comment) {
    return res.status(400).json({ message: 'Rating, title, and comment are required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const review = new Review({
      user: req.user.id,
      destinationId: destinationId || null,
      packageId: packageId || null,
      rating,
      title,
      comment,
      userName: userName || user.name,
      userEmail: userEmail || user.email
    });

    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.title) review.title = req.body.title;
    if (req.body.comment) review.comment = req.body.comment;
    review.updatedAt = Date.now();

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark review as helpful
router.post('/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.helpful += 1;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark review as not helpful
router.post('/:id/not-helpful', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.notHelpful += 1;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
