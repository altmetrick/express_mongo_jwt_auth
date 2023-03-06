const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'User name must be provided'],
    trim: true,
  },
  roles: {
    user: {
      type: Number,
      default: 2001,
    },
    editor: {
      type: Number,
    },
    admin: {
      type: Number,
    },
  },
  password: {
    type: String,
    required: [true, 'Password must be provided'],
  },
  refreshToken: { type: String },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
