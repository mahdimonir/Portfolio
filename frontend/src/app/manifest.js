import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export default function manifest() {
  return {
    name: APP_NAME,
    short_name: "Mahdi Portfolio",
    description: APP_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e17",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/og-image.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
