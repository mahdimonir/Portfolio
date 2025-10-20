"use client";

import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const ExperiencesForm = ({
  isOpen,
  onClose,
  experience = null,
  onSave,
  techStacks = [],
}) => {
  const [formData, setFormData] = useState({
    role: experience?.role || "",
    company: experience?.company || "",
    period: {
      from: experience?.period?.from || "",
      to: experience?.period?.to || "Present",
    },
    location: experience?.location || "",
    description: experience?.description || "",
    skills: experience?.skills || [],
    achievements: experience?.achievements || [],
    status: experience?.status || "Active",
    current: experience?.current || false,
    companyLogo: experience?.companyLogo || "",
    companyUrl: experience?.companyUrl || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  // Flatten tech stacks for easier selection
  const allTechs = techStacks.reduce((acc, stack) => {
    return acc.concat(
      stack.technologies.map((tech) => ({
        ...tech,
        category: stack.category,
      }))
    );
  }, []);

  // Generate month/year options
  const generateDateOptions = () => {
    const options = [];
    const currentYear = new Date().getFullYear();
    const startYear = 2020;

    for (let year = currentYear; year >= startYear; year--) {
      for (let month = 1; month <= 12; month++) {
        const monthName = new Date(year, month - 1).toLocaleString("default", {
          month: "short",
        });
        const value = `${monthName} ${year}`;
        options.push({ value, label: value });
      }
    }
    return options;
  };

  const dateOptions = generateDateOptions();

  useEffect(() => {
    setFormData({
      role: experience?.role || "",
      company: experience?.company || "",
      period: {
        from: experience?.period?.from || "",
        to: experience?.period?.to || "Present",
      },
      location: experience?.location || "",
      description: experience?.description || "",
      skills: experience?.skills || [],
      achievements: experience?.achievements || [],
      status: experience?.status || "Active",
      current: experience?.current || false,
      companyLogo: experience?.companyLogo || "",
      companyUrl: experience?.companyUrl || "",
    });

    // Set selected skills
    if (experience?.skills) {
      setSelectedSkills(
        experience.skills.map((skill) =>
          typeof skill === "string" ? skill : skill._id
        )
      );
    } else {
      setSelectedSkills([]);
    }
  }, [experience]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSkillsDropdown && !event.target.closest(".skills-dropdown")) {
        setShowSkillsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSkillsDropdown]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePeriodChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      period: {
        ...prev.period,
        [field]: value,
      },
    }));
  };

  const handleCurrentChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      current: checked,
      period: {
        ...prev.period,
        to: checked ? "Present" : prev.period.to,
      },
    }));
  };

  const handleSkillToggle = (techId) => {
    setSelectedSkills((prev) => {
      if (prev.includes(techId)) {
        return prev.filter((id) => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  const removeSkill = (techId) => {
    setSelectedSkills((prev) => prev.filter((id) => id !== techId));
  };

  const getSelectedSkillNames = () => {
    return selectedSkills.map((id) => {
      const tech = allTechs.find((t) => t._id === id);
      return tech ? tech.name : id;
    });
  };

  const handleAchievementsChange = (index, value) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData((prev) => ({ ...prev, achievements: newAchievements }));
  };

  const addAchievement = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ""],
    }));
  };

  const removeAchievement = (index) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (!formData.role.trim()) {
      setError("Role is required");
      setLoading(false);
      return;
    }
    if (!formData.company.trim()) {
      setError("Company is required");
      setLoading(false);
      return;
    }
    if (!formData.period.from.trim()) {
      setError("Start period is required");
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        skills: selectedSkills, // Send as array of ObjectIds
      };

      let response;
      if (experience && experience._id) {
        response = await axios.put(
          `/experiences/${experience._id}`,
          submitData
        );
      } else {
        response = await axios.post("/experiences", submitData);
      }

      onSave(response.data.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save experience");
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
            {experience ? "Edit Experience" : "Add New Experience"}
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
                Role/Position *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Full Stack Developer"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Period *
              </label>
              <select
                value={formData.period.from}
                onChange={(e) => handlePeriodChange("from", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                required
              >
                <option value="" disabled>
                  Select start date
                </option>
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Period
              </label>
              <select
                value={formData.period.to}
                onChange={(e) => handlePeriodChange("to", e.target.value)}
                disabled={formData.current}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none disabled:opacity-50"
              >
                <option value="" disabled>
                  Select end date
                </option>
                <option value="Present">Present</option>
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.current}
              onChange={(e) => handleCurrentChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Position (sets end period to "Present")
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="San Francisco, CA"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
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
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe your role and responsibilities..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Skills (Select from Tech Stack)
            </label>

            {/* Selected Skills Display */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {getSelectedSkillNames().map((skillName, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm rounded-full"
                  >
                    {skillName}
                    <button
                      type="button"
                      onClick={() => removeSkill(selectedSkills[index])}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Skills Dropdown */}
            <div className="relative skills-dropdown">
              <button
                type="button"
                onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none text-left"
              >
                {selectedSkills.length > 0
                  ? `${selectedSkills.length} skill(s) selected`
                  : "Select skills from tech stack"}
              </button>

              {showSkillsDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {techStacks.map((stack) => (
                    <div key={stack.category} className="p-2">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 px-2">
                        {stack.category}
                      </h4>
                      <div className="space-y-1">
                        {stack.technologies.map((tech) => (
                          <label
                            key={tech._id}
                            className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSkills.includes(tech._id)}
                              onChange={() => handleSkillToggle(tech._id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {tech.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Achievements
            </label>
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) =>
                      handleAchievementsChange(index, e.target.value)
                    }
                    placeholder="Achievement description"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAchievement}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-gray-400 transition-colors"
              >
                + Add Achievement
              </button>
            </div>
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
                ? experience
                  ? "Updating..."
                  : "Creating..."
                : experience
                ? "Update Experience"
                : "Create Experience"}
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

export default ExperiencesForm;
