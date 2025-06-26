"use client";

import { blogs } from "@/data/blogs";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaTag,
} from "react-icons/fa";

const PopularBlogs = () => {
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

  const popularBlogs = blogs;

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.ceil(popularBlogs.length / itemsPerSlide)
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(popularBlogs.length / itemsPerSlide)) %
        Math.ceil(popularBlogs.length / itemsPerSlide)
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Popular Blog Posts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Most read articles about web development, programming tips, and
            technology insights
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
                length: Math.ceil(popularBlogs.length / itemsPerSlide),
              }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-8 px-4 h-full">
                    {popularBlogs
                      .slice(
                        slideIndex * itemsPerSlide,
                        (slideIndex + 1) * itemsPerSlide
                      )
                      .map((blog) => (
                        <motion.article
                          key={blog.id}
                          className="group relative"
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ y: -10 }}
                        >
                          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/30 h-full">
                            <div className="relative overflow-hidden h-48">
                              <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                              <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-purple-600/90 text-white text-sm font-medium rounded-full">
                                  {blog.category}
                                </span>
                              </div>
                            </div>
                            <div className="p-6 flex flex-col h-full">
                              <div className="flex-grow">
                                <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                                  {blog.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
                                  {blog.excerpt}
                                </p>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <FaCalendarAlt size={12} />
                                    {new Date(blog.date).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FaClock size={12} />
                                    {blog.readTime}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {blog.tags.slice(0, 2).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-gray-100/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-full flex items-center gap-1"
                                    >
                                      <FaTag size={8} />
                                      {tag}
                                    </span>
                                  ))}
                                  {blog.tags.length > 2 && (
                                    <span className="px-2 py-1 bg-gray-100/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                      +{blog.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                                <Link
                                  href={`/blogs/${blog.id}`}
                                  className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                                >
                                  Read More
                                  <motion.div
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <FaArrowRight />
                                  </motion.div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {Array.from({
              length: Math.ceil(popularBlogs.length / itemsPerSlide),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-purple-600 w-6"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-purple-400"
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
            href="/blogs"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            View All Blog Posts
            <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <FaArrowRight />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularBlogs;
