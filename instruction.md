**Objective**: Develop a modern, animated full-stack developer portfolio using the MERN stack (Next.js with App Router, Express.js, MongoDB) to showcase professional work, with a **fixed bottom navbar with icon-only buttons** and support for **dark and light themes**. The design should draw inspiration from the vibrant, dynamic aesthetic of [abdulkaiyum.com](https://abdulkaiyum.com) and the clean minimalism of [sharifrahat.com](https://sharifrahat.com), using a blue-themed palette (`#1A73E8`, `#AECBFA`, `#D1E9FF`). Include a secure admin panel for dynamic content management (bio, experience, tech stack, projects, articles, testimonials, contact). Deploy the frontend on Vercel and the backend on Render, ensuring SEO optimization, responsiveness, and smooth animations.

---

### 🎯 Main Features

#### ✅ Frontend (Next.js with App Router)
- **Design Inspiration**:
  - Combine [abdulkaiyum.com](https://abdulkaiyum.com)’s vibrant gradients and playful animations with [sharifrahat.com](https://sharifrahat.com)’s clean, minimal layout.
  - Use a blue palette (`#1A73E8`, `#AECBFA`, `#D1E9FF`) for accents, buttons, and hover effects.
  - Implement **dark and light themes** toggleable via a button in the bottom navbar, with smooth transitions (e.g., background color fade).
  - Apply modern typography (e.g., Inter, Poppins) and subtle effects like glassmorphism or neon glow for cards.
  - Add parallax scrolling for depth and hover effects (e.g., scale, tilt, or pulse) on interactive elements.
- **Theme Support**:
  - **Dark Theme**: Dark background (`#1F2937` or similar), white text (`#FFFFFF`), and blue accents (`#1A73E8`, `#AECBFA`).
  - **Light Theme**: White or light gray background (`#F9FAFB`), dark text (`#1F2937`), and blue accents.
  - Persist theme preference in local storage and respect system preferences (`prefers-color-scheme`).
  - Use Tailwind CSS `dark:` variants for seamless theme switching.
- **Navigation**:
  - **Fixed bottom navbar** with **icon-only buttons** (Home, Projects, Articles, Tech, Testimonials, Contact, Theme Toggle) using **React Icons** (e.g., `FaHome`, `FaProjectDiagram`, `FaBlog`, `FaSun`, `FaMoon`).
  - Responsive design: Collapse into a hamburger menu on mobile (<768px) with a slide-up animation using Framer Motion.
  - Highlight active route with a glowing effect or underline in `#1A73E8`.
  - Ensure touch-friendly icons (24x24px or larger) with hover animations (e.g., scale 1.1).
- **Routes**:
  - `/`: Home (Hero with animated profile intro, social links, and contact CTA).
  - `/projects`: Grid of project cards with hover animations (e.g., tilt or lift).
  - `/articles`: Blog list with article previews, tags, and search functionality.
  - `/tech`: Tech stack grid with animated tooltips or skill bars (highlighting MERN stack).
  - `/testimonials`: Carousel or grid of testimonial cards with fade-in animations.
  - `/contact`: Animated contact form with submission feedback.
  - `/admin`: Protected admin panel for content management.
- **Animations**:
  - Use **Framer Motion** for scroll-triggered animations (e.g., fade-in, slide-up, stagger for cards) and micro-interactions (e.g., button ripples, card hovers).
  - Animate theme transitions (e.g., background color fade over 300ms).
  - Optionally use GSAP for complex hero section animations (e.g., staggered text reveal).
- **Blog Rendering**:
  - Support **MDX** for articles with syntax highlighting (Prism.js or Shiki) and embedded media.
  - Include an auto-generated table of contents for articles based on headings.
- **GitHub Activity**:
  - Embed **react-github-contribution-calendar** with theme-adaptive colors (e.g., `#1A73E8`, `#AECBFA`, `#D1E9FF` for dark theme; `#2563EB`, `#BFDBFE` for light theme).
  - Fetch and display GitHub repo stats (stars, forks) via GitHub API, cached to avoid rate limits.
- **Responsiveness**:
  - Mobile-first design with Tailwind CSS, ensuring the bottom navbar is touch-friendly.
  - Optimize for swipe gestures (e.g., testimonial carousel).
- **SEO & Performance**:
  - Use Next.js `getStaticProps` or `getServerSideProps` for SEO-friendly rendering.
  - Optimize images with Next.js `Image` and Cloudinary CDN.
  - Implement `next-seo` for meta tags, Open Graph, and Twitter Cards.
- **Accessibility**:
  - Add ARIA labels to navbar icons (e.g., `aria-label="Toggle dark mode"`).
  - Ensure keyboard navigation and screen reader support for all interactive elements.

#### ✅ Backend (Express.js)
- **RESTful APIs** (protected with JWT for admin routes):
  - **Profile & Bio**: GET, POST, PUT (name, tagline, about, social links).
  - **Experience**: CRUD for work history (company, role, dates, description).
  - **Projects**: CRUD (title, description, image, tech stack, links).
  - **Articles**: CRUD (title, Markdown content, tags, slug, date).
  - **Testimonials**: CRUD (name, role, quote, image).
  - **Tech Stack**: CRUD (name, icon, proficiency level).
  - **Contact**: POST for form submissions via Nodemailer with rate limiting (5/hour per IP).
- **Authentication**:
  - **JWT-based auth** for admin panel access (email/password).
  - Use bcrypt for password hashing and HTTP-only cookies for session management.
- **Database**:
  - **MongoDB** with **Mongoose** schemas for Profile, Experience, Projects, Articles, Testimonials, TechStack.
  - Validate fields (e.g., unique slugs for articles, required fields for projects).
- **Image Upload**:
  - Use **Cloudinary** for project, testimonial, and article image uploads with automatic optimization.
  - Provide presigned URLs for secure admin panel uploads.
- **Rate Limiting**:
  - Apply `express-rate-limit` to contact form and public APIs.
- **Error Handling**:
  - Centralized middleware for JSON error responses (e.g., `{ error: "Invalid input" }`).
  - Log errors with Winston to a file or service.

#### ✅ Admin Panel
- **Implementation**:
  - Build within Next.js at `/admin` (protected route) with Tailwind CSS, supporting dark and light themes.
  - Match the main site’s blue palette and aesthetic.
- **Authentication**:
  - Login page with JWT auth (email/password).
  - Persist session with secure HTTP-only cookies.
- **Features**:
  - **Dashboard**: Stats overview (e.g., project count, draft articles).
  - **CRUD Interfaces**: Forms for Profile, Experience, Projects, Articles, Testimonials, Tech Stack.
  - **Rich Text Editor**: Use **Tiptap** for Markdown-compatible article editing.
  - **Image Upload**: Drag-and-drop interface for Cloudinary uploads.
  - **Preview & Publish**: Real-time article previews and draft/publish toggles.
  - **Form Validation**: Use **React Hook Form** with Zod for client-side validation.
  - **Feedback**: Use **React Toastify** for success/error notifications.
- **Security**:
  - Protect admin routes with JWT middleware.
  - Sanitize inputs with DOMPurify to prevent XSS.
- **Theme Support**:
  - Sync admin panel with main site’s dark/light theme, using Tailwind `dark:` classes.

#### ✅ Additional Requirements
- **Deployment**:
  - Deploy frontend to **Vercel** with automatic scaling and custom domain.
  - Deploy backend to **Render** with MongoDB Atlas for database hosting.
  - Configure CORS for secure frontend-backend communication.
- **Environment Variables**:
  - Store sensitive data (MongoDB URI, JWT secret, Cloudinary credentials, Nodemailer config) in `.env` files.
  - Use Next.js and Express.js environment variable systems (e.g., Vercel’s env settings).
- **Optional Enhancements**:
  - Use **Supabase** for auth and contact form storage instead of custom JWT/Nodemailer.
  - Integrate **Firebase** for push notifications on contact submissions.
  - Implement a **JSON config file** for SSR fallback (e.g., default bio if DB fails).
- **GitHub Activity Tracker**:
  - Display GitHub contribution calendar and repo stats (stars, forks) via GitHub API.
  - Cache responses in MongoDB or Redis to avoid rate limits.

---

### 🗂 Tech Stack
- **Frontend**:
  - Next.js (App Router)
  - Tailwind CSS (with `dark:` variants for theme support)
  - Framer Motion (animations)
  - React Icons (navbar icons)
  - MDX (blog rendering)
  - next-seo (SEO)
  - react-github-contribution-calendar (GitHub activity)
- **Backend**:
  - Express.js
  - MongoDB (Mongoose)
  - JWT (authentication)
  - Nodemailer (contact emails)
  - Cloudinary (image uploads)
  - express-rate-limit (API protection)
- **Admin Tools**:
  - React Hook Form + Zod (form validation)
  - Tiptap (rich text editor)
  - React Toastify (notifications)
  - Axios (API requests)
- **DevOps**:
  - Vercel (frontend)
  - Render (backend)
  - MongoDB Atlas (database)
  - Cloudinary (image storage)
  - GitHub (version control)

---

### 💬 Bonus AI Prompt Ideas
1. “Generate a Next.js page layout for a portfolio inspired by [abdulkaiyum.com](https://abdulkaiyum.com) and [sharifrahat.com](https://sharifrahat.com), with a bottom icon-only navbar, dark/light theme toggle, and Framer Motion animations.”
2. “Create an Express.js REST API with JWT authentication and Cloudinary image uploads for managing portfolio content (bio, projects, articles).”
3. “Build a React admin dashboard for a portfolio with CRUD operations for bio, projects, and testimonials, using React Hook Form, Tiptap, and Tailwind CSS with dark/light theme support.”
4. “Design Mongoose schemas for a portfolio with Profile, Experience, Projects, Articles, and Testimonials, ensuring validation and scalability.”
5. “Implement a theme-adaptive GitHub contribution calendar in Next.js with react-github-contribution-calendar, styled for dark and light modes.”

---

### 📋 Changes from Previous Prompt
1. **Removed Meeting Management**:
   - Eliminated references to `MeetingStatus`, status SVGs (`CancelledMeetingSVG`, etc.), and tRPC, focusing solely on the portfolio.
   - Replaced meeting-specific features with generic portfolio content management.
2. **Dark/Light Theme Support**:
   - Added explicit requirements for dark and light themes, with Tailwind `dark:` classes and system preference detection.
   - Included theme toggle in the bottom navbar and smooth transitions.
3. **Bottom Navbar**:
   - Reiterated the fixed bottom navbar with icon-only buttons, ensuring responsiveness and accessibility.
   - Added theme toggle icon (`FaSun`, `FaMoon`) to the navbar.
4. **Design Inspiration**:
   - Maintained inspiration from [abdulkaiyum.com](https://abdulkaiyum.com) and [sharifrahat.com](https://sharifrahat.com), emphasizing blue palette (`#1A73E8`, `#AECBFA`, `#D1E9FF`).
   - Clarified glassmorphism, gradients, and parallax effects for a modern look.
5. **Backend**:
   - Focused on Express.js REST APIs, removing tRPC references.
   - Kept Cloudinary, Nodemailer, and JWT for consistency.
6. **Admin Panel**:
   - Added theme support to align with the main site.
   - Specified Tiptap and Zod for modern editing and validation.
7. **SEO & Accessibility**:
   - Strengthened SEO with `next-seo` and performance with Next.js `Image`.
   - Enhanced accessibility for navbar icons and theme toggle.
8. **Deployment**:
   - Kept Vercel and Render, with clearer CORS and env variable guidance.
9. **GitHub Integration**:
   - Updated calendar colors to adapt to dark/light themes.
   - Added caching for GitHub API efficiency.

---

### 🔧 Implementation Notes
- **Navbar Icons**: Use React Icons (`FaHome`, `FaBlog`, `FaSun`, `FaMoon`, etc.) with 24x24px size and hover animations (e.g., scale 1.1).
- **Theme Switching**: Implement with Tailwind’s `dark:` classes and a context provider (e.g., `ThemeContext`) for toggling and persisting theme state.
  ```tsx
  // Example Theme Toggle
  import { useTheme } from "@/context/ThemeContext";
  import { FaSun, FaMoon } from "react-icons/fa";

  const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="p-2 rounded-full hover:bg-blue-600/20"
      >
        {theme === "dark" ? <FaSun size={24} /> : <FaMoon size={24} />}
      </button>
    );
  };
  ```
- **Color Palette**: Use `#1A73E8`, `#AECBFA`, `#D1E9FF` for buttons, accents, and hover effects, with `#1F2937` (dark) and `#F9FAFB` (light) for backgrounds.
- **MDX Setup**: Configure `@next/mdx` with `rehype-prism-plus` for code highlighting.
- **Cloudinary**: Use `cloudinary-build-url` for optimized image delivery.
- **Testing**: Verify theme transitions, navbar usability on mobile, and animation performance (e.g., use `will-change` CSS for Framer Motion).