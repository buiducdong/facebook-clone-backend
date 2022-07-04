const User = require('../models/User');
const bcrybt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');

const { CLIENT_URL } = process.env;
const userCtrl = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please fill in all files!' });
      }
      if (!validateEmail(email)) {
        return res.status(500).json({ msg: 'Invalid Email.' });
      }

      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'This imail areldy exists' });
      }
      if (password.length < 6) {
        return res.status(400).json({ msg: 'Passwrod must be at least 8 character' });
      }

      const passwordHash = await bcrybt.hash(password, 12);

      const newUser = {
        username,
        email,
        password: passwordHash,
      };

      const activation_token = createActivationToken(newUser);
      const url = `${CLIENT_URL}/user/activation/${activation_token}`;
      sendMail(email, url, 'verify your email address');
      res
        .status(200)
        .json({ msg: 'Register Success! Please activate your email to start.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);

      const { username, email, password } = user;

      const check = await User.findOne({ email });

      if (check) return res.status(400).json({ msg: 'This email already exists' });

      const newUser = new User({ username, email, password });
      await newUser.save();

      res.status(200).json({ msg: 'Account has been activated!' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'This email dose not exists!' });

      const isMatch = await bcrybt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'This password incorect' });

      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000, //7day
      });

      res.status(200).json({ msg: 'Login success!' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: 'Please login now!' });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: 'Please login now!' });
        const access_token = createAccessToken({ id: user.id });
        res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAuthInfo: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserInfo: async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
      return res.json({ msg: 'Logged out.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  follow: async (req, res) => {
    if (req.body.authId !== req.params.userId) {
      try {
        const user = await User.findById(req.params.userId);
        const authUser = await User.findById(req.body.authId);
        if (!user.followers.includes(req.body.authId)) {
          await user.updateOne({ $push: { followers: req.body.authId } });
          await authUser.updateOne({ $push: { followings: req.params.userId } });
          res.status(200).json('user has been followed');
        } else {
          res.status(400).json('you already follow this user');
        }
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    } else {
      res.status(400).json('you can follow yourself');
    }
  },
  unfollow: async (req, res) => {
    if (req.body.authId !== req.params.userId) {
      try {
        const user = await User.findById(req.params.userId);
        const authUser = await User.findById(req.body.authId);
        if (user.followers.includes(req.body.authId)) {
          await user.updateOne({ $pull: { followers: req.body.authId } });
          await authUser.updateOne({ $pull: { followings: req.params.userId } });
          res.status(200).json('you has been unfollow');
        }
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    } else {
      res.status(400).json('you can unfollow yourself');
    }
  },
  getFriends: async (req, res) => {
    const userId = req.query.userId;
    try {
      const user = await User.findById(userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, avatar } = friend;
        friendList.push({ _id, username, avatar });
      });
      return res.status(200).json(friendList);
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'This email does not exitst' });

      const access_token = createAccessToken({ id: user.id });
      const url = `${CLIENT_URL}/user/resetpassword/${access_token}`;

      sendMail(email, url, 'reset password');
      res.status(200).json({ msg: 'Re-send your password. Please check your email' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const passwordHash = await bcrybt.hash(password, 12);

      const newUser = await User.findByIdAndUpdate(
        { _id: req.user.id },
        { password: passwordHash }
      );
      res.json({ msg: 'Password successfully changed!' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15d' });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = userCtrl;
