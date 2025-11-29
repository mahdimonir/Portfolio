# Moniruzzaman Mahdi – Full-Stack Developer Portfolio

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

**Live Website:** [https://moniruzzaman-mahdi.vercel.app](https://moniruzzaman-mahdi.vercel.app)  
**Source Code (Private Repo):** https://github.com/mahdimonir/portfolio

---

### A Modern, Fully Content-Managed Personal Portfolio with Real-Time Updates

This is my personal developer portfolio — built from scratch with **Next.js 15 (App Router)**, **TypeScript**, and a custom **full-stack admin dashboard** that lets me update everything instantly without redeploying.

Every word, project, blog post, skill, testimonial, and even the hero section is managed live from the dashboard — and thanks to **on-demand revalidation**, changes appear on the live site in **under 2 seconds**.

---

### Key Features

- **100% Admin Dashboard Controlled** – All content managed via a beautiful protected dashboard (`/admin`)
- **Instant Site Updates** – Create/update/delete anything → live site reflects instantly (using Next.js on-demand revalidation + secure webhooks)
- **Real-time Sections** – Hero, Tech Stack, Featured Projects, Blogs, Services, Experiences, Testimonials all update immediately
- **Smart Section Visibility** – If a section has no published items → it automatically hides (no empty sections ever)
- **Full-Featured Blog** – Markdown support, dynamic slugs, SEO-optimized
- **GitHub Contributions Calendar** – Auto-refreshed daily with your real activity
- **Dark/Light Mode** – Powered by `next-themes`
- **Fully Responsive** – Looks perfect on mobile, tablet, and desktop
- **Performance First** – Lighthouse 99–100 scores (thanks to Next.js 15 + App Router + Image Optimization)

---

### Tech Stack

| Layer              | Technology                                                                 |
|---------------------|----------------------------------------------------------------------------|
| Frontend            | Next.js 15 (App Router), React 19, JavaScript, Tailwind CSS, Framer Motion |
| UI Components       | shadcn/ui + Radix UI + custom components                                   |
| State Management    | TanStack Query (React Query)                                               |
| Forms               | React Hook Form + Zod                                                      |
| Admin Dashboard     | Fully custom with drag-and-drop reordering, rich text, image uploads       |
| Backend API      | Express.js + MongoDB (Mongoose)                                            |
| Authentication      | JWT + HttpOnly cookies (secure & refresh token flow)                       |
| File Uploads        | Cloudinary (direct + server-signed)                                        |
| Email               | Nodemailer (transactional emails on contact/order)                         |
| Revalidation        | Next.js On-Demand Revalidation via secure webhook (REVALIDATION_TOKEN)    |
| Deployment          | Vercel (Frontend + Serverless API routes)                                  |
| Logging             | Winston                                                                    |

---

### Project Structure

```
portfolio/
├── frontend/             # Next.js 15 App Router
│   ├── app/(site)/       # Public pages (home, projects, blogs)
│   ├── app/admin/        # Protected dashboard
│   └── components/       # Reusable UI components
├── backend/              # Express API (deployed as Vercel serverless functions)
│   ├── src/
│      ├── controllers/
│      ├── routes/
│      └── middleware/
└── shared/               # Shared types, utils (if any)
```

---

### Environment Variables

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_BASE_URL=https://moniruzzaman-mahdi.vercel.app/api
REVALIDATION_TOKEN=your-super-secret-token-here
```

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET_KEY=your_strong_secret
REVALIDATION_TOKEN=same_as_frontend_token
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_USER=your@gmail.com
SMTP_PASS=app-password
GITHUB_USERNAME=mahdimonir
GITHUB_TOKEN=ghp_...
FRONTEND_URL=https://moniruzzaman-mahdi.vercel.app
USER_ID=only_admin_user_object_id
```

---

### Instant Content Updates (How It Works)

When I save any change in the **Admin → Works** tab:
1. Data is saved to MongoDB
2. Backend immediately calls `POST /api/revalidate` with secret token
3. Next.js invalidates only the required cache tags (`home`, `projects`, `blogs`, etc.)
4. Your browser gets fresh content on next visit (or even same tab with background refetch)

→ No redeploy. No waiting. Truly live editing.

---

### Setup & Run Locally

```bash
# Clone (you'll need access)
git clone https://github.com/mahdimonir/portfolio.git
cd portfolio

# Frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev

# Backend (in another terminal)
cd ../backend
cp .env.example .env
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

Admin login: Use the credentials you set in `USER_ID` and JWT flow

---

### License

This project is private and for personal branding only.  
Inspired by the best — built better

---

Made with passion by **Moniruzzaman Mahdi**  
[GitHub: [@mahdimonir](https://github.com/mahdimonir)  
LinkedIn: [in/moniruzzamanmahdi](https://linkedin.com/in/moniruzzamanmahdi)  
Email: mahdimoniruzzman@gmail.com

**Feel free to fork, study, or get inspired — just don’t copy-paste**

---
