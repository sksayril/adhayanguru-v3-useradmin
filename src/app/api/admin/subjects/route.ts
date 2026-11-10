import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Subject from '@/models/Subject';
import Board from '@/models/Board';
import AcademicClass from '@/models/AcademicClass';

const initialSubjectsSeed = [
  // Class 10 - CBSE
  {
    name: 'Mathematics',
    code: 'CBSE-MATH-10',
    board: 'CBSE',
    classLevel: 'Class 10',
    section: 'Secondary',
    chaptersCount: 15,
    questionsCount: 13597,
    color: '#EA580C',
    description: 'Real Numbers, Polynomials, Linear Equations, Trigonometry, Statistics.',
    status: 'Active',
  },
  {
    name: 'Science (Physics, Chemistry, Biology)',
    code: 'CBSE-SCI-10',
    board: 'CBSE',
    classLevel: 'Class 10',
    section: 'Secondary',
    chaptersCount: 16,
    questionsCount: 11663,
    color: '#0284C7',
    description: 'Chemical Reactions, Acids & Bases, Electricity, Magnetic Effects, Life Processes.',
    status: 'Active',
  },
  {
    name: 'English Language & Literature',
    code: 'CBSE-ENG-10',
    board: 'CBSE',
    classLevel: 'Class 10',
    section: 'Secondary',
    chaptersCount: 12,
    questionsCount: 7770,
    color: '#8B5CF6',
    description: 'First Flight, Footprints without Feet, Grammar and Reading comprehension.',
    status: 'Active',
  },
  {
    name: 'Social Science (History, Civics, Geography)',
    code: 'CBSE-SST-10',
    board: 'CBSE',
    classLevel: 'Class 10',
    section: 'Secondary',
    chaptersCount: 18,
    questionsCount: 5827,
    color: '#10B981',
    description: 'Nationalism in India, Resources & Development, Democratic Politics.',
    status: 'Active',
  },
  {
    name: 'Computer Applications',
    code: 'CBSE-CA-10',
    board: 'CBSE',
    classLevel: 'Class 10',
    section: 'Secondary',
    chaptersCount: 8,
    questionsCount: 3200,
    color: '#EC4899',
    description: 'HTML, Cyberethics, Scratch, Python programming fundamentals.',
    status: 'Active',
  },

  // Class 10 - WBBSE (Madhyamik)
  {
    name: 'Mathematics (গনিত)',
    code: 'WBBSE-MATH-10',
    board: 'WBBSE / WBCHSE',
    classLevel: 'Class 10',
    section: 'Secondary',
    chaptersCount: 14,
    questionsCount: 4200,
    color: '#EA580C',
    description: 'একচলবিশিষ্ট দ্বিঘাত সমীকরণ, বৃত্তের স্পর্শক সংক্রান্ত উপপাদ্য, ত্রিকোণমিতি।',
    status: 'Active',
  },
  {
    name: 'Physical Science (ভৌত বিজ্ঞান)',
    code: 'WBBSE-PSC-10',
    board: 'WBBSE / WBCHSE',
    classLevel: 'Class 10',
    section: 'Secondary',
    chaptersCount: 10,
    questionsCount: 3600,
    color: '#0284C7',
    description: 'পরিবেশের জন্য ভাবনা, গ্যাসের আচরণ, তাপের ঘটনাসমূহ, আলো, চলতড়িৎ।',
    status: 'Active',
  },
  {
    name: 'Life Science (জীবন বিজ্ঞান)',
    code: 'WBBSE-LSC-10',
    board: 'WBBSE / WBCHSE',
    classLevel: 'Class 10',
    section: 'Secondary',
    chaptersCount: 8,
    questionsCount: 2900,
    color: '#10B981',
    description: 'জীবজগতে নিয়ন্ত্রণ ও সমন্বয়, জীবনের প্রবাহমানতা, বংশগতি ও কয়েকটি সাধারণ জিনগত রোগ।',
    status: 'Active',
  },

  // Class 12 - Higher Secondary Science
  {
    name: 'Physics (Advanced)',
    code: 'CBSE-PHY-12',
    board: 'CBSE',
    classLevel: 'Class 12',
    section: 'Science',
    chaptersCount: 14,
    questionsCount: 4100,
    color: '#3B82F6',
    description: 'Electrostatics, Current Electricity, Optics, Atoms & Nuclei, Semiconductor.',
    status: 'Active',
  },
  {
    name: 'Chemistry (Organic & Inorganic)',
    code: 'CBSE-CHEM-12',
    board: 'CBSE',
    classLevel: 'Class 12',
    section: 'Science',
    chaptersCount: 16,
    questionsCount: 3950,
    color: '#EC4899',
    description: 'Solutions, Electrochemistry, Coordination Compounds, Aldehydes & Ketones.',
    status: 'Active',
  },
  {
    name: 'Accountancy',
    code: 'CBSE-ACC-12',
    board: 'CBSE',
    classLevel: 'Class 12',
    section: 'Commerce',
    chaptersCount: 12,
    questionsCount: 2800,
    color: '#F59E0B',
    description: 'Partnership Firms, Company Accounts, Financial Statements Analysis.',
    status: 'Active',
  },
];

