"use client";

import Contact from "@/components/contacts/Contact";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "sonner";

const Page = () => {
  const [secretClicks, setSecretClicks] = useState(0);
  const [showSecretAccess, setShowSecretAccess] = useState(false);

  const handleSecretClick = () => {
    setSecretClicks((prev) => {
      const newCount = prev + 1;
      if (newCount >= 7) {
        setShowSecretAccess(true);
        return 0;
      }
      return newCount;
    });
  };

  useEffect(() => {
    if (showSecretAccess) {
      toast.info("Rate limit reached!", {
        duration: 4000,
        action: {
          label: "→",
          onClick: () => {
            window.location.href = "/login";
          },
        },
      });
      setShowSecretAccess(false);
    }
  }, [showSecretAccess]);

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
            <Contact
              handleSecretClick={handleSecretClick}
              showSecretAccess={showSecretAccess}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
