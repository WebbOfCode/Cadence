'use client';

import { useState } from 'react';
import { MissionTask } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatDate } from '@/lib/utils';
import { X, Edit2, Check } from 'lucide-react';
import { useOnboardingStore } from '@/lib/useOnboardingStore';

interface TaskDetailDrawerProps {
  task: MissionTask | null;
  onClose: () => void;
  userMOS?: string;
}

export function TaskDetailDrawer({ task, onClose, userMOS }: TaskDetailDrawerProps) {
  const { updateTask } = useOnboardingStore();
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
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
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
              <span className={`px-3 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded border bg-gray-100 text-gray-700 border-gray-200">
                {getCategoryLabel(task.category)}
              </span>
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
