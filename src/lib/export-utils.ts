import { Schedule } from './types';
import { formatTime12Hour, capitalizeFirst } from './utils';

export interface ExportOptions {
  includeStats?: boolean;
  includeColors?: boolean;
  format?: 'json' | 'csv' | 'txt';
}

export function exportToJSON(schedule: Schedule, options: ExportOptions = {}): string {
  const exportData = {
    ...schedule,
    exportedAt: new Date().toISOString(),
    version: '1.0',
    options
  };
  
  return JSON.stringify(exportData, null, 2);
}

export function exportToCSV(schedule: Schedule): string {
  const headers = [
    'Subject Name',
    'Instructor',
    'Location', 
    'Days',
    'Start Time',
    'End Time',
    'Duration (minutes)',
    'Color'
  ];
  
  const rows = schedule.subjects.map(subject => {
    const duration = (
      (parseInt(subject.timeSlot.end.split(':')[0]) * 60 + parseInt(subject.timeSlot.end.split(':')[1])) -
      (parseInt(subject.timeSlot.start.split(':')[0]) * 60 + parseInt(subject.timeSlot.start.split(':')[1]))
    );
    
    return [
      `"${subject.name}"`,
      `"${subject.instructor}"`,
      `"${subject.location}"`,
      `"${subject.days.map(d => capitalizeFirst(d)).join(', ')}"`,
      `"${formatTime12Hour(subject.timeSlot.start)}"`,
      `"${formatTime12Hour(subject.timeSlot.end)}"`,
      duration.toString(),
      subject.color
    ];
  });
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export function exportToText(schedule: Schedule): string {
  if (schedule.subjects.length === 0) {
    return 'No subjects in schedule.';
  }
  
  let output = `CLASS SCHEDULE\n`;
  output += `Generated: ${new Date().toLocaleString()}\n`;
  output += `Total Subjects: ${schedule.subjects.length}\n`;
  output += `\n${'='.repeat(50)}\n\n`;
  
  // Group by days
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  days.forEach(day => {
    const daySubjects = schedule.subjects.filter(s => s.days.includes(day as any));
    
    if (daySubjects.length > 0) {
      output += `${capitalizeFirst(day).toUpperCase()}\n`;
      output += `${'-'.repeat(capitalizeFirst(day).length)}\n`;
      
      // Sort by start time
      daySubjects
        .sort((a, b) => a.timeSlot.start.localeCompare(b.timeSlot.start))
        .forEach(subject => {
          output += `${formatTime12Hour(subject.timeSlot.start)} - ${formatTime12Hour(subject.timeSlot.end)}: `;
          output += `${subject.name}\n`;
          output += `  Instructor: ${subject.instructor}\n`;
          output += `  Location: ${subject.location}\n\n`;
        });
      
      output += '\n';
    }
  });
  
  return output.trim();
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateFilename(format: string, prefix: string = 'schedule'): string {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${prefix}-${date}.${format}`;
}

// Print functionality
export function preparePrintView(schedule: Schedule): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const printContent = generatePrintHTML(schedule);
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  
  // Auto-print after a short delay to ensure content is loaded
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

function generatePrintHTML(schedule: Schedule): string {
  const printStyles = `
    <style>
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        margin: 20px;
        color: #333;
      }
      h1 { 
        color: #2563eb; 
        text-align: center; 
        border-bottom: 3px solid #2563eb;
        padding-bottom: 10px;
      }
      .meta { 
        text-align: center; 
        color: #666; 
        margin: 20px 0;
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 20px 0;
      }
      th, td { 
        border: 1px solid #ddd; 
        padding: 12px; 
        text-align: left;
      }
      th { 
        background-color: #f8f9fa; 
        font-weight: bold;
        color: #374151;
      }
      .time { 
        font-weight: bold; 
        color: #059669;
      }
      .subject { 
        font-weight: bold; 
        font-size: 1.1em;
      }
      .instructor { 
        color: #6b7280; 
      }
      .location {
        color: #9ca3af;
        font-style: italic;
      }
      .days {
        color: #7c3aed;
      }
      .color-indicator {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        display: inline-block;
        margin-right: 8px;
        vertical-align: middle;
      }
      @media print {
        body { margin: 0; }
        .no-print { display: none !important; }
      }
    </style>
  `;
  
  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Class Schedule</title>
        ${printStyles}
      </head>
      <body>
        <h1>📚 Class Schedule</h1>
        <div class="meta">
          Generated on ${new Date().toLocaleDateString()} • Total Subjects: ${schedule.subjects.length}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Color</th>
              <th>Subject</th>
              <th>Instructor</th>
              <th>Location</th>
              <th>Days</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  schedule.subjects
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(subject => {
      html += `
        <tr>
          <td>
            <div class="color-indicator" style="background-color: ${subject.color};"></div>
          </td>
          <td class="subject">${subject.name}</td>
          <td class="instructor">${subject.instructor}</td>
          <td class="location">${subject.location}</td>
          <td class="days">${subject.days.map(d => capitalizeFirst(d)).join(', ')}</td>
          <td class="time">${formatTime12Hour(subject.timeSlot.start)} - ${formatTime12Hour(subject.timeSlot.end)}</td>
        </tr>
      `;
    });
  
  html += `
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; color: #9ca3af; font-size: 0.9em;">
          Generated by Class Schedule Planner
        </div>
      </body>
    </html>
  `;
  
  return html;
}