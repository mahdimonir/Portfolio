import Service from "../models/Service.js";
import { NotFoundError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { revalidate } from "../utils/revalidate.js";
import { throwIf } from "../utils/throwIf.js";

/**
 * Get active services only
 */
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ status: "Active" }).sort({
    createdAt: -1,
  });
  res.json(
    new ApiResponse(200, services, "Active services fetched successfully")
  );
});

/**
 * Get all services (admin use)
 */
export const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json(new ApiResponse(200, services, "All services fetched successfully"));
});

/**
 * Get service by slug
 */
export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug });
  throwIf(!service, new NotFoundError("Service not found"));
  res.json(new ApiResponse(200, service, "Service fetched successfully"));
});

/**
 * Create new service
 */
export const createService = asyncHandler(async (req, res) => {
  let { title, description, category, pricing, features, status } = req.body;
  if (typeof features === "string") features = JSON.parse(features);
  if (!Array.isArray(features)) features = [];
  const service = new Service({
    title,
    description,
    category,
    pricing,
    features,
    status: status || "Active",
  });
  await service.save();
  res
    .status(201)
    .json(ApiResponse.created(service, "Service created successfully"));

  await revalidate("services");
  await revalidate("homepage");
});

/**
 * Update service
 */
export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  throwIf(!service, new NotFoundError("Service not found"));
  const updates = { ...req.body };
  if (updates.features && typeof updates.features === "string")
    updates.features = JSON.parse(updates.features);
  if (updates.features && !Array.isArray(updates.features))
    updates.features = [];
  Object.assign(service, updates);
  await service.save();
  res.json(new ApiResponse(200, service, "Service updated successfully"));

  await revalidate("services");
  await revalidate("homepage");
});

/**
 * Delete service
 */
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  throwIf(!service, new NotFoundError("Service not found"));
  await service.deleteOne();
  res.json(new ApiResponse(200, null, "Service deleted successfully"));

  await revalidate("services");
  await revalidate("homepage");
});
