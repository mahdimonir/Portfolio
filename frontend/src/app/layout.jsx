import { ClientWrapper } from "@/components/global/ClientWrapper";
import {
  APP_DESCRIPTION,
  APP_KEYWORDS,
  APP_NAME,
  APP_SLOGAN,
} from "@/lib/constants";
import "./globals.css";

export const metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME} • ${APP_SLOGAN}`,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
};

export default function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body> */}
      <body className="min-h-screen flex flex-col">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
