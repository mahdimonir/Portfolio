import { FaNodeJs, FaReact } from "react-icons/fa";
import {
  SiAiohttp,
  SiMongodb,
  SiNextdotjs,
  SiSocketdotio,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

export const projects = [
  {
    id: 1,
    name: "e-commerce-platform",
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.",
    longDescription:
      "A comprehensive e-commerce platform built with modern technologies. Features real-time inventory management, secure payment processing via Stripe, user authentication with JWT, and a powerful admin dashboard for managing products and orders. The application is fully responsive and optimized for performance.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    ],
    tech: [
      { name: "React", icon: FaReact, color: "text-blue-500" },
      { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
      { name: "MongoDB", icon: SiMongodb, color: "text-green-600" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-500" },
    ],
    features: [
      "User Authentication & Authorization",
      "Product Catalog with Search & Filtering",
      "Shopping Cart & Checkout Process",
      "Payment Integration with Stripe",
      "Order Management System",
      "Admin Dashboard",
      "Responsive Design",
      "Real-time Inventory Updates",
    ],
    github: "https://github.com/mahdimonir/ecommerce",
    demo: "https://ecommerce-demo.vercel.app",
    category: "Full Stack",
    status: "Completed",
    duration: "3 months",
    role: "Full Stack Developer",
    gradient: "from-cyan-400 via-blue-500 to-purple-600",
  },
  {
    id: 2,
    name: "task-management-app",
    title: "Task Management App",
    description:
      "Collaborative task management application built with Next.js and TypeScript. Real-time updates and beautiful UI/UX design.",
    longDescription:
      "A collaborative task management application with real-time synchronization. Built with Next.js and TypeScript, featuring drag-and-drop functionality, team collaboration tools, and advanced filtering options.",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516321310762-4794370e6a66?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800&h=600&fit=crop",
    ],
    tech: [
      { name: "Next.js", icon: SiNextdotjs, color: "text-black" },
      { name: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-500" },
      { name: "MongoDB", icon: SiMongodb, color: "text-green-600" },
    ],
    features: [
      "Real-time Task Synchronization",
      "Drag-and-Drop Task Management",
      "Team Collaboration Tools",
      "Advanced Filtering Options",
      "Responsive Design",
      "Notification System",
    ],
    github: "https://github.com/mahdimonir/taskapp",
    demo: "https://taskapp-demo.vercel.app",
    category: "Mobile",
    status: "In Progress",
    duration: "2 months",
    role: "Frontend Developer",
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
  },
  {
    id: 3,
    name: "weather-dashboard",
    title: "Weather Dashboard",
    description:
      "Modern weather application with location-based forecasts, interactive maps, and responsive design for all devices.",
    longDescription:
      "A beautiful weather application featuring location-based forecasts, interactive weather maps, and detailed weather analytics. Built with React and integrated with multiple weather APIs for accurate predictions.",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561484932-7d2e22d79c8e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&h=600&fit=crop",
    ],
    tech: [
      { name: "React", icon: FaReact, color: "text-blue-500" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-500" },
      { name: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
    ],
    features: [
      "Location-based Weather Forecasts",
      "Interactive Weather Maps",
      "Detailed Weather Analytics",
      "Responsive Design",
      "API Integration",
    ],
    github: "https://github.com/mahdimonir/weather",
    demo: "https://weather-demo.vercel.app",
    category: "Technology",
    status: "Completed",
    duration: "1.5 months",
    role: "Frontend Developer",
    gradient: "from-orange-400 via-red-500 to-pink-600",
  },
  {
    id: 4,
    name: "ai-chat-application",
    title: "AI Chat Application",
    description:
      "Real-time chat application with AI integration, supporting multiple users and smart message suggestions.",
    longDescription:
      "A modern social media platform with real-time messaging, post sharing, and advanced user interaction features. Built with React, Node.js, and MongoDB, featuring a scalable backend and responsive frontend.",
    image:
      "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1516321310762-4794370e6a66?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542743-05336fcc7ad4?w=800&h=600&fit=crop",
    ],
    tech: [
      { name: "React", icon: FaReact, color: "text-blue-500" },
      { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
      { name: "MongoDB", icon: SiMongodb, color: "text-green-600" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-500" },
      { name: "Socket.io", icon: SiSocketdotio, color: "text-gray-700" },
      { name: "AI/ML", icon: SiAiohttp, color: "text-purple-600" },
    ],
    features: [
      "Real-time Messaging",
      "Post Sharing and Interactions",
      "User Profiles",
      "Notifications",
      "Responsive Design",
      "Scalable Backend",
    ],
    github: "https://github.com/mahdimonir/social",
    demo: "https://social-demo.vercel.app",
    category: "Full Stack",
    status: "In Progress",
    duration: "4 months",
    role: "Full Stack Developer",
    gradient: "from-purple-400 via-pink-500 to-rose-600",
  },
  {
    id: 5,
    name: "social-media-app",
    title: "Social Media Platform",
    description:
      "Modern social media platform with real-time messaging, post sharing, and advanced user interaction features.",
    longDescription:
      "A modern social media platform with real-time messaging, post sharing, and advanced user interaction features. Built with React, Node.js, and MongoDB, featuring a scalable backend and responsive frontend.",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516321310762-4794370e6a66?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800&h=600&fit=crop",
    ],
    tech: [
      { name: "React", icon: FaReact, color: "text-blue-500" },
      { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
      { name: "MongoDB", icon: SiMongodb, color: "text-green-600" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-500" },
    ],
    features: [
      "Real-time Messaging",
      "Post Sharing and Interactions",
      "User Profiles",
      "Notifications",
      "Responsive Design",
      "Scalable Backend",
    ],
    github: "https://github.com/mahdimonir/social",
    demo: "https://social-demo.vercel.app",
    category: "Full Stack",
    status: "In Progress",
    duration: "4 months",
    role: "Full Stack Developer",
    gradient: "from-indigo-400 via-blue-500 to-teal-600",
  },
];

export const getProjectByName = (name) => {
  return projects.find((project) => project.name === name) || null;
};

export const Gradient = [
  "from-cyan-400 via-blue-500 to-purple-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-orange-400 via-red-500 to-pink-600",
  "from-purple-400 via-pink-500 to-rose-600",
  "from-indigo-400 via-blue-500 to-teal-600",
];
