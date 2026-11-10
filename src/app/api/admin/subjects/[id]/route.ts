import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Subject from '@/models/Subject';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET single subject
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { code: id.toUpperCase() };

    const subject = await Subject.findOne(query);
    if (!subject) {
      return NextResponse.json(
        { success: false, message: 'Subject not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, subject }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching subject.' },
      { status: 500 }
    );
  }
}

// PUT / PATCH: Update subject in MongoDB
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const body = await req.json();
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { code: id.toUpperCase() };

    if (body.code && typeof body.code === 'string') {
      body.code = body.code.toUpperCase().trim();
    }

    const updated = await Subject.findOneAndUpdate(query, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Subject not found in database.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Subject "${updated.name}" updated successfully in MongoDB!`,
        subject: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update subject error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update subject in database.' },
      { status: 500 }
    );
  }
}

// DELETE: Remove subject from MongoDB
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { code: id.toUpperCase() };

    const deleted = await Subject.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Subject not found in database.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Subject "${deleted.name}" (${deleted.code}) removed from MongoDB.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete subject error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database error during subject deletion.' },
      { status: 500 }
    );
  }
}

