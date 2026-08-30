import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
  ChevronRight,
  Flame,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { CareerRoadmap, RoadmapMonth } from '../types/career';
import { useLanguage } from '../context/LanguageContext';

interface PhaseProgressTrackerProps {
  roadmap: CareerRoadmap;
  completedTaskIds: string[];
  activeMonthTab: number;
  onSelectMonthTab: (monthNumber: number) => void;
}

export const PhaseProgressTracker: React.FC<PhaseProgressTrackerProps> = ({
  roadmap,
  completedTaskIds,
  activeMonthTab,
  onSelectMonthTab,
}) => {
  const { t, isRTL } = useLanguage();
  const [indicatorStyle, setIndicatorStyle] = useState<'circular' | 'bar'>('circular');

  const months = roadmap.months || [];

  // Calculate metrics for each month / 30-day phase
  const phaseMetrics = months.map((month) => {
    const allMonthTasks = (month.weeks || []).flatMap((w) => w.tasks || []);
    const totalMonthTasks = allMonthTasks.length;
    const completedMonthTasks = allMonthTasks.filter((t) => completedTaskIds.includes(t.id)).length;
    const percent = totalMonthTasks > 0 ? Math.round((completedMonthTasks / totalMonthTasks) * 100) : 0;

    const totalHours = allMonthTasks.reduce((acc, t) => acc + (t.estimatedHours || 3), 0);
    const completedHours = allMonthTasks
      .filter((t) => completedTaskIds.includes(t.id))
      .reduce((acc, t) => acc + (t.estimatedHours || 3), 0);

    // Calculate weekly completion breakdown
    const weekProgress = (month.weeks || []).map((w) => {
      const wTasks = w.tasks || [];
      const wDone = wTasks.filter((t) => completedTaskIds.includes(t.id)).length;
      const isComplete = wTasks.length > 0 && wDone === wTasks.length;
      return {
        weekNumber: w.weekNumber,
        title: w.title,
        isComplete,
        percent: wTasks.length > 0 ? Math.round((wDone / wTasks.length) * 100) : 0,
      };
    });

    const isComplete = totalMonthTasks > 0 && completedMonthTasks === totalMonthTasks;
    const isInProgress = completedMonthTasks > 0 && completedMonthTasks < totalMonthTasks;
    const isNotStarted = completedMonthTasks === 0;

    // Phase day range label
    const dayRange =
      month.month === 1
        ? 'Days 1–30'
        : month.month === 2
        ? 'Days 31–60'
        : 'Days 61–90';

    return {
      month,
      totalMonthTasks,
      completedMonthTasks,
      percent,
      totalHours,
      completedHours,
      weekProgress,
      isComplete,
      isInProgress,
      isNotStarted,
      dayRange,
    };
  });

  // Calculate total overall 90-day progress
  const totalAllTasks = phaseMetrics.reduce((acc, p) => acc + p.totalMonthTasks, 0);
  const totalCompletedTasks = phaseMetrics.reduce((acc, p) => acc + p.completedMonthTasks, 0);
  const overallPercent = totalAllTasks > 0 ? Math.round((totalCompletedTasks / totalAllTasks) * 100) : 0;

  // SVG Circular Progress Ring dimensions
  const circleSize = 64;
  const strokeWidth = 5.5;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      id="roadmap-phase-progress-tracker"
      className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-5"
    >
      {/* Header bar with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/50 flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-400" />
              {t('roadmap:phaseTrackingBadge', '30-Day Phase Milestones')}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              3 Phases • 90 Days Total
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t('roadmap:phaseTrackerTitle', '90-Day Execution Phase Status')}</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
              {overallPercent}% {t('roadmap:overallDone', 'Overall')}
            </span>
          </h2>
        </div>

        {/* View Style Switcher (Circular Ring vs Progress Bar) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            id="btn-indicator-circular"
            onClick={() => setIndicatorStyle('circular')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              indicatorStyle === 'circular'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Show Circular Progress Rings"
          >
            <PieChart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('roadmap:rings', 'Ring View')}</span>
          </button>
          <button
            type="button"
            id="btn-indicator-bar"
            onClick={() => setIndicatorStyle('bar')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              indicatorStyle === 'bar'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Show Linear Progress Bars"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('roadmap:bars', 'Bar View')}</span>
          </button>
        </div>
      </div>

      {/* 30-Day Phase Progression Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phaseMetrics.map((phase) => {
          const isSelected = activeMonthTab === phase.month.month;
          const strokeDashoffset = circumference - (phase.percent / 100) * circumference;

          // Status colors & badges
          let statusBadge = {
            label: t('roadmap:statusUpcoming', 'Upcoming'),
            color: 'bg-slate-800 text-slate-400 border-slate-700',
            ringColor: 'text-slate-600',
            barColor: 'bg-slate-700',
          };
          if (phase.isComplete) {
            statusBadge = {
              label: t('roadmap:statusMastered', 'Phase Complete'),
              color: 'bg-emerald-950 text-emerald-300 border-emerald-800/60',
              ringColor: 'text-emerald-500',
              barColor: 'bg-emerald-500',
            };
          } else if (phase.isInProgress) {
            statusBadge = {
              label: t('roadmap:statusInProgress', 'In Progress'),
              color: 'bg-blue-950 text-blue-300 border-blue-800/60',
              ringColor: 'text-blue-400',
              barColor: 'bg-gradient-to-r from-blue-500 to-emerald-400',
            };
          }

          return (
            <div
              key={phase.month.month}
              id={`phase-card-month-${phase.month.month}`}
              onClick={() => onSelectMonthTab(phase.month.month)}
              className={`p-4 sm:p-5 rounded-xl transition-all cursor-pointer border flex flex-col justify-between relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-950 border-emerald-500 ring-1 ring-emerald-500/30 shadow-lg'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              {/* Active Selection Glow Accent */}
              {isSelected && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>
              )}

              <div className="space-y-3.5">
                {/* Phase Header Line */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                        Phase {phase.month.month}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                        {phase.dayRange}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                      {phase.month.phaseName}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${statusBadge.color}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                {/* Visual Progress Indicator (Circular or Linear Bar) */}
                {indicatorStyle === 'circular' ? (
                  <div className="flex items-center gap-4 py-1">
                    {/* SVG Circular Progress Ring */}
                    <div className="relative shrink-0 flex items-center justify-center">
                      <svg
                        width={circleSize}
                        height={circleSize}
                        className="transform -rotate-90"
                      >
                        {/* Background track circle */}
                        <circle
                          cx={circleSize / 2}
                          cy={circleSize / 2}
                          r={radius}
                          stroke="currentColor"
                          strokeWidth={strokeWidth}
                          fill="transparent"
                          className="text-slate-800"
                        />
                        {/* Foreground animated progress circle */}
                        <circle
                          cx={circleSize / 2}
                          cy={circleSize / 2}
                          r={radius}
                          stroke="currentColor"
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className={`${statusBadge.ringColor} transition-all duration-700 ease-out`}
                        />
                      </svg>
                      {/* Inner percentage text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-black text-white leading-none">
                          {phase.percent}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Detail Stats */}
                    <div className="flex-1 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span className="text-slate-400">{t('roadmap:tasksCount', 'Tasks:')}</span>
                        <span className="text-white font-bold">
                          {phase.completedMonthTasks} / {phase.totalMonthTasks}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span className="text-slate-400">{t('roadmap:hoursInvested', 'Hours:')}</span>
                        <span className="text-emerald-400 font-semibold">
                          {phase.completedHours} / {phase.totalHours} hrs
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Linear Progress Bar Indicator */
                  <div className="space-y-2 py-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">
                        {phase.completedMonthTasks} of {phase.totalMonthTasks} tasks completed
                      </span>
                      <span className="text-emerald-400 font-bold">{phase.percent}%</span>
                    </div>

                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ease-out ${statusBadge.barColor}`}
                        style={{ width: `${phase.percent}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{phase.completedHours} hrs logged</span>
                      <span>{phase.totalHours} hrs target</span>
                    </div>
                  </div>
                )}

                {/* 4 Weekly Mini Status Indicators */}
                <div className="pt-2 border-t border-slate-900 space-y-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Weekly Milestones</span>
                    <span className="text-slate-500">4 Weeks</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {phase.weekProgress.map((wp) => (
                      <div
                        key={wp.weekNumber}
                        className={`py-1 px-1 rounded text-center text-[10px] font-bold border transition ${
                          wp.isComplete
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                            : wp.percent > 0
                            ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                        title={`Week ${wp.weekNumber}: ${wp.percent}% completed`}
                      >
                        W{wp.weekNumber}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase Theme Summary */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {phase.month.theme}
                </p>
              </div>

              {/* Bottom Card Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center justify-between text-xs">
                <span
                  className={`font-semibold transition flex items-center gap-1 ${
                    isSelected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <span>{isSelected ? t('roadmap:currentlyViewing', 'Viewing Phase') : t('roadmap:viewDetails', 'Filter Phase')}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-emerald-400' : 'group-hover:translate-x-0.5'}`} />
                </span>

                {phase.isComplete && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
