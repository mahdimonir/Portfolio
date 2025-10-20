"use client";

import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";

const BlogForm = ({ isOpen, onClose, blog = null, onSave }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    status: blog?.status || "draft",
    category: blog?.category || "",
    tags: blog?.tags || "",
    featured: blog?.featured || false,
    coverImage: blog?.coverImage || { url: "", public_id: "" },
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(blog?.coverImage?.url || "");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("excerpt", formData.excerpt);
      data.append("content", formData.content);
      data.append("status", formData.status);
      data.append("category", formData.category);
      data.append("tags", formData.tags);
      data.append("featured", formData.featured);

      if (imageFile) {
        data.append("image", imageFile);
      } else if (blog?.coverImage?.url) {
        data.append("coverImage", JSON.stringify(blog.coverImage));
      }

      let res;
      if (blog?._id) {
        res = await axios.put(`/blogs/${blog._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/blogs", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSave(res.data.data);
      onClose();
    } catch (error) {
      console.error("Blog submit error:", error);
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
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {blog ? "Edit Blog" : "Add New Blog"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter blog title"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a brief excerpt"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Content
            </label>
            <textarea
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter blog content"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Cover Image
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Cover Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600 mb-3"
              />
            )}
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="cover-image-upload"
              />
              <label
                htmlFor="cover-image-upload"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FaUpload size={14} />
                Upload Image
              </label>
              {imageFile && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {imageFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Meta Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Category
              </label>
              <input
                name="category"
                type="text"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g. Technology"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <input
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. react, javascript"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label
              htmlFor="featured"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Mark as Featured
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? blog
                  ? "Updating..."
                  : "Creating..."
                : blog
                ? "Update Blog"
                : "Create Blog"}
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
        </form>
      </motion.div>
    </div>
  );
};

export default BlogForm;
