import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { BarChartIcon as ChartIcon, BookOpen, AlertCircle, BarChart } from 'lucide-react';
import { getDaysUntil } from '../../utils/timeUtils';

const ProgressTracker: React.FC = () => {
  const { 
    subjects, 
    userProfile, 
    getSubjectProgress, 
    getOverallProgress,
    isProfileComplete 
  } = useAppContext();
  
  const overallProgress = getOverallProgress();
  const daysRemaining = useMemo(() => 
    userProfile.examDate ? getDaysUntil(userProfile.examDate) : 0,
    [userProfile.examDate]
  );
  
  // Calculate daily completion requirements
  const dailyRequirements = useMemo(() => {
    if (!daysRemaining) return { topicsPerDay: 0, hoursPerDay: 0 };
    
    const remainingTopics = overallProgress.total - overallProgress.completed;
    const topicsPerDay = remainingTopics / Math.max(daysRemaining, 1);
    
    // Calculate total estimated time for remaining topics
    const totalRemainingMinutes = subjects.reduce((total, subject) => {
      const incompleteTopics = subject.topics.filter(topic => !topic.completed);
      const subjectMinutes = incompleteTopics.reduce(
        (sum, topic) => sum + topic.estimatedTimeMinutes, 
        0
      );
      return total + subjectMinutes;
    }, 0);
    
    const hoursPerDay = (totalRemainingMinutes / 60) / Math.max(daysRemaining, 1);
    
    return { 
      topicsPerDay: Math.round(topicsPerDay * 10) / 10, 
      hoursPerDay: Math.round(hoursPerDay * 10) / 10 
    };
  }, [subjects, overallProgress, daysRemaining]);
  
  // Calculate subject status for stats
  const subjectStats = useMemo(() => {
    const completed = subjects.filter(subject => {
      const progress = getSubjectProgress(subject.id);
      return progress.completed === progress.total && progress.total > 0;
    }).length;
    
    const inProgress = subjects.filter(subject => {
      const progress = getSubjectProgress(subject.id);
      return progress.completed > 0 && progress.completed < progress.total;
    }).length;
    
    const notStarted = subjects.filter(subject => {
      const progress = getSubjectProgress(subject.id);
      return progress.completed === 0 && progress.total > 0;
    }).length;
    
    return { completed, inProgress, notStarted };
  }, [subjects, getSubjectProgress]);
  
  // Get difficulty color and style for progress cards
  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600'
        };
      case 'medium':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600'
        };
      case 'hard':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600'
        };
    }
  };
  
  if (!isProfileComplete) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Incomplete</h2>
        <p className="text-gray-600 mb-6">
          Please complete your profile settings to track your study progress.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Progress Tracker</h2>
      </div>
      
      {/* Overall Progress Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-700">Overall Progress</h3>
              <BarChart className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mb-3">
              <ProgressBar
                value={overallProgress.completed}
                max={overallProgress.total}
                size="lg"
                label={`${overallProgress.completed}/${overallProgress.total} topics`}
                showPercentage={true}
              />
            </div>
            <p className="text-sm text-gray-600">
              {overallProgress.percentage}% of all topics completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-700">Subject Status</h3>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium text-green-600">{subjectStats.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="text-sm font-medium text-blue-600">{subjectStats.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Not Started</span>
                <span className="text-sm font-medium text-red-600">{subjectStats.notStarted}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Total subjects: {subjects.length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-700">Daily Target</h3>
              <ChartIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Topics per Day</span>
                <span className="text-sm font-medium">{dailyRequirements.topicsPerDay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Hours per Day</span>
                <span className="text-sm font-medium">{dailyRequirements.hoursPerDay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Days Remaining</span>
                <span className="text-sm font-medium">{daysRemaining}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              To complete all remaining topics
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Subject Progress Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-blue-600" />
          Subject-wise Progress
        </h3>
        
        {subjects.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No subjects added yet. Add subjects to track progress.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const progress = getSubjectProgress(subject.id);
              const styles = getDifficultyStyles(subject.difficulty);
              
              return (
                <Card key={subject.id} className={`${styles.bgColor} border ${styles.borderColor}`}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className={`font-medium ${styles.textColor}`}>{subject.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${styles.borderColor} ${styles.textColor}`}>
                        {subject.difficulty}
                      </span>
                    </div>
                    
                    <ProgressBar
                      value={progress.completed}
                      max={progress.total}
                      size="md"
                      showPercentage={true}
                    />
                    
                    <div className="mt-3 text-sm">
                      <span className={`${styles.textColor}`}>
                        {progress.completed}/{progress.total} topics completed
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;