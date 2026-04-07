"use client";

import { useTheme } from "@/components/ThemeProvider";
import { MotionDiv } from "@/components/ui/motion";
import { useEffect, useRef, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";

const today = new Date();
const lastYear = new Date();
lastYear.setFullYear(today.getFullYear() - 1);
const formatDate = (d) => d.toISOString().split("T")[0];

const GitContribution = ({ githubData }) => {
  const { theme } = useTheme();
  const calendarRef = useRef(null);

  // Use the server-side fetched data
  const contributions = githubData?.contributions || [];
  const stats = {
    totalContributions: githubData?.totalContributions || 0,
    currentStreak: githubData?.currentStreak || 0,
    maxStreak: githubData?.maxStreak || 0,
    thisMonth: githubData?.thisMonth || 0,
  };
  const loading = contributions.length === 0;

  const calculateStats = (data) => {
    const total = data.reduce((sum, c) => sum + c.count, 0);
    const currentStreak = (() => {
      let streak = 0;
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].count > 0) streak++;
        else break;
      }
      return streak;
    })();
    const maxStreak = (() => {
      let max = 0,
        current = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].count > 0) {
          current++;
          max = Math.max(max, current);
        } else {
          current = 0;
        }
      }
      return max;
    })();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    const thisMonthCount = data
      .filter((c) => {
        const d = new Date(c.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((sum, c) => sum + c.count, 0);

    return {
      totalContributions: total,
      currentStreak,
      maxStreak,
      thisMonth: thisMonthCount,
    };
  };

  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Fetching GitHub contribution data")
      ) {
        return;
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const CountingNumber = ({ end }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
      const duration = 1.2;
      const range = end;
      let startTime = null;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(
          (timestamp - startTime) / (duration * 1000),
          1
        );
        setDisplayValue(Math.floor(range * progress));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [end]);
    return <span>{displayValue}</span>;
  };

  const formatTooltip = (date, count) => {
    const d = new Date(date);
    const options = { month: "long", day: "numeric" };
    const formatted = d.toLocaleDateString("en-US", options);
    return count > 0
      ? `${count} contributions on ${formatted}`
      : `No contributions on ${formatted}`;
  };

  const transformedContributions = (contributions || []).map(
    ({ date, count }) => ({
      date,
      count,
      level:
        count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4,
      "data-tooltip-id": "github-tooltip",
      "data-tooltip-content": formatTooltip(date, count),
    })
  );

  useEffect(() => {
    if (calendarRef.current && !loading) {
      const rects = calendarRef.current.querySelectorAll("rect[data-date]");
      rects.forEach((rect) => {
        const date = rect.getAttribute("data-date");
        const contribution = contributions.find((c) => c.date === date);
        const count = contribution?.count || 0;
        rect.setAttribute("data-tooltip-id", "github-tooltip");
        rect.setAttribute("data-tooltip-content", formatTooltip(date, count));
      });
    }
  }, [loading, contributions]);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading GitHub contributions...
          </p>
        </div>
      </section>
    );
  }

  if (contributions.length === 0) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No GitHub contributions available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-12 relative overflow-hidden bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/20"
          >
            Open Source
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Git Contributions
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            My recent activity and contributions to the developer community.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <MotionDiv
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial="hidden"
          animate="visible"
          variants={statVariants}
        >
          {[
            { label: "Total Contributions", value: stats.totalContributions, color: "text-green-600 dark:text-green-400" },
            { label: "Current Streak", value: stats.currentStreak, color: "text-blue-600 dark:text-blue-400" },
            { label: "Best Streak", value: stats.maxStreak, color: "text-purple-600 dark:text-purple-400" },
            { label: "This Month", value: stats.thisMonth, color: "text-pink-600 dark:text-pink-400" },
          ].map((stat, i) => (
            <MotionDiv
              key={i}
              className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg"
              variants={statVariants}
            >
              <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>
                <CountingNumber end={stat.value} />
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>

        {/* Calendar Card */}
        <MotionDiv
          className="bg-white dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-700/50 flex justify-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div
            className="w-full max-w-[850px] text-center"
            ref={calendarRef}
            id="calendar-wrapper"
          >
            <GitHubCalendar
              username={undefined}
              transformData={() => transformedContributions}
              colorScheme={theme === "dark" ? "dark" : "light"}
              colors={
                theme === "dark"
                  ? ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
                  : ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
              }
              fontSize={12}
              blockSize={12}
              blockMargin={4}
              style={{ width: "100%", margin: "0 auto" }}
            />
            <ReactTooltip id="github-tooltip" className="custom-tooltip" />
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};

export default GitContribution;
