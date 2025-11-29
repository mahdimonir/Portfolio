"use client";

import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const ProjectForm = ({
  isOpen,
  onClose,
  project = null,
  onSave,
  techStacks,
  services,
}) => {
  const cleanFeatures = (features) => {
    if (!Array.isArray(features)) return [];

    return features
      .map((feature) => {
        if (
          typeof feature === "string" &&
          feature.startsWith("[") &&
          feature.endsWith("]")
        ) {
          try {
            const parsed = JSON.parse(feature);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed[0];
            }
          } catch (e) {
            return feature;
          }
        }
        return feature;
      })
      .filter((feature) => feature && feature.trim() !== "");
  };

  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    longDescription: project?.longDescription || "",
    status: project?.status || "Completed",
    features: cleanFeatures(project?.features) || [],
    github: project?.github || "",
    demo: project?.demo || "",
    category: project?.category?._id || project?.category || "",
    role: project?.role || "Full Stack Developer",
    client: project?.client || {
      type: "Personal",
      name: "",
      details: {
        company: "",
        website: "",
        contact: "",
        industry: "",
      },
    },
    featured: project?.featured || false,
    completed: project?.completed || false,
    startDate: project?.startDate ? project.startDate.slice(0, 10) : "",
    endDate: project?.endDate ? project.endDate.slice(0, 10) : "",
    tech: project?.tech ? project.tech.map((t) => t._id) : [],
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTechs, setSelectedTechs] = useState([]);
  const allTechs = flattenTechs(techStacks);
  const imageInputRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const roles = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "DevOps Engineer",
    "Mobile Developer",
    "Data Scientist",
    "Project Manager",
    "Technical Lead",
    "Software Architect",
  ];
  const clientTypes = ["Freelance", "Company", "Personal", "Open Source"];

  useEffect(() => {
    if (services && Array.isArray(services)) {
      const activeServices = services.filter(
        (service) => service.status === "Active"
      );
      setCategories(activeServices);
    }
  }, [services]);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        longDescription: project.longDescription || "",
        status: project.status || "Completed",
        features: cleanFeatures(project.features) || [],
        github: project.github || "",
        demo: project.demo || "",
        category: project.category?._id || project.category || "",
        role: project.role || "Full Stack Developer",
        client: project.client || {
          type: "Personal",
          name: "",
          details: {
            company: "",
            website: "",
            contact: "",
            industry: "",
          },
        },
        featured: project.featured || false,
        completed: project.completed || false,
        startDate: project.startDate ? project.startDate.slice(0, 10) : "",
        endDate: project.endDate ? project.endDate.slice(0, 10) : "",
        tech: project.tech ? project.tech.map((t) => t._id) : [],
      });
      setSelectedTechs(
        project.tech
          ? project.tech.map((t) => (typeof t === "string" ? t : t._id))
          : []
      );
      setImagePreviews(
        (project.images || []).map((img) => ({
          url: img.url,
          file: null,
          existing: true,
        }))
      );
    } else {
      setFormData({
        title: "",
        description: "",
        longDescription: "",
        status: "Completed",
        features: [],
        github: "",
        demo: "",
        category: "",
        role: "Full Stack Developer",
        client: {
          type: "Personal",
          name: "",
          details: {
            company: "",
            website: "",
            contact: "",
            industry: "",
          },
        },
        featured: false,
        completed: false,
        startDate: "",
        endDate: "",
        tech: [],
      });
      setSelectedTechs([]);
      setImagePreviews([]);
    }
  }, [project]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest("#tech-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClientChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value,
        ...(field === "type" && {
          details: {
            company: "",
            website: "",
            contact: "",
            industry: "",
          },
        }),
      },
    }));
  };

  const handleClientDetailsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        details: {
          ...prev.client.details,
          [field]: value,
        },
      },
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const [imagePreviews, setImagePreviews] = useState(
    (project?.images || []).map((img) => ({
      url: img.url,
      file: null,
      existing: true,
    }))
  );
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      existing: false,
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };
  const handleRemoveImage = (idx) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setImages((prev) =>
      prev.filter((_, i) => i !== idx || imagePreviews[i].existing)
    );
  };
  const moveImage = (idx, dir) => {
    setImagePreviews((prev) => {
      const arr = [...prev];
      const newIdx = dir === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
    setImages((prev) => {
      const arr = [...prev];
      const newIdx = dir === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.title.trim()) {
      setError("Project title is required");
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError("Project description is required");
      setLoading(false);
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      setLoading(false);
      return;
    }
    if (
      (formData.client.type === "Company" ||
        formData.client.type === "Freelance" ||
        formData.client.type === "Open Source") &&
      !formData.client.name.trim()
    ) {
      setError("Client name is required");
      setLoading(false);
      return;
    }
    if (
      formData.client.type === "Open Source" &&
      !formData.client.details.website.trim()
    ) {
      setError("Open Source projects require a website");
      setLoading(false);
      return;
    }
    if (!formData.startDate) {
      setError("Start date is required");
      setLoading(false);
      return;
    }
    if (selectedTechs.length === 0) {
      setError("Please select at least one technology");
      setLoading(false);
      return;
    }
    if (imagePreviews.length === 0) {
      setError("Please add at least one project image");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      const filteredFeatures = formData.features.filter(
        (feature) => feature.trim() !== ""
      );
      const filteredTechs = selectedTechs.filter((id) => !!id && id !== "");

      // Convert individual tech IDs to TechStack IDs
      const techStackIds = filteredTechs
        .map((techId) => {
          const tech = allTechs.find((t) => t._id === techId);
          return tech?.techStackId;
        })
        .filter(Boolean);

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tech") {
          data.append("tech", JSON.stringify(filteredTechs));
        } else if (key === "features") {
          data.append("features", JSON.stringify(filteredFeatures));
        } else if (key === "client") {
          data.append("client", JSON.stringify(value));
        } else {
          data.append(key, value ?? "");
        }
      });
      images.forEach((img) => data.append("images", img));
      let res;
      if (project && project._id) {
        res = await axios.put(`/projects/${project._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/projects", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSave(res.data.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const techsByCategory = {};
  allTechs.forEach((tech) => {
    if (!techsByCategory[tech.category]) techsByCategory[tech.category] = [];
    techsByCategory[tech.category].push(tech);
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {project ? "Edit Project" : "Add New Project"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="Enter project title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="Enter a brief project description"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Long Description
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="Enter a detailed project description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Features
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="w-full px-4 py-2 border-2 border-dashed border-blue-400 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FaPlus size={14} />
                Add Feature
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned">Planned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category (from Services)
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.title} ({service.category})
                  </option>
                ))}
              </select>
            </div>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                placeholder="Select start date"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                placeholder="Select end date"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              required
            >
              <option value="" disabled>
                Select role
              </option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Type
                </label>
                <select
                  value={formData.client.type}
                  onChange={(e) => handleClientChange("type", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                >
                  <option value="" disabled>
                    Select client type
                  </option>
                  {clientTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {formData.client.type !== "Personal" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Name
                    {["Company", "Freelance", "Open Source"].includes(
                      formData.client.type
                    )
                      ? " *"
                      : ""}
                  </label>
                  <input
                    type="text"
                    value={formData.client.name}
                    onChange={(e) => handleClientChange("name", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    placeholder="Enter client name"
                    required={["Company", "Freelance", "Open Source"].includes(
                      formData.client.type
                    )}
                  />
                </div>
              )}
            </div>
            {formData.client.type === "Company" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.client.details?.company || ""}
                      onChange={(e) =>
                        handleClientDetailsChange("company", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.client.details?.industry || ""}
                      onChange={(e) =>
                        handleClientDetailsChange("industry", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                      placeholder="Enter industry"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.client.details?.website || ""}
                      onChange={(e) =>
                        handleClientDetailsChange("website", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                      placeholder="Enter website URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.client.details?.contact || ""}
                      onChange={(e) =>
                        handleClientDetailsChange("contact", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                      placeholder="Enter contact person"
                    />
                  </div>
                </div>
              </>
            )}
            {formData.client.type === "Freelance" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Client Company (if any)
                    </label>
                    <input
                      type="text"
                      value={formData.client.details?.company || ""}
                      onChange={(e) =>
                        handleClientDetailsChange("company", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                      placeholder="Enter client company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.client.details?.industry || ""}
                      onChange={(e) =>
                        handleClientDetailsChange("industry", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                      placeholder="Enter industry"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Portfolio/Website
                    </label>
                    <input
                      type="url"
                      value={formData.client.details?.website || ""}
                      onChange={(e) =>
                        handleClientDetailsChange("website", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                      placeholder="Enter portfolio/website URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Email/Phone
                    </label>
                    <input
                      type="text"
                      value={formData.client.details?.contact || ""}
                      onChange={(e) =>
                        handleClientDetailsChange("contact", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                      placeholder="Enter contact email or phone"
                    />
                  </div>
                </div>
              </>
            )}
            {formData.client.type === "Personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Purpose
                  </label>
                  <input
                    type="text"
                    value={formData.client.details?.industry || ""}
                    onChange={(e) =>
                      handleClientDetailsChange("industry", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    placeholder="e.g., Learning, Portfolio, Startup"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Personal Website
                  </label>
                  <input
                    type="url"
                    value={formData.client.details?.website || ""}
                    onChange={(e) =>
                      handleClientDetailsChange("website", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    placeholder="Enter personal website URL"
                  />
                </div>
              </div>
            )}
            {formData.client.type === "Open Source" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project/Org Website *
                  </label>
                  <input
                    type="url"
                    value={formData.client.details?.website || ""}
                    onChange={(e) =>
                      handleClientDetailsChange("website", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    placeholder="Enter project/org website URL"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry/Field
                  </label>
                  <input
                    type="text"
                    value={formData.client.details?.industry || ""}
                    onChange={(e) =>
                      handleClientDetailsChange("industry", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    placeholder="Enter industry or field"
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="Enter GitHub URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Demo URL
            </label>
            <input
              type="url"
              name="demo"
              value={formData.demo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="Enter demo URL"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tech Stack
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTechs.map((techId) => {
                const tech = allTechs.find((t) => t._id === techId);
                return tech ? (
                  <span
                    key={techId}
                    className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full"
                  >
                    {tech.name}
                    <span className="text-xs text-gray-400">
                      ({tech.category})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTechs(
                          selectedTechs.filter((id) => id !== techId)
                        )
                      }
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
            <div className="relative" id="tech-dropdown">
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none text-left"
              >
                {selectedTechs.length === 0
                  ? "Select technologies"
                  : `${selectedTechs.length} selected`}
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg">
                  <div className="flex flex-col p-2">
                    {Object.entries(techsByCategory).map(
                      ([category, techs]) => (
                        <div key={category} className="mb-2">
                          <div className="font-semibold text-xs text-gray-500 dark:text-gray-300 px-2 py-1">
                            {category}
                          </div>
                          {techs.map((tech) => (
                            <label
                              key={tech._id}
                              className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                              <input
                                type="checkbox"
                                value={tech._id}
                                checked={selectedTechs.includes(tech._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTechs([
                                      ...selectedTechs,
                                      tech._id,
                                    ]);
                                  } else {
                                    setSelectedTechs(
                                      selectedTechs.filter(
                                        (id) => id !== tech._id
                                      )
                                    );
                                  }
                                }}
                              />
                              <span>{tech.name}</span>
                            </label>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Images
            </label>
            <div className="flex flex-wrap gap-3 mb-2">
              {imagePreviews.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img.url}
                    alt="Project"
                    className="w-20 h-20 object-cover rounded border-2 border-gray-300 dark:border-gray-600"
                  />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-80 hover:opacity-100"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-1 left-1 flex gap-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(idx, "up")}
                        className="bg-gray-200 dark:bg-gray-700 text-xs px-1 rounded"
                      >
                        ↑
                      </button>
                    )}
                    {idx < imagePreviews.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(idx, "down")}
                        className="bg-gray-200 dark:bg-gray-700 text-xs px-1 rounded"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-blue-400 rounded-xl text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                onClick={() => imageInputRef.current.click()}
              >
                + Add Image
              </button>
              <input
                ref={imageInputRef}
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleAddImages}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Drag to reorder, first image is primary.
            </p>
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
                ? project
                  ? "Updating..."
                  : "Creating..."
                : project
                ? "Update Project"
                : "Create Project"}
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

const flattenTechs = (techStacks) => {
  const flat = [];
  (techStacks || []).forEach((stack) => {
    (stack.technologies || []).forEach(
      (tech) => flat.push({ ...tech, category: stack.category })
    );
  });
  return flat;
};

export default ProjectForm;
