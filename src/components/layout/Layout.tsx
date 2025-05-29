import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ProfileSetup from '../features/ProfileSetup';
import SubjectsManager from '../features/SubjectsManager';
import ScheduleView from '../features/ScheduleView';
import ProgressTracker from '../features/ProgressTracker';
import { BarChart, BookOpen, Calendar, Menu, Settings } from 'lucide-react';

// Enhanced responsive layout
const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
      case 'settings':
        return <Settings />;
      default:
        return <ProfileSetup />;
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-1">
        {/* Mobile sidebar as bottom sheet */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div 
          className={`fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="w-12 h-1 bg-muted rounded-full mx-auto my-3" />
          <Sidebar activeTab={activeTab} onChangeTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }} />
        </div>
        
        {/* Desktop sidebar */}
        <div className="hidden md:block md:w-64 md:flex-shrink-0">
          <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} />
        </div>
        
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <div className="container mx-auto max-w-4xl">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
      
      {/* Mobile sticky footer navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-16 md:hidden z-30">
        <button 
          onClick={() => setActiveTab('schedule')} 
          className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'schedule' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Schedule</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('subjects')} 
          className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'subjects' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs mt-1">Subjects</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('progress')} 
          className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'progress' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <BarChart className="h-5 w-5" />
          <span className="text-xs mt-1">Progress</span>
        </button>
        
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs mt-1">More</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;