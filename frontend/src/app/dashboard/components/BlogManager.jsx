"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBlog, FaCalendarAlt, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import BlogForm from "./BlogForm";

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    const savedBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    setBlogs(savedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleSaveBlog = (blogData) => {
    let updatedBlogs;

    if (editingBlog) {
      updatedBlogs = blogs.map((blog) =>
        blog.id === editingBlog.id ? { ...blogData, id: editingBlog.id } : blog
      );
      toast.success("Blog updated successfully!");
    } else {
      const newBlog = {
        ...blogData,
        id: Date.now(),
        date: new Date().toISOString(),
      };
      updatedBlogs = [newBlog, ...blogs];
      toast.success("Blog created successfully!");
    }

    setBlogs(updatedBlogs);
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    setIsFormOpen(false);
    setEditingBlog(null);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const updatedBlogs = blogs.filter((blog) => blog.id !== id);
      setBlogs(updatedBlogs);
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      toast.success("Blog deleted successfully!");
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (activeTab === "all") return true;
    return blog.status === activeTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const tabs = [
    { id: "all", label: "All", count: blogs.length },
    {
      id: "published",
      label: "Published",
      count: blogs.filter((b) => b.status === "published").length,
    },
    {
      id: "draft",
      label: "Draft",
      count: blogs.filter((b) => b.status === "draft").length,
    },
    {
      id: "pending",
      label: "Pending",
      count: blogs.filter((b) => b.status === "pending").length,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Blog Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage your blog posts
          </p>
        </div>
        <motion.button
          onClick={() => {
            setEditingBlog(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus size={16} />
          Add New Blog
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto scrollbar-hide gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Blogs List */}
      <div className="space-y-4">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBlog className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Blogs Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start by creating your first blog post.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="md:flex">
                  {blog.image && (
                    <div className="md:w-48 h-48 md:h-auto">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {blog.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              blog.status
                            )}`}
                          >
                            {blog.status.charAt(0).toUpperCase() +
                              blog.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt size={12} />
                            {new Date(blog.date).toLocaleDateString()}
                          </span>
                          {blog.category && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                              {blog.category}
                            </span>
                          )}
                        </div>
                        {blog.tags && (
                          <div className="flex flex-wrap gap-2">
                            {blog.tags.split(",").map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleEditBlog(blog)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaEdit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaTrash size={14} />
                        <span className="hidden sm:inline">Delete</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Form Modal */}
      <BlogForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBlog(null);
        }}
        blog={editingBlog}
        onSave={handleSaveBlog}
      />
    </div>
  );
};

export default BlogManager;
