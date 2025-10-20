"use client";

import { getIconComponent } from "@/components/global/getIconComponent";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import axios from "@/lib/axios";
import { getStatusColor, getStatusIcon } from "@/lib/status";
import { slugGenerator } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BlogForm from "./works/BlogForm";
import ConsultationsManager from "./works/ConsultationsManager";
import ExperiencesForm from "./works/ExperiencesForm";
import ProjectForm from "./works/ProjectForm";
import ServiceForm from "./works/ServiceForm";
import TechStackForm from "./works/TechStackForm";
import TechStackManager from "./works/TechStackManager";
import TestimonialForm from "./works/TestimonialForm";

const WorksManager = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Real data from database
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);

  // Global filters
  const [filterQuery, setFilterQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Fetch data from backend
  useEffect(() => {
    fetchProjects();
    fetchServices();
    fetchExperiences();
    fetchTestimonials();
    fetchTechStacks();
    fetchBlogs();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/projects/all");
      setProjects(response.data.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("/services/all");
      setServices(response.data.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      // Don't show error toast for services if endpoint doesn't exist yet
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await axios.get("/experiences/all"); // Get all experiences for admin
      setExperiences(response.data.data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error("Failed to fetch experiences");
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get("/testimonials/all"); // Get all testimonials for admin
      setTestimonials(response.data.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to fetch testimonials");
    }
  };

  const fetchTechStacks = async () => {
    try {
      const response = await axios.get("/techstacks");
      setTechStacks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tech stacks:", error);
      // Optionally show a toast or error
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/blogs/all");
      const fetchedBlogs = response.data.data || [];
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    }
  };

  const tabs = [
    { id: "projects", label: "Projects", icon: "FaProjectDiagram" },
    { id: "blogs", label: "Blogs", icon: "FaBlog" },
    { id: "services", label: "Services", icon: "FaBriefcase" },
    { id: "experiences", label: "Experiences", icon: "FaUser" },
    { id: "testimonials", label: "Testimonials", icon: "FaQuoteLeft" },
    { id: "techstack", label: "Tech Stack", icon: "FaServer" },
    {
      id: "consultations",
      label: "Consultation Manager",
      icon: "FaCalendarAlt",
    },
  ];

  // Function to clean up corrupted features for display
  const cleanFeaturesForDisplay = (features) => {
    if (!Array.isArray(features)) return [];

    return features
      .map((feature) => {
        // If feature is a string that looks like JSON, try to parse it
        if (
          typeof feature === "string" &&
          feature.startsWith("[") &&
          feature.endsWith("]")
        ) {
          try {
            const parsed = JSON.parse(feature);
            // If parsed is an array, take the first item
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed[0];
            }
          } catch (e) {
            // If parsing fails, return the original string
            return feature;
          }
        }
        return feature;
      })
      .filter((feature) => feature && feature.trim() !== "");
  };

  const consultationsRef = useRef(null);

  const handleAdd = (type) => {
    if (type === "consultations") {
      consultationsRef.current?.openCreateSlot?.();
      return;
    }
    setEditingItem(null);
    setFormData({});
    setIsFormOpen(true);
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id, type, itemName) => {
    setConfirmDialog({
      isOpen: true,
      title: "Confirm Delete",
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          switch (type) {
            case "projects":
              await axios.delete(`/projects/${id}`);
              setProjects(projects.filter((p) => p._id !== id));
              break;
            case "blogs":
              await axios.delete(`/blogs/${id}`);
              setBlogs(blogs.filter((b) => b._id !== id));
              break;
            case "services":
              await axios.delete(`/services/${id}`);
              setServices(services.filter((s) => s._id !== id));
              break;
            case "experiences":
              await axios.delete(`/experiences/${id}`);
              setExperiences(experiences.filter((e) => e._id !== id));
              break;
            case "testimonials":
              await axios.delete(`/testimonials/${id}`);
              setTestimonials(testimonials.filter((t) => t._id !== id));
              break;
            case "techstack":
              await axios.delete(
                `/techstacks/${encodeURIComponent(id)}/${encodeURIComponent(
                  itemName
                )}`
              );
              setTechStacks(
                techStacks.map((stack) =>
                  stack.category === id
                    ? {
                        ...stack,
                        technologies: stack.technologies.filter(
                          (t) => t.name !== itemName
                        ),
                      }
                    : stack
                )
              );
              break;
          }
          toast.success("Item deleted successfully!");
        } catch (error) {
          console.error("Error deleting item:", error);
          toast.error("Failed to delete item");
        }
      },
    });
  };

  const handleProjectSave = (savedProject) => {
    if (editingItem) {
      setProjects(
        projects.map((p) => (p._id === editingItem._id ? savedProject : p))
      );
      toast.success("Project updated successfully!");
    } else {
      setProjects([savedProject, ...projects]);
      toast.success("Project created successfully!");
    }
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleBlogSave = (savedBlog) => {
    // Ensure savedBlog has all required fields
    if (!savedBlog || !savedBlog._id) {
      console.error("Invalid blog data received:", savedBlog);
      toast.error("Failed to save blog: Invalid data received");
      return;
    }

    if (editingItem) {
      setBlogs(blogs.map((b) => (b._id === editingItem._id ? savedBlog : b)));
      toast.success("Blog post updated successfully!");
    } else {
      setBlogs([savedBlog, ...blogs]);
      toast.success("Blog post created successfully!");
    }
    // Refresh categories in case a new one was added
    const categories = [
      "all",
      ...new Set(
        [...blogs, savedBlog]
          .filter((b) => b && b.category)
          .map((b) => b.category)
      ),
    ];
    setBlogCategories(categories);
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({});

    // Refresh blogs to ensure we have the latest data
    fetchBlogs();
  };

  const handleServiceSave = (savedService) => {
    if (editingItem) {
      setServices(
        services.map((s) => (s._id === editingItem._id ? savedService : s))
      );
      toast.success("Service updated successfully!");
    } else {
      setServices([savedService, ...services]);
      toast.success("Service created successfully!");
    }
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleExperienceSave = (savedExperience) => {
    if (editingItem) {
      setExperiences(
        experiences.map((e) =>
          e._id === editingItem._id ? savedExperience : e
        )
      );
      toast.success("Experience updated successfully!");
    } else {
      setExperiences([savedExperience, ...experiences]);
      toast.success("Experience created successfully!");
    }
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleTestimonialSave = (savedTestimonial) => {
    if (editingItem) {
      setTestimonials(
        testimonials.map((t) =>
          t._id === editingItem._id ? savedTestimonial : t
        )
      );
      toast.success("Testimonial updated successfully!");
    } else {
      setTestimonials([savedTestimonial, ...testimonials]);
      toast.success("Testimonial created successfully!");
    }
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleTechStackSave = async (formTech) => {
    try {
      let updatedCategory;
      if (editingItem) {
        // Update existing tech (PATCH, not PUT)
        const res = await axios.patch(
          `/techstacks/${encodeURIComponent(
            formTech.category
          )}/${encodeURIComponent(editingItem.name)}`,
          {
            // If renaming, send newName; otherwise, just send the fields
            newName: formTech.name,
            tagline: formTech.tagline,
            icon: formTech.icon,
            color: formTech.color,
          }
        );
        updatedCategory = res.data.data;
      } else {
        // Create new tech
        const res = await axios.post("/techstacks", formTech);
        updatedCategory = res.data.data;
      }

      // Update local state: replace the category with the updated one
      setTechStacks((prev) => {
        const idx = prev.findIndex(
          (c) => c.category === updatedCategory.category
        );
        if (idx !== -1) {
          // Replace the category
          const arr = [...prev];
          arr[idx] = updatedCategory;
          return arr;
        } else {
          // Add new category
          return [...prev, updatedCategory];
        }
      });

      setIsFormOpen(false);
      setEditingItem(null);
      setFormData({});
      toast.success(
        editingItem
          ? "Tech updated successfully!"
          : "Tech created successfully!"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to save technology. Please try again."
      );
    }
  };

  const renderTabContent = () => {
    const getData = () => {
      switch (activeTab) {
        case "projects":
          return projects;
        case "blogs":
          return blogs;
        case "services":
          return services;
        case "experiences":
          return experiences;
        case "testimonials":
          return testimonials;
        case "techstack":
          return techStacks;
        default:
          return [];
      }
    };

    // Helper to get comparable title/name for filters
    const getComparableText = (item) => {
      if (!item) return "";
      switch (activeTab) {
        case "projects":
          return `${item.title || ""} ${item.description || ""}`.toLowerCase();
        case "blogs":
          return `${item.title || ""} ${item.excerpt || ""} ${
            item.category || ""
          }`.toLowerCase();
        case "services":
          return `${item.title || ""} ${item.description || ""}`.toLowerCase();
        case "experiences":
          return `${item.company || ""} ${item.role || ""} ${
            item.description || ""
          }`.toLowerCase();
        case "testimonials":
          return `${item.name || ""} ${item.company || ""} ${
            item.role || ""
          }`.toLowerCase();
        case "techstack":
          return `${item.category || ""} ${(item.technologies || [])
            .map((t) => t.name || "")
            .join(" ")}`.toLowerCase();
        default:
          return "";
      }
    };

    const data = getData();

    // Apply global filters (consultations handled in child but we still show controls)
    let filteredData = data;
    if (filterQuery.trim()) {
      const q = filterQuery.trim().toLowerCase();
      filteredData = filteredData.filter((item) =>
        getComparableText(item).includes(q)
      );
    }
    if (filterStatus !== "all") {
      filteredData = filteredData.filter(
        (item) => String(item?.status || "").toLowerCase() === filterStatus
      );
    }
    // Sorting
    filteredData = [...filteredData].sort((a, b) => {
      const aDate = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
      const bDate = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
      const aTitle = (a?.title || a?.name || a?.company || "").toLowerCase();
      const bTitle = (b?.title || b?.name || b?.company || "").toLowerCase();
      switch (sortOption) {
        case "oldest":
          return aDate - bDate;
        case "a-z":
          return aTitle.localeCompare(bTitle);
        case "z-a":
          return bTitle.localeCompare(aTitle);
        case "newest":
        default:
          return bDate - aDate;
      }
    });

    // For techstack and consultations, we'll still show the common header and filters below

    if (loading && activeTab !== "blogs") {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
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
            {getIconComponent("FaPlus")({ size: 16 })}
            Add{" "}
            {activeTab === "consultations"
              ? "Time Slot"
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </motion.button>
        </div>

        {/* Global Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All statuses</option>
              {Array.from(
                new Set(
                  (filteredData || [])
                    .map((it) =>
                      String(it?.status || "")
                        .trim()
                        .toLowerCase()
                    )
                    .filter(Boolean)
                )
              ).map((statusKey) => (
                <option key={statusKey} value={statusKey}>
                  {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="a-z">Sort: A → Z</option>
              <option value="z-a">Sort: Z → A</option>
            </select>
          </div>
        </div>

        {/* Techstack and Consultations special rendering below filters */}
        {activeTab === "techstack" && (
          <div className="mt-2">
            <TechStackManager
              techStacks={filteredData}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onAdd={handleAdd}
              itemsPerPage={12}
            />
          </div>
        )}
        {activeTab === "consultations" && (
          <div className="mt-2">
            <ConsultationsManager
              filterQuery={filterQuery}
              filterStatus={filterStatus}
              sortOption={sortOption}
              ref={consultationsRef}
            />
          </div>
        )}

        {(
          activeTab !== "consultations" && activeTab !== "techstack"
            ? filteredData.length === 0
            : false
        ) ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No {activeTab} found. Click the button above to add your first{" "}
            {activeTab.slice(0, -1)}.
          </div>
        ) : (
          <div className="grid gap-4">
            {(activeTab !== "consultations" && activeTab !== "techstack"
              ? (() => {
                  const start = (currentPage - 1) * itemsPerPage;
                  const end = start + itemsPerPage;
                  return filteredData.slice(start, end);
                })()
              : []
            ).map((item) => {
              const IconComponent = getIconComponent("FaEdit");
              const TrashIcon = getIconComponent("FaTrash");
              // PROJECTS CARD
              if (activeTab === "projects") {
                return (
                  <div
                    key={item._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-600/40 flex flex-col sm:flex-row gap-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <div className="relative group/image">
                      <img
                        src={
                          item?.images?.[0]?.url ||
                          item?.image ||
                          "/fallback-image.png"
                        }
                        alt={item.title || "Project cover"}
                        className="w-full sm:w-36 h-36 object-cover rounded-xl shadow-md group-hover/image:shadow-lg transition-all duration-300 group-hover/image:scale-105"
                        onError={(e) => {
                          e.target.src = "/fallback-image.png";
                        }}
                      />
                      {item.featured && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.role && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            Role: {item.role}
                          </span>
                        )}
                        {item.duration && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            Duration: {item.duration}
                          </span>
                        )}
                        {item.category?.title && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            {item.category.title}
                          </span>
                        )}
                        {item.client?.name && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            {item.client.type}: {item.client.name}
                          </span>
                        )}
                      </div>
                      {item.updatedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Last updated:{" "}
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wide shadow-sm flex items-center gap-1.5 ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getIconComponent(getStatusIcon(item.status))({
                          size: 12,
                        })}
                        {item.status}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(item, activeTab)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl"
                        >
                          <IconComponent size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item._id, activeTab, item.title)
                          }
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"
                        >
                          <TrashIcon size={14} />
                        </button>
                        <a
                          href={`/projects/${
                            item.slug || slugGenerator(item.title)
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900/30 rounded-xl"
                          title="View Project"
                        >
                          {getIconComponent("FaExternalLinkAlt")({
                            size: 14,
                          })}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }
              // BLOGS CARD
              if (activeTab === "blogs") {
                // Skip rendering if blog data is incomplete
                if (!item || !item._id || !item.title) {
                  return null;
                }

                return (
                  <div
                    key={item._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-600/40 flex flex-col sm:flex-row gap-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <div className="relative group/image">
                      <img
                        src={item.coverImage?.url || "/fallback-image.png"}
                        alt={item.title || "Blog cover"}
                        className="w-full sm:w-36 h-36 object-cover rounded-xl shadow-md group-hover/image:shadow-lg transition-all duration-300 group-hover/image:scale-105"
                        onError={(e) => {
                          e.target.src = "/fallback-image.png";
                        }}
                      />
                      {item.featured && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.category && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            📂 {item.category}
                          </span>
                        )}
                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                          <>
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium rounded-full shadow-sm"
                              >
                                #{tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-full shadow-sm">
                                +{item.tags.length - 3} more
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Last updated:{" "}
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wide shadow-sm flex items-center gap-1.5 ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getIconComponent(getStatusIcon(item.status))({
                          size: 12,
                        })}
                        {item.status}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(item, activeTab)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl"
                        >
                          <IconComponent size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item._id, activeTab, item.title)
                          }
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"
                        >
                          <TrashIcon size={14} />
                        </button>
                        <a
                          href={`/blogs/${
                            item.slug || slugGenerator(item.title)
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900/30 rounded-xl"
                          title="View Post"
                        >
                          {getIconComponent("FaExternalLinkAlt")({
                            size: 14,
                          })}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }
              // SERVICES CARD
              if (activeTab === "services") {
                return (
                  <div
                    key={item._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-600/40 flex flex-col sm:flex-row gap-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.category && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            Category: {item.category}
                          </span>
                        )}
                        {item.pricing && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            Price: {item.pricing}
                          </span>
                        )}
                        {item.projectCount !== undefined && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            Projects: {item.projectCount}
                          </span>
                        )}
                        {item.features && item.features.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {cleanFeaturesForDisplay(item.features)
                              .slice(0, 3)
                              .map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            {cleanFeaturesForDisplay(item.features).length >
                              3 && (
                              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full">
                                +
                                {cleanFeaturesForDisplay(item.features).length -
                                  3}{" "}
                                more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wide shadow-sm flex items-center gap-1.5 ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getIconComponent(getStatusIcon(item.status))({
                          size: 12,
                        })}
                        {item.status}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(item, activeTab)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl"
                        >
                          <IconComponent size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              item._id,
                              activeTab,
                              item.title || item.name
                            )
                          }
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              // EXPERIENCES CARD
              if (activeTab === "experiences") {
                return (
                  <div
                    key={item._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-600/40 flex flex-col sm:flex-row gap-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {item.company}
                        </h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.role && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            {item.role}
                          </span>
                        )}
                        {item.period && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            {item.period.from} - {item.period.to}
                          </span>
                        )}
                        {item.duration && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-sm">
                            {item.duration}
                          </span>
                        )}
                        {Array.isArray(item.skills) &&
                          item.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.skills.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 text-xs rounded-full"
                                >
                                  {typeof skill === "string"
                                    ? skill
                                    : skill.name}
                                </span>
                              ))}
                              {item.skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full">
                                  +{item.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wide shadow-sm flex items-center gap-1.5 ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getIconComponent(getStatusIcon(item.status))({
                          size: 12,
                        })}
                        {item.status}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(item, activeTab)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl"
                        >
                          <IconComponent size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item._id, activeTab, item.company)
                          }
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              // TESTIMONIALS CARD
              if (activeTab === "testimonials") {
                return (
                  <div
                    key={item._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-600/40 flex flex-col sm:flex-row gap-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        {item.image?.url && (
                          <img
                            src={item.image.url}
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-xl">
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.role && (
                              <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm">
                                {item.role}
                              </span>
                            )}
                            {item.company && (
                              <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-full shadow-sm">
                                {item.company}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {item.quote && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 italic">
                          "{item.quote}"
                        </p>
                      )}
                      {item.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(item.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">
                              ★
                            </span>
                          ))}
                          <span className="text-sm text-gray-500 ml-1">
                            ({item.rating}/5)
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wide shadow-sm flex items-center gap-1.5 ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getIconComponent(getStatusIcon(item.status))({
                          size: 12,
                        })}
                        {item.status}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(item, activeTab)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl"
                        >
                          <IconComponent size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item._id, activeTab, item.name)
                          }
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              // CONSULTATIONS handled in separate component, skip here
              // ... fallback for other tabs ...
              return null;
            })}
          </div>
        )}

        {activeTab !== "consultations" &&
          activeTab !== "techstack" &&
          (() => {
            const totalItems = filteredData.length;
            const totalPages = Math.max(
              1,
              Math.ceil(totalItems / itemsPerPage)
            );
            return (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {Math.min(currentPage, totalPages)} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 ${
                        currentPage === idx + 1
                          ? "bg-blue-600 text-white border-blue-600"
                          : ""
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600"
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                  </select>
                </div>
              </div>
            );
          })()}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 mx-0">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Works Management
            </h2>
          </div>

          {/* Mobile/Tablet Tab Navigation */}
          <div className="lg:hidden mb-6">
            {/* Mobile dropdown menu */}
            {isMobileMenuOpen && (
              <div className="space-y-2 mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => {
                  const IconComponent = getIconComponent(tab.icon);
                  return (
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
                      <IconComponent size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Horizontal scroll tabs for tablets */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {tabs.map((tab) => {
                const IconComponent = getIconComponent(tab.icon);
                return (
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
                    <IconComponent size={16} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-6">
            {/* Sidebar Tabs */}
            <div className="w-64 flex-shrink-0">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = getIconComponent(tab.icon);
                  return (
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
                      <IconComponent size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
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
      </div>

      {/* Form Modals - Moved outside the main container */}
      {isFormOpen && activeTab === "projects" && (
        <ProjectForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          project={editingItem}
          onSave={handleProjectSave}
          techStacks={techStacks}
          services={services}
        />
      )}
      {isFormOpen && activeTab === "blogs" && (
        <BlogForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          blog={editingItem}
          onSave={handleBlogSave}
        />
      )}
      {isFormOpen && activeTab === "services" && (
        <ServiceForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          service={editingItem}
          onSave={handleServiceSave}
        />
      )}
      {isFormOpen && activeTab === "experiences" && (
        <ExperiencesForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          experience={editingItem}
          onSave={handleExperienceSave}
          techStacks={techStacks}
        />
      )}
      {isFormOpen && activeTab === "testimonials" && (
        <TestimonialForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          testimonial={editingItem}
          onSave={handleTestimonialSave}
        />
      )}
      {isFormOpen && activeTab === "techstack" && (
        <TechStackForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          tech={editingItem}
          onSave={handleTechStackSave}
          techStacks={techStacks}
        />
      )}

      {/* Confirm Dialog - Moved outside the main container */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default WorksManager;
