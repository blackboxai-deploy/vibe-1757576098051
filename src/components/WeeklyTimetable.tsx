'use client';

import React from 'react';
import { Subject, DAYS_OF_WEEK, DAY_LABELS, type DayOfWeek } from '@/lib/types';
import { generateTimeSlots, getSubjectPosition } from '@/lib/utils';
import { SubjectBlock } from './SubjectBlock';

interface WeeklyTimetableProps {
  subjects: Subject[];
  onEditSubject?: (subject: Subject) => void;
  onDeleteSubject?: (subjectId: string) => void;
  startHour?: number;
  endHour?: number;
}

export function WeeklyTimetable({ 
  subjects, 
  onEditSubject, 
  onDeleteSubject,
  startHour = 7,
  endHour = 22 
}: WeeklyTimetableProps) {
  const timeSlots = generateTimeSlots(startHour, endHour);

  // Group subjects by day
  const subjectsByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = subjects.filter(subject => subject.days.includes(day));
    return acc;
  }, {} as Record<DayOfWeek, Subject[]>);

  // Calculate row height for each hour (60px per hour)
  const hourHeight = 60;

  const renderDayColumn = (day: DayOfWeek) => {
    const daySubjects = subjectsByDay[day];

    return (
      <div key={day} className="relative min-h-full">
        {/* Day Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3">
          <h3 className="text-sm font-semibold text-gray-900 text-center">
            {DAY_LABELS[day]}
          </h3>
        </div>

        {/* Day Content */}
        <div 
          className="relative"
          style={{ height: timeSlots.length * hourHeight }}
        >
          {/* Time Grid Lines */}
          {timeSlots.map((slot, index) => (
            <div
              key={slot.time24}
              className="absolute left-0 right-0 border-b border-gray-100"
              style={{ top: index * hourHeight, height: hourHeight }}
            />
          ))}

          {/* Subject Blocks */}
          {daySubjects.map((subject) => {
            const { top, height } = getSubjectPosition(subject.timeSlot, startHour);
            
            return (
              <div
                key={`${day}-${subject.id}`}
                className="absolute left-1 right-1 z-20"
                style={{
                  top: top,
                  height: height,
                  minHeight: '40px'
                }}
              >
                <SubjectBlock
                  subject={subject}
                  onEdit={onEditSubject}
                  onDelete={onDeleteSubject}
                  className="h-full"
                />
              </div>
            );
          })}

          {/* Empty State for Day */}
          {daySubjects.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400 p-4">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-sm">No classes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (subjects.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-8 sm:p-12 text-center">
          <div className="text-4xl sm:text-6xl mb-4">📚</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No subjects added yet
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Create your first subject to see your weekly schedule
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="space-y-2 text-sm">
              <p className="text-blue-800">
                <strong>🎯 Quick Start:</strong> Use sample data above to get started instantly
              </p>
              <p className="text-purple-800">
                <strong>🎨 Pro Tip:</strong> Each subject gets a unique color automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Mobile View Notice */}
      <div className="block sm:hidden bg-blue-50 border-b border-blue-200 p-3">
        <p className="text-xs text-blue-800 text-center">
          📱 Swipe left/right to view different days
        </p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid sm:grid-cols-8 min-h-[600px]">
        {/* Time Column */}
        <div className="border-r border-gray-200 bg-gray-50">
          {/* Header Spacer */}
          <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 p-3">
            <div className="text-sm font-semibold text-gray-600 text-center">Time</div>
          </div>
          
          {/* Time Slots */}
          <div 
            className="relative"
            style={{ height: timeSlots.length * hourHeight }}
          >
            {timeSlots.map((slot, index) => (
              <div
                key={slot.time24}
                className="absolute left-0 right-0 border-b border-gray-200 px-1 py-1 flex items-center justify-center"
                style={{ top: index * hourHeight, height: hourHeight }}
              >
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-900">
                    {slot.time12}
                  </div>
                  <div className="text-xs text-gray-500 hidden lg:block">
                    {slot.time24}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day Columns */}
        {DAYS_OF_WEEK.map(renderDayColumn)}
      </div>

      {/* Mobile Scrollable View */}
      <div className="block sm:hidden overflow-x-auto">
        <div className="flex min-w-max">
          {/* Time Column */}
          <div className="flex-shrink-0 w-16 border-r border-gray-200 bg-gray-50">
            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 p-2">
              <div className="text-xs font-semibold text-gray-600 text-center">Time</div>
            </div>
            
            <div 
              className="relative"
              style={{ height: timeSlots.length * hourHeight }}
            >
              {timeSlots.map((slot, index) => (
                <div
                  key={slot.time24}
                  className="absolute left-0 right-0 border-b border-gray-200 px-1 py-1 flex items-center justify-center"
                  style={{ top: index * hourHeight, height: hourHeight }}
                >
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-900">
                      {slot.time12.replace(' ', '')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day Columns - Mobile */}
          {DAYS_OF_WEEK.map((day) => {
            const daySubjects = subjectsByDay[day];
            return (
            <div key={`mobile-${day}`} className="flex-shrink-0 w-32 relative min-h-full">
              {/* Day Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2">
                <h3 className="text-xs font-semibold text-gray-900 text-center">
                  {DAY_LABELS[day]}
                </h3>
              </div>

              {/* Day Content */}
              <div 
                className="relative border-r border-gray-100"
                style={{ height: timeSlots.length * hourHeight }}
              >
                {/* Time Grid Lines */}
                {timeSlots.map((slot, index) => (
                  <div
                    key={slot.time24}
                    className="absolute left-0 right-0 border-b border-gray-100"
                    style={{ top: index * hourHeight, height: hourHeight }}
                  />
                ))}

                {/* Subject Blocks */}
                {daySubjects.map((subject) => {
                  const { top, height } = getSubjectPosition(subject.timeSlot, startHour);
                  
                  return (
                    <div
                      key={`mobile-${day}-${subject.id}`}
                      className="absolute left-1 right-1 z-20"
                      style={{
                        top: top,
                        height: height,
                        minHeight: '40px'
                      }}
                    >
                      <SubjectBlock
                        subject={subject}
                        onEdit={onEditSubject}
                        onDelete={onDeleteSubject}
                        className="h-full text-xs"
                      />
                    </div>
                  );
                })}

                {/* Empty State for Day */}
                {daySubjects.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400 p-2">
                      <div className="text-lg mb-1">📅</div>
                      <p className="text-xs">No classes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* Schedule Summary */}
      <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
          <span>
            Total subjects: <strong>{subjects.length}</strong>
          </span>
          <span>
            Schedule: <strong>{startHour}:00 - {endHour}:00</strong>
          </span>
          <span className="text-xs text-gray-500">
            📱 Scroll horizontally on mobile
          </span>
        </div>
      </div>
    </div>
  );
}