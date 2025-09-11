// Beautiful color palette for subjects
export const SUBJECT_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F59E0B', // Yellow
  '#8B5A2B', // Brown
  '#6B7280', // Gray
  '#DC2626', // Rose
];

export const SUBJECT_COLOR_VARIANTS = {
  '#3B82F6': { bg: 'bg-blue-500', text: 'text-white', light: 'bg-blue-100', border: 'border-blue-200' },
  '#10B981': { bg: 'bg-emerald-500', text: 'text-white', light: 'bg-emerald-100', border: 'border-emerald-200' },
  '#F59E0B': { bg: 'bg-amber-500', text: 'text-white', light: 'bg-amber-100', border: 'border-amber-200' },
  '#EF4444': { bg: 'bg-red-500', text: 'text-white', light: 'bg-red-100', border: 'border-red-200' },
  '#8B5CF6': { bg: 'bg-purple-500', text: 'text-white', light: 'bg-purple-100', border: 'border-purple-200' },
  '#06B6D4': { bg: 'bg-cyan-500', text: 'text-white', light: 'bg-cyan-100', border: 'border-cyan-200' },
  '#84CC16': { bg: 'bg-lime-500', text: 'text-white', light: 'bg-lime-100', border: 'border-lime-200' },
  '#F97316': { bg: 'bg-orange-500', text: 'text-white', light: 'bg-orange-100', border: 'border-orange-200' },
  '#EC4899': { bg: 'bg-pink-500', text: 'text-white', light: 'bg-pink-100', border: 'border-pink-200' },
  '#6366F1': { bg: 'bg-indigo-500', text: 'text-white', light: 'bg-indigo-100', border: 'border-indigo-200' },
  '#14B8A6': { bg: 'bg-teal-500', text: 'text-white', light: 'bg-teal-100', border: 'border-teal-200' },
  '#8B5A2B': { bg: 'bg-amber-700', text: 'text-white', light: 'bg-amber-50', border: 'border-amber-300' },
  '#6B7280': { bg: 'bg-gray-500', text: 'text-white', light: 'bg-gray-100', border: 'border-gray-200' },
  '#DC2626': { bg: 'bg-rose-600', text: 'text-white', light: 'bg-rose-100', border: 'border-rose-200' },
} as const;

export function getRandomColor(): string {
  return SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)];
}

export function getColorVariants(color: string) {
  return SUBJECT_COLOR_VARIANTS[color as keyof typeof SUBJECT_COLOR_VARIANTS] || {
    bg: 'bg-gray-500',
    text: 'text-white',
    light: 'bg-gray-100',
    border: 'border-gray-200'
  };
}

export function hexToRgba(hex: string, alpha: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(107, 114, 128, ${alpha})`; // fallback to gray

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getContrastingTextColor(backgroundColor: string): string {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function generateGradient(color: string): string {
  const rgba1 = hexToRgba(color, 0.8);
  const rgba2 = hexToRgba(color, 0.6);
  return `linear-gradient(135deg, ${rgba1} 0%, ${rgba2} 100%)`;
}