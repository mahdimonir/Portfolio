"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaBriefcase, FaGraduationCap, FaBookOpen, FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt, FaHistory } from "react-icons/fa";
import { getBackgroundGradient, getDynamicGradient } from "@/hooks/gradient";

const MyJourney = ({ experiences = [], education = [], courses = [] }) => {
  const [activeTab, setActiveTab] = useState("experience");

  const tabs = [
    { id: "experience", label: "Experience", icon: FaBriefcase },
    { id: "education", label: "Education", icon: FaGraduationCap },
    { id: "courses", label: "Courses", icon: FaBookOpen },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const renderTimelineItems = (items) => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
      {items.map((item, index) => {
        const periodText = item.period?.from 
          ? `${item.period.from} - ${item.period.to || "Present"}`
          : typeof item.period === "string" ? item.period : "Unknown Period";

        const title = item.role || item.degree || item.title;
        const subtitle = item.company || item.institution || item.issuer;

        return (
          <motion.div
            key={item._id || item.id || index}
            variants={itemVariants}
            className="group relative pl-8 md:pl-0"
          >
            {/* Timeline Line (Desktop Only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 to-blue-500/50 -translate-x-1/2 -z-10" />
            
            <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
              {/* Dot */}
              <div className={`absolute left-0 md:left-1/2 w-5 h-5 rounded-full bg-white dark:bg-gray-900 border-4 ${index % 2 === 0 ? "border-purple-500" : "border-blue-500"} shadow-[0_0_15px_rgba(168,85,247,0.5)] z-20 -translate-x-1/2 top-4 md:top-1/2 md:-translate-y-1/2 group-hover:scale-125 transition-transform duration-300`} />
              
              {/* Card */}
              <motion.div 
                className="w-full md:w-[45%]"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br ${getBackgroundGradient(index)} backdrop-blur-md border border-white/20 dark:border-gray-800/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500`}>
                  
                  {/* Animated Background Pattern (Restored from Experience.jsx) */}
                  <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className={`absolute inset-0 bg-gradient-to-r ${getDynamicGradient(index)} opacity-5`} />
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: [
                          "radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
                          "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
                          "radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
                        ],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <motion.span 
                        className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${getDynamicGradient(index)} text-white text-[10px] font-black uppercase tracking-widest shadow-lg`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {periodText}
                      </motion.span>
                      {item.location && (
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-gray-100/50 dark:bg-gray-800/50 px-3 py-1 rounded-lg">
                          <FaMapMarkerAlt className="text-purple-500" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2 leading-tight">
                      {title}
                    </h3>
                    <h4 className={`text-lg font-bold bg-gradient-to-r ${getDynamicGradient(index)} bg-clip-text text-transparent mb-6 uppercase tracking-wider`}>
                      {subtitle}
                    </h4>
                    
                    {item.description && (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 italic text-sm md:text-base border-l-2 border-purple-500/30 pl-4">
                        "{item.description}"
                      </p>
                    )}

                    {/* Technologies/Skills */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Technologies</h5>
                        <div className="flex flex-wrap gap-2">
                          {item.skills.map((skill, i) => (
                            <motion.span 
                              key={i} 
                              className="px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm shadow-sm"
                              whileHover={{ scale: 1.1, y: -2 }}
                            >
                              {typeof skill === "object" ? (skill.name || skill.title) : skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Achievements */}
                    {item.achievements && item.achievements.length > 0 && (
                      <div>
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Highlights</h5>
                        <ul className="space-y-3">
                          {item.achievements.map((ach, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-start gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${getDynamicGradient(index)} mt-1.5 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.4)]`} />
                              <span>{ach}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Link for Courses */}
                    {item.link && (
                      <div className="mt-8 flex justify-end">
                        <motion.a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-gradient-to-r ${getDynamicGradient(index)} text-white hover:shadow-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest group/link`}
                          whileHover={{ scale: 1.05, x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Verify Credential
                          <FaExternalLinkAlt size={12} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                        </motion.a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Spacer Content for Desktop */}
              <div className="hidden md:block w-[45%]" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );

  return (
    <section id="journey" className="relative py-16 px-4 bg-white dark:bg-gray-950 font-inter overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm border border-blue-500/20"
            initial={{ scale: 0, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
          >
            <FaHistory className="text-xs" />
            Evolution & Growth
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A timeline of my professional experience, education, and continuous learning
          </p>
        </motion.div>

        {/* Custom Tabs */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? "text-white shadow-xl shadow-blue-500/20"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={isActive ? "text-white" : "text-blue-500"} size={18} />
                <span className="tracking-wide">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {activeTab === "experience" && renderTimelineItems(experiences)}
              {activeTab === "education" && renderTimelineItems(education)}
              {activeTab === "courses" && renderTimelineItems(courses)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default MyJourney;
