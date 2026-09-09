const mongoose = require('mongoose');

const scanResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scanType: {
    type: String,
    enum: ['domain', 'ip', 'website', 'network', 'email'],
    required: true
  },
  target: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending'
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  metadata: {
    ip: String,
    domain: String,
    country: String,
    organization: String,
    asn: String
  },
  findings: [{
    type: String,
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    description: String
  }],
  tags: [String],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

module.exports = mongoose.model('ScanResult', scanResultSchema);