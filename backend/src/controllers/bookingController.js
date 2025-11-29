import { Booking } from "../models/Booking.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { throwIf } from "../utils/throwIf.js";

// Create a new booking
export const createBooking = asyncHandler(async (req, res) => {
  const { name, email, phone, date, time, message } = req.body;

  const existingBooking = await Booking.findOne({
    date,
    time,
    status: { $ne: "cancelled" },
  });

  if (existingBooking) {
    throw new ValidationError("This time slot is already booked");
  }

  const booking = await Booking.create({
    name,
    email,
    phone,
    date,
    time,
    message,
  });

  res
    .status(201)
    .json(ApiResponse.created(booking, "Booking scheduled successfully"));
});

// Get all bookings (admin)
export const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().sort({ date: 1, time: 1 });
  res.json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});

// Get booked slots for a specific date
export const getBookedSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) {
    throw new ValidationError("Date parameter is required");
  }

  const bookings = await Booking.find({
    date,
    status: { $ne: "cancelled" },
  }).select("time");

  const bookedTimes = bookings.map((b) => b.time);
  res.json(new ApiResponse(200, bookedTimes, "Booked slots fetched successfully"));
});

// Update booking status
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findById(id);
  throwIf(!booking, new NotFoundError("Booking not found"));

  booking.status = status;
  await booking.save();

  res.json(new ApiResponse(200, booking, "Booking status updated"));
});

// Delete booking
export const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);
  throwIf(!booking, new NotFoundError("Booking not found"));

  await booking.deleteOne();
  res.json(new ApiResponse(200, null, "Booking deleted successfully"));
});
