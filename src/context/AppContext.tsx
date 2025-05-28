import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  UserProfile, 
  Subject, 
  Topic, 
  Schedule,
  ScheduleStrategy,
  DifficultyLevel
} from '../types';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/localStorage';
import { generateSchedule } from '../utils/scheduleGenerator';

// Initial user profile state
const initialUserProfile: UserProfile = {
  workHours: { start: '09:00', end: '18:00' },
  studyHours: { start: '19:00', end: '22:00' },
  weeklyOffDays: ['sunday'],
  studyIntensity: 'medium',
  examDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString() // 3 months from now
};

// Sample subjects (for new users)
const sampleSubjects: Subject[] = [
  {
    id: uuidv4(),
    name: 'Maths',
    difficulty: 'easy',
    topics: [
      { id: uuidv4(), name: 'Basic Arithmetic', estimatedTimeMinutes: 60, completed: false },
      { id: uuidv4(), name: 'Percentages', estimatedTimeMinutes: 90, completed: false }
    ]
  },
  {
    id: uuidv4(),
    name: 'History',
    difficulty: 'medium',
    topics: [
      { id: uuidv4(), name: 'Modern India', estimatedTimeMinutes: 120, completed: false },
      { id: uuidv4(), name: 'Freedom Struggle', estimatedTimeMinutes: 150, completed: false }
    ]
  },
  {
    id: uuidv4(),
    name: 'Science',
    difficulty: 'hard',
    topics: [
      { id: uuidv4(), name: 'Physics Laws', estimatedTimeMinutes: 180, completed: false },
      { id: uuidv4(), name: 'Chemical Reactions', estimatedTimeMinutes: 120, completed: false }
    ]
  }
];

// Define the context type
type AppContextType = {
  userProfile: UserProfile;
  subjects: Subject[];
  currentSchedule: Schedule | null;
  isProfileComplete: boolean;
  updateUserProfile: (profile: UserProfile) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (subjectId: string) => void;
  addTopic: (subjectId: string, topic: Omit<Topic, 'id' | 'completed'>) => void;
  updateTopic: (subjectId: string, topic: Topic) => void;
  deleteTopic: (subjectId: string, topicId: string) => void;
  markTopicCompleted: (subjectId: string, topicId: string, completed: boolean) => void;
  generateNewSchedule: (strategy: ScheduleStrategy) => void;
  resetData: () => void;
  getSubjectProgress: (subjectId: string) => { completed: number; total: number; percentage: number };
  getOverallProgress: () => { completed: number; total: number; percentage: number };
};

// Create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => 
    getStorageItem(STORAGE_KEYS.USER_PROFILE, initialUserProfile)
  );
  
  const [subjects, setSubjects] = useState<Subject[]>(() => 
    getStorageItem(STORAGE_KEYS.SUBJECTS, sampleSubjects)
  );
  
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(() => 
    getStorageItem(STORAGE_KEYS.SCHEDULE, null)
  );
  
  // Check if profile is complete
  const isProfileComplete = !!userProfile.examDate && 
    userProfile.workHours.start !== '' && 
    userProfile.workHours.end !== '' && 
    userProfile.studyHours.start !== '' && 
    userProfile.studyHours.end !== '';

  // Save data to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.USER_PROFILE, userProfile);
  }, [userProfile]);
  
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.SUBJECTS, subjects);
  }, [subjects]);
  
  useEffect(() => {
    if (currentSchedule) {
      setStorageItem(STORAGE_KEYS.SCHEDULE, currentSchedule);
    }
  }, [currentSchedule]);

  // User profile actions
  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  // Subject actions
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subject,
      id: uuidv4(),
      topics: []
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === updatedSubject.id ? updatedSubject : subject
      )
    );
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
  };

  // Topic actions
  const addTopic = (subjectId: string, topic: Omit<Topic, 'id' | 'completed'>) => {
    const newTopic: Topic = {
      ...topic,
      id: uuidv4(),
      completed: false
    };
    
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? { ...subject, topics: [...subject.topics, newTopic] }
          : subject
      )
    );
  };

  const updateTopic = (subjectId: string, updatedTopic: Topic) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map(topic => 
                topic.id === updatedTopic.id ? updatedTopic : topic
              )
            }
          : subject
      )
    );
  };

  const deleteTopic = (subjectId: string, topicId: string) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.filter(topic => topic.id !== topicId)
            }
          : subject
      )
    );
  };

  const markTopicCompleted = (subjectId: string, topicId: string, completed: boolean) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map(topic => 
                topic.id === topicId
                  ? { ...topic, completed }
                  : topic
              )
            }
          : subject
      )
    );
  };

  // Schedule actions
  const generateNewSchedule = (strategy: ScheduleStrategy) => {
    if (!isProfileComplete || subjects.length === 0) return;
    
    const schedule = generateSchedule(userProfile, subjects, strategy);
    setCurrentSchedule(schedule);
  };

  // Progress calculation
  const getSubjectProgress = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return { completed: 0, total: 0, percentage: 0 };
    
    const total = subject.topics.length;
    const completed = subject.topics.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const getOverallProgress = () => {
    const total = subjects.reduce((acc, subject) => acc + subject.topics.length, 0);
    const completed = subjects.reduce(
      (acc, subject) => acc + subject.topics.filter(t => t.completed).length,
      0
    );
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  // Reset all data
  const resetData = () => {
    setUserProfile(initialUserProfile);
    setSubjects(sampleSubjects);
    setCurrentSchedule(null);
  };

  // Context value
  const contextValue: AppContextType = {
    userProfile,
    subjects,
    currentSchedule,
    isProfileComplete,
    updateUserProfile,
    addSubject,
    updateSubject,
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
    markTopicCompleted,
    generateNewSchedule,
    resetData,
    getSubjectProgress,
    getOverallProgress
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};