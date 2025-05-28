import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ScheduleStrategy } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Calendar, RefreshCw, BookOpen, Clock, User, ChevronRight, AlertCircle } from 'lucide-react';
import { formatDateDisplay, formatTimeRange } from '../../utils/timeUtils';

const ScheduleView: React.FC = () => {
  const { 
    userProfile, 
    subjects, 
    currentSchedule, 
    generateNewSchedule,
    isProfileComplete,
    markTopicCompleted
  } = useAppContext();
  
  const [selectedStrategy, setSelectedStrategy] = useState<ScheduleStrategy>('one-subject');
  
  // Strategy options
  const strategyOptions = [
    { 
      value: 'one-subject',
      label: 'One Subject at a Time',
      description: 'Focus on completing one subject before moving to the next, starting with harder subjects.'
    },
    { 
      value: 'daily-rotation',
      label: 'Daily Subject Rotation',
      description: 'Study different subjects each day to maintain variety and interest.'
    },
    { 
      value: 'weekend-revision',
      label: 'Weekend Revision',
      description: 'Regular study on weekdays with revision sessions on weekends.'
    }
  ];
  
  // Get topic and subject details by ID
  const getTopicDetails = (subjectId: string, topicId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return { subject: null, topic: null };
    
    const topic = subject.topics.find(t => t.id === topicId);
    return { subject, topic };
  };
  
  // Group schedule entries by date
  const groupedSchedule = currentSchedule?.entries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof currentSchedule.entries>) || {};
  
  // Get dates in order
  const orderedDates = Object.keys(groupedSchedule).sort();
  
  // Handle marking a topic as completed from the schedule
  const handleMarkCompleted = (subjectId: string, topicId: string) => {
    markTopicCompleted(subjectId, topicId, true);
  };
  
  if (!isProfileComplete) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Incomplete</h2>
        <p className="text-gray-600 mb-6">
          Please complete your profile settings before generating a study schedule.
        </p>
        <Button
          variant="primary"
          icon={<User size={16} />}
        >
          Go to Profile Setup
        </Button>
      </div>
    );
  }
  
  if (subjects.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Subjects Added</h2>
        <p className="text-gray-600 mb-6">
          Please add some subjects and topics before generating a study schedule.
        </p>
        <Button
          variant="primary"
          icon={<BookOpen size={16} />}
        >
          Add Subjects
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Study Schedule</h2>
      </div>
      
      {/* Strategy Selection */}
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Generate Study Schedule</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {strategyOptions.map(strategy => (
              <div 
                key={strategy.value}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedStrategy === strategy.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
                onClick={() => setSelectedStrategy(strategy.value as ScheduleStrategy)}
              >
                <h4 className="font-medium text-gray-800 mb-1">{strategy.label}</h4>
                <p className="text-xs text-gray-600">{strategy.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            variant="primary"
            icon={<RefreshCw size={16} />}
            onClick={() => generateNewSchedule(selectedStrategy)}
          >
            Generate Schedule
          </Button>
        </CardFooter>
      </Card>
      
      {/* Schedule Display */}
      {currentSchedule ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Current Schedule ({strategyOptions.find(s => s.value === currentSchedule.strategy)?.label})
            </h3>
            
            <div className="text-sm text-gray-500">
              Generated on {formatDateDisplay(currentSchedule.createdAt)}
            </div>
          </div>
          
          {orderedDates.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <AlertCircle className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <p className="text-yellow-700">No study sessions to schedule. You might have completed all topics or need to add more.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderedDates.map(date => (
                <Card key={date}>
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="text-base font-medium text-gray-700">
                      {formatDateDisplay(date)}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="divide-y divide-gray-100">
                    {groupedSchedule[date].map(entry => {
                      const { subject, topic } = getTopicDetails(entry.subjectId, entry.topicId);
                      if (!subject || !topic) return null;
                      
                      return (
                        <div key={entry.id} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="mt-1">
                                <Clock className="h-4 w-4 text-blue-600" />
                              </div>
                              
                              <div>
                                <div className="text-sm text-gray-500">
                                  {formatTimeRange(entry.timeSlot)}
                                </div>
                                
                                <div className="flex items-center mt-1">
                                  <span className="font-medium text-gray-800">{topic.name}</span>
                                  <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                                  <span className="text-gray-600">{subject.name}</span>
                                </div>
                                
                                {topic.notes && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {topic.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              {topic.completed ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Completed
                                </span>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleMarkCompleted(subject.id, topic.id)}
                                >
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Schedule Generated</h3>
          <p className="text-gray-600 mb-4">Select a strategy and generate your study schedule to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;