import React from 'react';

export default function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-xs md:text-sm transition-all ${
        active 
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
