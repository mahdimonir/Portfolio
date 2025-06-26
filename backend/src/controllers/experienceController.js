import Experience from '../models/Experience.js';
import { APIError } from '../middleware/error.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

/**
 * Get all experiences
 */
export const getExperiences = async (req, res) => {
  const experiences = await Experience.find()
    .sort({ startDate: -1 });
  res.json(experiences);
};

/**
 * Create new experience
 */
export const createExperience = async (req, res) => {
  const {
    company,
    position,
    location,
    type,
    startDate,
    endDate,
    current,
    description,
    technologies,
    highlights,
    companyUrl
  } = req.body;

  // Handle company logo upload if provided
  let companyLogoUrl;
  if (req.body.companyLogo) {
    const uploadResult = await uploadImage(req.body.companyLogo, 'portfolio/experience');
    companyLogoUrl = uploadResult.url;
  }

  const experience = new Experience({
    company,
    position,
    location,
    type,
    startDate,
    endDate,
    current,
    description,
    technologies,
    highlights,
    companyLogo: companyLogoUrl,
    companyUrl
  });

  await experience.save();
  res.status(201).json(experience);
};

/**
 * Update experience
 */
export const updateExperience = async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) {
    throw new APIError('Experience not found', 404);
  }

  const updates = { ...req.body };

  // Handle company logo update
  if (req.body.companyLogo && req.body.companyLogo !== experience.companyLogo) {
    const uploadResult = await uploadImage(req.body.companyLogo, 'portfolio/experience');
    updates.companyLogo = uploadResult.url;

    // Delete old logo if exists
    if (experience.companyLogo) {
      const oldLogoId = experience.companyLogo.split('/').slice(-2).join('/');
      await deleteImage(oldLogoId);
    }
  }

  Object.assign(experience, updates);
  await experience.save();

  res.json(experience);
};

/**
 * Delete experience
 */
export const deleteExperience = async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) {
    throw new APIError('Experience not found', 404);
  }

  // Delete company logo from Cloudinary if exists
  if (experience.companyLogo) {
    const logoId = experience.companyLogo.split('/').slice(-2).join('/');
    await deleteImage(logoId);
  }

  await experience.remove();
  res.json({ message: 'Experience deleted successfully' });
};

/**
 * Update experience order
 */
export const updateOrder = async (req, res) => {
  const { orders } = req.body;

  if (!Array.isArray(orders)) {
    throw new APIError('Orders must be an array of { id, order } objects', 400);
  }

  // Update orders in parallel
  await Promise.all(
    orders.map(({ id, order }) =>
      Experience.findByIdAndUpdate(id, { order }, { new: true })
    )
  );

  const updatedExperiences = await Experience.find()
    .sort({ order: 1, startDate: -1 });

  res.json(updatedExperiences);
};