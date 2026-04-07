"use client";

import { getIconComponent } from "@/components/global/getIconComponent";
import { getDynamicGradient } from "@/hooks/gradient";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const FeaturedProjects = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [isClient, setIsClient] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredTech, setHoveredTech] = useState(null);
  const intervalRef = useRef(null);
  const autoPlayTimeoutRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isAutoPlaying || projects.length === 0) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 3500);

    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, projects.length]);

  useEffect(() => {
    return () => {
      clearTimeout(autoPlayTimeoutRef.current);
    };
  }, []);

  const settings = useMemo(() => {
    if (windowWidth < 640) {
      return {
        cardWidth: 280,
        cardHeight: 420,
        visibleCards: 1,
        spacing: 30,
        sideOffset: 180,
        sideScale: 0.7,
        sideRotate: 35,
      };
    } else if (windowWidth < 1024) {
      return {
        cardWidth: 340,
        cardHeight: 480,
        visibleCards: 3,
        spacing: 50,
        sideOffset: 200,
        sideScale: 0.8,
        sideRotate: 20,
      };
    } else {
      return {
        cardWidth: 400,
        cardHeight: 540,
        visibleCards: 5,
        spacing: 70,
        sideOffset: 280,
        sideScale: 0.75,
        sideRotate: 25,
      };
    }
  }, [windowWidth]);

  const getCardStyle = useCallback(
    (index) => {
      const totalCards = projects.length;
      let position = index - currentIndex;

      if (position > totalCards / 2) {
        position -= totalCards;
      } else if (position < -totalCards / 2) {
        position += totalCards;
      }

      const isMobile = windowWidth < 640;

      if (position === 0) {
        return {
          x: 0,
          y: 0,
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          zIndex: 30,
          opacity: 1,
        };
      }

      const absPosition = Math.abs(position);
      const side = position > 0 ? 1 : -1;

      if (absPosition === 1) {
        return {
          x: side * settings.sideOffset,
          y: isMobile ? 20 : 0,
          scale: settings.sideScale,
          rotateY: -side * settings.sideRotate,
          rotateX: isMobile ? 15 : 0,
          zIndex: isMobile ? 5 : 15,
          opacity: isMobile ? 0.6 : 0.85,
        };
      } else if (absPosition === 2) {
        return {
          x: side * (settings.sideOffset + (isMobile ? 120 : 80)),
          y: isMobile ? 40 : 5,
          scale: settings.sideScale - (isMobile ? 0.15 : 0.08),
          rotateY: -side * (settings.sideRotate + (isMobile ? 20 : 10)),
          rotateX: isMobile ? 25 : 3,
          zIndex: isMobile ? 3 : 10,
          opacity: isMobile ? 0.4 : 0.7,
        };
      } else {
        return {
          x: side * (settings.sideOffset + (isMobile ? 200 : 160)),
          y: isMobile ? 60 : 10,
          scale: isMobile ? 0.4 : 0.6,
          rotateY: -side * (isMobile ? 70 : 50),
          rotateX: isMobile ? 35 : 8,
          zIndex: 1,
          opacity: isMobile ? 0.2 : 0.3,
        };
      }
    },
    [currentIndex, settings, projects.length, windowWidth]
  );

  const pauseAutoPlayTemporarily = useCallback(() => {
    setIsAutoPlaying(false);
    clearTimeout(autoPlayTimeoutRef.current);
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsDragging(false);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
    const distance = Math.abs(touchStartX.current - touchEndX.current);
    if (distance > 10) {
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !isDragging) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextProject();
    } else if (isRightSwipe) {
      prevProject();
    }

    setIsDragging(false);
  };

  const handleCardClick = useCallback(
    (index, e) => {
      if (isDragging) return;
      if (e.target.closest("button") && index === currentIndex) {
        return;
      }
      if (index !== currentIndex) {
        setCurrentIndex(index);
        pauseAutoPlayTemporarily();
      }
    },
    [isDragging, currentIndex, pauseAutoPlayTemporarily]
  );

  const handleViewDetails = useCallback(
    (projectName, e) => {
      e.stopPropagation();
      pauseAutoPlayTemporarily();
      router.push(`/projects/${projectName}`);
    },
    [router, pauseAutoPlayTemporarily]
  );

  const nextProject = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    pauseAutoPlayTemporarily();
  }, [projects.length, pauseAutoPlayTemporarily]);

  const prevProject = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    pauseAutoPlayTemporarily();
  }, [projects.length, pauseAutoPlayTemporarily]);

  const goToSlide = useCallback(
    (index) => {
      setCurrentIndex(index);
      pauseAutoPlayTemporarily();
    },
    [pauseAutoPlayTemporarily]
  );

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => {
      const newState = !prev;
      clearTimeout(autoPlayTimeoutRef.current);
      return newState;
    });
  }, []);

  if (!isClient || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 px-4 section-gradient-bg overflow-hidden relative min-h-screen flex items-center">
      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm text-blue-600 dark:text-blue-200 rounded-full text-sm font-semibold mb-6 md:mb-8 border border-blue-500/20"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Featured Projects
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Latest Work
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Showcasing innovative solutions with cutting-edge technology
          </motion.p>
        </motion.div>

        {/* 3D Carousel */}
        <div
          className="relative w-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative flex items-center justify-center"
            style={{
              height: `${settings.cardHeight + 80}px`,
              perspective: windowWidth < 640 ? "800px" : "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <AnimatePresence>
              {projects.map((project, index) => {
                const style = getCardStyle(index);
                const isCenter = index === currentIndex;
                const dynamicGradient = getDynamicGradient(index);

                return (
                  <motion.div
                    key={project.id}
                    className={`absolute will-change-transform ${
                      isCenter ? "" : "cursor-pointer"
                    }`}
                    style={{
                      width: `${settings.cardWidth}px`,
                      height: `${settings.cardHeight}px`,
                      transformStyle: "preserve-3d",
                      zIndex: style.zIndex,
                    }}
                    animate={{
                      x: style.x,
                      y: style.y,
                      scale: style.scale,
                      rotateY: style.rotateY,
                      rotateX: style.rotateX,
                      opacity: style.opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 25,
                      mass: 0.8,
                    }}
                    onClick={(e) => handleCardClick(index, e)}
                    whileHover={
                      isCenter
                        ? {
                            scale: 1.02,
                            rotateX: -2,
                            transition: { duration: 0.2 },
                          }
                        : {
                            scale: style.scale * 1.05,
                            transition: { duration: 0.2 },
                          }
                    }
                  >
                    <div className="relative h-full bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300">
                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${dynamicGradient} opacity-5`}
                      />

                      {/* Project Image */}
                      <div className="relative h-40 md:h-52 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-3 py-1 text-white text-xs font-medium rounded-full backdrop-blur-md border ${
                              project.status === "Completed"
                                ? "bg-emerald-500/80 border-emerald-400/50"
                                : "bg-blue-500/80 border-blue-400/50"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>

                        {/* Action Links */}
                        {isCenter && (
                          <div className="absolute top-3 right-3 flex gap-2">
                            {project.github && (
                              <motion.a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-900/60 backdrop-blur-md text-white rounded-full hover:bg-slate-900/80 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  pauseAutoPlayTemporarily();
                                }}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                              </motion.a>
                            )}
                            {project.demo && (
                              <motion.a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-blue-600/80 backdrop-blur-md text-white rounded-full hover:bg-blue-600/90 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  pauseAutoPlayTemporarily();
                                }}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </motion.a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 md:p-6 flex flex-col h-[calc(100%-10rem)] md:h-[calc(100%-13rem)]">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                          {project.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-4 flex-1 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex justify-center flex-wrap gap-2 mb-4 relative">
                          {Array.isArray(project.tech) &&
                          project.tech.length > 0 ? (
                            <>
                              {project.tech
                                .slice(0, 4)
                                .map((tech, techIndex) => {
                                  const Icon = getIconComponent(tech.icon);
                                  return (
                                    <motion.div
                                      key={techIndex}
                                      className="relative p-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full border border-blue-500/20 transition-all duration-200 cursor-pointer"
                                      onMouseEnter={() =>
                                        setHoveredTech(`${index}-${techIndex}`)
                                      }
                                      onMouseLeave={() => setHoveredTech(null)}
                                      whileHover={{ scale: 1.1 }}
                                    >
                                      <Icon size={16} />
                                      {hoveredTech ===
                                        `${index}-${techIndex}` && (
                                        <motion.div
                                          initial={{
                                            opacity: 0,
                                            y: -10,
                                            scale: 0.8,
                                          }}
                                          animate={{
                                            opacity: 1,
                                            y: -12,
                                            scale: 1,
                                          }}
                                          exit={{
                                            opacity: 0,
                                            y: -10,
                                            scale: 0.8,
                                          }}
                                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg border border-slate-600 whitespace-nowrap z-50"
                                        >
                                          {tech.name}
                                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                                        </motion.div>
                                      )}
                                    </motion.div>
                                  );
                                })}
                              {project.tech.length > 4 && (
                                <motion.div
                                  className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-slate-600/20 to-slate-500/20 text-slate-400 text-xs rounded-full font-medium border border-slate-500/20"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  +{project.tech.length - 4}
                                </motion.div>
                              )}
                            </>
                          ) : (
                            <p className="text-red-500 text-sm">
                              Invalid tech data
                            </p>
                          )}
                        </div>

                        {/* CTA Button */}
                        {isCenter && (
                          <motion.button
                            className={`w-full py-3 px-6 bg-gradient-to-r ${dynamicGradient} text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer relative z-10`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => handleViewDetails(project.name, e)}
                          >
                            View Details
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            onClick={prevProject}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-slate-800/80 backdrop-blur-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-white z-30 border border-slate-700/50 hover:border-slate-600/70"
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            disabled={projects.length <= 1}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          <motion.button
            onClick={nextProject}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-slate-800/80 backdrop-blur-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-white z-30 border border-slate-700/50 hover:border-slate-600/70"
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
            disabled={projects.length <= 1}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 md:mt-8 gap-3">
          {projects.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 md:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? `bg-gradient-to-r ${getDynamicGradient(
                      index
                    )} w-8 md:w-12 shadow-lg`
                  : "bg-slate-600 hover:bg-slate-500 w-2 md:w-3"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <div className="text-center mt-8">
          <motion.button
            onClick={toggleAutoPlay}
            className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-xl border ${
              isAutoPlaying
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAutoPlaying ? "Auto-play On" : "Auto-play Off"}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
