import * as L from 'lucide-react';

// ห่อไอคอนให้ขนาดเริ่มต้นเท่าของเดิม (w-5 h-5) — ใช้งานเหมือนเดิมทุกจุด
const make = (Icon) => ({ className = 'w-5 h-5', ...props }) => <Icon className={className} {...props} />;

export const Home = make(L.Home);
export const BookOpen = make(L.BookOpen);
export const Edit3 = make(L.Edit3);
export const BookMarked = make(L.BookMarked);
export const Headphones = make(L.Headphones);
export const Mic = make(L.Mic);
export const FileText = make(L.FileText);
export const Gamepad2 = make(L.Gamepad2);
export const Award = make(L.Award);
export const BarChart2 = make(L.BarChart2);
export const Search = make(L.Search);
export const Plus = make(L.Plus);
export const Volume2 = make(L.Volume2);
export const CheckCircle2 = make(L.CheckCircle2);
export const XCircle = make(L.XCircle);
export const RotateCw = make(L.RotateCw);
export const Flame = make(L.Flame);
export const Trophy = make(L.Trophy);
export const Sparkles = make(L.Sparkles);
export const ChevronRight = make(L.ChevronRight);
export const Clock = make(L.Clock);
export const ArrowRight = make(L.ArrowRight);
export const Check = make(L.Check);
export const Brain = make(L.Brain);
export const ShieldAlert = make(L.ShieldAlert);
export const Layers = make(L.Layers);
export const Book = make(L.Book);
export const PenTool = make(L.PenTool);
