import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload an image to Cloudinary
 * @param {string} imageString - Base64 encoded image string
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} Cloudinary upload response
 */
export const uploadImage = async (imageString, folder = 'portfolio') => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(imageString, {
      folder,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'svg', 'webp'],
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id
    };
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Cloudinary public ID of the image
 * @returns {Promise<Object>} Cloudinary deletion response
 */
export const deleteImage = async (publicId) => {
  try {
    const deleteResponse = await cloudinary.uploader.destroy(publicId);
    return deleteResponse;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Generate a Cloudinary URL with transformations
 * @param {string} publicId - Cloudinary public ID of the image
 * @param {Object} options - Transformation options
 * @returns {string} Transformed image URL
 */
export const getImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  };

  const transformOptions = { ...defaultOptions, ...options };

  return cloudinary.url(publicId, transformOptions);
};