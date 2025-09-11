'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DAYS_OF_WEEK, FULL_DAY_LABELS, type DayOfWeek, type SubjectFormData } from '@/lib/types';
import { SUBJECT_COLORS } from '@/lib/colors';
import { isValidTimeRange } from '@/lib/utils';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  instructor: z.string().min(1, 'Instructor name is required'),
  location: z.string().min(1, 'Location is required'),
  color: z.string(),
  days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])).min(1, 'Select at least one day'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
}).refine((data) => isValidTimeRange(data.startTime, data.endTime), {
  message: 'End time must be after start time',
  path: ['endTime'],
});

interface SubjectFormProps {
  onSubmit: (data: SubjectFormData) => { success: boolean; error?: string };
  initialData?: Partial<SubjectFormData>;
  isEditing?: boolean;
}

export function SubjectForm({ onSubmit, initialData, isEditing = false }: SubjectFormProps) {
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(initialData?.days || []);
  const [selectedColor, setSelectedColor] = useState(initialData?.color || SUBJECT_COLORS[0]);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: initialData?.name || '',
      instructor: initialData?.instructor || '',
      location: initialData?.location || '',
      color: selectedColor,
      days: selectedDays,
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '10:00',
    }
  });

  const handleDayToggle = (day: DayOfWeek) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    setSelectedDays(newDays);
    setValue('days', newDays);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setValue('color', color);
  };

  const onFormSubmit = (data: SubjectFormData) => {
    setSubmitError('');
    
    const formData: SubjectFormData = {
      ...data,
      days: selectedDays,
      color: selectedColor
    };

    const result = onSubmit(formData);
    
    if (!result.success) {
      setSubmitError(result.error || 'An error occurred');
    } else {
      if (!isEditing) {
        reset();
        setSelectedDays([]);
        setSelectedColor(SUBJECT_COLORS[0]);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {isEditing ? 'Edit Subject' : 'Add New Subject'}
      </h2>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Subject Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Subject Name</Label>
          <Input
            id="name"
            placeholder="e.g., Mathematics, Physics, History"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Instructor */}
        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            placeholder="e.g., Dr. Smith, Prof. Johnson"
            {...register('instructor')}
            className={errors.instructor ? 'border-red-500' : ''}
          />
          {errors.instructor && (
            <p className="text-sm text-red-600">{errors.instructor.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., Room 101, Lab A, Online"
            {...register('location')}
            className={errors.location ? 'border-red-500' : ''}
          />
          {errors.location && (
            <p className="text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Days Selection */}
        <div className="space-y-3">
          <Label>Days of Week</Label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedDays.includes(day)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {FULL_DAY_LABELS[day].slice(0, 3)}
              </button>
            ))}
          </div>
          {errors.days && (
            <p className="text-sm text-red-600">{errors.days.message}</p>
          )}
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              {...register('startTime')}
              className={errors.startTime ? 'border-red-500' : ''}
            />
            {errors.startTime && (
              <p className="text-sm text-red-600">{errors.startTime.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              {...register('endTime')}
              className={errors.endTime ? 'border-red-500' : ''}
            />
            {errors.endTime && (
              <p className="text-sm text-red-600">{errors.endTime.message}</p>
            )}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <Label>Subject Color</Label>
          <div className="grid grid-cols-8 gap-2">
            {SUBJECT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorChange(color)}
                className={`w-8 h-8 rounded-full transition-all duration-200 ${
                  selectedColor === color
                    ? 'ring-2 ring-gray-400 ring-offset-2 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
        >
          {isEditing ? 'Update Subject' : 'Add Subject'}
        </Button>
      </form>
    </div>
  );
}