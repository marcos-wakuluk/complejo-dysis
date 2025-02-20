import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    dni: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      enum: ["administrador", "promotor", "cajero", "usuario"],
      default: "usuario",
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: {
      token: {
        type: String,
        required: false,
      },
      expires: {
        type: Date,
        required: false,
      },
    },
  },
  {
    versionKey: false,
    collection: "users",
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
