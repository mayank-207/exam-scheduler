import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Subject, Topic, DifficultyLevel } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import {Input} from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { PlusCircle, Edit, Trash2, BookOpen, Clock, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

const SubjectsManager: React.FC = () => {
  const { 
    subjects, 
    addSubject, 
    updateSubject, 
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
    markTopicCompleted,
    getSubjectProgress
  } = useAppContext();
  
  // State for new subject form
  const [newSubject, setNewSubject] = useState({
    name: '',
    difficulty: 'medium' as DifficultyLevel
  });
  
  // State for new topic form
  const [newTopic, setNewTopic] = useState({
    name: '',
    estimatedTimeMinutes: 60,
    notes: '',
    subjectId: ''
  });
  
  // State for edit mode
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  
  // State for active subject (expanded)
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  
  // Handle creating new subject
  const handleAddSubject = () => {
    if (!newSubject.name.trim()) return;
    
    addSubject({
      name: newSubject.name,
      difficulty: newSubject.difficulty,
      topics: []
    });
    
    // Reset form
    setNewSubject({
      name: '',
      difficulty: 'medium'
    });
  };
  
  // Handle updating subject
  const handleUpdateSubject = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    updateSubject({
      ...subject,
      name: newSubject.name || subject.name,
      difficulty: newSubject.difficulty as DifficultyLevel
    });
    
    // Reset form and edit mode
    setNewSubject({
      name: '',
      difficulty: 'medium'
    });
    setEditingSubjectId(null);
  };
  
  // Enter subject edit mode
  const handleEditSubject = (subject: Subject) => {
    setNewSubject({
      name: subject.name,
      difficulty: subject.difficulty
    });
    setEditingSubjectId(subject.id);
  };
  
  // // Handle adding new topic
  // const handleAddTopic = () => {
  //   if (!newTopic.name.trim() || !newTopic.subjectId) return;
    
  //   addTopic(newTopic.subjectId, {
  //     name: newTopic.name,
  //     estimatedTimeMinutes: newTopic.estimatedTimeMinutes,
  //     notes: newTopic.notes
  //   });
    
  //   // Reset form
  //   setNewTopic({
  //     name: '',
  //     estimatedTimeMinutes: 60,
  //     notes: '',
  //     subjectId: newTopic.subjectId
  //   });
  // };
  
  // // Handle updating topic
  // const handleUpdateTopic = () => {
  //   if (!editingTopicId || !newTopic.subjectId) return;
    
  //   const subject = subjects.find(s => s.id === newTopic.subjectId);
  //   if (!subject) return;
    
  //   const topic = subject.topics.find(t => t.id === editingTopicId);
  //   if (!topic) return;
    
  //   updateTopic(newTopic.subjectId, {
  //     ...topic,
  //     name: newTopic.name || topic.name,
  //     estimatedTimeMinutes: newTopic.estimatedTimeMinutes || topic.estimatedTimeMinutes,
  //     notes: newTopic.notes !== undefined ? newTopic.notes : topic.notes
  //   });
    
  //   // Reset form and edit mode
  //   setNewTopic({
  //     name: '',
  //     estimatedTimeMinutes: 60,
  //     notes: '',
  //     subjectId: ''
  //   });
  //   setEditingTopicId(null);
  // };
  
  // Enter topic edit mode
  const handleEditTopic = (subject: Subject, topic: Topic) => {
    setNewTopic({
      name: topic.name,
      estimatedTimeMinutes: topic.estimatedTimeMinutes,
      notes: topic.notes || '',
      subjectId: subject.id
    });
    setEditingTopicId(topic.id);
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Format minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Subjects & Topics</h2>
      </div>
      
      {/* Add/Edit Subject Form */}
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>
            {editingSubjectId ? 'Edit Subject' : 'Add New Subject'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Subject Name"
                placeholder="e.g., Mathematics"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                fullWidth
              />
              
              <Select
                label="Difficulty Level"
                options={[
                  { value: 'easy', label: 'Easy' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'hard', label: 'Hard' }
                ]}
                value={newSubject.difficulty}
                onChange={(value) => setNewSubject({ ...newSubject, difficulty: value as DifficultyLevel })}
                fullWidth
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              {editingSubjectId ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingSubjectId(null);
                      setNewSubject({ name: '', difficulty: 'medium' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    icon={<Edit size={16} />}
                    onClick={() => handleUpdateSubject(editingSubjectId)}
                  >
                    Update Subject
                  </Button>
                </>
              ) : (
                <Button 
                  variant="primary" 
                  icon={<PlusCircle size={16} />}
                  onClick={handleAddSubject}
                  disabled={!newSubject.name.trim()}
                >
                  Add Subject
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Subject List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Your Subjects</h3>
        
        {subjects.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No subjects added yet. Add your first subject above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subjects.map((subject) => {
              const isActive = activeSubjectId === subject.id;
              const progress = getSubjectProgress(subject.id);
              
              return (
                <Card key={subject.id} className="mb-4 overflow-hidden card-hover border border-gray-100">
                  <div 
                    className="px-6 py-4 flex items-center justify-between cursor-pointer"
                    onClick={() => setActiveSubjectId(isActive ? null : subject.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{subject.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(subject.difficulty)}`}>
                        {subject.difficulty.charAt(0).toUpperCase() + subject.difficulty.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{progress.completed}/{progress.total} topics</span>
                        <ProgressBar 
                          value={progress.completed} 
                          max={progress.total} 
                          size="sm" 
                          color="primary" 
                          className="w-24" 
                        />
                      </div>
                      
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation();
                          handleEditSubject(subject);
                        }}
                        className="p-1 text-gray-500 hover:text-primary transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation();
                          deleteSubject(subject.id);
                        }}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isActive ? 'transform rotate-180' : ''}`} 
                      />
                    </div>
                  </div>
                  
                  {isActive && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      {/* Topics list */}
                      {subject.topics.map((topic) => (
                        <div key={topic.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{topic.name}</h4>
                            <span className="text-sm text-gray-600">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {formatTime(topic.estimatedTimeMinutes)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => markTopicCompleted(subject.id, topic.id, !topic.completed)}
                              className={`p-1 ${topic.completed ? 'text-green-500' : 'text-gray-400'}`}
                            >
                              {topic.completed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </button>
                            
                            <button 
                              onClick={() => handleEditTopic(subject, topic)}
                              className="p-1 text-gray-500 hover:text-primary"
                            >
                              <Edit size={16} />
                            </button>
                            
                            <button 
                              onClick={() => deleteTopic(subject.id, topic.id)}
                              className="p-1 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add topic button */}
                      <Button
                        variant="outline"
                        className="mt-4 w-full"
                        icon={<PlusCircle size={16} />}
                        onClick={() => {
                          setNewTopic({
                            ...newTopic,
                            subjectId: subject.id
                          });
                          // TODO: Open topic modal
                        }}
                      >
                        Add Topic
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsManager;