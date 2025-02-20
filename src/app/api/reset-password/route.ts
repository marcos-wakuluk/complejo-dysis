import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { password, token } = body;

    const user = await User.findOne({
      "resetToken.token": token,
      "resetToken.expires": { $gt: new Date() },
    });

    if (!user) {
      return Response.json({ error: "No existe el usuario o el token expiro" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetToken = undefined;

    await user.save();

    return Response.json({ message: "Contraseña restablecida" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
