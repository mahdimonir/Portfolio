import JsonLd from "@/components/global/JsonLd";
import { MotionDiv, MotionHeader } from "@/components/ui/motion";
import { APP_NAME } from "@/lib/constants";
import { fetchAPI } from "@/lib/fetchApi";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaUser,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

// Generate static params for all blog slugs
export async function generateStaticParams() {
  try {
    const response = await fetchAPI("/blogs", { next: { tags: ["blogs"] } });
    const blogs = response.data || [];

    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for blogs:", error);
    return [];
  }
}

async function getBlog(slug) {
  try {
    const response = await fetchAPI(`/blogs/slug/${slug}`, { next: { tags: ["blogs", `blog-${slug}`] } });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mahdi.dev" || "https://moniruzzaman-mahdi.vercel.app";

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The blog post you are looking for does not exist.",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: `${blog.title} | ${APP_NAME}`,
      description: blog.excerpt,
      url: `${baseUrl}/blogs/${slug}`,
      images: blog.coverImage?.url ? [{ url: blog.coverImage.url }] : [],
      type: "article",
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: [blog.author?.name || APP_NAME],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage?.url ? [blog.coverImage.url] : [],
    },
  };
}

const BlogPage = async (props) => {
  const { slug } = await props.params;
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_APP_URL || "https://mahdimonir.info",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${process.env.NEXT_PUBLIC_APP_URL || "https://mahdimonir.info"}/blogs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage?.url,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author?.name || "Moniruzzaman Mahdi",
    },
    publisher: {
      "@type": "Organization",
      name: "Moniruzzaman Mahdi",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://mahdimonir.info"}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_APP_URL || "https://mahdimonir.info"}/blogs/${slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-500">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />
      <div className="relative">
        <main className="pb-20 pt-8">
          <article className="max-w-4xl mx-auto px-4">
            <MotionDiv
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
            </MotionDiv>

            <MotionHeader
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
            </MotionHeader>

            {blog.image?.url && (
              <MotionDiv
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
              </MotionDiv>
            )}

            <MotionDiv
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-lg border border-white/20 dark:border-gray-700/30 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-white prose-a:text-blue-600 hover:prose-a:text-blue-500">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </div>
            </MotionDiv>

            {blog.author && (
              <MotionDiv
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
              </MotionDiv>
            )}
          </article>
        </main>
      </div>
    </div>
  );
};

export default BlogPage;