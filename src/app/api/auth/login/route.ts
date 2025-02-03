import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const user = await User.findOne({ email: body.email });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(body.password, user.password);

    if (!isPasswordMatch) {
      if (body.password === user.password) {
        // Update the password to be encrypted
        const hashedPassword = await bcrypt.hash(body.password, 10);
        user.password = hashedPassword;
        await user.save();
      } else {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET as string, { expiresIn: "7d" });

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
