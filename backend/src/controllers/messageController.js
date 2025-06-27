import Message from "../models/Message.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { throwIfInvalid } from "../utils/throwIf.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { senderName, subject, message } = req.body;

  // Validate required fields
  throwIfInvalid({
    SenderName: !senderName,
    Subject: !subject,
    Message: !message,
  });

  // Create message in database
  const data = await Message.create({ senderName, subject, message });

  // Send success response
  res.status(201).json(new ApiResponse(201, data, "Message sent successfully"));
});

export const getAllMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find();

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
