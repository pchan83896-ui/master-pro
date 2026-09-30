import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Home, BookOpen, Edit3, BookMarked, Headphones, Mic, FileText, Gamepad2, BarChart2, Plus, Volume2, XCircle, Trophy, Clock, Brain, Layers, Book, PenTool } from './components/Icons.jsx';
import DashboardView from './views/DashboardView.jsx';
import ExerciseCenterView from './views/ExerciseCenterView.jsx';
import FlashcardView from './views/FlashcardView.jsx';
import GrammarHubView from './views/GrammarHubView.jsx';
import ListeningDictationView from './views/ListeningDictationView.jsx';
import MobileNavBtn from './components/MobileNavBtn.jsx';
import MockExamView from './views/MockExamView.jsx';
import MyWritingView from './views/MyWritingView.jsx';
import NavItem from './components/NavItem.jsx';
import PortfolioView from './views/PortfolioView.jsx';
import ProgressAnalyticsView from './views/ProgressAnalyticsView.jsx';
import ReadingRoomView from './views/ReadingRoomView.jsx';
import SmartReviewView from './views/SmartReviewView.jsx';
import SpeakingToneView from './views/SpeakingToneView.jsx';
import StrokeOrderView from './views/StrokeOrderView.jsx';
import VocabHubView from './views/VocabHubView.jsx';
import { INITIAL_VOCAB_DB } from './data/initialVocab.js';
import { READING_ARTICLES } from './data/readings.js';

import { HSK_LEVELS, fetchHskLevel, normalizeVocab, parseHskText } from './utils/hskLoader.js';
import { speakChinese } from './utils/speech.js';

