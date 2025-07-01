"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaChartLine,
  FaCheckCircle,
  FaCog,
  FaExclamationTriangle,
  FaEye,
  FaHeart,
  FaProjectDiagram,
  FaStar,
} from "react-icons/fa";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d");

  const analyticsData = {
    overview: {
      totalViews: { value: "12.4k", change: "+15.2%", trend: "up" },
      uniqueVisitors: { value: "8.2k", change: "+8.7%", trend: "up" },
      bounceRate: { value: "23.5%", change: "-5.2%", trend: "down" },
      avgSessionTime: { value: "3m 42s", change: "+12.3%", trend: "up" },
    },
    optimization: [
      {
        category: "Performance",
        score: 92,
        issues: [
          { type: "success", message: "Image optimization implemented" },
          {
            type: "warning",
            message: "Consider lazy loading for images below fold",
          },
        ],
      },
      {
        category: "SEO",
        score: 88,
        issues: [
          { type: "success", message: "Meta descriptions are optimized" },
          { type: "warning", message: "Add more structured data markup" },
        ],
      },
      {
        category: "Accessibility",
        score: 95,
        issues: [
          { type: "success", message: "All images have alt attributes" },
          { type: "success", message: "Color contrast ratios are good" },
        ],
      },
      {
        category: "Best Practices",
        score: 85,
        issues: [
          { type: "success", message: "HTTPS is properly configured" },
          { type: "warning", message: "Consider implementing CSP headers" },
        ],
      },
    ],
    improvements: [
      {
        title: "Enable Gzip Compression",
        impact: "High",
        effort: "Low",
        description: "Reduce file sizes by 60-80%",
        status: "pending",
      },
      {
        title: "Implement Critical CSS",
        impact: "Medium",
        effort: "Medium",
        description: "Improve first paint time by 200ms",
        status: "in-progress",
      },
      {
        title: "Add Service Worker",
        impact: "High",
        effort: "High",
        description: "Enable offline functionality",
        status: "pending",
      },
    ],
  };
  // Dummy data for charts
  const projectsData = [
    { month: "Jan", completed: 4, inProgress: 2 },
    { month: "Feb", completed: 3, inProgress: 4 },
    { month: "Mar", completed: 6, inProgress: 3 },
    { month: "Apr", completed: 5, inProgress: 5 },
    { month: "May", completed: 8, inProgress: 2 },
    { month: "Jun", completed: 7, inProgress: 6 },
  ];

  const visitorData = [
    { day: "Mon", visitors: 1200, views: 3400 },
    { day: "Tue", visitors: 1900, views: 4200 },
    { day: "Wed", visitors: 2100, views: 5100 },
    { day: "Thu", visitors: 1800, views: 3800 },
    { day: "Fri", visitors: 2400, views: 6200 },
    { day: "Sat", visitors: 2800, views: 7100 },
    { day: "Sun", visitors: 2200, views: 5400 },
  ];

  const serviceUsage = [
    { name: "Full-Stack Development", value: 35, color: "#3B82F6" },
    { name: "Frontend Development", value: 28, color: "#8B5CF6" },
    { name: "Backend Development", value: 22, color: "#10B981" },
    { name: "Database Solutions", value: 15, color: "#F59E0B" },
  ];

  const testimonialRatings = [
    { rating: "5 Stars", count: 45, color: "#EAB308" },
    { rating: "4 Stars", count: 12, color: "#84CC16" },
    { rating: "3 Stars", count: 3, color: "#06B6D4" },
    { rating: "2 Stars", count: 1, color: "#F97316" },
    { rating: "1 Star", count: 0, color: "#EF4444" },
  ];

  const stats = [
    {
      label: "Total Projects",
      value: "24",
      change: "+12%",
      icon: FaProjectDiagram,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Page Views",
      value: "45.2k",
      change: "+18%",
      icon: FaEye,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
    },
    {
      label: "Total Likes",
      value: "1.8k",
      change: "+24%",
      icon: FaHeart,
      color: "pink",
      bgGradient: "from-pink-500 to-pink-600",
    },
    {
      label: "Avg Rating",
      value: "4.9",
      change: "+0.2",
      icon: FaStar,
      color: "yellow",
      bgGradient: "from-yellow-500 to-yellow-600",
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 90)
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    if (score >= 70)
      return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      case "Medium":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
      case "Low":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics & Optimization
        </h2>
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="text-green-500" size={16} />
            <span>Updated 2 minutes ago</span>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(analyticsData.overview).map(([key, data], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {data.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  data.trend === "up"
                    ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                    : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                }`}
              >
                {data.trend === "up" ? (
                  <FaArrowUp size={10} />
                ) : (
                  <FaArrowDown size={10} />
                )}
                {data.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects Progress */}
        <motion.div
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FaProjectDiagram className="text-blue-500" />
            Projects Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.9)",
                  border: "none",
                  borderRadius: "12px",
                  backdropFilter: "blur(12px)",
                }}
              />
              <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inProgress" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Visitor Analytics */}
        <motion.div
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FaChartLine className="text-purple-500" />
            Visitor Analytics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={visitorData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.9)",
                  border: "none",
                  borderRadius: "12px",
                  backdropFilter: "blur(12px)",
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stackId="1"
                stroke="#8B5CF6"
                fill="url(#colorViews)"
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stackId="1"
                stroke="#3B82F6"
                fill="url(#colorVisitors)"
              />
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Usage */}
        <motion.div
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Service Usage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceUsage}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {serviceUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Testimonial Ratings */}
        <motion.div
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Testimonial Ratings
          </h3>
          <div className="space-y-4">
            {testimonialRatings.map((rating, index) => (
              <div key={rating.rating} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                  {rating.rating}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: rating.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(rating.count / 61) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-8">
                  {rating.count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Optimization Scores */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FaCog />
          Application Performance Scores
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData.optimization.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${category.score}, 100`}
                    className={
                      category.score >= 90
                        ? "text-green-500"
                        : category.score >= 70
                        ? "text-yellow-500"
                        : "text-red-500"
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {category.score}
                  </span>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                {category.category}
              </h4>

              <div className="space-y-2">
                {category.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    {issue.type === "success" ? (
                      <FaCheckCircle
                        className="text-green-500 mt-0.5 flex-shrink-0"
                        size={12}
                      />
                    ) : (
                      <FaExclamationTriangle
                        className="text-yellow-500 mt-0.5 flex-shrink-0"
                        size={12}
                      />
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-left">
                      {issue.message}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Improvement Recommendations */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Optimization Recommendations
        </h3>

        <div className="space-y-4">
          {analyticsData.improvements.map((improvement, index) => (
            <motion.div
              key={improvement.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/20 rounded-xl"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {improvement.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {improvement.description}
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(
                      improvement.impact
                    )}`}
                  >
                    {improvement.impact} Impact
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Effort: {improvement.effort}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    improvement.status === "pending"
                      ? "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
                      : "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30"
                  }`}
                >
                  {improvement.status === "pending" ? "Pending" : "In Progress"}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm"
                >
                  Implement
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
