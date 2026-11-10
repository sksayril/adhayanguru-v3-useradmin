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
    const { email, password } = body;

    // 1. Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Find admin in database
    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. No admin account found with this email.' },
        { status: 401 }
      );
    }

    // 3. Verify admin account status
    if (admin.status === 'Suspended') {
      return NextResponse.json(
        { success: false, message: 'Your administrative account has been suspended. Contact support.' },
        { status: 403 }
      );
    }

    // 4. Compare passwords with bcrypt
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid password. Please check your administrative credentials.' },
        { status: 401 }
      );
    }

    // 5. Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    // 6. Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 7. Return success response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Authentication successful.',
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          status: admin.status,
          lastLogin: admin.lastLogin,
        },
        token,
      },
      { status: 200 }
    );

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Database error during authentication.',
      },
      { status: 500 }
    );
  }
}

