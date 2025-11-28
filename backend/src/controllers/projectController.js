import Project from "../models/Project.js";
import Service from "../models/Service.js";
import { TechStack } from "../models/TechStack.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteMultipleImages,
  uploadProjectImages,
} from "../utils/cloudinary.js";
import { revalidate } from "../utils/revalidate.js";
import { throwIf } from "../utils/throwIf.js";

// Build a lookup of individual technology subdocuments by their _id
async function buildTechnologyMap() {
  const stacks = await TechStack.find({}, "category color technologies").lean();
  const map = {};
  for (const stack of stacks) {
    const stackCategory = stack.category;
    const stackColor = stack.color;
    (stack.technologies || []).forEach((tech) => {
      map[tech._id.toString()] = {
        _id: tech._id,
        name: tech.name,
        tagline: tech.tagline,
        color: tech.color ?? stackColor,
        icon: tech.icon,
        uses: tech.uses ?? 0,
        category: stackCategory,
      };
    });
  }
  return map;
}

function mapProjectTech(project, technologyMap) {
  const techIds = Array.isArray(project.tech) ? project.tech : [];
  const techDetails = techIds
    .map((id) => technologyMap[id.toString()])
    .filter(Boolean);
  return { ...project, tech: techDetails };
}

// Utility to update tech uses counts
async function updateTechUsesCounts() {
  const projects = await Project.find({}, "tech");
  const techCountMap = {};
  projects.forEach((project) => {
    (project.tech || []).forEach((techId) => {
      const id = techId.toString();
      techCountMap[id] = (techCountMap[id] || 0) + 1;
    });
  });
  const stacks = await TechStack.find();
  for (const stack of stacks) {
    let updated = false;
    stack.technologies.forEach((tech) => {
      const id = tech._id.toString();
      const newUses = techCountMap[id] || 0;
      if (tech.uses !== newUses) {
        tech.uses = newUses;
        updated = true;
      }
    });
    if (updated) await stack.save();
  }
}

// Utility to update service project counts
async function updateServiceProjectCounts() {
  const projects = await Project.find({ status: "Completed" }, "category");
  const serviceCountMap = {};
  projects.forEach((project) => {
    if (project.category) {
      const id = project.category.toString();
      serviceCountMap[id] = (serviceCountMap[id] || 0) + 1;
    }
  });
  const services = await Service.find();
  for (const service of services) {
    const newCount = serviceCountMap[service._id.toString()] || 0;
    if (service.projectCount !== newCount) {
      service.projectCount = newCount;
      await service.save();
    }
  }
}

// Get all projects (admin use)
export const getAllProjects = asyncHandler(async (req, res) => {
  const [projects, techMap] = await Promise.all([
    Project.find()
      .populate("category", "title category")
      .sort({ createdAt: -1 })
      .lean(),
    buildTechnologyMap(),
  ]);
  const decorated = projects.map((p) => mapProjectTech(p, techMap));
  res.json(
    new ApiResponse(200, decorated, "All projects fetched successfully")
  );
});

// Get Active all/featured projects
export const getProjects = asyncHandler(async (req, res) => {
  const { featured } = req.query;
  const query = { status: "Completed" };
  if (featured === "true") query.featured = true;

  const [projects, techMap] = await Promise.all([
    Project.find(query)
      .populate("category", "title category")
      .sort({ createdAt: -1 })
      .lean(),
    buildTechnologyMap(),
  ]);
  const decorated = projects.map((p) => mapProjectTech(p, techMap));

  const message =
    featured === "true"
      ? "Featured projects fetched successfully"
      : "Active projects fetched successfully";
  res.json(new ApiResponse(200, decorated, message));
});

//  Get project by slug
export const getProjectBySlug = asyncHandler(async (req, res) => {
  const [project, techMap] = await Promise.all([
    Project.findOne({ slug: req.params.slug })
      .populate("category", "title category")
      .lean(),
    buildTechnologyMap(),
  ]);
  throwIf(!project, new NotFoundError("Project not found"));
  const decorated = mapProjectTech(project, techMap);
  res.json(new ApiResponse(200, decorated, "Project fetched successfully"));
});

