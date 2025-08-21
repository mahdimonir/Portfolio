import Testimonial from "../models/Testimonial.js";
import { NotFoundError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import { throwIf } from "../utils/throwIf.js";

// Get active testimonials only
export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ status: "Active" }).sort({
    createdAt: -1,
  });
  res.json(
    new ApiResponse(
      200,
      testimonials,
      "Active testimonials fetched successfully"
    )
  );
});

// Get all testimonials (admin use)
export const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json(
    new ApiResponse(200, testimonials, "All testimonials fetched successfully")
  );
});

//  Create new testimonial
export const createTestimonial = asyncHandler(async (req, res) => {
  const {
    name,
    role,
    company,
    quote,
    rating,
    status,
    companyLogo,
    companyUrl,
  } = req.body;

  const testimonialData = {
    name: name || "",
    role: role || "",
    company: company || "",
    quote: quote || "",
    rating: rating || 5,
    status: status || "Active",
    companyLogo: companyLogo || null,
    companyUrl: companyUrl || null,
  };

  // Handle image upload
  if (req.files && req.files.image) {
    const uploaded = await uploadImage(
      req.files.image.tempFilePath,
      "portfolio/testimonials",
      "image",
      {
        transformation: [
          { width: 200, height: 200, crop: "fill", gravity: "face" },
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      }
    );
    testimonialData.image = {
      url: uploaded.url,
      public_id: uploaded.publicId,
    };
  }

  const testimonial = new Testimonial(testimonialData);
  await testimonial.save();

  res
    .status(201)
    .json(ApiResponse.created(testimonial, "Testimonial created successfully"));
});

// Update testimonial
export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  throwIf(!testimonial, new NotFoundError("Testimonial not found"));

  const updates = { ...req.body };

  // Handle image update
  if (req.files && req.files.image) {
    // Delete old image from Cloudinary if exists
    if (testimonial.image?.public_id) {
      await deleteImage(testimonial.image.public_id);
    }

    // Upload new image
    const uploaded = await uploadImage(
      req.files.image.tempFilePath,
      "portfolio/testimonials",
      "image",
      {
        transformation: [
          { width: 200, height: 200, crop: "fill", gravity: "face" },
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      }
    );
    updates.image = {
      url: uploaded.url,
      public_id: uploaded.publicId,
    };
  }

  // Update testimonial
  Object.assign(testimonial, updates);
  await testimonial.save();

  res.json(
    new ApiResponse(200, testimonial, "Testimonial updated successfully")
  );
});

// Delete testimonial
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  throwIf(!testimonial, new NotFoundError("Testimonial not found"));

  // Delete image from Cloudinary if exists
  if (testimonial.image?.public_id) {
    await deleteImage(testimonial.image.public_id);
  }

  await testimonial.deleteOne();

  res.json(new ApiResponse(200, null, "Testimonial deleted successfully"));
});
