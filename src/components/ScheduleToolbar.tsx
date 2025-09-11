'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Schedule } from '@/lib/types';
import { 
  exportToJSON, 
  exportToCSV, 
  exportToText, 
  downloadFile, 
  generateFilename,
  preparePrintView
} from '@/lib/export-utils';
import { generateSampleSchedule } from '@/lib/sample-data';
import { generateId } from '@/lib/utils';

interface ScheduleToolbarProps {
  schedule: Schedule;
  onImportSchedule: (jsonData: string) => { success: boolean; error?: string };
  onLoadSampleData: (subjects: any[]) => void;
  onClearSchedule: () => void;
}

export function ScheduleToolbar({ 
  schedule, 
  onImportSchedule, 
  onLoadSampleData, 
  onClearSchedule 
}: ScheduleToolbarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSampleMenu, setShowSampleMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const jsonContent = exportToJSON(schedule);
    downloadFile(jsonContent, generateFilename('json'), 'application/json');
    setShowExportMenu(false);
  };

  const handleExportCSV = () => {
    const csvContent = exportToCSV(schedule);
    downloadFile(csvContent, generateFilename('csv'), 'text/csv');
    setShowExportMenu(false);
  };

  const handleExportText = () => {
    const textContent = exportToText(schedule);
    downloadFile(textContent, generateFilename('txt'), 'text/plain');
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    preparePrintView(schedule);
    setShowExportMenu(false);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const result = onImportSchedule(content);
        
        if (result.success) {
          alert('Schedule imported successfully!');
        } else {
          alert(`Import failed: ${result.error}`);
        }
      } catch (error) {
        alert('Failed to read file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSampleData = (type: 'quick' | 'full') => {
    const sampleSubjects = generateSampleSchedule(type).map(subject => ({
      ...subject,
      id: generateId(),
      createdAt: new Date().toISOString()
    }));
    
    onLoadSampleData(sampleSubjects);
    setShowSampleMenu(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        {/* Left side - Main actions */}
        <div className="flex flex-wrap gap-2">
          {/* Sample Data Menu */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowSampleMenu(!showSampleMenu)}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              🎯 Sample Data
            </Button>
            
            {showSampleMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-48">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => handleLoadSampleData('quick')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  >
                    📚 Quick Start (3 subjects)
                  </button>
                  <button
                    onClick={() => handleLoadSampleData('full')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  >
                    📖 Full Example (7 subjects)
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={() => setShowSampleMenu(false)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Import */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              📥 Import
            </Button>
          </div>

          {/* Export Menu */}
          {schedule.subjects.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="text-purple-600 border-purple-600 hover:bg-purple-50"
              >
                📤 Export
              </Button>
              
              {showExportMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-48">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={handleExportJSON}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                    >
                      💾 JSON File
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                    >
                      📊 CSV File
                    </button>
                    <button
                      onClick={handleExportText}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                    >
                      📄 Text File
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handlePrint}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                    >
                      🖨️ Print Schedule
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={() => setShowExportMenu(false)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side - Clear */}
        {schedule.subjects.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your entire schedule? This action cannot be undone.')) {
                onClearSchedule();
              }
            }}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            🗑️ Clear All
          </Button>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <span>💡 <strong>Tip:</strong> Try the sample data to get started quickly</span>
          <span>📱 <strong>Mobile:</strong> Swipe left/right on the schedule</span>
          <span>🎨 <strong>Colors:</strong> Each subject gets a unique color automatically</span>
        </div>
      </div>
    </div>
  );
}