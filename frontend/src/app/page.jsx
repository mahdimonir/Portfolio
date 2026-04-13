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
import JsonLd from "@/components/global/JsonLd";
import { courses } from "@/data/courses";
import { education } from "@/data/education";
import { APP_DESCRIPTION, APP_NAME, APP_SLOGAN } from "@/lib/constants";

export const metadata = {
  title: `${APP_NAME} • ${APP_SLOGAN}`,
  description: APP_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
};

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

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.fullName || "Moniruzzaman Mahdi",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://mahdi.dev" || "https://moniruzzaman-mahdi.vercel.app",
    image: user.avatar,
    jobTitle: "Full Stack Developer",
    sameAs: [
      user.socialLinks?.github,
      user.socialLinks?.linkedin,
      user.socialLinks?.twitter,
    ].filter(Boolean),
    description: user.about,
  };

  return (
    <div className="min-h-screen mesh-gradient-light transition-all duration-500">
      <JsonLd data={personSchema} />
      <div className="relative">
        <main className="pb-16">
          <Hero {...user} />
          
          {transformedProjects.length > 0 && (
            <FeaturedProjects projects={transformedProjects} />
          )}

          {techStacks.length > 0 && <TechStack techStacks={techStacks} />}
          
          {services.length > 0 && <Services services={services} />}
          
          <MyJourney 
            experiences={experiences} 
            education={education} 
            courses={courses} 
          />
          
          {testimonials.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )}
          
          <div className="py-16">
            <GitContribution githubData={githubData} />
          </div>
        </main>
      </div>
    </div>
  );
}
