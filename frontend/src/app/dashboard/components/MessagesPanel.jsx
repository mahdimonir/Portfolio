"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaReply, FaSearch, FaStar, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const MessagesPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alice Johnson",
      email: "alice@example.com",
      subject: "Project Collaboration Opportunity",
      preview:
        "Hi John, I came across your portfolio and would love to discuss a potential collaboration...",
      content:
        "Hi John,\n\nI came across your portfolio and I'm really impressed with your work, especially the e-commerce platform you built. I have a project that I think would be perfect for your skill set...",
      date: "2024-01-15T10:30:00Z",
      read: false,
      starred: false,
      important: true,
    },
    {
      id: 2,
      sender: "Mike Chen",
      email: "mike@techcorp.com",
      subject: "Job Opportunity - Senior Developer",
      preview:
        "We have an exciting opportunity for a Senior Full Stack Developer position...",
      content:
        "Hello John,\n\nWe have an exciting opportunity for a Senior Full Stack Developer position at TechCorp. Based on your experience and portfolio...",
      date: "2024-01-14T14:22:00Z",
      read: true,
      starred: true,
      important: false,
    },
    {
      id: 3,
      sender: "Sarah Williams",
      email: "sarah@startup.io",
      subject: "Freelance Project Inquiry",
      preview:
        "Hello! I'm reaching out regarding a React project we need help with...",
      content:
        "Hello John,\n\nI'm reaching out regarding a React project we need help with. We're a startup looking to build a modern web application...",
      date: "2024-01-13T09:15:00Z",
      read: false,
      starred: false,
      important: false,
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [replyText, setReplyText] = useState("");

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "unread") return matchesSearch && !message.read;
    if (filterType === "starred") return matchesSearch && message.starred;
    if (filterType === "important") return matchesSearch && message.important;
    return matchesSearch;
  });

  const markAsRead = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    );
    toast.success("Message marked as read");
  };

  const toggleStar = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
      )
    );
    const message = messages.find((m) => m.id === messageId);
    toast.success(
      message?.starred ? "Removed from starred" : "Added to starred"
    );
  };

  const deleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    setSelectedMessage(null);
    toast.success("Message deleted");
  };

  const sendReply = () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    toast.success("Reply sent successfully!");
    setReplyText("");
    setSelectedMessage(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
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
            <option value="important">Important</option>
          </select>
        </div>
      </div>

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
                  if (!message.read) markAsRead(message.id);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  selectedMessage?.id === message.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : message.read
                    ? "border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/30"
                    : "border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10"
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
                      {message.sender}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {message.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {message.important && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                    {message.starred && (
                      <FaStar className="text-yellow-500" size={12} />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(message.date)}
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
                    <span>{selectedMessage.sender}</span>
                    <span>•</span>
                    <span>{selectedMessage.email}</span>
                    <span>•</span>
                    <span>{formatDate(selectedMessage.date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStar(selectedMessage.id)}
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
                  {selectedMessage.content}
                </div>
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
    </div>
  );
};

export default MessagesPanel;
