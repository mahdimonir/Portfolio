import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderEmail: {
      type: String,
      required: [true, "Email is required!"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address!",
      ],
    },
    senderName: {
      type: String,
      minLength: [2, "Name must contain at least 2 characters!"],
    },
    subject: {
      type: String,
      minLength: [2, "Subject must contain at least 2 characters!"],
    },
    message: {
      type: String,
      minLength: [2, "Message must contain at least 2 characters!"],
    },
    read: {
      type: Boolean,
      default: false,
    },
    starred: {
      type: Boolean,
      default: false,
    },
    replies: [
      {
        message: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
