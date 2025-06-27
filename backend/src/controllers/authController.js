import crypto from "crypto";
import { generateToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import {
  AuthError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendPasswordResetEmail } from "../utils/email.js";
import { msConverter } from "../utils/MSconverter.js";
import { throwIf, throwIfInvalid } from "../utils/throwIf.js";

// * Register user
export const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  throwIfInvalid({ FullName: !fullName, Email: !email, Password: !password });

  const existingUser = await User.findOne({ email });

  throwIf(
    existingUser,
    new ConflictError("User with this email already exists!")
  );

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  // Send success response
  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// * Login user
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  throwIf(!user, new ValidationError("Invalid user credentials"));

  const isPasswordValid = await user.isPasswordCorrect(password);
  throwIf(!isPasswordValid, new AuthError("Invalid user credentials"));

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: msConverter(process.env.COOKIE_EXPIRES),
      path: "/",
    })
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
          },
          token,
        },
        "User logged in successfully"
      )
    );
});

// * Get current user profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  throwIf(!user, new NotFoundError("User not found"));
  res.json(user);
});

// * Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    throwIf(emailExists, new ValidationError("Email already exists"));
    user.email = email;
  }

  if (currentPassword && newPassword) {
    const isMatch = await user.isPasswordCorrect(currentPassword);
    throwIf(!isMatch, new ValidationError("Current password is incorrect"));
    user.password = newPassword;
  }

  await user.save();

  res.json({
    message: "Profile updated successfully",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

// * Request password reset - Step 1: Send OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError("User not found", 404);
  }

  // Generate and save OTP
  const otp = user.generateOTP();
  await user.save();

  // Send OTP via email
  await sendPasswordResetEmail(user.email, otp);

  res.json({
    message: "OTP has been sent to your email",
    email: user.email,
  });
};

// * Verify OTP - Step 2: Validate OTP and generate reset token
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError("User not found", 404);
  }

  if (!user.verifyOTP(otp)) {
    throw new APIError("Invalid or expired OTP", 400);
  }

  // Generate reset token after OTP verification
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour

  // Clear OTP after successful verification
  user.clearOTP();
  await user.save();

  res.json({
    message: "OTP verified successfully",
    resetToken,
  });

  try {
    await sendPasswordResetEmail(user.email, resetToken);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw new APIError("Error sending password reset email", 500);
  }
};

// * Reset password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new APIError("Invalid or expired reset token", 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const authToken = generateToken(user._id);

  res.json({
    message: "Password reset successful",
    token: authToken,
  });
};
