import { Router } from "express";
import {
    createBooking,
    deleteBooking,
    getBookings,
    updateBookingStatus,
    getBookedSlots,
} from "../controllers/bookingController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

// Public route
router.post("/", createBooking);
router.get("/slots", getBookedSlots);

// Protected routes (admin only)
router.use(verifyJWT);
router.get("/", getBookings);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;
