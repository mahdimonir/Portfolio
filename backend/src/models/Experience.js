import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      from: {
        type: String,
        required: true,
        trim: true,
      },
      to: {
        type: String,
        default: "Present",
        trim: true,
      },
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TechStack",
        required: true,
      },
    ],
    achievements: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    current: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
      default: "",
    },
    companyLogo: {
      type: String,
      required: false,
    },
    companyUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate duration from period fields
experienceSchema.pre("save", function (next) {
  if (this.period.from) {
    const fromDate = new Date(this.period.from);
    const toDate =
      this.period.to === "Present" ? new Date() : new Date(this.period.to);

    const diffTime = Math.abs(toDate - fromDate);
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

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
