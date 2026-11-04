import React from 'react';
import { 
  Clock, 
  Layers, 
  Flame, 
  ShieldCheck, 
  Play, 
  ArrowUpRight, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  BookOpen
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export default function Dashboard({ 
  stats, 
  weeklyData, 
  recentCards, 
  onNavigate, 
  activeVideo
}) {
  const statCards = [
    {
      id: 'hours',
      title: 'Study Hours',
      value: `${stats.studyHours.toFixed(1)}h`,
      change: '+2.4h this week',
      subtext: 'Target: 15h / week',
      icon: Clock,
      color: 'from-purple-500 to-indigo-600',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      id: 'cards',
      title: 'Flashcards Saved',
      value: stats.flashcardsSaved,
      change: '+3 new today',
      subtext: 'Live captured moments',
      icon: Layers,
      color: 'from-blue-500 to-cyan-500',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      id: 'mastered',
      title: 'Concepts Mastered',
      value: `${stats.flashcardsMastered || 4} / ${stats.flashcardsSaved}`,
      change: 'High-Yield Retention',
      subtext: 'Active recall verified',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'streak',
      title: 'Learning Streak',
      value: `${stats.learningStreak} Days`,
      change: 'Active Today!',
      subtext: 'Consistency record',
      icon: Flame,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    },
  ];

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-[#0F1424] border border-purple-500/30 p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-white mb-1">{label} Focus Session</p>
          <p className="text-xs text-purple-300 font-mono">
            Hours Studied: <span className="font-bold text-white">{payload[0].value}h</span>
          </p>
          {payload[1] && (
            <p className="text-xs text-slate-400 font-mono">
              Target Goal: {payload[1].value}h
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-purple-900/40 via-indigo-950/50 to-[#0A0E1D] border border-purple-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>YouTube LearnMode Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back. Your distraction-free study space is ready.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Paste any YouTube video to start learning without algorithm traps. You've shielded <span className="text-emerald-400 font-semibold">{stats.distractionsBlocked} distractions</span> this week and held a <span className="text-amber-400 font-semibold">{stats.learningStreak}-day streak</span>.
            </p>
          </div>

          {/* Quick Resume Button */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <button
              onClick={() => onNavigate('focus')}
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
              </div>
              <div className="text-left">
                <span className="block leading-none">Resume Video</span>
                <span className="text-[10px] text-purple-200 font-normal">at {activeVideo.currentTimestamp || '00:00'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="relative group rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 hover:border-purple-500/30 p-5 transition-all duration-200 hover:shadow-xl hover:shadow-purple-950/30 overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono tracking-tight">
                    {card.value}
                  </p>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-white/5">
                <span className={`px-2 py-0.5 rounded-md font-semibold border ${card.badgeColor}`}>
                  {card.change}
                </span>
                <span className="text-slate-400 text-[11px]">{card.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Weekly Chart & Jump Back In */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart (2 columns) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Weekly Study Hours vs Target
              </h3>
              <p className="text-xs text-slate-400">Total {stats.studyHours.toFixed(1)} hours tracked this week</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-purple-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Actual
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500/40" />
                Target
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="h" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#a78bfa" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#purpleGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#38bdf8" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  fillOpacity={1} 
                  fill="url(#blueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Active Video Card */}
        <div className="rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Continue Studying
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                {activeVideo.subject || 'Lecture'}
              </span>
            </div>

            <div className="mt-4 relative rounded-xl overflow-hidden group">
              <img 
                src={activeVideo.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'} 
                alt={activeVideo.title}
                className="w-full h-36 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-3">
                <span className="px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white">
                  {activeVideo.currentTimestamp || '00:00'} / {activeVideo.duration || 'Live'}
                </span>
              </div>
            </div>

            <h4 className="mt-3 text-sm font-bold text-white line-clamp-2 leading-snug">
              {activeVideo.title}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              By {activeVideo.channel || 'YouTube'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('focus')}
            className="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2 group"
          >
            <Play className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
            Open in Focus Mode
          </button>
        </div>
      </div>

      {/* Bottom Section: Recent Flashcards Preview & Distraction Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Flashcards (2 columns) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Recently Saved Flashcards
              </h3>
              <p className="text-xs text-slate-400">Click any card to review in Flashcard mode</p>
            </div>
            <button
              onClick={() => onNavigate('flashcards')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              View All ({stats.flashcardsSaved}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {recentCards.slice(0, 4).map((card) => (
              <div
                key={card.id}
                onClick={() => onNavigate('flashcards')}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {card.subject}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                      ⏱ {card.timestamp}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white line-clamp-2 group-hover:text-purple-200 transition-colors">
                    {card.question}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{card.difficulty}</span>
                  <span className={card.mastered ? 'text-emerald-400' : 'text-amber-400'}>
                    {card.mastered ? '✓ Mastered' : '● In Review'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distraction Shield Metrics */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#0D1224] to-[#0A0E1D] border border-white/5 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Distraction Shield Active</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Every video watched is automatically stripped of algorithmic rabbit holes.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Algorithmic Shorts Blocked</span>
                <span className="text-white font-mono font-bold">54</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Clickbait Recommendations</span>
                <span className="text-white font-mono font-bold">78</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Comments & Distracting Ads</span>
                <span className="text-white font-mono font-bold">10</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <p className="text-[11px] text-slate-300">
              <span className="text-emerald-400 font-bold">Estimated +48 minutes</span> saved today by avoiding mindless browsing rabbit holes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
