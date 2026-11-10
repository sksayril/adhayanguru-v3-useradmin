import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChapter extends Document {
  name: string;
  chapterNumber: number;
  subjectName: string;
  board: string;
  classLevel: string;
  totalQuestions: number;
  topics: string[];
  description?: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    name: {
      type: String,
      required: [true, 'Please provide the chapter name'],
      trim: true,
      maxlength: [120, 'Chapter name cannot exceed 120 characters'],
    },
    chapterNumber: {
      type: Number,
      default: 1,
      min: 1,
    },
    subjectName: {
      type: String,
      required: [true, 'Please select the parent curriculum subject'],
      trim: true,
    },
    board: {
      type: String,
      required: [true, 'Please specify the educational board'],
      trim: true,
      default: 'CBSE',
    },
    classLevel: {
      type: String,
      required: [true, 'Please specify the target class (e.g. Class 10)'],
      trim: true,
      default: 'Class 10',
    },
    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },
    topics: {
      type: [String],
      default: [],
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
const Chapter: Model<IChapter> =
  mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', ChapterSchema);

export default Chapter;

