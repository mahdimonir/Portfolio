"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa";

const Testimonials = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (testimonials.length === 0) return null;

  return (
    <section className="relative py-12 md:py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden font-inter">
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/20"
          >
            Kind Words
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent italic">
            Testimonials
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Feedback from colleagues and partners I've had the pleasure to collaborate with.
          </p>
        </motion.div>

        <div className="relative">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                <img
                  src={testimonials[currentIndex].image.url}
                  alt={testimonials[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating || 5)].map(
                  (_, i) => (
                    <FaStar key={i} className="text-yellow-400" size={16} />
                  )
                )}
              </div>

              <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">
                "{testimonials[currentIndex].quote}"
              </blockquote>

              <div>
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  {testimonials[currentIndex].role}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {testimonials[currentIndex].company}
                </p>
              </div>
            </motion.div>
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            disabled={testimonials.length <= 1}
          >
            <FaChevronLeft size={20} />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            disabled={testimonials.length <= 1}
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 w-12"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-3"
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isAutoPlaying
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {isAutoPlaying ? "Auto-play On" : "Auto-play Off"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
