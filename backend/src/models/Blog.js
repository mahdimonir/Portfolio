import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 160,
    },
    coverImage: {
      url: String,
      public_id: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "pending"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    readingTime: {
      type: Number,
      required: true,
    },
    seoTitle: {
      type: String,
      maxlength: 60,
    },
    seoDescription: {
      type: String,
      maxlength: 160,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
blogSchema.pre("validate", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

blogSchema.pre("save", function (next) {
  // Set publishedAt date when status changes to published
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  // Auto-update seoTitle if title changes
  if (this.isModified("title")) {
    this.seoTitle = this.title.substring(0, 60);
  }

  // Auto-update seoDescription if excerpt changes
  if (this.isModified("excerpt")) {
    this.seoDescription = this.excerpt.substring(0, 160);
  }

  next();
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
