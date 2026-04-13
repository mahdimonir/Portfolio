import { ClientWrapper } from "@/components/global/ClientWrapper";
import {
  APP_DESCRIPTION,
  APP_KEYWORDS,
  APP_NAME,
  APP_SLOGAN,
} from "@/lib/constants";
import "./globals.css";

import { fetchAPI } from "@/lib/fetchApi";

export async function generateMetadata() {
  let userAvatar = "/og-image.png"; // Fallback
  let siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetchAPI("/me/public");
    if (res.data?.avatar) {
      userAvatar = res.data.avatar;
    }
  } catch (error) {
    console.error("SEO: Failed to fetch user avatar for metadata", error);
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: `%s | ${APP_NAME}`,
      default: `${APP_NAME} • ${APP_SLOGAN}`,
    },
    description: APP_DESCRIPTION,
    keywords: APP_KEYWORDS,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${APP_NAME} • ${APP_SLOGAN}`,
      description: APP_DESCRIPTION,
      url: "./",
      siteName: APP_NAME,
      images: [
        {
          url: userAvatar,
          width: 800,
          height: 600,
          alt: `${APP_NAME} Portfolio`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${APP_NAME} • ${APP_SLOGAN}`,
      description: APP_DESCRIPTION,
      images: [userAvatar],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
    themeColor: "#0a0e17",
  };
}

import GoogleAnalytics from "@/components/global/GoogleAnalytics";

export default function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID} />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
