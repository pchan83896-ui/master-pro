import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Search, Upload, Plus, ChevronLeft, ChevronRight, 
  ArrowLeft, Heart, MessageSquare, Send, Trash2, FileText, 
  Sparkles, Layers, Compass, User, Eye, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db, appId, isFirebaseConfigured } from './firebase.js';
import { DEFAULT_MANHWAS } from './defaultManhwas.js';

export default function ManhwaApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'detail', 'reader', 'admin'
  const [selectedManhwa, setSelectedManhwa] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  // Data states
  const [manhwas, setManhwas] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Admin Form state
  const [adminForm, setAdminForm] = useState({
    title: '',
    synopsis: '',
    genre: 'Action',
    coverUrl: '',
    status: 'Ongoing',
    chapterNumber: 1,
    chapterTitle: '',
    pdfFile: null,
    pdfPages: []
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ถ้ายังไม่ได้ตั้งค่า Firebase (.env) ให้แสดงมังฮวาตัวอย่างแบบอ่านอย่างเดียว
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setManhwas(DEFAULT_MANHWAS);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Fetch Manhwas
    const manhwaQuery = collection(db, 'artifacts', appId, 'public', 'data', 'manhwas');
    const unsubManhwas = onSnapshot(manhwaQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (list.length === 0) {
        setManhwas(DEFAULT_MANHWAS);
      } else {
        setManhwas(list);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore snapshot error:", error);
      setLoading(false);
    });

    // Fetch Chapters
    const chapQuery = collection(db, 'artifacts', appId, 'public', 'data', 'chapters');
    const unsubChapters = onSnapshot(chapQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChapters(list);
    });

    // Fetch Comments
    const commQuery = collection(db, 'artifacts', appId, 'public', 'data', 'comments');
    const unsubComments = onSnapshot(commQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(list);
    });

    return () => {
      unsubManhwas();
      unsubChapters();
      unsubComments();
    };
  }, [user]);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(10);

    try {
      const reader = new FileReader();
      reader.onload = async function() {
        try {
          const typedarray = new Uint8Array(this.result);
          
          // Load PDF using pdfjsLib CDN
          if (typeof window.pdfjsLib === 'undefined') {
            // Load script dynamically if needed
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          }

          setUploadProgress(30);
          const loadingTask = window.pdfjsLib.getDocument({ data: typedarray });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;
          const extractedPages = [];

          for (let i = 1; i <= numPages; i++) {
            setUploadProgress(Math.floor(30 + (i / numPages) * 60));
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 }); // High resolution scale
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;

            extractedPages.push(canvas.toDataURL('image/jpeg', 0.85));
          }

          setAdminForm(prev => ({
            ...prev,
            pdfFile: file.name,
            pdfPages: extractedPages
          }));
          setUploading(false);
          setUploadProgress(100);
        } catch (err) {
          console.error("PDF parse error:", err);
          alert("ไม่สามารถอ่านไฟล์ PDF นี้ได้ กรุณาลองใหม่อีกครั้ง");
          setUploading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const handleSaveNewChapter = async (e) => {
    e.preventDefault();
    if (!adminForm.title && !selectedManhwa) {
      alert("กรุณาเลือกหรือระบุชื่อเรื่องมังฮวา");
      return;
    }
    if (adminForm.pdfPages.length === 0) {
      alert("กรุณาอัปโหลดไฟล์ PDF ของตอนก่อนบันทึก");
      return;
    }

    try {
      let targetManhwaId = selectedManhwa?.id;
      if (!targetManhwaId) {
        const newManhwaRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'manhwas'), {
          title: adminForm.title,
          synopsis: adminForm.synopsis || 'ซีรีส์มังฮวาเกาหลีสุดมันส์ อัปเดตตอนใหม่ทุกสัปดาห์',
          genre: adminForm.genre,
          coverUrl: adminForm.coverUrl || adminForm.pdfPages[0] || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
          status: adminForm.status,
          views: '5.2K',
          likes: '1.4K',
          createdAt: serverTimestamp()
        });
        targetManhwaId = newManhwaRef.id;
      }

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'chapters'), {
        manhwaId: targetManhwaId,
        chapterNumber: Number(adminForm.chapterNumber) || 1,
        title: adminForm.chapterTitle || `ตอนที่ ${adminForm.chapterNumber}`,
        pages: adminForm.pdfPages,
        createdAt: serverTimestamp()
      });

      alert("อัปโหลดตอนใหม่จากไฟล์ PDF สำเร็จเรียบร้อย!");
      setActiveTab('home');
      setAdminForm({
        title: '',
        synopsis: '',
        genre: 'Action',
        coverUrl: '',
        status: 'Ongoing',
        chapterNumber: 1,
        chapterTitle: '',
        pdfFile: null,
        pdfPages: []
      });
    } catch (err) {
      console.error("Error saving chapter:", err);
      alert("เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleAddComment = async (e, chapterId) => {
    e.preventDefault();
    const input = e.target.elements.commentText;
    if (!input.value.trim()) return;

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'comments'), {
        chapterId,
        user: `Reader_${Math.floor(Math.random() * 9000 + 1000)}`,
        text: input.value,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      input.value = '';
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const filteredManhwas = manhwas.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.synopsis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || m.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = ['All', 'Action', 'Fantasy', 'Romance', 'Comedy', 'Drama'];

  return (
    <div className="min-h-full rounded-3xl overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-purple-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                TOONVERSE
              </span>
              <span className="hidden sm:block text-[10px] text-purple-400 font-semibold tracking-widest uppercase">
                Manhwa Reading Platform
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'home' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>หน้าแรก</span>
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'admin' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30' : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span className="font-bold">อัปโหลดหลังบ้าน (Admin)</span>
            </button>
          </div>
        </div>
      </header>

      {!isFirebaseConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-300 text-xs px-4 py-2 text-center">
          ยังไม่ได้ตั้งค่า Firebase (ไฟล์ .env) — แสดงข้อมูลตัวอย่างแบบอ่านอย่างเดียว อัปโหลดตอนใหม่/คอมเมนต์ยังไม่ทำงาน
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: HOME CATALOG */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/60 via-indigo-950/80 to-slate-900 border border-purple-500/20 p-8 sm:p-12 shadow-2xl">
              <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold border border-purple-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ระบบแปลง PDF เป็นหน้าเว็บ Webtoon อ่านลื่นไหลอัตโนมัติ</span>
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  ศูนย์รวมมังฮวาเกาหลี <br />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">อัปเดตตอนใหม่จาก PDF ทุกวัน</span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  เลือกอ่านการ์ตูนเรื่องโปรดของคุณ หรือใช้ระบบหลังบ้านอัปโหลดไฟล์ PDF เพื่อแปลงหน้ากระดาษเป็นเว็บตูนทันที
                </p>

                {/* Search Bar */}
                <div className="pt-2 flex items-center bg-slate-900/90 border border-slate-700 rounded-2xl p-2 shadow-inner max-w-xl">
                  <Search className="w-5 h-5 text-purple-400 ml-3" />
                  <input 
                    type="text" 
                    placeholder="ค้นหาชื่อเรื่องมังฮวา..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-none px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Genre Filter Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedGenre === genre 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Manhwa Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>มังฮวาแนะนำทั้งหมด ({filteredManhwas.length})</span>
                </h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className="animate-pulse bg-slate-900 rounded-2xl h-72 border border-slate-800"></div>
                  ))}
                </div>
              ) : filteredManhwas.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
                  <AlertCircle className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
                  <p className="text-slate-400 font-medium">ไม่พบมังฮวาที่คุณค้นหา</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredManhwas.map(manhwa => (
                    <div 
                      key={manhwa.id}
                      onClick={() => {
                        setSelectedManhwa(manhwa);
                        setActiveTab('detail');
                      }}
                      className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
                        <img 
                          src={manhwa.coverUrl} 
                          alt={manhwa.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-purple-300 border border-purple-500/30">
                          {manhwa.status || 'Ongoing'}
                        </div>
                        <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-300">
                          {manhwa.genre}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow justify-between space-y-2">
                        <div>
                          <h3 className="font-bold text-sm sm:text-base line-clamp-1 group-hover:text-purple-400 transition-colors">
                            {manhwa.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                            {manhwa.synopsis}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3.5 h-3.5 text-purple-400" />
                            <span>{manhwa.views || '12.5K'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart className="w-3.5 h-3.5 text-pink-500" />
                            <span>{manhwa.likes || '4.2K'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: MANHWA DETAIL */}
        {activeTab === 'detail' && selectedManhwa && (
          <div className="space-y-8 animate-fadeIn">
            <button 
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center space-x-2 text-sm text-purple-400 hover:text-purple-300 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับหน้าแรก</span>
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 shadow-2xl">
              <div className="w-full md:w-64 flex-shrink-0">
                <img 
                  src={selectedManhwa.coverUrl} 
                  alt={selectedManhwa.title} 
                  className="w-full aspect-[3/4] object-cover rounded-2xl shadow-lg border border-slate-800"
                />
              </div>
              <div className="flex flex-col justify-between space-y-4 flex-grow">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full font-semibold border border-purple-500/30">
                      {selectedManhwa.genre}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-500/30">
                      {selectedManhwa.status || 'กำลังอัปเดต'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black">{selectedManhwa.title}</h1>
                  <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
                    {selectedManhwa.synopsis}
                  </p>
                </div>

                <div className="flex items-center space-x-6 pt-4 border-t border-slate-800 text-sm text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span>ยอดเข้าชม {selectedManhwa.views || '1.2M'} ครั้ง</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>ถูกใจ {selectedManhwa.likes || '450K'} คน</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>รายชื่อตอนทั้งหมด ({chapters.filter(c => c.manhwaId === selectedManhwa.id).length})</span>
              </h3>

              <div className="space-y-3">
                {chapters.filter(c => c.manhwaId === selectedManhwa.id).sort((a,b) => a.chapterNumber - b.chapterNumber).map(chap => (
                  <div 
                    key={chap.id}
                    onClick={() => {
                      setSelectedChapter(chap);
                      setActiveTab('reader');
                    }}
                    className="flex items-center justify-between p-4 bg-slate-950/60 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/40 rounded-2xl cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-all">
                        {chap.chapterNumber}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base group-hover:text-purple-300 transition-colors">
                          {chap.title}
                        </h4>
                        <span className="text-xs text-slate-500">แปลงจากไฟล์ PDF พร้อมอ่านต่อเนื่อง</span>
                      </div>
                    </div>
                    <span className="text-xs text-purple-400 font-medium px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all">
                      อ่านตอนนี้
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: VERTICAL SCROLL WEBTOON READER */}
        {activeTab === 'reader' && selectedChapter && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-24">
            {/* Sticky Reader Navbar */}
            <div className="sticky top-20 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
              <button 
                onClick={() => setActiveTab('detail')}
                className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ตอนทั้งหมด</span>
              </button>

              <div className="text-center">
                <h4 className="text-xs sm:text-sm font-bold truncate max-w-[180px] sm:max-w-xs">{selectedChapter.title}</h4>
                <span className="text-[10px] text-purple-400">โหมดเลื่อนอ่านลงล่าง (Vertical Scroll)</span>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    const manhwaChaps = chapters.filter(c => c.manhwaId === selectedChapter.manhwaId).sort((a,b) => a.chapterNumber - b.chapterNumber);
                    const currentIndex = manhwaChaps.findIndex(c => c.id === selectedChapter.id);
                    if (currentIndex > 0) {
                      setSelectedChapter(manhwaChaps[currentIndex - 1]);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
                  title="ตอนก่อนหน้า"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const manhwaChaps = chapters.filter(c => c.manhwaId === selectedChapter.manhwaId).sort((a,b) => a.chapterNumber - b.chapterNumber);
                    const currentIndex = manhwaChaps.findIndex(c => c.id === selectedChapter.id);
                    if (currentIndex < manhwaChaps.length - 1) {
                      setSelectedChapter(manhwaChaps[currentIndex + 1]);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
                  title="ตอนถัดไป"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rendered PDF Pages as Vertical Continuous Comic Strip */}
            <div className="flex flex-col items-center bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl p-0">
              {selectedChapter.pages && selectedChapter.pages.length > 0 ? (
                selectedChapter.pages.map((pageUrl, idx) => (
                  <img 
                    key={idx} 
                    src={pageUrl} 
                    alt={`Panel ${idx + 1}`} 
                    className="w-full h-auto block m-0 p-0 border-0 outline-none select-none"
                    loading="lazy"
                  />
                ))
              ) : (
                <div className="py-24 text-slate-500 font-medium">ไม่พบหน้าภาพสำหรับตอนนี้ กรุณาตรวจสอบการอัปโหลด</div>
              )}
            </div>

            {/* Chapter End & Comment Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="text-center py-6 border-b border-slate-800 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold">อ่านตอนนี้จนจบแล้ว!</h4>
                <p className="text-xs text-slate-400">แสดงความคิดเห็นติชมและพูดคุยกับนักอ่านคนอื่นได้ด้านล่าง</p>
              </div>

              <div className="space-y-4">
                <h5 className="font-bold text-sm flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>ความคิดเห็น ({comments.filter(c => c.chapterId === selectedChapter.id).length})</span>
                </h5>

                <form onSubmit={(e) => handleAddComment(e, selectedChapter.id)} className="flex gap-2">
                  <input 
                    name="commentText"
                    type="text" 
                    placeholder="พิมพ์ความคิดเห็นของคุณที่นี่..." 
                    className="flex-grow bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center space-x-1 shadow-lg shadow-purple-600/30"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">ส่ง</span>
                  </button>
                </form>

                <div className="space-y-3 pt-4">
                  {comments.filter(c => c.chapterId === selectedChapter.id).map(comm => (
                    <div key={comm.id} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-300">{comm.user}</span>
                        <span className="text-slate-500">{comm.createdAt}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300">{comm.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: ADMIN UPLOAD PANEL */}
        {activeTab === 'admin' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ระบบอัปโหลดไฟล์ PDF หลังบ้าน (Admin Panel)
                </h2>
                <p className="text-xs text-slate-400 mt-1">อัปโหลดไฟล์ PDF ของมังฮวา ระบบจะทำการแปลงหน้ากระดาษเป็นภาพอ่านต่อเนื่องแบบ Webtoon ทันที</p>
              </div>
              <button 
                onClick={() => setActiveTab('home')}
                className="bg-slate-800 hover:bg-slate-700 text-xs px-4 py-2 rounded-xl text-slate-300 border border-slate-700 transition-all"
              >
                ย้อนกลับ
              </button>
            </div>

            <form onSubmit={handleSaveNewChapter} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">เลือกเรื่องมังฮวา (หรือสร้างใหม่)</label>
                <select 
                  onChange={(e) => {
                    const found = manhwas.find(m => m.id === e.target.value);
                    setSelectedManhwa(found || null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="">+ สร้างเรื่องมังฮวาใหม่ (ระบุชื่อด้านล่าง)</option>
                  {manhwas.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              {!selectedManhwa && (
                <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase">ชื่อเรื่องมังฮวาใหม่</label>
                    <input 
                      type="text" 
                      required
                      placeholder="เช่น Solo Leveling" 
                      value={adminForm.title}
                      onChange={(e) => setAdminForm({...adminForm, title: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 uppercase">หมวดหมู่ (Genre)</label>
                      <select 
                        value={adminForm.genre}
                        onChange={(e) => setAdminForm({...adminForm, genre: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                      >
                        <option value="Action">Action</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Romance">Romance</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 uppercase">สถานะ</label>
                      <select 
                        value={adminForm.status}
                        onChange={(e) => setAdminForm({...adminForm, status: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                      >
                        <option value="Ongoing">กำลังอัปเดต (Ongoing)</option>
                        <option value="Completed">จบแล้ว (Completed)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase">เรื่องย่อสั้นๆ</label>
                    <textarea 
                      rows={2}
                      placeholder="รายละเอียดเนื้อเรื่องย่อ..." 
                      value={adminForm.synopsis}
                      onChange={(e) => setAdminForm({...adminForm, synopsis: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                    ></textarea>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">หมายเลขตอน (Chapter Number)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={adminForm.chapterNumber}
                    onChange={(e) => setAdminForm({...adminForm, chapterNumber: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">ชื่อตอน (Chapter Title)</label>
                  <input 
                    type="text" 
                    placeholder="เช่น ตอนที่ 1: การเริ่มต้น" 
                    value={adminForm.chapterTitle}
                    onChange={(e) => setAdminForm({...adminForm, chapterTitle: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase">เลือกไฟล์ PDF ของตอนนี้</label>
                <div className="border-2 border-dashed border-purple-500/40 bg-purple-950/20 hover:bg-purple-950/30 rounded-2xl p-6 text-center transition-all relative">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <FileText className="w-10 h-10 text-purple-400 mx-auto" />
                    <p className="text-sm font-semibold text-slate-200">
                      {adminForm.pdfFile ? `เลือกไฟล์แล้ว: ${adminForm.pdfFile}` : 'คลิกเพื่อเลือกไฟล์ PDF หรือลากวางไฟล์ที่นี่'}
                    </p>
                    <p className="text-xs text-slate-400">ระบบจะทำการแปลงหน้า PDF เป็นภาพเว็บตูนทีละหน้าให้อัตโนมัติ</p>
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-xs text-purple-400 font-semibold">
                      <span>กำลังแปลงหน้า PDF เป็นภาพ Webtoon...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {adminForm.pdfPages.length > 0 && !uploading && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center space-x-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>แปลงไฟล์ PDF เป็นภาพสำเร็จ! พร้อมแสดงผล {adminForm.pdfPages.length} หน้าเรียงต่อกัน</span>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-xl shadow-purple-600/30 transition-all disabled:opacity-50"
              >
                บันทึกและเผยแพร่ตอนนี้
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}