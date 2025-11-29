"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBlog,
  FaEnvelope,
  FaHome,
  FaMoon,
  FaProjectDiagram,
  FaShieldAlt,
  FaSun,
} from "react-icons/fa";
import { useTheme } from "../ThemeProvider";

const NavItem = ({
  icon: Icon,
  label,
  path,
  isActive,
  onClick,
  onDoubleClick,
  isLoggedIn,
}) => (
  <motion.div className="relative">
    {path ? (
      <Link
        href={path}
        onDoubleClick={onDoubleClick}
        className={`relative p-2 rounded-xl transition-all duration-300 flex items-center justify-center ${
          isActive
            ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        }`}
      >
        <Icon size={18} />

        {/* ✅ Login shield for Contact tab only */}
        {label === "Contact" && isLoggedIn && (
          <motion.div
            className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
          >
            <motion.div
              className="relative"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaShieldAlt
                size={12}
                className="text-green-500 bg-white dark:bg-gray-900 rounded-full p-0.5 shadow-md border border-green-300 dark:border-green-700"
              />
              {/* Subtle pulsing effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-green-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </Link>
    ) : (
      <button
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300 relative overflow-hidden"
      >
        <Icon size={18} />
      </button>
    )}

    {/* Active indicator dot */}
    {isActive && (
      <motion.div
        className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
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
      className="relative p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300 overflow-hidden"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-0"
        animate={{ opacity: theme === "dark" ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0"
        animate={{ opacity: theme === "light" ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      />

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
            <FaSun size={18} className="text-yellow-500" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <FaMoon size={18} className="text-blue-600" />
          </motion.div>
        )}
      </motion.div>

      {/* Subtle glow */}
      <motion.div
        className="absolute inset-0 rounded-xl"
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
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { icon: FaHome, label: "Home", path: "/" },
    { icon: FaProjectDiagram, label: "Projects", path: "/projects" },
    { icon: FaBlog, label: "Blogs", path: "/blogs" },
    { icon: FaEnvelope, label: "Contact", path: "/contact" },
  ];

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const handleContactDoubleClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-2 overflow-x-hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="max-w-sm mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 px-4 py-3">
          <div className="flex items-center justify-between space-x-2">
            {navItems.slice(0, 2).map((item) => (
              <NavItem
                key={item.label}
                {...item}
                isActive={isActive(item.path)}
                isLoggedIn={isAuthenticated}
              />
            ))}

            <ThemeToggle />

            {navItems.slice(2).map((item) => (
              <NavItem
                key={item.label}
                {...item}
                isActive={isActive(item.path)}
                isLoggedIn={isAuthenticated}
                onDoubleClick={
                  item.label === "Contact"
                    ? handleContactDoubleClick
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

export const triggerLoginStatusChange = () => {
  window.dispatchEvent(new CustomEvent("loginStatusChanged"));
};
