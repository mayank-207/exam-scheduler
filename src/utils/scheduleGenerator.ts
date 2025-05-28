import { v4 as uuidv4 } from 'uuid';
import { 
  UserProfile, 
  Subject, 
  Topic, 
  Schedule, 
  ScheduleEntry, 
  ScheduleStrategy,
  WeekDay,
  TimeSlot
} from '../types';
import { 
  getDayName, 
  getDatesBetween, 
  formatDateYMD,
  calculateDuration
} from './timeUtils';

// Generate a study schedule based on user profile, subjects, and strategy
export const generateSchedule = (
  userProfile: UserProfile,
  subjects: Subject[],
  strategy: ScheduleStrategy
): Schedule => {
  // Calculate total days until exam
  const today = new Date();
  const examDate = new Date(userProfile.examDate);
  const availableDates = getDatesBetween(today.toISOString(), examDate.toISOString());
  
  // Filter out off days
  const studyDates = availableDates.filter(
    date => !userProfile.weeklyOffDays.includes(getDayName(date))
  );
  
  // Calculate daily study time in minutes
  const dailyStudyMinutes = calculateDuration(userProfile.studyHours);
  
  // Sort subjects by difficulty (hard first)
  const sortedSubjects = [...subjects].sort((a, b) => {
    const difficultyOrder = { hard: 0, medium: 1, easy: 2 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });
  
  // Flatten all topics into a single array with subject reference
  const allTopics = sortedSubjects.flatMap(subject => 
    subject.topics.map(topic => ({
      subjectId: subject.id,
      topicId: topic.id,
      topic,
      subject,
      completed: topic.completed
    }))
  ).filter(item => !item.completed); // Exclude completed topics
  
  // Generate schedule entries based on strategy
  let scheduleEntries: ScheduleEntry[] = [];
  
  switch (strategy) {
    case 'one-subject':
      scheduleEntries = generateOneSubjectAtATime(
        studyDates, 
        userProfile.studyHours,
        dailyStudyMinutes, 
        allTopics
      );
      break;
      
    case 'daily-rotation':
      scheduleEntries = generateDailyRotation(
        studyDates, 
        userProfile.studyHours,
        dailyStudyMinutes, 
        sortedSubjects
      );
      break;
      
    case 'weekend-revision':
      scheduleEntries = generateWeekendRevision(
        studyDates, 
        userProfile.studyHours,
        dailyStudyMinutes, 
        allTopics, 
        userProfile.weeklyOffDays
      );
      break;
      
    default:
      scheduleEntries = generateOneSubjectAtATime(
        studyDates, 
        userProfile.studyHours,
        dailyStudyMinutes, 
        allTopics
      );
  }
  
  // Create the final schedule
  return {
    id: uuidv4(),
    name: `Schedule (${strategy})`,
    strategy,
    entries: scheduleEntries,
    createdAt: new Date().toISOString()
  };
};

// Generate schedule with "One subject at a time" approach
const generateOneSubjectAtATime = (
  dates: Date[],
  studyHours: TimeSlot,
  dailyStudyMinutes: number,
  allTopics: Array<{
    subjectId: string;
    topicId: string;
    topic: Topic;
    subject: Subject;
    completed: boolean;
  }>
): ScheduleEntry[] => {
  const entries: ScheduleEntry[] = [];
  let currentDateIndex = 0;
  let remainingMinutesForDay = dailyStudyMinutes;
  
  // Process each topic
  for (const topicInfo of allTopics) {
    let remainingTopicMinutes = topicInfo.topic.estimatedTimeMinutes;
    
    // If we've run out of days, break
    if (currentDateIndex >= dates.length) break;
    
    // Process this topic until it's fully scheduled
    while (remainingTopicMinutes > 0) {
      // If we don't have enough time left today, move to next day
      if (remainingMinutesForDay < Math.min(30, remainingTopicMinutes)) {
        currentDateIndex++;
        remainingMinutesForDay = dailyStudyMinutes;
        
        // If we've run out of days, break
        if (currentDateIndex >= dates.length) break;
      }
      
      // Calculate how much time to allocate today
      const minutesToAllocate = Math.min(remainingTopicMinutes, remainingMinutesForDay);
      
      // Create a time slot for this study session
      const startMinutes = dailyStudyMinutes - remainingMinutesForDay;
      const endMinutes = startMinutes + minutesToAllocate;
      
      const startHour = Math.floor(startMinutes / 60) + parseInt(studyHours.start.split(':')[0]);
      const startMinute = startMinutes % 60 + parseInt(studyHours.start.split(':')[1]);
      
      const endHour = Math.floor(endMinutes / 60) + parseInt(studyHours.start.split(':')[0]);
      const endMinute = endMinutes % 60 + parseInt(studyHours.start.split(':')[1]);
      
      const timeSlot = {
        start: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
        end: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
      };
      
      // Add entry to schedule
      entries.push({
        id: uuidv4(),
        date: formatDateYMD(dates[currentDateIndex]),
        timeSlot,
        subjectId: topicInfo.subjectId,
        topicId: topicInfo.topicId
      });
      
      // Update remaining times
      remainingTopicMinutes -= minutesToAllocate;
      remainingMinutesForDay -= minutesToAllocate;
    }
  }
  
  return entries;
};

// Generate schedule with "Daily rotation" approach
const generateDailyRotation = (
  dates: Date[],
  studyHours: TimeSlot,
  dailyStudyMinutes: number,
  subjects: Subject[]
): ScheduleEntry[] => {
  const entries: ScheduleEntry[] = [];
  
  // Group topics by subject
  const subjectTopics = subjects.map(subject => ({
    subjectId: subject.id,
    topics: subject.topics.filter(topic => !topic.completed)
  }));
  
  // Iterate through each date
  for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
    const date = dates[dateIndex];
    let remainingMinutesForDay = dailyStudyMinutes;
    
    // Rotate through subjects each day (using the date index for rotation)
    const subjectsForToday = [...subjectTopics].sort(() => 0.5 - Math.random());
    
    for (const subjectInfo of subjectsForToday) {
      if (remainingMinutesForDay <= 0 || subjectInfo.topics.length === 0) continue;
      
      // Pick a topic from this subject
      const topic = subjectInfo.topics[0];
      let topicMinutes = Math.min(topic.estimatedTimeMinutes, remainingMinutesForDay);
      
      // Create time slot
      const startMinutes = dailyStudyMinutes - remainingMinutesForDay;
      const endMinutes = startMinutes + topicMinutes;
      
      const startHour = Math.floor(startMinutes / 60) + parseInt(studyHours.start.split(':')[0]);
      const startMinute = startMinutes % 60 + parseInt(studyHours.start.split(':')[1]);
      
      const endHour = Math.floor(endMinutes / 60) + parseInt(studyHours.start.split(':')[0]);
      const endMinute = endMinutes % 60 + parseInt(studyHours.start.split(':')[1]);
      
      const timeSlot = {
        start: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
        end: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
      };
      
      // Add entry to schedule
      entries.push({
        id: uuidv4(),
        date: formatDateYMD(date),
        timeSlot,
        subjectId: subjectInfo.subjectId,
        topicId: topic.id
      });
      
      // Update remaining time
      remainingMinutesForDay -= topicMinutes;
      
      // Update topic time or remove it if completed
      topic.estimatedTimeMinutes -= topicMinutes;
      if (topic.estimatedTimeMinutes <= 0) {
        subjectInfo.topics.shift(); // Remove this topic
      }
    }
  }
  
  return entries;
};

