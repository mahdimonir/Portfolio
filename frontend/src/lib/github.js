import { fetchAPI } from "./fetchApi";

export async function fetchGitHubData() {
  try {
    const response = await fetchAPI("/github", {
      next: {
        revalidate: 3600,
        tags: ["github"],
      },
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return (
      response.data || {
        contributions: [],
        totalContributions: 0,
        currentStreak: 0,
        maxStreak: 0,
        thisMonth: 0,
      }
    );
  } catch (error) {
    console.error("GitHub API error:", error.message);
    return {
      contributions: [],
      totalContributions: 0,
      currentStreak: 0,
      maxStreak: 0,
      thisMonth: 0,
      loading: false,
      error: true,
    };
  }
}