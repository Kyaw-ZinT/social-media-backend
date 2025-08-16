// services/userService.js

const User = require("../models/UserTemps");

// User ကို username နဲ့ ရှာမယ့် Service
exports.getUserByUsername = async (username) => {
  try {
    return await User.findOne({ username }).select("-password");
  } catch (error) {
    // --- ဒီနေရာမှာ error အပြည့်အစုံကို log ထုတ်ပါ ---
    console.error("Error in userService.getUserByUsername:", error);
    // --- ----------------------------------------- ---
    throw error; // error ကို controller ဆီ ပြန်ပို့ပါ
  }
};

// User's profile ကို update လုပ်မယ့် Service
exports.updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }
  // Logic for updating user fields
  user.username = updateData.username || user.username;
  user.email = updateData.email || user.email;
  if (updateData.password) {
    user.password = updateData.password;
  }
  return await user.save();
};

// User ကို follow/unfollow လုပ်မယ့် Service
exports.toggleFollow = async (currentUserId, usernameToToggle) => {
  const userToFollow = await User.findOne({ username: usernameToToggle });
  const currentUser = await User.findById(currentUserId);

  if (!userToFollow) {
    return { success: false, message: "User to follow not found" };
  }
  if (userToFollow._id.toString() === currentUser._id.toString()) {
    return { success: false, message: "You cannot follow yourself" };
  }

  const isFollowing = currentUser.followings.includes(userToFollow._id);

  if (isFollowing) {
    currentUser.followings.pull(userToFollow._id);
    userToFollow.followers.pull(currentUser._id);
  } else {
    currentUser.followings.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);
  }

  await currentUser.save();
  await userToFollow.save();

  return { success: true, message: isFollowing ? "Unfollowed successfully" : "Followed successfully" };
};
