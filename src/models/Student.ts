import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudent extends Document {
  studentId: string;
  name: string;
  email: string;
  password: string;
  classLevel: string;
  board: string;
  stream?: string;
  enrolledSubjects: string[];
  streakDays: number;
  overallProgress: number;
  testsTaken: number;
  practiceQuestions: number;
  accuracyRate: number;
  status: 'Active' | 'Inactive';
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide student full name'],
      trim: true,
      maxlength: [70, 'Name cannot exceed 70 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide student email address'],
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
      required: [true, 'Please provide password'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    classLevel: {
      type: String,
      default: 'Class 10',
    },
    board: {
      type: String,
      default: 'WBBSE',
    },
    stream: {
      type: String,
      default: 'General',
    },
    enrolledSubjects: {
      type: [String],
      default: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    },
    streakDays: {
      type: Number,
      default: 1,
    },
    overallProgress: {
      type: Number,
      default: 15,
    },
    testsTaken: {
      type: Number,
      default: 0,
    },
    practiceQuestions: {
      type: Number,
      default: 0,
    },
    accuracyRate: {
      type: Number,
      default: 80,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
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
const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;

