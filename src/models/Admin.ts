import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Super Admin' | 'Academic Director' | 'Senior Question Reviewer' | 'Curriculum Manager';
  status: 'Active' | 'Suspended' | 'Pending';
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, 'Please provide an administrator name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an official work email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a secure password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: true, // Selected for authentication comparisons
    },
    role: {
      type: String,
      enum: ['Super Admin', 'Academic Director', 'Senior Question Reviewer', 'Curriculum Manager'],
      default: 'Super Admin',
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Pending'],
      default: 'Active',
    },
    avatar: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in development hot-reloads
const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;

