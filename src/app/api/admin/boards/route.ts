import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Board from '@/models/Board';

// Initial seed data to populate database if collection is empty
const initialBoardsSeed = [
  {
    name: 'Central Board of Secondary Education',
    shortCode: 'CBSE',
    category: 'National',
    stateOrRegion: 'National (India)',
    curriculum: 'NCERT Guidelines 2026',
    description:
      'Premier national board providing recognized curriculum across India and overseas schools.',
    classesCount: 12,
    subjectsCount: 42,
    studentsCount: 6840,
    status: 'Active',
    iconBg: '#FFF7ED',
  },
  {
    name: 'Council for the Indian School Certificate Examinations',
    shortCode: 'ICSE / ISC',
    category: 'National',
    stateOrRegion: 'Pan India',
    curriculum: 'CISCE Standards',
    description:
      'Comprehensive English medium curriculum emphasizing practical knowledge, literature, and science proficiency.',
    classesCount: 12,
    subjectsCount: 38,
    studentsCount: 3120,
    status: 'Active',
    iconBg: '#EFF6FF',
  },
  {
    name: 'West Bengal Board of Secondary Education',
    shortCode: 'WBBSE / WBCHSE',
    category: 'State',
    stateOrRegion: 'West Bengal',
    curriculum: 'WBBSE Syllabus 2026',
    description:
      'State education authority delivering standard secondary and higher secondary education in Bengal.',
    classesCount: 10,
    subjectsCount: 28,
    studentsCount: 1450,
    status: 'Active',
    iconBg: '#F0FDF4',
  },
  {
    name: 'Maharashtra State Board of Secondary & Higher Secondary Education',
    shortCode: 'MSBSHSE',
    category: 'State',
    stateOrRegion: 'Maharashtra',
    curriculum: 'State Board Syllabus',
    description:
      'Autonomous body delivering SSC and HSC exams for institutions situated throughout Maharashtra state.',
    classesCount: 10,
    subjectsCount: 24,
    studentsCount: 620,
    status: 'Active',
    iconBg: '#FEF2F2',
  },
  {
    name: 'Cambridge Assessment International Education',
    shortCode: 'CAIE',
    category: 'International',
    stateOrRegion: 'International / Global',
    curriculum: 'Cambridge International Curriculum',
    description:
      'Globally recognized British curriculum offering Cambridge Primary, Checkpoint, IGCSE and A-Levels.',
    classesCount: 12,
    subjectsCount: 20,
    studentsCount: 280,
    status: 'Active',
    iconBg: '#FAF5FF',
  },
  {
    name: 'International Baccalaureate Organization',
    shortCode: 'IB',
    category: 'International',
    stateOrRegion: 'International / Global',
    curriculum: 'IB Diploma Programme',
    description:
      'Global educational foundation offering rigorous, high quality inquiry-based education for children 3-19.',
    classesCount: 12,
    subjectsCount: 16,
    studentsCount: 170,
    status: 'Active',
    iconBg: '#FFFBEB',
  },
];

// GET: Fetch all boards from MongoDB
export async function GET() {
  try {
    await connectToDatabase();

    // Check count and seed if empty
    const count = await Board.countDocuments();
    if (count === 0) {
      await Board.insertMany(initialBoardsSeed);
    }

    const boards = await Board.find().sort({ createdAt: -1 });

    // Aggregate stats directly from database records
    const stats = {
      totalBoards: boards.length,
      activeClasses: boards.reduce((acc, b) => acc + (b.classesCount || 0), 0),
      mappedSubjects: boards.reduce((acc, b) => acc + (b.subjectsCount || 0), 0),
      enrolledStudents: boards.reduce((acc, b) => acc + (b.studentsCount || 0), 0),
    };

    return NextResponse.json(
      {
        success: true,
        boards,
        stats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching boards from MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch educational boards from database.',
      },
      { status: 500 }
    );
  }
}

// POST: Create a new board in MongoDB
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      name,
      shortCode,
      category,
      stateOrRegion,
      curriculum,
      description,
      classesCount,
      subjectsCount,
      studentsCount,
      status,
    } = body;

    // 1. Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Board name is required.' },
        { status: 400 }
      );
    }

    if (!shortCode || !shortCode.trim()) {
      return NextResponse.json(
        { success: false, message: 'Board short code / acronym is required.' },
        { status: 400 }
      );
    }

    const cleanCode = shortCode.trim().toUpperCase();

    // 2. Duplicate Check
    const existing = await Board.findOne({ shortCode: cleanCode });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: `A board with code "${cleanCode}" already exists.`,
        },
        { status: 409 }
      );
    }

    // 3. Create Board
    const newBoard = await Board.create({
      name: name.trim(),
      shortCode: cleanCode,
      category: category || 'National',
      stateOrRegion: (stateOrRegion && stateOrRegion.trim()) || 'Pan India',
      curriculum: (curriculum && curriculum.trim()) || 'Standard NCERT/State Board',
      description: (description && description.trim()) || 'Newly registered educational board.',
      classesCount: Number(classesCount) || 12,
      subjectsCount: Number(subjectsCount) || 30,
      studentsCount: Number(studentsCount) || 0,
      status: status || 'Active',
      iconBg: '#FFF7ED',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Educational board created successfully in MongoDB Atlas!',
        board: newBoard,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating board in MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Database error during board creation.',
      },
      { status: 500 }
    );
  }
}

