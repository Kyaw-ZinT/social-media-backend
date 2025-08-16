// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} = require("../controllers/postController");

// Posts routes
router
  .route("/")
  .post(protect, createPost) // Post တင်ခြင်း (Private)
  .get(protect, getAllPosts); // Post အားလုံး ကြည့်ခြင်း (Private)

router
  .route("/:id")
  .get(protect, getPostById) // Post တစ်ခုတည်း ကြည့်ခြင်း (Private)
  .delete(protect, deletePost); // Post ဖျက်ခြင်း (Private)

router.put("/:id/like", protect, likePost); // Post ကို Like/Unlike လုပ်ခြင်း (Private)

// Comments routes
router
  .route("/:id/comments") // :id က post ID
  .post(protect, addComment); // Comment ထည့်ခြင်း (Private)

router.delete("/:post_id/comments/:comment_id", protect, deleteComment); // Comment ဖျက်ခြင်း (Private)

module.exports = router;
