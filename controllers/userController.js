const User = require("../models/UserTemps");
const Post = require("../models/Post");
const userService = require("../services/userService");
const postService = require("../services/postService");
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      followers: user.followers,
      followings: user.followings,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password; // User model ရဲ့ pre-save hook က password ကို hash လုပ်ပေးမယ်
    }
    if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      token: generateToken(updatedUser._id), // Token ကို အသစ် generate လုပ်ပြီး ပြန်ပေးနိုင်တယ်
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Get user profile by username
// @route   GET /api/users/:username
// @access  Private
exports.getUserByUsername = async (req, res) => {
  try {
    const user = await userService.getUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error in getUserByUsername controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// exports.getUserPosts = async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const posts = await Post.find({ user: user._id })
//       .populate("user", "username profilePicture")
//       .populate({
//         path: "comments",
//         populate: {
//           path: "user",
//           select: "username profilePicture",
//         },
//       })
//       .sort({ createdAt: -1 });

//     res.json(posts);
//   } catch (error) {
//     console.error("Error fetching user posts:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// @desc    Follow or Unfollow a user
// @route   PUT /api/users/:username/follow
// @access  Private

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await postService.getUserPosts(req.params.username);
    if (posts === null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await userService.toggleFollow({ username: req.params.username });
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // ကိုယ့်ကိုယ်ကို follow လုပ်လို့မရအောင် စစ်မယ်
    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const isFollowing = currentUser.followings.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow လုပ်မယ်
      currentUser.followings.pull(userToFollow._id);
      userToFollow.followers.pull(currentUser._id);
    } else {
      // Follow လုပ်မယ်
      currentUser.followings.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: isFollowing ? "Unfollowed successfully" : "Followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
