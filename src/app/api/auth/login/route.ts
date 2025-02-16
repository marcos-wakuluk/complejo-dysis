import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { email /* password */ } = body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // let isPasswordMatch = await bcrypt.compare(password, user.password);
    // if (!isPasswordMatch) {
    //   // Check if the password is not encrypted
    //   if (password === user.password) {
    //     // Encrypt the password and save it
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     user.password = hashedPassword;
    //     await user.save();
    //     isPasswordMatch = true;
    //   } else {
    //     console.log("Password does not match");
    //     return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    //   }
    // }

    // Crear el JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, lastname: user.lastname },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Responder con el token JWT
    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
