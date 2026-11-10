export interface StatItem {
  id: string;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  iconName: 'students' | 'parents' | 'boards' | 'classes' | 'subjects' | 'questions';
  iconColor: string;
  bgColor: string;
}

export interface QuestionItem {
  id: number;
  preview: string;
  classNum: string;
  subject: string;
  chapter: string;
  type: 'MCQ' | 'Descriptive' | 'Theory' | 'Short';
  status: 'Published' | 'Draft';
  hasImage?: boolean;
}

export interface BoardItem {
  id: string;
  name: string;
  shortCode: string;
  stateOrRegion: string;
  curriculum: string;
  classesCount: number;
  subjectsCount: number;
  studentsCount: number;
  status: 'Active' | 'Inactive';
  description?: string;
  iconBg: string;
}

export interface SubjectDistribution {
  subject: string;
  percentage: number;
  count: number;
  color: string;
}

export interface UserGrowthPoint {
  date: string;
  students: number;
  parents: number;
}

export interface PlatformProgressItem {
  label: string;
  current: number;
  total: number;
  percentage: number;
  barColor: string;
  glowColor: string;
}

