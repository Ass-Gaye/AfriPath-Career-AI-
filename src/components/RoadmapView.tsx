import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Trophy,
  Award,
  FileCheck,
} from 'lucide-react';
import { UserProfile, CareerRoadmap } from '../types/career';

interface RoadmapViewProps {
  userProfile: UserProfile;
  roadmap: CareerRoadmap | null;
  targetCareer: string;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  isLoading: boolean;
  onNavigateToCV?: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  userProfile,
  roadmap,
  targetCareer,
  completedTaskIds,
  onToggleTask,
  isLoading,
  onNavigateToCV,
}) => {
  const [activeMonthTab, setActiveMonthTab] = useState<number>(0); // 0 = All

  if (isLoading || !roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="inline-block p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-lg font-bold text-white">Synthesizing 90-Day Roadmap...</h2>
        <p className="text-xs text-slate-400">Architecting 12 weekly milestones for {targetCareer}</p>
      </div>
    );
  }

  const allTasks = (roadmap?.months || []).flatMap((m) => (m.weeks || []).flatMap((w) => w.tasks || []));
  const totalTasks = allTasks.length;
  const completedCount = completedTaskIds.length;
  const progressPercent = Math.round((completedCount / (totalTasks || 1)) * 100);

  const handleTaskClick = (taskId: string) => {
    const isNowCompleted = !completedTaskIds.includes(taskId);
    onToggleTask(taskId);

    if (isNowCompleted) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.85 },
        colors: ['#10B981', '#34D399', '#FBBF24'],
      });
    }
  };

  const displayedMonths =
    activeMonthTab === 0
      ? (roadmap?.months || [])
      : (roadmap?.months || []).filter((m) => m.month === activeMonthTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Overall Roadmap Progress */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              90-Day Execution Blueprint
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {roadmap.targetCareer}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              A structured 12-week roadmap for {userProfile.name} designed to build real-world capability, portfolio artifacts, and interview readiness.
            </p>
          </div>

          {/* Progress Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shrink-0 w-full lg:w-72 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Roadmap Progress</span>
              <span className="text-emerald-400 font-bold">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{completedCount} of {totalTasks} tasks done</span>
              <span>{roadmap.weeklyHoursRecommended} hrs / week</span>
            </div>
          </div>
        </div>

        {/* Deliverables summary */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            Target 90-Day Portfolio Artifacts:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {roadmap.keyOutcomes.map((outcome, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
              >
                <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Month Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveMonthTab(0)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeMonthTab === 0
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All 3 Months (12 Weeks)
        </button>

        {roadmap.months.map((m) => (
          <button
            key={m.month}
            onClick={() => setActiveMonthTab(m.month)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeMonthTab === m.month
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Month {m.month}: {m.phaseName}
          </button>
        ))}
      </div>

      {/* Month & Weeks Timeline Display */}
      <div className="space-y-6">
        {displayedMonths.map((month) => {
          const monthTasks = month.weeks.flatMap((w) => w.tasks);
          const monthCompleted = monthTasks.filter((t) => completedTaskIds.includes(t.id)).length;

          return (
            <div key={month.month} className="space-y-4">
              {/* Month Header Banner */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">
                    Month {month.month}: {month.phaseName}
                  </h2>
                  <p className="text-xs text-slate-400">{month.theme}</p>
                </div>

                <div className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                  {monthCompleted} / {monthTasks.length} tasks
                </div>
              </div>

              {/* 4 Weekly Cards for this Month */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {month.weeks.map((week) => {
                  const weekTasks = week.tasks;
                  const weekCompleted = weekTasks.every((t) => completedTaskIds.includes(t.id));

                  return (
                    <div
                      key={week.weekNumber}
                      className={`p-5 rounded-2xl transition border flex flex-col justify-between ${
                        weekCompleted
                          ? 'bg-slate-900 border-emerald-500/40 ring-1 ring-emerald-500/20'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Week Header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                            Week {week.weekNumber}
                          </span>
                          {weekCompleted && (
                            <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                              Completed
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-white mb-0.5">{week.title}</h3>
                        <p className="text-xs text-slate-400 mb-3">{week.focus}</p>

                        {/* Tasks Checklist */}
                        <div className="space-y-2">
                          {week.tasks.map((task) => {
                            const isDone = completedTaskIds.includes(task.id);

                            return (
                              <div
                                key={task.id}
                                onClick={() => handleTaskClick(task.id)}
                                className={`p-2.5 rounded-xl cursor-pointer text-xs transition flex items-start gap-2.5 select-none ${
                                  isDone
                                    ? 'bg-slate-950 text-slate-400 line-through opacity-80 border border-slate-800'
                                    : 'bg-slate-950 border border-slate-800 text-slate-200 hover:border-slate-700'
                                }`}
                              >
                                <button type="button" className="mt-0.5 shrink-0 focus:outline-none">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-500" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <span>{task.title}</span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    ~{task.estimatedHours} hrs
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Milestone Deliverable */}
                      <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-2">
                        <div className="text-[11px] font-semibold uppercase text-amber-400 mb-0.5 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            <span>Milestone Deliverable</span>
                          </div>
                          {(week.weekNumber === 9 || week.weekNumber === 10) && onNavigateToCV && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToCV();
                              }}
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline"
                            >
                              <FileCheck className="w-3 h-3" />
                              <span>Launch AI CV Builder</span>
                            </button>
                          )}
                        </div>
                        <p className="text-slate-300">{week.milestoneDeliverable}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
