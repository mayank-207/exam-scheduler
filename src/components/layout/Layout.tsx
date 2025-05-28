import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ProfileSetup from '../features/ProfileSetup';
import SubjectsManager from '../features/SubjectsManager';
import ScheduleView from '../features/ScheduleView';
import ProgressTracker from '../features/ProgressTracker';

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Render the active component based on the selected tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSetup />;
      case 'subjects':
        return <SubjectsManager />;
      case 'schedule':
        return <ScheduleView />;
      case 'progress':
        return <ProgressTracker />;
      default:
        return <ProfileSetup />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} />
        
        <main className="flex-1 p-4">
          <div className="container mx-auto">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;