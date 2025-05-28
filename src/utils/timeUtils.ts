// Utility functions for time and date operations

import { TimeSlot, WeekDay } from '../types';

// Convert time string (HH:MM) to minutes since midnight
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert minutes since midnight to time string (HH:MM)
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Calculate duration between two time slots in minutes
export const calculateDuration = (timeSlot: TimeSlot): number => {
  const startMinutes = timeToMinutes(timeSlot.start);
  const endMinutes = timeToMinutes(timeSlot.end);
  return endMinutes - startMinutes;
};

// Get formatted display for time range
export const formatTimeRange = (timeSlot: TimeSlot): string => {
  return `${formatTime(timeSlot.start)} - ${formatTime(timeSlot.end)}`;
};

// Format time from 24h to 12h format
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Get the day name from a date
export const getDayName = (date: Date): WeekDay => {
  const days: WeekDay[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[date.getDay()];
};

// Calculate days remaining until a target date
export const getDaysUntil = (targetDate: string): number => {
  const target = new Date(targetDate);
  const today = new Date();
  
  // Reset time to midnight for accurate day calculation
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

// Get an array of dates between start and end dates
export const getDatesBetween = (startDate: string, endDate: string): Date[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: Date[] = [];
  
  // Reset time to midnight
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Format date as YYYY-MM-DD
export const formatDateYMD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format date for display (e.g., "Mon, 15 Jan 2025")
export const formatDateDisplay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};