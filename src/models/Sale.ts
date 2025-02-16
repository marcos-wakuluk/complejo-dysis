import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pendiente", "confirmada"],
      default: "pendiente",
    },
    cashier: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionNumber: {
      type: String,
      default: "N/A",
    },
    details: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    collection: "sales",
  }
);

const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);

export default Sale;
