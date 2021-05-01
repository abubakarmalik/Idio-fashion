//require moonges 
const mongoose = require('mongoose');
// create moonges schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  googleid: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  temporary: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
