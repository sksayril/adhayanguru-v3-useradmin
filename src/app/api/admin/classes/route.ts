import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademicClass from '@/models/AcademicClass';

// Default initial 12 academic classes (Class 1 to Class 12 matching screenshot)
const initialClassesSeed = [
  {
    grade: 'Class 1',
    code: 'STD-1',
    order: 1,
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 5,
    studentsCount: 1000,
    section: 'Primary',
    status: 'Active',
    description: 'Foundational primary education level standard.',
  },
  {
    grade: 'Class 2',
    code: 'STD-2',
    order: 2,
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 5,
    studentsCount: 955,
    section: 'Primary',
    status: 'Active',
    description: 'Primary basic numeracy and linguistic development standard.',
  },
  {
    grade: 'Class 3',
    code: 'STD-3',
    order: 3,
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 5,
    studentsCount: 910,
    section: 'Primary',
    status: 'Active',
    description: 'Primary curriculum with environmental studies.',
  },
  {
    grade: 'Class 4',
    code: 'STD-4',
    order: 4,
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 5,
    studentsCount: 865,
    section: 'Primary',
    status: 'Active',
    description: 'Upper primary readiness curriculum.',
  },
  {
    grade: 'Class 5',
    code: 'STD-5',
    order: 5,
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 5,
    studentsCount: 820,
    section: 'Primary',
    status: 'Active',
    description: 'Graduating primary standard before middle school.',
  },
  {
    grade: 'Class 6',
    code: 'STD-6',
    order: 6,
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 8,
    studentsCount: 775,
    section: 'Middle School',
    status: 'Active',
    description: 'Middle school initiation with segregated sciences and social studies.',
  },
  {
    grade: 'Class 7',
    code: 'STD-7',
    order: 7,
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 8,
    studentsCount: 730,
    section: 'Middle School',
    status: 'Active',
    description: 'Intermediate middle school standards and lab preparations.',
  },
  {
    grade: 'Class 8',
    code: 'STD-8',
    order: 8,
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 8,
    studentsCount: 685,
    section: 'Middle School',
    status: 'Active',
    description: 'Pre-secondary board foundation standard.',
  },
  {
    grade: 'Class 9',
    code: 'STD-9',
    order: 9,
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 10,
    studentsCount: 640,
    section: 'Secondary',
    status: 'Active',
    description: 'Secondary board foundation year with comprehensive board syllabus.',
  },
  {
    grade: 'Class 10',
    code: 'STD-10',
    order: 10,
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 10,
    studentsCount: 595,
    section: 'Secondary',
    status: 'Active',
    description: 'Secondary Board Examination class (Madhyamik, CBSE Board, ICSE).',
  },
  {
    grade: 'Class 11',
    code: 'STD-11',
    order: 11,
    boards: 'CBSE, ISC, WBCHSE',
    subjectsCount: 12,
    studentsCount: 550,
    section: 'Higher Secondary',
    status: 'Active',
    description: 'Higher secondary stream selection: Science, Commerce, Humanities.',
  },
  {
    grade: 'Class 12',
    code: 'STD-12',
    order: 12,
    boards: 'CBSE, ISC, WBCHSE',
    subjectsCount: 12,
    studentsCount: 505,
    section: 'Higher Secondary',
    status: 'Active',
    description: 'Senior Secondary Board final exam and competitive test preparation.',
  },
];

// GET: Fetch all classes from MongoDB Atlas
export async function GET() {
  try {
    await connectToDatabase();

    // Auto-seed if collection is empty
    const count = await AcademicClass.countDocuments();
    if (count === 0) {
      await AcademicClass.insertMany(initialClassesSeed);
    }

    const classes = await AcademicClass.find().sort({ order: 1, createdAt: 1 });

    const stats = {
      totalClasses: classes.length,
      totalSubjects: classes.reduce((acc, c) => acc + (c.subjectsCount || 0), 0),
      totalStudents: classes.reduce((acc, c) => acc + (c.studentsCount || 0), 0),
      activeCount: classes.filter((c) => c.status === 'Active').length,
    };

    return NextResponse.json(
      {
        success: true,
        classes,
        stats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching academic classes:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch classes from MongoDB database.',
      },
      { status: 500 }
    );
  }
}

// POST: Insert a new class into MongoDB Atlas
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      grade,
      code,
      boards,
      subjectsCount,
      studentsCount,
      section,
      description,
      status,
    } = body;

    if (!grade || !grade.trim()) {
      return NextResponse.json(
        { success: false, message: 'Class Grade name is required (e.g. Class 10).' },
        { status: 400 }
      );
    }

    if (!code || !code.trim()) {
      return NextResponse.json(
        { success: false, message: 'Standard code is required (e.g. STD-10).' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Check duplicate code
    const existing = await AcademicClass.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Class with code "${cleanCode}" already exists.` },
        { status: 409 }
      );
    }

    // Determine numeric order
    const matchNumber = grade.match(/\d+/);
    const parsedOrder = matchNumber ? parseInt(matchNumber[0], 10) : 99;

    const newClass = await AcademicClass.create({
      grade: grade.trim(),
      code: cleanCode,
      order: parsedOrder,
      boards: boards ? boards.trim() : 'CBSE, ICSE, WBCHSE',
      subjectsCount: Number(subjectsCount) || 5,
      studentsCount: Number(studentsCount) || 0,
      section: section || 'General',
      description: description ? description.trim() : '',
      status: status || 'Active',
    });

    return NextResponse.json(
      {
        success: true,
        message: `Academic class "${newClass.grade}" (${newClass.code}) inserted into MongoDB successfully!`,
        academicClass: newClass,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating class in MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Database error during class creation.',
      },
      { status: 500 }
    );
  }
}

