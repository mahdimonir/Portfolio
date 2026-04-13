import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "Contact",
  description: `Get in touch with ${APP_NAME}. Whether you have a project in mind, a question, or just want to say hello, I'm always open to new opportunities and conversations.`,
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }) {
  return children;
}
