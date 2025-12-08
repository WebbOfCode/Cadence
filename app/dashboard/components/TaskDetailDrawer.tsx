'use client';

import { useState } from 'react';
import { MissionTask } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatDate } from '@/lib/utils';
import { X, Edit2, Check } from 'lucide-react';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { getCategoryIcon, type TaskCategory } from '@/lib/categoryIcons';

interface TaskDetailDrawerProps {
  task: MissionTask | null;
  onClose: () => void;
  userMOS?: string;
  timeInService?: string;
  dischargeRank?: string;
}

export function TaskDetailDrawer({ task, onClose, userMOS, timeInService, dischargeRank }: TaskDetailDrawerProps) {
  const { updateTask, toggleStepCompletion } = useOnboardingStore();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteText, setNoteText] = useState(task?.notes || '');

  if (!task) return null;

  const handleSaveNotes = () => {
    updateTask(task.id, { notes: noteText });
    setIsEditingNotes(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-300';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      admin: 'Admin',
      healthcare: 'Healthcare',
      career: 'Career',
      education: 'Education',
      housing: 'Housing',
      finance: 'Finance',
      wellness: 'Wellness',
    };
    return labels[category] || category;
  };

  return (
    <Sheet open={!!task} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
        <SheetHeader className="sticky top-0 bg-white pb-6 border-b border-gray-200 mb-6 z-10">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex gap-2 flex-wrap">
              {/* Overdue Badge */}
              {task.deadline && new Date(task.deadline) < new Date() && !task.completed && (
                <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border bg-red-50 text-red-700 border-red-300">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Overdue
                </span>
              )}
              <span className={`px-3 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded border bg-gray-100 text-gray-700 border-gray-200">
                {(() => {
                  const { icon: Icon, color } = getCategoryIcon(task.category as TaskCategory);
                  return <Icon className={`${color} text-sm`} />;
                })()}
                {getCategoryLabel(task.category)}
              </span>
              {/* Core Task Badge */}
              {task.core && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Core Task
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <SheetTitle className="text-left text-2xl">{task.title}</SheetTitle>
          
          {task.deadline && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Deadline:</span> {formatDate(task.deadline)}
            </p>
          )}
        </SheetHeader>

        <div className="space-y-8 pb-8">
          {/* Description Section */}
          <section>
            <h3 className="text-lg font-bold mb-3">Details</h3>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </section>

          {/* Steps Section */}
          {task.steps && task.steps.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-4">How to Complete This Task</h3>
              
              {/* Step Progress */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className={`font-medium ${
                    !task.completed && (task.stepsCompleted?.length || 0) < task.steps.length
                      ? 'text-orange-600'
                      : 'text-gray-600'
                  }`}>
                    {task.stepsCompleted?.length || 0}/{task.steps.length} steps completed
                  </span>
                  {!task.completed && (task.stepsCompleted?.length || 0) < task.steps.length && (
                    <span className="text-xs text-orange-600 font-medium">
                      (Required to complete task)
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {task.steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        task.stepsCompleted?.includes(index)
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <ol className="space-y-3">
                  {task.steps.map((step, stepIndex) => (
                    <li 
                      key={stepIndex} 
                      className="flex gap-3 cursor-pointer hover:bg-blue-100 p-2 rounded transition-colors"
                      onClick={() => toggleStepCompletion(task.id, stepIndex)}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                            ${task.stepsCompleted?.includes(stepIndex)
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-400 group-hover:border-green-500'
                            }
                          `}
                        >
                          {task.stepsCompleted?.includes(stepIndex) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-blue-700 mr-2">{stepIndex + 1}.</span>
                        <span className={`text-gray-700 text-sm leading-relaxed ${task.stepsCompleted?.includes(stepIndex) ? 'line-through opacity-60' : ''}`}>
                          {step}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* Task Info */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Task Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-medium">{getCategoryLabel(task.category)}</p>
              </div>
              <div>
                <p className="text-gray-600">Priority</p>
                <p className="font-medium capitalize">{task.priority}</p>
              </div>
              {task.deadline && (
                <div>
                  <p className="text-gray-600">Due Date</p>
                  <p className="font-medium">{formatDate(task.deadline)}</p>
                </div>
              )}
              {userMOS && (
                <div>
                  <p className="text-gray-600">Your MOS</p>
                  <p className="font-medium">{userMOS}</p>
                </div>
              )}
              {timeInService && (
                <div>
                  <p className="text-gray-600">Time in Service</p>
                  <p className="font-medium">{timeInService} {timeInService === '1' ? 'year' : 'years'}</p>
                </div>
              )}
              {dischargeRank && (
                <div>
                  <p className="text-gray-600">Discharge Rank</p>
                  <p className="font-medium">{dischargeRank}</p>
                </div>
              )}
            </div>
          </section>

          {/* Notes Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Personal Notes</h3>
              {!isEditingNotes && (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            {isEditingNotes ? (
              <div className="space-y-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add your personal notes about this task..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                  rows={4}
                />
                <button
                  onClick={handleSaveNotes}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Check size={16} />
                  Save Notes
                </button>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg min-h-[100px]">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {noteText || <span className="text-gray-400 italic">No notes yet. Click edit to add notes.</span>}
                </p>
              </div>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
