"use client";

import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Client Testimonials
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            What clients say about working with me
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={currentIndex}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 dark:border-gray-700/30"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-200 dark:border-blue-800">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -left-2 text-blue-600 dark:text-blue-400">
                  <FaQuoteLeft size={24} />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex justify-center md:justify-start gap-1 mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" size={16} />
                  ))}
                </div>
                <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {testimonials[currentIndex].role}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {testimonials[currentIndex].company}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Arrows */}
          <button onClick={prevTestimonial} className="leftarow">
            <FaChevronLeft size={20} />
          </button>
          <button onClick={nextTestimonial} className="rightarow">
            <FaChevronRight size={20} />
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <Button
              key={index}
              onClick={() => goToSlide(index)}
              variant="ghost"
              className={`w-3 h-3 rounded-full p-0 ${
                index === currentIndex
                  ? "bg-blue-600 dark:bg-blue-400 w-8"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        <motion.div
          className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-6 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30 cursor-pointer transition-all duration-300 ${
                index === currentIndex
                  ? "ring-2 ring-blue-500 scale-105"
                  : "hover:scale-105"
              }`}
              onClick={() => goToSlide(index)}
              whileHover={{ y: -5 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 border-2 border-blue-200 dark:border-blue-800">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                  {testimonial.name}
                </h4>
                <p className="text-blue-600 dark:text-blue-400 text-xs">
                  {testimonial.role}
                </p>
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" size={10} />
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

export default Testimonials;
