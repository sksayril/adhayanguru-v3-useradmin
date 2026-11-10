import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Board from '@/models/Board';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// DELETE: Remove a board from MongoDB
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    let query: any;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = {
        $or: [
          { shortCode: id.toUpperCase() },
          { shortCode: id },
        ],
      };
    }

    const deleted = await Board.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Board not found in database.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Board "${deleted.name}" (${deleted.shortCode}) deleted successfully from MongoDB.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete board error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database error during deletion.' },
      { status: 500 }
    );
  }
}

// PUT / PATCH: Update board
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const body = await req.json();

    let query: any;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { shortCode: id.toUpperCase() };
    }

    const updated = await Board.findOneAndUpdate(query, body, { new: true });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Board not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Board updated successfully.',
        board: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Update failed.' },
      { status: 500 }
    );
  }
}

