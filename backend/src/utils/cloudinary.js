import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} fileString - Base64 string or file path
 * @param {string} folder - Folder path in Cloudinary
 * @param {string} resourceType - Resource type (image, video, raw)
 * @param {object} options - Additional upload options
 * @returns {object} Upload response with url and publicId
 */
export const uploadImage = async (
  fileString,
  folder = "portfolio",
  resourceType = "image",
  options = {}
) => {
  try {
    const defaultOptions = {
      folder,
      resource_type: resourceType,
      allowed_formats:
        resourceType === "raw"
          ? ["pdf", "doc", "docx", "txt"]
          : ["jpg", "jpeg", "png", "svg", "webp", "gif"],
      transformation:
        resourceType === "image"
          ? [{ quality: "auto:best" }, { fetch_format: "auto" }]
          : undefined,
      ...options,
    };

    const uploadResponse = await cloudinary.uploader.upload(
      fileString,
      defaultOptions
    );

    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      width: uploadResponse.width,
      height: uploadResponse.height,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
    };
  } catch (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file objects or strings
 * @param {string} folder - Folder path in Cloudinary
 * @param {object} options - Additional upload options
 * @returns {Array} Array of upload responses
 */
export const uploadMultipleImages = async (
  files,
  folder = "portfolio",
  options = {}
) => {
  try {
    const uploadPromises = files.map((file) => {
      const fileString = file.tempFilePath || file.path || file;
      return uploadImage(fileString, folder, "image", options);
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Failed to upload multiple files: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @param {string} resourceType - Resource type (image, video, raw)
 * @returns {object} Delete response
 */
export const deleteImage = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return null;

    const deleteResponse = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return deleteResponse;
  } catch (error) {
    console.error(`Failed to delete file ${publicId}:`, error.message);
    return null; // Don't throw error for delete failures
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array} publicIds - Array of public IDs
 * @param {string} resourceType - Resource type
 * @returns {Array} Array of delete responses
 */
export const deleteMultipleImages = async (
  publicIds,
  resourceType = "image"
) => {
  try {
    const deletePromises = publicIds
      .filter((publicId) => publicId)
      .map((publicId) => deleteImage(publicId, resourceType));

    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    throw new Error(`Failed to delete multiple files: ${error.message}`);
  }
};

/**
 * Get optimized image URL
 * @param {string} publicId - Public ID of the image
 * @param {object} options - Transformation options
 * @returns {string} Optimized image URL
 */
export const getImageUrl = (publicId, options = {}) => {
  if (!publicId) return null;

  const defaultOptions = {
    width: 800,
    height: 600,
    crop: "fill",
    quality: "auto",
    format: "auto",
  };

  const transformOptions = { ...defaultOptions, ...options };
  return cloudinary.url(publicId, transformOptions);
};

/**
 * Upload resume/document file
 * @param {string} fileString - Base64 string or file path
 * @param {string} folder - Folder path in Cloudinary
 * @returns {object} Upload response
 */
export const uploadResume = async (
  fileString,
  folder = "portfolio/resumes"
) => {
  return uploadImage(fileString, folder, "raw", {
    allowed_formats: ["pdf", "doc", "docx"],
    resource_type: "raw",
  });
};

/**
 * Upload project images
 * @param {Array} files - Array of file objects
 * @returns {Array} Array of upload responses
 */
export const uploadProjectImages = async (files) => {
  return uploadMultipleImages(files, "portfolio/projects", {
    transformation: [
      { width: 800, height: 600, crop: "fill" },
      { quality: "auto:best" },
      { fetch_format: "auto" },
    ],
  });
};

/**
 * Upload testimonial images
 * @param {Array} files - Array of file objects
 * @returns {Array} Array of upload responses
 */
export const uploadTestimonialImages = async (files) => {
  return uploadMultipleImages(files, "portfolio/testimonials", {
    transformation: [
      { width: 150, height: 150, crop: "fill", gravity: "face" },
      { quality: "auto:best" },
      { fetch_format: "auto" },
    ],
  });
};

/**
 * Upload experience images
 * @param {Array} files - Array of file objects
 * @returns {Array} Array of upload responses
 */
export const uploadExperienceImages = async (files) => {
  return uploadMultipleImages(files, "portfolio/experiences", {
    transformation: [
      { width: 400, height: 300, crop: "fill" },
      { quality: "auto:best" },
      { fetch_format: "auto" },
    ],
  });
};

/**
 * Upload service images
 * @param {Array} files - Array of file objects
 * @returns {Array} Array of upload responses
 */
export const uploadServiceImages = async (files) => {
  return uploadMultipleImages(files, "portfolio/services", {
    transformation: [
      { width: 300, height: 200, crop: "fill" },
      { quality: "auto:best" },
      { fetch_format: "auto" },
    ],
  });
};
