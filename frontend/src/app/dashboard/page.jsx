"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Analytics from "./components/Analytics";
import BlogForm from "./components/BlogForm";
import { DashboardSidebar } from "./components/DashboardSidebar";
import MessagesPanel from "./components/MessagesPanel";
import Overview from "./components/Overview";
import ResumeMaker from "./components/ResumeMaker";
import Settings from "./components/Settings";
import UserProfileForm from "./components/UserProfileForm";
import WorksManager from "./components/WorksManager";

const Page = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Sync with DashboardSidebar
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const loginStatus = localStorage.getItem("isLoggedIn");
      const isAuthenticated = loginStatus === "true";

      setIsLoggedIn(isAuthenticated);
      setIsLoading(false);

      if (!isAuthenticated) {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "analytics":
        return <Analytics />;
      case "works":
        return <WorksManager />;
      case "blogs":
        return <BlogForm />;
      case "messages":
        return <MessagesPanel />;
      case "resume":
        return <ResumeMaker />;
      case "profile":
        return <UserProfileForm />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 min-h-screen">
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggle={setSidebarCollapsed}
      />
      <div
        className={`p-2 md:p-5 lg:p-8 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;
