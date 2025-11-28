import axios from "axios";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { revalidate } from "../utils/revalidate.js";

export const getGitHubData = asyncHandler(async (req, res) => {
  try {
    const { GITHUB_USERNAME, GITHUB_TOKEN } = process.env;

    if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
      return res.json(
        new ApiResponse(
          200,
          {
            contributions: [],
            totalContributions: 0,
            currentStreak: 0,
            maxStreak: 0,
            thisMonth: 0,
          },
          "GitHub credentials missing"
        )
      );
    }

    const query = `
      query {
        user(login: "${GITHUB_USERNAME}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      "https://api.github.com/graphql",
      { query },
      {
        headers: {
          Authorization: `bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    
    if (data.errors) {
        throw new Error(data.errors[0].message);
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;

    const contributions = {};
    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = day.date;
        const count = day.contributionCount;
        contributions[date] = count;
      });
    });

    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    let currentStreak = 0;
    let maxStreak = 0;
    let currentStreakStart = null;
    let totalContributions = calendar.totalContributions;

    const currentDate = new Date(oneYearAgo);
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const count = contributions[dateStr] || 0;

      if (count > 0) {
        if (!currentStreakStart) currentStreakStart = new Date(currentDate);
        currentStreak++;
      } else if (currentStreak > 0) {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 0;
        currentStreakStart = null;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    maxStreak = Math.max(maxStreak, currentStreak);

    const thisMonth = Object.entries(contributions)
      .filter(
        ([date]) =>
          new Date(date).getMonth() === today.getMonth() &&
          new Date(date).getFullYear() === today.getFullYear()
      )
      .reduce((sum, [, count]) => sum + count, 0);

    const contributionData = Object.entries(contributions).map(
      ([date, count]) => ({
        date,
        count,
        level:
          count === 0
            ? 0
            : count <= 3
            ? 1
            : count <= 6
            ? 2
            : count <= 9
            ? 3
            : 4,
      })
    );

    const result = {
      contributions: contributionData,
      totalContributions,
      currentStreak,
      maxStreak,
      thisMonth,
    };

    res.json(new ApiResponse(200, result, "GitHub data fetched successfully"));
  } catch (error) {
    console.error("GitHub API error:", error.message);
    res.json(
      new ApiResponse(
        200,
        {
          contributions: [],
          totalContributions: 0,
          currentStreak: 0,
          maxStreak: 0,
          thisMonth: 0,
        },
        "Failed to fetch GitHub data"
      )
    );
  }
});

export const revalidateGitHub = asyncHandler(async (req, res) => {
    await revalidate("github");
    res.json(new ApiResponse(200, null, "GitHub cache revalidated"));
});
