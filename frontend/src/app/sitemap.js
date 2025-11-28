import serverAxios from "@/lib/serverAxios";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";

  // Static routes
  const routes = ["", "/projects", "/blogs", "/services", "/about", "/contact"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: route === "" ? 1 : 0.8,
    })
  );

  // Dynamic Blog routes
  let blogRoutes = [];
  try {
    const blogsResponse = await serverAxios.get("/blogs");
    const blogs = blogsResponse.data.data || [];
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
  }

  // Dynamic Project routes
  let projectRoutes = [];
  try {
    const projectsResponse = await serverAxios.get("/projects");
    const projects = projectsResponse.data.data || [];
    projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt || project.createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
  }

  return [...routes, ...blogRoutes, ...projectRoutes];
}