// GET: Fetch subjects from MongoDB with optional filters
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Auto-seed if empty
    const count = await Subject.countDocuments();
    if (count === 0) {
      await Subject.insertMany(initialSubjectsSeed);
    }

    const { searchParams } = new URL(req.url);
    const boardFilter = searchParams.get('board');
    const classFilter = searchParams.get('classLevel');
    const sectionFilter = searchParams.get('section');
    const search = searchParams.get('search');

    const query: any = {};

    if (boardFilter && boardFilter !== 'All') {
      query.board = { $regex: new RegExp(boardFilter, 'i') };
    }

    if (classFilter && classFilter !== 'All') {
      query.classLevel = classFilter;
    }

    if (sectionFilter && sectionFilter !== 'All') {
      query.section = sectionFilter;
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { code: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const subjects = await Subject.find(query).sort({ createdAt: -1 });

    // Aggregate statistics
    const allSubjects = await Subject.find();
    const stats = {
      totalSubjects: allSubjects.length,
      totalChapters: allSubjects.reduce((acc, s) => acc + (s.chaptersCount || 0), 0),
      totalQuestions: allSubjects.reduce((acc, s) => acc + (s.questionsCount || 0), 0),
      activeCount: allSubjects.filter((s) => s.status === 'Active').length,
    };

    return NextResponse.json(
      {
        success: true,
        subjects,
        stats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching subjects from MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch subjects from MongoDB database.',
      },
      { status: 500 }
    );
  }
}

// POST: Create a new subject in MongoDB under specific Board, Class, and Section
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      name,
      code,
      board,
      classLevel,
      section,
      chaptersCount,
      questionsCount,
      color,
      description,
      status,
    } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Subject name is required (e.g. Mathematics).' },
        { status: 400 }
      );
    }

    if (!code || !code.trim()) {
      return NextResponse.json(
        { success: false, message: 'Subject code is required (e.g. MATH-10).' },
        { status: 400 }
      );
    }

    if (!board || !board.trim()) {
      return NextResponse.json(
        { success: false, message: 'Affiliated Educational Board is required.' },
        { status: 400 }
      );
    }

    if (!classLevel || !classLevel.trim()) {
      return NextResponse.json(
        { success: false, message: 'Target Academic Class is required.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Check duplicate code
    const existing = await Subject.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `A subject with code "${cleanCode}" already exists.` },
        { status: 409 }
      );
    }

    const newSubject = await Subject.create({
      name: name.trim(),
      code: cleanCode,
      board: board.trim(),
      classLevel: classLevel.trim(),
      section: section || 'General',
      chaptersCount: Number(chaptersCount) || 10,
      questionsCount: Number(questionsCount) || 0,
      color: color || '#EA580C',
      description: description ? description.trim() : '',
      status: status || 'Active',
    });

    return NextResponse.json(
      {
        success: true,
        message: `Subject "${newSubject.name}" created under ${newSubject.classLevel} (${newSubject.board}) successfully in MongoDB!`,
        subject: newSubject,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating subject in MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Database error during subject creation.',
      },
      { status: 500 }
    );
  }
}

