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

  // No need for data fetching effect as data is passed from server-side props
  useEffect(() => {
    // Suppress console errors related to GitHub contribution data
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
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="max-w-5xl mx-auto">
        <MotionDiv
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

          <MotionDiv
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial="hidden"
            animate="visible"
            variants={statVariants}
          >
            {[
              stats.totalContributions,
              stats.currentStreak,
              stats.maxStreak,
              stats.thisMonth,
            ].map((value, i) => (
              <MotionDiv
                key={["total", "current", "max", "month"][i]}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4 rounded-2xl"
                variants={statVariants}
              >
                <MotionDiv
                  className={`text-2xl font-bold ${
                    [
                      "text-green-600 dark:text-green-400",
                      "text-blue-600 dark:text-blue-400",
                      "text-purple-600 dark:text-purple-400",
                      "text-pink-600 dark:text-pink-400",
                    ][i]
                  }`}
                  variants={statVariants}
                >
                  <CountingNumber end={value} />
                </MotionDiv>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {
                    [
                      "Total Contributions",
                      "Current Streak",
                      "Best Streak",
                      "This Month",
                    ][i]
                  }
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/20 dark:border-gray-700/30 flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div
            className="w-full max-w-[800px] text-center"
            ref={calendarRef}
            id="calendar-wrapper"
          >
            <GitHubCalendar
              username={undefined}
              transformData={() => transformedContributions}
              colorScheme={theme === "dark" ? "dark" : "light"}
              colors={
                theme === "dark"
                  ? ["#0d1117", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
                  : ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]
              }
              fontSize={10}
              blockSize={10}
              blockMargin={3}
              hideColorLegend={false}
              hideMonthLabels={false}
              hideTotalCount={false}
              showWeekdayLabels={true}
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
