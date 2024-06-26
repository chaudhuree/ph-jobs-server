const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
  },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Notification', NotificationSchema);