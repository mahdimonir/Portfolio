import Testimonial from '../models/Testimonial.js';
import { APIError } from '../middleware/error.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

/**
 * Get all testimonials
 */
export const getTestimonials = async (req, res) => {
  const { featured, limit } = req.query;
  
  const query = {};
  if (featured) query.featured = featured === 'true';

  const testimonials = await Testimonial.find(query)
    .sort({ order: 1, createdAt: -1 })
    .limit(parseInt(limit) || undefined);

  res.json(testimonials);
};

/**
 * Create new testimonial
 */
export const createTestimonial = async (req, res) => {
  const {
    name,
    position,
    company,
    content,
    rating,
    companyUrl,
    featured,
    order
  } = req.body;

  // Handle avatar upload if provided
  let avatarUrl;
  if (req.body.avatar) {
    const uploadResult = await uploadImage(req.body.avatar, 'portfolio/testimonials/avatars');
    avatarUrl = uploadResult.url;
  }

  // Handle company logo upload if provided
  let companyLogoUrl;
  if (req.body.companyLogo) {
    const uploadResult = await uploadImage(req.body.companyLogo, 'portfolio/testimonials/logos');
    companyLogoUrl = uploadResult.url;
  }

  const testimonial = new Testimonial({
    name,
    position,
    company,
    avatar: avatarUrl,
    content,
    rating,
    companyLogo: companyLogoUrl,
    companyUrl,
    featured,
    order: order || (await Testimonial.countDocuments()) + 1
  });

  await testimonial.save();
  res.status(201).json(testimonial);
};

/**
 * Update testimonial
 */
export const updateTestimonial = async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    throw new APIError('Testimonial not found', 404);
  }

  const updates = { ...req.body };

  // Handle avatar update
  if (req.body.avatar && req.body.avatar !== testimonial.avatar) {
    const uploadResult = await uploadImage(req.body.avatar, 'portfolio/testimonials/avatars');
    updates.avatar = uploadResult.url;

    // Delete old avatar if exists
    if (testimonial.avatar) {
      const oldAvatarId = testimonial.avatar.split('/').slice(-2).join('/');
      await deleteImage(oldAvatarId);
    }
  }

  // Handle company logo update
  if (req.body.companyLogo && req.body.companyLogo !== testimonial.companyLogo) {
    const uploadResult = await uploadImage(req.body.companyLogo, 'portfolio/testimonials/logos');
    updates.companyLogo = uploadResult.url;

    // Delete old company logo if exists
    if (testimonial.companyLogo) {
      const oldLogoId = testimonial.companyLogo.split('/').slice(-2).join('/');
      await deleteImage(oldLogoId);
    }
  }

  Object.assign(testimonial, updates);
  await testimonial.save();

  res.json(testimonial);
};

/**
 * Delete testimonial
 */
export const deleteTestimonial = async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    throw new APIError('Testimonial not found', 404);
  }

  // Delete avatar from Cloudinary if exists
  if (testimonial.avatar) {
    const avatarId = testimonial.avatar.split('/').slice(-2).join('/');
    await deleteImage(avatarId);
  }

  // Delete company logo from Cloudinary if exists
  if (testimonial.companyLogo) {
    const logoId = testimonial.companyLogo.split('/').slice(-2).join('/');
    await deleteImage(logoId);
  }

  await testimonial.remove();
  res.json({ message: 'Testimonial deleted successfully' });
};

/**
 * Update testimonial order
 */
export const updateOrder = async (req, res) => {
  const { orders } = req.body;

  if (!Array.isArray(orders)) {
    throw new APIError('Orders must be an array of { id, order } objects', 400);
  }

  // Update orders in parallel
  await Promise.all(
    orders.map(({ id, order }) =>
      Testimonial.findByIdAndUpdate(id, { order }, { new: true })
    )
  );

  const updatedTestimonials = await Testimonial.find()
    .sort({ order: 1, createdAt: -1 });

  res.json(updatedTestimonials);
};