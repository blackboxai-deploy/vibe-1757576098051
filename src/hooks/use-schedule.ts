'use client';

import { useState, useEffect } from 'react';
import { Subject, Schedule, SubjectFormData, ConflictInfo } from '@/lib/types';
import { ScheduleStorage } from '@/lib/storage';
import { generateId, checkSubjectConflicts } from '@/lib/utils';
import { getRandomColor } from '@/lib/colors';

export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule>({ subjects: [], lastUpdated: '' });
  const [loading, setLoading] = useState(true);

  // Load schedule from storage on mount
  useEffect(() => {
    const loadSchedule = () => {
      try {
        const stored = ScheduleStorage.getSchedule();
        setSchedule(stored);
      } catch (error) {
        console.error('Error loading schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const addSubject = (formData: SubjectFormData): { success: boolean; error?: string } => {
    try {
      // Create new subject
      const newSubject: Subject = {
        id: generateId(),
        name: formData.name,
        instructor: formData.instructor,
        location: formData.location,
        color: formData.color || getRandomColor(),
        days: formData.days,
        timeSlot: {
          start: formData.startTime,
          end: formData.endTime
        },
        createdAt: new Date().toISOString()
      };

      // Check for conflicts
      const conflicts = checkSubjectConflicts(newSubject, schedule.subjects);
      if (conflicts.hasConflict) {
        return { success: false, error: conflicts.message };
      }

      // Add subject to storage and update state
      const updatedSchedule = ScheduleStorage.addSubject(newSubject);
      setSchedule(updatedSchedule);
      
      return { success: true };
    } catch (error) {
      console.error('Error adding subject:', error);
      return { success: false, error: 'Failed to add subject' };
    }
  };

  const updateSubject = (subjectId: string, updates: Partial<Subject>): { success: boolean; error?: string } => {
    try {
      const currentSubject = schedule.subjects.find(s => s.id === subjectId);
      if (!currentSubject) {
        return { success: false, error: 'Subject not found' };
      }

      // Create updated subject for conflict checking
      const updatedSubject = { ...currentSubject, ...updates };
      
      // Check for conflicts (excluding current subject)
      const conflicts = checkSubjectConflicts(updatedSubject, schedule.subjects, subjectId);
      if (conflicts.hasConflict) {
        return { success: false, error: conflicts.message };
      }

      // Update subject in storage and state
      const updatedSchedule = ScheduleStorage.updateSubject(subjectId, updates);
      setSchedule(updatedSchedule);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating subject:', error);
      return { success: false, error: 'Failed to update subject' };
    }
  };

  const deleteSubject = (subjectId: string): { success: boolean; error?: string } => {
    try {
      const updatedSchedule = ScheduleStorage.deleteSubject(subjectId);
      setSchedule(updatedSchedule);
      return { success: true };
    } catch (error) {
      console.error('Error deleting subject:', error);
      return { success: false, error: 'Failed to delete subject' };
    }
  };

  const clearSchedule = (): { success: boolean; error?: string } => {
    try {
      const updatedSchedule = ScheduleStorage.clearSchedule();
      setSchedule(updatedSchedule);
      return { success: true };
    } catch (error) {
      console.error('Error clearing schedule:', error);
      return { success: false, error: 'Failed to clear schedule' };
    }
  };

  const checkConflicts = (formData: SubjectFormData, excludeId?: string): ConflictInfo => {
    const tempSubject = {
      name: formData.name,
      instructor: formData.instructor,
      location: formData.location,
      color: formData.color || getRandomColor(),
      days: formData.days,
      timeSlot: {
        start: formData.startTime,
        end: formData.endTime
      }
    };

    return checkSubjectConflicts(tempSubject, schedule.subjects, excludeId);
  };

  const exportSchedule = (): string => {
    return ScheduleStorage.exportSchedule();
  };

  const importSchedule = (jsonData: string): { success: boolean; error?: string } => {
    try {
      const importedSchedule = ScheduleStorage.importSchedule(jsonData);
      setSchedule(importedSchedule);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Import failed' };
    }
  };

  const loadSampleData = (subjects: Subject[]): { success: boolean; error?: string } => {
    try {
      // Clear existing schedule and load sample data
      const updatedSchedule = ScheduleStorage.loadSampleData(subjects);
      setSchedule(updatedSchedule);
      return { success: true };
    } catch (error) {
      console.error('Error loading sample data:', error);
      return { success: false, error: 'Failed to load sample data' };
    }
  };

  const addMultipleSubjects = (subjects: Subject[]): { success: boolean; error?: string } => {
    try {
      // Check for conflicts with all subjects
      for (const subject of subjects) {
        const conflicts = checkSubjectConflicts(subject, schedule.subjects);
        if (conflicts.hasConflict) {
          return { 
            success: false, 
            error: `Conflict detected with "${subject.name}": ${conflicts.message}` 
          };
        }
      }

      const updatedSchedule = ScheduleStorage.addMultipleSubjects(subjects);
      setSchedule(updatedSchedule);
      return { success: true };
    } catch (error) {
      console.error('Error adding multiple subjects:', error);
      return { success: false, error: 'Failed to add subjects' };
    }
  };

  return {
    schedule,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    clearSchedule,
    checkConflicts,
    exportSchedule,
    importSchedule,
    loadSampleData,
    addMultipleSubjects
  };
}