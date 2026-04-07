import FeaturedProjects from "@/components/homepage/FeaturedProjects";
import GitContribution from "@/components/homepage/GitContribution";
import Hero from "@/components/homepage/Hero";
import MyJourney from "@/components/homepage/MyJourney";
import Services from "@/components/homepage/Services";
import TechStack from "@/components/homepage/TechStack";
import Testimonials from "@/components/homepage/Testimonials";
import { fetchAPI } from "@/lib/fetchApi";
import { fetchGitHubData } from "@/lib/github";

// Static Data for new sections
import { courses } from "@/data/courses";
import { education } from "@/data/education";

async function fetchData(endpoint, tags = []) {
  try {
    const res = await fetchAPI(endpoint, { next: { tags } });
    return res.data || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

export default async function Page() {
  const [user, techStacks, projects, services, experiences, testimonials, githubData] =
    await Promise.all([
      fetchData("/me/public", ["hero", "homepage"]),
      fetchData("/techstacks", ["techstack", "homepage"]),
      fetchData("/projects?featured=true", ["projects", "featured-projects", "homepage"]),
      fetchData("/services", ["services", "homepage"]),
      fetchData("/experiences", ["experiences", "homepage"]),
      fetchData("/testimonials", ["testimonials", "homepage"]),
      fetchGitHubData(),
    ]);

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
    github: project.github || `${user.socialLinks?.github || "https://github.com/mahdimonir"}/${project.slug}`,
    demo: project.demo || `https://${project.slug}.vercel.app`,
  }));

  return (
    <div className="min-h-screen mesh-gradient-light transition-all duration-500">
      <div className="relative">
        <main className="pb-32">
          <Hero {...user} />
          
          {techStacks.length > 0 && <TechStack techStacks={techStacks} />}
          
          {transformedProjects.length > 0 && (
            <FeaturedProjects projects={transformedProjects} />
          )}
          
          {services.length > 0 && <Services services={services} />}
          
          <MyJourney 
            experiences={experiences} 
            education={education} 
            courses={courses} 
          />
          
          {testimonials.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )}
          
          <div className="py-24">
            <GitContribution githubData={githubData} />
          </div>
        </main>
      </div>
    </div>
  );
}
