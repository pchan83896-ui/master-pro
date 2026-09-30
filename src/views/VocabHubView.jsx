import React, { useState, useEffect } from 'react';
import { Search, Plus, Volume2 } from '../components/Icons.jsx';

export default function VocabHubView({ vocabList, setVocabList, speakChinese, addExp, hskStatus, loadLevel, loadLevelFromFile }) {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(60);

  const [c, setC] = useState('');
  const [p, setP] = useState('');
  const [m, setM] = useState('');
  const [t, setT] = useState('名词 (Noun)');
  const [ex, setEx] = useState('');
  const [lvl, setLvl] = useState('HSK 1');

  const filtered = vocabList.filter(item => {
    const matchLvl = filterLevel === 'ALL' || item.level === filterLevel;
    const matchSearch = item.chinese.includes(searchQuery) || item.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) || item.meaning.includes(searchQuery);
    return matchLvl && matchSearch;
  });

  useEffect(() => { setVisibleCount(60); }, [filterLevel, searchQuery]);

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!c || !m) return;
    const newItem = {
      id: 'cust_' + Date.now(),
      chinese: c,
      pinyin: p || '-',
      meaning: m,
      type: t,
      example: ex || 'ไม่มีตัวอย่าง',
      level: lvl,
      status: 'learning'
    };
    setVocabList([...vocabList, newItem]);
    addExp(20);
    setC(''); setP(''); setM(''); setEx('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">คลังคำศัพท์ HSK 1 - 4 (Vocabulary Hub)</h2>
          <p className="text-sm text-slate-500">คำศัพท์ครบถ้วนพร้อมเสียงอ่าน ชนิดของคำ และประโยคตัวอย่าง</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2 transition-all text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>เพิ่มคำศัพท์ส่วนตัว</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <p className="text-xs font-bold text-slate-700">แหล่งข้อมูลคำศัพท์ (โฟลเดอร์ hsk) — โหลดแยกอิสระแต่ละระดับ</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(n => {
            const s = hskStatus[n];
            return (
              <div key={n} className="border border-slate-100 rounded-2xl p-3 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-800">HSK {n}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    s.state === 'ready' ? 'bg-emerald-100 text-emerald-800' :
                    s.state === 'loading' ? 'bg-amber-100 text-amber-800' :
                    s.state === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.state === 'ready' ? `${s.count} คำ` : s.state === 'loading' ? 'กำลังโหลด...' : s.state === 'error' ? 'โหลดไม่ได้' : 'รอโหลด'}
                  </span>
                </div>
                {s.state === 'error' && <p className="text-[11px] text-rose-600 break-words">{s.error}</p>}
                {s.fromFile && s.state === 'ready' && <p className="text-[11px] text-slate-500 truncate">จากไฟล์: {s.fromFile}</p>}
                <div className="flex gap-2">
                  <button onClick={() => loadLevel(n)} className="flex-1 text-[11px] font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 py-1.5 rounded-xl">โหลดใหม่</button>
                  <label className="flex-1 text-[11px] font-bold text-center bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 py-1.5 rounded-xl cursor-pointer">
                    เลือกไฟล์
                    <input type="file" className="hidden" onChange={(e) => { loadLevelFromFile(n, e.target.files[0]); e.target.value = ''; }} />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        {Object.values(hskStatus).some(s => s.state === 'error') && (
          <p className="text-[11px] text-slate-500">
            หากโหลดอัตโนมัติไม่ได้ (เช่น เปิดไฟล์ตรงๆ แบบ file://) ให้เปิดผ่านเว็บเซิร์ฟเวอร์ เช่น <code>python -m http.server</code> หรือกด “เลือกไฟล์” เพื่อโหลดไฟล์ hsk แต่ละระดับด้วยตัวเอง
          </p>
        )}
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['ALL', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterLevel === lvl ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'ทั้งหมด (All HSK)' : lvl}{lvl !== 'ALL' && ` (${vocabList.filter(v => v.level === lvl).length})`}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหา 汉字, Pinyin หรือความหมาย..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.slice(0, visibleCount).map(item => (
          <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {item.level}{item.type ? ` • ${item.type}` : ''}
                </span>
                <button
                  onClick={() => speakChinese(item.chinese)}
                  className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-3">
                <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-wider">{item.chinese}</h3>
                <p className="text-emerald-600 font-bold text-sm">{item.pinyin}</p>
              </div>

              <div className="mb-4">
                <span className="text-sm font-bold text-slate-800">{item.meaning}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 bg-slate-50/60 -mx-5 -mb-5 p-4 rounded-b-3xl">
              <p className="text-xs text-slate-500 italic">ตัวอย่าง: {item.example}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-500 py-8">ไม่พบคำศัพท์ที่ตรงกับเงื่อนไข</p>
      )}
      {filtered.length > visibleCount && (
        <div className="text-center">
          <button onClick={() => setVisibleCount(c => c + 60)} className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm px-6 py-2.5 rounded-2xl">
            แสดงเพิ่ม ({visibleCount} / {filtered.length})
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-scaleUp">
            <h3 className="text-xl font-black text-slate-900 mb-2">เพิ่มคำศัพท์ส่วนตัว</h3>
            <p className="text-xs text-slate-500 mb-6">บันทึกคำศัพท์ลงในคลังของคุณเพื่อใช้ท่องจำในแฟลชการ์ดและสมาร์ทรีวิว</p>

            <form onSubmit={handleAddCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">อักษรจีน (Chinese)</label>
                <input type="text" required placeholder="เช่น 旅游" value={c} onChange={e => setC(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">พินอิน (Pinyin)</label>
                <input type="text" placeholder="เช่น lǚyóu" value={p} onChange={e => setP(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ความหมาย (Meaning)</label>
                <input type="text" required placeholder="เช่น ท่องเที่ยว" value={m} onChange={e => setM(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ตัวอย่างประโยค</label>
                <input type="text" placeholder="เช่น 我喜欢旅游" value={ex} onChange={e => setEx(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เลเวล HSK</label>
                <select value={lvl} onChange={e => setLvl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-sm">
                  <option value="HSK 1">HSK 1</option>
                  <option value="HSK 2">HSK 2</option>
                  <option value="HSK 3">HSK 3</option>
                  <option value="HSK 4">HSK 4</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-sm">ยกเลิก</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-emerald-200">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
