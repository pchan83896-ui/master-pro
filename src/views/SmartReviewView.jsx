import React from 'react';
import { CheckCircle2 } from '../components/Icons.jsx';

export default function SmartReviewView({ vocabList, addExp }) {
  const reviewItems = vocabList.filter(v => v.status === 'review' || v.status === 'learning');

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900">ทบทวนคำศัพท์อัตโนมัติ (Smart Review)</h2>
        <p className="text-sm text-slate-500">รวบรวมคำศัพท์ที่ถึงรอบ Spaced Repetition และคำที่ตอบผิดบ่อย</p>
      </div>

      {reviewItems.length > 0 ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-4 text-center">
          <h3 className="text-4xl font-black text-slate-900">{reviewItems[0].chinese}</h3>
          <p className="text-emerald-600 font-bold">{reviewItems[0].pinyin}</p>
          <p className="text-slate-700 font-bold text-lg">{reviewItems[0].meaning}</p>
          <button onClick={() => addExp(10)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow-md text-sm">
            จำได้แล้ว (Next Word)
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800">ยอดเยี่ยม! ทบทวนครบทุกคำสำหรับวันนี้แล้ว</h3>
        </div>
      )}
    </div>
  );
}
