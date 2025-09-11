import { Subject, Schedule } from './types';

const STORAGE_KEY = 'class-schedule-planner';

export class ScheduleStorage {
  static getSchedule(): Schedule {
    if (typeof window === 'undefined') {
      return { subjects: [], lastUpdated: new Date().toISOString() };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { subjects: [], lastUpdated: new Date().toISOString() };
      }

      const parsed = JSON.parse(stored) as Schedule;
      return {
        subjects: parsed.subjects || [],
        lastUpdated: parsed.lastUpdated || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error loading schedule from storage:', error);
      return { subjects: [], lastUpdated: new Date().toISOString() };
    }
  }

  static saveSchedule(schedule: Schedule): void {
    if (typeof window === 'undefined') return;

    try {
      const updatedSchedule: Schedule = {
        ...schedule,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSchedule));
    } catch (error) {
      console.error('Error saving schedule to storage:', error);
    }
  }

  static addSubject(subject: Subject): Schedule {
    const schedule = this.getSchedule();
    const updatedSchedule = {
      ...schedule,
      subjects: [...schedule.subjects, subject]
    };
    this.saveSchedule(updatedSchedule);
    return updatedSchedule;
  }

  static updateSubject(subjectId: string, updates: Partial<Subject>): Schedule {
    const schedule = this.getSchedule();
    const updatedSchedule = {
      ...schedule,
      subjects: schedule.subjects.map(subject =>
        subject.id === subjectId
          ? { ...subject, ...updates }
          : subject
      )
    };
    this.saveSchedule(updatedSchedule);
    return updatedSchedule;
  }

  static deleteSubject(subjectId: string): Schedule {
    const schedule = this.getSchedule();
    const updatedSchedule = {
      ...schedule,
      subjects: schedule.subjects.filter(subject => subject.id !== subjectId)
    };
    this.saveSchedule(updatedSchedule);
    return updatedSchedule;
  }

  static clearSchedule(): Schedule {
    const emptySchedule: Schedule = {
      subjects: [],
      lastUpdated: new Date().toISOString()
    };
    this.saveSchedule(emptySchedule);
    return emptySchedule;
  }

  static exportSchedule(): string {
    const schedule = this.getSchedule();
    return JSON.stringify(schedule, null, 2);
  }

  static importSchedule(jsonData: string): Schedule {
    try {
      const imported = JSON.parse(jsonData) as Schedule;
      if (!imported.subjects || !Array.isArray(imported.subjects)) {
        throw new Error('Invalid schedule format');
      }
      this.saveSchedule(imported);
      return imported;
    } catch (error) {
      console.error('Error importing schedule:', error);
      throw new Error('Failed to import schedule: Invalid format');
    }
  }

  static loadSampleData(subjects: Subject[]): Schedule {
    const schedule: Schedule = {
      subjects: subjects,
      lastUpdated: new Date().toISOString()
    };
    this.saveSchedule(schedule);
    return schedule;
  }

  static addMultipleSubjects(subjects: Subject[]): Schedule {
    const currentSchedule = this.getSchedule();
    const updatedSchedule = {
      ...currentSchedule,
      subjects: [...currentSchedule.subjects, ...subjects]
    };
    this.saveSchedule(updatedSchedule);
    return updatedSchedule;
  }
}