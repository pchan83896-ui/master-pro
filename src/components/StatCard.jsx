import React from 'react';

export default function StatCard({ icon, bgColor, title, value, desc }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-2xl ${bgColor}`}>{icon}</div>
        <span className="text-xs font-bold text-slate-400 uppercase">สถิติ</span>
      </div>
      <div>
        <h4 className="text-slate-500 text-xs font-semibold mb-1">{title}</h4>
        <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
