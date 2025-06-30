import Experience from "@/components/homepage/Experience";
import FeaturedProjects from "@/components/homepage/FeaturedProjects";
import GitContribution from "@/components/homepage/GitContribution";
import Hero from "@/components/homepage/Hero";
import Services from "@/components/homepage/Services";
import TechStack from "@/components/homepage/TechStack";
import Testimonials from "@/components/homepage/Testimonials";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <div className="relative">
        <main className="pb-20">
          <Hero />
          <TechStack />
          <FeaturedProjects />
          <Services />
          <Experience />
          <Testimonials />
          <GitContribution />
        </main>
      </div>
    </div>
  );
};

export default Page;
