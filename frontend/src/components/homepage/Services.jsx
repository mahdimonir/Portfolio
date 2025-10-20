"use client";

import { getDynamicGradient } from "@/hooks/gradient";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaArrowRight, FaCheck, FaCode, FaStar } from "react-icons/fa";
import ConsultationScheduler from "../contacts/ConsultationScheduler";
import QuickContactForm from "../contacts/QuickContactForm";
import { getIconComponent } from "../global/getIconComponent";

const Services = ({ services }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <>
      <section
        ref={ref}
        className="relative py-16 sm:py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.2),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.2),transparent_50%)]"></div>
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-32 right-16 w-32 h-32 bg-purple-500/10 dark:bg-purple-400/20 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-500/10 dark:bg-pink-400/20 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 2 }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-8 shadow-lg backdrop-blur-sm"
              initial={{ scale: 0, rotate: -180 }}
              animate={
                isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
              }
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FaCode />
              </motion.div>
              What I Offer
            </motion.div>

            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-gray-900 dark:text-white">
                Professional
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Services
              </span>
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Comprehensive development solutions to transform your ideas into
              powerful digital experiences that drive results
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {services.map((service, index) => {
              const Icon = getIconComponent(service.icon);
              return (
                <motion.div
                  key={service.id || index}
                  variants={itemVariants}
                  className="group relative"
                  whileHover={{ y: -15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="relative h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 dark:to-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${getDynamicGradient(
                        index
                      )} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`}
                    ></div>
                    <motion.div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${getDynamicGradient(
                        index
                      )} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-sm`}
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className={`relative w-16 h-16 bg-gradient-to-r ${getDynamicGradient(
                        index
                      )} rounded-2xl flex items-center justify-center mb-6 shadow-lg ring-4 ring-white/50 dark:ring-gray-700/50`}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Icon className="text-white" size={24} />
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-2xl"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    <div className="relative z-10">
                      <motion.h3
                        className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {service.title || "Unknown Service"}
                      </motion.h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {service.description || "No description available"}
                      </p>
                      <ul className="space-y-3 mb-6">
                        {service.features?.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={
                              isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -20 }
                            }
                            transition={{ delay: 0.5 + featureIndex * 0.1 }}
                            whileHover={{ x: 5 }}
                          >
                            <motion.div
                              className={`w-5 h-5 bg-gradient-to-r ${getDynamicGradient(
                                index
                              )} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FaCheck className="text-white" size={10} />
                            </motion.div>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <motion.div
                        className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <FaStar className="text-yellow-500" size={10} />
                        <span>Premium Quality</span>
                      </motion.div>
                    </div>
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getDynamicGradient(
                        index
                      )} rounded-b-3xl`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 rounded-3xl p-1 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
              <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.3),transparent_50%)]"></div>
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-40"
                  animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-60"
                  animate={{
                    y: [0, -15, 0],
                    x: [0, 10, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
                <motion.div
                  className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50"
                  animate={{ y: [0, -12, 0], opacity: [0.5, 0.9, 0.5] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                />
              </div>
              <div className="relative bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl p-8 sm:p-10 lg:p-12 text-white">
                <div className="max-w-4xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.8, delay: 1 }}
                  >
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                      Ready to Start Your Project?
                    </h3>
                  </motion.div>
                  <motion.p
                    className="text-lg sm:text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed text-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    Let's discuss your ideas and create something amazing
                    together. Get a free consultation today.
                  </motion.p>
                  <motion.div
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.8, delay: 1.4 }}
                  >
                    <motion.button
                      onClick={() => setIsContactFormOpen(true)}
                      className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center justify-center gap-3">
                        <span className="text-lg">Get In Touch</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FaArrowRight size={16} />
                        </motion.div>
                      </span>
                    </motion.button>
                    <motion.button
                      onClick={() => setIsSchedulerOpen(true)}
                      className="group relative w-full sm:w-auto px-8 py-4 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white rounded-2xl font-semibold border-2 border-blue-600/50 hover:bg-blue-50/90 dark:hover:bg-gray-700/90 transition-all duration-300 shadow-lg hover:shadow-2xl backdrop-blur-sm"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative flex items-center justify-center gap-3">
                        <span className="text-lg">Schedule a Call</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FaArrowRight size={16} />
                        </motion.div>
                      </span>
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <QuickContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
      <ConsultationScheduler
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />
    </>
  );
};

export default Services;
