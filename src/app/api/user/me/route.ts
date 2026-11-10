import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import Student from '@/models/Student';

const JWT_SECRET = process.env.JWT_SECRET || 'dekh_education_secret_key_2026_jwt_token_secure';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('student_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated as student.' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    await connectToDatabase();
    const student = await Student.findById(decoded.id).select('-password');

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student account not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        student,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Session expired or invalid token.' },
      { status: 401 }
    );
  }
}

