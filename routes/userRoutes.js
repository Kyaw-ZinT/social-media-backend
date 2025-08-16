const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getUserByUsername,
  getUserPosts,
  followUser,
} = require("../controllers/userController");
const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.get("/:username", protect, getUserByUsername);
router.get("/:username/posts", protect, getUserPosts);
router.put("/:username/follow", protect, followUser);
module.exports = router;
