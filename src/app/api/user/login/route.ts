import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import Student from '@/models/Student';

const JWT_SECRET = process.env.JWT_SECRET || 'dekh_education_secret_key_2026_jwt_token_secure';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { identifier, email, studentId, password } = body;

    const loginQuery = (identifier || email || studentId || '').trim();

    if (!loginQuery || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide your Student ID or Email and password.' },
        { status: 400 }
      );
    }

    // Find student by email or studentId
    const student = await Student.findOne({
      $or: [
        { email: loginQuery.toLowerCase() },
        { studentId: loginQuery.toUpperCase() },
        { studentId: loginQuery },
      ],
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. No student account found with this ID or email.' },
        { status: 401 }
      );
    }

    if (student.status === 'Inactive') {
      return NextResponse.json(
        { success: false, message: 'Student account is inactive. Please contact school administration.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, student.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    // Update lastLogin and increment streak
    student.lastLogin = new Date();
    await student.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: student._id,
        studentId: student.studentId,
        email: student.email,
        name: student.name,
        role: 'Student',
        classLevel: student.classLevel,
        board: student.board,
      },
      JWT_SECRET,
      { expiresIn: '14d' }
    );

    // Return response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful!',
        student: {
          id: student._id,
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          classLevel: student.classLevel,
          board: student.board,
          streakDays: student.streakDays,
          overallProgress: student.overallProgress,
          testsTaken: student.testsTaken,
          practiceQuestions: student.practiceQuestions,
          accuracyRate: student.accuracyRate,
        },
        token,
      },
      { status: 200 }
    );

    response.cookies.set('student_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60, // 14 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Student login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Database connection error during student login.',
      },
      { status: 500 }
    );
  }
}

