import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Check } from '../components/Icons.jsx';

export default function StrokeOrderView({ speakChinese, addExp }) {
  const [char, setChar] = useState('我');
  const canvasRef = useRef(null);

  const sampleCharacters = [
    { char: '我', pinyin: 'wǒ', meaning: 'ฉัน', hsk: 'HSK 1' },
    { char: '爱', pinyin: 'ài', meaning: 'รัก', hsk: 'HSK 1' },
    { char: '学', pinyin: 'xué', meaning: 'เรียน', hsk: 'HSK 1' },
    { char: '中', pinyin: 'zhōng', meaning: 'กลาง', hsk: 'HSK 1' },
    { char: '国', pinyin: 'guó', meaning: 'ประเทศ', hsk: 'HSK 1' },
    { char: '机', pinyin: 'jī', meaning: 'เครื่อง', hsk: 'HSK 2' },
    { char: '安', pinyin: 'ān', meaning: 'สงบ', hsk: 'HSK 3' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.font = 'bold 160px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
  }, [char]);

  const activeObj = sampleCharacters.find(s => s.char === char) || sampleCharacters[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900">ระบบฝึกเขียนตัวอักษรจีน & ลำดับเส้น (Stroke Order)</h2>
        <p className="text-sm text-slate-500">ดูอนิเมชั่นลำดับเส้น และฝึกเขียนบนกระดานทัชสกรีน/เมาส์</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {sampleCharacters.map(s => (
          <button
            key={s.char}
            onClick={() => setChar(s.char)}
            className={`w-12 h-12 rounded-2xl font-black text-xl flex items-center justify-center transition-all ${
              char === s.char ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {s.char}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            width={260} 
            height={260} 
            className="bg-slate-50 rounded-3xl border-2 border-slate-200 shadow-inner cursor-crosshair touch-none"
            onMouseDown={(e) => {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              const rect = canvas.getBoundingClientRect();
              ctx.beginPath();
              ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
              ctx.strokeStyle = '#047857';
              ctx.lineWidth = 8;
              ctx.lineCap = 'round';
              canvas.onmousemove = (ev) => {
                ctx.lineTo(ev.clientX - rect.left, ev.clientY - rect.top);
                ctx.stroke();
              };
              canvas.onmouseup = () => { canvas.onmousemove = null; };
            }}
          />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">{activeObj.hsk}</span>
            <h3 className="text-5xl font-black text-slate-900 my-2">{activeObj.char}</h3>
            <p className="text-emerald-600 font-bold text-lg">{activeObj.pinyin} • {activeObj.meaning}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => speakChinese(activeObj.char)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center space-x-2"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>ฟังเสียงออกเสียงตัวอักษร</span>
            </button>

            <button
              onClick={() => {
                addExp(15);
                alert('ระบบตรวจสอบลำดับเส้น: เขียนถูกต้องตามหลักโครงสร้างอักษรจีน!');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>ส่งตรวจลายเส้น / ล้างกระดาน</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
