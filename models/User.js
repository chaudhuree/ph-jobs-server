const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
  },
  email: {
    type: String,
  },
  photoURL: {
    type: String,
  }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('User', UserSchema);