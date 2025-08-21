import { AlertCircle, Clock, RefreshCw, Wifi } from "lucide-react";

const ErrorState = ({
  title = "Something went wrong",
  description = "We encountered an error while loading this content",
  onRetry,
  variant = "default",
  error,
}) => {
  const variants = {
    default: {
      container: "py-16 px-6",
      iconBg: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-500",
      titleColor: "text-gray-900 dark:text-white",
      descColor: "text-gray-500 dark:text-gray-400",
    },
    network: {
      container: "py-20 px-6",
      iconBg: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-500",
      titleColor: "text-gray-900 dark:text-white",
      descColor: "text-gray-500 dark:text-gray-400",
    },
    timeout: {
      container: "py-16 px-6",
      iconBg: "bg-yellow-50 dark:bg-yellow-900/20",
      iconColor: "text-yellow-500",
      titleColor: "text-gray-900 dark:text-white",
      descColor: "text-gray-500 dark:text-gray-400",
    },
  };

  const getIcon = () => {
    switch (variant) {
      case "network":
        return Wifi;
      case "timeout":
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const Icon = getIcon();
  const style = variants[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${style.container}`}
    >
      <div
        className={`w-16 h-16 rounded-full ${style.iconBg} flex items-center justify-center mb-6 animate-bounce`}
      >
        <Icon className={`w-8 h-8 ${style.iconColor}`} />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${style.titleColor}`}>
        {title}
      </h3>
      <p className={`text-sm mb-6 max-w-sm ${style.descColor}`}>
        {description}
      </p>

      {error && (
        <details className="mb-4 text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 max-w-md">
          <summary className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">
            Show technical details
          </summary>
          <pre className="mt-2 whitespace-pre-wrap break-words">
            {error.toString()}
          </pre>
        </details>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
