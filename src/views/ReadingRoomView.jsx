import React, { useState } from 'react';
import { Volume2, ArrowRight } from '../components/Icons.jsx';

export default function ReadingRoomView({ articles, speakChinese, setSelectedWordPopup }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showPinyin, setShowPinyin] = useState(true);

  if (!selectedArticle) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h2 className="text-2xl font-black text-slate-900">ห้องอ่านภาษาจีน (Reading Room)</h2>
          <p className="text-sm text-slate-500">บทความ เรื่องสั้น พร้อมระบบแตะคำศัพท์เพื่อดูความหมายทันที</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map(art => (
            <div key={art.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">{art.level}</span>
                <h3 className="text-lg font-black text-slate-900 my-2">{art.title}</h3>
                <p className="text-xs text-slate-400 mb-4">{art.charsCount} ตัวอักษร • อ่านประมาณ {art.timeMin} นาที</p>
              </div>
              <button
                onClick={() => setSelectedArticle(art)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow-md text-sm flex items-center justify-center space-x-2"
              >
                <span>เริ่มอ่านบทความ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <button onClick={() => setSelectedArticle(null)} className="text-xs font-bold text-emerald-600 hover:underline">
          ← กลับสู่หน้ารายการบทความ
        </button>
        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold text-slate-600 flex items-center space-x-1 cursor-pointer">
            <input type="checkbox" checked={showPinyin} onChange={() => setShowPinyin(!showPinyin)} />
            <span>แสดง Pinyin</span>
          </label>
          <button onClick={() => speakChinese(selectedArticle.content)} className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6">
        <h3 className="text-2xl font-black text-slate-900">{selectedArticle.title}</h3>

        <div className="text-xl leading-loose font-medium text-slate-800 space-y-4">
          <p>
            {selectedArticle.content.split('').map((char, idx) => (
              <span
                key={idx}
                onClick={() => {
                  setSelectedWordPopup({
                    chinese: char,
                    pinyin: 'pīnyīn',
                    meaning: 'คำแปลตัวอักษรจีนจากบทความ',
                    level: selectedArticle.level
                  });
                }}
                className="hover:bg-emerald-100 cursor-pointer rounded px-0.5 transition-colors"
                title="แตะเพื่อดูความหมายและ Pinyin"
              >
                {char}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
