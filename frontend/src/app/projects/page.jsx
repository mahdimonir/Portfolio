import TechList from "@/components/projects/TechList";
import {
  MotionA,
  MotionDiv,
  containerVariants,
  itemVariants,
} from "@/components/ui/motion";
import serverAxios from "@/lib/serverAxios";
import Link from "next/link";
import {
  FaArrowLeft,
  FaExternalLinkAlt,
  FaGithub,
  FaProjectDiagram,
} from "react-icons/fa";

// Define the revalidation time (24 hours)
export const revalidate = 86400;

// Using pre-defined animation variants from the motion component

async function getProjects() {
  try {
    const response = await serverAxios.get("/projects");
    return response.data.data.map((project) => ({
      ...project,
      id: project._id,
      tech: Array.isArray(project.tech)
        ? project.tech.map((techItem) => ({
            name: techItem.name || "Unknown",
            icon: techItem.icon || "FaQuestionCircle",
            color: techItem.color || "text-gray-500",
          }))
        : [],
      category: project.category?.category || "Uncategorized",
      image: project.image || "/fallback-image.png",
      images: Array.isArray(project.images)
        ? project.images.map((img) => img.url)
        : [],
    }));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

const Page = async () => {
  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <div className="py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <FaProjectDiagram className="text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No projects found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Looks like there are no projects available at the moment. Check back
            later!
          </p>
          <Link
            href="/"
            className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <div className="relative">
        <main className="pb-20 pt-8">
          <div className="max-w-7xl mx-auto px-4">
            <MotionDiv
              className="mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-6"
              >
                <FaArrowLeft />
                Back to Home
              </Link>

              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Projects
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                A collection of projects I've worked on, showcasing different
                technologies and problem-solving approaches.
              </p>
            </MotionDiv>

            <MotionDiv
              className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {projects.map((project) => (
                <MotionDiv
                  key={project.id}
                  variants={itemVariants}
                  className="group relative"
                >
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/30">
                    <div className="relative overflow-hidden h-64">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600/90 text-white text-sm font-medium rounded-full">
                          {project.category}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {project.github && (
                          <MotionA
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaGithub size={16} />
                          </MotionA>
                        )}
                        <MotionA
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaExternalLinkAlt size={16} />
                        </MotionA>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                        {project.description}
                      </p>

                      <TechList techs={project.tech} cardId={project.id} />

                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                      >
                        View Details
                        <MotionDiv
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          →
                        </MotionDiv>
                      </Link>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
