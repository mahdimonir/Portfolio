"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaBell,
  FaEye,
  FaEyeSlash,
  FaGlobe,
  FaKey,
  FaLock,
  FaPalette,
  FaSave,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { toast } from "sonner";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      bio: "Full-stack developer passionate about creating amazing web experiences.",
      website: "https://johndoe.dev",
      avatar: "",
    },
    appearance: {
      theme: "system",
      accentColor: "#3B82F6",
      fontSize: "medium",
      animations: true,
      compactMode: false,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      projectUpdates: true,
      comments: true,
      mentions: true,
      newsletter: false,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
      allowIndexing: true,
      analyticsTracking: true,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordStrength: "strong",
    },
    integrations: {
      github: "",
      linkedin: "",
      twitter: "",
      behance: "",
      dribbble: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "privacy", label: "Privacy", icon: FaLock },
    { id: "security", label: "Security", icon: FaKey },
    { id: "integrations", label: "Integrations", icon: FaGlobe },
  ];

  // ... keep existing code (useEffect, handleSave, handleReset, handlePasswordChange functions)

  useEffect(() => {
    const savedSettings = localStorage.getItem("dashboardSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      localStorage.removeItem("dashboardSettings");
      setSettings({
        profile: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          bio: "Full-stack developer passionate about creating amazing web experiences.",
          website: "https://johndoe.dev",
          avatar: "",
        },
        appearance: {
          theme: "system",
          accentColor: "#3B82F6",
          fontSize: "medium",
          animations: true,
          compactMode: false,
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          projectUpdates: true,
          comments: true,
          mentions: true,
          newsletter: false,
        },
        privacy: {
          profileVisibility: "public",
          showEmail: false,
          showPhone: false,
          allowIndexing: true,
          analyticsTracking: true,
        },
        security: {
          twoFactor: false,
          loginAlerts: true,
          sessionTimeout: 30,
          passwordStrength: "strong",
        },
        integrations: {
          github: "",
          linkedin: "",
          twitter: "",
          behance: "",
          dribbble: "",
        },
      });
      toast.success("Settings reset to default");
    }
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    toast.success("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // ... keep existing code (renderTabContent function with all tab cases)

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={settings.profile.firstName}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, firstName: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={settings.profile.lastName}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, lastName: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, email: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.profile.phone}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, phone: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                value={settings.profile.bio}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, bio: e.target.value },
                  }))
                }
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Appearance Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={settings.appearance.theme}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      appearance: { ...prev.appearance, theme: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size
                </label>
                <select
                  value={settings.appearance.fontSize}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      appearance: {
                        ...prev.appearance,
                        fontSize: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Enable Animations
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Turn on/off page animations
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appearance.animations}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          animations: e.target.checked,
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Compact Mode
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reduce spacing for more content
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appearance.compactMode}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          compactMode: e.target.checked,
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Notification Settings
            </h3>

            <div className="space-y-4">
              {[
                {
                  key: "emailNotifications",
                  label: "Email Notifications",
                  desc: "Receive notifications via email",
                },
                {
                  key: "pushNotifications",
                  label: "Push Notifications",
                  desc: "Receive browser push notifications",
                },
                {
                  key: "projectUpdates",
                  label: "Project Updates",
                  desc: "Updates about your projects",
                },
                {
                  key: "comments",
                  label: "Comments",
                  desc: "When someone comments on your work",
                },
                {
                  key: "mentions",
                  label: "Mentions",
                  desc: "When someone mentions you",
                },
                {
                  key: "newsletter",
                  label: "Newsletter",
                  desc: "Monthly newsletter and updates",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key]}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [item.key]: e.target.checked,
                          },
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Security Settings
            </h3>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Change Password
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-12 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add extra security to your account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactor}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          twoFactor: e.target.checked,
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Login Alerts
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified of new login attempts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.loginAlerts}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          loginAlerts: e.target.checked,
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-gray-700/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h2>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium shadow-lg text-sm"
          >
            <FaSave size={14} />
            Save Changes
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-medium shadow-lg text-sm"
          >
            <FaTrash size={14} />
            Reset
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
