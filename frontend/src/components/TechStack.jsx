"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaAws, FaGitAlt, FaNodeJs, FaPython, FaReact } from "react-icons/fa";
import {
  SiAngular,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiFlutter,
  SiGraphql,
  SiJavascript,
  SiKubernetes,
  SiMongodb,
  SiNextdotjs,
  SiPostgresql,
  SiRedis,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";

const TechStack = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const technologies = [
    {
      name: "JavaScript",
      icon: SiJavascript,
      color: "text-yellow-500",
      level: 95,
      category: "languages",
    },
    {
      name: "TypeScript",
      icon: SiTypescript,
      color: "text-blue-600",
      level: 90,
      category: "languages",
    },
    {
      name: "Python",
      icon: FaPython,
      color: "text-green-500",
      level: 85,
      category: "languages",
    },
    {
      name: "React",
      icon: FaReact,
      color: "text-blue-500",
      level: 95,
      category: "frontend",
    },
    {
      name: "Next.js",
      icon: SiNextdotjs,
      color: "text-gray-800 dark:text-white",
      level: 90,
      category: "frontend",
    },
    {
      name: "Vue.js",
      icon: SiVuedotjs,
      color: "text-green-500",
      level: 80,
      category: "frontend",
    },
    {
      name: "Angular",
      icon: SiAngular,
      color: "text-red-600",
      level: 75,
      category: "frontend",
    },
    {
      name: "Svelte",
      icon: SiSvelte,
      color: "text-orange-500",
      level: 70,
      category: "frontend",
    },
    {
      name: "Node.js",
      icon: FaNodeJs,
      color: "text-green-500",
      level: 90,
      category: "backend",
    },
    {
      name: "Express",
      icon: SiExpress,
      color: "text-gray-600",
      level: 88,
      category: "backend",
    },
    {
      name: "GraphQL",
      icon: SiGraphql,
      color: "text-pink-500",
      level: 82,
      category: "backend",
    },
    {
      name: "MongoDB",
      icon: SiMongodb,
      color: "text-green-600",
      level: 88,
      category: "databases",
    },
    {
      name: "PostgreSQL",
      icon: SiPostgresql,
      color: "text-blue-700",
      level: 85,
      category: "databases",
    },
    {
      name: "Redis",
      icon: SiRedis,
      color: "text-red-500",
      level: 80,
      category: "databases",
    },
    {
      name: "Firebase",
      icon: SiFirebase,
      color: "text-yellow-500",
      level: 85,
      category: "databases",
    },
    {
      name: "Tailwind CSS",
      icon: SiTailwindcss,
      color: "text-cyan-500",
      level: 95,
      category: "styling",
    },
    {
      name: "Git",
      icon: FaGitAlt,
      color: "text-orange-500",
      level: 90,
      category: "tools",
    },
    {
      name: "Docker",
      icon: SiDocker,
      color: "text-blue-500",
      level: 80,
      category: "tools",
    },
    {
      name: "Kubernetes",
      icon: SiKubernetes,
      color: "text-blue-700",
      level: 75,
      category: "tools",
    },
    {
      name: "AWS",
      icon: FaAws,
      color: "text-orange-400",
      level: 78,
      category: "tools",
    },
    {
      name: "React Native",
      icon: FaReact,
      color: "text-blue-500",
      level: 85,
      category: "mobile",
    },
    {
      name: "Flutter",
      icon: SiFlutter,
      color: "text-blue-400",
      level: 70,
      category: "mobile",
    },
  ];

  const categories = [
    { id: "all", name: "All", icon: "🚀" },
    { id: "languages", name: "Languages", icon: "💻" },
    { id: "frontend", name: "Frontend", icon: "🎨" },
    { id: "backend", name: "Backend", icon: "⚙️" },
    { id: "databases", name: "Databases", icon: "🗄️" },
    { id: "styling", name: "Styling", icon: "✨" },
    { id: "tools", name: "Tools & DevOps", icon: "🔧" },
    { id: "mobile", name: "Mobile", icon: "📱" },
  ];

  const filteredTechnologies =
    activeCategory === "all"
      ? technologies
      : technologies.filter((tech) => tech.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section
      id="tech"
      className="py-20 px-4 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-800/30 dark:to-blue-900/30"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tech Stack & Skills
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Technologies and tools I use to build amazing digital experiences
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700/70 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
              whileHover={{
                scale: activeCategory === category.id ? 1.05 : 1.02,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm">{category.icon}</span>
              <span className="text-sm">{category.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Technologies Grid */}
        <motion.div
          key={activeCategory} // Re-animate when category changes
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTechnologies.map(({ name, icon: Icon, color, level }) => (
            <motion.div
              key={name}
              variants={itemVariants}
              className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/30"
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Tech Icon */}
              <div className="text-center mb-4">
                <motion.div
                  className={`text-5xl ${color} mx-auto group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon />
                </motion.div>
              </div>

              {/* Tech Name */}
              <h3 className="text-center font-semibold text-gray-800 dark:text-white mb-4 text-sm">
                {name}
              </h3>

              {/* Skill Level */}
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Proficiency
                  </span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {level}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${level}%` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse delay-150" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              5+
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Years Experience
            </div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              50+
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Projects Completed
            </div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {technologies.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Technologies
            </div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30 text-center">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
              24/7
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Learning Mode
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
