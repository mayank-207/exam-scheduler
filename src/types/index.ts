// Define types for the application

export type StudyIntensity = 'light' | 'medium' | 'intense';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type TimeSlot = {
  start: string; // Format: "HH:MM" in 24-hour format
  end: string; // Format: "HH:MM" in 24-hour format
};

export type UserProfile = {
  workHours: TimeSlot;
  studyHours: TimeSlot;
  weeklyOffDays: WeekDay[];
  studyIntensity: StudyIntensity;
  examDate: string; // ISO date string
};

export type Topic = {
  id: string;
  name: string;
  estimatedTimeMinutes: number;
  notes?: string;
  completed: boolean;
};

export type Subject = {
  id: string;
  name: string;
  difficulty: DifficultyLevel;
  topics: Topic[];
};

export type ScheduleStrategy = 'one-subject' | 'daily-rotation' | 'weekend-revision';

export type ScheduleEntry = {
  id: string;
  date: string; // ISO date string
  timeSlot: TimeSlot;
  subjectId: string;
  topicId: string;
};

export type Schedule = {
  id: string;
  name: string;
  strategy: ScheduleStrategy;
  entries: ScheduleEntry[];
  createdAt: string; // ISO date string
};