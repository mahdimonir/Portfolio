"use client";

import { useTheme } from "@/components/ThemeProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBlog,
  FaEnvelope,
  FaHome,
  FaMoon,
  FaProjectDiagram,
  FaSun,
} from "react-icons/fa";

const BottomNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { icon: FaHome, label: "Home", path: "/" },
    { icon: FaProjectDiagram, label: "Projects", path: "/projects" },
    { icon: FaBlog, label: "Blogs", path: "/blogs" },
    { icon: FaEnvelope, label: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            {navItems.map(({ icon: Icon, label, path }) => (
              <motion.div key={label} className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={path}
                      className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                        isActive(path)
                          ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                          : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      }`}
                    >
                      <Icon size={20} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
                {isActive(path) && (
                  <motion.div
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={toggleTheme}
                  className="p-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Switch to ${
                    theme === "dark" ? "light" : "dark"
                  } mode`}
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: theme === "dark" ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {theme === "dark" ? (
                      <FaSun size={20} />
                    ) : (
                      <FaMoon size={20} />
                    )}
                  </motion.div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                Switch to {theme === "dark" ? "light" : "dark"} mode
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNavbar;
