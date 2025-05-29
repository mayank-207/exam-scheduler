import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { formatDateDisplay } from '../../utils/timeUtils';
import { Calendar, BookOpen, Clock, Sun, Moon } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

const Header: React.FC = () => {
  const { userProfile, isProfileComplete, getOverallProgress } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const progress = getOverallProgress();
  
  const daysLeft = () => {
    if (!userProfile.examDate) return null;
    
    const today = new Date();
    const examDate = new Date(userProfile.examDate);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <BookOpen className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-2xl font-bold">Exam Preparation</h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-4"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          
          {isProfileComplete ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center bg-accent/50 rounded-lg p-3">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Exam Date</p>
                  <p className="font-medium">{formatDateDisplay(userProfile.examDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-accent/50 rounded-lg p-3">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Days Remaining</p>
                  <p className="font-medium">{daysLeft()} days</p>
                </div>
              </div>
              
              <div className="bg-accent/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Overall Progress</p>
                <Progress 
                  value={progress.percentage} 
                  max={100} 
                  className="w-full"
                  variant={progress.percentage > 75 ? 'success' : progress.percentage > 40 ? 'default' : 'warning'}
                />
                <p className="text-xs mt-1 text-right">{progress.percentage}%</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center bg-accent/50 rounded-lg px-4 py-2">
              <span className="text-sm">Complete your profile to get started</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;