import { NextResponse } from "next/server";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export async function GET(request) {
  const { GITHUB_USERNAME, GITHUB_TOKEN } = process.env;
  if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "Username or token missing" },
      { status: 400 }
    );
  }

  const cacheKey = `github_${GITHUB_USERNAME}`;
  const cached = cache.get(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
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

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error("Failed to fetch GitHub data");

    const data = await response.json();
    const calendar =
      data.data.user.contributionsCollection.contributionCalendar;

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

    const responseData = {
      contributions: contributionData,
      totalContributions,
      currentStreak,
      maxStreak,
      thisMonth,
    };
    cache.set(cacheKey, responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("GitHub API error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
