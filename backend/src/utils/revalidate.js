import axios from "axios";

export const revalidate = async (tag) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL;
    const token = process.env.REVALIDATION_TOKEN;

    if (!frontendUrl || !token) {
      console.warn("Missing FRONTEND_URL or REVALIDATION_TOKEN for revalidation");
      return;
    }

    await axios.post(
      `${frontendUrl}/api/revalidate?tag=${tag}&token=${token}`
    );
    console.log(`Revalidation triggered for tag: ${tag}`);
  } catch (error) {
    console.error(`Failed to revalidate tag ${tag}:`, error.message);
  }
};
