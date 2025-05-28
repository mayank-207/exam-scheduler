import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Subject, Topic, DifficultyLevel } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { PlusCircle, Edit, Trash2, BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';
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
  
  // Handle adding new topic
  const handleAddTopic = () => {
    if (!newTopic.name.trim() || !newTopic.subjectId) return;
    
    addTopic(newTopic.subjectId, {
      name: newTopic.name,
      estimatedTimeMinutes: newTopic.estimatedTimeMinutes,
      notes: newTopic.notes
    });
    
    // Reset form
    setNewTopic({
      name: '',
      estimatedTimeMinutes: 60,
      notes: '',
      subjectId: newTopic.subjectId
    });
  };
  
  // Handle updating topic
  const handleUpdateTopic = () => {
    if (!editingTopicId || !newTopic.subjectId) return;
    
    const subject = subjects.find(s => s.id === newTopic.subjectId);
    if (!subject) return;
    
    const topic = subject.topics.find(t => t.id === editingTopicId);
    if (!topic) return;
    
    updateTopic(newTopic.subjectId, {
      ...topic,
      name: newTopic.name || topic.name,
      estimatedTimeMinutes: newTopic.estimatedTimeMinutes || topic.estimatedTimeMinutes,
      notes: newTopic.notes !== undefined ? newTopic.notes : topic.notes
    });
    
    // Reset form and edit mode
    setNewTopic({
      name: '',
      estimatedTimeMinutes: 60,
      notes: '',
      subjectId: ''
    });
    setEditingTopicId(null);
  };
  
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
              const progress = getSubjectProgress(subject.id);
              
              return (
                <Card key={subject.id} className="overflow-visible">
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200">
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800">{subject.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(subject.difficulty)}`}>
                            {subject.difficulty}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {subject.topics.length} topics
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveSubjectId(activeSubjectId === subject.id ? null : subject.id)}
                      >
                        {activeSubjectId === subject.id ? 'Hide Topics' : 'Show Topics'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit size={14} />}
                        onClick={() => handleEditSubject(subject)}
                      >
                        Edit
                      </Button>
                      
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() => deleteSubject(subject.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="px-4 py-2 bg-gray-50">
                    <ProgressBar
                      value={progress.completed}
                      max={progress.total}
                      label={`Progress: ${progress.completed}/${progress.total} topics`}
                      showPercentage={true}
                      size="sm"
                    />
                  </div>
                  
                  {/* Topics section (expandable) */}
                  {activeSubjectId === subject.id && (
                    <div className="p-4 bg-gray-50">
                      {/* Add topic form */}
                      {editingTopicId ? (
                        <div className="mb-6 p-4 bg-white rounded-md shadow-sm">
                          <h5 className="font-medium text-gray-700 mb-3">Edit Topic</h5>
                          <div className="space-y-4">
                            <Input
                              label="Topic Name"
                              placeholder="e.g., Algebra Basics"
                              value={newTopic.name}
                              onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                              fullWidth
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                label="Estimated Time (minutes)"
                                type="number"
                                min="1"
                                value={newTopic.estimatedTimeMinutes}
                                onChange={(e) => setNewTopic({ ...newTopic, estimatedTimeMinutes: parseInt(e.target.value) })}
                                fullWidth
                              />
                            </div>
                            
                            <Input
                              label="Notes (optional)"
                              placeholder="Any additional information"
                              value={newTopic.notes}
                              onChange={(e) => setNewTopic({ ...newTopic, notes: e.target.value })}
                              fullWidth
                            />
                            
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setEditingTopicId(null);
                                  setNewTopic({ name: '', estimatedTimeMinutes: 60, notes: '', subjectId: '' });
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="primary" 
                                icon={<Edit size={16} />}
                                onClick={handleUpdateTopic}
                              >
                                Update Topic
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-6 p-4 bg-white rounded-md shadow-sm">
                          <h5 className="font-medium text-gray-700 mb-3">Add New Topic</h5>
                          <div className="space-y-4">
                            <Input
                              label="Topic Name"
                              placeholder="e.g., Algebra Basics"
                              value={newTopic.name}
                              onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value, subjectId: subject.id })}
                              fullWidth
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                label="Estimated Time (minutes)"
                                type="number"
                                min="1"
                                value={newTopic.estimatedTimeMinutes}
                                onChange={(e) => setNewTopic({ ...newTopic, estimatedTimeMinutes: parseInt(e.target.value), subjectId: subject.id })}
                                fullWidth
                              />
                            </div>
                            
                            <Input
                              label="Notes (optional)"
                              placeholder="Any additional information"
                              value={newTopic.notes}
                              onChange={(e) => setNewTopic({ ...newTopic, notes: e.target.value, subjectId: subject.id })}
                              fullWidth
                            />
                            
                            <div className="flex justify-end">
                              <Button 
                                variant="primary" 
                                icon={<PlusCircle size={16} />}
                                onClick={handleAddTopic}
                                disabled={!newTopic.name.trim()}
                              >
                                Add Topic
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Topics list */}
                      {subject.topics.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          No topics added yet
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {subject.topics.map((topic) => (
                            <div 
                              key={topic.id} 
                              className={`p-3 rounded-md border ${topic.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div className="mt-0.5">
                                    {topic.completed ? (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <Clock className="h-5 w-5 text-blue-600" />
                                    )}
                                  </div>
                                  
                                  <div>
                                    <div className="flex items-center">
                                      <h6 className={`font-medium ${topic.completed ? 'text-green-800' : 'text-gray-800'}`}>
                                        {topic.name}
                                      </h6>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Estimated time: {formatTime(topic.estimatedTimeMinutes)}
                                    </p>
                                    {topic.notes && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {topic.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button
                                    variant={topic.completed ? 'outline' : 'success'}
                                    size="sm"
                                    icon={topic.completed ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                    onClick={() => markTopicCompleted(subject.id, topic.id, !topic.completed)}
                                  >
                                    {topic.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    icon={<Edit size={14} />}
                                    onClick={() => handleEditTopic(subject, topic)}
                                  >
                                    Edit
                                  </Button>
                                  
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    icon={<Trash2 size={14} />}
                                    onClick={() => deleteTopic(subject.id, topic.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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