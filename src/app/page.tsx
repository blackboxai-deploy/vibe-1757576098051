'use client';

import React, { useState } from 'react';
import { SubjectForm } from '@/components/SubjectForm';
import { WeeklyTimetable } from '@/components/WeeklyTimetable';
import { ScheduleToolbar } from '@/components/ScheduleToolbar';
import { Button } from '@/components/ui/button';
import { useSchedule } from '@/hooks/use-schedule';
import { Subject, SubjectFormData } from '@/lib/types';

type ViewMode = 'form' | 'schedule';

export default function SchedulePlannerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('schedule');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  
  const {
    schedule,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    clearSchedule,
    importSchedule,
    loadSampleData
  } = useSchedule();

  const handleAddSubject = (formData: SubjectFormData) => {
    const result = addSubject(formData);
    if (result.success) {
      setViewMode('schedule');
    }
    return result;
  };

  const handleUpdateSubject = (formData: SubjectFormData) => {
    if (!editingSubject) return { success: false, error: 'No subject selected' };
    
    const result = updateSubject(editingSubject.id, {
      name: formData.name,
      instructor: formData.instructor,
      location: formData.location,
      color: formData.color,
      days: formData.days,
      timeSlot: {
        start: formData.startTime,
        end: formData.endTime
      }
    });

    if (result.success) {
      setEditingSubject(null);
      setViewMode('schedule');
    }
    return result;
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setViewMode('form');
  };

  const handleDeleteSubject = (subjectId: string) => {
    deleteSubject(subjectId);
  };

  const handleClearSchedule = () => {
    clearSchedule();
  };

  const handleLoadSampleData = (subjects: Subject[]) => {
    const confirmMessage = schedule.subjects.length > 0
      ? 'This will replace your current schedule. Continue?'
      : 'Load sample data to get started?';
    
    if (window.confirm(confirmMessage)) {
      loadSampleData(subjects);
      setViewMode('schedule');
    }
  };

  const cancelEdit = () => {
    setEditingSubject(null);
    setViewMode('schedule');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          <Button
            variant={viewMode === 'schedule' ? 'default' : 'ghost'}
            onClick={() => {
              setViewMode('schedule');
              setEditingSubject(null);
            }}
            className="flex-1"
          >
            📅 View Schedule
          </Button>
          <Button
            variant={viewMode === 'form' ? 'default' : 'ghost'}
            onClick={() => {
              setViewMode('form');
              setEditingSubject(null);
            }}
            className="flex-1"
          >
            ➕ Add Subject
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {schedule.subjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Subjects</p>
                <p className="text-2xl font-bold">{schedule.subjects.length}</p>
              </div>
              <div className="text-2xl opacity-80">📚</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">This Week</p>
                <p className="text-2xl font-bold">
                  {schedule.subjects.reduce((acc, subject) => acc + subject.days.length, 0)} Classes
                </p>
              </div>
              <div className="text-2xl opacity-80">⏰</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Last Updated</p>
                <p className="text-sm font-medium">
                  {new Date(schedule.lastUpdated).toLocaleDateString()}
                </p>
              </div>
              <div className="text-2xl opacity-80">🔄</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'form' ? (
        <div className="max-w-2xl mx-auto">
          <SubjectForm
            onSubmit={editingSubject ? handleUpdateSubject : handleAddSubject}
            initialData={editingSubject ? {
              name: editingSubject.name,
              instructor: editingSubject.instructor,
              location: editingSubject.location,
              color: editingSubject.color,
              days: editingSubject.days,
              startTime: editingSubject.timeSlot.start,
              endTime: editingSubject.timeSlot.end,
            } : undefined}
            isEditing={!!editingSubject}
          />
          
          {editingSubject && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={cancelEdit}
                className="px-6"
              >
                Cancel Edit
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Schedule Toolbar */}
          <ScheduleToolbar
            schedule={schedule}
            onImportSchedule={importSchedule}
            onLoadSampleData={handleLoadSampleData}
            onClearSchedule={handleClearSchedule}
          />

          {/* Quick Add Button for existing schedules */}
          {schedule.subjects.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={() => setViewMode('form')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                ➕ Add Another Subject
              </Button>
            </div>
          )}

          {/* Weekly Timetable */}
          <WeeklyTimetable
            subjects={schedule.subjects}
            onEditSubject={handleEditSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        </div>
      )}
    </div>
  );
}