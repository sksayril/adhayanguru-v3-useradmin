import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Chapter from '@/models/Chapter';
import Subject from '@/models/Subject';

const initialChaptersSeed = [
  {
    name: 'Trigonometric Ratios & Identities',
    chapterNumber: 8,
    subjectName: 'Mathematics',
    board: 'CBSE',
    classLevel: 'Class 10',
    totalQuestions: 142,
    topics: ['Trigonometric Ratios of Acute Angles', 'Specific Angles 30°, 45°, 60°', 'Trigonometric Identities'],
    description: 'Core trigonometry concepts for board examinations.',
    status: 'Active',
  },
  {
    name: 'Quadratic Equations & Roots',
    chapterNumber: 4,
    subjectName: 'Mathematics',
    board: 'CBSE',
    classLevel: 'Class 10',
    totalQuestions: 98,
    topics: ['Standard Form of Quadratic Equation', 'Factorisation Method', 'Quadratic Formula & Nature of Roots'],
    description: 'Quadratic equation algebraic solutions and word problems.',
    status: 'Active',
  },
  {
    name: 'Electricity & Electric Current',
    chapterNumber: 12,
    subjectName: 'Physics',
    board: 'CBSE',
    classLevel: 'Class 10',
    totalQuestions: 110,
    topics: ['Electric Current & Potential Difference', 'Ohm\'s Law & Resistance', 'Series & Parallel Combinations', 'Joule\'s Heating Law'],
    description: 'Circuit physics and electrical energy calculations.',
    status: 'Active',
  },
  {
    name: 'Acids, Bases and Salts',
    chapterNumber: 2,
    subjectName: 'Chemistry',
    board: 'CBSE',
    classLevel: 'Class 10',
    totalQuestions: 85,
    topics: ['Indicators & Neutralization', 'pH Scale Applications', 'Preparation of Bleaching Powder, Plaster of Paris'],
    description: 'Chemical properties and everyday reactions of acids and bases.',
    status: 'Active',
  },
  {
    name: 'Life Processes & Respiration',
    chapterNumber: 6,
    subjectName: 'Biology',
    board: 'CBSE',
    classLevel: 'Class 10',
    totalQuestions: 120,
    topics: ['Autotrophic & Heterotrophic Nutrition', 'Human Respiratory System', 'Circulatory System & Excretion'],
    description: 'Essential biological mechanisms maintaining human life.',
    status: 'Active',
  },
  {
    name: 'Linear Equations in Two Variables',
    chapterNumber: 3,
    subjectName: 'Mathematics',
    board: 'CBSE',
    classLevel: 'Class 9',
    totalQuestions: 94,
    topics: ['Linear Equation Representation', 'Graph of Linear Equations in Two Variables', 'Geometric Solutions'],
    description: 'Foundational coordinate algebra for Class 9 standards.',
    status: 'Active',
  },
  {
    name: 'বৃত্তের স্পর্শক সংক্রান্ত উপপাদ্য (Tangents to Circle)',
    chapterNumber: 7,
    subjectName: 'Mathematics (গনিত)',
    board: 'WBBSE / WBCHSE',
    classLevel: 'Class 10',
    totalQuestions: 115,
    topics: ['বৃত্তের স্পর্শক ও স্পর্শবিন্দু', 'স্পর্শক সংক্রান্ত জ্যামিতিক উপপাদ্য'],
    description: 'মাধ্যমিক পরীক্ষার জন্য গুরুত্বপূর্ণ জ্যামিতি অধ্যায়।',
    status: 'Active',
  },
  {
    name: 'চলতড়িৎ ও তড়িৎচৌম্বকীয় ঘটনা (Current Electricity)',
    chapterNumber: 6,
    subjectName: 'Physical Science (ভৌত বিজ্ঞান)',
    board: 'WBBSE / WBCHSE',
    classLevel: 'Class 10',
    totalQuestions: 88,
    topics: ['ওহমের সূত্র', 'তড়িৎক্ষমতা ও গৃহস্থালির বিদ্যুৎ সংযোগ', 'ফ্লেমিং-এর বামহস্ত নিয়ম'],
    description: 'পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ দশম শ্রেণীর ভৌত বিজ্ঞান।',
    status: 'Active',
  },
];

// GET: Fetch chapters from MongoDB with optional query filters
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Auto-seed if empty
    const count = await Chapter.countDocuments();
    if (count === 0) {
      await Chapter.insertMany(initialChaptersSeed);
    }

    const { searchParams } = new URL(req.url);
    const boardFilter = searchParams.get('board');
    const classFilter = searchParams.get('classLevel');
    const subjectFilter = searchParams.get('subjectName');
    const search = searchParams.get('search');

    const query: any = {};

    if (boardFilter && boardFilter !== 'All') {
      query.board = { $regex: new RegExp(boardFilter, 'i') };
    }

    if (classFilter && classFilter !== 'All') {
      query.classLevel = classFilter;
    }

    if (subjectFilter && subjectFilter !== 'All') {
      query.subjectName = { $regex: new RegExp(subjectFilter, 'i') };
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { subjectName: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const chapters = await Chapter.find(query).sort({ chapterNumber: 1, createdAt: -1 });

    // Aggregate statistics
    const allChapters = await Chapter.find();
    const uniqueSubjects = new Set(allChapters.map((c) => c.subjectName));

    const stats = {
      totalChapters: allChapters.length,
      totalQuestions: allChapters.reduce((acc, c) => acc + (c.totalQuestions || 0), 0),
      uniqueSubjectsCount: uniqueSubjects.size,
      activeCount: allChapters.filter((c) => c.status === 'Active').length,
    };

    return NextResponse.json(
      {
        success: true,
        chapters,
        stats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching chapters from MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch chapters from MongoDB database.',
      },
      { status: 500 }
    );
  }
}

// POST: Insert a new chapter under a subject, class, and board in MongoDB
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      name,
      chapterNumber,
      subjectName,
      board,
      classLevel,
      totalQuestions,
      topics,
      description,
      status,
    } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Chapter name is required.' },
        { status: 400 }
      );
    }

    if (!subjectName || !subjectName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Subject name is required.' },
        { status: 400 }
      );
    }

    if (!classLevel || !classLevel.trim()) {
      return NextResponse.json(
        { success: false, message: 'Target Class is required.' },
        { status: 400 }
      );
    }

    if (!board || !board.trim()) {
      return NextResponse.json(
        { success: false, message: 'Educational Board is required.' },
        { status: 400 }
      );
    }

    // Process topics if provided as string or array
    let parsedTopics: string[] = [];
    if (Array.isArray(topics)) {
      parsedTopics = topics;
    } else if (typeof topics === 'string' && topics.trim()) {
      parsedTopics = topics.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const newChapter = await Chapter.create({
      name: name.trim(),
      chapterNumber: Number(chapterNumber) || 1,
      subjectName: subjectName.trim(),
      board: board.trim(),
      classLevel: classLevel.trim(),
      totalQuestions: Number(totalQuestions) || 0,
      topics: parsedTopics,
      description: description ? description.trim() : '',
      status: status || 'Active',
    });

    // Optionally increment chaptersCount in Subject if matching record exists
    await Subject.updateOne(
      { name: subjectName.trim(), classLevel: classLevel.trim() },
      { $inc: { chaptersCount: 1 } }
    ).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        message: `Chapter "${newChapter.name}" created under ${newChapter.subjectName} (${newChapter.classLevel} - ${newChapter.board}) successfully in MongoDB!`,
        chapter: newChapter,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating chapter in MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Database error during chapter creation.',
      },
      { status: 500 }
    );
  }
}

