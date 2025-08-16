const User = require("../models/UserTemps");
const Post = require("../models/Post");

// @desc    Search users and posts
// @route   GET /api/search?q=<query>
// @access  Private
exports.searchUsersAndPosts = async (req, res) => {
  try {
    const query = req.query.q; // Search query ကို ယူမယ်
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Case-insensitive search အတွက် RegExp ကို သုံးမယ်
    const regex = new RegExp(query, "i");

    // Users တွေကို username နဲ့ရှာမယ်
    const users = await User.find({ username: { $regex: regex } }).select("username profilePicture");

    // Posts တွေကို text နဲ့ရှာမယ်
    const posts = await Post.find({ text: { $regex: regex } })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });

    res.json({ users, posts });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
