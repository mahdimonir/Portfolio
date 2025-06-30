"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FaArrowRight,
  FaCheck,
  FaCloud,
  FaCode,
  FaDatabase,
  FaDesktop,
  FaMobile,
  FaServer,
} from "react-icons/fa";

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const services = [
    {
      id: 1,
      icon: FaCode,
      title: "Full-Stack Development",
      description:
        "End-to-end web application development with modern technologies and scalable architecture.",
      features: [
        "React & Next.js",
        "Node.js & Express",
        "Database Design",
        "API Development",
      ],
      color: "blue",
      bgGradient: "from-blue-500 to-cyan-500",
      pricing: "From $150/hr",
    },
    {
      id: 2,
      icon: FaDesktop,
      title: "Frontend Development",
      description:
        "Beautiful, responsive user interfaces with seamless user experience and modern design.",
      features: [
        "React & Vue.js",
        "Responsive Design",
        "Performance Optimization",
        "UI/UX Implementation",
      ],
      color: "purple",
      bgGradient: "from-purple-500 to-pink-500",
      pricing: "From $120/hr",
    },
    {
      id: 3,
      icon: FaServer,
      title: "Backend Development",
      description:
        "Robust server-side solutions with secure APIs and optimized performance.",
      features: [
        "RESTful APIs",
        "Authentication",
        "Database Management",
        "Security Implementation",
      ],
      color: "green",
      bgGradient: "from-green-500 to-emerald-500",
      pricing: "From $130/hr",
    },
    {
      id: 4,
      icon: FaMobile,
      title: "Mobile Development",
      description:
        "Cross-platform mobile applications with native performance and modern UI.",
      features: [
        "React Native",
        "Flutter",
        "iOS & Android",
        "App Store Deployment",
      ],
      color: "orange",
      bgGradient: "from-orange-500 to-red-500",
      pricing: "From $140/hr",
    },
    {
      id: 5,
      icon: FaCloud,
      title: "Cloud Solutions",
      description:
        "Scalable cloud infrastructure and deployment solutions for modern applications.",
      features: [
        "AWS & Azure",
        "DevOps",
        "CI/CD Pipeline",
        "Monitoring & Analytics",
      ],
      color: "indigo",
      bgGradient: "from-indigo-500 to-blue-500",
      pricing: "From $160/hr",
    },
    {
      id: 6,
      icon: FaDatabase,
      title: "Database Solutions",
      description:
        "Efficient data management with optimized queries and reliable storage systems.",
      features: [
        "SQL & NoSQL",
        "Data Modeling",
        "Query Optimization",
        "Backup Systems",
      ],
      color: "teal",
      bgGradient: "from-teal-500 to-cyan-500",
      pricing: "From $110/hr",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-blue-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-6"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaCode />
            What I Offer
          </motion.div>

          <h2 className="text-4xl sm:text-6xl font-bold mb-6">
            Professional
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Comprehensive development solutions to transform your ideas into
            powerful digital experiences
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="group relative"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Background Gradient Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                {/* Icon */}
                <motion.div
                  className={`relative w-16 h-16 bg-gradient-to-r ${service.bgGradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <service.icon className="text-white" size={24} />
                </motion.div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          isInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        transition={{ delay: 0.3 + featureIndex * 0.1 }}
                      >
                        <div
                          className={`w-5 h-5 bg-gradient-to-r ${service.bgGradient} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
                        >
                          <FaCheck className="text-white" size={10} />
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Pricing & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Starting
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {service.pricing}
                      </p>
                    </div>

                    <motion.button
                      className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${service.bgGradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm">Get Started</span>
                      <FaArrowRight size={12} />
                    </motion.button>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.bgGradient}`}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss your ideas and create something amazing together.
              Get a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Consultation
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Portfolio
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
