import { MotionArticle, MotionDiv, containerVariants, itemVariants } from "@/components/ui/motion";
import { fetchAPI } from "@/lib/fetchApi";
import Link from "next/link";
import {
  FaArrowLeft,
  FaBlog,
  FaCalendarAlt,
  FaClock,
  FaTag,
} from "react-icons/fa";

// Define the revalidation time (24 hours)
// Define the revalidation time (removed to allow granular control via fetch tags)
// export const revalidate = 86400;

// Using pre-defined animation variants from the motion component

async function getBlogs() {
  try {
    const response = await fetchAPI("/blogs", { next: { tags: ["blogs"] } });
    return response.data.map((blog) => ({
      ...blog,
      id: blog._id,
      image: blog.image || "/fallback-image.png",
      author: blog.author || null,
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      category: blog.category || "Uncategorized",
    }));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

const Page = async () => {
  const blogs = await getBlogs();

  if (blogs.length === 0) {
    return (
      <div className="py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <FaBlog className="text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No blog articles found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Looks like there are no blog posts available at the moment. Check back later!</p>
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
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
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
                Blog Articles
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                Thoughts, tutorials, and insights about web development,
                technology, and programming.
              </p>
            </MotionDiv>

            {/* Blogs Grid */}
            <MotionDiv
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {blogs.map((blog) => (
                <MotionArticle
                  key={blog._id}
                  variants={itemVariants}
                  className="group relative"
                >
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/30 h-full">
                    {/* Blog Image */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={blog.coverImage?.url || "/fallback-image.png"}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-purple-600/90 text-white text-sm font-medium rounded-full">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6">
                      <div className="flex-grow">
                        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="space-y-4 mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt size={12} />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaClock size={12} />
                            {blog.readingTime} min read
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {(blog.tags || []).slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-full flex items-center gap-1"
                            >
                              <FaTag size={8} />
                              {tag}
                            </span>
                          ))}
                          {blog.tags?.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              +{blog.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Read More Link */}
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                      >
                        Read More
                        <MotionDiv
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          →
                        </MotionDiv>
                      </Link>
                    </div>
                  </div>
                </MotionArticle>
              ))}
            </MotionDiv>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
