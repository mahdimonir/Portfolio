"use client";

import axiosInstance from "@/lib/axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaEnvelope, FaReply, FaSearch, FaStar, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const MessagesPanel = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load messages from API on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/messages/getall");
        const apiMessages = response.data.data.map((msg) => ({
          ...msg,
          id: msg._id,
          preview: generatePreview(msg.message),
        }));
        setMessages(apiMessages);
      } catch (error) {
        toast.error(
          "Failed to fetch messages: " +
            (error.response?.data?.message || "Server error")
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Generate preview from message
  const generatePreview = (message) => {
    const maxLength = 50;
    const trimmed = message.split("\n")[0].trim();
    return trimmed.length > maxLength
      ? trimmed.slice(0, maxLength) + "..."
      : trimmed;
  };

  const toggleMessageProperty = async (messageId, property) => {
    try {
      const message = messages.find((m) => m.id === messageId);
      let newValue;
      let endpoint;
      let successMessage;

      switch (property) {
        case "starred":
          newValue = !message.starred;
          endpoint = `/messages/${messageId}/star`;
          successMessage = newValue
            ? "Added to starred"
            : "Removed from starred";
          break;
        case "read":
          newValue = !message.read;
          endpoint = `/messages/${messageId}/read`;
          successMessage = newValue ? "Marked as read" : "Marked as unread";
          break;
        default:
          throw new Error("Invalid property");
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, [property]: newValue } : msg
        )
      );

      if (selectedMessage?.id === messageId) {
        setSelectedMessage((prev) => ({ ...prev, [property]: newValue }));
      }
      await axiosInstance.patch(endpoint, { [property]: newValue });

      toast.success(successMessage);
    } catch (error) {
      toast.error(
        `Failed to update ${property}: ` +
          (error.response?.data?.message || "Server error")
      );
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, [property]: !newValue } : msg
        )
      );
      if (selectedMessage?.id === messageId) {
        setSelectedMessage((prev) => ({ ...prev, [property]: !newValue }));
      }
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}/delete`);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      setSelectedMessage(null);
      toast.success("Message deleted");
    } catch (error) {
      toast.error(
        "Failed to delete message: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }
    try {
      const response = await axiosInstance.post("/messages/reply", {
        messageId: selectedMessage.id,
        replyText,
      });
      const newReply = {
        ...response.data.data,
        createdAt: response.data.data.createdAt || new Date().toISOString(),
      };
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === selectedMessage.id
            ? { ...msg, replies: [...(msg.replies || []), newReply] }
            : msg
        )
      );
      setSelectedMessage((prev) => ({
        ...prev,
        replies: [...(prev.replies || []), newReply],
      }));
      toast.success("Reply sent successfully!");
      setReplyText("");
    } catch (error) {
      toast.error(
        "Failed to send reply: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.senderEmail.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "unread") return matchesSearch && !message.read;
    if (filterType === "starred") return matchesSearch && message.starred;
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-gray-700/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Messages
          </h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="starred">Starred</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p>Loading messages...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-3 max-h-96 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaEnvelope size={32} className="mx-auto mb-2 opacity-50" />
                <p>No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read)
                      toggleMessageProperty(message.id, "read");
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                    selectedMessage?.id === message.id
                      ? "border-blue-600 bg-blue-200 dark:bg-blue-700/40 shadow-lg"
                      : message.read
                      ? "border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/50 shadow-sm hover:border-gray-400 dark:hover:border-gray-400 hover:shadow-md"
                      : "border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 font-semibold shadow-md hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium truncate ${
                          !message.read
                            ? "font-bold text-gray-900 dark:text-white"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {message.senderName}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {message.senderEmail}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageProperty(message.id, "starred");
                        }}
                        className={`p-1 ${
                          message.starred
                            ? "text-yellow-500"
                            : "text-gray-400 hover:text-yellow-500"
                        }`}
                      >
                        <FaStar size={12} />
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  </div>

                  <h5
                    className={`text-sm mb-1 truncate ${
                      !message.read ? "font-semibold" : "font-medium"
                    } text-gray-900 dark:text-white`}
                  >
                    {message.subject}
                  </h5>

                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {message.preview}
                  </p>
                </motion.div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {selectedMessage.subject}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{selectedMessage.senderName}</span>
                      <span>•</span>
                      <span>{selectedMessage.senderEmail}</span>
                      <span>•</span>
                      <span>{formatDate(selectedMessage.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        toggleMessageProperty(selectedMessage.id, "starred")
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        selectedMessage.starred
                          ? "text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                          : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <FaStar size={16} />
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none mb-6">
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                  {selectedMessage.replies?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Replies
                      </h4>
                      {selectedMessage.replies.map((reply) => (
                        <div
                          key={reply.createdAt}
                          className="border-l-4 border-blue-500 pl-4 py-2 mb-2 bg-gray-50 dark:bg-gray-700 rounded-r-lg"
                        >
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Replied at</strong> •{" "}
                            {formatDate(reply.createdAt)}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {reply.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Reply
                  </h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setReplyText("")}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendReply}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      <FaReply size={14} />
                      Send Reply
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <FaEnvelope size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select a message to view its content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPanel;
