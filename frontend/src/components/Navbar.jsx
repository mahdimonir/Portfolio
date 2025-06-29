"use client";

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
import { useTheme } from "./ThemeProvider";

const NavItem = ({ icon: Icon, label, path, isActive, onClick }) => (
  <motion.div className="relative">
    {path ? (
      <Link
        href={path}
        className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${
          isActive
            ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        }`}
      >
        <Icon size={20} />
      </Link>
    ) : (
      <button
        onClick={onClick}
        className="p-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300 relative overflow-hidden"
      >
        <Icon size={20} />
      </button>
    )}

    {/* Active indicator */}
    {isActive && (
      <motion.div
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
        layoutId="activeIndicator"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
  </motion.div>
);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300 overflow-hidden"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Background gradient effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl opacity-0"
        animate={{ opacity: theme === "dark" ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0"
        animate={{ opacity: theme === "light" ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon container with flip animation */}
      <motion.div
        initial={false}
        animate={{
          rotateY: theme === "dark" ? 0 : 180,
          scale: theme === "dark" ? 1 : 0.8,
        }}
        transition={{
          duration: 0.6,
          ease: "backOut",
          scale: { duration: 0.3 },
        }}
        className="relative z-10"
      >
        {theme === "dark" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <FaSun size={20} className="text-yellow-500" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <FaMoon size={20} className="text-blue-600" />
          </motion.div>
        )}
      </motion.div>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow:
            theme === "dark"
              ? "0 0 20px rgba(251, 191, 36, 0.3)"
              : "0 0 20px rgba(59, 130, 246, 0.3)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

const Navbar = () => {
  const pathname = usePathname(); // Replaced useLocation with usePathname

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
            {/* First two nav items */}
            {navItems.slice(0, 2).map(({ icon, label, path }) => (
              <NavItem
                key={label}
                icon={icon}
                label={label}
                path={path}
                isActive={isActive(path)}
              />
            ))}

            {/* Theme toggle in 3rd position */}
            <ThemeToggle />

            {/* Last two nav items */}
            {navItems.slice(2).map(({ icon, label, path }) => (
              <NavItem
                key={label}
                icon={icon}
                label={label}
                path={path}
                isActive={isActive(path)}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
