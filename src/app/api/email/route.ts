import { EmailTemplate } from "@/components/EmailTeplate";
import User from "@/models/User";
import { Resend } from "resend";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const { email } = body;

  const user = await User.findOne({ email });

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const token = generateToken();
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  const name = `${user.name} ${user.lastname}`;

  user.resetToken = {
    token: token,
    expires: new Date(Date.now() + 3600 * 1000),
  };
  await user.save();

  try {
    const { data, error } = await resend.emails.send({
      from: "Marcio Wakuluk Producciones <onboarding@resend.dev>",
      to: email,
      subject: "Restablecer contraseña",
      react: await EmailTemplate({ name: name, resetLink: resetLink }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}
