import axios from "axios";

export const dynamic = "force-dynamic";
export const revalidate = 3600; 

const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export default async function sitemap() {
  // Static routes
  const staticRoutes = ["", "/projects", "/blogs", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const urls = [...staticRoutes];

  try {
    const [blogsRes, projectsRes] = await Promise.all([
      publicAxios.get("/blogs").catch(() => ({ data: { data: [] } })),
      publicAxios.get("/projects").catch(() => ({ data: { data: [] } })),
    ]);

    // Blogs
    for (const blog of blogsRes.data.data || []) {
      if (blog.slug && blog.published !== false) {
        urls.push({
          url: `${baseUrl}/blogs/${blog.slug}`,
          lastModified: new Date(blog.updatedAt || blog.createdAt).toISOString(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }

    // Projects
    for (const project of projectsRes.data.data || []) {
      if (project.slug && project.published !== false) {
        urls.push({
          url: `${baseUrl}/projects/${project.slug}`,
          lastModified: new Date(project.updatedAt || project.createdAt).toISOString(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch (error) {
    console.warn("Sitemap: API unavailable during build → using static routes only", error.message);
  }

  return urls;
}