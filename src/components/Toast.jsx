import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0F152B] border border-purple-500/40 text-white shadow-2xl shadow-purple-950/80 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="pr-2">
        <p className="text-xs font-bold text-white">{toast.title}</p>
        <p className="text-[11px] text-slate-300">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
