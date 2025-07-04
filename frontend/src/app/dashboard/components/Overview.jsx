import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { FaBlog, FaEnvelope, FaProjectDiagram, FaUsers } from "react-icons/fa";

const Overview = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400">
        <TrendingUp className="text-green-500" size={16} />
        <span>Updated 2 minutes ago</span>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
        {[
          {
            label: "Total Projects",
            value: "24",
            icon: FaProjectDiagram,
            color: "blue",
            change: "+12%",
          },
          {
            label: "Blog Posts",
            value: "18",
            icon: FaBlog,
            color: "green",
            change: "+8%",
          },
          {
            label: "Messages",
            value: "12",
            icon: FaEnvelope,
            color: "purple",
            change: "+3%",
          },
          {
            label: "Websit Visitors",
            value: "2.4k",
            icon: FaUsers,
            color: "orange",
            change: "+15%",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="text-white" size={20} />
              </div>
              <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              action: 'New project "AI Dashboard" created',
              time: "2 hours ago",
              type: "project",
              color: "blue",
            },
            {
              action: "Resume template updated",
              time: "4 hours ago",
              type: "resume",
              color: "green",
            },
            {
              action: "Tech stack progress updated",
              time: "6 hours ago",
              type: "update",
              color: "purple",
            },
            {
              action: "New message received",
              time: "8 hours ago",
              type: "message",
              color: "orange",
            },
          ].map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-2 md:p-4 bg-gray-50/50 dark:bg-gray-700/20 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-600/20 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div
                className={`w-3 h-3 rounded-full bg-${activity.color}-500`}
              ></div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
