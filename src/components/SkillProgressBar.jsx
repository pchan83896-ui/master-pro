import React from 'react';

export default function SkillProgressBar({ label, score, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
        <span>{label}</span>
        <span>{score}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}
