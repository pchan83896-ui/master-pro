// ข้อสอบจำลอง
export const MOCK_EXAMS_DATA = {
  'HSK 3': {
    title: 'ข้อสอบจำลอง HSK ระดับ 3',
    duration: 35,
    questions: [
      { id: 1, type: 'Listening', question: '图书馆里面很安静。 สถานที่ดังกล่าวมีลักษณะอย่างไร?', options: ['A. เสียงดังวุ่นวาย', 'B. เงียบสงบ', 'C. คนเยอะมาก', 'D. อากาศร้อน'], correct: 1, explanation: '安静 (ānjìng) แปลว่า เงียบสงบ เหมาะกับห้องสมุด' },
      { id: 2, type: 'Reading', question: 'เลือกคำเติมประโยค: "虽然工作很忙，但他______坚持锻炼。"', options: ['A. 因为', 'B. 所以', 'C. 但是', 'D. 还是 (依然/ยังคง)'], correct: 3, explanation: '虽然... 依然/还是... แสดงความต่อเนื่องถึงแม้จะเหนื่อย' }
    ]
  },
  'HSK 4': {
    title: 'ข้อสอบจำลอง HSK ระดับ 4',
    duration: 45,
    questions: [
      { id: 1, type: 'Reading', question: 'คำว่า "经验" (jīngyàn) หมายถึงข้อใด?', options: ['A. ประสบการณ์', 'B. เศรษฐกิจ', 'C. การทดลอง', 'D. ความสามารถ'], correct: 0, explanation: '经验 แปลว่า ประสบการณ์' }
    ]
  }
};
