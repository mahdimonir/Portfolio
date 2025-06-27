"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const GitContributionCalendar = () => {
  const generateContributionData = () => {
    const data = [];
    const totalDays = 7 * 53; // 53 weeks for a year, starting from first Sunday
    const today = new Date();
    // Find the first Sunday before or on the start of the 53-week period
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);
    while (startDate.getDay() !== 0) {
      // Adjust to start on Sunday
      startDate.setDate(startDate.getDate() - 1);
    }

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const level = Math.floor(Math.random() * 5); // 0 to 4
      data.push({
        date: new Date(currentDate),
        level,
        count: level === 0 ? 0 : Math.floor(Math.random() * 10) + level,
      });
    }
    return data;
  };

  const [contributionData] = useState(generateContributionData());
  const [hoveredDay, setHoveredDay] = useState(null);

  const getColorClass = (level) => {
    const colors = [
      "bg-gray-200 dark:bg-gray-700", // Level 0: No contributions
      "bg-green-200 dark:bg-green-900",
      "bg-green-300 dark:bg-green-800",
      "bg-green-400 dark:bg-green-700",
      "bg-green-500 dark:bg-green-600",
    ];
    return colors[level];
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const totalContributions = contributionData.reduce(
    (sum, day) => sum + day.count,
    0
  );
  const currentStreak = contributionData
    .slice(-30)
    .filter((day) => day.level > 0).length;

  const organizeDataIntoWeeks = () => {
    const weeks = [];
    for (let week = 0; week < 53; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const dataIndex = week * 7 + day;
        if (dataIndex < contributionData.length) {
          weekData.push(contributionData[dataIndex]);
        } else {
          weekData.push(null);
        }
      }
      weeks.push(weekData);
    }
    return weeks;
  };

  const weeklyData = organizeDataIntoWeeks();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-green-50/30 to-blue-50/30 dark:from-green-900/10 dark:to-blue-900/10">
      <div className="max-w-[740px] mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            GitHub Contributions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            My coding activity and contribution streak over the past year
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4 rounded-2xl">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalContributions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Contributions
              </div>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4 rounded-2xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currentStreak}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current Streak
              </div>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4 rounded-2xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                156
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Best Streak
              </div>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4 rounded-2xl">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                42
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                This Month
              </div>
            </div>
          </div>
        </motion.div>

        {/* This is where the 'Contribution Activity' section was. It's now removed. */}
      </div>
    </section>
  );
};

export default GitContributionCalendar;
