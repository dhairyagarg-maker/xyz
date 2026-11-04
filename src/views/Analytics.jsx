import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  Clock, 
  Target, 
  Award, 
  Sparkles, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { 
  WEEKLY_STUDY_DATA, 
  SUBJECT_PROGRESS_DATA, 
  RETENTION_TREND_DATA, 
  HOURLY_FOCUS_DATA, 
  ACHIEVEMENTS 
} from '../data/sampleData';

export default function Analytics({ stats }) {
  // Custom Dark Tooltip
  const DarkTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-[#0F1424] border border-purple-500/30 p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-white mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs font-mono" style={{ color: entry.color || '#a78bfa' }}>
              {entry.name}: <span className="font-bold text-white">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Learning Performance & Deep Work Analytics
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                98.2% Focus Efficiency
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Data aggregated from distraction-free YouTube sessions and timestamped flashcards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current Window:</span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold font-mono">
              Last 7 Days
            </span>
          </div>
        </div>

        {/* 4 Summary Micro-KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400">Total Study Time</span>
            <p className="text-xl font-extrabold text-white font-mono mt-0.5">
              {stats.studyHours.toFixed(1)} hrs
            </p>
            <span className="text-[10px] text-purple-400 font-semibold">+18% vs prev week</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400">Distractions Neutralized</span>
            <p className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
              {stats.distractionsBlocked}
            </p>
            <span className="text-[10px] text-slate-400">0 minutes lost to feed</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400">Flashcards Mastered</span>
            <p className="text-xl font-extrabold text-cyan-400 font-mono mt-0.5">
              {stats.flashcardsMastered || 4} Cards
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold">Active recall rate</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400">Concept Retention</span>
            <p className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
              92.8%
            </p>
            <span className="text-[10px] text-slate-400">High-yield mastery</span>
          </div>
        </div>
      </div>

      {/* Chart Row 1: Weekly Activity & Subject Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Time Chart */}
        <div className="rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Daily Focus Hours & Efficiency
              </h3>
              <p className="text-xs text-slate-400">Hours spent learning vs daily target</p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
              Avg: 2.3h / day
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_STUDY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="h" />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="hours" name="Study Hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="#3b82f6" fillOpacity={0.4} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject-Wise Time Allocation */}
        <div className="rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Subject-Wise Study Allocation
              </h3>
              <p className="text-xs text-slate-400">Distribution across major disciplines</p>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
              Active Courses
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {SUBJECT_PROGRESS_DATA.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    {item.subject}
                  </span>
                  <div className="flex items-center gap-3 font-mono text-slate-400">
                    <span>{item.hours}h</span>
                    <span className="text-purple-300">{item.flashcards} cards</span>
                    <span className="text-emerald-400 font-bold">{item.masteryRate}% mastered</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(item.hours / 6) * 100}%`,
                      backgroundColor: item.fill 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 flex items-center justify-between">
            <span>Primary Focus: <strong className="text-purple-300">Machine Learning (5.8h)</strong></span>
            <span className="text-emerald-400 font-mono font-bold">+2.2h</span>
          </div>
        </div>
      </div>

      {/* Chart Row 2: Retention Curve & Hourly Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Progression Line Chart */}
        <div className="rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Active Recall Retention Curve
              </h3>
              <p className="text-xs text-slate-400">Progression across consecutive review sessions</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              96% Retention
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RETENTION_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="session" stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<DarkTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="retention" 
                  name="Retention %"
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Focus Productivity Curve */}
        <div className="rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Circadian Focus Score by Time of Day
              </h3>
              <p className="text-xs text-slate-400">Your peak deep work efficiency window</p>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
              Peak: 4 PM - 8 PM
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_FOCUS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<DarkTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="focus" 
                  name="Focus Rating"
                  stroke="#fbbf24" 
                  strokeWidth={3} 
                  fill="url(#focusGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Achievements */}
      <div className="rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Learning Milestones & Achievement Badges
            </h3>
            <p className="text-xs text-slate-400">Gamified rewards for sustained deep work</p>
          </div>
          <span className="text-xs font-mono text-purple-300">
            3 / 4 Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                ach.unlocked
                  ? 'bg-white/[0.02] border-white/10 hover:border-purple-500/30'
                  : 'bg-white/[0.01] border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${ach.color} flex items-center justify-center text-slate-950 shadow-md`}>
                  <Sparkles className="w-5 h-5 fill-current" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  ach.unlocked 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-white/10 text-slate-400'
                }`}>
                  {ach.unlocked ? 'UNLOCKED' : ach.progress}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{ach.description}</p>
              </div>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-white/5 font-mono">
                {ach.unlocked ? ach.date : 'In Progress'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
