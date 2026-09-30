import React, { useState } from 'react';
import { ShieldAlert } from '../components/Icons.jsx';

export default function MyWritingView({ userWritings, setUserWritings, addExp }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [checkedResult, setCheckedResult] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setUserWritings([...userWritings, { id: 'w_' + Date.now(), title, content, level: 'HSK 3', date: 'วันนี้' }]);
    addExp(30);
    setTitle(''); setContent('');
  };

  const runAIErrorCheck = () => {
    setCheckedResult({
      hasError: true,
      issues: [
        { wrong: '我昨天去学校了明天。', fix: '我昨天去了学校。', reason: 'ลำดับเวลาและคำลงท้าย 了 วางตำแหน่งไม่ถูกต้อง' }
      ]
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-black text-slate-900">ห้องงานเขียนของฉัน & ระบบตรวจ Grammar (My Writing)</h2>
        <p className="text-sm text-slate-500">เขียนไดอารี่ นิยาย หรือบทความ พร้อมระบบ AI ตรวจสอบข้อผิดพลาดและไวยากรณ์</p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">หัวข้อเรื่อง (Title)</label>
            <input type="text" required placeholder="เช่น วันนี้ไปเที่ยวปักกิ่ง" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">เนื้อหาภาษาจีน (Content in Chinese)</label>
            <textarea rows={5} required placeholder="เขียนภาษาจีนที่นี่..." value={content} onChange={e => setContent(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-base leading-relaxed" />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={runAIErrorCheck} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-2xl text-sm shadow-md">
              🔍 ตรวจงานเขียนด้วย AI (Grammar Check)
            </button>
            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-emerald-200">
              บันทึกงานเขียน
            </button>
          </div>
        </form>

        {checkedResult && (
          <div className="p-5 bg-rose-50 rounded-3xl border border-rose-200 space-y-3 animate-scaleUp">
            <h4 className="font-extrabold text-rose-900 text-sm flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>ผลการตรวจไวยากรณ์และโครงสร้างประโยค</span>
            </h4>
            {checkedResult.issues.map((iss, idx) => (
              <div key={idx} className="text-xs space-y-1 text-rose-800">
                <p>❌ ต้นฉบับ: <span className="line-through">{iss.wrong}</span></p>
                <p>✅ แนะนำ: <span className="font-bold text-emerald-700">{iss.fix}</span></p>
                <p className="italic text-slate-600">💡 เหตุผล: {iss.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
