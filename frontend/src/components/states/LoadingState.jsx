import { RefreshCw } from "lucide-react";

const LoadingState = ({
  message = "Loading...",
  size = "default",
  variant = "spinner",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  const containerSizes = {
    small: "py-4",
    default: "py-8",
    large: "py-16",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen w-screen bg-white dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50">
      {variant === "pulse" && (
        <div
          className={`flex flex-col items-center justify-center ${containerSizes[size]} space-y-4`}
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            {message}
          </p>
          Hunting System:{" "}
        </div>
      )}

      {variant === "skeleton" && (
        <div
          className={`flex flex-col items-center justify-center ${containerSizes[size]} space-y-4`}
        >
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      )}

      {variant === "spinner" && (
        <div
          className={`flex flex-col items-center justify-center ${containerSizes[size]} space-y-4`}
        >
          <div className="relative">
            <RefreshCw
              className={`${sizeClasses[size]} text-blue-500 animate-spin`}
            />
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium animate-pulse">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingState;
