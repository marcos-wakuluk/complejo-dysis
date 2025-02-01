import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function handler(req: Request) {
  switch (req.method) {
    case "GET":
      return GET();
    case "PUT":
      return PUT(req);
    case "DELETE":
      return DELETE(req);
    default:
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find({});

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const updatedEvent = await Event.findByIdAndUpdate(body._id, body, { new: true });

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const deletedEvent = await Event.findByIdAndDelete(body._id);

    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
