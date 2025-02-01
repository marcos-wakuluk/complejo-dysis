import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["activo", "inactivo"],
    },
  },
  {
    versionKey: false,
    collection: "inventories",
  }
);

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);

export default Inventory;
