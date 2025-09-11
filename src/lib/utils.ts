import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Subject, TimeSlot, DayOfWeek, ConflictInfo, TimeSlotGrid } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatTime24Hour(time12: string): string {
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12;
  
  let [, hours, minutes, period] = match;
  let hour24 = parseInt(hours);
  
  if (period.toUpperCase() === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}`;
}

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function isTimeOverlapping(timeSlot1: TimeSlot, timeSlot2: TimeSlot): boolean {
  const start1 = parseTimeToMinutes(timeSlot1.start);
  const end1 = parseTimeToMinutes(timeSlot1.end);
  const start2 = parseTimeToMinutes(timeSlot2.start);
  const end2 = parseTimeToMinutes(timeSlot2.end);
  
  return start1 < end2 && start2 < end1;
}

export function checkSubjectConflicts(
  newSubject: Omit<Subject, 'id' | 'createdAt'>, 
  existingSubjects: Subject[],
  excludeId?: string
): ConflictInfo {
  const conflicts: Subject[] = [];
  
  for (const subject of existingSubjects) {
    if (excludeId && subject.id === excludeId) continue;
    
    // Check if subjects share any common days
    const commonDays = newSubject.days.filter(day => subject.days.includes(day));
    
    if (commonDays.length > 0) {
      // Check if time slots overlap
      if (isTimeOverlapping(newSubject.timeSlot, subject.timeSlot)) {
        conflicts.push(subject);
      }
    }
  }
  
  return {
    hasConflict: conflicts.length > 0,
    conflictingSubjects: conflicts,
    message: conflicts.length > 0 
      ? `Time conflict with: ${conflicts.map(s => s.name).join(', ')}`
      : ''
  };
}

export function generateTimeSlots(startHour: number = 7, endHour: number = 22): TimeSlotGrid[] {
  const slots: TimeSlotGrid[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    const time24 = `${hour.toString().padStart(2, '0')}:00`;
    const time12 = formatTime12Hour(time24);
    
    slots.push({
      hour,
      time24,
      time12
    });
  }
  
  return slots;
}

export function getDurationInMinutes(timeSlot: TimeSlot): number {
  const start = parseTimeToMinutes(timeSlot.start);
  const end = parseTimeToMinutes(timeSlot.end);
  return end - start;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getSubjectPosition(
  timeSlot: TimeSlot,
  startHour: number = 7
): { top: number; height: number } {
  const startMinutes = parseTimeToMinutes(timeSlot.start);
  const endMinutes = parseTimeToMinutes(timeSlot.end);
  const baseMinutes = startHour * 60;
  
  // Each hour = 60px, so 1 minute = 1px
  const top = startMinutes - baseMinutes;
  const height = endMinutes - startMinutes;
  
  return { top, height };
}

export function isValidTimeRange(start: string, end: string): boolean {
  const startMinutes = parseTimeToMinutes(start);
  const endMinutes = parseTimeToMinutes(end);
  
  return endMinutes > startMinutes;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getDayColor(day: DayOfWeek): string {
  const colors = {
    monday: 'text-blue-600',
    tuesday: 'text-green-600',
    wednesday: 'text-purple-600',
    thursday: 'text-orange-600',
    friday: 'text-red-600',
    saturday: 'text-cyan-600',
    sunday: 'text-pink-600'
  };
  
  return colors[day] || 'text-gray-600';
}