"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";

const SectionVisibilityManager = () => {
  const [sectionVisibility, setSectionVisibility] = useState({
    services: true,
    experience: true,
    testimonials: true,
    github: true,
  });

  const sections = [
    {
      key: "services",
      label: "Services Section",
      description: "Display services offered",
    },
    {
      key: "experience",
      label: "Experience Section",
      description: "Show professional experience",
    },
    {
      key: "testimonials",
      label: "Testimonials Section",
      description: "Client testimonials and reviews",
    },
    {
      key: "github",
      label: "GitHub Calendar",
      description: "GitHub contribution calendar",
    },
  ];

  useEffect(() => {
    const savedVisibility = localStorage.getItem("sectionVisibility");
    if (savedVisibility) {
      setSectionVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  const toggleSection = (sectionKey) => {
    const newVisibility = {
      ...sectionVisibility,
      [sectionKey]: !sectionVisibility[sectionKey],
    };
    setSectionVisibility(newVisibility);
    localStorage.setItem("sectionVisibility", JSON.stringify(newVisibility));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FaHome className="text-blue-500" />
          Homepage Sections
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Control which sections appear on your homepage
        </div>
      </div>

      <div className="grid gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.key}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {section.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {section.description}
                </p>
              </div>

              <motion.button
                onClick={() => toggleSection(section.key)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                  sectionVisibility[section.key]
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sectionVisibility[section.key] ? (
                  <>
                    <FaEye size={18} />
                    Visible
                  </>
                ) : (
                  <>
                    <FaEyeSlash size={18} />
                    Hidden
                  </>
                )}
              </motion.button>
            </div>

            {/* Preview Status */}
            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    sectionVisibility[section.key]
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Status:{" "}
                  {sectionVisibility[section.key]
                    ? "Active on homepage"
                    : "Hidden from homepage"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex gap-4">
          <motion.button
            onClick={() => {
              const allVisible = {
                services: true,
                experience: true,
                testimonials: true,
                github: true,
              };
              setSectionVisibility(allVisible);
              localStorage.setItem(
                "sectionVisibility",
                JSON.stringify(allVisible)
              );
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Show All
          </motion.button>

          <motion.button
            onClick={() => {
              const allHidden = {
                services: false,
                experience: false,
                testimonials: false,
                github: false,
              };
              setSectionVisibility(allHidden);
              localStorage.setItem(
                "sectionVisibility",
                JSON.stringify(allHidden)
              );
            }}
            className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hide All
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionVisibilityManager;
