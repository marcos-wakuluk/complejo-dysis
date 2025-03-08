import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Guest from "@/models/Guest";

export async function GET() {
  try {
    await connectDB();

    const guests = await Guest.find({});

    return NextResponse.json(guests);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const guest = await Guest.create(body);

    return NextResponse.json(guest);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const updatedGuest = await Guest.findByIdAndUpdate(body._id, body, { new: true });

    if (!updatedGuest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json(updatedGuest);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    await connectDB();

    const deletedGuest = await Guest.findByIdAndDelete(id);

    if (!deletedGuest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json(deletedGuest);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 });
  }
}
