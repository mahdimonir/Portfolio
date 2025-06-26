import Profile from '../models/Profile.js';
import { APIError } from '../middleware/error.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

/**
 * Get profile information
 */
export const getProfile = async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) {
    throw new APIError('Profile not found', 404);
  }
  res.json(profile);
};

/**
 * Create or update profile
 */
export const updateProfile = async (req, res) => {
  const { name, tagline, about, socialLinks, contact, skills } = req.body;
  let avatarUrl;

  // Handle avatar upload if provided
  if (req.body.avatar && req.body.avatar.startsWith('data:image')) {
    const uploadResult = await uploadImage(req.body.avatar, 'portfolio/avatar');
    avatarUrl = uploadResult.url;
  }

  // Find existing profile or create new one
  let profile = await Profile.findOne();

  if (profile) {
    // Update existing profile
    profile.name = name || profile.name;
    profile.tagline = tagline || profile.tagline;
    profile.about = about || profile.about;
    if (avatarUrl) profile.avatar = avatarUrl;
    if (socialLinks) profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
    if (contact) profile.contact = { ...profile.contact, ...contact };
    if (skills) profile.skills = skills;
  } else {
    // Create new profile
    profile = new Profile({
      name,
      tagline,
      about,
      avatar: avatarUrl,
      socialLinks,
      contact,
      skills
    });
  }

  await profile.save();
  res.json(profile);
};

/**
 * Update resume
 */
export const updateResume = async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) {
    throw new APIError('Profile not found', 404);
  }

  if (!req.body.resume) {
    throw new APIError('Resume file is required', 400);
  }

  // Upload resume to Cloudinary
  const uploadResult = await uploadImage(req.body.resume, 'portfolio/resume');
  profile.resume = uploadResult.url;

  await profile.save();
  res.json({
    message: 'Resume updated successfully',
    resumeUrl: profile.resume
  });
};

/**
 * Update skills
 */
export const updateSkills = async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) {
    throw new APIError('Profile not found', 404);
  }

  const { skills } = req.body;
  if (!Array.isArray(skills)) {
    throw new APIError('Skills must be an array', 400);
  }

  profile.skills = skills;
  await profile.save();

  res.json({
    message: 'Skills updated successfully',
    skills: profile.skills
  });
};

/**
 * Update social links
 */
export const updateSocialLinks = async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) {
    throw new APIError('Profile not found', 404);
  }

  const { socialLinks } = req.body;
  profile.socialLinks = { ...profile.socialLinks, ...socialLinks };

  await profile.save();
  res.json({
    message: 'Social links updated successfully',
    socialLinks: profile.socialLinks
  });
};