const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/UserTemps");

// Post အားလုံးကို ပြန်ယူမယ့် Service
exports.getAllPosts = async () => {
  return await Post.find()
    .populate("user", "username profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username profilePicture",
      },
    })
    .sort({ createdAt: -1 });
};

// User တစ်ယောက်ရဲ့ Posts တွေကို ပြန်ယူမယ့် Service
exports.getUserPosts = async (username) => {
  const user = await User.findOne({ username });
  if (!user) {
    return null;
  }
  return await Post.find({ user: user._id })
    .populate("user", "username profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username profilePicture",
      },
    })
    .sort({ createdAt: -1 });
};

// Post တစ်ခုကို Like/Unlike လုပ်မယ့် Service
exports.toggleLike = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    return { success: false, message: "Post not found" };
  }
  const isLiked = post.likes.includes(userId);
  if (isLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }
  await post.save();
  return { success: true, post };
};

// Post တစ်ခုကို Comment ထည့်မယ့် Service
exports.addComment = async (postId, userId, text) => {
  const post = await Post.findById(postId);
  if (!post) {
    return null;
  }
  const newComment = await Comment.create({
    post: postId,
    user: userId,
    text,
  });
  post.comments.push(newComment._id);
  await post.save();

  // Comment ကို user data နဲ့ ပြန်ပေးဖို့ populate လုပ်မယ်
  return await Comment.findById(newComment._id).populate("user", "username profilePicture");
};
