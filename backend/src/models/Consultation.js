import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email",
      ],
    },
    phone: { type: String, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;
