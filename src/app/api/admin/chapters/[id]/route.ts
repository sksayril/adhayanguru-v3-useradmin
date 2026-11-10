import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Chapter from '@/models/Chapter';
import Subject from '@/models/Subject';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET: Fetch single chapter
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { name: id };
    const chapter = await Chapter.findOne(query);

    if (!chapter) {
      return NextResponse.json(
        { success: false, message: 'Chapter not found in database.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, chapter }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching chapter.' },
      { status: 500 }
    );
  }
}

// PUT / PATCH: Update chapter in MongoDB
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const body = await req.json();

    if (body.topics && typeof body.topics === 'string') {
      body.topics = body.topics.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { name: id };

    const updated = await Chapter.findOneAndUpdate(query, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Chapter not found in database.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Chapter "${updated.name}" updated successfully in MongoDB!`,
        chapter: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update chapter error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update chapter in database.' },
      { status: 500 }
    );
  }
}

// DELETE: Delete chapter from MongoDB
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { name: id };
    const deleted = await Chapter.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Chapter not found in database.' },
        { status: 404 }
      );
    }

    // Decrement chaptersCount on Subject if exists
    await Subject.updateOne(
      { name: deleted.subjectName, classLevel: deleted.classLevel },
      { $inc: { chaptersCount: -1 } }
    ).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        message: `Chapter "${deleted.name}" deleted from MongoDB.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete chapter error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database error during chapter deletion.' },
      { status: 500 }
    );
  }
}

