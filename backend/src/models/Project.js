import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    tech: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TechStack",
        required: true,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    github: { type: String },
    demo: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "In Progress", "Planned"],
      required: true,
    },
    duration: { type: String },
    role: {
      type: String,
      enum: [
        "Full Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "UI/UX Designer",
        "DevOps Engineer",
        "Mobile Developer",
        "Data Scientist",
        "Project Manager",
        "Technical Lead",
        "Software Architect",
      ],
      required: true,
    },
    client: {
      type: {
        type: String,
        enum: ["Freelance", "Company", "Personal", "Open Source"],
        required: true,
      },
      name: { type: String },
      details: {
        company: String,
        website: String,
        contact: String,
        industry: String,
      },
    },
    featured: { type: Boolean, default: false },
    completed: { type: Boolean },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Improved slug hook: always generate slug from title if missing or title is modified
projectSchema.pre("validate", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

// Auto-calculate duration from start and end dates
projectSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      this.duration = `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      this.duration = `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      if (remainingMonths > 0) {
        this.duration = `${years} year${
          years > 1 ? "s" : ""
        } ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
      } else {
        this.duration = `${years} year${years > 1 ? "s" : ""}`;
      }
    }
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
