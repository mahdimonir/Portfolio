"use client";

import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { toast } from "sonner";

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    tagLines: [],
    about: "",
    contact: { phone: "", location: "", email: "" },
    socialLinks: { github: "", linkedin: "", twitter: "", discord: "" },
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/me");
      const data = response.data?.data;
      setFormData({
        fullName: data.fullName || "",
        tagLines: data.tagLines || [],
        about: data.about || "",
        contact: {
          phone: data.contact?.phone || "",
          location: data.contact?.location || "",
          email: data.contact?.email || "",
        },
        socialLinks: {
          github: data.socialLinks?.github || "",
          linkedin: data.socialLinks?.linkedin || "",
          twitter: data.socialLinks?.twitter || "",
          discord: data.socialLinks?.discord || "",
        },
      });
      setAvatarPreview(data.avatar?.url || null);
      setResumePreview(data.resume?.url || null);
    } catch (error) {
      toast.error("Failed to load profile data");
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else if (["phone", "location", "email"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [name]: value },
      }));
    } else if (name === "tagLines" && index !== null) {
      const newTagLines = [...formData.tagLines];
      newTagLines[index] = value;
      setFormData((prev) => ({
        ...prev,
        tagLines: newTagLines,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addTagLine = () => {
    setFormData((prev) => ({
      ...prev,
      tagLines: [...prev.tagLines, ""],
    }));
  };

  const removeTagLine = (index) => {
    setFormData((prev) => ({
      ...prev,
      tagLines: prev.tagLines.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "avatar") {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else if (type === "resume") {
        setResumeFile(file);
        setResumePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleFileUpload = async (type, file) => {
    if (!file) return;
    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append(type, file);

    try {
      await axios.patch(`/me/${type}`, formDataToSend);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated`);
      fetchUserProfile();
    } catch (error) {
      toast.error(`Failed to update ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.patch("/me/details", formData);
      toast.success("Details updated successfully");
    } catch (err) {
      toast.error("Failed to update details");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    setIsLoading(true);
    try {
      await axios.patch("/me/update-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-36 pt-6 md:pt-8 md:pb-24 lg:pt-12">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 md:p-8 space-y-8">
        {/* Tabs - Responsive with Scroll on Mobile */}
        <div className="flex overflow-x-auto scrollbar-hide justify-center border-b border-gray-200/50 dark:border-gray-700/50 pb-4 gap-1">
          {["profile", "avatar", "resume", "password"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-xl animate-spin"></div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && !isLoading && (
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Taglines
                </label>
                {formData.tagLines.length > 0 &&
                  formData.tagLines.map((tagLine, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        name="tagLines"
                        value={tagLine}
                        onChange={(e) => handleInputChange(e, index)}
                        placeholder={`Enter tagline ${index + 1}`}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeTagLine(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={addTagLine}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Add Tagline
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows={4}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  name="location"
                  value={formData.contact.location}
                  onChange={handleInputChange}
                  placeholder="Enter your location"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub
                </label>
                <input
                  name="social.github"
                  value={formData.socialLinks.github}
                  onChange={handleInputChange}
                  placeholder="Enter your GitHub profile"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  name="social.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleInputChange}
                  placeholder="Enter your LinkedIn profile"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  name="social.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleInputChange}
                  placeholder="Enter your Twitter profile"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discord
                </label>
                <input
                  name="social.discord"
                  value={formData.socialLinks.discord}
                  onChange={handleInputChange}
                  placeholder="Enter your Discord profile"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
            >
              Save Details
            </button>
          </form>
        )}

        {/* Avatar Tab */}
        {activeTab === "avatar" && !isLoading && (
          <div className="space-y-6">
            {avatarPreview && (
              <div className="flex justify-center">
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "avatar")}
                className="hidden"
                id="avatar-image-upload"
              />
              <label
                htmlFor="avatar-image-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FaUpload size={14} />
                Upload Image
              </label>
            </div>
            <button
              onClick={() => handleFileUpload("avatar", avatarFile)}
              className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-colors shadow-md"
            >
              Update Avatar
            </button>
          </div>
        )}

        {/* Resume Tab */}
        {activeTab === "resume" && !isLoading && (
          <div className="space-y-6">
            {resumePreview ? (
              <div className="flex justify-center">
                <iframe
                  src={`${resumePreview}#toolbar=0`}
                  title="Resume Preview"
                  className="w-full h-[350px] border-2 border-gray-300 dark:border-gray-600 rounded-xl"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No resume uploaded
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Resume
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, "resume")}
                className="hidden"
                id="resume-file-upload"
              />
              <label
                htmlFor="resume-file-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FaUpload size={14} />
                Upload Resume
              </label>
            </div>
            <button
              onClick={() => handleFileUpload("resume", resumeFile)}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
            >
              Update Resume
            </button>
            {resumePreview && (
              <a
                href={resumePreview}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-600 text-white py-2 rounded-xl text-center hover:bg-gray-700 transition-colors shadow-md block"
              >
                Download Resume
              </a>
            )}
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && !isLoading && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="Enter current password"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="Enter new password"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Confirm new password"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition-colors shadow-md"
            >
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileForm;
