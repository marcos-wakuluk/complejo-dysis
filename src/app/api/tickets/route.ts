import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import QRCode from "qrcode";

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const eventId = url.searchParams.get("eventId");

    let tickets;

    if (eventId) {
      tickets = await Ticket.find({ event: eventId }).populate("client", "name lastname dni");
    } else if (userId) {
      tickets = await Ticket.find({ user: userId }).populate("client", "name lastname dni");
    } else {
      tickets = await Ticket.find().populate("client", "name lastname dni");
    }

    return NextResponse.json(tickets);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { event, client, tanda, price, user } = body;

    if (!event || !client || !tanda || !price || !user) {
      return NextResponse.json({ error: "Datos faltantes" }, { status: 400 });
    }

    const ticketData = {
      event,
      client,
      tanda,
      price,
      user,
      createdAt: new Date().toISOString(),
      used: false,
      scanAt: null,
      status: "pending",
      deviceId: null,
    };

    const ticket = new Ticket(ticketData);

    const qrData = JSON.stringify({ ticketId: ticket._id, eventId: event, tanda, price, client });
    ticket.qrCode = await QRCode.toDataURL(qrData);

    await ticket.save();

    const userDoc = await User.findById(client);

    if (!userDoc) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    userDoc.tickets.push(ticket._id);
    await userDoc.save();

    return NextResponse.json(ticket);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { ticketId, eventId } = body;

    if (!ticketId || !eventId) {
      return NextResponse.json({ error: "ID de ticket faltante" }, { status: 400 });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 });
    }

    if (ticket.event.toString() !== eventId) {
      return NextResponse.json({ error: "El ID del evento no corresponde con el ticket" }, { status: 400 });
    }

    if (ticket.used) {
      return NextResponse.json({ error: "El ticket ya fue usado" }, { status: 400 });
    }

    ticket.used = true;
    await ticket.save();

    return NextResponse.json({ message: "Ticket válido", ticket });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
