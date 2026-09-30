import React from 'react';
import { Volume2 } from '../components/Icons.jsx';
import { GRAMMAR_DB } from '../data/grammar.js';

export default function GrammarHubView({ speakChinese }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-black text-slate-900">คลังไวยากรณ์ภาษาจีน (Grammar Hub)</h2>
        <p className="text-sm text-slate-500">โครงสร้างประโยค ตัวอย่าง และข้อผิดพลาดที่พบบ่อยตามระดับ HSK</p>
      </div>

      <div className="space-y-4">
        {GRAMMAR_DB.map(g => (
          <div key={g.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">{g.hsk}</span>
              <button onClick={() => speakChinese(g.example)} className="p-2 text-slate-400 hover:text-emerald-600">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">{g.title}</h3>
              <p className="text-sm font-semibold text-emerald-600">{g.meaning}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-sm font-bold text-slate-700">
              <p>📌 โครงสร้าง: <span className="font-normal text-slate-600">{g.structure}</span></p>
              <p>💡 ตัวอย่าง: <span className="font-normal text-slate-600">{g.example}</span></p>
              <p className="text-xs text-emerald-700">{g.pinyin}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
