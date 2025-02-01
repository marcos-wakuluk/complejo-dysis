import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";

export async function handler(req: Request) {
  switch (req.method) {
    case "GET":
      return GET();
    case "POST":
      return POST(req);
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

    const sales = await Sale.find({});

    return NextResponse.json(sales);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const newSale = new Sale(body);
    await newSale.save();

    return NextResponse.json(newSale, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const updatedSale = await Sale.findByIdAndUpdate(body.id, body, { new: true });

    if (!updatedSale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSale);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update sale" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();
    const deletedSale = await Sale.findByIdAndDelete(id);

    if (!deletedSale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete sale" }, { status: 500 });
  }
}
