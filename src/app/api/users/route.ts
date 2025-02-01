import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function handler(req: Request) {
  switch (req.method) {
    case 'GET':
      return GET();
    case 'PUT':
      return PUT(req);
    case 'DELETE':
      return DELETE(req);
    default:
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({});

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const updatedUser = await User.findByIdAndUpdate(body._id, body, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  try {
    await connectDB();


    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
