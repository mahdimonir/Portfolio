import { Slot } from "../models/Slot.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { throwIf } from "../utils/throwIf.js";

// Create a new slot
export const createSlot = asyncHandler(async (req, res) => {
  const { time, status } = req.body;

  const existingSlot = await Slot.findOne({ time });
  if (existingSlot) {
    throw new ValidationError("Slot with this time already exists");
  }

  const slot = await Slot.create({
    time,
    status: status || "active",
  });

  res
    .status(201)
    .json(ApiResponse.created(slot, "Slot created successfully"));
});

// Get all slots
export const getSlots = asyncHandler(async (req, res) => {
  // Sort logic could be improved, but string comparison works for simple AM/PM if format is consistent
  // Ideally, store minutes from midnight or use 24h format for sorting
  const slots = await Slot.find().sort({ time: 1 });
  
  // Custom sort to handle AM/PM correctly if needed, but for now let's trust the input format or client sort
  res.json(new ApiResponse(200, slots, "Slots fetched successfully"));
});

// Update slot
export const updateSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { time, status } = req.body;

  const slot = await Slot.findById(id);
  throwIf(!slot, new NotFoundError("Slot not found"));

  if (time && time !== slot.time) {
    const existingSlot = await Slot.findOne({ time });
    if (existingSlot) {
      throw new ValidationError("Slot with this time already exists");
    }
    slot.time = time;
  }

  if (status) {
    slot.status = status;
  }

  await slot.save();

  res.json(new ApiResponse(200, slot, "Slot updated successfully"));
});

// Delete slot
export const deleteSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const slot = await Slot.findById(id);
  throwIf(!slot, new NotFoundError("Slot not found"));

  await slot.deleteOne();
  res.json(new ApiResponse(200, null, "Slot deleted successfully"));
});
