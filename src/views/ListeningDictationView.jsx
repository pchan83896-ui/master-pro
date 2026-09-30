import React, { useState } from 'react';
import { Headphones, Volume2 } from '../components/Icons.jsx';

export default function ListeningDictationView({ speakChinese, addExp }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [resultMsg, setResultMsg] = useState(null);

  const testList = [
    { chinese: '我爱中国', pinyin: 'wǒ ài zhōngguó', meaning: 'ฉันรักประเทศจีน' },
    { chinese: '机场', pinyin: 'jīchǎng', meaning: 'สนามบิน' },
    { chinese: '明天见', pinyin: 'míngtiān jiàn', meaning: 'พรุ่งนี้เจอกัน' }
  ];

  const currentItem = testList[currentIdx % testList.length];

  const checkAnswer = () => {
    if (inputVal.trim() === currentItem.chinese) {
      setResultMsg({ correct: true, text: 'ยอดเยี่ยม! เขียนและพิมพ์ถูกต้อง' });
      addExp(25);
    } else {
      setResultMsg({ correct: false, text: `ยังไม่ถูกต้อง เฉลยคือ: ${currentItem.chinese} (${currentItem.pinyin})` });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900">ฝึกฟังและเขียนตามคำบอก (Listening & Dictation)</h2>
        <p className="text-sm text-slate-500">ฟังเสียงภาษาจีนแล้วพิมพ์ 汉字 ให้ถูกต้อง</p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6">
        <div className="text-center py-8 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-4">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
            <Headphones className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">กดปุ่มเพื่อฟังเสียงตัวอย่าง</h3>
            <p className="text-xs text-slate-500 mt-1">ความเร็ว 1.0x (มาตรฐาน HSK Exam)</p>
          </div>
          <button
            onClick={() => speakChinese(currentItem.chinese)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl shadow-md text-sm inline-flex items-center space-x-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>เล่นเสียง (Play Audio)</span>
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-700">พิมพ์อักษรจีนที่คุณได้ยิน (Dictation):</label>
          <input
            type="text"
            placeholder="เช่น 我爱中国"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-lg font-bold text-center"
          />

          <button
            onClick={checkAnswer}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-200 text-sm"
          >
            ตรวจสอบคำตอบ
          </button>

          {resultMsg && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold ${resultMsg.correct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              {resultMsg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
