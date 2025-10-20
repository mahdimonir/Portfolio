import { AnimatePresence, motion } from "framer-motion";
import { FaEdit, FaExclamationTriangle, FaSave, FaTrash } from "react-icons/fa";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <FaTrash className="text-red-500" size={24} />;
      case "warning":
        return <FaExclamationTriangle className="text-yellow-500" size={24} />;
      case "info":
        return <FaEdit className="text-blue-500" size={24} />;
      case "success":
        return <FaSave className="text-green-500" size={24} />;
      default:
        return <FaExclamationTriangle className="text-gray-500" size={24} />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "info":
        return "bg-blue-600 hover:bg-blue-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              {getIcon()}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-xl transition-colors"
              >
                {cancelText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-6 py-2 text-white rounded-xl transition-colors ${getButtonColor()}`}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
