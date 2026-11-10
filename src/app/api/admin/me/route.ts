import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'dekh_education_secret_key_2026_jwt_token_secure';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          status: admin.status,
          lastLogin: admin.lastLogin,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication check failed' },
      { status: 401 }
    );
  }
}

