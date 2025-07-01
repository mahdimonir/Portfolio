"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaDownload,
  FaEye,
  FaFont,
  FaGripVertical,
  FaPalette,
  FaPlus,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { toast } from "sonner";

const ResumeMaker = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [draggedItem, setDraggedItem] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const dragRef = useRef(null);

  const templates = [
    { id: "modern", name: "Modern", preview: "/api/placeholder/300/400" },
    { id: "classic", name: "Classic", preview: "/api/placeholder/300/400" },
    { id: "creative", name: "Creative", preview: "/api/placeholder/300/400" },
    { id: "minimal", name: "Minimal", preview: "/api/placeholder/300/400" },
  ];

  const colorPalettes = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  const fonts = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Source Sans Pro",
    "Poppins",
    "Nunito",
  ];

  const [resumeSections, setResumeSections] = useState([
    { id: "personal", name: "Personal Info", required: true, enabled: true },
    {
      id: "summary",
      name: "Professional Summary",
      required: false,
      enabled: true,
    },
    {
      id: "experience",
      name: "Work Experience",
      required: true,
      enabled: true,
    },
    { id: "education", name: "Education", required: true, enabled: true },
    { id: "skills", name: "Skills", required: false, enabled: true },
    { id: "projects", name: "Projects", required: false, enabled: false },
    {
      id: "certifications",
      name: "Certifications",
      required: false,
      enabled: false,
    },
    { id: "languages", name: "Languages", required: false, enabled: false },
  ]);

  const [userData, setUserData] = useState({
    personal: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
      website: "johndoe.dev",
    },
    summary:
      "Experienced full-stack developer with 5+ years in building scalable web applications using modern technologies.",
    experience: [
      {
        id: 1,
        company: "Tech Company",
        position: "Senior Developer",
        duration: "2022 - Present",
        location: "San Francisco, CA",
        description:
          "Led development of multiple web applications using React, Node.js, and cloud services.",
      },
    ],
    education: [
      {
        id: 1,
        institution: "University of Technology",
        degree: "Bachelor of Computer Science",
        duration: "2016 - 2020",
        location: "California, USA",
        gpa: "3.8/4.0",
      },
    ],
    skills: {
      technical: ["JavaScript", "React", "Node.js", "Python", "AWS"],
      soft: ["Leadership", "Communication", "Problem Solving", "Team Work"],
    },
    projects: [
      {
        id: 1,
        name: "E-commerce Platform",
        description: "Full-stack web application with payment integration",
        technologies: ["React", "Node.js", "MongoDB"],
        link: "github.com/johndoe/ecommerce",
      },
    ],
    certifications: [
      {
        id: 1,
        name: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023",
        credential: "ABC123XYZ",
      },
    ],
    languages: [
      { name: "English", level: "Native" },
      { name: "Spanish", level: "Intermediate" },
    ],
  });

  const handleSectionToggle = (sectionId) => {
    if (resumeSections.find((s) => s.id === sectionId)?.required) {
      toast.error("Cannot disable required sections");
      return;
    }

    setResumeSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
    toast.success("Section updated successfully");
  };

  const handleSectionReorder = (dragIndex, dropIndex) => {
    const newSections = [...resumeSections];
    const draggedSection = newSections[dragIndex];
    newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, draggedSection);
    setResumeSections(newSections);
    toast.success("Sections reordered successfully");
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: "",
      position: "",
      duration: "",
      location: "",
      description: "",
    };
    setUserData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const removeExperience = (id) => {
    setUserData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
    toast.success("Experience removed");
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      institution: "",
      degree: "",
      duration: "",
      location: "",
      gpa: "",
    };
    setUserData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const removeEducation = (id) => {
    setUserData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
    toast.success("Education removed");
  };

  const handleSave = () => {
    localStorage.setItem(
      "resumeData",
      JSON.stringify({
        userData,
        selectedTemplate,
        selectedColor,
        selectedFont,
        resumeSections,
      })
    );
    toast.success("Resume saved successfully!");
  };

  const handleDownload = () => {
    toast.success("Generating PDF... Download will start shortly");
    // PDF generation logic would go here
  };

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    toast.success(isPreviewMode ? "Edit mode enabled" : "Preview mode enabled");
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-gray-700/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Resume Maker
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-xl font-medium shadow-lg text-sm"
          >
            <FaSave size={14} />
            Save
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreview}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-lg text-sm"
          >
            <FaEye size={14} />
            {isPreviewMode ? "Edit" : "Preview"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-xl font-medium shadow-lg text-sm"
          >
            <FaDownload size={14} />
            Download PDF
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Customization Panel */}
        <div className="xl:col-span-1 space-y-6">
          {/* Template Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Templates
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`cursor-pointer rounded-xl p-3 border-2 transition-all duration-300 ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                  }`}
                >
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Preview</span>
                  </div>
                  <p className="text-sm font-medium text-center text-gray-900 dark:text-white">
                    {template.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaPalette size={16} />
              Color Scheme
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {colorPalettes.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-4 transition-all duration-300 ${
                    selectedColor === color
                      ? "border-gray-900 dark:border-white scale-110"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaFont size={16} />
              Font Family
            </h3>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Section Manager */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaGripVertical size={16} />
              Resume Sections
            </h3>
            <div className="space-y-2">
              {resumeSections.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/30"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => handleSectionToggle(section.id)}
                      disabled={section.required}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {section.name}
                    </span>
                    {section.required && (
                      <span className="text-xs text-red-500 font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        handleSectionReorder(index, Math.max(0, index - 1))
                      }
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                    >
                      <FaArrowUp size={12} />
                    </button>
                    <button
                      onClick={() =>
                        handleSectionReorder(
                          index,
                          Math.min(resumeSections.length - 1, index + 1)
                        )
                      }
                      disabled={index === resumeSections.length - 1}
                      className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                    >
                      <FaArrowDown size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resume Editor */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 min-h-[800px]">
            {!isPreviewMode ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Resume Editor
                </h3>

                {/* Personal Information */}
                {resumeSections.find((s) => s.id === "personal")?.enabled && (
                  <div className="mb-8">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={userData.personal.fullName}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            personal: {
                              ...userData.personal,
                              fullName: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={userData.personal.email}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            personal: {
                              ...userData.personal,
                              email: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={userData.personal.phone}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            personal: {
                              ...userData.personal,
                              phone: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={userData.personal.location}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            personal: {
                              ...userData.personal,
                              location: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="LinkedIn"
                        value={userData.personal.linkedin}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            personal: {
                              ...userData.personal,
                              linkedin: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="GitHub"
                        value={userData.personal.github}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            personal: {
                              ...userData.personal,
                              github: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Professional Summary */}
                {resumeSections.find((s) => s.id === "summary")?.enabled && (
                  <div className="mb-8">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Professional Summary
                    </h4>
                    <textarea
                      placeholder="Write a brief professional summary..."
                      value={userData.summary}
                      onChange={(e) =>
                        setUserData({ ...userData, summary: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                )}

                {/* Work Experience */}
                {resumeSections.find((s) => s.id === "experience")?.enabled && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                        Work Experience
                      </h4>
                      <button
                        onClick={addExperience}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        <FaPlus size={12} />
                        Add
                      </button>
                    </div>
                    <div className="space-y-4">
                      {userData.experience.map((exp, index) => (
                        <div
                          key={exp.id}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              Experience {index + 1}
                            </h5>
                            {userData.experience.length > 1 && (
                              <button
                                onClick={() => removeExperience(exp.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = userData.experience.map((item) =>
                                  item.id === exp.id
                                    ? { ...item, company: e.target.value }
                                    : item
                                );
                                setUserData({
                                  ...userData,
                                  experience: newExp,
                                });
                              }}
                              className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Position"
                              value={exp.position}
                              onChange={(e) => {
                                const newExp = userData.experience.map((item) =>
                                  item.id === exp.id
                                    ? { ...item, position: e.target.value }
                                    : item
                                );
                                setUserData({
                                  ...userData,
                                  experience: newExp,
                                });
                              }}
                              className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Duration (e.g., 2020-2023)"
                              value={exp.duration}
                              onChange={(e) => {
                                const newExp = userData.experience.map((item) =>
                                  item.id === exp.id
                                    ? { ...item, duration: e.target.value }
                                    : item
                                );
                                setUserData({
                                  ...userData,
                                  experience: newExp,
                                });
                              }}
                              className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Location"
                              value={exp.location}
                              onChange={(e) => {
                                const newExp = userData.experience.map((item) =>
                                  item.id === exp.id
                                    ? { ...item, location: e.target.value }
                                    : item
                                );
                                setUserData({
                                  ...userData,
                                  experience: newExp,
                                });
                              }}
                              className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                          <textarea
                            placeholder="Job description and achievements..."
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = userData.experience.map((item) =>
                                item.id === exp.id
                                  ? { ...item, description: e.target.value }
                                  : item
                              );
                              setUserData({ ...userData, experience: newExp });
                            }}
                            rows={3}
                            className="w-full mt-3 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resumeSections.find((s) => s.id === "education")?.enabled && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                        Education
                      </h4>
                      <button
                        onClick={addEducation}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        <FaPlus size={12} />
                        Add
                      </button>
                    </div>
                    <div className="space-y-4">
                      {userData.education.map((edu, index) => (
                        <div
                          key={edu.id}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              Education {index + 1}
                            </h5>
                            {userData.education.length > 1 && (
                              <button
                                onClick={() => removeEducation(edu.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) => {
                                const newEdu = userData.education.map((item) =>
                                  item.id === edu.id
                                    ? { ...item, institution: e.target.value }
                                    : item
                                );
                                setUserData({ ...userData, education: newEdu });
                              }}
                              className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Degree"
                              value={edu.degree}
                              onChange={(e) => {
                                const newEdu = userData.education.map((item) =>
                                  item.id === edu.id
                                    ? { ...item, degree: e.target.value }
                                    : item
                                );
                                setUserData({ ...userData, education: newEdu });
                              }}
                              className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Duration (e.g., 2016-2020)"
                              value={edu.duration}
                              onChange={(e) => {
                                const newEdu = userData.education.map((item) =>
                                  item.id === edu.id
                                    ? { ...item, duration: e.target.value }
                                    : item
                                );
                                setUserData({ ...userData, education: newEdu });
                              }}
                              className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm"
                            />
                            <input
                              type="text"
                              placeholder="GPA (optional)"
                              value={edu.gpa}
                              onChange={(e) => {
                                const newEdu = userData.education.map((item) =>
                                  item.id === edu.id
                                    ? { ...item, gpa: e.target.value }
                                    : item
                                );
                                setUserData({ ...userData, education: newEdu });
                              }}
                              className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Preview Mode
              <div
                className="resume-preview"
                style={{
                  fontFamily: selectedFont,
                  color: selectedColor,
                }}
              >
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold mb-2">
                    {userData.personal.fullName}
                  </h1>
                  <div className="text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                      {userData.personal.email} | {userData.personal.phone}
                    </p>
                    <p>{userData.personal.location}</p>
                    <p>
                      {userData.personal.linkedin} | {userData.personal.github}
                    </p>
                  </div>
                </div>

                {resumeSections.find((s) => s.id === "summary")?.enabled &&
                  userData.summary && (
                    <div className="mb-6">
                      <h2
                        className="text-xl font-bold mb-2 border-b-2 pb-1"
                        style={{ borderColor: selectedColor }}
                      >
                        Professional Summary
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        {userData.summary}
                      </p>
                    </div>
                  )}

                {resumeSections.find((s) => s.id === "experience")?.enabled && (
                  <div className="mb-6">
                    <h2
                      className="text-xl font-bold mb-3 border-b-2 pb-1"
                      style={{ borderColor: selectedColor }}
                    >
                      Work Experience
                    </h2>
                    {userData.experience.map((exp) => (
                      <div key={exp.id} className="mb-4">
                        <h3 className="font-bold">{exp.position}</h3>
                        <p className="font-semibold text-gray-600 dark:text-gray-400">
                          {exp.company} | {exp.duration}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                          {exp.location}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {resumeSections.find((s) => s.id === "education")?.enabled && (
                  <div className="mb-6">
                    <h2
                      className="text-xl font-bold mb-3 border-b-2 pb-1"
                      style={{ borderColor: selectedColor }}
                    >
                      Education
                    </h2>
                    {userData.education.map((edu) => (
                      <div key={edu.id} className="mb-3">
                        <h3 className="font-bold">{edu.degree}</h3>
                        <p className="font-semibold text-gray-600 dark:text-gray-400">
                          {edu.institution} | {edu.duration}
                        </p>
                        {edu.gpa && (
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeMaker;
