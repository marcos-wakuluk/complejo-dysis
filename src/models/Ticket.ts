import { Schema, model, models } from "mongoose";

const TicketSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tanda: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    qrCode: {
      type: String,
    },
    used: {
      type: Boolean,
      default: false,
    },
    scanAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "used", "canceled"],
      default: "pending",
    },
    deviceId: {
      type: String,
    },
  },
  {
    versionKey: false,
    collection: "tickets",
  }
);

const Ticket = models.Ticket || model("Ticket", TicketSchema);

export default Ticket;
