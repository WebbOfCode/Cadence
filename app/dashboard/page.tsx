'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Download, Settings } from 'lucide-react';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { formatDate, getDaysUntilETS, getGoalLabel } from '@/lib/utils';
import type { MissionTask } from '@/lib/types';
import { TaskDetailDrawer } from './components/TaskDetailDrawer';
import { EditGoalsModal } from './components/EditGoalsModal';
import { getCategoryIcon, type TaskCategory } from '@/lib/categoryIcons';

export default function DashboardPage() {
  const router = useRouter();
  const { data, missionPlan, updateTaskCompletion } = useOnboardingStore();
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedTask, setSelectedTask] = useState<MissionTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Track which task's steps are expanded (by task ID)
  const [expandedStepsTaskId, setExpandedStepsTaskId] = useState<string | null>(null);
  const [isEditGoalsOpen, setIsEditGoalsOpen] = useState(false);

  useEffect(() => {
    if (!missionPlan) {
      router.push('/onboarding');
      return;
    }
  }, [missionPlan, router]);

  if (!missionPlan || !data.name) {
    return null;
  }

  const tasks = missionPlan.tasks;
  const daysUntilETS = data.etsDate ? getDaysUntilETS(data.etsDate) : 0;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = (completedCount / tasks.length) * 100;
  
  // Calculate stats by priority
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high');
  const highPriorityCompleted = highPriorityTasks.filter((t) => t.completed).length;
  const mediumPriorityTasks = tasks.filter((t) => t.priority === 'medium');
  const mediumPriorityCompleted = mediumPriorityTasks.filter((t) => t.completed).length;

  const toggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // If task has steps, check if all are completed before allowing task completion
    if (task.steps && task.steps.length > 0 && !task.completed) {
      const completedSteps = task.stepsCompleted?.length || 0;
      if (completedSteps < task.steps.length) {
        // Show alert that steps must be completed first
        alert(`Please complete all ${task.steps.length} steps before marking this task as done. (${completedSteps}/${task.steps.length} completed)`);
        return;
      }
    }

    updateTaskCompletion(taskId, !task.completed);
  };

  const exportMissionPlan = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Title
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Cadence Military Transition Plan', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Veteran Info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Veteran: ${missionPlan.veteranName}`, 20, yPos);
      yPos += 8;
      doc.text(`ETS Date: ${formatDate(missionPlan.etsDate)} (${daysUntilETS} days remaining)`, 20, yPos);
      yPos += 8;
      doc.text(`Branch: ${data.branch} | MOS: ${data.mos}`, 20, yPos);
      yPos += 8;
      doc.text(`Primary Goal: ${data.goal && getGoalLabel(data.goal)}`, 20, yPos);
      yPos += 15;

      // Progress Summary
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Progress Summary', 20, yPos);
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Tasks: ${tasks.length} | Completed: ${completedCount} (${Math.round(progressPercent)}%)`, 20, yPos);
      yPos += 6;
      doc.text(`High Priority: ${highPriorityCompleted}/${highPriorityTasks.length} | Medium Priority: ${mediumPriorityCompleted}/${mediumPriorityTasks.length}`, 20, yPos);
      yPos += 15;

      // Overview
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Transition Overview', 20, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const overviewLines = doc.splitTextToSize(missionPlan.overview, pageWidth - 40);
      doc.text(overviewLines, 20, yPos);
      yPos += overviewLines.length * 5 + 10;

      // Tasks
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Task List', 20, yPos);
      yPos += 10;

      tasks.forEach((task) => {
        // Check if we need a new page
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }

        // Task title
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        const checkbox = task.completed ? '[✓]' : '[ ]';
        doc.text(`${checkbox} ${task.title}`, 20, yPos);
        yPos += 6;

        // Task details
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Priority: ${task.priority.toUpperCase()} | Category: ${getCategoryLabel(task.category)}${task.core ? ' | CORE TASK' : ''}`, 25, yPos);
        yPos += 5;
        
        if (task.deadline) {
          const isOverdue = new Date(task.deadline) < new Date() && !task.completed;
          doc.text(`Deadline: ${formatDate(task.deadline)}${isOverdue ? ' (OVERDUE)' : ''}`, 25, yPos);
          yPos += 5;
        }

        // Description
        const descLines = doc.splitTextToSize(task.description, pageWidth - 50);
        doc.text(descLines, 25, yPos);
        yPos += descLines.length * 4 + 3;

        // Steps progress
        if (task.steps && task.steps.length > 0) {
          doc.text(`Steps: ${task.stepsCompleted?.length || 0}/${task.steps.length} completed`, 25, yPos);
          yPos += 5;
        }

        yPos += 5; // Space between tasks
      });

      // Footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text('Cadence - Military Transition Support', pageWidth / 2, pageHeight - 5, { align: 'center' });

      // Save PDF
      doc.save(`cadence-mission-plan-${data.name?.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  let filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter((t) => t.priority === filter);

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredTasks = filteredTasks.filter((t) =>
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query)
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-6xl font-bold tracking-tight mb-3">
              Mission: Transition
            </h1>
            <p className="text-2xl text-gray-600">
              Welcome back, {data.name}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditGoalsOpen(true)}
              className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-black transition-colors font-medium"
            >
              <Settings size={20} />
              Edit Goals
            </button>
            <button
              onClick={exportMissionPlan}
              className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-black transition-colors font-medium"
            >
              <Download size={20} />
              Export
            </button>
          </div>
        </div>

        {/* Priority Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-lg"
        >
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">Priority Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">High Priority</p>
              <p className="text-2xl font-bold">{highPriorityCompleted}/{highPriorityTasks.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Medium Priority</p>
              <p className="text-2xl font-bold">{mediumPriorityCompleted}/{mediumPriorityTasks.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Overall Progress</p>
              <p className="text-2xl font-bold">{Math.round(progressPercent)}%</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 border-2 border-gray-200 rounded-lg"
          >
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-2">
              Days Until ETS
            </p>
            <p className="text-5xl font-bold">{daysUntilETS}</p>
            <p className="text-sm text-gray-600 mt-2">{data.etsDate && formatDate(data.etsDate)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 border-2 border-gray-200 rounded-lg"
          >
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-2">
              Tasks Completed
            </p>
            <p className="text-5xl font-bold">{completedCount}/{tasks.length}</p>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-4">
              <motion.div
                className="h-full bg-black rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 border-2 border-gray-200 rounded-lg"
          >
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-2">
              Primary Goal
            </p>
            <p className="text-2xl font-bold">{data.goal && getGoalLabel(data.goal)}</p>
            <p className="text-sm text-gray-600 mt-2">{data.branch} • {data.mos}</p>
          </motion.div>
        </div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 p-8 bg-gray-50 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Your Transition Plan</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{missionPlan.overview}</p>
        </motion.div>

        {/* Quick Access Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-12 p-6 border-2 border-gray-200 rounded-lg"
        >
          <h2 className="text-lg font-bold mb-4">Quick Access Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/mos-scanner')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-all text-left"
            >
              <h3 className="font-semibold mb-1">MOS Career Scanner</h3>
              <p className="text-sm text-gray-600">Get personalized civilian career pathways based on your MOS and location</p>
            </button>
            <button
              onClick={() => router.push('/mos-translator')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-all text-left"
            >
              <h3 className="font-semibold mb-1">MOS Translator</h3>
              <p className="text-sm text-gray-600">Translate your MOS to civilian job titles with salary insights</p>
            </button>
            <button
              onClick={() => router.push('/benefits-scanner')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-all text-left"
            >
              <h3 className="font-semibold mb-1">Benefits Scanner</h3>
              <p className="text-sm text-gray-600">Discover and rank federal, state, and local benefits you qualify for</p>
            </button>
          </div>
        </motion.div>

        {/* Sticky Filter/Search Bar */}
        <div className="sticky top-0 z-20 bg-white pb-6 -mx-6 px-6 border-b border-gray-100 mb-8">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks by title, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </motion.div>

          {/* Filter Bar */}
          <div className="flex gap-3 flex-wrap">
            {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setFilter(priority)}
                className={`
                  px-6 py-2 font-medium rounded-lg transition-colors
                  ${filter === priority 
                    ? 'bg-black text-white' 
                    : 'border-2 border-gray-200 hover:border-gray-400'
                  }
                `}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Mission Complete Celebration */}
        {progressPercent === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-8 p-8 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-2 border-green-300 rounded-lg shadow-lg"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎖️</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Transition Mission Complete!
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                You've completed all tasks in your Cadence mission plan. Time to enjoy civilian life!
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={exportMissionPlan}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Download size={20} />
                  Download Your Achievement
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                🎉 Thank you for your service. Welcome to the next chapter!
              </p>
            </div>
          </motion.div>
        )}

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className={`
                p-6 border-2 rounded-lg transition-all cursor-pointer
                ${task.completed 
                  ? 'border-gray-200 bg-gray-50 opacity-60' 
                  : task.deadline && new Date(task.deadline) < new Date()
                    ? 'border-red-300 bg-red-50 hover:border-red-400'
                    : 'border-gray-200 hover:border-black'
                }
              `}
            >
              <div className="flex items-start gap-4" onClick={() => toggleTask(task.id)}>
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                      ${task.completed 
                        ? 'bg-black border-black' 
                        : 'border-gray-300 hover:border-black'
                      }
                    `}
                  >
                    {task.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0" onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </h3>
                      {/* Core Task Badge */}
                      {task.core && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full mt-1 font-medium">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Required For All Veterans
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
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
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">{task.description}</p>

                  {/* Step Progress Indicator */}
                  {task.steps && task.steps.length > 0 && (
                    <div className="mb-3">
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
                            (Complete all steps to finish task)
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
                  )}

                  {task.deadline && (
                    <p className="text-sm text-gray-500 mb-3">
                      <span className="font-medium">Deadline:</span> {formatDate(task.deadline)}
                    </p>
                  )}

                  {/* "View Steps" button - shows only if task has steps */}
                  {task.steps && task.steps.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedStepsTaskId(expandedStepsTaskId === task.id ? null : task.id);
                      }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {expandedStepsTaskId === task.id ? '▼ Hide Steps' : '▶ View Steps'}
                    </button>
                  )}

                  {/* Expanded steps section - shows when task is expanded */}
                  {expandedStepsTaskId === task.id && task.steps && task.steps.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                      <h4 className="font-semibold text-gray-800 mb-3">How to complete this task:</h4>
                      <ol className="space-y-3">
                        {task.steps.map((step, stepIndex) => (
                          <li 
                            key={stepIndex} 
                            className="flex gap-3 cursor-pointer hover:bg-blue-100 p-2 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              useOnboardingStore.getState().toggleStepCompletion(task.id, stepIndex);
                            }}
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
                              <span className="font-medium text-blue-700 mr-2">{stepIndex + 1}.</span>
                              <span className={`text-gray-700 ${task.stepsCompleted?.includes(stepIndex) ? 'line-through opacity-60' : ''}`}>
                                {step}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks match this filter.</p>
          </div>
        )}
      </div>

      <TaskDetailDrawer 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
        userMOS={data.mos}
        timeInService={data.timeInService}
        dischargeRank={data.dischargeRank}
      />

      <EditGoalsModal 
        isOpen={isEditGoalsOpen}
        onClose={() => setIsEditGoalsOpen(false)}
      />
    </div>
  );
}
