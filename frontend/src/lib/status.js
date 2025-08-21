export const getStatusColor = (status) => {
  if (!status)
    return "text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";

  const normalizedStatus = String(status).toLowerCase().trim();

  switch (normalizedStatus) {
    // Success/Active Statuses - Green Theme
    case "published":
    case "active":
    case "current":
    case "completed":
    case "success":
    case "live":
    case "running":
    case "approved":
    case "verified":
      return "text-emerald-700 bg-emerald-100 border border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/40 dark:border-emerald-800 font-medium";

    // In Progress/Working Statuses - Blue Theme
    case "in progress":
    case "in-progress":
    case "processing":
    case "working":
    case "developing":
    case "building":
    case "maintenance":
    case "review":
    case "under review":
      return "text-blue-700 bg-blue-100 border border-blue-200 dark:text-blue-300 dark:bg-blue-900/40 dark:border-blue-800 font-medium";

    // Warning/Pending Statuses - Amber Theme
    case "draft":
    case "pending":
    case "waiting":
    case "on hold":
    case "on-hold":
    case "scheduled":
    case "planned":
    case "queued":
    case "submitted":
      return "text-amber-700 bg-amber-100 border border-amber-200 dark:text-amber-300 dark:bg-amber-900/40 dark:border-amber-800 font-medium";

    // Info/Neutral Statuses - Indigo Theme
    case "info":
    case "information":
    case "not started":
    case "not-started":
    case "ready":
    case "prepared":
    case "configured":
    case "setup":
      return "text-indigo-700 bg-indigo-100 border border-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/40 dark:border-indigo-800 font-medium";

    // Past/Historical Statuses - Slate Theme
    case "past":
    case "historical":
    case "archived":
    case "deprecated":
    case "legacy":
    case "old":
    case "expired":
    case "ended":
      return "text-slate-600 bg-slate-100 border border-slate-200 dark:text-slate-400 dark:bg-slate-900/30 dark:border-slate-800 font-medium";

    // Error/Failed Statuses - Red Theme
    case "error":
    case "failed":
    case "cancelled":
    case "canceled":
    case "rejected":
    case "declined":
    case "stopped":
    case "terminated":
    case "broken":
      return "text-red-700 bg-red-100 border border-red-200 dark:text-red-300 dark:bg-red-900/40 dark:border-red-800 font-medium";

    // Special/Featured Statuses - Purple Theme
    case "featured":
    case "premium":
    case "vip":
    case "priority":
    case "urgent":
    case "important":
    case "highlighted":
    case "starred":
      return "text-purple-700 bg-purple-100 border border-purple-200 dark:text-purple-300 dark:bg-purple-900/40 dark:border-purple-800 font-medium";

    // Default fallback - Gray Theme
    default:
      return "text-gray-600 bg-gray-100 border border-gray-200 dark:text-gray-400 dark:bg-gray-900/30 dark:border-gray-800 font-medium";
  }
};

export const getStatusIcon = (status) => {
  if (!status) return "FaQuestionCircle";

  const normalizedStatus = String(status).toLowerCase().trim();

  switch (normalizedStatus) {
    // Success/Active Statuses
    case "published":
    case "active":
    case "current":
    case "completed":
    case "success":
    case "live":
    case "running":
    case "approved":
    case "verified":
      return "FaCheckCircle";

    // In Progress/Working Statuses
    case "in progress":
    case "in-progress":
    case "processing":
    case "working":
    case "developing":
    case "building":
    case "maintenance":
    case "review":
    case "under review":
      return "FaSpinner";

    // Warning/Pending Statuses
    case "draft":
    case "pending":
    case "waiting":
    case "on hold":
    case "on-hold":
    case "scheduled":
    case "planned":
    case "queued":
    case "submitted":
      return "FaClock";

    // Info/Neutral Statuses
    case "info":
    case "information":
    case "not started":
    case "not-started":
    case "ready":
    case "prepared":
    case "configured":
    case "setup":
      return "FaInfoCircle";

    // Past/Historical Statuses
    case "past":
    case "historical":
    case "archived":
    case "deprecated":
    case "legacy":
    case "old":
    case "expired":
    case "ended":
      return "FaArchive";

    // Error/Failed Statuses
    case "error":
    case "failed":
    case "cancelled":
    case "canceled":
    case "rejected":
    case "declined":
    case "stopped":
    case "terminated":
    case "broken":
      return "FaExclamationTriangle";

    // Special/Featured Statuses
    case "featured":
    case "premium":
    case "vip":
    case "priority":
    case "urgent":
    case "important":
    case "highlighted":
    case "starred":
      return "FaStar";

    // Default fallback
    default:
      return "FaCircle";
  }
};
