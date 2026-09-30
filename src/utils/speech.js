// อ่านออกเสียงภาษาจีนด้วย Web Speech API ของเบราว์เซอร์ (รองรับ Safari บน iPad)
export function speakChinese(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}
