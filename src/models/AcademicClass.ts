import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAcademicClass extends Document {
  grade: string;
  code: string;
  order: number;
  boards: string;
  subjectsCount: number;
  studentsCount: number;
  section?: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const AcademicClassSchema = new Schema<IAcademicClass>(
  {
    grade: {
      type: String,
      required: [true, 'Please provide the class grade name (e.g. Class 10)'],
      trim: true,
      maxlength: [50, 'Grade name cannot exceed 50 characters'],
    },
    code: {
      type: String,
      required: [true, 'Please provide a standard code (e.g. STD-10)'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Class code cannot exceed 20 characters'],
    },
    order: {
      type: Number,
      default: 1,
    },
    boards: {
      type: String,
      default: 'CBSE, ICSE, WBCHSE',
      trim: true,
    },
    subjectsCount: {
      type: Number,
      default: 5,
      min: 0,
    },
    studentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    section: {
      type: String,
      default: 'General',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation in development hot-reloads
const AcademicClass: Model<IAcademicClass> =
  mongoose.models.AcademicClass ||
  mongoose.model<IAcademicClass>('AcademicClass', AcademicClassSchema);

export default AcademicClass;

