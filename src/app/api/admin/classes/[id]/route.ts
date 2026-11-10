import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import AcademicClass from '@/models/AcademicClass';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET: Fetch a single class
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { code: id.toUpperCase() };

    const academicClass = await AcademicClass.findOne(query);
    if (!academicClass) {
      return NextResponse.json(
        { success: false, message: 'Class not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, academicClass }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching class.' },
      { status: 500 }
    );
  }
}

// PUT / PATCH: Update class in MongoDB
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const body = await req.json();
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { code: id.toUpperCase() };

    // If grade is changed, recalculate order if needed
    if (body.grade && typeof body.grade === 'string') {
      const matchNumber = body.grade.match(/\d+/);
      if (matchNumber) {
        body.order = parseInt(matchNumber[0], 10);
      }
    }

    if (body.code && typeof body.code === 'string') {
      body.code = body.code.toUpperCase().trim();
    }

    const updated = await AcademicClass.findOneAndUpdate(query, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Academic class not found in MongoDB.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Class "${updated.grade}" updated successfully in MongoDB!`,
        academicClass: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update class error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update class in database.' },
      { status: 500 }
    );
  }
}

// DELETE: Remove class from MongoDB
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { code: id.toUpperCase() };

    const deleted = await AcademicClass.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Class not found in database.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Academic class "${deleted.grade}" (${deleted.code}) removed from MongoDB.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete class error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database error during class deletion.' },
      { status: 500 }
    );
  }
}

