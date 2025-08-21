import { Inbox } from "lucide-react";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "Get started by adding your first item",
  action,
  variant = "default",
}) => {
  const variants = {
    default: {
      container: "py-16 px-6",
      iconBg: "bg-gray-100 dark:bg-gray-800",
      iconColor: "text-gray-400",
      titleColor: "text-gray-900 dark:text-white",
      descColor: "text-gray-500 dark:text-gray-400",
    },
    search: {
      container: "py-20 px-6",
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500",
      titleColor: "text-gray-900 dark:text-white",
      descColor: "text-gray-500 dark:text-gray-400",
    },
    error: {
      container: "py-16 px-6",
      iconBg: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-500",
      titleColor: "text-gray-900 dark:text-white",
      descColor: "text-gray-500 dark:text-gray-400",
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${style.container}`}
    >
      <div
        className={`w-16 h-16 rounded-full ${style.iconBg} flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110`}
      >
        <Icon className={`w-8 h-8 ${style.iconColor}`} />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${style.titleColor}`}>
        {title}
      </h3>
      <p className={`text-sm mb-6 max-w-sm ${style.descColor}`}>
        {description}
      </p>
      {action && <div className="animate-fade-in">{action}</div>}
    </div>
  );
};

export default EmptyState;
