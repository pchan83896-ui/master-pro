import React, { useState } from 'react';

export default function PortfolioView() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "โปรเจกต์คัดลายมือภาษาจีน HSK 1",
      description: "รวมภาพฝึกเขียนอักษรจีนพื้นฐานกว่า 150 ตัว พร้อมลำดับขีดที่ถูกต้อง",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      tag: "Writing"
    },
    {
      id: 2,
      title: "บันทึกคำศัพท์ HSK บทที่ 1-3",
      description: "สรุปคำศัพท์พร้อมตัวอย่างประโยคสนทนาในชีวิตประจำวัน",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
      tag: "Vocab"
    }
  ]);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageFile, setImageFile] = useState('');

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title) return;
    
    const newProj = {
      id: Date.now(),
      title,
      description: desc || "ไม่มีคำอธิบายเพิ่มเติม",
      image: imageFile || "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80",
      tag: "Custom"
    };

    setProjects([newProj, ...projects]);
    setTitle('');
    setDesc('');
    setImageFile('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">แสดงผลงานของฉัน (Portfolio)</h1>
        <p className="text-sky-100">อัปโหลดและจัดเก็บผลงานการเรียนภาษาจีนของคุณไว้ในที่เดียว</p>
      </div>

      {/* ฟอร์มเพิ่มผลงานใหม่ */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">อัปโหลดผลงานใหม่</h2>
        <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="ชื่อผลงาน / หัวข้อ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="text"
            placeholder="คำอธิบายสั้นๆ"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input
            type="text"
            placeholder="ลิงก์รูปภาพผลงาน (URL Image)"
            value={imageFile}
            onChange={(e) => setImageFile(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="md:col-span-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm"
          >
            + บันทึกและแสดงผลงาน
          </button>
        </form>
      </div>

      {/* แสดงรายการผลงานทั้งหมด */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">ผลงานทั้งหมดของฉัน</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col">
              <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1">{item.tag}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
