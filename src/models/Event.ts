import mongoose from "mongoose";

const TandaSchema = new mongoose.Schema({
  date: { type: String, required: true },
  price: { type: Number, required: true },
});

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    numberOfPeople: {
      type: Number,
      required: true,
    },
    peopleEntered: {
      type: Number,
      required: true,
    },
    ticketsSold: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    tandas: [TandaSchema],
  },
  {
    versionKey: false,
    collection: "events",
  }
);
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
