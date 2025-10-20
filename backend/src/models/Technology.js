import mongoose from "mongoose";

const technologySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, "Tagline is required"],
      trim: true,
    },
    color: String,
    icon: {
      type: String,
      required: [true, "Icon is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Frontend", "Backend", "Database", "DevOps & Tools"],
    },
    uses: {
      type: Number,
      default: 0,
    },
    techStack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechStack",
      required: true,
    },
  },
  { timestamps: true }
);

// Create compound index for name and category to ensure uniqueness
technologySchema.index({ name: 1, category: 1 }, { unique: true });

export const Technology = mongoose.model("Technology", technologySchema);
