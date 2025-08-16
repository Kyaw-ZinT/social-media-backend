require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const searchRoutes = require("./routes/searchRoutes");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);
app.get("/", (req, res) => {
  res.send("Social Media Clone Backend API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
