const express = require('express');
const router = express.Router();
const ScanResult = require('../models/ScanResult');
const { authenticate } = require('../middleware/auth');

// Get all scans for user
router.get('/', authenticate, async (req, res) => {
  try {
    const scans = await ScanResult.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single scan
router.get('/:id', authenticate, async (req, res) => {
  try {
    const scan = await ScanResult.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    res.json(scan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new scan
router.post('/scan', authenticate, async (req, res) => {
  try {
    const { scanType, target } = req.body;

    if (!scanType || !target) {
      return res.status(400).json({ error: 'Scan type and target required' });
    }

    const scan = new ScanResult({
      userId: req.user.userId,
      scanType,
      target,
      status: 'pending'
    });

    await scan.save();
    res.status(201).json(scan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update scan results
router.put('/:id/results', authenticate, async (req, res) => {
  try {
    const scan = await ScanResult.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    scan.results = req.body.results || scan.results;
    scan.status = req.body.status || scan.status;
    scan.findings = req.body.findings || scan.findings;
    scan.metadata = req.body.metadata || scan.metadata;
    scan.updatedAt = new Date();

    if (req.body.status === 'completed') {
      scan.completedAt = new Date();
    }

    await scan.save();
    res.json(scan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete scan
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const scan = await ScanResult.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    res.json({ message: 'Scan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;