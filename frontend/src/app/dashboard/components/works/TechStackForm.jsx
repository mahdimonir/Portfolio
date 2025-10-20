"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const allowedCategories = ["Frontend", "Backend", "Database", "DevOps & Tools"];
const colorOptions = [
  "text-blue-500",
  "text-green-500",
  "text-purple-500",
  "text-red-500",
  "text-yellow-500",
  "text-pink-500",
  "text-indigo-500",
  "text-gray-500",
  "text-cyan-500",
  "text-orange-500",
  "text-emerald-500",
  "text-violet-500",
];

const TechStackForm = ({
  isOpen,
  onClose,
  tech = null,
  onSave,
  techStacks,
}) => {
  const [formData, setFormData] = useState({
    name: tech?.name || "",
    tagline: tech?.tagline || "",
    icon: tech?.icon || "",
    color: tech?.color || "",
    category: tech?.category || allowedCategories[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: tech?.name || "",
      tagline: tech?.tagline || "",
      icon: tech?.icon || "",
      color: tech?.color || "",
      category: tech?.category || allowedCategories[0],
    });
    setError("");
  }, [tech, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to save technology");
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
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {tech ? "Edit Technology" : "Add New Technology"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="Enter tech name (e.g., React)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="Enter tech tagline"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon (e.g. FaReact)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="e.g. FaReact, SiNodeDotJs"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <select
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            >
              <option value="" disabled>
                Select color
              </option>
              {colorOptions.map((color) => (
                <option key={color} value={color}>
                  {color.replace("text-", "")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {allowedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
                ? tech
                  ? "Updating..."
                  : "Creating..."
                : tech
                ? "Update Technology"
                : "Create Technology"}
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

export default TechStackForm;
