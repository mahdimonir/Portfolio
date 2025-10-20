import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { msConverter } from "../utils/MSconverter.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is Required"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password id required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      website: String,
      discord: String,
    },
    contact: {
      email: String,
      phone: String,
      location: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    about: String,
    avatar: {
      public_id: String,
      url: String,
    },
    tagLines: {
      type: [String],
      required: true,
      default: ["MERN Stack Developer", "Full Stack JavaScript Developer"],
    },
    resume: {
      public_id: String,
      url: String,
    },
    lastLogin: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    otp: {
      code: String,
      expiresAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: msConverter(process.env.JWT_EXPIRES),
  });
};

userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
  return otp;
};

userSchema.methods.verifyOTP = function (code) {
  return this.otp && this.otp.code === code && Date.now() < this.otp.expiresAt;
};

userSchema.methods.clearOTP = function () {
  this.otp = undefined;
};

const User = mongoose.model("User", userSchema);

export default User;
