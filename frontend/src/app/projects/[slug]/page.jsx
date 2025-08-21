"use client";

import { getIconComponent } from "@/components/global/getIconComponent";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import axiosInstance from "@/lib/axios";
import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaExternalLinkAlt,
  FaGithub,
  FaProjectDiagram,
} from "react-icons/fa";
import { toast } from "sonner";

const Page = ({ params }) => {
  const { slug } = React.use(params);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/projects/${slug}`);
        const projectData = response.data.data;
        console.log("project data :", projectData);
        if (!projectData) {
          throw new Error("Project not found");
        }

        setProject({
          ...projectData,
          id: projectData._id,
          tech: Array.isArray(projectData.tech)
            ? projectData.tech.map((techItem) => ({
                name: techItem.name || "Unknown",
                icon: getIconComponent(techItem.icon || "FaQuestionCircle"),
                color: techItem.color || "text-gray-500",
              }))
            : [],
          category: projectData.category?.category || "Uncategorized",
          image: projectData.image || "/fallback-image.png",
          images: Array.isArray(projectData.images)
            ? projectData.images.map((img) => img.url)
            : [],
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch project");
        toast.error(error.response?.data?.message || "Failed to fetch project");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading Project..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20">
        <ErrorState
          title="Failed to load Project"
          description="There was a problem connecting to our servers. Please check your connection and try again."
          onRetry={() => window.location.reload()}
          error={error || "The project you're looking for doesn't exist."}
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20">
        <EmptyState
          icon={FaProjectDiagram}
          title="Project not found"
          description="Looks like this project is not available at the moment. Check back later!"
          action={
            <Link
              href="/projects"
              className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
            >
              Back to Projects
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <div className="relative">
        <main className="pb-20 pt-8">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <FaArrowLeft />
                Back to Projects
              </Link>
            </motion.div>

            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                  {project.category}
                </span>
                <span className="px-4 py-2 bg-green-600/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                  {project.status}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {project.title}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-4">
                {project.github && (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-full hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaGithub />
                    View Code
                  </motion.a>
                )}
                <motion.a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaExternalLinkAlt />
                  Live Demo
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              className="mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 md:h-96 object-cover rounded-3xl shadow-2xl"
              />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Technologies Used
                </h3>
                <div className="space-y-3">
                  {Array.isArray(project.tech) && project.tech.length > 0 ? (
                    project.tech.map((tech, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {tech.icon ? (
                          <tech.icon className={`${tech.color} text-xl`} />
                        ) : (
                          <FaGithub className="text-gray-500 text-xl" />
                        )}
                        <span className="text-gray-700 dark:text-gray-300">
                          {tech.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-red-500 text-sm">
                      No technologies listed
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Project Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Duration:
                    </span>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.duration}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Role:
                    </span>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.role}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Status:
                    </span>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.status}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {project.features.slice(0, 4).map((feature, index) => (
                    <li
                      key={index}
                      className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2"
                    >
                      <span className="text-blue-500 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/20 dark:border-gray-700/30 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                About This Project
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {project.longDescription}
              </p>

              <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                All Features
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-2xl"
                >
                  <img
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
