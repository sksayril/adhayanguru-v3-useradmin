import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBoard extends Document {
  name: string;
  shortCode: string;
  category: 'National' | 'State' | 'International';
  stateOrRegion: string;
  curriculum: string;
  description: string;
  classesCount: number;
  subjectsCount: number;
  studentsCount: number;
  status: 'Active' | 'Inactive';
  iconBg: string;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: [true, 'Please provide the educational board name'],
      trim: true,
      maxlength: [120, 'Board name cannot exceed 120 characters'],
    },
    shortCode: {
      type: String,
      required: [true, 'Please provide a short code or acronym'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Short code cannot exceed 20 characters'],
    },
    category: {
      type: String,
      enum: ['National', 'State', 'International'],
      default: 'National',
    },
    stateOrRegion: {
      type: String,
      default: 'Pan India',
      trim: true,
    },
    curriculum: {
      type: String,
      default: 'Standard Curriculum',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    classesCount: {
      type: Number,
      default: 12,
      min: 0,
    },
    subjectsCount: {
      type: Number,
      default: 30,
      min: 0,
    },
    studentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    iconBg: {
      type: String,
      default: '#FFF7ED',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in Next.js development hot-reloads
const Board: Model<IBoard> =
  mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema);

export default Board;

