export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mahdi.dev" || "https://moniruzzaman-mahdi.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
