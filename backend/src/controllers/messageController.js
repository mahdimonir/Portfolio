import Message from "../models/Message.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendMail.js";
import { throwIfInvalid } from "../utils/throwIf.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { senderEmail, senderName, subject, message } = req.body;

  // Validate required fields
  throwIfInvalid({
    SenderEmail: !senderEmail,
    SenderName: !senderName,
    Subject: !subject,
    Message: !message,
  });

  // Create message in database
  const data = await Message.create({
    senderEmail,
    senderName,
    subject,
    message,
  });

  // Send success response
  res.status(201).json(new ApiResponse(201, data, "Message sent successfully"));
});

export const replyMessage = asyncHandler(async (req, res) => {
  const { messageId, replyText } = req.body;

  // Validate input
  if (!messageId || !replyText) {
    throw new ValidationError("Message ID and reply text are required");
  }

  // Find the original message
  const message = await Message.findById(messageId);
  if (!message) {
    throw new ValidationError("Message not found");
  }

  // Store the reply
  const reply = {
    message: replyText,
    createdAt: new Date(),
  };
  message.replies.push(reply);
  await message.save();

  // Send email using the provided sendEmail function
  await sendEmail({
    email: message.senderEmail,
    subject: `Re: ${message.subject}`,
    templateName: "mail-template",
    data: {
      name: message.senderName,
      message: replyText,
      type: "msg-reply",
    },
  });

  res.status(200).json(new ApiResponse(200, reply, "Reply sent successfully"));
});

export const getAllMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().sort({ updatedAt: -1 });

  // Send success response
  res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findById(id);

  throwIfInvalid(!message, "Message not exist!");

  await message.deleteOne();

  // Send success response
  res
    .status(200)
    .json(new ApiResponse(200, null, "Message deleted successfully"));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const message = await Message.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
  if (!message) {
    throw new ValidationError("Message not found");
  }
  res.status(200).json(new ApiResponse(200, message, "Message marked as read"));
});

export const toggleStar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { starred } = req.body;
  const message = await Message.findByIdAndUpdate(
    id,
    { starred },
    { new: true }
  );
  if (!message) {
    throw new ValidationError("Message not found");
  }
  res.status(200).json(new ApiResponse(200, message, "Star status updated"));
});
