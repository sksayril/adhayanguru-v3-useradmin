import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  board: string;
  classLevel: string;
  section: string;
  chaptersCount: number;
  questionsCount: number;
  color: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, 'Please provide subject name (e.g. Mathematics)'],
      trim: true,
      maxlength: [80, 'Subject name cannot exceed 80 characters'],
    },
    code: {
      type: String,
      required: [true, 'Please provide subject code (e.g. MATH-10)'],
      trim: true,
      uppercase: true,
      maxlength: [30, 'Subject code cannot exceed 30 characters'],
    },
    board: {
      type: String,
      required: [true, 'Please select or enter the affiliated board (e.g. CBSE, WBBSE)'],
      trim: true,
      default: 'CBSE',
    },
    classLevel: {
      type: String,
      required: [true, 'Please specify the target class (e.g. Class 10)'],
      trim: true,
      default: 'Class 10',
    },
    section: {
      type: String,
      default: 'General',
      trim: true,
    },
    chaptersCount: {
      type: Number,
      default: 12,
      min: 0,
    },
    questionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    color: {
      type: String,
      default: '#EA580C',
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

// Prevent re-compilation of model in Next.js development hot-reloads
const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;

