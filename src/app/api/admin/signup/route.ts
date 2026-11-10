import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'dekh_education_secret_key_2026_jwt_token_secure';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { name, email, password, role } = body;

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide name, email, and password.' },
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

    // 2. Check if admin with this email already exists
    const existingAdmin = await Admin.findOne({ email: cleanEmail });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'An administrator account already exists with this email address.' },
        { status: 409 }
      );
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new Admin
    const newAdmin = await Admin.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'Super Admin',
      status: 'Active',
      lastLogin: new Date(),
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Return response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin account created successfully.',
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          status: newAdmin.status,
        },
        token,
      },
      { status: 201 }
    );

    // Set secure cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Admin signup error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Database connection error during registration.',
      },
      { status: 500 }
    );
  }
}

