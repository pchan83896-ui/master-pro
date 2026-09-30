// ตัวโหลด/แปลงไฟล์คำศัพท์ HSK (public/data/hsk1.json ... hsk4.json)
export const HSK_LEVELS = [1, 2, 3, 4];
// ลองหาไฟล์ตามลำดับนี้ (วาง index.html ไว้ข้างๆ โฟลเดอร์ hsk)
const base = import.meta.env.BASE_URL;
const hskPaths = (n) => [`${base}data/hsk${n}.json`, `${base}data/hsk${n}`, `${base}hsk${n}.json`];
// แก้ข้อมูลที่ผิดในไฟล์ต้นฉบับ (h2_772 ช่อง chinese เป็นภาษาไทย)
const DATA_FIXES = { h2_772: { chinese: '做饭' } };

export function parseHskText(text) {
  const cleaned = text
    .replace(/^\uFEFF/, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')   // ตัด comment เช่น /* STREAMING_CHUNK ... */
    .replace(/\}\s*\{/g, '},{')          // เติม comma ที่ขาดระหว่างรอยต่อชุดข้อมูล
    .replace(/,\s*\]/g, ']');            // ตัด comma ท้าย array
  const data = JSON.parse(cleaned);
  if (!Array.isArray(data)) throw new Error('รูปแบบไฟล์ต้องเป็น array ของคำศัพท์');
  return data;
}

export function normalizeVocab(raw, n) {
  return raw.filter(r => r && r.chinese).map((r, i) => {
    const w = { ...r, ...(DATA_FIXES[r.id] || {}) };
    return {
      id: w.id || `h${n}_${i + 1}`,
      chinese: String(w.chinese),
      pinyin: w.pinyin || '-',
      meaning: w.meaning || '-',
      type: w.type || '',
      example: w.example || '',
      level: `HSK ${n}`,
      status: w.status || (w.mastered ? 'mastered' : 'unlearned'),
      source: 'hsk-file'
    };
  });
}

export async function fetchHskLevel(n) {
  let lastErr = new Error('ไม่พบไฟล์');
  for (const url of hskPaths(n)) {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) { lastErr = new Error(`${url} → HTTP ${res.status}`); continue; }
      return normalizeVocab(parseHskText(await res.text()), n);
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}
