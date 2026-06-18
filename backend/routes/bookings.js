const express = require('express');
const Booking = require('../models/booking');
const Package = require('../models/package');
const QRCode = require('qrcode');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate unique confirmation number
const generateConfirmationNumber = () => {
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `CONF-${new Date().getFullYear()}-${random}${timestamp}`;
};

// Generate QR code for payment or check-in verification
const generatePaymentQRCode = async (bookingData, isPaid = false) => {
  try {
    let qrData = '';

    if (bookingData.paymentMethod === 'upi' && !isPaid && bookingData.status !== 'cancelled') {
      // Create a real UPI Deep Link
      // UPI URL format: upi://pay?pa=<address>&pn=<name>&am=<amount>&cu=<currency>&tn=<transaction-note>
      const upiId = 'pay.wanderindia@icici';
      const merchantName = encodeURIComponent('Wander India Travels');
      const amount = bookingData.totalAmount;
      const note = encodeURIComponent(`Booking-${bookingData.confirmationNumber}`);
      qrData = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${note}`;
    } else {
      // Check-in verification QR code for cash or confirmed paid bookings
      const paymentInfo = {
        confirmationNo: bookingData.confirmationNumber,
        destination: bookingData.destination,
        amount: `₹${(bookingData.totalAmount || 0).toLocaleString('en-IN')}`,
        paymentStatus: (bookingData.status === 'cancelled')
          ? 'Cancelled'
          : (bookingData.paymentMethod === 'cash') 
            ? 'Pay on Arrival (Cash)' 
            : (isPaid || bookingData.status === 'confirmed') ? 'Paid / Confirmed' : 'Pending / Unpaid',
        paymentMethod: bookingData.paymentMethod,
        timestamp: new Date().toISOString()
      };
      qrData = JSON.stringify(paymentInfo);
    }

    const qrCode = await QRCode.toDataURL(qrData);
    return qrCode;
  } catch (err) {
    console.error('QR Code generation error:', err);
    return null;
  }
};

// Get current user's bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('package');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    // Validate payment method
    if (!req.body.paymentMethod) {
      return res.status(400).json({
        message: 'Payment method is required'
      });
    }

    // Calculate total amount based on package price, tier and traveler count
    let basePrice = 5000; // default base price for custom tours
    if (req.body.package) {
      const pkg = await Package.findById(req.body.package);
      if (pkg) {
        basePrice = pkg.price;
      }
    }

    let multiplier = 1.0;
    if (req.body.packageType === 'premium') multiplier = 1.25;
    else if (req.body.packageType === 'luxury') multiplier = 1.6;

    const totalAmount = Math.round(basePrice * multiplier * (req.body.numPeople || 1));

    // Generate confirmation number
    const confirmationNumber = generateConfirmationNumber();

    const bookingData = {
      ...req.body,
      user: req.user.id,
      totalAmount,
      confirmationNumber,
      status: req.body.paymentMethod === 'cash' ? 'confirmed' : 'pending'
    };

    // Generate QR code (Only for cash or UPI payments initially)
    let qrCode = null;
    if (req.body.paymentMethod === 'cash' || req.body.paymentMethod === 'upi') {
      qrCode = await generatePaymentQRCode(bookingData, req.body.paymentMethod === 'cash');
    }

    if (qrCode) {
      bookingData.qrCode = qrCode;
    }

    // Save booking
    const booking = new Booking(bookingData);
    const newBooking = await booking.save();

    res.status(201).json({
      ...newBooking.toObject(),
      confirmationNumber,
      qrCode: qrCode || null
    });

  } catch (err) {
    console.error(err);

    res.status(400).json({
      message: err.message
    });
  }
});

// Confirm payment / update status of booking (user self-pay)
router.put('/:id/pay', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Check if booking belongs to the current user
    if (!booking.user || booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.status = 'confirmed';
    booking.confirmedAt = new Date();
    
    // Generate check-in QR code (Paid)
    const qrCode = await generatePaymentQRCode(booking, true);
    if (qrCode) {
      booking.qrCode = qrCode;
    }

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update payment method of booking
router.put('/:id/payment-method', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Check if booking belongs to the current user
    if (!booking.user || booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (booking.status === 'confirmed') {
      return res.status(400).json({ message: 'Cannot change payment method for confirmed booking' });
    }

    const { paymentMethod } = req.body;
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    booking.paymentMethod = paymentMethod;
    
    // If changed to cash, set status to confirmed immediately. Otherwise keep/set to pending.
    if (paymentMethod === 'cash') {
      booking.status = 'confirmed';
      booking.confirmedAt = new Date();
    } else {
      booking.status = 'pending';
      booking.confirmedAt = undefined;
    }

    // Generate appropriate QR code
    const qrCode = await generatePaymentQRCode(booking, booking.status === 'confirmed');
    booking.qrCode = qrCode || null;

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking (regular user self-cancel)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Check if booking belongs to the current user
    if (!booking.user || booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    
    // Generate check-in QR code showing Cancelled status
    const qrCode = await generatePaymentQRCode(booking, false);
    if (qrCode) {
      booking.qrCode = qrCode;
    }

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;