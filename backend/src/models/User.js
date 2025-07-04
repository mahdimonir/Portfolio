import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { BadRequestError } from "../utils/ApiError.js";
import { throwIf } from "../utils/throwIf.js";

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
    socialLinks: [
      {
        github: String,
        linkedin: String,
        twitter: String,
        website: String,
        discord: String,
      },
    ],
    skills: [
      {
        name: String,
        level: {
          type: Number,
          min: 0,
          max: 100,
        },
        category: String,
      },
    ],
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
    tagLine: String,
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

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    // Skip hashing if the password is not modified
    if (!this.isModified("password")) return next();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new BadRequestError(`Failed to hash password: ${error.message}`));
  }
});

// Method to compare password for login
userSchema.methods.isPasswordCorrect = async function (password) {
  throwIf(
    !password,
    new BadRequestError("Provided password is missing or empty")
  );

  throwIf(
    !this.password,
    new BadRequestError("Stored password hash is missing")
  );

  return await bcrypt.compare(password, this.password);
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
  };
  return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function (code) {
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    return false;
  }

  if (Date.now() > this.otp.expiresAt) {
    return false;
  }

  return this.otp.code === code;
};

// Clear OTP after use
userSchema.methods.clearOTP = function () {
  this.otp = undefined;
};

const User = mongoose.model("User", userSchema);

export default User;
