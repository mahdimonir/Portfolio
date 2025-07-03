"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaBars,
  FaBriefcase,
  FaEdit,
  FaEye,
  FaPlus,
  FaProjectDiagram,
  FaQuoteLeft,
  FaServer,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { toast } from "sonner";
import SectionVisibilityManager from "./works/SectionVisibilityManager";
import TechStackManager from "./works/TechStackManager";

const WorksManager = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Mock data - replace with real data from localStorage
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "E-commerce Platform",
      status: "Published",
      lastUpdated: "2 days ago",
      description: "Full-stack e-commerce solution",
      technologies: ["React", "Node.js", "MongoDB"],
    },
    {
      id: 2,
      name: "Portfolio Website",
      status: "Draft",
      lastUpdated: "1 week ago",
      description: "Personal portfolio website",
      technologies: ["React", "Tailwind CSS"],
    },
    {
      id: 3,
      name: "Mobile App UI",
      status: "Published",
      lastUpdated: "3 days ago",
      description: "Modern mobile app interface",
      technologies: ["React Native", "TypeScript"],
    },
  ]);

  const [services, setServices] = useState([
    {
      id: 1,
      name: "Full Stack Development",
      status: "Active",
      category: "Development",
      price: "$150/hour",
      description: "Complete web application development",
    },
    {
      id: 2,
      name: "UI/UX Design",
      status: "Active",
      category: "Design",
      price: "$100/hour",
      description: "User interface and experience design",
    },
    {
      id: 3,
      name: "Consulting",
      status: "Pending",
      category: "Business",
      price: "$200/hour",
      description: "Technical consulting services",
    },
  ]);

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      company: "Tech Innovators Inc.",
      position: "Senior Developer",
      status: "Current",
      duration: "2022 - Present",
      description: "Leading frontend development team",
    },
    {
      id: 2,
      company: "Digital Solutions Ltd.",
      position: "Full Stack Developer",
      status: "Past",
      duration: "2020 - 2022",
      description: "Developed multiple web applications",
    },
    {
      id: 3,
      company: "Startup Hub",
      position: "Frontend Developer",
      status: "Past",
      duration: "2018 - 2020",
      description: "Built responsive user interfaces",
    },
  ]);

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechCorp Inc.",
      status: "Published",
      rating: 5,
      content: "Excellent work and professional service!",
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "InnovateLab",
      status: "Published",
      rating: 5,
      content: "Outstanding developer with great communication skills.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "Digital Solutions",
      status: "Draft",
      rating: 4,
      content: "Very satisfied with the project delivery.",
    },
  ]);

  const tabs = [
    { id: "projects", label: "Projects", icon: FaProjectDiagram },
    { id: "services", label: "Services", icon: FaBriefcase },
    { id: "experiences", label: "Experiences", icon: FaUser },
    { id: "testimonials", label: "Testimonials", icon: FaQuoteLeft },
    { id: "techstack", label: "Tech Stack", icon: FaServer },
    { id: "sections", label: "Page Sections", icon: FaEye },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
      case "Active":
      case "Current":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "Draft":
      case "Pending":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
      case "Past":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
    }
  };

  const handleAdd = (type) => {
    setEditingItem(null);
    setFormData({});
    setIsFormOpen(true);
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id, type) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      switch (type) {
        case "projects":
          setProjects(projects.filter((p) => p.id !== id));
          break;
        case "services":
          setServices(services.filter((s) => s.id !== id));
          break;
        case "experiences":
          setExperiences(experiences.filter((e) => e.id !== id));
          break;
        case "testimonials":
          setTestimonials(testimonials.filter((t) => t.id !== id));
          break;
      }
      toast.success("Item deleted successfully!");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now(),
      lastUpdated: editingItem ? "Just now" : new Date().toLocaleDateString(),
    };

    switch (activeTab) {
      case "projects":
        if (editingItem) {
          setProjects(
            projects.map((p) => (p.id === editingItem.id ? newItem : p))
          );
        } else {
          setProjects([...projects, newItem]);
        }
        break;
      case "services":
        if (editingItem) {
          setServices(
            services.map((s) => (s.id === editingItem.id ? newItem : s))
          );
        } else {
          setServices([...services, newItem]);
        }
        break;
      case "experiences":
        if (editingItem) {
          setExperiences(
            experiences.map((e) => (e.id === editingItem.id ? newItem : e))
          );
        } else {
          setExperiences([...experiences, newItem]);
        }
        break;
      case "testimonials":
        if (editingItem) {
          setTestimonials(
            testimonials.map((t) => (t.id === editingItem.id ? newItem : t))
          );
        } else {
          setTestimonials([...testimonials, newItem]);
        }
        break;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({});
    toast.success(
      `${activeTab.slice(0, -1)} ${
        editingItem ? "updated" : "added"
      } successfully!`
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderForm = () => {
    const isEditing = !!editingItem;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mb-20"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit" : "Add"}{" "}
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {activeTab === "projects" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={
                      Array.isArray(formData.technologies)
                        ? formData.technologies.join(", ")
                        : formData.technologies || ""
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        technologies: e.target.value.split(", "),
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status || "Draft"}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === "services" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="$100/hour"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status || "Active"}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === "experiences" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="2020 - 2022"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status || "Past"}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Current">Current</option>
                    <option value="Past">Past</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === "testimonials" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Testimonial Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={formData.rating || 5}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status || "Published"}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                {isEditing ? "Update" : "Add"}{" "}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  const renderTabContent = () => {
    const getData = () => {
      switch (activeTab) {
        case "projects":
          return projects;
        case "services":
          return services;
        case "experiences":
          return experiences;
        case "testimonials":
          return testimonials;
        default:
          return [];
      }
    };

    const data = getData();

    if (activeTab === "techstack") {
      return <TechStackManager />;
    }

    if (activeTab === "sections") {
      return <SectionVisibilityManager />;
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAdd(activeTab)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg w-full sm:w-auto justify-center"
          >
            <FaPlus size={16} />
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </motion.button>
        </div>

        <div className="grid gap-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white/50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/30"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {item.name || item.company}
                  </h4>
                  {item.position && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.position}
                    </p>
                  )}
                  {item.category && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Category: {item.category}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  )}
                  {item.content && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      "{item.content}"
                    </p>
                  )}
                  {item.lastUpdated && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Updated {item.lastUpdated}
                    </p>
                  )}
                  {item.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(item, activeTab)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, activeTab)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 mx-4 sm:mx-0">
      <div className="flex flex-col">
        {/* Header with mobile menu toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Works Management
          </h2>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Mobile/Tablet Tab Navigation */}
        <div className="lg:hidden mb-6">
          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div className="space-y-2 mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Horizontal scroll tabs for tablets */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 bg-gray-50 dark:bg-gray-700/30"
                }`}
              >
                <tab.icon size={16} />
                <span className="text-sm font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>

        {/* Mobile/Tablet Content */}
        <div className="lg:hidden">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && renderForm()}
    </div>
  );
};

export default WorksManager;
