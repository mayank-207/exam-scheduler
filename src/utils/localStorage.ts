// Utility functions for handling localStorage

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'exam-scheduler-user-profile',
  SUBJECTS: 'exam-scheduler-subjects',
  SCHEDULE: 'exam-scheduler-schedule',
};

// Get item from localStorage
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${error}`);
    return defaultValue;
  }
};

// Set item in localStorage
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in localStorage: ${error}`);
  }
};

// Clear item from localStorage
export const clearStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing item from localStorage: ${error}`);
  }
};

// Export storage keys for convenient access
export { STORAGE_KEYS };