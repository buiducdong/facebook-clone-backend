const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Please enter your name'],
    },

    email: {
      type: String,
      unique: true,
      required: [true, 'Please enter your email'],
    },

    password: {
      type: String,
      required: [true, 'Please enter your password'],
    },

    role: {
      type: Number,
      default: 0,
    },

    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/bonba/image/upload/v1642412567/avatar/admin2_fvvzux.png',
    },

    coverPicture: {
      type: String,
      default:
        'https://res.cloudinary.com/bonba/image/upload/v1646535309/facebook-clone/defaultCover_mmoily.png',
    },

    followers: {
      type: Array,
      default: [],
    },

    followings: {
      type: Array,
      default: [],
    },

    desc: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Users', UserSchema);
