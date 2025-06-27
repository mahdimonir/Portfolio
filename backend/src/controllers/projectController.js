import Project from '../models/Project.js';
import { APIError } from '../middleware/error.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

/**
 * Get all projects
 */
export const getProjects = async (req, res) => {
  const { category, featured, limit = 10, page = 1 } = req.query;
  
  const query = {};
  if (category) query.category = category;
  if (featured) query.featured = featured === 'true';

  const projects = await Project.find(query)
    .sort({ startDate: -1 })
    .limit(parseInt(limit))
    .skip((page - 1) * limit);

  const total = await Project.countDocuments(query);

  res.json({
    projects,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    total
  });
};

/**
 * Get project by slug
 */
export const getProjectBySlug = async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) {
    throw new APIError('Project not found', 404);
  }
  res.json(project);
};

/**
 * Create new project
 */
export const createProject = async (req, res) => {
  const {
    title,
    description,
    shortDescription,
    technologies,
    category,
    links,
    featured,
    startDate,
    endDate,
    highlights
  } = req.body;

  // Handle main image upload
  if (!req.body.image) {
    throw new APIError('Project image is required', 400);
  }

  const imageUpload = await uploadImage(req.body.image, 'portfolio/projects');

  // Handle gallery images if provided
  const gallery = [];
  if (req.body.gallery && Array.isArray(req.body.gallery)) {
    for (const image of req.body.gallery) {
      const uploadResult = await uploadImage(image, 'portfolio/projects/gallery');
      gallery.push(uploadResult.url);
    }
  }

  const project = new Project({
    title,
    description,
    shortDescription,
    image: imageUpload.url,
    gallery,
    technologies,
    category,
    links,
    featured,
    startDate,
    endDate,
    highlights
  });

  await project.save();
  res.status(201).json(project);
};

/**
 * Update project
 */
export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new APIError('Project not found', 404);
  }

  const updates = { ...req.body };

  // Handle main image update
  if (req.body.image && req.body.image !== project.image) {
    const imageUpload = await uploadImage(req.body.image, 'portfolio/projects');
    updates.image = imageUpload.url;
  }

  // Handle gallery updates
  if (req.body.gallery && Array.isArray(req.body.gallery)) {
    const newGallery = [];
    for (const image of req.body.gallery) {
      if (image.startsWith('data:image')) {
        const uploadResult = await uploadImage(image, 'portfolio/projects/gallery');
        newGallery.push(uploadResult.url);
      } else {
        newGallery.push(image);
      }
    }
    updates.gallery = newGallery;
  }

  Object.assign(project, updates);
  await project.save();

  res.json(project);
};

/**
 * Delete project
 */
export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new APIError('Project not found', 404);
  }

  // Extract public IDs from image URLs and delete from Cloudinary
  const imagePublicId = project.image.split('/').slice(-2).join('/');
  await deleteImage(imagePublicId);

  for (const galleryImage of project.gallery) {
    const publicId = galleryImage.split('/').slice(-2).join('/');
    await deleteImage(publicId);
  }

  await project.remove();
  res.json({ message: 'Project deleted successfully' });
};

/**
 * Update project status
 */
export const updateProjectStatus = async (req, res) => {
  const { featured, completed } = req.body;
  
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new APIError('Project not found', 404);
  }

  if (typeof featured === 'boolean') project.featured = featured;
  if (typeof completed === 'boolean') project.completed = completed;

  await project.save();
  res.json(project);
};