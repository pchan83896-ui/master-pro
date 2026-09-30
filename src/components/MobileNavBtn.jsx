import React from 'react';

export default function MobileNavBtn({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-xl flex-shrink-0 ${active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
    >
      {icon}
    </button>
  );
}
