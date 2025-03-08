import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const role = url.searchParams.get("role");
    const id = url.searchParams.get("id");

    let users;
    if (id) {
      users = await User.findOne({ _id: id });

      if (!users) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const tickets = await Ticket.find({
        _id: { $in: users.tickets },
      });

      const ticketsWithEventDetails = await Promise.all(
        tickets.map(async (ticket) => {
          const event = await Event.findById(ticket.event);
          return {
            ...ticket.toObject(),
            event,
          };
        })
      );

      return NextResponse.json(ticketsWithEventDetails);
    } else {
      const query = role ? { role } : {};
      users = await User.find(query);
    }

    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const updatedUser = await User.findByIdAndUpdate(body._id, body, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function POST() {
  // try {
  // await connectDB();
  // const body = await req.json();
  //   const newUser = new User(body);
  //   const savedUser = await newUser.save();
  //   return NextResponse.json(savedUser);
  // } catch (error) {
  //   console.log(error);
  //   return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  // }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    await connectDB();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
