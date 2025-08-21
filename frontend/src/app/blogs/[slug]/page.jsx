import axios from "@/lib/axios";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaUser,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const getBlog = async (slug) => {
  try {
    const response = await axios.get(`/blogs/slug/${slug}`);
    return response.data.data;
  } catch (error) {
    // In a real app, you might want to log this error to a service
    console.error("Failed to fetch blog:", error);
    return null;
  }
};

const BlogPage = async ({ params }) => {
  const { slug } = params;
  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Blog Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The blog post you're looking for doesn't exist or couldn't be loaded.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500">
      <div className="relative">
        <main className="pb-20 pt-8">
          <article className="max-w-4xl mx-auto px-4">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <FaArrowLeft />
                Back to Blog
              </Link>
            </motion.div>

            <motion.header
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-purple-600/20 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                {blog.title}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {blog.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt size={14} />
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
                {blog.readingTime && (
                  <div className="flex items-center gap-2">
                    <FaClock size={14} />
                    {blog.readingTime} min read
                  </div>
                )}
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <FaUser size={14} />
                    {blog.author.name}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-sm rounded-full flex items-center gap-1"
                  >
                    <FaTag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.header>

            {blog.image?.url && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img
                  src={blog.image.url}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover rounded-3xl shadow-2xl"
                />
              </motion.div>
            )}

            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-lg border border-white/20 dark:border-gray-700/30 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-white prose-a:text-blue-600 hover:prose-a:text-blue-500">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </div>
            </motion.div>

            {blog.author && (
              <motion.div
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/20 dark:border-gray-700/30"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-6">
                  {blog.author.avatar?.url && (
                    <img
                      src={blog.author.avatar.url}
                      alt={blog.author.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      About {blog.author.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {blog.author.bio ||
                        "A passionate writer and developer."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </article>
        </main>
      </div>
    </div>
  );
};

export default BlogPage; 