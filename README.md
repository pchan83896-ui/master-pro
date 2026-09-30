# HanYu Master Pro

แอปเรียนภาษาจีน HSK 1–4 (React + Vite + Tailwind) พร้อมแท็บอ่านมังฮวา (Firebase) ในโปรเจกต์เดียว

## โครงสร้างไฟล์

```
hanyu-master-pro/
├── index.html                  หน้า HTML หลัก (โหลดฟอนต์ + เรียก src/main.jsx)
├── package.json                รายการแพ็กเกจ + คำสั่ง npm
├── vite.config.js              ตั้งค่า Vite (host: true สำหรับ Codespaces)
├── tailwind.config.js / postcss.config.js
├── .env.example                ตัวอย่างค่า Firebase (คัดลอกเป็น .env)
├── .devcontainer/              ตั้งค่า Codespaces (Node 20, พอร์ต 5173)
├── public/data/                hsk1.json … hsk4.json (คำศัพท์ HSK)
└── src/
    ├── main.jsx                จุดเริ่มต้น (createRoot)
    ├── App.jsx                 เมนู + สลับแท็บ + state กลาง
    ├── index.css               Tailwind + แอนิเมชัน
    ├── components/             ชิ้นส่วนเล็ก (NavItem, StatCard, Icons ...)
    ├── views/                  แต่ละหน้า (Vocab, Flashcard, Mock test ...)
    ├── data/                   ข้อมูลตั้งต้น (.js)
    ├── utils/                  hskLoader.js (โหลด hsk), speech.js (เสียงอ่าน)
    └── manhwa/                 ManhwaApp.jsx, firebase.js, defaultManhwas.js
```

## วิธีรันใน GitHub Codespaces (iPad / Safari)

1. สร้าง repo ใหม่บน github.com → Code → Codespaces → Create codespace on main
2. ลากไฟล์ `hanyu-master-pro.zip` ไปวางในแผง Explorer ด้านซ้าย (หรือกดค้างในพื้นที่ว่าง → Upload)
3. เปิด Terminal (เมนู ☰ → Terminal → New Terminal) แล้วพิมพ์:
   ```bash
   unzip hanyu-master-pro.zip
   cp -r hanyu-master-pro/. .
   rm -rf hanyu-master-pro hanyu-master-pro.zip
   npm install
   npm run dev
   ```
4. เมื่อขึ้นข้อความ Local: http://localhost:5173 ให้เปิดแท็บ **Ports** → แตะไอคอนลูกโลกข้างพอร์ต 5173
5. หยุดเซิร์ฟเวอร์ด้วย Ctrl + C (ใน Safari บน iPad ต้องมีคีย์บอร์ดบลูทูธ)

## ตั้งค่า Firebase (เฉพาะแท็บมังฮวา)

1. ไปที่ console.firebase.google.com → สร้างโปรเจกต์ → เพิ่ม Web app → คัดลอก config
2. เปิด Authentication → Sign-in method → เปิด **Anonymous**
3. เปิด Firestore Database (Test mode ระหว่างพัฒนา)
4. `cp .env.example .env` แล้วกรอกค่าใน `.env` จากนั้นรัน `npm run dev` ใหม่

หมายเหตุ: หน้าของแต่ละตอนถูกเก็บเป็นรูป base64 ใน Firestore ซึ่งจำกัด 1 MiB ต่อเอกสาร
ตอนที่หน้าเยอะมากอาจบันทึกไม่ได้ หากใช้จริงควรย้ายรูปไปเก็บใน Firebase Storage

## คำสั่งที่ใช้บ่อย

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm run dev` | รันโหมดพัฒนา (แก้โค้ดแล้วรีเฟรชอัตโนมัติ) |
| `npm run build` | สร้างไฟล์สำหรับเผยแพร่ในโฟลเดอร์ dist |
| `npm run preview` | ทดลองเปิดไฟล์ที่ build แล้ว |

## อัปเดตข้อมูลคำศัพท์

แก้ไฟล์ใน `public/data/hsk1.json` – `hsk4.json` ได้เลย รูปแบบของแต่ละคำ:
`{ "id": "h1_001", "chinese": "爱", "pinyin": "ài", "meaning": "รัก", "example": "…", "level": "HSK 1", "mastered": false }`

## บันทึกงานขึ้น GitHub

```bash
git add .
git commit -m "first commit"
git push
```
