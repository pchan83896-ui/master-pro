import React from 'react';
import { Award, BarChart2, CheckCircle2, Flame, Trophy, Sparkles, ArrowRight, Brain } from '../components/Icons.jsx';
import QuickBtn from '../components/QuickBtn.jsx';
import SkillProgressBar from '../components/SkillProgressBar.jsx';
import StatCard from '../components/StatCard.jsx';

export default function DashboardView({ userStats, vocabList, setActiveTab }) {
  const masteredCount = vocabList.filter(v => v.status === 'mastered').length;
  const reviewCount = vocabList.filter(v => v.status === 'review' || v.status === 'learning').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
          <Brain className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-4 text-emerald-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>แพลตฟอร์มเตรียมสอบ HSK 1-4 ครบวงจร</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">ยินดีต้อนรับนักเรียนภาษาจีน, พร้อมลุยวันนี้หรือยัง?</h2>
          <p className="text-emerald-100 text-sm md:text-base mb-6 leading-relaxed">
            คุณมีคำศัพท์ที่ต้องทบทวนวันนี้ {reviewCount} คำ ลุยฝึกซ้อมเพื่อรักษา Streak ต่อเนื่องกันเลย!
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('review')}
              className="bg-white text-emerald-700 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-emerald-50 transition-all text-sm flex items-center space-x-2"
            >
              <span>เริ่มทบทวนคำศัพท์วันนี้</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('mock')}
              className="bg-emerald-500/40 border border-emerald-400/40 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-500/60 transition-all text-sm"
            >
              ทดสอบ Mock Test
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Flame className="w-6 h-6 text-orange-500" />} bgColor="bg-orange-50" title="สตรีท (Streak)" value={`${userStats.streak} วัน`} desc="ยอดเยี่ยม รักษาเวลาต่อเนื่อง" />
        <StatCard icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />} bgColor="bg-emerald-50" title="คำศัพท์ที่จำได้แม่น" value={`${masteredCount} คำ`} desc="จากคลังคำศัพท์ HSK 1-4" />
        <StatCard icon={<Award className="w-6 h-6 text-indigo-600" />} bgColor="bg-indigo-50" title="คะแนนเฉลี่ย Mock Test" value={`${userStats.mockScores[userStats.mockScores.length - 1]}%`} desc="ผ่านเกณฑ์มาตรฐาน HSK" />
        <StatCard icon={<Trophy className="w-6 h-6 text-amber-500" />} bgColor="bg-amber-50" title="เลเวล / XP" value={`${userStats.exp} XP`} desc={userStats.level} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <span>คะแนนทักษะรายด้าน (Skills Breakdown)</span>
          </h3>
          <div className="space-y-3">
            <SkillProgressBar label="การฟัง (Listening)" score={userStats.listeningScore} color="bg-emerald-500" />
            <SkillProgressBar label="การอ่าน (Reading)" score={userStats.readingScore} color="bg-teal-500" />
            <SkillProgressBar label="การเขียน (Writing & Strokes)" score={userStats.writingScore} color="bg-blue-500" />
            <SkillProgressBar label="การพูด (Speaking & Tones)" score={userStats.speakingScore} color="bg-indigo-500" />
            <SkillProgressBar label="ไวยากรณ์ (Grammar)" score={userStats.grammarScore} color="bg-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">ทางลัดการเรียนรู้ด่วน</h3>
            <div className="space-y-2.5">
              <QuickBtn label="📚 คลังคำศัพท์ HSK 1-4" onClick={() => setActiveTab('vocab')} />
              <QuickBtn label="⚡ ฝึกแฟลชการ์ด (Flashcard)" onClick={() => setActiveTab('flashcard')} />
              <QuickBtn label="✍️ ฝึกเขียนอักษรจีน" onClick={() => setActiveTab('strokes')} />
              <QuickBtn label="📖 ห้องอ่านบทความ" onClick={() => setActiveTab('reading')} />
              <QuickBtn label="📝 จำลองข้อสอบ HSK" onClick={() => setActiveTab('mock')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
