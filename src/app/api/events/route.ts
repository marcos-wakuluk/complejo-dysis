import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    const query = status ? { status } : {};
    const events = await Event.find(query);

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
    let updatedEvent;

    if (body._id) {
      updatedEvent = await Event.findByIdAndUpdate(body._id, body, { new: true });

      if (!updatedEvent) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
    } else {
      updatedEvent = new Event(body);
      await updatedEvent.save();
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update or create event" }, { status: 500 });
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
