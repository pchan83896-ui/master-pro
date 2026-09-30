import React, { useState, useMemo } from 'react';
import { Volume2, RotateCw, Trophy } from '../components/Icons.jsx';

export default function FlashcardView({ vocabList: allVocab, speakChinese, addExp }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  const [levels, setLevels] = useState(['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4']);
  const [shuffleKey, setShuffleKey] = useState(0);

  const deck = useMemo(() => {
    const list = allVocab.filter(v => levels.includes(v.level));
    if (shuffleKey === 0) return list;
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [allVocab, levels, shuffleKey]);

  const resetDeck = () => { setIndex(0); setFlipped(false); setFinished(false); };
  const toggleLevel = (l) => {
    setLevels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
    resetDeck();
  };

  const picker = (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4'].map(l => (
          <button key={l} onClick={() => toggleLevel(l)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${levels.includes(l) ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {l} ({allVocab.filter(v => v.level === l).length})
          </button>
        ))}
        <button onClick={() => { setShuffleKey(k => k + 1); resetDeck(); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
          🔀 สลับลำดับ
        </button>
        {shuffleKey > 0 && (
          <button onClick={() => { setShuffleKey(0); resetDeck(); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">
            เรียงตามเดิม
          </button>
        )}
      </div>
      <p className="text-[11px] text-slate-500">เลือกได้หลายระดับพร้อมกัน — ตอนนี้มี {deck.length} การ์ด</p>
    </div>
  );

  if (deck.length === 0) return (
    <div className="max-w-xl mx-auto space-y-6">
      {picker}
      <div className="p-8 text-center text-slate-500">ไม่มีคำศัพท์ในระดับที่เลือก (ถ้าเพิ่งเปิดหน้า รอโหลดไฟล์สักครู่)</div>
    </div>
  );

  const currentCard = deck[index % deck.length];

  const handleRating = () => {
    addExp(10);
    setFlipped(false);
    if (index + 1 >= deck.length) {
      setFinished(true);
    } else {
      setIndex(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900">แฟลชการ์ดฝึกความจำ (Flashcard)</h2>
        <p className="text-sm text-slate-500">แตะการ์ดเพื่อพลิกดู Pinyin และคำแปล พร้อมประเมินตัวเอง</p>
      </div>

      {picker}

      {!finished ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>การ์ดที่ {index + 1} จาก {deck.length}</span>
            <span>ความคืบหน้า {Math.round((index / deck.length) * 100)}%</span>
          </div>

          <div 
            onClick={() => setFlipped(!flipped)}
            className={`w-full h-80 bg-white rounded-3xl border-2 border-slate-100 shadow-xl p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden group hover:border-emerald-300 ${flipped ? 'bg-emerald-50/20' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">{currentCard.level}</span>
              <button onClick={(e) => { e.stopPropagation(); speakChinese(currentCard.chinese); }} className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              {!flipped ? (
                <h3 className="text-7xl font-black text-slate-900 tracking-wider">{currentCard.chinese}</h3>
              ) : (
                <div className="space-y-3 animate-fadeIn">
                  <p className="text-3xl font-bold text-emerald-600">{currentCard.pinyin}</p>
                  <h4 className="text-3xl font-extrabold text-slate-900">{currentCard.meaning}</h4>
                  <p className="text-xs text-slate-500 italic mt-2">"{currentCard.example}"</p>
                </div>
              )}
            </div>

            <div className="text-center text-xs text-slate-400 font-semibold flex items-center justify-center space-x-1">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{flipped ? 'แสดงด้านหน้า' : 'แตะเพื่อพลิกดูคำแปล'}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button onClick={handleRating} className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3.5 rounded-2xl text-xs border border-rose-200">จำไม่ได้</button>
            <button onClick={handleRating} className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold py-3.5 rounded-2xl text-xs border border-amber-200">ยาก</button>
            <button onClick={handleRating} className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3.5 rounded-2xl text-xs border border-blue-200">ดี (จำได้)</button>
            <button onClick={handleRating} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-3.5 rounded-2xl text-xs border border-emerald-200">ง่ายมาก</button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6 animate-scaleUp">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">ยอดเยี่ยมมาก! จบรอบฝึกฝนแฟลชการ์ด</h3>
            <p className="text-sm text-slate-500">ระบบบันทึกความจำและคำนวณรอบ Spaced Repetition เรียบร้อยแล้ว</p>
          </div>
          <button onClick={() => { setIndex(0); setFinished(false); }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-200">
            เริ่มรอบใหม่
          </button>
        </div>
      )}
    </div>
  );
}
