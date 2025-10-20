import crypto from "crypto";
import { generateTokenAndSetCookie } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  send2FAVerificationCode,
  sendPasswordResetEmail,
} from "../utils/sendMail.js";
import { throwIf, throwIfInvalid } from "../utils/throwIf.js";

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  throwIfInvalid({ FullName: !fullName, Email: !email, Password: !password });

  const existingUser = await User.findOne({ email });
  throwIf(existingUser, new ConflictError("User already exists!"));

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const response = generateTokenAndSetCookie(
    res,
    user,
    201,
    "User register successfully"
  );
  res.json(response);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, code } = req.body;

  const user = await User.findOne({ email });
  throwIf(!user, new ValidationError("Invalid credentials"));

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ValidationError("Invalid credentials");
  }

  if (!user.otp || !user.otp.code || !user.otp.expiresAt || !code) {
    const otp = user.generateOTP();
    await user.save();
    await send2FAVerificationCode(user.email, otp, user.fullName);
    return res.json(
      new ApiResponse(
        200,
        { message: "2FA code sent to email" },
        "2FA required"
      )
    );
  }

  if (!user.verifyOTP(code)) {
    throw new ValidationError("Invalid or expired 2FA code");
  }
  user.clearOTP();
  user.lastLogin = new Date();
  await user.save();

  const response = generateTokenAndSetCookie(
    res,
    user,
    200,
    "User logged in successfully"
  );
  res.json(response);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json(new ApiResponse(200, null, "Logout successful"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  throwIf(!user, new NotFoundError("User not found"));

  const otp = user.generateOTP();
  await user.save();

  await sendPasswordResetEmail(user.email, otp, user.fullName);
  res.json(new ApiResponse(200, { email: user.email }, "OTP sent to email"));
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  throwIf(!user, new NotFoundError("User not found"));
  throwIf(!user.verifyOTP(otp), new ValidationError("Invalid or expired OTP"));

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 3600000;
  user.clearOTP();
  await user.save();

  res.json(new ApiResponse(200, { resetToken }, "OTP verified successfully"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  throwIf(!user, new ValidationError("Invalid or expired reset token"));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const response = generateTokenAndSetCookie(
    res,
    user,
    200,
    "Password reset successful"
  );
  res.json(response);
});
