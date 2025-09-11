import { Subject } from './types';
import { SUBJECT_COLORS } from './colors';

export const SAMPLE_SUBJECTS: Omit<Subject, 'id' | 'createdAt'>[] = [
  {
    name: 'Advanced Mathematics',
    instructor: 'Dr. Sarah Johnson',
    location: 'Room 301',
    color: SUBJECT_COLORS[0], // Blue
    days: ['monday', 'wednesday', 'friday'],
    timeSlot: {
      start: '09:00',
      end: '10:30'
    }
  },
  {
    name: 'Physics Laboratory',
    instructor: 'Prof. Michael Chen',
    location: 'Lab B - Science Building',
    color: SUBJECT_COLORS[1], // Emerald
    days: ['tuesday', 'thursday'],
    timeSlot: {
      start: '14:00',
      end: '16:00'
    }
  },
  {
    name: 'World History',
    instructor: 'Dr. Emily Rodriguez',
    location: 'Room 205',
    color: SUBJECT_COLORS[3], // Red
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    timeSlot: {
      start: '11:00',
      end: '12:00'
    }
  },
  {
    name: 'Computer Programming',
    instructor: 'Mr. David Wilson',
    location: 'Computer Lab 1',
    color: SUBJECT_COLORS[4], // Purple
    days: ['tuesday', 'thursday'],
    timeSlot: {
      start: '10:00',
      end: '11:30'
    }
  },
  {
    name: 'English Literature',
    instructor: 'Ms. Lisa Thompson',
    location: 'Room 102',
    color: SUBJECT_COLORS[5], // Cyan
    days: ['monday', 'wednesday', 'friday'],
    timeSlot: {
      start: '13:30',
      end: '15:00'
    }
  },
  {
    name: 'Chemistry',
    instructor: 'Dr. Robert Anderson',
    location: 'Chemistry Lab',
    color: SUBJECT_COLORS[6], // Lime
    days: ['wednesday', 'friday'],
    timeSlot: {
      start: '15:30',
      end: '17:00'
    }
  },
  {
    name: 'Physical Education',
    instructor: 'Coach Maria Garcia',
    location: 'Gymnasium',
    color: SUBJECT_COLORS[7], // Orange
    days: ['tuesday', 'thursday'],
    timeSlot: {
      start: '16:30',
      end: '18:00'
    }
  }
];

export const QUICK_START_SUBJECTS: Omit<Subject, 'id' | 'createdAt'>[] = [
  {
    name: 'Mathematics',
    instructor: 'Dr. Smith',
    location: 'Room 101',
    color: SUBJECT_COLORS[0],
    days: ['monday', 'wednesday', 'friday'],
    timeSlot: {
      start: '09:00',
      end: '10:00'
    }
  },
  {
    name: 'Science',
    instructor: 'Prof. Johnson',
    location: 'Lab A',
    color: SUBJECT_COLORS[1],
    days: ['tuesday', 'thursday'],
    timeSlot: {
      start: '14:00',
      end: '15:30'
    }
  },
  {
    name: 'History',
    instructor: 'Ms. Brown',
    location: 'Room 205',
    color: SUBJECT_COLORS[3],
    days: ['monday', 'tuesday', 'wednesday'],
    timeSlot: {
      start: '11:00',
      end: '12:00'
    }
  }
];

export function generateSampleSchedule(type: 'full' | 'quick' = 'quick'): Omit<Subject, 'id' | 'createdAt'>[] {
  return type === 'full' ? SAMPLE_SUBJECTS : QUICK_START_SUBJECTS;
}