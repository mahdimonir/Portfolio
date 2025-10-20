import Experience from "../models/Experience.js";
import { NotFoundError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { throwIf } from "../utils/throwIf.js";

/**
 * Get active experiences only
 */
export const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({ status: "Active" })
    .populate("skills", "name category")
    .sort({ "period.from": -1 });

  res.json(
    new ApiResponse(200, experiences, "Active experiences fetched successfully")
  );
});

/**
 * Get all experiences (admin use)
 */
export const getAllExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find()
    .populate("skills", "name category")
    .sort({ "period.from": -1 });

  res.json(
    new ApiResponse(200, experiences, "All experiences fetched successfully")
  );
});

/**
 * Create new experience
 */
export const createExperience = asyncHandler(async (req, res) => {
  const {
    role,
    company,
    period,
    location,
    description,
    skills,
    achievements,
    status,
    current,
    companyLogo,
    companyUrl,
  } = req.body;

  // Handle period object
  let periodData = { from: "", to: "Present" };
  if (period) {
    if (typeof period === "string") {
      periodData = JSON.parse(period);
    } else if (typeof period === "object") {
      periodData = period;
    }
  }

  // Set 'to' field to "Present" if current is true
  if (current) {
    periodData.to = "Present";
  }

  const experienceData = {
    role: role || "",
    company: company || "",
    period: periodData,
    location: location || "",
    description: description || "",
    skills: [],
    achievements: [],
    status: status || "Active",
    current: current || false,
    companyLogo: companyLogo || null,
    companyUrl: companyUrl || null,
  };

  // Handle skills as array of TechStack ObjectIds
  if (skills) {
    if (typeof skills === "string") {
      experienceData.skills = JSON.parse(skills);
    } else if (Array.isArray(skills)) {
      experienceData.skills = skills;
    }
  }

  // Handle achievements as array
  if (achievements) {
    if (typeof achievements === "string") {
      experienceData.achievements = JSON.parse(achievements);
    } else if (Array.isArray(achievements)) {
      experienceData.achievements = achievements;
    }
  }

  const experience = new Experience(experienceData);
  await experience.save();

  // Populate skills before sending response
  await experience.populate("skills", "name category");

  res
    .status(201)
    .json(ApiResponse.created(experience, "Experience created successfully"));
});

/**
 * Update experience
 */
export const updateExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  throwIf(!experience, new NotFoundError("Experience not found"));

  const updates = { ...req.body };

  // Handle period object
  if (updates.period) {
    if (typeof updates.period === "string") {
      updates.period = JSON.parse(updates.period);
    }
  }

  // Set 'to' field to "Present" if current is true
  if (updates.current) {
    if (updates.period) {
      updates.period.to = "Present";
    } else {
      updates.period = { ...experience.period, to: "Present" };
    }
  }

  // Handle skills as array of TechStack ObjectIds
  if (updates.skills) {
    if (typeof updates.skills === "string") {
      updates.skills = JSON.parse(updates.skills);
    } else if (!Array.isArray(updates.skills)) {
      updates.skills = [];
    }
  }

  // Handle achievements as array
  if (updates.achievements) {
    if (typeof updates.achievements === "string") {
      updates.achievements = JSON.parse(updates.achievements);
    } else if (!Array.isArray(updates.achievements)) {
      updates.achievements = [];
    }
  }

  // Update experience
  Object.assign(experience, updates);
  await experience.save();

  // Populate skills before sending response
  await experience.populate("skills", "name category");

  res.json(new ApiResponse(200, experience, "Experience updated successfully"));
});

/**
 * Delete experience
 */
export const deleteExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  throwIf(!experience, new NotFoundError("Experience not found"));

  await experience.deleteOne();

  res.json(new ApiResponse(200, null, "Experience deleted successfully"));
});
