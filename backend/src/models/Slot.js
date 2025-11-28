import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Slot = mongoose.model("Slot", slotSchema);
