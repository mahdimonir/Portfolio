"use client";

import { motion } from "framer-motion";

// Export all motion components as client components
export const MotionDiv = motion.div;
export const MotionHeader = motion.header;
export const MotionArticle = motion.article;
export const MotionSpan = motion.span;
export const MotionA = motion.a;

// Animation variants that can be reused
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

// Animation for sliding in from left
export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

// Animation for sliding in from top
export const slideInTop = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Animation for sliding in from bottom
export const slideInBottom = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Animation for scaling
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};