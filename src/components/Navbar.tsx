import React from "react";
import { 
  BookOpen, 
  ShieldCheck, 
  Server, 
  BrainCircuit, 
  FileCheck2, 
  Award, 
  Calculator, 
  Coins, 
  Moon, 
  Sun, 
  Bell, 
  Globe, 
  RefreshCw,
  Layers,
  Menu,
  X
} from "lucide-react";
import { TabType, Language } from "../types";
import { translations } from "../translations";

export interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenNotifications: () => void;
  unreadAnomaliesCount: number;
  syncStatus: "synced" | "syncing";
  onTriggerSync: () => void;
  e2eeSecuredCount: number;
  businessName?: string;
  fullName?: string;
  onOpenProfile?: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  unlockedBadgesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onSelectLanguage,
  darkMode,
  onToggleDarkMode,
  onOpenNotifications,
  unreadAnomaliesCount,
  syncStatus,
  onTriggerSync,
  e2eeSecuredCount,
  fullName = "Hj. Siti Rahmah",
  businessName = "Dapur Sambal Berkah",
  onOpenProfile,
  isMobileMenuOpen = false,
  onToggleMobileMenu,
  unlockedBadgesCount = 7,
}) => {
  const t = translations[language];

  const infraItems: Array<{ id: TabType; label: string; dotColor: string }> = [
    { id: "overview", label: language === "id" ? "Dashboard Monitor" : language === "en" ? "Dashboard Monitor" : "لوحة المراقبة", dotColor: "bg-emerald-500" },
    { id: "cloud-infra", label: language === "id" ? "Multi-Cloud CI/CD" : language === "en" ? "Multi-Cloud CI/CD" : "سحابة متعددة CI/CD", dotColor: "bg-slate-500" },
    { id: "ai-advisor", label: language === "id" ? "API & Konsultan AI" : language === "en" ? "API & AI Advisor" : "واجهة برمجة ومستشار الذكاء", dotColor: "bg-slate-500" },
  ];

  const lmsItems: Array<{ id: TabType; label: string; dotColor: string }> = [
    { id: "syllabus", label: language === "id" ? "Kurikulum UMKM (7 JP)" : language === "en" ? "MSME Curriculum (7 JP)" : "منهج المشروعات (7 ساعات)", dotColor: "bg-amber-500" },
    { id: "halal-tracker", label: language === "id" ? "Sertifikasi Halal" : language === "en" ? "Halal Certification" : "شهادة الحلال", dotColor: "bg-amber-500" },
    { id: "financing-sim", label: language === "id" ? "Fintech Syariah" : language === "en" ? "Islamic Fintech" : "التكنولوجيا المالية الإسلامية", dotColor: "bg-amber-500" },
    { id: "bankable-calc", label: language === "id" ? "Cek 5C Bankable" : language === "en" ? "5C Bankable Check" : "معيار 5C البنكي", dotColor: "bg-amber-500" },
    { id: "quiz-test", label: language === "id" ? "Ujian & Sertifikasi" : language === "en" ? "Exam & Certificate" : "الاختبار والشهادة", dotColor: "bg-amber-500" },
    { id: "learning-analytics", label: language === "id" ? "Analitik Pembelajaran" : language === "en" ? "Learning Analytics" : "تحليلات التعلم", dotColor: "bg-cyan-400" },
  ];

  const renderNavGroup = (title: string, items: typeof infraItems) => (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 px-2 font-semibold">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => {
                onSelectTab(item.id);
                if (isMobileMenuOpen && onToggleMobileMenu) {
                  onToggleMobileMenu();
                }
              }}
              className={`w-full flex items-center gap-3 p-2 rounded text-xs transition-colors text-left ${
                isActive
                  ? "bg-slate-800 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                  isActive
                    ? "bg-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                    : item.dotColor
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* High-Density Sidebar - Persistent on Desktop */}
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-[#0F1115] shrink-0 hidden lg:flex select-none">
        {/* Brand Header */}
        <div 
          className="p-5 border-b border-slate-800 cursor-pointer"
          onClick={() => onSelectTab("overview")}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm text-sm">
              TK
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-tight text-base leading-tight">
                TamanKuliner<span className="text-emerald-500">PRO</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                LMS Syariah v2.4.1
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {renderNavGroup(
            language === "id" ? "Infrastructure" : language === "en" ? "Infrastructure" : "البنية التحتية",
            infraItems
          )}
          {renderNavGroup(
            language === "id" ? "LMS Training Syariah" : language === "en" ? "LMS Training Sharia" : "تدريب الشريعة LMS",
            lmsItems
          )}
        </nav>

        {/* Bottom E2EE Encryption Widget & Profile Preview */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div 
            onClick={() => onSelectTab("cloud-infra")}
            className="bg-slate-900 rounded p-3 text-[11px] border border-slate-700/80 cursor-pointer hover:border-slate-600 transition-colors"
          >
            <div className="flex justify-between mb-1.5 items-center">
              <span className="text-slate-400 font-medium">E2EE Encryption</span>
              <span className="text-emerald-500 font-mono font-bold text-[10px]">ACTIVE</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded overflow-hidden mb-1.5">
              <div className="bg-emerald-500 w-full h-1 rounded animate-pulse" />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>AES-256-GCM</span>
              <span>{e2eeSecuredCount || 5120} Hashes</span>
            </div>
          </div>

          {/* User Quick Info */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-800/80 transition-colors"
            title="Klik untuk membuka Profil & Medali Digital"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                SR
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">{fullName}</div>
                <div className="text-[10px] text-slate-400 truncate">{businessName}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 font-bold flex items-center gap-0.5">
                <Award className="w-2.5 h-2.5 text-amber-400" />
                <span>{unlockedBadgesCount} Medali</span>
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex"
          onClick={onToggleMobileMenu}
        >
          <div 
            className="w-72 bg-[#0F1115] h-full flex flex-col border-r border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                  TK
                </div>
                <span className="font-bold text-white tracking-tight">
                  TamanKuliner<span className="text-emerald-500">PRO</span>
                </span>
              </div>
              <button
                onClick={onToggleMobileMenu}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
              {renderNavGroup("Infrastructure", infraItems)}
              {renderNavGroup("LMS Training Syariah", lmsItems)}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div 
                onClick={() => {
                  onSelectTab("cloud-infra");
                  if (onToggleMobileMenu) onToggleMobileMenu();
                }}
                className="bg-slate-900 rounded p-3 text-[11px] border border-slate-700"
              >
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">E2EE Encryption</span>
                  <span className="text-emerald-500 font-mono font-bold">ACTIVE</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded">
                  <div className="bg-emerald-500 w-full h-1 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
