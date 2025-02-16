import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Ticket from "@/models/Ticket";

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    let tickets;
    if (userId) {
      tickets = await Ticket.find({ user: userId }).populate("client", "name lastname dni");
    } else {
      tickets = await Ticket.find().populate("client", "name lastname dni");
    }

    return NextResponse.json(tickets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const ticketData = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    const ticket = new Ticket(ticketData);

    await ticket.save();

    return NextResponse.json(ticket);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
