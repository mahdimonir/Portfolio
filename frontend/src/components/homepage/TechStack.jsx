"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaServer } from "react-icons/fa";
import { getIconComponent } from "../global/getIconComponent";

const TechStack = ({ techStacks }) => {
  const [hoveredTech, setHoveredTech] = useState(null);
  const [slideIndexes, setSlideIndexes] = useState({});

  const ITEMS_PER_SLIDE = 4;
  const getSlideCount = (techCount) => Math.ceil(techCount / ITEMS_PER_SLIDE);

  const nextSlide = (category) => {
    setSlideIndexes((prev) => ({
      ...prev,
      [category]:
        (prev[category] || 0) + 1 >=
        getSlideCount(
          techStacks.find((c) => c.category === category).technologies.length
        )
          ? 0
          : (prev[category] || 0) + 1,
    }));
  };

  const prevSlide = (category) => {
    setSlideIndexes((prev) => ({
      ...prev,
      [category]:
        (prev[category] || 0) - 1 < 0
          ? getSlideCount(
              techStacks.find((c) => c.category === category).technologies
                .length
            ) - 1
          : (prev[category] || 0) - 1,
    }));
  };

  return (
    <section className="py-16 md:py-20 px-4 section-gradient-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
          >
            <FaServer />
            Technology Stack
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Technologies I Use
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Modern tools and technologies for building exceptional digital
            experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techStacks.map((category, categoryIndex) => {
            const slideCount = getSlideCount(category.technologies.length);
            const currentSlide = slideIndexes[category.category] || 0;
            const displayedTechnologies = category.technologies.slice(
              currentSlide * ITEMS_PER_SLIDE,
              (currentSlide + 1) * ITEMS_PER_SLIDE
            );

            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
              >
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${category.color} text-white rounded-xl font-semibold mb-6`}
                >
                  {category.category}
                </div>

                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    {displayedTechnologies.map((tech, index) => {
                      const Icon = getIconComponent(tech.icon);
                      return (
                        <motion.div
                          key={tech.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          onMouseEnter={() =>
                            setHoveredTech(`${category.category}-${tech.name}`)
                          }
                          onMouseLeave={() => setHoveredTech(null)}
                          className="relative group cursor-pointer"
                        >
                          <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50/20 dark:bg-gray-500/20 hover:bg-white dark:hover:bg-gray-700/50 transition-all duration-300 shadow hover:shadow-lg hover:scale-105">
                            <Icon
                              size={32}
                              className={`${tech.color} mb-3 group-hover:scale-110 transition-transform duration-300`}
                            />
                            <span className="text-sm font-semibold text-gray-800 dark:text-white text-center">
                              {tech.name}
                            </span>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{
                                opacity:
                                  hoveredTech ===
                                  `${category.category}-${tech.name}`
                                    ? 1
                                    : 0,
                                y:
                                  hoveredTech ===
                                  `${category.category}-${tech.name}`
                                    ? 0
                                    : 10,
                              }}
                              transition={{ duration: 0.2 }}
                              className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 pointer-events-none"
                            >
                              {tech.tagline}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-white"></div>
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  {category.technologies.length > ITEMS_PER_SLIDE && (
                    <div className="flex justify-between items-center mt-4">
                      <motion.button
                        onClick={() => prevSlide(category.category)}
                        className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 dark:text-white"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaChevronLeft size={16} />
                      </motion.button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {currentSlide + 1} / {slideCount}
                      </span>
                      <motion.button
                        onClick={() => nextSlide(category.category)}
                        className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 dark:text-white"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaChevronRight size={16} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
