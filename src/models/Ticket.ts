import mongoose, { Schema, Document } from "mongoose";

interface ITicket extends Document {
  event: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  tanda: string;
  price: number;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  used: boolean;
  scanAt: Date | null;
  status: string;
  deviceId: string | null;
  qrCode: string;
}

const TicketSchema: Schema = new Schema(
  {
    event: { type: mongoose.Types.ObjectId, ref: "Event", required: true },
    client: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    tanda: { type: String, required: true },
    price: { type: Number, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    used: { type: Boolean, default: false },
    scanAt: { type: Date, default: null },
    status: { type: String, default: "pending" },
    deviceId: { type: String, default: null },
    qrCode: { type: String, required: true },
  },
  {
    versionKey: false,
    collection: "tickets",
  }
);

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
