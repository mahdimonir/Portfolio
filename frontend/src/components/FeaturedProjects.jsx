"use client";

import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";

const FeaturedProjects = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(1); // Default to mobile

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setItemsPerSlide(
          window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1
        );
      }
    };
    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.ceil(projects.length / itemsPerSlide)
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(projects.length / itemsPerSlide)) %
        Math.ceil(projects.length / itemsPerSlide)
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-800/30 dark:to-blue-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Showcase of my favorite projects that demonstrate my skills and
              passion for development
            </p>
          </motion.div>

          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-800 dark:text-white hover:scale-110"
            >
              <FaChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-800 dark:text-white hover:scale-110"
            >
              <FaChevronRight size={20} />
            </button>

            <div className="overflow-hidden rounded-3xl h-[500px]">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({
                  length: Math.ceil(projects.length / itemsPerSlide),
                }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-8 px-4 h-full">
                      {projects
                        .slice(
                          slideIndex * itemsPerSlide,
                          (slideIndex + 1) * itemsPerSlide
                        )
                        .map((project) => (
                          <motion.div
                            key={project.id}
                            className="group relative"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ y: -10 }}
                          >
                            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/30">
                              <div className="relative overflow-hidden h-48">
                                <img
                                  src={project.image}
                                  alt={project.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute top-4 left-4">
                                  <span className="px-3 py-1 bg-blue-600/90 text-white text-sm font-medium rounded-full">
                                    {project.category}
                                  </span>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  {project.github && (
                                    <motion.a
                                      href={project.github}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <FaGithub size={16} />
                                    </motion.a>
                                  )}
                                  <motion.a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <FaExternalLinkAlt size={16} />
                                  </motion.a>
                                </div>
                              </div>
                              <div className="p-6">
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {project.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                                  {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(project.tech) ? (
                                    project.tech.map((tech, index) => (
                                      <div
                                        key={index}
                                        className="p-2 bg-gray-100/80 dark:bg-gray-700/50 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                      >
                                        <tech.icon size={16} />
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-red-500 text-sm">
                                      Invalid tech data
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {Array.from({
                length: Math.ceil(projects.length / itemsPerSlide),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-blue-600 w-6"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-blue-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              View All Projects
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <FaArrowRight />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturedProjects;
