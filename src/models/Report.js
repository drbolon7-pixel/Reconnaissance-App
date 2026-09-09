const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  target: String,
  scanResults: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScanResult'
  }],
  executive_summary: String,
  findings: [{
    id: String,
    title: String,
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    description: String,
    recommendation: String
  }],
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private'
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: Date
});

module.exports = mongoose.model('Report', reportSchema);