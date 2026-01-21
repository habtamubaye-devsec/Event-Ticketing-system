const mongoose = require("mongoose");

const boookingSchema = new mongoose.Schema({
  qrCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Events",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticketType: {
    type: String,
    required: true
  },
  ticketCount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "booked"
  },
  checkedIn: {
    type: Boolean,
    default: false,
  },
  checkedInAt: {
    type: Date,
  },
  checkedInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {timestamps: true});


module.exports = mongoose.model("Booking", boookingSchema);