// Generate schedule with "Weekend revision" approach
const generateWeekendRevision = (
  dates: Date[],
  studyHours: TimeSlot,
  dailyStudyMinutes: number,
  allTopics: Array<{
    subjectId: string;
    topicId: string;
    topic: Topic;
    subject: Subject;
    completed: boolean;
  }>,
  weeklyOffDays: WeekDay[]
): ScheduleEntry[] => {
  const entries: ScheduleEntry[] = [];
  const weekendDays: WeekDay[] = ['saturday', 'sunday'];
  
  // Separate weekend days from study days
  const weekendDates = dates.filter(date => weekendDays.includes(getDayName(date)));
  const weekdayDates = dates.filter(date => !weekendDays.includes(getDayName(date)));
  
  // First, schedule new topics on weekdays (similar to one-subject approach)
  let currentDateIndex = 0;
  let remainingMinutesForDay = dailyStudyMinutes;
  const newTopics = [...allTopics];
  const completedTopicIds: string[] = [];
  
  // Process each topic for weekdays
  for (const topicInfo of newTopics) {
    let remainingTopicMinutes = topicInfo.topic.estimatedTimeMinutes;
    
    // If we've run out of weekdays, break
    if (currentDateIndex >= weekdayDates.length) break;
    
    // Process this topic until it's fully scheduled
    while (remainingTopicMinutes > 0) {
      // If we don't have enough time left today, move to next day
      if (remainingMinutesForDay < Math.min(30, remainingTopicMinutes)) {
        currentDateIndex++;
        remainingMinutesForDay = dailyStudyMinutes;
        
        // If we've run out of weekdays, break
        if (currentDateIndex >= weekdayDates.length) break;
      }
      
      // Calculate how much time to allocate today
      const minutesToAllocate = Math.min(remainingTopicMinutes, remainingMinutesForDay);
      
      // Create a time slot for this study session
      const startMinutes = dailyStudyMinutes - remainingMinutesForDay;
      const endMinutes = startMinutes + minutesToAllocate;
      
      const startHour = Math.floor(startMinutes / 60) + parseInt(studyHours.start.split(':')[0]);
      const startMinute = startMinutes % 60 + parseInt(studyHours.start.split(':')[1]);
      
      const endHour = Math.floor(endMinutes / 60) + parseInt(studyHours.start.split(':')[0]);
      const endMinute = endMinutes % 60 + parseInt(studyHours.start.split(':')[1]);
      
      const timeSlot = {
        start: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
        end: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
      };
      
      // Add entry to schedule
      entries.push({
        id: uuidv4(),
        date: formatDateYMD(weekdayDates[currentDateIndex]),
        timeSlot,
        subjectId: topicInfo.subjectId,
        topicId: topicInfo.topicId
      });
      
      // Update remaining times
      remainingTopicMinutes -= minutesToAllocate;
      remainingMinutesForDay -= minutesToAllocate;
    }
    
    // Mark this topic as completed for revision
    if (remainingTopicMinutes <= 0) {
      completedTopicIds.push(topicInfo.topicId);
    }
  }
  
  // Now schedule revisions on weekends
  if (weekendDates.length > 0) {
    // Only revise completed topics
    const topicsForRevision = allTopics.filter(t => 
      completedTopicIds.includes(t.topicId)
    );
    
    // Distribute revision topics across weekends
    for (let i = 0; i < weekendDates.length; i++) {
      const date = weekendDates[i];
      let remainingMinutesForDay = dailyStudyMinutes;
      
      // Select topics for revision this weekend (rotation through completed topics)
      const startIndex = (i * 3) % topicsForRevision.length;
      const topicsToRevise = topicsForRevision.slice(
        startIndex, 
        Math.min(startIndex + 3, topicsForRevision.length)
      );
      
      // If we've cycled through all topics, start again
      if (topicsToRevise.length === 0 && topicsForRevision.length > 0) {
        topicsToRevise.push(...topicsForRevision.slice(0, 3));
      }
      
      // Schedule revision time for each topic
      for (const topicInfo of topicsToRevise) {
        if (remainingMinutesForDay <= 0) break;
        
        // Allocate 30 minutes or less for revision
        const revisionMinutes = Math.min(30, remainingMinutesForDay);
        
        // Create time slot
        const startMinutes = dailyStudyMinutes - remainingMinutesForDay;
        const endMinutes = startMinutes + revisionMinutes;
        
        const startHour = Math.floor(startMinutes / 60) + parseInt(studyHours.start.split(':')[0]);
        const startMinute = startMinutes % 60 + parseInt(studyHours.start.split(':')[1]);
        
        const endHour = Math.floor(endMinutes / 60) + parseInt(studyHours.start.split(':')[0]);
        const endMinute = endMinutes % 60 + parseInt(studyHours.start.split(':')[1]);
        
        const timeSlot = {
          start: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
          end: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
        };
        
        // Add revision entry to schedule
        entries.push({
          id: uuidv4(),
          date: formatDateYMD(date),
          timeSlot,
          subjectId: topicInfo.subjectId,
          topicId: topicInfo.topicId
        });
        
        // Update remaining time
        remainingMinutesForDay -= revisionMinutes;
      }
    }
  }
  
  return entries;
};