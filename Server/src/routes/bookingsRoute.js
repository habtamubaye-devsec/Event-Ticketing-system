const express = require("express");
const validateToken = require("../middleware/validateToken");
const requireAdmin = require("../middleware/requireAdmin");
const {
  createBooking,
  getUserBooking,
  cancelBooking,
  getAllBooking,
  //deleteBooking,
} = require("../controller/bookingsController");
const BookingModel = require("../model/bookingModel");

const router = express.Router();

router.post("/create-booking", validateToken, createBooking);
router.get("/get-user-booking", validateToken, getUserBooking);
router.put("/cancel-booking/:id", validateToken, cancelBooking);
//  router.put("/delete-booking/:id", validateToken, deleteBooking);

//Admin
router.get("/get-all-booking", validateToken, getAllBooking);

// QR verify/check-in (Admin)
router.get("/qr/verify/:code", validateToken, requireAdmin, async (req, res) => {
  try {
    const { code } = req.params;
    const booking = await BookingModel.findOne({ qrCode: code })
      .populate("user")
      .populate("event");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking found",
      data: {
        _id: booking._id,
        qrCode: booking.qrCode,
        status: booking.status,
        checkedIn: booking.checkedIn,
        checkedInAt: booking.checkedInAt,
        ticketType: booking.ticketType,
        ticketCount: booking.ticketCount,
        totalAmount: booking.totalAmount,
        user: booking.user,
        event: booking.event,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/qr/check-in/:code", validateToken, requireAdmin, async (req, res) => {
  try {
    const { code } = req.params;
    const booking = await BookingModel.findOne({ qrCode: code });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "booked") {
      return res.status(400).json({ message: `Booking is ${booking.status}` });
    }

    if (booking.checkedIn) {
      return res.status(400).json({ message: "Already checked in" });
    }

    booking.checkedIn = true;
    booking.checkedInAt = new Date();
    booking.checkedInBy = req.user._id;
    await booking.save();

    return res.status(200).json({ message: "Check-in successful", data: booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get booking QR code for the current user (or admin)
router.get("/:id/qr", validateToken, async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isOwner = String(booking.user) === String(req.user._id);
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ data: { qrCode: booking.qrCode } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
