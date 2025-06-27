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

        {/* <motion.div
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Contribution Activity
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
                />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="w-[684px]">
              {" "}
              {/* 53 weeks * (10px cell + 2px gap) + 24px weekday labels */}
              <div className="grid grid-cols-53 gap-[2px] mb-2 ml-6">
                {Array.from({ length: 53 }, (_, weekIndex) => {
                  const weekDate = new Date(
                    contributionData[weekIndex * 7].date
                  );
                  const monthName = months[weekDate.getMonth()];
                  const isFirstWeekOfMonth =
                    weekIndex === 0 ||
                    (weekDate.getDate() <= 7 && weekDate.getDay() === 0);
                  return (
                    <div
                      key={weekIndex}
                      className="text-[10px] text-gray-500 dark:text-gray-400 text-center"
                    >
                      {isFirstWeekOfMonth ? monthName : ""}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-[2px]">
                <div className="flex flex-col gap-[2px] w-6">
                  {weekdays.map((day, index) => (
                    <div key={index} className="h-[10px] flex items-center">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {index % 2 === 1 ? day.slice(0, 3) : ""}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-53 gap-[2px]">
                  {weeklyData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[2px]">
                      {week.map((day, dayIndex) => (
                        <motion.div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-[10px] h-[10px] rounded-[2px] cursor-pointer transition-all duration-200 ${
                            day ? getColorClass(day.level) : "bg-transparent"
                          } hover:ring-1 hover:ring-blue-400 hover:scale-110`}
                          onMouseEnter={() =>
                            day &&
                            setHoveredDay({ date: day.date, count: day.count })
                          }
                          onMouseLeave={() => setHoveredDay(null)}
                          whileHover={{ scale: 1.2 }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: (weekIndex * 7 + dayIndex) * 0.001,
                            duration: 0.3,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {hoveredDay && (
            <motion.div
              className="absolute bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium pointer-events-none z-10"
              style={{
                left: "50%",
                top: "20%",
                transform: "translate(-50%, -100%)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="text-center">
                <div className="font-semibold">
                  {hoveredDay.count} contributions
                </div>
                <div className="text-xs opacity-75">
                  {hoveredDay.date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
            </motion.div>
          )}
        </motion.div> */}
      </div>
    </section>
  );
};

export default GitContributionCalendar;
