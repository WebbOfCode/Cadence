'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Clock, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { useTransitionPlan } from '@/lib/transition/useTransitionPlan';
import { useOnboardingStore } from '@/lib/useOnboardingStore';

interface TransitionIntelCardProps {
  profile?: {
    branch?: string;
    mos?: string;
    location?: string;
    separationDate?: string;
  };
  dashboard?: {
    completedTasks?: string[];
    currentGoals?: string[];
    blockers?: string[];
    [key: string]: any;
  };
  context?: string;
}

export function TransitionIntelCard({
  profile,
  dashboard,
  context,
}: TransitionIntelCardProps) {
  const { clearTransitionPlanCache } = useOnboardingStore();
  
  const payload = {
    profile: profile || {},
    dashboard: dashboard || {},
    context: context || '',
  };

  const { data, loading, error } = useTransitionPlan(payload);

  const handleRefresh = () => {
    clearTransitionPlanCache();
    // Component will auto-refetch due to useEffect dependency
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 p-6 bg-white space-y-4"
      >
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Analyzing your transition…</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-red-200 p-6 bg-red-50"
      >
        <p className="text-sm text-red-800">{error}</p>
      </motion.div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white overflow-hidden"
    >
      {/* Header: Next Critical Action + Risk Score */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-6 text-white flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-2">
            Next Critical Action
          </div>
          <h3 className="text-xl font-bold mb-2">{data.nextCriticalAction.title}</h3>
          <p className="text-sm opacity-90 mb-4">{data.nextCriticalAction.why}</p>
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {data.nextCriticalAction.timeEstimateMinutes} min
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-2">
            Risk Score
          </div>
          <motion.div
            className="text-5xl font-bold"
            animate={{
              scale: data.riskScore.overall > 70 ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {data.riskScore.overall}
          </motion.div>
          <div className="text-xs opacity-75 mt-1">
            {data.riskScore.overall > 70
              ? 'High Priority'
              : data.riskScore.overall > 40
                ? 'Moderate'
                : 'Low'}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="px-6 py-6 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Steps to Take</h4>
        <ol className="space-y-3">
          {data.nextCriticalAction.steps.map((step, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-sm text-gray-700 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        {data.nextCriticalAction.links.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.nextCriticalAction.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-700 underline"
              >
                → {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Risk Buckets */}
      <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Risk by Category</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(data.riskScore.buckets).map(([category, score]) => (
            <div key={category} className="rounded-lg border border-gray-200 bg-white p-3">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                {category}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    score > 70
                      ? 'bg-red-500'
                      : score > 40
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="text-sm font-bold text-gray-900">{score}</div>
            </div>
          ))}
        </div>

        {data.riskScore.notes.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.riskScore.notes.map((note, idx) => (
              <div key={idx} className="flex gap-2 text-sm text-gray-700">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="px-6 py-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Timeline & Priorities</h4>
        <div className="space-y-4">
          {data.timeline.map((window_, idx) => (
            <div key={idx} className="border-l-2 border-blue-400 pl-4">
              <div className="text-sm font-semibold text-gray-900">{window_.windowLabel}</div>
              <ul className="mt-2 space-y-1">
                {window_.priorities.map((p, pidx) => (
                  <li key={pidx} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-blue-500">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Tasks */}
      <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-900">Recommended Tasks</h4>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="Refresh transition plan"
          >
            <RefreshCw className="w-4 h-4 text-gray-600 hover:text-black" />
          </button>
        </div>
        <div className="space-y-3">
          {data.recommendedTasks.map((task) => (
            <motion.div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow"
              whileHover={{ y: -2 }}
            >
              <div
                className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  task.priority === 'CRITICAL'
                    ? 'bg-red-500'
                    : task.priority === 'HIGH'
                      ? 'bg-amber-500'
                      : task.priority === 'MEDIUM'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">{task.title}</div>
                <p className="text-xs text-gray-600 mt-1">{task.reason}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {task.estimatedMinutes} min • {task.priority}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
