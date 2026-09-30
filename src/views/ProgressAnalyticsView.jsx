import React from 'react';

export default function ProgressAnalyticsView({ userStats, vocabList }) {
  const masteredCount = vocabList.filter(v => v.status === 'mastered').length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-black text-slate-900">สถิติและวิเคราะห์จุดอ่อน (Progress Analytics)</h2>
        <p className="text-sm text-slate-500">รายงานวิเคราะห์พัฒนาการเรียนรู้และจุดที่ควรฝึกเพิ่มตามข้อมูลจริง</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <h4 className="text-xs text-slate-400 font-bold uppercase mb-1">คำศัพท์ที่จำได้</h4>
          <div className="text-3xl font-black text-emerald-600">{masteredCount}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <h4 className="text-xs text-slate-400 font-bold uppercase mb-1">สตรีทต่อเนื่อง</h4>
          <div className="text-3xl font-black text-orange-500">{userStats.streak} วัน</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <h4 className="text-xs text-slate-400 font-bold uppercase mb-1">คะแนน Mock Test สูงสุด</h4>
          <div className="text-3xl font-black text-indigo-600">{Math.max(...userStats.mockScores)}%</div>
        </div>
      </div>
    </div>
  );
}
