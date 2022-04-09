const Post = require('../models/Post');
const User = require('../models/User');

const postCtrl = {
  create: async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const post = await newPost.save();
      return res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getAllPost: async (req, res) => {
    try {
      const allPost = await Post.find();
      res.status(200).json(allPost);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserPost: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.userId });
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  handleLikePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const authId = req.body.authId;
      if (!post.likes.includes(authId)) {
        await post.updateOne({ $push: { likes: authId } });
        return res.status(200).json({ msg: 'The post has been liked' });
      } else {
        await post.updateOne({ $pull: { authId } });
        return res.status(200).json({ msg: 'the post has been unliked' });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deletePost: async (req, res) => {
    try {
      const userId = req.user.id;
      const post = await Post.findById(req.params.postId);
      if (userId === post.userId) {
        await Post.deleteOne({ _id: req.params.postId });
        res.status(200).json('The post has been deleted');
      } else {
        res.status(400).json('You can delete your post');
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = postCtrl;
