import React from 'react';
import { ChevronRight } from './Icons.jsx';

export default function QuickBtn({ label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 font-semibold text-xs md:text-sm text-slate-700 flex items-center justify-between transition-all border border-slate-100 group"
    >
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
