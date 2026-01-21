const sendMail = require("../config/send-email");
const BookingModel = require("../model/bookingModel");
const EventModel = require("../model/eventsModel");
const UserModel = require("../model/userModels");
const crypto = require("crypto");
const QRCode = require("qrcode");
const {
  bookingConfirmationTemplate,
  cancellationTemplate,
} = require("../utils/email-templates");

const generateBookingCode = () => {
  // 12-char URL-safe-ish code (uppercase + digits)
  return crypto
    .randomBytes(9)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 12)
    .toUpperCase();
};

const getUniqueBookingCode = async () => {
  // retry loop to avoid rare collisions
  for (let i = 0; i < 5; i++) {
    const code = generateBookingCode();
    const exists = await BookingModel.exists({ qrCode: code });
    if (!exists) return code;
  }
  // fallback with timestamp
  return `BK${Date.now().toString(36).toUpperCase()}`;
};

const createBooking = async (req, res) => {
  try {
    req.body.user = req.user._id;

    // Ensure a unique booking qrCode exists
    if (!req.body.qrCode) {
      req.body.qrCode = await getUniqueBookingCode();
    }

    // Create booking
    const booking = await BookingModel.create(req.body);

    // Update event model
    const event = await EventModel.findById(req.body.event);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedTicketTypes = event.ticketTypes.map((ticketType) => {
      if (ticketType.name === req.body.ticketType) {
        // Validate availability

        const available =
          ticketType.available ?? ticketType.limit - (ticketType.booked ?? 0);
        if (available < req.body.ticketCount) {
          throw new Error("Not enough tickets available");
        }

        ticketType.booked = (ticketType.booked ?? 0) + req.body.ticketCount;
        ticketType.available = available - req.body.ticketCount;
      }
      return ticketType;
    });

    await EventModel.findByIdAndUpdate(req.body.event, {
      ticketTypes: updatedTicketTypes,
    });

    event.markModified("ticketTypes");
    await event.save();

    /// Get user
    const userObj = await UserModel.findById(req.user._id);
    if (!userObj) throw new Error("User not found");

    if (!event) throw new Error("Event not found");

    // Prepare email payload
    const qrPngBuffer = await QRCode.toBuffer(req.body.qrCode, {
      type: "png",
      errorCorrectionLevel: "M",
      margin: 2,
      scale: 8,
    });

    const emailHtml = bookingConfirmationTemplate({
      userName: userObj.name,
      eventName: event.name,
      date: event.date,
      ticketCount: req.body.ticketCount,
      location: event.address,
      url: `${process.env.FRONTEND_URL}/events/${event._id}`,
      qrCid: "ticket-qr",
      qrCode: req.body.qrCode,
    });

    const emailPayload = {
      email: userObj.email,
      subject: "Booking Confirmed | Event Ticketing System",
      text: `Your ${req.body.ticketCount} ticket(s) for ${event.name} are confirmed. Visit ${process.env.FRONTEND_URL}/events/${event._id} for details.`,
      html: emailHtml,
      attachments: [
        {
          filename: `ticket-${req.body.qrCode}.png`,
          content: qrPngBuffer,
          cid: "ticket-qr",
          contentType: "image/png",
        },
      ],
    };

    // Send email
    await sendMail(emailPayload);

    return res
      .status(200)
      .json({ message: "Booking Created Successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserBooking = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const bookings = await BookingModel.find({ user: req.user._id })
      .populate("event") // populate event details
      .sort({ createdAt: -1 }); // optional: most recent bookings first

    if (!bookings.length) {
      return res.status(200).json({ data: [], message: "No bookings found" });
    }

    return res.status(200).json({ data: bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// const deleteBooking = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ message: "Booking ID is required" });
//     }

//     const booking = await BookingModel.findByIdAndDelete(id);

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     return res.status(200).json({ message: "Booking Deleted successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // 1. Find booking
    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isOwner = String(booking.user) === String(req.user?._id);
    if (!isOwner && !req.user?.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Block cancellation if ticket has been checked-in (one-time use)
    if (booking.checkedIn || booking.status === "checked-in") {
      return res.status(400).json({ message: "Cannot cancel after check-in" });
    }

    // 2. Check if already canceled
    if (booking.status === "canceled") {
      return res.status(400).json({ message: "Booking is already canceled" });
    }

    // 3. Find event
    const event = await EventModel.findById(booking.event);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 4. Update ticket counts
    event.ticketTypes = event.ticketTypes.map((ticket) => {
      if (ticket.name === booking.ticketType) {
        const bookedBefore = ticket.booked ?? 0;
        const availableBefore = ticket.available ?? ticket.limit - bookedBefore;

        ticket.booked = Math.max(0, bookedBefore - booking.ticketCount);
        ticket.available = availableBefore + booking.ticketCount;
      }
      return ticket;
    });

    event.markModified("ticketTypes");
    await event.save();

    // 5. Update booking status
    booking.status = "canceled";
    await booking.save();

    const userObj = await UserModel.findById(req.user._id);
    if (!userObj) throw new Error("User not found");

    // Prepare email payload for cancelled booking
    const cancellationHtml = cancellationTemplate({
      userName: userObj.name,
      eventName: event.name,
      date: event.date,
      ticketCount: booking.ticketCount,
      location: event.address,
      url: `${process.env.FRONTEND_URL}/events`,
    });

    const emailPayload = {
      email: userObj.email,
      subject: "Booking Cancelled | Event Ticketing System",
      text: `Your booking of ${booking.ticketCount} ticket(s) for ${event.name} has been cancelled.`,
      html: cancellationHtml,
    };
    // Send email
    await sendMail(emailPayload);

    return res
      .status(200)
      .json({ message: "Booking canceled successfully", data: booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//Admin
const getAllBooking = async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .populate("user")
      .populate("event")
      .sort({ createdAt: -1 });

    if (!bookings.length) {
      return res.status(200).json({ data: [], message: "No bookings found" });
    }

    return res.status(200).json({ data: bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getUserBooking,
  cancelBooking,
  getAllBooking,
  // deleteBooking,
};
