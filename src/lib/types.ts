export interface TimeSlot {
  start: string; // Format: "HH:mm" (24-hour)
  end: string;   // Format: "HH:mm" (24-hour)
}

export interface Subject {
  id: string;
  name: string;
  instructor: string;
  location: string;
  color: string;
  days: DayOfWeek[];
  timeSlot: TimeSlot;
  createdAt: string;
}

export type DayOfWeek = 
  | 'monday'
  | 'tuesday' 
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface Schedule {
  subjects: Subject[];
  lastUpdated: string;
}

export interface SubjectFormData {
  name: string;
  instructor: string;
  location: string;
  color: string;
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
}

export interface TimeSlotGrid {
  hour: number;
  time12: string;
  time24: string;
}

export interface ConflictInfo {
  hasConflict: boolean;
  conflictingSubjects: Subject[];
  message: string;
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

export const DAY_LABELS = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed', 
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun'
};

export const FULL_DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday', 
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};