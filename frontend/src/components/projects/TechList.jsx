"use client";

import { getIconComponent } from "@/components/global/getIconComponent";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function TechList({ techs = [], cardId = "0" }) {
  const [hovered, setHovered] = useState(null);

  if (!Array.isArray(techs) || techs.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 relative">
      {techs.slice(0, 6).map((tech, i) => {
        const Icon = getIconComponent(tech.icon);
        const id = `${cardId}-${i}`;
        return (
          <motion.div
            key={id}
            className="relative p-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border border-blue-500/10 transition-all duration-200 cursor-pointer"
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.05 }}
          >
            {Icon ? (
              <Icon size={16} className={tech.color} />
            ) : (
              <span className="text-gray-500">?</span>
            )}

            <AnimatePresence>
              {hovered === id && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: -8, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg border border-slate-600 whitespace-nowrap z-50"
                >
                  {tech.name}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
      {techs.length > 6 && (
        <div className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-slate-600/20 to-slate-500/20 text-slate-400 text-xs rounded-full font-medium border border-slate-500/20">
          +{techs.length - 6}
        </div>
      )}
    </div>
  );
}
