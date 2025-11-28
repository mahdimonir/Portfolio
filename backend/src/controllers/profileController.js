import bcrypt from "bcrypt";
import User from "../models/User.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImage, uploadImage, uploadResume } from "../utils/cloudinary.js";
import { throwIf } from "../utils/throwIf.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  throwIf(!user, new NotFoundError("User not found"));
  res.json(new ApiResponse(200, user));
});

export const getPublicProfile = asyncHandler(async (req, res) => {
  const userId = process.env.USER_ID;

  throwIf(!userId, new NotFoundError("User ID not configured in env"));

  const user = await User.findById(userId)
    .select(
      "-password -email -otp -passwordResetToken -passwordResetExpires -role"
    )
    .lean();

  throwIf(!user, new NotFoundError("User not found"));

  // Manually shape public response
  const publicProfile = {
    fullName: user.fullName,
    tagLines: user.tagLines,
    about: user.about,
    avatar: user.avatar?.url ?? null,
    resume: user.resume?.url ?? null,
    socialLinks: user.socialLinks,
    contact: user.contact,
  };

  res.json(
    new ApiResponse(200, publicProfile, "Public profile fetched successfully")
  );
});

export const updateProfileDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  throwIf(!user, new NotFoundError("User not found"));

  let { fullName, socialLinks, contact, about, tagLines } = req.body;

  try {
    if (typeof socialLinks === "string") socialLinks = JSON.parse(socialLinks);
    if (typeof contact === "string") contact = JSON.parse(contact);
  } catch (err) {
    throw new ValidationError("Invalid JSON format in socialLinks or contact");
  }

  if (fullName) user.fullName = fullName;
  if (socialLinks) user.socialLinks = socialLinks;
  if (contact) user.contact = contact;
  if (about) user.about = about;
  if (tagLines) user.tagLines = tagLines;

  await user.save();

  res.json(new ApiResponse(200, user, "Profile details updated"));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  throwIf(!user, new NotFoundError("User not found"));

  if (!req.files?.avatar) throw new ValidationError("No avatar file uploaded");

  // Delete old avatar from Cloudinary if exists
  if (user.avatar?.public_id) {
    await deleteImage(user.avatar.public_id);
  }

  // Upload new avatar
  const uploaded = await uploadImage(
    req.files.avatar.tempFilePath,
    "portfolio/avatars",
    "image",
    {
      transformation: [
        { width: 200, height: 200, crop: "fill", gravity: "face" },
        { quality: "auto:best" },
        { fetch_format: "auto" },
      ],
    }
  );

  user.avatar = {
    public_id: uploaded.publicId,
    url: uploaded.url,
  };

  await user.save();

  res.json(new ApiResponse(200, user.avatar, "Avatar updated"));
});

export const updateResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  throwIf(!user, new NotFoundError("User not found"));

  if (!req.files?.resume) throw new ValidationError("No resume file uploaded");

  // Delete old resume from Cloudinary if exists
  if (user.resume?.public_id) {
    await deleteImage(user.resume.public_id, "raw");
  }

  // Upload new resume
  const uploaded = await uploadResume(
    req.files.resume.tempFilePath,
    "portfolio/resumes",
    req.files.resume.name
  );

  user.resume = {
    public_id: uploaded.publicId,
    url: uploaded.url,
  };

  await user.save();

  res.json(new ApiResponse(200, user.resume, "Resume updated"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  throwIf(!user, new NotFoundError("User not found"));

  let { fullName, socialLinks, contact, about, tagLines, avatar, resume } =
    req.body;

  // Parse JSON strings if needed (for form-data cases)
  try {
    if (typeof socialLinks === "string") {
      socialLinks = JSON.parse(socialLinks);
    }

    if (typeof contact === "string") {
      contact = JSON.parse(contact);
    }
  } catch (err) {
    throw new ValidationError("Invalid JSON format in socialLinks or contact");
  }

  if (fullName) user.fullName = fullName;
  if (socialLinks) user.socialLinks = socialLinks;
  if (contact) user.contact = contact;
  if (about) user.about = about;
  if (tagLines) user.tagLines = tagLines;

  // Handle avatar upload
  if (req.files && req.files.avatar) {
    // Delete old avatar from Cloudinary if exists
    if (user.avatar?.public_id) {
      await deleteImage(user.avatar.public_id);
    }

    // Upload new avatar
    const uploaded = await uploadImage(
      req.files.avatar.tempFilePath,
      "portfolio/avatars",
      "image",
      {
        transformation: [
          { width: 200, height: 200, crop: "fill", gravity: "face" },
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      }
    );

    user.avatar = {
      public_id: uploaded.publicId,
      url: uploaded.url,
    };
  }

  // Handle resume upload
  if (req.files && req.files.resume) {
    // Delete old resume from Cloudinary if exists
    if (user.resume?.public_id) {
      await deleteImage(user.resume.public_id, "raw");
    }

    // Upload new resume
    const uploaded = await uploadResume(
      req.files.resume.tempFilePath,
      "portfolio/resumes",
      req.files.resume.name
    );

    user.resume = {
      public_id: uploaded.publicId,
      url: uploaded.url,
    };
  }

  await user.save();

  res.json(new ApiResponse(200, user, "Profile updated successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  throwIf(!user, new NotFoundError("User not found"));

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  throwIf(
    !isPasswordValid,
    new ValidationError("Current password is incorrect")
  );

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;

  await user.save();

  res.json(new ApiResponse(200, null, "Password changed successfully"));
});
