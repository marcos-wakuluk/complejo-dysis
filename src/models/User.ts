import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  password: string;
  name: string;
  email: string;
  role: string;
  tickets: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: false },
    dni: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    date: { type: Date, required: false },
    role: {
      type: String,
      enum: ["administrador", "promotor", "cajero", "usuario", "portero", "barman"],
      default: "usuario",
      required: true,
    },
    password: { type: String, required: true },
    resetToken: {
      token: { type: String, required: false },
      expires: { type: Date, required: false },
    },
    tickets: [{ type: mongoose.Types.ObjectId, ref: "Ticket" }],
  },
  {
    versionKey: false,
    collection: "users",
  }
);

UserSchema.pre("save", async function (next) {
  const user = this as unknown as IUser;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