// แท็บมังฮวาโหลดเมื่อเปิดใช้งานเท่านั้น (แยก bundle Firebase ออกจากหน้าหลัก)
const ManhwaApp = lazy(() => import('./manhwa/ManhwaApp.jsx'));

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [vocabList, setVocabList] = useState(INITIAL_VOCAB_DB);
  const [hskStatus, setHskStatus] = useState({
    1: { state: 'idle', count: 0 }, 2: { state: 'idle', count: 0 },
    3: { state: 'idle', count: 0 }, 4: { state: 'idle', count: 0 }
  });

  const setLevelStatus = (n, s) => setHskStatus(prev => ({ ...prev, [n]: s }));

  // แทนที่คำศัพท์ของระดับ n ด้วยข้อมูลใหม่ (คงสถานะการเรียนเดิม + คำที่ผู้ใช้เพิ่มเอง)
  const applyLevel = (n, words) => {
    setVocabList(prev => {
      const level = `HSK ${n}`;
      const oldStatus = new Map(prev.filter(v => v.level === level && v.source === 'hsk-file').map(v => [v.id, v.status]));
      const kept = prev.filter(v => v.level !== level || String(v.id).startsWith('cust_'));
      const fresh = words.map(w => ({ ...w, status: oldStatus.get(w.id) || w.status }));
      return [...kept, ...fresh];
    });
  };

  const loadLevel = async (n) => {
    setLevelStatus(n, { state: 'loading', count: 0 });
    try {
      const words = await fetchHskLevel(n);
      applyLevel(n, words);
      setLevelStatus(n, { state: 'ready', count: words.length });
    } catch (e) {
      setLevelStatus(n, { state: 'error', count: 0, error: e.message });
    }
  };

  const loadLevelFromFile = async (n, file) => {
    if (!file) return;
    setLevelStatus(n, { state: 'loading', count: 0 });
    try {
      const words = normalizeVocab(parseHskText(await file.text()), n);
      applyLevel(n, words);
      setLevelStatus(n, { state: 'ready', count: words.length, fromFile: file.name });
    } catch (e) {
      setLevelStatus(n, { state: 'error', count: 0, error: e.message });
    }
  };

  // โหลดทุกระดับพร้อมกันตอนเปิดหน้า แต่ละระดับสำเร็จ/ล้มเหลวเป็นอิสระต่อกัน
  useEffect(() => { HSK_LEVELS.forEach(loadLevel); }, []);
  const [userWritings, setUserWritings] = useState([
    { id: 'w1', title: 'บันทึกของฉัน (My Diary)', content: '我今天很高兴，因为我学会了很多汉语。', level: 'HSK 2', date: '2026-06-06' }
  ]);
  const [userStats, setUserStats] = useState({
    streak: 8,
    exp: 620,
    level: 'Silver Expert (ระดับเงิน)',
    listeningScore: 82,
    readingScore: 88,
    writingScore: 75,
    speakingScore: 70,
    grammarScore: 80,
    mockScores: [78, 85]
  });

  const [selectedWordPopup, setSelectedWordPopup] = useState(null);

  const addExp = (amount) => {
    setUserStats(prev => ({
      ...prev,
      exp: prev.exp + amount
    }));
  };

  const addPersonalVocab = (wordObj) => {
    if (!vocabList.some(v => v.chinese === wordObj.chinese)) {
      setVocabList(prev => [...prev, { ...wordObj, id: 'cust_' + Date.now(), status: 'learning' }]);
      addExp(15);
    }
  };

  return (
    <div className="flex h-dvh bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shadow-sm">
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-6 flex items-center space-x-3 border-b border-slate-100 flex-shrink-0">
            <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-md shadow-emerald-200">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">HanYu Master Pro</h1>
              <p className="text-xs text-emerald-600 font-semibold">HSK 1-4 Comprehensive System</p>
            </div>
          </div>

          <nav className="p-4 space-y-1 flex-1">
            <NavItem icon={<Home />} label="หน้าแรก / Dashboard" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon={<BookOpen />} label="คลังคำศัพท์ HSK 1-4" active={activeTab === 'vocab'} onClick={() => setActiveTab('vocab')} />
            <NavItem icon={<Layers />} label="แฟลชการ์ด (Flashcard)" active={activeTab === 'flashcard'} onClick={() => setActiveTab('flashcard')} />
            <NavItem icon={<PenTool />} label="ฝึกเขียนอักษร (Stroke Order)" active={activeTab === 'strokes'} onClick={() => setActiveTab('strokes')} />
            <NavItem icon={<Headphones />} label="ฝึกฟัง & Dictation" active={activeTab === 'listening'} onClick={() => setActiveTab('listening')} />
            <NavItem icon={<Mic />} label="ฝึกพูด & Tone Analyzer" active={activeTab === 'speaking'} onClick={() => setActiveTab('speaking')} />
            <NavItem icon={<Book />} label="ไวยากรณ์ (Grammar Hub)" active={activeTab === 'grammar'} onClick={() => setActiveTab('grammar')} />
            <NavItem icon={<BookMarked />} label="ห้องอ่าน (Reading Room)" active={activeTab === 'reading'} onClick={() => setActiveTab('reading')} />
            <NavItem icon={<Edit3 />} label="งานเขียนของฉัน (My Writing)" active={activeTab === 'writing'} onClick={() => setActiveTab('writing')} />
            <NavItem icon={<Gamepad2 />} label="ศูนย์ฝึกซ้อม & มินิเกม" active={activeTab === 'exercise'} onClick={() => setActiveTab('exercise')} />
            <NavItem icon={<FileText />} label="จำลองข้อสอบ HSK (Mock Test)" active={activeTab === 'mock'} onClick={() => setActiveTab('mock')} />
            <NavItem icon={<Clock />} label="ทบทวนอัตโนมัติ (Smart Review)" active={activeTab === 'review'} onClick={() => setActiveTab('review')} />
            <NavItem icon={<BarChart2 />} label="สถิติและวิเคราะห์จุดอ่อน" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <NavItem icon={<BookOpen />} label="อ่านมังฮวา (Manhwa)" active={activeTab === 'manhwa'} onClick={() => setActiveTab('manhwa')} />
            <NavItem icon={<FileText />} label="ผลงานของฉัน (Portfolio)" active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
          </nav>
        </div>

        {/* User Mini Profile Card */}
        <div className="p-4 m-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase">แรงค์ปัจจุบัน</span>
            <span className="text-xs bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">{userStats.exp} EXP</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-700 truncate">{userStats.level}</span>
          </div>
          <div className="w-full bg-emerald-200/60 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((userStats.exp % 1000) / 10, 100)}%` }}></div>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER & MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 md:hidden flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-600 text-white p-1.5 rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 text-sm">HanYu Master Pro</span>
          </div>
          <div className="flex space-x-1 overflow-x-auto py-2">
            <MobileNavBtn icon={<Home />} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <MobileNavBtn icon={<BookOpen />} active={activeTab === 'vocab'} onClick={() => setActiveTab('vocab')} />
            <MobileNavBtn icon={<Layers />} active={activeTab === 'flashcard'} onClick={() => setActiveTab('flashcard')} />
            <MobileNavBtn icon={<BookMarked />} active={activeTab === 'reading'} onClick={() => setActiveTab('reading')} />
            <MobileNavBtn icon={<FileText />} active={activeTab === 'mock'} onClick={() => setActiveTab('mock')} />
            <MobileNavBtn icon={<Book />} active={activeTab === 'manhwa'} onClick={() => setActiveTab('manhwa')} />
            <MobileNavBtn icon={<FileText />} active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto pb-12">
            {activeTab === 'home' && <DashboardView userStats={userStats} vocabList={vocabList} setActiveTab={setActiveTab} />}
            {activeTab === 'vocab' && <VocabHubView vocabList={vocabList} setVocabList={setVocabList} speakChinese={speakChinese} addExp={addExp} hskStatus={hskStatus} loadLevel={loadLevel} loadLevelFromFile={loadLevelFromFile} />}
            {activeTab === 'flashcard' && <FlashcardView vocabList={vocabList} speakChinese={speakChinese} addExp={addExp} />}
            {activeTab === 'strokes' && <StrokeOrderView speakChinese={speakChinese} addExp={addExp} />}
            {activeTab === 'listening' && <ListeningDictationView speakChinese={speakChinese} addExp={addExp} />}
            {activeTab === 'speaking' && <SpeakingToneView speakChinese={speakChinese} addExp={addExp} />}
            {activeTab === 'grammar' && <GrammarHubView speakChinese={speakChinese} />}
            {activeTab === 'reading' && <ReadingRoomView articles={READING_ARTICLES} speakChinese={speakChinese} setSelectedWordPopup={setSelectedWordPopup} />}
            {activeTab === 'writing' && <MyWritingView userWritings={userWritings} setUserWritings={setUserWritings} addExp={addExp} />}
            {activeTab === 'exercise' && <ExerciseCenterView addExp={addExp} />}
            {activeTab === 'mock' && <MockExamView addExp={addExp} />}
            {activeTab === 'review' && <SmartReviewView vocabList={vocabList} addExp={addExp} />}
            {activeTab === 'analytics' && <ProgressAnalyticsView userStats={userStats} vocabList={vocabList} />}
            {activeTab === 'portfolio' && <PortfolioView />}
            {activeTab === 'manhwa' && (
              <Suspense fallback={<p className="text-center text-sm text-slate-500 py-12">กำลังโหลดระบบมังฮวา...</p>}>
                <ManhwaApp />
              </Suspense>
            )}
          </div>
        </main>
      </div>

      {/* GLOBAL TAP-TO-TRANSLATE POPUP MODAL */}
      {selectedWordPopup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-scaleUp relative border border-slate-100">
            <button 
              onClick={() => setSelectedWordPopup(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 mb-6">
              <h3 className="text-5xl font-black text-slate-900">{selectedWordPopup.chinese}</h3>
              <p className="text-emerald-600 font-bold text-lg">{selectedWordPopup.pinyin}</p>
              <p className="text-slate-700 font-semibold text-base">{selectedWordPopup.meaning}</p>
              <span className="inline-block text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                {selectedWordPopup.level}
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => speakChinese(selectedWordPopup.chinese)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>ฟังเสียงอ่าน (Audio)</span>
              </button>

              <button
                onClick={() => {
                  addPersonalVocab(selectedWordPopup);
                  setSelectedWordPopup(null);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-200 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มเข้าคลังคำศัพท์ส่วนตัว</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
