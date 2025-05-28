import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserProfile, WeekDay, StudyIntensity } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Save, Clock, Calendar } from 'lucide-react';

const ProfileSetup: React.FC = () => {
  const { userProfile, updateUserProfile } = useAppContext();
  const [profile, setProfile] = useState<UserProfile>({ ...userProfile });
  
  // Weekday options
  const weekDayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];
  
  // Study intensity options
  const intensityOptions = [
    { value: 'light', label: 'Light (1-2 hours/day)' },
    { value: 'medium', label: 'Medium (3-4 hours/day)' },
    { value: 'intense', label: 'Intense (5+ hours/day)' },
  ];
  
  // Update profile state
  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle time slot changes
  const handleTimeChange = (
    slotType: 'workHours' | 'studyHours', 
    field: 'start' | 'end', 
    value: string
  ) => {
    setProfile(prev => ({
      ...prev,
      [slotType]: {
        ...prev[slotType],
        [field]: value
      }
    }));
  };
  
  // Handle weekly off days selection
  const handleOffDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value as WeekDay;
    const isChecked = e.target.checked;
    
    setProfile(prev => {
      if (isChecked) {
        return { ...prev, weeklyOffDays: [...prev.weeklyOffDays, day] };
      } else {
        return { ...prev, weeklyOffDays: prev.weeklyOffDays.filter(d => d !== day) };
      }
    });
  };
  
  // Save profile
  const handleSave = () => {
    updateUserProfile(profile);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
      </div>
      
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Personal Study Schedule</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Exam Date */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Target Exam Date
            </h3>
            
            <Input
              type="date"
              value={profile.examDate.split('T')[0]}
              onChange={(e) => handleChange('examDate', new Date(e.target.value).toISOString())}
              fullWidth
            />
          </div>
          
          {/* Work Hours */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Work Hours
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="time"
                label="Start Time"
                value={profile.workHours.start}
                onChange={(e) => handleTimeChange('workHours', 'start', e.target.value)}
                fullWidth
              />
              <Input
                type="time"
                label="End Time"
                value={profile.workHours.end}
                onChange={(e) => handleTimeChange('workHours', 'end', e.target.value)}
                fullWidth
              />
            </div>
          </div>
          
          {/* Study Hours */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Study Hours
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="time"
                label="Start Time"
                value={profile.studyHours.start}
                onChange={(e) => handleTimeChange('studyHours', 'start', e.target.value)}
                fullWidth
              />
              <Input
                type="time"
                label="End Time"
                value={profile.studyHours.end}
                onChange={(e) => handleTimeChange('studyHours', 'end', e.target.value)}
                fullWidth
              />
            </div>
          </div>
          
          {/* Weekly Off Days */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700">Weekly Off Days</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {weekDayOptions.map(day => (
                <div key={day.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`day-${day.value}`}
                    value={day.value}
                    checked={profile.weeklyOffDays.includes(day.value as WeekDay)}
                    onChange={handleOffDayChange}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor={`day-${day.value}`} className="text-sm text-gray-700">
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Study Intensity */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700">Study Intensity</h3>
            
            <Select
              options={intensityOptions}
              value={profile.studyIntensity}
              onChange={(value) => handleChange('studyIntensity', value as StudyIntensity)}
              fullWidth
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="primary" 
            icon={<Save size={16} />}
            onClick={handleSave}
          >
            Save Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSetup;