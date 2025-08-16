// routes/searchRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { searchUsersAndPosts } = require("../controllers/searchController");

router.get("/", protect, searchUsersAndPosts);

module.exports = router;
