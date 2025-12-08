const EventModel = require("../model/eventsModel");

const getEvents = async (req, res) => {
  try {
    const searchText = req.query.searchText;
    const date = req.query.date;

    let filtersObj = {
      searchText: searchText,
    };

    const events = await EventModel.find({
      name: { $regex: new RegExp(searchText, "i") },
      ...(date && { date }),
    }).sort({ createdAt: -1 });
    return res.status(201).json({ data: events });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSingleEvents = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    return res.status(201).json({ data: event });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createEvents = async (req, res) => {
  try {
    let mediaUrls = [];
    if (req.files && req.files.length > 0) {
      mediaUrls = req.files.map((file) => file.path);
      console.log(mediaUrls);
    }

    const event = await EventModel.create(req.body);
    console.log(event);
    return res
      .status(201)
      .json({ message: "Event created successfully", event });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateEvents = async (req, res) => {
  try {
    let updatedData = { ...req.body };

    // If updating images
    if (req.files && req.files.length > 0) {
      const newMediaUrls = req.files.map((file) => file.path);

      if (req.body.replaceMedia === "true") {
        updatedData.media = newMediaUrls;
      } else {
        const existingEvent = await EventModel.findById(req.params.id);
        updatedData.media = [...existingEvent.media, ...newMediaUrls];
      }
    }

    const event = await EventModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Event updated successfully", event });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteEvents = async (req, res) => {
  try {
    await EventModel.findByIdAndDelete(req.params.id);
    return res.status(201).json({ message: "Events deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getSingleEvents,
  createEvents,
  updateEvents,
  deleteEvents,
};
