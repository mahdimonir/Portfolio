"use client";

import Contact from "@/components/Contact";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <div className="relative">
        <main className="pb-20 pt-8">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-6"
              >
                <FaArrowLeft />
                Back to Home
              </Link>
            </motion.div>
            <Contact />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
