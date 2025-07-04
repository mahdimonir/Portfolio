"use client";

import { User } from "@/data/user";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Hero = () => {
  // Dynamic tagline words
  const taglineWords = [
    "Developer",
    "Designer",
    "Creator",
    "Innovator",
    "Problem Solver",
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % taglineWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="min-h-screen section-gradient-bg flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
      <motion.div
        className="max-w-4xl w-full mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative inline-block">
            {/* Avatar container with fixed positioning */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mx-auto">
              {/* Main avatar */}
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/70 dark:border-gray-700/70 shadow-2xl relative z-20 bg-white dark:bg-gray-800">
                <Image
                  src={User.avatar}
                  alt={`${User.fullName}'s profile picture`}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              {/* Background glow - properly positioned */}
              <motion.div
                className="absolute -inset-6 rounded-full opacity-30 z-10"
                style={{
                  background:
                    "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                  filter: "blur(20px)",
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
        >
          {User.fullName}
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 font-medium"
        >
          {/* Split tagline to make last word dynamic */}
          {User.tagLine.includes(" ") ? (
            <>
              {User.tagLine.split(" ").slice(0, -1).join(" ")}{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold"
                >
                  {taglineWords[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </>
          ) : (
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWordIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold"
              >
                {taglineWords[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          )}
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed px-4"
        >
          {User.about}
        </motion.p>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center flex-wrap gap-4 mb-8"
        >
          {[
            {
              icon: FaGithub,
              href: User.socialLinks.github,
              label: "GitHub",
              color: "hover:text-gray-900 dark:hover:text-white",
            },
            {
              icon: FaLinkedin,
              href: User.socialLinks.linkedin,
              label: "LinkedIn",
              color: "hover:text-blue-600",
            },
            {
              icon: FaTwitter,
              href: User.socialLinks.twitter,
              label: "Twitter",
              color: "hover:text-blue-400",
            },
            {
              icon: FaEnvelope,
              href: `mailto:${User.socialLinks.email}`,
              label: "Email",
              color: "hover:text-red-500",
            },
          ].map(({ icon: Icon, href, label, color }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 text-gray-600 dark:text-gray-300 ${color} border border-gray-200/50 dark:border-gray-700/50`}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Visit my ${label}`}
            >
              <Icon size={20} className="sm:w-6 sm:h-6" />
            </motion.a>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center px-4"
        >
          <motion.a
            href="/projects"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">View My Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-800 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.a>

          <motion.a
            href={User.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white rounded-2xl font-semibold border-2 border-blue-600/50 hover:bg-blue-50/90 dark:hover:bg-gray-700/90 transition-all duration-300 shadow-lg hover:shadow-2xl backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaDownload size={16} />
            <span>Download CV</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
