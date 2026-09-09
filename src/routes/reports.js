const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const ScanResult = require('../models/ScanResult');
const { authenticate } = require('../middleware/auth');

// Get all reports
router.get('/', authenticate, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('scanResults')
      .limit(50);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single report
router.get('/:id', authenticate, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.userId
    }).populate('scanResults');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new report
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, target, scanResults } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }

    const report = new Report({
      userId: req.user.userId,
      title,
      description,
      target,
      scanResults: scanResults || []
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update report
router.put('/:id', authenticate, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const { title, description, findings, status, executive_summary } = req.body;

    if (title) report.title = title;
    if (description) report.description = description;
    if (findings) report.findings = findings;
    if (status) report.status = status;
    if (executive_summary) report.executive_summary = executive_summary;
    report.updatedAt = new Date();

    if (status === 'published') {
      report.publishedAt = new Date();
    }

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete report
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate report from scans
router.post('/:id/generate-from-scans', authenticate, async (req, res) => {
  try {
    const { scanIds } = req.body;
    const scans = await ScanResult.find({
      _id: { $in: scanIds },
      userId: req.user.userId
    });

    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.scanResults = scanIds;
    report.updatedAt = new Date();

    // Extract findings from scans
    const findings = [];
    scans.forEach(scan => {
      if (scan.findings) {
        findings.push(...scan.findings);
      }
    });
    report.findings = findings;

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;