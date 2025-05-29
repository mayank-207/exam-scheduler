import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserSquare, BookOpen, Calendar, BarChart } from 'lucide-react';
import { Button } from '../ui/button';

interface SidebarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onChangeTab }) => {
  const { isProfileComplete } = useAppContext();
  
  const tabs = [
    { id: 'profile', label: 'User Profile', icon: <UserSquare size={18} />, disabled: false },
    { id: 'subjects', label: 'Subjects & Topics', icon: <BookOpen size={18} />, disabled: false },
    { id: 'schedule', label: 'Study Schedule', icon: <Calendar size={18} />, disabled: !isProfileComplete },
    { id: 'progress', label: 'Track Progress', icon: <BarChart size={18} />, disabled: !isProfileComplete }
  ];
  
  return (
    <aside className="bg-card border-r border-border w-full md:w-64 p-4 md:min-h-[calc(100vh-76px)]">
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            className={`w-full justify-start ${activeTab === tab.id ? '' : 'text-foreground'}`}
            disabled={tab.disabled}
            onClick={() => onChangeTab(tab.id)}
          >
            <span className="mr-2">{tab.icon}</span>
            <span>{tab.label}</span>
          </Button>
        ))}
      </nav>
      
      <div className="mt-8 p-4 bg-accent rounded-lg border border-border">
        <h4 className="font-medium text-foreground text-sm mb-2">Quick Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Set realistic study goals</li>
          <li>• Break topics into manageable chunks</li>
          <li>• Track your progress regularly</li>
          <li>• Revise completed topics periodically</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;