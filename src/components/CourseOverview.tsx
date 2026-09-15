import React, { useState, useMemo } from "react";
import { 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Shield, 
  Briefcase, 
  Sparkles, 
  FileText, 
  Layers, 
  Lock, 
  Key,
  BadgeCheck,
  AlertTriangle,
  Server,
  Cloud,
  Check,
  Award,
  Trophy,
  Zap,
  ShieldCheck,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Clock
} from "lucide-react";
import { participantRequirements, syllabusModules } from "../data/syllabusData";
import { ParticipantProfile, Language, TabType, QuizAttempt } from "../types";
import { translations } from "../translations";
import { computeSHA256Hash } from "../utils/crypto";
import { LearningPathRoadmap } from "./LearningPathRoadmap";
import { evaluateUserBadges } from "../data/badgesData";
import { SuggestedLearningSchedule } from "./SuggestedLearningSchedule";
import { MentorConnectionPanel } from "./MentorConnectionPanel";

export interface CourseOverviewProps {
  language: Language;
  onNavigateTab: (tab: TabType) => void;
  profile: ParticipantProfile;
  onUpdateProfile?: (profile: ParticipantProfile) => void;
  completedModulesCount?: number;
  completedModuleIds?: string[];
  onOpenCertificate?: () => void;
  hasPassedExam?: boolean;
  businessName?: string;
  onOpenPdfReport?: () => void;
  onDownloadPdf?: () => void;
  onToggleModuleCompletion?: (moduleId: string) => void;
  onSelectModule?: (moduleId: string) => void;
  onResetModules?: () => void;
  onCompleteAllModules?: () => void;
  onOpenProfile?: () => void;
  quizAttempts?: QuizAttempt[];
  highestScore?: number;
  onShowToast?: (msg: string) => void;
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({
  language,
  onNavigateTab,
  profile,
  onUpdateProfile,
  completedModulesCount = 1,
  completedModuleIds = ["modul-1"],
  onOpenCertificate,
  hasPassedExam = false,
  businessName,
  onOpenPdfReport,
  onDownloadPdf,
  onToggleModuleCompletion,
  onSelectModule,
  onResetModules,
  onCompleteAllModules,
  onOpenProfile,
  quizAttempts = [],
  highestScore = 91,
  onShowToast,
}) => {
  const t = translations[language];
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [verificationHash, setVerificationHash] = useState("");
  const [activeRegion, setActiveRegion] = useState<string>("AWS-SIN-01");
  const [isAutoScaling, setIsAutoScaling] = useState(false);

  const handleSimulateDownload = () => {
    const syllabusText = `========================================================
SILABUS RESMI PELATIHAN DIGITALISASI UMKM BERBASIS SYARIAH (7 JP)
PLATFORM LMS PRO TAMANKULINER.COM
========================================================

Level: Pelatihan Level Menengah
Alur Seleksi: Test Substansi - Administrasi
Target Peserta: Pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) Kuliner

MODUL 1 (1 JP):
- Prinsip dan Etika Bisnis Islam pada Usaha Terdigitalisasi
- Kriteria UMKM Bankable (5C: Character, Capacity, Capital, Collateral, Condition)
- Akad-Akad Muamalah Digital (Bai', Wakalah, Mudharabah, Musyarakah)

MODUL 2 (2 JP):
- Akuntansi Digital dan Fintech Syariah
- Pembukuan & Laporan Keuangan Berbasis Syariah (Pengakuan Pendapatan, Zakat Perniagaan)
- Pembiayaan Berbasis Syariah (Murabahah, Mudarabah, Musyarakah, Ijarah, Istishna)
- Aplikasi Pembiayaan Digital & Integrasi Fintech OJK

MODUL 3 (2 JP):
- Pemasaran Digital Berbasis Syariah
- Etika Promosi Digital Amanah & Larangan Gharar / Overclaim
- Pemanfaatan Platform Digital Kuliner (GoFood, GrabFood, ShopeeFood)
- Content Marketing Kuliner Halal & Storytelling Nilai Thayyib

MODUL 4 (2 JP):
- Persiapan Sertifikasi Halal BPJPH
- Regulasi Kewajiban Halal (UU No. 33 Tahun 2014 & Perppu No. 2/2022)
- Kriteria Sistem Jaminan Produk Halal (SJPH): Bahan, Proses, Penyimpanan
- Alur Pendaftaran SIHALAL (ptsp.halal.go.id)

Platform: https://TamanKuliner.com LMS Pro
Infrastruktur: Multi-Cloud Automated CI/CD & E2EE Cryptography Verified
========================================================`;

    const blob = new Blob([syllabusText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Silabus_Digitalisasi_UMKM_Syariah_TamanKuliner_7JP.txt";
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleVerifyKTP = async () => {
    const rawData = `${profile.fullName}|${profile.businessName}|${profile.email}|${profile.phone}`;
    const hash = await computeSHA256Hash(rawData);
    setVerificationHash(hash.substring(0, 16).toUpperCase());
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        isVerified: true,
      });
    }
  };

  const handleTriggerScale = () => {
    setIsAutoScaling(true);
    setTimeout(() => setIsAutoScaling(false), 2000);
  };

  const effectiveCompletedCount = completedModuleIds.length || completedModulesCount;

  // Calculate completed Jam Pelajaran (JP) based on syllabus modules
  const completedJP = useMemo(() => {
    return syllabusModules
      .filter((m) => completedModuleIds.includes(m.id))
      .reduce((acc, m) => acc + m.jp, 0);
  }, [completedModuleIds]);

  // Target learning goal from profile (defaults to 7 JP)
  const targetGoalJP = typeof profile.monthlyLearningGoalJP === "number" && profile.monthlyLearningGoalJP > 0
    ? profile.monthlyLearningGoalJP
    : 7;

  // Progress percentage towards monthly goal completion
  const goalProgressPercentage = Math.min(100, Math.round((completedJP / targetGoalJP) * 100));
  const isGoalAchieved = completedJP >= targetGoalJP;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-300">
      {/* 1. HIGH DENSITY REAL-TIME TELEMETRY & PIPELINE MONITOR GRID */}
      <section className="grid grid-cols-12 gap-4">
        {/* Left Column (8 cols on desktop): Stats & CI/CD Pipeline */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-xl">
              <div className="text-xs text-slate-500 mb-1">Active Learners (Real-time)</div>
              <div className="text-2xl font-bold text-white mb-2">1,284</div>
              <div className="flex items-end h-8 gap-0.5">
                <div className="bg-emerald-500/40 w-full h-[40%] rounded-t-sm" />
                <div className="bg-emerald-500/40 w-full h-[60%] rounded-t-sm" />
                <div className="bg-emerald-500/40 w-full h-[55%] rounded-t-sm" />
                <div className="bg-emerald-500/40 w-full h-[80%] rounded-t-sm" />
                <div className="bg-emerald-500/40 w-full h-[95%] rounded-t-sm" />
                <div className="bg-emerald-500 w-full h-[70%] rounded-t-sm" />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-xl">
              <div className="text-xs text-slate-500 mb-1">Sync Reliability</div>
              <div className="text-2xl font-bold text-white mb-2">
                99.98<span className="text-sm text-slate-500">%</span>
              </div>
              <div className="text-[10px] text-emerald-500 flex items-center gap-1 font-mono">
                +0.02% (Edge Sync Optimized)
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-xl">
              <div className="text-xs text-slate-500 mb-1">Halal Certification Progress</div>
              <div className="text-2xl font-bold text-white mb-2">
                412 <span className="text-sm text-slate-500 font-normal">UMKM</span>
              </div>
              <div className="text-[10px] text-amber-500 flex items-center gap-1 font-medium">
                82 Pending Review
              </div>
            </div>
          </div>

          {/* Infrastructure CI/CD Pipeline Card */}
          <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Infrastructure CI/CD Pipeline
                </h3>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setActiveRegion("AWS-SIN-01")}
                    className={`px-3 py-1 rounded text-[10px] transition-colors ${
                      activeRegion === "AWS-SIN-01"
                        ? "bg-slate-700 text-white font-semibold"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    AWS-SIN-01
                  </button>
                  <button
                    onClick={() => setActiveRegion("GCP-ID-02")}
                    className={`px-3 py-1 rounded text-[10px] transition-colors ${
                      activeRegion === "GCP-ID-02"
                        ? "bg-slate-700 text-white font-semibold"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    GCP-ID-02
                  </button>
                  <button
                    onClick={handleTriggerScale}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-[10px] rounded text-white font-semibold transition-colors"
                  >
                    {isAutoScaling ? "Scaling..." : "Scale Auto"}
                  </button>
                </div>
              </div>

              {/* 4 Pipeline Stages */}
              <div className="relative flex items-center justify-center border-t border-slate-800 pt-6 pb-2">
                <div className="grid grid-cols-4 w-full gap-4 sm:gap-8">
                  {/* Stage 1 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 text-sm font-bold">
                      ✓
                    </div>
                    <div className="text-[10px] text-slate-400 text-center font-medium">Source Build</div>
                  </div>

                  {/* Stage 2 */}
                  <div className="flex flex-col items-center gap-2 relative">
                    <div className="absolute -left-1/2 top-5 sm:top-6 h-px w-full bg-emerald-500" />
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-emerald-500 bg-[#16191F] relative z-10 flex items-center justify-center text-emerald-500 text-sm font-bold">
                      ✓
                    </div>
                    <div className="text-[10px] text-slate-400 text-center font-medium">E2EE Audit</div>
                  </div>

                  {/* Stage 3 */}
                  <div className="flex flex-col items-center gap-2 relative">
                    <div className="absolute -left-1/2 top-5 sm:top-6 h-px w-full bg-emerald-500" />
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500 bg-[#16191F] relative z-10 flex items-center justify-center text-blue-400 text-xs font-bold animate-pulse">
                      ...
                    </div>
                    <div className="text-[10px] text-slate-400 text-center font-medium">Multi-Cloud Dist</div>
                  </div>

                  {/* Stage 4 */}
                  <div className="flex flex-col items-center gap-2 relative">
                    <div className="absolute -left-1/2 top-5 sm:top-6 h-px w-full bg-slate-700" />
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-slate-700 bg-[#16191F] relative z-10 flex items-center justify-center text-slate-600 text-sm">
                      -
                    </div>
                    <div className="text-[10px] text-slate-500 text-center font-medium">Edge Deploy</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Log Box */}
            <div className="mt-4 p-3 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-400 border border-slate-800 space-y-1">
              <div>[LOG] 14:22:11 AUTO-SCALE: Spawned worker_node_882 (GCP_JKT_REGION)</div>
              <div>[LOG] 14:22:15 SECURITY: Sharia-Fintech API handshake completed via End-to-End Tunnel.</div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on desktop): Anomaly Alerts & Health Index */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Anomaly & Real-time Alerts
              </h3>
              <div className="space-y-2.5">
                <div className="flex gap-3 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-base shrink-0">⚠️</div>
                  <div>
                    <div className="text-xs text-red-400 font-bold">High Latency Detected</div>
                    <div className="text-[10px] text-slate-400">DB Sync delay in region: AP-SOUTHEAST-1</div>
                  </div>
                </div>

                <div className="flex gap-3 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-base shrink-0">ℹ️</div>
                  <div>
                    <div className="text-xs text-blue-400 font-bold">New Curriculum Deployment</div>
                    <div className="text-[10px] text-slate-400">Module: 'Prinsip Akad Syariah v2' live.</div>
                  </div>
                </div>

                <div className="flex gap-3 p-2.5 bg-slate-800/50 border border-slate-700/80 rounded-lg opacity-90">
                  <div className="text-base shrink-0">🛡️</div>
                  <div>
                    <div className="text-xs text-slate-300 font-bold">Security Audit Complete</div>
                    <div className="text-[10px] text-slate-500">Zero vulnerabilities found in 2.4k objects.</div>
                  </div>
                </div>

                <div className="flex gap-3 p-2.5 bg-slate-800/50 border border-slate-700/80 rounded-lg opacity-75">
                  <div className="text-base shrink-0">👤</div>
                  <div>
                    <div className="text-xs text-slate-300 font-bold">Multi-Cloud Sync</div>
                    <div className="text-[10px] text-slate-500">User data mirrored across 3 clouds.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Index Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="text-[10px] text-slate-500 mb-2">UMKM Training Health Index</div>
              <div className="flex gap-1 mb-2">
                <div className="flex-1 h-1.5 bg-emerald-500 rounded-full" />
                <div className="flex-1 h-1.5 bg-emerald-500 rounded-full" />
                <div className="flex-1 h-1.5 bg-emerald-500 rounded-full" />
                <div className="flex-1 h-1.5 bg-emerald-500 rounded-full" />
                <div className="flex-1 h-1.5 bg-amber-500/30 rounded-full" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-emerald-500 font-mono">84% BANKABLE READY</span>
                <span className="text-slate-500">Goal: 95%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAM HERO BANNER */}
      <div className="relative overflow-hidden rounded-xl bg-[#16191F] text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kurikulum Resmi 7 JP • Level Menengah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Pelatihan Digitalisasi UMKM Berbasis Syariah
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Program akselerasi komprehensif bagi pelaku usaha kuliner untuk menguasai mindset kewirausahaan terdigitalisasi, tata kelola keuangan syariah, strategi pemasaran amanah anti-overclaim, dan persiapan mandatori Sertifikasi Halal BPJPH (UU No. 33/2014) agar naik kelas dari <span className="text-emerald-400 font-semibold">unbankable</span> menjadi <span className="text-emerald-400 font-semibold">bankable</span>.
          </p>

          {/* Action Row */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              id="btn-start-course"
              onClick={() => onNavigateTab("syllabus")}
              className="px-4 py-2 rounded-lg font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <span>{t.startCourse}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-download-syllabus"
              onClick={handleSimulateDownload}
              className="px-4 py-2 rounded-lg font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? "Silabus Terunduh!" : t.downloadSyllabus}</span>
            </button>

            <button
              id="btn-goto-5c"
              onClick={() => onNavigateTab("bankable-calc")}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 transition-all"
            >
              Cek Skor 5C Bankable UMKM
            </button>

            <button
              id="btn-goto-schedule"
              onClick={() => {
                const el = document.getElementById("suggested-learning-schedule");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Hitung dan atur rencana jadwal belajar 7 JP harian"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Jadwal Belajar (7 JP)</span>
            </button>

            <button
              id="btn-goto-mentor-connection"
              onClick={() => {
                const el = document.getElementById("mentor-connection-panel");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Konsultasi 1-on-1 bersama Pakar Bisnis Syariah terverifikasi sesuai kategori kuliner"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Mentor Connection</span>
            </button>

            <button
              id="btn-goto-monthly-goal"
              onClick={() => {
                const el = document.getElementById("monthly-learning-goal-overview");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Target Belajar Bulanan & Progres Capaian"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Target Bulanan ({goalProgressPercentage}%)</span>
            </button>

            {(onOpenPdfReport || onDownloadPdf) && (
              <button
                id="btn-download-pdf-summary"
                onClick={onOpenPdfReport || onDownloadPdf}
                className="px-4 py-2 rounded-lg font-semibold text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center space-x-1.5 shadow-sm"
                title="Unduh Laporan Resmi Ringkasan Profil Usaha, Kesiapan Halal, dan 7 JP (Format PDF atau Excel)"
              >
                <FileText className="w-4 h-4" />
                <span>Unduh Laporan Progres (PDF / Excel)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2.4 MONTHLY LEARNING GOAL PROGRESS BAR (TARGET BELAJAR BULANAN) */}
      <section 
        id="monthly-learning-goal-overview" 
        className="bg-gradient-to-r from-[#16191F] via-[#141820] to-[#16191F] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-10" />

        <div className="relative z-10 space-y-4">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Target Belajar Bulanan (Monthly Learning Goal)
                  </h2>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${
                    isGoalAchieved
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : goalProgressPercentage >= 50
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{goalProgressPercentage}% Tercapai</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Periode: <span className="text-slate-200 font-medium">{profile.monthlyGoalMonth || "September 2026"}</span> • Fokus: <span className="text-emerald-400/90 font-medium">{profile.monthlyGoalFocus || "Penguasaan 4 Modul Kurikulum & Kesiapan Bankable 5C"}</span>
                </p>
              </div>
            </div>

            {/* Quick Action to adjust goal */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {onOpenProfile && (
                <button
                  type="button"
                  id="btn-adjust-learning-goal"
                  onClick={onOpenProfile}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-1.5 shadow-sm"
                  title="Sesuaikan target jam pelajaran dan periode di profil"
                >
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ubah Target di Profil</span>
                </button>
              )}
              <button
                type="button"
                id="btn-resume-goal-learning"
                onClick={() => onNavigateTab("syllabus")}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1 shadow-sm"
              >
                <span>Lanjut Belajar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Progress Bar Container */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Realisasi Akumulasi Belajar:</span>
                <span className="font-bold text-white font-mono bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                  {completedJP} JP
                </span>
                <span className="text-slate-500">dari sasaran bulanan</span>
                <span className="font-bold text-emerald-400 font-mono bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                  {targetGoalJP} JP
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs sm:text-sm">
                <span className={isGoalAchieved ? "text-emerald-400" : "text-sky-400"}>
                  {goalProgressPercentage}%
                </span>
                <span className="text-slate-500 text-xs font-normal">
                  ({completedJP >= targetGoalJP ? "Target Terlampaui" : `Sisa ${targetGoalJP - completedJP} JP`})
                </span>
              </div>
            </div>

            {/* High-density Interactive Progress Track */}
            <div className="relative w-full bg-slate-900/90 h-4 sm:h-5 rounded-xl overflow-hidden border border-slate-800 p-0.5 shadow-inner">
              {/* Animated / Gradient Fill Bar */}
              <div
                className={`h-full rounded-lg transition-all duration-700 ease-out relative ${
                  isGoalAchieved
                    ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300"
                    : goalProgressPercentage >= 50
                    ? "bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-400"
                    : "bg-gradient-to-r from-amber-500 to-emerald-500"
                }`}
                style={{ width: `${Math.max(4, goalProgressPercentage)}%` }}
              >
                {/* Subtle light stripe decoration */}
                <div className="absolute inset-0 bg-white/10 opacity-40 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:16px_16px]" />
              </div>

              {/* Benchmark Notch Markers (25%, 50%, 75%) */}
              <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
                <div className="w-[1px] h-full bg-slate-700/50" style={{ left: "25%", position: "absolute" }} />
                <div className="w-[1px] h-full bg-slate-700/50" style={{ left: "50%", position: "absolute" }} />
                <div className="w-[1px] h-full bg-slate-700/50" style={{ left: "75%", position: "absolute" }} />
              </div>
            </div>

            {/* Milestone labels below progress bar */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span>0 JP (Mulai)</span>
              </span>
              <span className="hidden sm:inline-block">25% (Dasar Muamalah)</span>
              <span className="hidden sm:inline-block">50% (Fintek & Akad)</span>
              <span className="hidden sm:inline-block">75% (Digital Halal)</span>
              <span className="flex items-center gap-1 font-bold text-emerald-400">
                <span className={`w-1.5 h-1.5 rounded-full ${isGoalAchieved ? "bg-emerald-400" : "bg-slate-600"}`} />
                <span>Target: {targetGoalJP} JP</span>
              </span>
            </div>
          </div>

          {/* 4 Summary Stat Mini Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Target Bulanan</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {targetGoalJP} JP / Bulan
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {profile.monthlyGoalMonth || "September 2026"}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Realisasi Selesai</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                {completedJP} JP ({effectiveCompletedCount}/4 Modul)
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {completedJP === 7 ? "Kurikulum 100% tuntas" : `${7 - completedJP} JP silabus tersisa`}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Sisa Sasaran Bulan Ini</div>
              <div className={`text-sm font-bold font-mono mt-0.5 ${isGoalAchieved ? "text-emerald-400" : "text-amber-400"}`}>
                {isGoalAchieved ? "✓ Target Terpenuhi!" : `${targetGoalJP - completedJP} JP Lagi`}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {isGoalAchieved ? "Mabruk! Siap Evaluasi Capstone" : "Lanjutkan modul silabus"}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Status Kesiapan 5C</div>
              <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">
                {effectiveCompletedCount >= 4 ? "Bankable Ready A+" : effectiveCompletedCount >= 2 ? "Bankable In-Progress" : "Initial Foundation"}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {effectiveCompletedCount >= 4 ? "Skor 5C Maksimal Terverifikasi" : "Tuntaskan modul untuk rating 5C"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 VISUAL & INTERACTIVE LEARNING PATH ROADMAP */}
      <LearningPathRoadmap
        language={language}
        completedModuleIds={completedModuleIds}
        onToggleModuleCompletion={onToggleModuleCompletion}
        onNavigateTab={onNavigateTab}
        onSelectModule={onSelectModule}
        hasPassedExam={hasPassedExam}
        businessName={businessName || profile.businessName}
        onOpenCertificate={onOpenCertificate}
        onResetModules={onResetModules}
        onCompleteAllModules={onCompleteAllModules}
      />

      {/* 2.55 SUGGESTED LEARNING SCHEDULE (RECOMMENDED DAILY STUDY PLAN 7 JP) */}
      <SuggestedLearningSchedule
        completedModuleIds={completedModuleIds}
        onSelectModule={onSelectModule}
        onNavigateTab={onNavigateTab}
        businessName={businessName || profile.businessName}
        onShowToast={onShowToast}
      />

      {/* 2.56 MENTOR CONNECTION PANEL (VERIFIED SYARIAH BUSINESS EXPERT MATCHING) */}
      <MentorConnectionPanel
        profile={profile}
        completedModulesCount={effectiveCompletedCount}
        completedModuleIds={completedModuleIds}
        hasPassedExam={hasPassedExam}
        highestScore={highestScore}
        onNavigateTab={onNavigateTab}
        onShowToast={onShowToast}
      />

      {/* 2.6 PRESTASI & MEDALI DIGITAL PESERTA (DIGITAL BADGES SYSTEM) */}
      {(() => {
        const userBadges = evaluateUserBadges({
          completedModuleIds,
          quizAttempts,
          highestScore,
          hasPassedExam,
          profile,
        });
        const unlockedCount = userBadges.filter((b) => b.isUnlocked).length;

        return (
          <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white">
                      Medali Prestasi Digital (Digital Badges)
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold font-mono">
                      {unlockedCount} / {userBadges.length} Diraih
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sistem medali kompetensi berbasis modul kurikulum 7 JP, ujian substansi, dan kepatuhan syariah
                  </p>
                </div>
              </div>

              {onOpenProfile && (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Lihat Koleksi Lengkap</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Badges Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {userBadges.slice(0, 4).map((badge) => (
                <div
                  key={badge.id}
                  onClick={onOpenProfile}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    badge.isUnlocked
                      ? "bg-slate-900/80 border-amber-500/30 hover:border-amber-400/60 text-slate-200 shadow-xs"
                      : "bg-slate-900/40 border-slate-800/80 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-xs ${
                        badge.isUnlocked
                          ? badge.tier === "platinum"
                            ? "bg-gradient-to-br from-emerald-400 to-teal-700 text-slate-950 border-emerald-300"
                            : "bg-gradient-to-br from-yellow-300 to-amber-600 text-slate-950 border-yellow-200"
                          : "bg-slate-800 text-slate-500 border-slate-700"
                      }`}
                    >
                      {badge.iconName === "zap" ? (
                        <Zap className="w-4 h-4" />
                      ) : badge.iconName === "shield-check" ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : badge.iconName === "trophy" ? (
                        <Trophy className="w-4 h-4" />
                      ) : (
                        <Award className="w-4 h-4" />
                      )}
                    </div>
                    {badge.isUnlocked ? (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[8px] font-bold border border-slate-900">
                        ✓
                      </div>
                    ) : (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[8px] border border-slate-700">
                        🔒
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-white truncate">
                        {badge.name}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                        +{badge.points}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {badge.isUnlocked ? (
                        <span className="text-emerald-400 font-medium">Terbuka • {badge.unlockedAt}</span>
                      ) : (
                        <span>{badge.progress.percentage}% • {badge.progress.current}/{badge.progress.max} Selesai</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 3. TARGET PESERTA & CAPAIAN KOMPETENSI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Expected Learning Outcomes */}
        <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 pb-2 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Kompetensi & Capaian Peserta
              </h2>
              <p className="text-[11px] text-slate-500">
                Target terukur setelah menuntaskan kurikulum 7 Jam Pelajaran (JP)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Prinsip & Etika Bisnis Islam",
                desc: "Memahami akad muamalah (Bai', Wakalah, Mudharabah, Musyarakah) dan pencegahan riba, gharar, maysir pada ekosistem digital.",
              },
              {
                title: "Pembukuan & Fintech Syariah",
                desc: "Memahami pencatatan arus kas syariah, pengakuan pendapatan sah, simulasi margin Murabahah, dan integrasi fintech berizin OJK.",
              },
              {
                title: "Pemasaran Digital Amanah & Anti-Overclaim",
                desc: "Menerapkan pemasaran jujur, testimoni riil tanpa rekayasa buzzer, dan strategi visual kuliner halal & thayyib.",
              },
              {
                title: "Kesiapan Sertifikasi Halal Mandatori",
                desc: "Menguasai 11 kriteria SJPH BPJPH, verifikasi bahan baku kritis, dokumen penyelia halal, dan portal SIHALAL.",
              },
            ].map((comp, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">{comp.title}</span>:{" "}
                  <span className="text-slate-400">{comp.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Persyaratan Peserta & Alur Seleksi */}
        <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-3 pb-2 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  Persyaratan Peserta & Alur Seleksi
                </h2>
                <p className="text-[11px] text-slate-500">
                  Tahapan Test Substansi & Test Administrasi
                </p>
              </div>
            </div>

            {/* Selection Flow Pills */}
            <div className="grid grid-cols-2 gap-3 my-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Tahap 1
                </span>
                <span className="text-xs font-bold text-white">
                  Test Substansi
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  10 Soal evaluasi fiqih muamalah, akad, 5C & sertifikasi halal
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  Tahap 2
                </span>
                <span className="text-xs font-bold text-white">
                  Test Administrasi
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Verifikasi KTP WNI, NIB usaha kuliner & portofolio toko online
                </p>
              </div>
            </div>

            {/* Checklist of Requirements */}
            <div className="space-y-2">
              {participantRequirements.map((req) => (
                <div key={req.id} className="flex items-start space-x-2 text-xs text-slate-300">
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 mt-0.5 ${
                    req.mandatory 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {req.mandatory ? "Wajib" : "Diutamakan"}
                  </span>
                  <div>
                    <span className="font-semibold text-white">{req.title}</span>:{" "}
                    <span className="text-slate-400">{req.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Box */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Verifikasi Administrasi (E2EE)
                </p>
                <p className="text-[10px] text-slate-500">
                  {profile.isVerified ? `Terverifikasi Hash: ${verificationHash || "TK-SYARIAH-VERIFIED"}` : "Data terenkripsi end-to-end"}
                </p>
              </div>
            </div>

            <button
              onClick={handleVerifyKTP}
              className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                profile.isVerified
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {profile.isVerified ? "✓ Terverifikasi" : "Verifikasi Data"}
            </button>
          </div>
        </div>
      </div>

      {/* 4. SILABUS PEMBELAJARAN 4 MODUL TERSTRUKTUR */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">
              Struktur Silabus Pembelajaran (7 JP)
            </h2>
            <p className="text-xs text-slate-500">
              4 Modul Terstruktur dengan studi kasus nyata kuliner & perangkat interaktif
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
            <span>Kemajuan: {effectiveCompletedCount} / 4 Modul</span>
            <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(effectiveCompletedCount / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {syllabusModules.map((module) => (
            <div 
              key={module.id} 
              className="bg-[#16191F] rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Modul {module.moduleNumber} • {module.jp} Jam Pelajaran (JP)
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {module.level}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {module.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {module.description}
                </p>

                {/* Subsections preview */}
                <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Topik Pembahasan:
                  </span>
                  {module.sections.map((sec) => (
                    <div key={sec.id} className="text-xs text-slate-300 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{sec.title}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">({sec.duration})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-2.5 flex items-center justify-between border-t border-slate-800">
                <div className="flex flex-wrap gap-1">
                  {module.skillsGained.slice(0, 2).map((skill, sIdx) => (
                    <span key={sIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (onSelectModule) {
                      onSelectModule(module.id);
                    }
                    onNavigateTab("syllabus");
                  }}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Buka Modul</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PARTICIPANT PROFILE & VAULT */}
      <div className="bg-[#16191F] text-slate-300 rounded-xl p-4 sm:p-5 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">
                  Profil Peserta Pelatihan UMKM
                </h3>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                  E2EE Protected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile.businessName} • {profile.fullName} • {profile.culinaryCategory}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[9px]">Status NIB:</span>
              <span className="font-semibold text-white text-xs">{profile.hasNIB ? profile.nibNumber : "Dalam Pengurusan OSS"}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[9px]">Omzet Bulanan:</span>
              <span className="font-semibold text-emerald-400 text-xs">Rp {(profile.currentMonthlyRevenue || 45000000).toLocaleString("id-ID")}</span>
            </div>
            <button
              onClick={() => onNavigateTab("cloud-infra")}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center space-x-1 text-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Kunci Kripto E2EE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
