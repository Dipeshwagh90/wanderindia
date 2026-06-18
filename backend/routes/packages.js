const express = require('express');
const Package = require('../models/package');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().populate('destination');
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id).populate('destination');
    if (!package) return res.status(404).json({ message: 'Package not found' });
    res.json(package);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;