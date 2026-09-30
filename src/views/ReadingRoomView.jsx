import React, { useState } from 'react';

export default function ReadingRoomView() {
  // ข้อมูลบทความจำลองภายในตัว เพื่อป้องกันปัญหาหาไฟล์ข้อมูลไม่พบ
  const readings = [
    {
      title: "บทที่ 1: สวัสดี (Hello)",
      level: 1,
      content: "你好中国，我喜欢学习汉语。我的朋友也喜欢看书。"
    },
    {
      title: "บทที่ 2: ครอบครัวของฉัน (My Family)",
      level: 2,
      content: "我家里有四个人。爸爸、妈妈、哥哥和我。"
    }
  ];

  const [selectedStory, setSelectedStory] = useState(readings[0]);
  const [activeWord, setActiveWord] = useState(null);

  // พจนานุกรมตัวอย่างสำหรับคำศัพท์ในบทอ่าน
  const dict = {
    "你": { pinyin: "nǐ", meaning: "คุณ" },
    "好": { pinyin: "hǎo", meaning: "ดี" },
    "你好": { pinyin: "nǐ hǎo", meaning: "สวัสดี" },
    "中国": { pinyin: "Zhōngguó", meaning: "ประเทศจีน" },
    "我": { pinyin: "wǒ", meaning: "ฉัน" },
    "喜欢": { pinyin: "xǐhuan", meaning: "ชอบ" },
    "学习": { pinyin: "xuéxí", meaning: "เรียนรู้" },
    "汉语": { pinyin: "Hànyǔ", meaning: "ภาษาจีน" },
    "的": { pinyin: "de", meaning: "ของ" },
    "朋友": { pinyin: "péngyou", meaning: "เพื่อน" },
    "也": { pinyin: "yě", meaning: "...ก็...เหมือนกัน" },
    "看": { pinyin: "kàn", meaning: "ดู / อ่าน" },
    "书": { pinyin: "shū", meaning: "หนังสือ" },
    "家": { pinyin: "jiā", meaning: "บ้าน / ครอบครัว" },
    "里": { pinyin: "lǐ", meaning: "ข้างใน" },
    "有": { pinyin: "yǒu", meaning: "มี" },
    "四": { pinyin: "sì", meaning: "สี่" },
    "个": { pinyin: "gè", meaning: "ลักษณนาม (คน/อัน)" },
    "人": { pinyin: "rén", meaning: "คน" },
    "爸爸": { pinyin: "bàba", meaning: "พ่อ" },
    "妈妈": { pinyin: "māma", meaning: "แม่" },
    "哥哥": { pinyin: "gēge", meaning: "พี่ชาย" },
    "和": { pinyin: "hé", meaning: "และ" }
  };

  const handleWordClick = (char) => {
    const cleanWord = char.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()，。！？]/g,"");
    if (dict[cleanWord]) {
      setActiveWord({ word: cleanWord, ...dict[cleanWord] });
    } else {
      setActiveWord({ word: cleanWord, pinyin: "pinyin / คำอ่าน", meaning: "คำศัพท์ทั่วไป" });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">ห้องอ่านบทความภาษาจีน (Reading Room)</h1>
        <p className="text-emerald-100">แตะที่ตัวอักษรจีนแต่ละคำในบทความเพื่อดูพินอินและคำแปลไทยทันที</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* รายการบทความ */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">เลือกบทความ</h2>
          {readings.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedStory(item); setActiveWord(null); }}
              className={`w-full text-left p-4 rounded-xl transition-all border ${
                selectedStory.title === item.title
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
              }`}
            >
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1">ระดับ: HSK {item.level}</div>
            </button>
          ))}
        </div>

        {/* เนื้อหาบทความและกล่องแสดงผล */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{selectedStory.title}</h2>
            
            <div className="text-2xl leading-relaxed text-gray-900 tracking-wide bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6 flex flex-wrap gap-2">
              {selectedStory.content.split('').map((char, index) => (
                <span
                  key={index}
                  onClick={() => handleWordClick(char)}
                  className="cursor-pointer hover:bg-emerald-200 hover:text-emerald-900 px-1 rounded transition-colors"
                  title="แตะเพื่อดูคำแปล"
                >
                  {char}
                </span>
              ))}
            </div>

            {activeWord ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">คำศัพท์ที่เลือก</span>
                  <div className="text-3xl font-bold text-emerald-900 mt-1">{activeWord.word}</div>
                  <div className="text-emerald-700 font-medium">{activeWord.pinyin}</div>
                </div>
                <div className="text-right bg-white px-4 py-3 rounded-lg border border-emerald-100 shadow-sm">
                  <span className="text-xs text-gray-400">คำแปลภาษาไทย</span>
                  <div className="text-lg font-bold text-gray-800">{activeWord.meaning}</div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center text-gray-400">
                แตะที่ตัวอักษรจีนด้านบนเพื่อดูพินอินและคำแปลไทย
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
