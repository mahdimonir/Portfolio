import { getIconComponent } from "@/components/global/getIconComponent";
import { MotionA, MotionDiv } from "@/components/ui/motion";
import { fetchAPI } from "@/lib/fetchApi";
import Link from "next/link";
import {
  FaArrowLeft,
  FaExternalLinkAlt,
  FaGithub,
  FaProjectDiagram,
} from "react-icons/fa";

export async function generateStaticParams() {
  try {
    const response = await fetchAPI("/projects", { next: { tags: ["projects"] } });
    const projects = response.data || [];

    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for projects:", error);
    return [];
  }
}

async function getProject(slug) {
  try {
    const response = await fetchAPI(`/projects/${slug}`, { next: { tags: ["projects", `project-${slug}`] } });
    const projectData = response.data;

    if (!projectData) {
      return null;
    }

    return {
      ...projectData,
      id: projectData._id,
      tech: Array.isArray(projectData.tech)
        ? projectData.tech.map((techItem) => ({
            name: techItem.name || "Unknown",
            icon: techItem.icon || "FaQuestionCircle",
            color: techItem.color || "text-gray-500",
          }))
        : [],
      category: projectData.category?.category || "Uncategorized",
      image: projectData.image || "/fallback-image.png",
      images: Array.isArray(projectData.images)
        ? projectData.images.map((img) => img.url)
        : [],
    };
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The project you are looking for does not exist.",
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [{ url: project.image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : [],
    },
  };
}

const Page = async (props) => {
  const { slug } = await props.params;
  const project = await getProject(slug);

  if (!project) {
    return (
      <div className="py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <FaProjectDiagram className="text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Project not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Looks like this project is not available at the moment. Check back
            later!
          </p>
          <Link
            href="/projects"
            className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <div className="relative">
        <main className="pb-20 pt-8">
          <div className="max-w-4xl mx-auto px-4">
            <MotionDiv
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <FaArrowLeft />
                Back to Projects
              </Link>
            </MotionDiv>

            <MotionDiv
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                  {project.category}
                </span>
                <span className="px-4 py-2 bg-green-600/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                  {project.status}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {project.title}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-4">
                {project.github && (
                  <MotionA
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-full hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaGithub />
                    View Code
                  </MotionA>
                )}
                <MotionA
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaExternalLinkAlt />
                  Live Demo
                </MotionA>
              </div>
            </MotionDiv>

            <MotionDiv
              className="mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 md:h-96 object-cover rounded-3xl shadow-2xl"
              />
            </MotionDiv>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Technologies Info */}
              <MotionDiv
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Technologies Used
                </h3>
                <div className="space-y-3">
                  {Array.isArray(project.tech) && project.tech.length > 0 ? (
                    project.tech.map((tech, index) => {
                      const Icon = getIconComponent(tech.icon);
                      return (
                        <div key={index} className="flex items-center gap-3">
                          {Icon ? (
                            <Icon size={16} className={tech.color} />
                          ) : null}
                          <span className="text-gray-700 dark:text-gray-300">
                            {tech.name}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-red-500 text-sm">
                      No technologies listed
                    </p>
                  )}
                </div>
              </MotionDiv>

              {/* Project Info */}
              <MotionDiv
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Project Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Duration:
                    </span>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.duration}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Role:
                    </span>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.role}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Status:
                    </span>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.status}
                    </p>
                  </div>
                </div>
              </MotionDiv>

              {/* Client Info or Features Info */}
              {project.client &&
              ((project.client.type && project.client.name) ||
                (project.client.details &&
                  Object.keys(project.client.details).length > 0)) ? (
                <MotionDiv
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                    Client Info
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        Type:
                      </span>
                      <p className="text-gray-700 dark:text-gray-300">
                        {project.client?.type || "N/A"}
                      </p>
                    </div>
                    {project.client?.name && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Name:
                        </span>
                        <p className="text-gray-700 dark:text-gray-300">
                          {project.client.name}
                        </p>
                      </div>
                    )}
                    {project.client?.details && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Details:
                        </span>
                        <ul className="text-gray-700 dark:text-gray-300 text-sm list-disc list-inside">
                          {Object.entries(project.client.details).map(
                            ([key, value]) =>
                              value ? (
                                <li key={key}>
                                  <span className="capitalize">{key}:</span>{" "}
                                  {value}
                                </li>
                              ) : null
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </MotionDiv>
              ) : (
                <MotionDiv
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {project.features.slice(0, 4).map((feature, index) => (
                      <li
                        key={index}
                        className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2"
                      >
                        <span className="text-blue-500 mt-1">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </MotionDiv>
              )}
            </div>

            <MotionDiv
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/20 dark:border-gray-700/30 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                About This Project
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {project.longDescription}
              </p>

              <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                All Features
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </MotionDiv>

            <MotionDiv
              className="grid md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-2xl"
                >
                  <img
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </MotionDiv>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
