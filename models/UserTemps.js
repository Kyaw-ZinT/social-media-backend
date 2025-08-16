// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Password ကို hash လုပ်ဖို့

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Username က ထပ်လို့မရဘူး
      trim: true, // ဘေးက space တွေ ဖြတ်ထုတ်မယ်
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email က ထပ်လို့မရဘူး
      trim: true,
      lowercase: true, // Email ကို အကုန် lowercase ပြောင်းသိမ်းမယ်
      match: [/.+@.+\..+/, "Please fill a valid email address"], // Email format မှန်မမှန် စစ်ဆေးမယ်
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Password အနည်းဆုံး ၆ လုံး
    },
    profilePicture: {
      type: String,
      default: "https://robohash.org/default_avatar.png?size=150x150",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // User Model ကို ကိုးကားတယ်
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); // createdAt နဲ့ updatedAt field တွေ အလိုအလျောက် ထည့်ပေးမယ်

// Password ကို database မသိမ်းခင် hash လုပ်ဖို့ pre-save hook
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // password field ပြောင်းလဲမှသာ hash လုပ်မယ်
    next();
  }
  const salt = await bcrypt.genSalt(10); // salt ကို generate လုပ်မယ် (10 rounds)
  this.password = await bcrypt.hash(this.password, salt); // password ကို hash လုပ်မယ်
  next();
});

// Password မှန်မမှန် စစ်ဆေးဖို့ method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
