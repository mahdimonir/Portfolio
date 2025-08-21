import mongoose from "mongoose";

const techStackSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Frontend", "Backend", "Database", "DevOps & Tools"],
    },
    color: String,
    technologies: [
      {
        name: { type: String, required: [true, "Name is required"] },
        tagline: { type: String, required: [true, "Tagline is required"] },
        color: String,
        icon: { type: String, required: [true, "Icon is required"] },
        uses: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const TechStack = mongoose.model("TechStack", techStackSchema);
