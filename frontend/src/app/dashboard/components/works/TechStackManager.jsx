"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaChartBar, FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const TechStackManager = () => {
  const [activeCategory, setActiveCategory] = useState("frontend");

  const categories = [
    { id: "frontend", label: "Frontend", color: "from-blue-500 to-cyan-500" },
    { id: "backend", label: "Backend", color: "from-green-500 to-emerald-500" },
    { id: "database", label: "Database", color: "from-purple-500 to-pink-500" },
    {
      id: "devops",
      label: "DevOps & Tools",
      color: "from-orange-500 to-red-500",
    },
  ];

  const techStacks = {
    frontend: [
      { name: "React", progress: 95, tagline: "JavaScript Library" },
      { name: "TypeScript", progress: 90, tagline: "Type-Safe JavaScript" },
      { name: "Next.js", progress: 85, tagline: "React Framework" },
      { name: "Tailwind CSS", progress: 92, tagline: "Utility-First CSS" },
    ],
    backend: [
      { name: "Node.js", progress: 88, tagline: "JavaScript Runtime" },
      { name: "Express.js", progress: 85, tagline: "Web Framework" },
      { name: "Python", progress: 75, tagline: "Programming Language" },
      { name: "GraphQL", progress: 70, tagline: "Query Language" },
    ],
    database: [
      { name: "MongoDB", progress: 85, tagline: "NoSQL Database" },
      { name: "PostgreSQL", progress: 80, tagline: "SQL Database" },
      { name: "Redis", progress: 75, tagline: "In-Memory Store" },
      { name: "Firebase", progress: 82, tagline: "Backend Platform" },
    ],
    devops: [
      { name: "Docker", progress: 78, tagline: "Containerization" },
      { name: "AWS", progress: 72, tagline: "Cloud Platform" },
      { name: "Git", progress: 95, tagline: "Version Control" },
      { name: "Vercel", progress: 88, tagline: "Deployment Platform" },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Tech Stack & Progress Management
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg"
        >
          <FaPlus size={16} />
          Add Technology
        </motion.button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* Tech Stack Items */}
      <div className="grid gap-4">
        {techStacks[activeCategory]?.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/30"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {tech.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tech.tagline}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {tech.progress}%
                </span>
                <div className="flex gap-1">
                  <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg">
                    <FaEdit size={14} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${tech.progress}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>

            {/* Analytics */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FaChartBar size={12} />
              <span>Last updated: 2 days ago</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TechStackManager;
