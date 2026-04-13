"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaChartBar,
  FaCog,
  FaEnvelope,
  FaFileAlt,
  FaLayerGroup,
  FaSignOutAlt,
  FaTasks,
  FaUser,
} from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";

const menuItems = [
  { id: "overview", label: "Overview", icon: FaChartBar },
  { id: "analytics", label: "Analytics", icon: FaChartBar },
  { id: "works", label: "Works", icon: FaTasks },
  { id: "messages", label: "Messages", icon: FaEnvelope },
  { id: "profile", label: "Profile", icon: FaUser },
  { id: "resume", label: "Resume Maker", icon: FaFileAlt },
  { id: "mockup", label: "Mockup", icon: FaLayerGroup },
  { id: "settings", label: "Settings", icon: FaCog },
  { id: "logout", label: "Logout", icon: FaSignOutAlt },
];

export const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  openConfirmDialog,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [hovered, setHovered] = useState(false); // Track if opened via hover
  const sidebarRef = useRef(null);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed !== null) {
      setSidebarCollapsed(JSON.parse(savedCollapsed));
    } else {
      const isXlScreen = window.matchMedia("(min-width: 1280px)").matches;
      setSidebarCollapsed(!isXlScreen);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleLogout = async () => {
    await logout();
  };

  const handleItemClick = (id) => {
    if (id === "logout") {
      openConfirmDialog({
        title: "Confirm Logout",
        message:
          "Are you sure you want to logout? You'll need to login again to access the dashboard.",
        type: "warning",
        confirmText: "Logout",
        cancelText: "Stay",
        onConfirm: handleLogout,
      });
    } else {
      setActiveTab(id);
    }
  };

  // Handle hover to open when collapsed
  const handleMouseEnter = () => {
    if (sidebarCollapsed) {
      setHovered(true);
      setSidebarCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (hovered && sidebarCollapsed === false) {
      setHovered(false);
      setSidebarCollapsed(true);
    }
  };

  // Handle outside click/touch to close when open
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !sidebarCollapsed
      ) {
        setSidebarCollapsed(true);
        setHovered(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [sidebarCollapsed]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-screen bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 z-50 ${
        sidebarCollapsed ? "w-16" : "w-40"
      }`}
      style={{ transition: "width 0.3s ease" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        <motion.button
          onClick={() => {
            setSidebarCollapsed(!sidebarCollapsed);
            setHovered(false); // Reset hover state on manual toggle
          }}
          className="w-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {sidebarCollapsed ? (
            <GoSidebarCollapse size={25} />
          ) : (
            <GoSidebarExpand size={25} />
          )}
        </motion.button>
      </div>
      <div className="px-2">
        <hr className="opacity-10 border-gray-500 dark:border-gray-400" />
      </div>
      <nav className="mt-4 space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`
              w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-300 h-10
              ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }
              ${sidebarCollapsed ? "justify-center" : ""}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon size={20} />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </motion.button>
        ))}
      </nav>
    </div>
  );
};
