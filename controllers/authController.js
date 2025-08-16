// controllers/authController.js
const User = require("../models/UserTemps");
const jwt = require("jsonwebtoken"); // JWT token generate လုပ်ဖို့

// JWT Token generate လုပ်တဲ့ function (utility)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token သက်တမ်း ၁ ရက်
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { username, email, password, profilePicture } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // User ရှိပြီးသားလား စစ်မယ်
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User with that email already exists" });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User with that username already exists" });
    }

    // User အသစ် ဖန်တီးမယ် (password က User model မှာ auto hash ဖြစ်သွားမယ်)
    user = await User.create({
      username,
      email,
      password,
      profilePicture,
    });

    // Response ပြန်မယ်
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        token: generateToken(user._id), // Token ပြန်ပေးမယ်
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // Email နဲ့ user ရှာမယ်
    const user = await User.findOne({ email });

    // User ရှိမရှိ၊ password မှန်မမှန် စစ်မယ်
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" }); // Unauthorized
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
