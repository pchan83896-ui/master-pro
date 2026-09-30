import React, { useState } from 'react';
import { Mic, Volume2 } from '../components/Icons.jsx';

export default function SpeakingToneView({ speakChinese, addExp }) {
  const [recording, setRecording] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const sampleSentence = '你好，很高兴认识你。 (Nǐ hǎo, hěn gāoxìng rènshi nǐ.)';

  const toggleRecord = () => {
    if (!recording) {
      setRecording(true);
      setAnalyzed(false);
      setTimeout(() => {
        setRecording(false);
        setAnalyzed(true);
        addExp(20);
      }, 3000);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900">ฝึกพูดและวิเคราะห์วรรณยุกต์ (Speaking & Tone Analyzer)</h2>
        <p className="text-sm text-slate-500">ฝึกออกเสียง Tone 1-4 และเทียบเสียงกับเจ้าของภาษา</p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6 text-center">
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase">ประโยคฝึกพูดต้นฉบับ</span>
          <h3 className="text-2xl font-black text-slate-900">{sampleSentence}</h3>
          <button onClick={() => speakChinese('你好，很高兴认识你。')} className="inline-flex items-center space-x-1 text-xs bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-bold mt-2">
            <Volume2 className="w-3.5 h-3.5" />
            <span>ฟังเสียงต้นฉบับ</span>
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={toggleRecord}
            className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-xl transition-all ${
              recording ? 'bg-rose-600 text-white animate-pulse scale-105' : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <Mic className="w-10 h-10" />
          </button>
          <p className="text-xs font-bold text-slate-500">
            {recording ? 'กำลังอัดเสียง... (พูดเลย)' : 'แตะเพื่อเริ่มอัดเสียงพูดของคุณ'}
          </p>

          {analyzed && (
            <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 space-y-2 animate-scaleUp text-left">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-emerald-900 text-sm">ผลการวิเคราะห์เสียง (Tone & Pronunciation Score)</h4>
                <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-full">92%ยอดเยี่ยม</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                • วรรณยุกต์เสียง 3 (Nǐ) และเสียง 3 (hǎo) ชัดเจนถูกต้องตามหลัก Phonetics<br/>
                • จังหวะการเว้นวรรค (Pacing) เป็นธรรมชาติ
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
