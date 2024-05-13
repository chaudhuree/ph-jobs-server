const mongoose = require('mongoose');

const AppliedSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resume: {
    type: String,
    required: [true, 'Please upload your resume'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Applied', AppliedSchema);