// Create new project
export const createProject = asyncHandler(async (req, res) => {
  let {
    title,
    description,
    longDescription,
    tech,
    features,
    github,
    demo,
    category,
    status,
    duration,
    role,
    client,
    featured,
    completed,
    startDate,
    endDate,
  } = req.body;

  if (typeof tech === "string") tech = JSON.parse(tech);
  if (!Array.isArray(tech)) tech = [tech];
  if (typeof features === "string") features = JSON.parse(features);
  if (!Array.isArray(features)) features = [];
  if (typeof client === "string") client = JSON.parse(client);

  if (client.type === "Personal") {
    client.name = undefined;
    client.details = {};
  } else if (client.type === "Open Source") {
    if (!client.name || !client.details?.website) {
      throw new ValidationError(
        "Open Source projects require a name and website."
      );
    }
  } else if (
    (client.type === "Company" || client.type === "Freelance") &&
    !client.name
  ) {
    throw new ValidationError(
      "Client name is required for Company or Freelance projects."
    );
  }

  let images = [];
  let image = null;
  if (req.files && req.files.images) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];
    const uploaded = await uploadProjectImages(files);
    images = uploaded.map((img) => ({
      url: img.url,
      public_id: img.publicId,
    }));
    image = images[0]?.url;
  }

  throwIf(
    images.length === 0,
    new ValidationError("At least one project image is required")
  );
  throwIf(
    !tech || !Array.isArray(tech) || tech.length === 0,
    new ValidationError("At least one tech stack reference is required")
  );

  const project = new Project({
    title,
    description,
    longDescription,
    image,
    images,
    tech,
    features,
    github,
    demo,
    category,
    status,
    duration,
    role,
    client,
    featured,
    completed,
    startDate,
    endDate,
  });

  await project.save();
  await updateTechUsesCounts();
  await updateServiceProjectCounts();
  await project.populate("category", "title category");
  const techMap = await buildTechnologyMap();
  const decorated = mapProjectTech(project.toObject(), techMap);
  res
    .status(201)
    .json(ApiResponse.created(decorated, "Project created successfully"));

  // Revalidate cache
  await revalidate("projects");
  await revalidate("homepage");
});

// Update Project
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  throwIf(!project, new NotFoundError("Project not found"));
  const updates = { ...req.body };
  if (updates.tech && typeof updates.tech === "string")
    updates.tech = JSON.parse(updates.tech);
  if (updates.tech && !Array.isArray(updates.tech))
    updates.tech = [updates.tech];
  if (updates.features && typeof updates.features === "string")
    updates.features = JSON.parse(updates.features);
  if (updates.features && !Array.isArray(updates.features))
    updates.features = [];
  if (updates.client && typeof updates.client === "string")
    updates.client = JSON.parse(updates.client);
  if (updates.client) {
    if (updates.client.type === "Personal") {
      updates.client.name = undefined;
      updates.client.details = {};
    } else if (updates.client.type === "Open Source") {
      if (!updates.client.name || !updates.client.details?.website) {
        throw new ValidationError(
          "Open Source projects require a name and website."
        );
      }
    } else if (
      (updates.client.type === "Company" ||
        updates.client.type === "Freelance") &&
      !updates.client.name
    ) {
      throw new ValidationError(
        "Client name is required for Company or Freelance projects."
      );
    }
  }
  let newImages = project.images || [];
  if (req.files && req.files.images) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];
    const uploaded = await uploadProjectImages(files);
    const uploadedImages = uploaded.map((img) => ({
      url: img.url,
      public_id: img.publicId,
    }));
    newImages = [...newImages, ...uploadedImages];
    updates.image = uploadedImages[0]?.url || project.image;
  }
  updates.images = newImages;
  Object.assign(project, updates);
  await project.save();
  await updateTechUsesCounts();
  await updateServiceProjectCounts();
  await project.populate("category", "title category");
  const techMapUpd = await buildTechnologyMap();
  const decoratedUpd = mapProjectTech(project.toObject(), techMapUpd);
  res.json(new ApiResponse(200, decoratedUpd, "Project updated successfully"));

  // Revalidate cache
  await revalidate("projects");
  await revalidate("homepage");
});

// Delete Project
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  throwIf(!project, new NotFoundError("Project not found"));
  if (project.images && project.images.length > 0) {
    const publicIds = project.images
      .map((img) => img.public_id)
      .filter(Boolean);
    if (publicIds.length > 0) {
      await deleteMultipleImages(publicIds);
    }
  }
  await project.deleteOne();
  await updateTechUsesCounts();
  await updateServiceProjectCounts();
  res.json(new ApiResponse(200, null, "Project deleted successfully"));

  // Revalidate cache
  await revalidate("projects");
  await revalidate("homepage");
});
