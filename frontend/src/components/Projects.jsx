import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub, FaNodeJs, FaReact } from "react-icons/fa";
import {
  SiMongodb,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin interface.",
      image:
        "https://images.unsplash.com/photo-0cfed4f6a45d-1556?w=600&h=400&d=fit",
      tech: [FaReact, FaNodeJs, SiMongodb, SiTailwindcss],
      github: "https://github.com/johndoe/ecommerce",
      demo: "https://ecommerce-demo.vercel.com",
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "Collaborative task management application built with Next.js and TypeScript. Real-time updates and beautiful UI/UX design.",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      tech: [SiNextdotjs, SiTypescript, SiTailwindcss, SiMongodb],
      github: "https://github.com/johndoe/taskapp",
      demo: "https://taskapp-demo.vercel.app",
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description:
        "Modern weather application with location-based forecasts, interactive maps, and responsive design for all devices.",
      image:
        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
      tech: [FaReact, SiTailwindcss, SiTypescript],
      github: "https://github.com/johndoe/weather",
      demo: "https://weather-demo.vercel.app",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills in
            full-stack development
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              whileHover={{ y: -10 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.a
                    href={project.github}
                    className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaGithub size={16} />
                  </motion.a>
                  <motion.a
                    href={project.demo}
                    className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaExternalLinkAlt size={16} />
                  </motion.a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((TechIcon, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-blue-600 dark:text-blue-400"
                    >
                      <TechIcon size={16} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
