import React, { useState } from 'react';
import { Gamepad2 } from '../components/Icons.jsx';

export default function ExerciseCenterView({ addExp }) {
  const [completed, setCompleted] = useState(false);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900">ศูนย์ฝึกซ้อม & แบบฝึกหัด (Exercise Center)</h2>
        <p className="text-sm text-slate-500">แบบฝึกหัดเติมคำศัพท์ จับคู่ และเรียงประโยค</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Gamepad2 className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 mb-2">มินิเกมฝึกจับคู่พินอินและความหมาย</h3>
          <p className="text-xs text-slate-500">สะสมคะแนน XP และทดสอบทักษะคำศัพท์ HSK ของคุณ</p>
        </div>
        <button
          onClick={() => {
            setCompleted(true);
            addExp(50);
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-200"
        >
          {completed ? 'ทำแบบฝึกหัดสำเร็จ! คะแนน: 100' : 'เริ่มทำแบบฝึกหัดประจำวัน'}
        </button>
      </div>
    </div>
  );
}
