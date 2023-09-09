const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name can not exceed"],
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  avtar: {
    public_id: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },

  resatePasswordToken: String,
  resatePasswordExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token Generate
userSchema.methods.getJWTToken = function () {
  try {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: 10000000000,
    });
  } catch (error) {
    console.log(error);
  }
};

// compare password
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log(error);
  }
};

// Resate Password and Generating for new Token for user

userSchema.methods.ResetPasswordToken = function () {
  // generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding ResetToken to usertoken
  this.resatePasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // For timing to expire
  this.resatePasswordExpires = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
