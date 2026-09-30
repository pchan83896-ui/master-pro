import React, { useState } from 'react';
import { Trophy } from '../components/Icons.jsx';
import { MOCK_EXAMS_DATA } from '../data/mockExams.js';

export default function MockExamView({ addExp }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [finished, setFinished] = useState(false);

  const startExam = (lvl) => {
    setSelectedLevel(lvl);
    setFinished(false);
  };

  const submitExam = () => {
    setFinished(true);
    addExp(100);
  };

  if (!selectedLevel) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h2 className="text-2xl font-black text-slate-900">คลังข้อสอบจำลอง HSK (Mock Test)</h2>
          <p className="text-sm text-slate-500">จำลองข้อสอบจริงพร้อมจับเวลา ระบบตรวจผลและวิเคราะห์จุดอ่อน</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(MOCK_EXAMS_DATA).map(lvl => (
            <div key={lvl} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">{lvl}</span>
                <h3 className="text-xl font-black text-slate-900 my-2">{MOCK_EXAMS_DATA[lvl].title}</h3>
                <p className="text-xs text-slate-400 mb-6">ระยะเวลา 35 นาที • ครอบคลุมพาร์ท Listening & Reading</p>
              </div>
              <button onClick={() => startExam(lvl)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow-md text-sm">
                เริ่มทำข้อสอบจริง
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const exam = MOCK_EXAMS_DATA[selectedLevel];

  if (finished) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6 animate-scaleUp">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Trophy className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">สรุปผลคะแนน {selectedLevel} Mock Test</h3>
          <div className="text-5xl font-black text-emerald-600 my-2">85%</div>
          <p className="text-xs text-slate-500">ผ่านเกณฑ์มาตรฐานการสอบ HSK! รับไปเลย +100 XP</p>
        </div>
        <button onClick={() => setSelectedLevel(null)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-200">
          กลับสู่หน้าเลือกข้อสอบ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900">{exam.title}</h3>
        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">⏱ 34:50 นาที</span>
      </div>

      <div className="space-y-4">
        <h4 className="font-extrabold text-slate-800">ข้อที่ 1: {exam.questions[0].question}</h4>
        <div className="space-y-2">
          {exam.questions[0].options.map((opt, i) => (
            <button key={i} className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:bg-emerald-50 text-sm font-semibold">
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button onClick={submitExam} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-200 text-sm">
        ส่งข้อสอบและดูผลวิเคราะห์
      </button>
    </div>
  );
}
