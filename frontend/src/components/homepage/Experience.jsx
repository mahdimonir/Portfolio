"use client";

import { experiences } from "@/data/experiences";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const ModernExperience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section ref={ref} className="min-h-screen section-gradient-bg py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-6 border border-blue-200 dark:border-blue-800"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            ✨ Career Journey
          </motion.span>

          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400">
              Experience
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A timeline of growth, innovation, and impact across different
            companies and technologies
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 transform -translate-x-1/2 hidden md:block" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-12"
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
                onHoverStart={() => setActiveIndex(index)}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-4 border-blue-500 rounded-full transform -translate-x-1/2 z-10 hidden md:block" />

                {/* Content Card */}
                <motion.div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div
                    className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${exp.bgColor} backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-8 shadow-xl`}
                  >
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-30">
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${exp.color} opacity-10`}
                      />
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          background: [
                            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
                            "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
                            "radial-gradient(circle at 40% 80%, rgba(119, 198, 255, 0.3) 0%, transparent 50%)",
                          ],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {exp.role}
                          </h3>
                          <p
                            className={`font-semibold bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}
                          >
                            {exp.company}
                          </p>
                        </div>
                        <motion.div
                          className={`px-3 py-1 bg-gradient-to-r ${exp.color} text-white text-xs font-semibold rounded-full`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {exp.period}
                        </motion.div>
                      </div>

                      {/* Location */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {exp.location}
                      </p>

                      {/* Description */}
                      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Skills */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, idx) => (
                            <motion.span
                              key={idx}
                              className="px-3 py-1 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg backdrop-blur-sm border border-white/30 dark:border-gray-600/30"
                              whileHover={{
                                scale: 1.1,
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                              }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Key Achievements
                        </h4>
                        <div className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <motion.div
                              key={idx}
                              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${exp.color} mr-3 flex-shrink-0`}
                              />
                              {achievement}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-5/12" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ModernExperience;
