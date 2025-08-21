"use client";

import { getIconComponent } from "@/components/global/getIconComponent";
import React from "react";
import { FaChartBar, FaEdit, FaTrash } from "react-icons/fa";

const TechStackManager = ({
  techStacks,
  onDelete,
  onEdit,
  itemsPerPage = 12,
}) => {
  // Flatten all technologies across categories
  const flattenedTechnologies = React.useMemo(() => {
    const items = [];
    for (const stack of techStacks || []) {
      for (const tech of stack.technologies || []) {
        items.push({ ...tech, __category: stack.category });
      }
    }
    return items;
  }, [techStacks]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil((flattenedTechnologies.length || 0) / itemsPerPage)
  );
  const pageItems = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return flattenedTechnologies.slice(start, end);
  }, [flattenedTechnologies, currentPage, itemsPerPage]);

  return (
    <>
      <div className="space-y-6">
        {/* Tech Stack Items */}
        <div
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          style={{ gridAutoRows: "1fr" }}
        >
          {pageItems.map((tech) => {
            const IconComponent = getIconComponent(tech.icon);
            return (
              <div
                key={tech.name}
                className="bg-white dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/30 flex flex-col h-full"
              >
                {/* Main content (icon, name, tagline, etc.) */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <IconComponent
                      size={32}
                      className={`${tech.color} mb-3 group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                      {tech.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {tech.tagline}
                    </div>
                  </div>
                </div>
                {/* Spacer to push footer down */}
                <div className="flex-1" />
                {/* Footer */}
                <div className="flex items-center gap-2 mt-2 w-auto self-start">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    <FaChartBar size={12} /> Uses: {tech.uses || 0}
                  </div>
                  <button
                    onClick={() =>
                      onDelete(tech.__category, "techstack", tech.name)
                    }
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"
                  >
                    <FaTrash size={14} />
                  </button>
                  <button
                    onClick={() =>
                      onEdit(
                        { ...tech, category: tech.__category },
                        "techstack"
                      )
                    }
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl"
                  >
                    <FaEdit size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : ""
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TechStackManager;
