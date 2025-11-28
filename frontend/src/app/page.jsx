import Experience from "@/components/homepage/Experience";
import FeaturedProjects from "@/components/homepage/FeaturedProjects";
import GitContribution from "@/components/homepage/GitContribution";
import Hero from "@/components/homepage/Hero";
import Services from "@/components/homepage/Services";
import TechStack from "@/components/homepage/TechStack";
import Testimonials from "@/components/homepage/Testimonials";
import { fetchAPI } from "@/lib/fetchApi";

// Define the revalidation time (24 hours)
// Define the revalidation time (removed to allow granular control via fetch tags)
// export const revalidate = 86400;

async function fetchData(endpoint, tags = []) {
  try {
    const res = await fetchAPI(endpoint, { next: { tags } });
    return res.data || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

// Import the GitHub data fetching function
import { fetchGitHubData } from "@/lib/github";

export default async function Page() {
  // Fetch data for all sections
  const [user, techStacks, projects, services, experiences, testimonials, githubData] =
    await Promise.all([
      fetchData("/me/public", ["homepage"]),
      fetchData("/techstacks", ["homepage", "techstack"]),
      fetchData("/projects?featured=true", ["homepage", "projects"]),
      fetchData("/services", ["homepage", "services"]),
      fetchData("/experiences", ["homepage", "experience"]),
      fetchData("/testimonials", ["homepage", "testimonials"]),
      fetchGitHubData(),
    ]);

  // Transform projects to match FeaturedProjects structure
  const transformedProjects = projects.map((project) => ({
    ...project,
    id: project._id || project.id,
    name: project.slug,
    tech: Array.isArray(project.tech)
      ? project.tech.map((techItem) => ({
          name: techItem.name || "Unknown",
          icon: techItem.icon || "Fa/FaQuestionCircle",
        }))
      : [],
    status: project.status || "Completed",
    image: project.image || "/fallback-image.png",
    github: project.github || `${user.socialLinks.github}/${project.slug}`,
    demo: project.demo || `https://${project.slug}.vercel.app`,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <div className="relative">
        <main className="pb-20">
          <Hero {...user} />
          {techStacks.length > 0 && <TechStack techStacks={techStacks} />}
          {transformedProjects.length > 0 && (
            <FeaturedProjects projects={transformedProjects} />
          )}
          {services.length > 0 && <Services services={services} />}
          {experiences.length > 0 && <Experience experiences={experiences} />}
          {testimonials.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )}
          <GitContribution githubData={githubData} />
        </main>
      </div>
    </div>
  );
}
