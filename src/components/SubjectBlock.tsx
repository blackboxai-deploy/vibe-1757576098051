'use client';

import React from 'react';
import { Subject } from '@/lib/types';
import { formatTime12Hour, getDurationInMinutes, formatDuration } from '@/lib/utils';
import { hexToRgba, getContrastingTextColor } from '@/lib/colors';

interface SubjectBlockProps {
  subject: Subject;
  style?: React.CSSProperties;
  onEdit?: (subject: Subject) => void;
  onDelete?: (subjectId: string) => void;
  className?: string;
}

export function SubjectBlock({ 
  subject, 
  style, 
  onEdit, 
  onDelete, 
  className = '' 
}: SubjectBlockProps) {
  const duration = getDurationInMinutes(subject.timeSlot);
  const textColor = getContrastingTextColor(subject.color);
  const bgColor = hexToRgba(subject.color, 0.9);
  
  const blockStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    border: `2px solid ${subject.color}`,
    ...style
  };

  return (
    <div
      className={`relative rounded-lg p-3 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer group ${className}`}
      style={blockStyle}
      onClick={() => onEdit?.(subject)}
    >
      {/* Time Display */}
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-medium opacity-90">
          {formatTime12Hour(subject.timeSlot.start)} - {formatTime12Hour(subject.timeSlot.end)}
        </span>
        <span className="text-xs opacity-75">
          {formatDuration(duration)}
        </span>
      </div>

      {/* Subject Name */}
      <h3 className="font-semibold text-sm mb-1 leading-tight">
        {subject.name}
      </h3>

      {/* Instructor */}
      <p className="text-xs opacity-90 mb-1">
        {subject.instructor}
      </p>

      {/* Location */}
      <p className="text-xs opacity-80 flex items-center">
        <span className="inline-block w-3 h-3 mr-1 opacity-60">📍</span>
        {subject.location}
      </p>

      {/* Action Buttons - Shown on Hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subject);
            }}
            className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            title="Edit subject"
          >
            <span className="text-xs">✏️</span>
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete "${subject.name}"?`)) {
                onDelete(subject.id);
              }
            }}
            className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/80 transition-colors"
            title="Delete subject"
          >
            <span className="text-xs">🗑️</span>
          </button>
        )}
      </div>

      {/* Bottom Border Accent */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg"
        style={{ backgroundColor: subject.color }}
      />
    </div>
  );
}