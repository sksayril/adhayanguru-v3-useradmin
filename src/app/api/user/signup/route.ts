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
    const { name, email, password, classLevel, board, studentId } = body;

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide full name, email, and password.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Check if student already exists
    const existingStudent = await Student.findOne({ email: cleanEmail });
    if (existingStudent) {
      return NextResponse.json(
        { success: false, message: 'A student account is already registered with this email address.' },
        { status: 409 }
      );
    }

    // 3. Generate unique student ID if not provided
    const generatedId =
      studentId && studentId.trim()
        ? studentId.trim().toUpperCase()
        : `STD-${Math.floor(10000 + Math.random() * 90000)}`;

    // 4. Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create new student record
    const newStudent = await Student.create({
      studentId: generatedId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      classLevel: classLevel || 'Class 10',
      board: board || 'WBBSE',
      streakDays: 1,
      overallProgress: 10,
      testsTaken: 0,
      practiceQuestions: 0,
      accuracyRate: 85,
      status: 'Active',
      lastLogin: new Date(),
    });

    // 6. Generate JWT token
    const token = jwt.sign(
      {
        id: newStudent._id,
        studentId: newStudent.studentId,
        email: newStudent.email,
        name: newStudent.name,
        role: 'Student',
        classLevel: newStudent.classLevel,
        board: newStudent.board,
      },
      JWT_SECRET,
      { expiresIn: '14d' }
    );

    // 7. Response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Student account created successfully!',
        student: {
          id: newStudent._id,
          studentId: newStudent.studentId,
          name: newStudent.name,
          email: newStudent.email,
          classLevel: newStudent.classLevel,
          board: newStudent.board,
          streakDays: newStudent.streakDays,
          overallProgress: newStudent.overallProgress,
        },
        token,
      },
      { status: 201 }
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
    console.error('Student signup error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Database error during student registration.',
      },
      { status: 500 }
    );
  }
}

