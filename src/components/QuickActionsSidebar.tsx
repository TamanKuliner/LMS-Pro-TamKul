import React, { useState } from "react";
import { 
  Zap, 
  RefreshCw, 
  UserCheck, 
  BrainCircuit, 
  Calculator, 
  Scale, 
  FileCheck2, 
  Award, 
  Cloud, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  ChevronsRight, 
  ChevronsLeft, 
  Download, 
  FileText,
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  ExternalLink,
  Layers,
  ArrowUpRight,
  Send,
  Sun,
  Moon,
  BarChart3,
  Users
} from "lucide-react";
import { TabType, ParticipantProfile, Language } from "../types";

export interface QuickActionsSidebarProps {
  isHighDensity: boolean;
  onToggleHighDensity: () => void;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  syncStatus: "synced" | "syncing";
  onTriggerSync: () => void;
  onOpenProfile: () => void;
  onOpenCertificateModal: () => void;
  hasPassedExam: boolean;
  highestScore: number;
  profile: ParticipantProfile;
  unreadAnomaliesCount: number;
  completedModulesCount: number;
  totalModulesCount: number;
  language: Language;
  onShowToast?: (msg: string) => void;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
  onOpenPdfReport?: () => void;
  onDownloadPdf?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const QuickActionsSidebar: React.FC<QuickActionsSidebarProps> = ({
  isHighDensity,
  onToggleHighDensity,
  activeTab,
  onSelectTab,
  syncStatus,
  onTriggerSync,
  onOpenProfile,
  onOpenCertificateModal,
  hasPassedExam,
  highestScore,
  profile,
  unreadAnomaliesCount,
  completedModulesCount,
  totalModulesCount,
  language,
  onShowToast,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
  onOpenPdfReport,
  onDownloadPdf,
  darkMode = true,
  onToggleDarkMode,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Baru saja");

  if (!isHighDensity) return null;

  const handleSyncClick = () => {
    onTriggerSync();
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const handleQuickAiPrompt = (promptText: string) => {
    onSelectTab("ai-advisor");
    if (onShowToast) {
      onShowToast(`Membuka AI Syariah untuk: "${promptText}"`);
    }
  };

  const handleExportSummary = () => {
    if (onOpenPdfReport) {
      onOpenPdfReport();
      return;
    }
    if (onDownloadPdf) {
      onDownloadPdf();
      return;
    }

    const reportData = `TAMANKULINER.COM LMS PRO - RESUME PROFIL & KEMAJUAN
Peserta: ${profile.fullName}
Usaha: ${profile.businessName} (${profile.culinaryCategory})
NIB: ${profile.nibNumber || "Belum Terdaftar"}
Status Ujian: ${hasPassedExam ? `LULUS (Skor: ${highestScore}/100)` : "Dalam Proses"}
Modul Selesai: ${completedModulesCount} dari ${totalModulesCount}
Enkripsi: AES-GCM 256-bit E2EE Verified
Waktu Ekspor: ${new Date().toLocaleString("id-ID")}`;

    const blob = new Blob([reportData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `QuickResume_${profile.businessName.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast("Resume kemajuan berhasil diunduh!");
    }
  };

  // Nav shortcut items
  const shortcuts: Array<{
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }> = [
    {
      id: "ai-advisor",
      label: "AI Advisor Syariah",
      icon: <BrainCircuit className="w-4 h-4 text-emerald-400" />,
      badge: "Gemini",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      id: "bankable-calc",
      label: "Kalkulator 5C",
      icon: <Calculator className="w-4 h-4 text-blue-400" />,
      badge: "Bankable",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      id: "financing-sim",
      label: "Simulasi Pembiayaan",
      icon: <Scale className="w-4 h-4 text-amber-400" />,
      badge: "Akad",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      id: "halal-tracker",
      label: "Kesiapan Halal",
      icon: <FileCheck2 className="w-4 h-4 text-teal-400" />,
      badge: "BPJPH",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    },
    {
      id: "quiz-test",
      label: "Uji Kelulusan 7 JP",
      icon: <Award className="w-4 h-4 text-purple-400" />,
      badge: hasPassedExam ? "Lulus" : "Passing 70%",
      badgeColor: hasPassedExam
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      id: "cloud-infra",
      label: "Cloud Telemetry",
      icon: <Cloud className="w-4 h-4 text-cyan-400" />,
      badge: unreadAnomaliesCount > 0 ? "1 Anomali" : "Multi-Cloud",
      badgeColor: unreadAnomaliesCount > 0
        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
        : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
  ];

  return (
    <>
      {/* Desktop Quick Actions Sidebar */}
      <aside
        className={`border-l border-slate-800 bg-[#0F1115] flex flex-col shrink-0 transition-all duration-200 z-20 select-none ${
          isCollapsed ? "w-14" : "w-64"
        } hidden xl:flex`}
        aria-label="Quick Actions Sidebar"
      >
        {/* Top Title & Collapse Toggle */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-3 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>Quick Actions</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                    HD
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Shortcuts & Control</div>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              isCollapsed ? "mx-auto" : ""
            }`}
            title={isCollapsed ? "Buka Panel Quick Actions" : "Kecilkan Panel"}
            aria-label="Toggle Quick Actions Panel"
          >
            {isCollapsed ? (
              <ChevronsLeft className="w-4 h-4 text-emerald-400" />
            ) : (
              <ChevronsRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Collapsed Icon Bar View */}
        {isCollapsed ? (
          <div className="flex-1 flex flex-col items-center py-3 space-y-3 overflow-y-auto">
            {/* Quick Sync */}
            <button
              onClick={handleSyncClick}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                syncStatus === "syncing"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
              title={`Sinkronisasi Cloud (${syncStatus})`}
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus === "syncing" ? "animate-spin text-emerald-400" : ""}`} />
            </button>

            {/* Quick Profile */}
            <button
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-colors"
              title={`Profil: ${profile.businessName}`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Quick AI Advisor */}
            <button
              onClick={() => onSelectTab("ai-advisor")}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                activeTab === "ai-advisor"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
              title="Tanya AI Advisor Syariah"
            >
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Quick Mentor Connection */}
            <button
              onClick={() => {
                onSelectTab("overview");
                setTimeout(() => {
                  const el = document.getElementById("mentor-connection-panel");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-colors"
              title="Mentor Connection (Pakar Syariah)"
            >
              <Users className="w-4 h-4 text-emerald-400" />
            </button>

            <div className="w-6 h-px bg-slate-800 my-1" />

            {/* Navigation Shortcuts */}
            {shortcuts.map((sc) => (
              <button
                key={sc.id}
                onClick={() => onSelectTab(sc.id)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  activeTab === sc.id
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "bg-slate-900/60 border border-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
                title={sc.label}
              >
                {sc.icon}
              </button>
            ))}

            <div className="w-6 h-px bg-slate-800 my-1" />

            {/* Certificate Quick Trigger */}
            <button
              onClick={hasPassedExam ? onOpenCertificateModal : () => onSelectTab("quiz-test")}
              className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-amber-500/40 flex items-center justify-center transition-colors"
              title={hasPassedExam ? "Lihat E-Sertifikat 7 JP" : "Ikuti Ujian 7 JP"}
            >
              <Award className="w-4 h-4" />
            </button>

            {/* PDF Summary Export Trigger */}
            <button
              onClick={handleExportSummary}
              className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition-colors"
              title="Unduh Resume PDF Resmi (Profil, Halal, 7 JP)"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
            </button>

            <div className="flex-1" />

            {/* Quick Theme Toggle Icon */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-colors"
                title={darkMode ? "Beralih ke Mode Terang (Light)" : "Beralih ke Mode Gelap (Dark)"}
                aria-label="Toggle Dark/Light Mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>
            )}

            {/* Density toggle icon */}
            <button
              onClick={onToggleHighDensity}
              className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center transition-colors"
              title="High Density Mode Aktif (Klik untuk ubah)"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Expanded Full Sidebar View */
          <div className="flex-1 flex flex-col p-3 overflow-y-auto space-y-4 text-xs">
            {/* Action Card 1: Edge Syncing */}
            <div className="p-2.5 rounded-lg bg-[#16191F] border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <RefreshCw className={`w-3 h-3 ${syncStatus === "syncing" ? "animate-spin text-emerald-400" : "text-slate-400"}`} />
                  <span>Multi-Cloud Sync</span>
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                  syncStatus === "syncing"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                  {syncStatus === "syncing" ? "Syncing..." : "Live (24ms)"}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 mb-2">
                Status replikasi: <span className="text-white font-mono font-medium">{lastSyncTime}</span>
              </div>

              <button
                onClick={handleSyncClick}
                disabled={syncStatus === "syncing"}
                className="w-full py-1.5 px-2.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                <span>{syncStatus === "syncing" ? "Menyinkronkan..." : "Sinkronkan Sekarang"}</span>
              </button>
            </div>

            {/* Action Card 2: Profile Management */}
            <div className="p-2.5 rounded-lg bg-[#16191F] border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>Profil & Legalitas</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Terverifikasi
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2 bg-slate-900/70 p-2 rounded-md border border-slate-800/80">
                <div className="w-8 h-8 rounded-md bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                  {profile.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{profile.businessName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{profile.fullName}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                <span>NIB: {profile.hasNIB ? profile.nibNumber : "Belum Ada"}</span>
                <span className="text-emerald-400">OSS RBA ✓</span>
              </div>

              <button
                onClick={onOpenProfile}
                className="w-full py-1.5 px-2.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>Kelola Profil Usaha</span>
              </button>
            </div>

            {/* Action Card 3: AI Advisor Shortcuts */}
            <div className="p-2.5 rounded-lg bg-[#16191F] border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BrainCircuit className="w-3 h-3 text-emerald-400" />
                  <span>Konsultan AI Syariah</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Gemini 2.5
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-2">
                Akses cepat konsultasi fiqih muamalah, 5C, & halal:
              </p>

              <div className="space-y-1.5 mb-2.5">
                {[
                  "Simulasi Margin Murabahah",
                  "Syarat Sertifikat Halal BPJPH",
                  "Hitung Skor 5C Bankable",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAiPrompt(prompt)}
                    className="w-full text-left px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-[11px] text-slate-300 hover:text-emerald-400 flex items-center justify-between transition-colors group"
                  >
                    <span className="truncate">{prompt}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => onSelectTab("ai-advisor")}
                className="w-full py-1.5 px-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Buka Chat Konsultasi</span>
              </button>
            </div>

            {/* Action Card 3.5: Mentor Connection Panel Shortcut */}
            <div className="p-2.5 rounded-lg bg-[#16191F] border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>Mentor Syariah</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  1-on-1 Sesi
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-2">
                Pakar Muamalah & Kurasi: <span className="text-slate-200 font-medium">{profile.culinaryCategory}</span>
              </p>

              <button
                onClick={() => {
                  onSelectTab("overview");
                  setTimeout(() => {
                    const el = document.getElementById("mentor-connection-panel");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="w-full py-1.5 px-2.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Users className="w-3 h-3" />
                <span>Lihat Rekomendasi Mentor</span>
              </button>
            </div>

            {/* Quick Navigation Deck */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-1.5">
                Navigasi Cepat
              </div>
              <div className="space-y-1">
                {shortcuts.map((sc) => {
                  const isActive = activeTab === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => onSelectTab(sc.id)}
                      className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                        isActive
                          ? "bg-slate-800 text-white border border-slate-700 font-medium"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {sc.icon}
                        <span className="truncate">{sc.label}</span>
                      </div>
                      {sc.badge && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono shrink-0 ${sc.badgeColor}`}>
                          {sc.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Progress & Certificate */}
            <div className="p-2.5 rounded-lg bg-[#16191F] border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Sertifikasi 7 JP</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {Math.round((completedModulesCount / totalModulesCount) * 100)}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${(completedModulesCount / totalModulesCount) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                <span>{completedModulesCount}/{totalModulesCount} Modul Selesai</span>
                <span className="font-mono text-white">{hasPassedExam ? "Lulus 7 JP" : "Passing 70"}</span>
              </div>

              {hasPassedExam ? (
                <button
                  onClick={onOpenCertificateModal}
                  className="w-full py-1.5 px-2.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Award className="w-3 h-3" />
                  <span>Lihat E-Sertifikat</span>
                </button>
              ) : (
                <button
                  onClick={() => onSelectTab("quiz-test")}
                  className="w-full py-1.5 px-2.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Ikuti Ujian Kelulusan</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={() => onSelectTab("learning-analytics")}
                className={`w-full py-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-1.5 ${
                  activeTab === "learning-analytics"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <BarChart3 className="w-3 h-3 text-cyan-400" />
                <span>Analitik & Grafik Skor</span>
              </button>
            </div>

            <div className="flex-1" />

            {/* Bottom Utility Deck */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={handleExportSummary}
                className="w-full py-2 px-2.5 rounded-md bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                title="Unduh ringkasan PDF resmi profil usaha, kesiapan halal, dan kurikulum 7 JP"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unduh Ringkasan PDF (7 JP & Halal)</span>
              </button>

              {/* Theme and Density controls */}
              <div className="flex items-center justify-between px-1 text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                {onToggleDarkMode ? (
                  <button
                    onClick={onToggleDarkMode}
                    className="hover:text-emerald-400 transition-colors font-mono flex items-center gap-1.5"
                    title={darkMode ? "Beralih ke Mode Terang (Light)" : "Beralih ke Mode Gelap (Dark)"}
                  >
                    {darkMode ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                    <span>{darkMode ? "Mode: Gelap" : "Mode: Terang"}</span>
                  </button>
                ) : (
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>E2EE 256-bit</span>
                  </span>
                )}
                <button
                  onClick={onToggleHighDensity}
                  className="hover:text-emerald-400 transition-colors font-mono flex items-center gap-1"
                  title="Beralih mode densitas"
                >
                  <Layers className="w-3 h-3" />
                  <span>High Density</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Slide-over Drawer (for screens < xl) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobileDrawer}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-full bg-[#0F1115] border-l border-slate-800 h-full flex flex-col z-10 shadow-2xl overflow-y-auto p-4 space-y-4 text-xs">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  Quick Actions
                </span>
              </div>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1 rounded text-slate-400 hover:text-white"
                aria-label="Tutup menu"
              >
                ✕
              </button>
            </div>

            {/* Mobile Actions Body */}
            {/* Sync */}
            <div className="p-2.5 rounded-lg bg-[#16191F] border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Sync Multi-Cloud</span>
                <span className="text-[9px] text-emerald-400 font-mono">Live</span>
              </div>
              <button
                onClick={() => {
                  handleSyncClick();
                  if (onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className="w-full py-1.5 rounded bg-slate-900 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                <span>Sinkronkan Sekarang</span>
              </button>
            </div>

            {/* Profile */}
            <div className="p-2.5 rounded-lg bg-[#16191F] border border-slate-800">
              <div className="text-xs font-bold text-white mb-1 truncate">{profile.businessName}</div>
              <button
                onClick={() => {
                  onOpenProfile();
                  if (onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className="w-full py-1.5 rounded bg-slate-900 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>Kelola Profil Usaha</span>
              </button>
            </div>

            {/* AI Advisor */}
            <div className="p-2.5 rounded-lg bg-[#16191F] border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">AI Syariah Advisor</div>
              <button
                onClick={() => {
                  onSelectTab("ai-advisor");
                  if (onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className="w-full py-1.5 rounded bg-emerald-600 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Buka Chat Konsultasi</span>
              </button>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Pintasan Fitur</div>
              {shortcuts.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    onSelectTab(sc.id);
                    if (onCloseMobileDrawer) onCloseMobileDrawer();
                  }}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {sc.icon}
                    <span>{sc.label}</span>
                  </div>
                  {sc.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${sc.badgeColor}`}>
                      {sc.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Export Summary PDF */}
            <button
              onClick={() => {
                handleExportSummary();
                if (onCloseMobileDrawer) onCloseMobileDrawer();
              }}
              className="w-full py-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unduh Dokumen PDF Ringkasan Progres</span>
            </button>

            {/* Theme Toggle in Mobile Drawer */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="w-full py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                <span>{darkMode ? "Beralih ke Mode Terang (Light)" : "Beralih ke Mode Gelap (Dark)"}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
