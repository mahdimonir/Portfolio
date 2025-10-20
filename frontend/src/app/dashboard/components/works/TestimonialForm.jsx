"use client";

import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";

const TestimonialForm = ({ isOpen, onClose, testimonial = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: testimonial?.name || "",
    role: testimonial?.role || "",
    company: testimonial?.company || "",
    quote: testimonial?.quote || "",
    rating: testimonial?.rating || 5,
    status: testimonial?.status || "Active",
    companyLogo: testimonial?.companyLogo || "",
    companyUrl: testimonial?.companyUrl || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    setFormData({
      name: testimonial?.name || "",
      role: testimonial?.role || "",
      company: testimonial?.company || "",
      quote: testimonial?.quote || "",
      rating: testimonial?.rating || 5,
      status: testimonial?.status || "Active",
      companyLogo: testimonial?.companyLogo || "",
      companyUrl: testimonial?.companyUrl || "",
    });

    // Set image preview if testimonial has an image
    if (testimonial?.image?.url) {
      setImagePreview(testimonial.image.url);
    } else {
      setImagePreview("");
    }
    setImageFile(null);
  }, [testimonial]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (!formData.name.trim()) {
      setError("Client name is required");
      setLoading(false);
      return;
    }
    if (!formData.role.trim()) {
      setError("Role/Position is required");
      setLoading(false);
      return;
    }
    if (!formData.company.trim()) {
      setError("Company is required");
      setLoading(false);
      return;
    }
    if (!formData.quote.trim()) {
      setError("Testimonial quote is required");
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();

      // Add form fields
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      // Add image if selected
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      let response;
      if (testimonial && testimonial._id) {
        response = await axios.put(
          `/testimonials/${testimonial._id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post("/testimonials", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      onSave(response.data.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role/Position *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Product Manager, CEO, etc."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Google Inc."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Testimonial Quote *
            </label>
            <textarea
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              rows={4}
              placeholder="What the client said about your work..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="client-image-upload"
              />
              <label
                htmlFor="client-image-upload"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FaUpload size={14} />
                Upload Image
              </label>
            </div>
            {imagePreview && (
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            >
              <option value="" disabled>
                Select rating
              </option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Logo URL
              </label>
              <input
                type="url"
                name="companyLogo"
                value={formData.companyLogo}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Website
              </label>
              <input
                type="url"
                name="companyUrl"
                value={formData.companyUrl}
                onChange={handleInputChange}
                placeholder="https://company.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              {loading
                ? testimonial
                  ? "Updating..."
                  : "Creating..."
                : testimonial
                ? "Update Testimonial"
                : "Create Testimonial"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </motion.div>
    </div>
  );
};

export default TestimonialForm;
