import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true
  },
  peopleEntered: {
    type: Number,
    required: true
  },
  ticketsSold: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;