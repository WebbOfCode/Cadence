'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Download, Settings, Save, CheckCircle2, Clock, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { formatDate, getDaysUntilETS, getGoalLabel } from '@/lib/utils';
import type { MissionTask } from '@/lib/types';
import { TaskDetailDrawer } from './components/TaskDetailDrawer';
import { EditGoalsModal } from './components/EditGoalsModal';
import { getCategoryIcon, type TaskCategory } from '@/lib/categoryIcons';

export default function DashboardPage() {
  const router = useRouter();
  const { data, missionPlan, updateTaskCompletion, addTask, updateData } = useOnboardingStore();
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedTask, setSelectedTask] = useState<MissionTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Track which task's steps are expanded (by task ID)
  const [expandedStepsTaskId, setExpandedStepsTaskId] = useState<string | null>(null);
  const [isEditGoalsOpen, setIsEditGoalsOpen] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    context: false,
  });

  useEffect(() => {
    if (!missionPlan) {
      router.push('/onboarding');
      return;
    }
  }, [missionPlan, router]);

  const hasValidMissionPlan = Boolean(
    missionPlan &&
    Array.isArray(missionPlan.tasks) &&
    missionPlan.tasks.length > 0
  );

  // Inject NCO Guidance tasks (behavioral nudges) based on key triggers
  useEffect(() => {
    if (!missionPlan) return;

    // Discharge Upgrade
    const isNonHonorable = data.dischargeType && data.dischargeType !== 'honorable';
    if (isNonHonorable && !missionPlan.tasks.some(t => t.id === 'task-discharge-upgrade')) {
      addTask({
        id: 'task-discharge-upgrade',
        title: 'File Discharge Upgrade Request',
        description:
          'Discharge upgrades are common and applying does not reduce current benefits or harm VA claims. Many veterans succeed years after separation using new evidence, time passed, or inequities. Opens access to VA healthcare, education, home loans, and hiring preferences.',
        category: 'admin',
        priority: 'high',
        completed: false,
        steps: [
          'Gather records and new evidence (medical, character references, policy changes)',
          'Write a personal statement explaining circumstances and growth',
          'Within 15 years: file DD Form 293; after 15 years: file DD Form 149',
          'Work with a VSO (DAV, VFW, American Legion)',
          'Submit and monitor; typical processing 3–6 months',
        ],
        notes: 'Cadence provides guidance, not legal advice. No guarantees of approval.'
      });
      updateData({ dischargeUpgradeNudge: true });
    }

    // VA Healthcare Enrollment (common delay): if within 180 days of ETS or recently separated
    const daysUntilETS = data.etsDate ? getDaysUntilETS(data.etsDate) : undefined;
    if (daysUntilETS !== undefined && daysUntilETS <= 180 && !missionPlan.tasks.some(t => t.id === 'task-va-healthcare-enroll')) {
      addTask({
        id: 'task-va-healthcare-enroll',
        title: 'Enroll in VA Healthcare',
        description:
          'Enroll early to establish care and coverage. Many delay this and miss benefits. Enrollment does not affect disability claims and provides access to primary and specialty care.',
        category: 'healthcare',
        priority: 'high',
        completed: false,
        steps: [
          'Gather DD-214 and ID',
          'Create VA.gov account and enroll in VA Healthcare (Form 10-10EZ)',
          'Pick a local VA facility and schedule an intake',
        ],
        notes: 'Guidance only, not legal advice. No guarantees.'
      });
      updateData({ vaHealthcareNudge: true });
    }

    // Disability Claim (common delay): if not claimed
    if (data.disabilityClaim === false && !missionPlan.tasks.some(t => t.id === 'task-va-disability-claim')) {
      addTask({
        id: 'task-va-disability-claim',
        title: 'File Initial VA Disability Claim',
        description:
          'Filing a claim is low-risk and common. You can submit a fully developed claim or intent to file. This does not harm existing benefits and can be updated with new evidence.',
        category: 'finance',
        priority: 'high',
        completed: false,
        steps: [
          'Gather medical records and service treatment records',
          'File VA Form 21-526EZ (Disability Claim) on VA.gov',
          'Consider VSO support (DAV, VFW, American Legion)',
        ],
        notes: 'Guidance only, not legal advice. No guarantees.'
      });
      updateData({ disabilityClaimNudge: true });
    }

    // GI Bill (common delay): if education goal and giBill not active
    if (data.goal === 'education' && data.giBill === false && !missionPlan.tasks.some(t => t.id === 'task-gi-bill-apply')) {
      addTask({
        id: 'task-gi-bill-apply',
        title: 'Apply for GI Bill Benefits',
        description:
          'Using your GI Bill can cover tuition and housing. Many wait too long to start. Application is straightforward and does not affect other benefits adversely.',
        category: 'education',
        priority: 'high',
        completed: false,
        steps: [
          'Choose a school or training program',
          'Apply on VA.gov (Education Benefits)',
          'Submit Certificate of Eligibility to your school',
        ],
        notes: 'Guidance only, not legal advice. No guarantees.'
      });
      updateData({ giBillNudge: true });
    }

    // VA Loan COE (housing goal): encourage certificate of eligibility
    if (data.goal === 'housing' && !missionPlan.tasks.some(t => t.id === 'task-va-loan-coe')) {
      addTask({
        id: 'task-va-loan-coe',
        title: 'Request VA Loan Certificate of Eligibility (COE)',
        description:
          'COE unlocks VA home loan benefits. Requesting it is quick and common to do early. No impact on other benefits.',
        category: 'housing',
        priority: 'medium',
        completed: false,
        steps: [
          'Create VA.gov account and request COE',
          'Download COE and share with lender when ready',
        ],
        notes: 'Guidance only, not legal advice.'
      });
      updateData({ vaLoanNudge: true });
    }

    // TSP Rollover (finance goal): encourage early planning
    if (data.goal === 'finance' && !missionPlan.tasks.some(t => t.id === 'task-tsp-rollover')) {
      addTask({
        id: 'task-tsp-rollover',
        title: 'Plan TSP Rollover or Withdrawal Strategy',
        description:
          'Decide whether to keep TSP, roll it into an IRA, or withdraw. Many delay this decision—planning early avoids tax surprises and preserves retirement savings.',
        category: 'finance',
        priority: 'high',
        completed: false,
        steps: [
          'Review TSP balance and investment allocation',
          'Research rollover options (Traditional IRA, Roth IRA, keep in TSP)',
          'Consult with a financial advisor or TSP representative',
          'Decide on rollover or withdrawal timeline',
        ],
        notes: 'Guidance only, not financial or legal advice.'
      });
      updateData({ tspRolloverNudge: true });
    }
  }, [missionPlan, data.dischargeType, data.etsDate, data.disabilityClaim, data.giBill, data.goal, addTask, updateData]);

  if (!hasValidMissionPlan || !data.name) {
    return (
      <div className="min-h-screen dashboard-bg px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-black/80 text-white p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Mission Gate</p>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-3">Complete Onboarding Before Results</h1>
          <p className="text-gray-200 mb-6">
            Your results screen is available after onboarding is complete. Finish onboarding so Cadence can generate your mission plan and load your dashboard.
          </p>
          <button
            type="button"
            onClick={() => router.push('/onboarding')}
            className="px-5 py-3 rounded-full bg-white text-black font-bold uppercase text-sm"
          >
            Continue to Onboarding
          </button>
        </div>
      </div>
    );
  }

  // Define helper functions before they're used in calculations
  const daysBetween = (futureDate: Date, startDate: Date) => {
    return Math.ceil((futureDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getComplexityScore = (task: MissionTask) => {
    const stepWeight = (task.steps?.length || 1) * 12;
    const priorityWeight = task.priority === 'high' ? 40 : task.priority === 'medium' ? 25 : 10;
    const coreWeight = task.core ? 8 : 0;
    return Math.min(100, stepWeight + priorityWeight + coreWeight);
  };

  const getTimelineMeta = (task: MissionTask) => {
    if (task.deadline) {
      const daysLeft = daysBetween(new Date(task.deadline), new Date());
      const horizon = Math.max(14, Math.min(120, daysLeft + 30));
      const score = Math.max(0, Math.min(100, 100 - (daysLeft / horizon) * 100));
      const label = daysLeft <= 0 ? 'Overdue' : `${daysLeft} days left`;
      return { score, label };
    }

    const fallbackScore = task.priority === 'high' ? 70 : task.priority === 'medium' ? 45 : 30;
    return { score: fallbackScore, label: 'No deadline set' };
  };

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

  const getComplexityLabel = (score: number) => {
    if (score >= 75) return 'Heavy lift';
    if (score >= 45) return 'Moderate effort';
    return 'Quick win';
  };

  const getBarTone = (score: number) => {
    if (score >= 75) return 'bg-red-500';
    if (score >= 45) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const formatRelativeTime = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveProgress = () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    setTimeout(() => {
      updateData({ lastSavedAt: new Date().toISOString() });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 1800);
    }, 450);
  };

  const tasks = missionPlan?.tasks ?? [];
  const daysUntilETS = data.etsDate ? getDaysUntilETS(data.etsDate) : 0;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length ? (completedCount / tasks.length) * 100 : 0;
  
  // Calculate stats by priority
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high');
  const highPriorityCompleted = highPriorityTasks.filter((t) => t.completed).length;
  const mediumPriorityTasks = tasks.filter((t) => t.priority === 'medium');
  const mediumPriorityCompleted = mediumPriorityTasks.filter((t) => t.completed).length;
  const averageComplexity = tasks.length
    ? Math.round(tasks.reduce((total, task) => total + getComplexityScore(task), 0) / tasks.length)
    : 0;
  const averageTimePressure = tasks.length
    ? Math.round(tasks.reduce((total, task) => total + getTimelineMeta(task).score, 0) / tasks.length)
    : 0;

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

  const lastSavedAt = data.lastSavedAt ? new Date(data.lastSavedAt) : null;

  return (
    <div className="min-h-screen dashboard-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10 md:mb-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-700">Mission Control</div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">Mission: Transition</h1>
              <p className="text-xl md:text-2xl text-gray-600 mt-2">Welcome back, {data.name}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                <Clock size={16} />
                <span>ETS in {daysUntilETS} days</span>
              </div>
              {lastSavedAt && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
                  <CheckCircle2 size={16} />
                  <span>Saved {formatRelativeTime(lastSavedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={handleSaveProgress}
              className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 font-bold uppercase text-xs tracking-wider transition-all hover:scale-105 ${
                saveState === 'saved'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : saveState === 'saving'
                    ? 'border-gray-400 bg-gray-100 text-gray-800'
                    : 'border-black bg-black text-white hover:bg-gray-900'
              }`}
            >
              {saveState === 'saving' && <Loader2 size={18} className="animate-spin" />}
              {saveState === 'saved' && <CheckCircle2 size={18} />}
              {saveState === 'idle' && <Save size={18} />}
              {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved' : 'Save Progress'}
            </button>
            <button
              onClick={() => setIsEditGoalsOpen(true)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-black text-black font-bold uppercase text-xs tracking-wider rounded-full hover:bg-black hover:text-white transition-all"
            >
              <Settings size={20} />
              Edit Goals
            </button>
            <button
              onClick={exportMissionPlan}
              className="flex items-center gap-2 px-6 py-3 border-2 border-black text-black font-bold uppercase text-xs tracking-wider rounded-full hover:bg-black hover:text-white transition-all"
            >
              <Download size={20} />
              Export
            </button>
          </div>
        </div>

        {saveState === 'saved' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-3 px-4 py-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800"
          >
            <CheckCircle2 size={18} />
            <div>
              <p className="text-sm font-semibold">Progress saved</p>
              <p className="text-xs">Updated {formatRelativeTime(lastSavedAt || new Date())}</p>
            </div>
          </motion.div>
        )}

        {/* Discharge Upgrade Banner (Behavioral UX) */}
        {data.dischargeType && data.dischargeType !== 'honorable' && !data.dischargeUpgradeBannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 }}
            className="mb-6 p-6 bg-black text-white rounded-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-bold uppercase tracking-wide mb-1">NCO Guidance: Discharge Upgrade</h2>
                <p className="text-sm text-gray-400 mb-2">
                  Discharge upgrades are <strong>common</strong> and applying <strong>does not</strong> reduce current benefits or harm VA claims. Many veterans succeed years after separation using new evidence, time passed, or inequities.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0293.pdf" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">DD Form 293</a>
                  <a href="https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">DD Form 149</a>
                  <a href="https://www.dav.org/find-your-local-dav-office/" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">Find DAV Office</a>
                </div>
                <p className="text-xs text-gray-400 mt-3">Cadence provides guidance, not legal advice. No guarantees of approval.</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => updateData({ dischargeUpgradeBannerDismissed: true })}
                  className="px-4 py-2 bg-white text-black font-bold uppercase text-xs rounded-full hover:scale-105 transition-transform"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Disability Claim Banner */}
        {data.disabilityClaim === false && !(data.ncoBannerDismissedKeys || []).includes('disability-claim') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="mb-6 p-6 bg-black text-white rounded-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-bold uppercase tracking-wide mb-1">NCO Guidance: Disability Claim</h2>
                <p className="text-sm text-gray-400 mb-2">
                  Filing is <strong>common</strong> and <strong>low-risk</strong>. It won’t hurt existing benefits, and you can add evidence later. Many veterans wait—don’t miss out.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.va.gov/disability/how-to-file-claim/" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">File on VA.gov</a>
                  <a href="https://www.dav.org/" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">DAV Help</a>
                  <a href="https://www.vfw.org/" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">VFW Support</a>
                </div>
                <p className="text-xs text-gray-400 mt-3">Cadence provides guidance, not legal advice. No guarantees of approval.</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => updateData({ ncoBannerDismissedKeys: [ ...(data.ncoBannerDismissedKeys || []), 'disability-claim' ] })}
                  className="px-4 py-2 bg-white text-black font-bold uppercase text-xs rounded-full hover:scale-105 transition-transform"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VA Healthcare Banner */}
        {(() => {
          const daysUntilETS = data.etsDate ? getDaysUntilETS(data.etsDate) : undefined;
          return daysUntilETS !== undefined && daysUntilETS <= 180 && !(data.ncoBannerDismissedKeys || []).includes('va-healthcare');
        })() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6 p-6 bg-black text-white rounded-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-bold uppercase tracking-wide mb-1">NCO Guidance: VA Healthcare</h2>
                <p className="text-sm text-gray-400 mb-2">
                  Enrollment is straightforward and many delay it. Starting care early helps with continuity and claims. Enrollment does not harm other benefits.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.va.gov/health-care/how-to-apply/" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">Apply on VA.gov</a>
                  <a href="https://www.va.gov/find-locations/" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">Find VA Facility</a>
                </div>
                <p className="text-xs text-gray-400 mt-3">Cadence provides guidance, not legal advice.</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => updateData({ ncoBannerDismissedKeys: [ ...(data.ncoBannerDismissedKeys || []), 'va-healthcare' ] })}
                  className="px-4 py-2 bg-white text-black font-bold uppercase text-xs rounded-full hover:scale-105 transition-transform"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* GI Bill Banner */}
        {data.goal === 'education' && data.giBill === false && !(data.ncoBannerDismissedKeys || []).includes('gi-bill') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mb-6 p-6 bg-black text-white rounded-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-bold uppercase tracking-wide mb-1">NCO Guidance: Use Your GI Bill</h2>
                <p className="text-sm text-gray-400 mb-2">
                  Education benefits are powerful. Many wait to apply—don’t. Applying is simple and does not negatively affect other benefits.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.va.gov/education/how-to-apply/" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">Apply on VA.gov</a>
                  <a href="https://www.benefits.va.gov/gibill/comparison_tool.asp" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">GI Bill Comparison Tool</a>
                </div>
                <p className="text-xs text-gray-400 mt-3">Cadence provides guidance, not legal advice.</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => updateData({ ncoBannerDismissedKeys: [ ...(data.ncoBannerDismissedKeys || []), 'gi-bill' ] })}
                  className="px-4 py-2 bg-white text-black font-bold uppercase text-xs rounded-full hover:scale-105 transition-transform"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VA Loan COE Banner */}
        {data.goal === 'housing' && !(data.ncoBannerDismissedKeys || []).includes('va-loan-coe') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="mb-6 p-6 bg-black text-white rounded-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-bold uppercase tracking-wide mb-1">NCO Guidance: VA Loan COE</h2>
                <p className="text-sm text-gray-400 mb-2">
                  Getting your Certificate of Eligibility early keeps home options open. It’s quick and does not affect other benefits.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.va.gov/housing-assistance/home-loans/request-coe-form-26-1880/introduction" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">Request COE</a>
                  <a href="https://www.va.gov/housing-assistance/home-loans/" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform">VA Loan Guide</a>
                </div>
                <p className="text-xs text-gray-400 mt-3">Cadence provides guidance, not legal advice.</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => updateData({ ncoBannerDismissedKeys: [ ...(data.ncoBannerDismissedKeys || []), 'va-loan-coe' ] })}
                  className="px-4 py-2 bg-white text-black font-bold uppercase text-xs rounded-full hover:scale-105 transition-transform"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-black text-white rounded-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Days Until ETS
            </p>
            <p className="text-5xl font-black">{daysUntilETS}</p>
            <p className="text-sm text-gray-400 mt-2">{data.etsDate && formatDate(data.etsDate)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-black text-white rounded-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Tasks Completed
            </p>
            <p className="text-5xl font-black">{completedCount}/{tasks.length}</p>
            <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-white"
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
            className="p-6 bg-black text-white rounded-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Primary Goal
            </p>
            <p className="text-2xl font-black">{data.goal && getGoalLabel(data.goal)}</p>
            <p className="text-sm text-gray-400 mt-2">{data.branch} • {data.mos}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-6 bg-black text-white rounded-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Effort & Time
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Average Complexity</span>
                  <span className="font-semibold text-white">{averageComplexity}%</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${getBarTone(averageComplexity)} rounded-full`} style={{ width: `${averageComplexity}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{getComplexityLabel(averageComplexity)}</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Time Pressure</span>
                  <span className="font-semibold text-white">{averageTimePressure}%</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${getBarTone(averageTimePressure)} rounded-full`} style={{ width: `${averageTimePressure}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Blends deadlines + priority urgency</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10 p-8 bg-gray-50 rounded-xl border border-gray-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Mission Brief</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-1">Your Transition Plan</h2>
              <p className="text-sm text-gray-600 mt-1">High-level summary with expandable details below.</p>
            </div>
            <button
              onClick={() => toggleSection('overview')}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              {expandedSections.overview ? 'Hide details' : 'View details'}
              {expandedSections.overview ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {expandedSections.overview && (
            <div className="mt-6 space-y-6">
              <p className="text-lg text-gray-900 leading-relaxed">{missionPlan.overview}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs uppercase font-semibold text-gray-500 mb-1">Primary Goal</p>
                  <p className="text-lg font-semibold text-gray-900">{data.goal && getGoalLabel(data.goal)}</p>
                  {data.secondaryGoals && data.secondaryGoals.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">Supporting: {data.secondaryGoals.map(getGoalLabel).join(', ')}</p>
                  )}
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs uppercase font-semibold text-gray-500 mb-1">Location & Branch</p>
                  <p className="text-lg font-semibold text-gray-900">{data.location || 'Not set'}</p>
                  <p className="text-sm text-gray-600 mt-1">{data.branch} • {data.mos}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs uppercase font-semibold text-gray-500 mb-1">Timeline</p>
                  <p className="text-lg font-semibold text-gray-900">{daysUntilETS} days to ETS</p>
                  <p className="text-sm text-gray-600 mt-1">Generated {formatDate(missionPlan.generatedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="mb-12 p-6 border-2 border-gray-200 rounded-xl"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Service Context</p>
              <h3 className="text-xl font-bold">More details</h3>
            </div>
            <button
              onClick={() => toggleSection('context')}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              {expandedSections.context ? 'Collapse' : 'Expand'}
              {expandedSections.context ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
          {expandedSections.context && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-900">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">Discharge Type</p>
                <p className="text-gray-800 mt-1">{data.dischargeType ? data.dischargeType : 'Not provided'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">Time in Service</p>
                <p className="text-gray-800 mt-1">{data.timeInService ? `${data.timeInService} years` : 'Not provided'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">Discharge Rank</p>
                <p className="text-gray-800 mt-1">{data.dischargeRank || 'Not provided'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">Benefits markers</p>
                <p className="text-gray-800 mt-1">Disability claim: {data.disabilityClaim === false ? 'Not filed' : 'Filed/unknown'}</p>
                <p className="text-gray-800">GI Bill: {data.giBill === false ? 'Not activated' : 'Active/unknown'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">Awards noted</p>
                <p className="text-gray-800 mt-1">{data.awards && data.awards.length > 0 ? data.awards.join(', ') : 'None captured yet'}</p>
              </div>
            </div>
          )}
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
          <div className="flex gap-2 flex-wrap">
            {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setFilter(priority)}
                className={`
                  px-6 py-2 font-bold uppercase text-xs tracking-wider rounded-full transition-colors
                  ${filter === priority 
                    ? 'bg-black text-white' 
                    : 'border-2 border-gray-300 hover:border-black'
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
          {filteredTasks.map((task, index) => {
            const timeline = getTimelineMeta(task);
            const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;
            const stepsTotal = task.steps?.length || 0;
            const stepsDone = task.stepsCompleted?.length || 0;
            const taskProgress = stepsTotal > 0 ? Math.round((stepsDone / stepsTotal) * 100) : task.completed ? 100 : 0;
            const priorityTone = task.priority === 'high'
              ? 'bg-red-600 text-white'
              : task.priority === 'medium'
                ? 'bg-amber-500 text-white'
                : 'bg-blue-600 text-white';

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`border-2 rounded-2xl p-6 hover:shadow-xl transition-shadow cursor-pointer ${
                  isOverdue ? 'border-red-600' : 'border-black'
                } ${task.completed ? 'opacity-60' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="flex items-center gap-3 min-w-0"
                    onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-6 h-6 rounded border-2 border-black accent-black"
                    />
                    <h3 className={`text-lg font-black uppercase tracking-tight truncate ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${priorityTone}`}>
                    {task.priority}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>

                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span>{task.deadline ? `Deadline: ${formatDate(task.deadline)}` : 'No deadline set'}</span>
                  <span className={isOverdue ? 'text-red-600' : 'text-gray-700'}>{timeline.label}</span>
                </div>

                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-black" style={{ width: `${taskProgress}%` }} />
                </div>

                {task.steps && task.steps.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedStepsTaskId(expandedStepsTaskId === task.id ? null : task.id);
                    }}
                    className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
                  >
                    {expandedStepsTaskId === task.id ? 'Hide Steps' : 'View Steps'}
                  </button>
                )}

                {expandedStepsTaskId === task.id && task.steps && task.steps.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 border-2 border-black/10 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-3 uppercase text-xs tracking-widest">Steps</h4>
                    <ol className="space-y-3">
                      {task.steps.map((step, stepIndex) => (
                        <li 
                          key={stepIndex} 
                          className="flex gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
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
                                  ? 'bg-black border-black'
                                  : 'border-gray-400'
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
                            <span className="font-bold text-gray-500 mr-2">{stepIndex + 1}.</span>
                            <span className={`text-gray-700 ${task.stepsCompleted?.includes(stepIndex) ? 'line-through opacity-60' : ''}`}>
                              {step}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </motion.div>
            );
          })}
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
