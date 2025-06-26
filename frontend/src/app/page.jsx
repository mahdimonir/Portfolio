import FeaturedProjects from "@/components/FeaturedProjects";
import GitContributionCalendar from "@/components/GitContributionCalendar";
import Hero from "@/components/Hero";
import PopularBlogs from "@/components/PopularBlogs";
import TechStack from "@/components/TechStack";
import Testimonials from "@/components/Testimonials";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <div className="relative">
        <main className="pb-20">
          <Hero />
          <TechStack />
          <FeaturedProjects />
          <PopularBlogs />
          <Testimonials />
          <GitContributionCalendar />
        </main>
      </div>
    </div>
  );
};

export default Page;
