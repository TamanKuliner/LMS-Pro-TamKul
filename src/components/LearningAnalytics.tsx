import React, { useState, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  Award, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Download, 
  Filter, 
  CheckCircle, 
  Calendar, 
  Target, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  FileText,
  FileSpreadsheet,
  Star,
  MessageSquare,
  MessageSquarePlus,
  ThumbsUp,
  Search,
  ExternalLink
} from "lucide-react";
import { Language, TabType, QuizAttempt } from "../types";
import { syllabusModules } from "../data/syllabusData";
import { initialQuizAttempts, initialDomainCompetencies } from "../data/learningAnalyticsData";
import { downloadLearningAnalyticsCsv } from "../utils/csvExport";
import { downloadYearlyProgressPdf } from "../utils/yearlyProgressPdfGenerator";
import { 
  default12MonthGrowthData, 
  computeYearlySummaryMetrics, 
  MonthlyGrowthRecord 
} from "../data/yearlyProgressData";
import { 
  ModuleFeedback, 
  loadStoredFeedback, 
  saveStoredFeedback, 
  computeFeedbackStats 
} from "../data/feedbackData";

export interface LearningAnalyticsProps {
  language: Language;
  onNavigateTab: (tab: TabType) => void;
  completedModuleIds: string[];
  hasPassedExam: boolean;
  highestScore: number;
  quizAttempts?: QuizAttempt[];
  businessName?: string;
  fullName?: string;
  nibNumber?: string;
  culinaryCategory?: string;
  city?: string;
  onOpenCertificate?: () => void;
  onShowToast?: (msg: string) => void;
  initialMetricView?: "all" | "quiz" | "modules" | "competency" | "yearly" | "feedback";
}

export const LearningAnalytics: React.FC<LearningAnalyticsProps> = ({
  language,
  onNavigateTab,
  completedModuleIds,
  hasPassedExam,
  highestScore,
  quizAttempts = initialQuizAttempts,
  businessName = "Dapur Sambal Berkah",
  fullName = "Hj. Siti Rahmah",
  nibNumber = "9120008471923",
  culinaryCategory = "Aneka Masakan Nusantara",
  city = "Sleman, D.I. Yogyakarta",
  onOpenCertificate,
  onShowToast,
  initialMetricView = "all",
}) => {
  const [activeMetricView, setActiveMetricView] = useState<"all" | "quiz" | "modules" | "competency" | "yearly" | "feedback">(initialMetricView);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"all" | "year" | "month" | "week">("all");
  const [isGeneratingYearlyPdf, setIsGeneratingYearlyPdf] = useState(false);
  const [yearlyPdfSuccessToast, setYearlyPdfSuccessToast] = useState<string | null>(null);

  // Management Feedback Feed State
  const [feedbackList, setFeedbackList] = useState<ModuleFeedback[]>(() => loadStoredFeedback());
  const [feedbackModuleFilter, setFeedbackModuleFilter] = useState<string>("all");
  const [feedbackStarFilter, setFeedbackStarFilter] = useState<number>(0);
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState<string>("");
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);

  // Calculate Feedback summary stats
  const feedbackStats = useMemo(() => computeFeedbackStats(feedbackList), [feedbackList]);

  // Filtered feedback for management feed
  const filteredFeedbackList = useMemo(() => {
    return feedbackList.filter((fb) => {
      if (feedbackModuleFilter !== "all" && fb.moduleId !== feedbackModuleFilter) return false;
      if (feedbackStarFilter > 0 && Math.round(fb.rating) !== feedbackStarFilter) return false;
      if (feedbackSearchQuery.trim()) {
        const q = feedbackSearchQuery.toLowerCase();
        const full = (fb.commentary + " " + fb.userName + " " + fb.businessName + " " + (fb.suggestion || "")).toLowerCase();
        if (!full.includes(q)) return false;
      }
      return true;
    });
  }, [feedbackList, feedbackModuleFilter, feedbackStarFilter, feedbackSearchQuery]);

  const handleToggleReviewed = (id: string) => {
    setReviewedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (onShowToast) {
      onShowToast("Status ulasan diperbarui oleh Asesor Manajemen.");
    }
  };

  // 1. Calculate Module Completion Statistics
  const totalModulesCount = syllabusModules.length; // 4 modules
  const completedModulesCount = completedModuleIds.length;
  const moduleCompletionPercent = Math.round((completedModulesCount / totalModulesCount) * 100);

  const totalJp = syllabusModules.reduce((acc, m) => acc + m.jp, 0); // 7 JP
  const completedJp = syllabusModules
    .filter((m) => completedModuleIds.includes(m.id))
    .reduce((acc, m) => acc + m.jp, 0);
  const jpCompletionPercent = Math.round((completedJp / totalJp) * 100);

  // Module Progress Bar Chart Data
  const moduleProgressData = useMemo(() => {
    return syllabusModules.map((m) => {
      const isDone = completedModuleIds.includes(m.id);
      return {
        id: m.id,
        name: `M${m.moduleNumber}: ${m.title.length > 22 ? m.title.slice(0, 20) + "..." : m.title}`,
        shortName: `M${m.moduleNumber}`,
        fullTitle: m.title,
        targetJp: m.jp,
        earnedJp: isDone ? m.jp : 0,
        status: isDone ? "Selesai" : "Belum Selesai",
        sectionsCount: m.sections.length,
        completionRate: isDone ? 100 : 0,
      };
    });
  }, [completedModuleIds]);

  // Curriculum Distribution Pie Chart Data
  const pieDistributionData = useMemo(() => {
    const COLORS = ["#10B981", "#06B6D4", "#6366F1", "#F59E0B"];
    return syllabusModules.map((m, idx) => ({
      name: `M${m.moduleNumber}: ${m.title.split(" ")[0]}`,
      value: m.jp,
      color: COLORS[idx % COLORS.length],
      isDone: completedModuleIds.includes(m.id),
    }));
  }, [completedModuleIds]);

  // 2. Filter & Calculate Quiz Performance History Data
  const filteredAttempts = useMemo(() => {
    if (selectedTimeframe === "week") {
      return quizAttempts.slice(-3);
    }
    if (selectedTimeframe === "month") {
      return quizAttempts.slice(-4);
    }
    return quizAttempts;
  }, [quizAttempts, selectedTimeframe]);

  // Trajectory chart data
  const quizTrajectoryData = useMemo(() => {
    return filteredAttempts.map((att, idx) => ({
      attemptNumber: `Try ${att.attemptNumber}`,
      fullTitle: att.title,
      date: att.date,
      score: att.score,
      nationalAvg: 64 + idx * 2, // benchmark
      passingGrade: 70,
      passed: att.passed,
      accuracy: `${att.correctAnswers}/${att.totalQuestions}`,
      timeMinutes: att.timeSpentMinutes,
    }));
  }, [filteredAttempts]);

  // Overall Quiz Metrics
  const latestAttempt = quizAttempts[quizAttempts.length - 1];
  const averageQuizScore = useMemo(() => {
    if (quizAttempts.length === 0) return 0;
    const sum = quizAttempts.reduce((acc, a) => acc + a.score, 0);
    return Math.round(sum / quizAttempts.length);
  }, [quizAttempts]);

  const scoreImprovement = useMemo(() => {
    if (quizAttempts.length < 2) return 0;
    const firstScore = quizAttempts[0].score;
    const lastScore = quizAttempts[quizAttempts.length - 1].score;
    return lastScore - firstScore;
  }, [quizAttempts]);

  // 3. Dynamic Domain Competencies based on actual attempts & completed modules
  const domainRadarData = useMemo(() => {
    const latestDomains = latestAttempt?.domainScores || {
      fiqihMuamalah: 90,
      bankable5C: 85,
      sjphHalal: 80,
      akuntansiSyariah: 92,
      pemasaranDigital: 90,
    };

    return [
      {
        subject: "Fiqih Muamalah",
        score: latestDomains.fiqihMuamalah,
        benchmark: 68,
        fullMark: 100,
      },
      {
        subject: "Kelayakan 5C",
        score: latestDomains.bankable5C,
        benchmark: 62,
        fullMark: 100,
      },
      {
        subject: "SJPH BPJPH",
        score: latestDomains.sjphHalal,
        benchmark: 70,
        fullMark: 100,
      },
      {
        subject: "Akuntansi Syariah",
        score: latestDomains.akuntansiSyariah,
        benchmark: 60,
        fullMark: 100,
      },
      {
        subject: "Pemasaran Syariah",
        score: latestDomains.pemasaranDigital,
        benchmark: 72,
        fullMark: 100,
      },
    ];
  }, [latestAttempt]);

  const yearlyMetrics = useMemo(() => {
    return computeYearlySummaryMetrics(default12MonthGrowthData, highestScore);
  }, [highestScore]);

  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const handleDownloadYearlyProgress = () => {
    try {
      setIsGeneratingYearlyPdf(true);
      const fileName = downloadYearlyProgressPdf({
        fullName,
        businessName,
        nibNumber,
        culinaryCategory,
        city,
        highestScore,
        completedModuleIds,
        hasPassedExam,
        monthlyRecords: default12MonthGrowthData,
      });
      setYearlyPdfSuccessToast(fileName);
      if (onShowToast) {
        onShowToast(`Laporan PDF Tahunan (12 Bulan) berhasil diunduh: ${fileName}`);
      }
      setTimeout(() => {
        setYearlyPdfSuccessToast(null);
      }, 6000);
    } catch (error) {
      console.error("Gagal mengunduh Laporan Perkembangan Tahunan:", error);
    } finally {
      setIsGeneratingYearlyPdf(false);
    }
  };

  const handleExportCsv = () => {
    try {
      const fileName = downloadLearningAnalyticsCsv({
        quizAttempts,
        completedModuleIds,
        highestScore,
        hasPassedExam,
        businessName,
        fullName,
      });
      setDownloadSuccessToast(fileName);
      setTimeout(() => {
        setDownloadSuccessToast(null);
      }, 5000);
    } catch (error) {
      console.error("Gagal mengunduh CSV:", error);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-300 pb-12">
      {/* Toast Notification when Yearly Progress PDF is Downloaded */}
      {yearlyPdfSuccessToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-emerald-200">
                Laporan Perkembangan Tahunan (12 Bulan) Berhasil Diunduh!
              </p>
              <p className="text-[11px] text-emerald-400/90 font-mono">
                {yearlyPdfSuccessToast} • Laporan PDF 2 halaman lengkap dengan tren akselerasi nilai, jam belajar, kesiapan halal, dan verifikasi tanda tangan resmi.
              </p>
            </div>
          </div>
          <button
            onClick={() => setYearlyPdfSuccessToast(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Toast Notification when CSV is Exported */}
      {downloadSuccessToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-emerald-200">
                File CSV Berhasil Diunduh untuk Catatan Pribadi!
              </p>
              <p className="text-[11px] text-emerald-400/90 font-mono">
                {downloadSuccessToast} • Siap dibuka langsung di Microsoft Excel, Google Sheets, atau LibreOffice.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDownloadSuccessToast(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-[#16191F] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Learning Intelligence & Performance Telemetry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Analitik Pembelajaran & Kinerja Kelulusan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visualisasi komprehensif kemajuan kurikulum 7 JP, lintasan skor evaluasi kuis, dan radar kompetensi syariah untuk <span className="text-slate-200 font-semibold">{businessName}</span> ({fullName}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="btn-download-yearly-progress-header"
            onClick={handleDownloadYearlyProgress}
            disabled={isGeneratingYearlyPdf}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40 group active:scale-95 disabled:opacity-60"
            title="Download detailed 12-month PDF report summarizing growth trends"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-100 group-hover:scale-110 transition-transform" />
            <span>{isGeneratingYearlyPdf ? "Menyiapkan PDF..." : "Download Yearly Progress"}</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
            title="Unduh seluruh riwayat kuis & progres kurikulum dalam format CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => onNavigateTab("quiz-test")}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ikuti Evaluasi Kuis</span>
          </button>
          <button
            onClick={() => onNavigateTab("syllabus")}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Buka Silabus (7 JP)</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Cetak atau Simpan Laporan Analisis"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak Analitik</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Modules & JP Completed */}
        <div className="p-4 rounded-xl bg-[#16191F] border border-slate-800 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Penyelesaian Modul</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {completedModulesCount}/{totalModulesCount}
            </span>
            <span className="text-xs text-slate-400">Modul</span>
          </div>
          <div className="mt-1 text-xs text-emerald-400 font-mono font-semibold">
            {completedJp} dari {totalJp} Jam Pelajaran ({jpCompletionPercent}%)
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${jpCompletionPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Highest Quiz Score */}
        <div className="p-4 rounded-xl bg-[#16191F] border border-slate-800 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Skor Ujian Tertinggi</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-emerald-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {highestScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            {hasPassedExam ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Lulus Passing Grade (≥70)
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Perlu Remedial (&lt;70)
              </span>
            )}
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${hasPassedExam ? "bg-emerald-500" : "bg-amber-500"}`} 
              style={{ width: `${highestScore}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Average Quiz Score & Improvement Trend */}
        <div className="p-4 rounded-xl bg-[#16191F] border border-slate-800 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Rata-rata Skor Evaluasi</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {averageQuizScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-1 text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{scoreImprovement} poin dari pre-test pertama</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${averageQuizScore}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Total Study Hours & Readiness */}
        <div className="p-4 rounded-xl bg-[#16191F] border border-slate-800 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Kesiapan Sertifikasi</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {Math.round((jpCompletionPercent * 0.5) + (highestScore * 0.5))}%
            </span>
            <span className="text-xs text-slate-400">Indeks Kesiapan</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {quizAttempts.length} sesi ujian • {completedJp * 60} menit materi selesai
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.round((jpCompletionPercent * 0.5) + (highestScore * 0.5))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#16191F] p-2.5 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveMetricView("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeMetricView === "all"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            Semua Visualisasi
          </button>
          <button
            onClick={() => setActiveMetricView("yearly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeMetricView === "yearly"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Tren 12 Bulan (Yearly)</span>
          </button>
          <button
            onClick={() => setActiveMetricView("quiz")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeMetricView === "quiz"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kinerja Kuis Over Time</span>
          </button>
          <button
            onClick={() => setActiveMetricView("modules")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeMetricView === "modules"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Progres Modul (7 JP)</span>
          </button>
          <button
            onClick={() => setActiveMetricView("competency")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeMetricView === "competency"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Radar Penguasaan Kompetensi</span>
          </button>
          <button
            id="tab-analytics-feedback"
            onClick={() => setActiveMetricView("feedback")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeMetricView === "feedback"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Feedback Modul ({feedbackStats.totalCount})</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
              ★ {feedbackStats.averageRating}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-slate-500 font-medium">Rentang Data:</span>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-emerald-500 font-medium"
          >
            <option value="all">Semua Riwayat (Lengkap)</option>
            <option value="year">12 Bulan Terakhir (Yearly)</option>
            <option value="month">30 Hari Terakhir</option>
            <option value="week">7 Hari Terakhir</option>
          </select>
        </div>
      </div>

      {/* Main Section 1: Quiz Performance Over Time */}
      {(activeMetricView === "all" || activeMetricView === "quiz") && (
        <div className="bg-[#16191F] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Lintasan Skor Ujian & Kuis Dari Waktu ke Waktu
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Memantau perkembangan pemahaman fiqih muamalah, kriteria 5C bankable, dan sertifikasi halal per sesi pengerjaan.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <span className="w-3 h-0.5 bg-emerald-500 rounded" />
                <span>Skor Peserta</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                <span className="w-3 h-0.5 bg-slate-500 border-b border-dashed border-slate-400" />
                <span>Benchmark Industri</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500 font-mono">
                <span className="w-3 h-0.5 bg-emerald-500" />
                <span>Passing Grade (70%)</span>
              </div>
            </div>
          </div>

          {/* Recharts Area/Line Chart for Quiz Trajectory */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quizTrajectoryData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis 
                  dataKey="attemptNumber" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                  ticks={[0, 25, 50, 70, 85, 100]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0F1115] border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[200px]">
                          <div className="font-bold text-white border-b border-slate-800 pb-1 flex justify-between items-center">
                            <span>{data.fullTitle}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{data.date}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-300">
                            <span>Skor Anda:</span>
                            <span className="font-mono font-bold text-emerald-400 text-sm">
                              {data.score}/100
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Akurasi Soal:</span>
                            <span className="font-mono text-slate-200">{data.accuracy} Soal</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Waktu Pengerjaan:</span>
                            <span className="font-mono text-slate-200">{data.timeMinutes} Menit</span>
                          </div>
                          <div className="pt-1">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              data.score >= 70 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            }`}>
                              {data.score >= 70 ? "LULUS (Passed)" : "REMEDIAL (Belum Lulus)"}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Passing Grade Reference Line at 70 */}
                <ReferenceLine 
                  y={70} 
                  stroke="#10B981" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  label={{ 
                    value: "Ambang Kelulusan: 70%", 
                    fill: "#10B981", 
                    fontSize: 10, 
                    position: "insideTopLeft",
                    offset: 8 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10B981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  name="Skor Peserta"
                  activeDot={{ r: 6, fill: "#10B981", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="nationalAvg" 
                  stroke="#64748B" 
                  strokeWidth={1.5} 
                  strokeDasharray="3 3" 
                  dot={false}
                  name="Benchmark Industri"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Insight Analisis:</strong> Tren performa Anda menunjukkan kurva akselerasi positif (+{scoreImprovement} poin). Nilai evaluasi terakhir melampaui passing grade sebesar +{latestAttempt ? latestAttempt.score - 70 : 0} poin.
              </span>
            </div>
            <button
              onClick={() => onNavigateTab("quiz-test")}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 shrink-0"
            >
              <span>Ulangi Ujian Uji Coba</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Section 2: Module Completion & JP Progress */}
      {(activeMetricView === "all" || activeMetricView === "modules") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module Progress Bar Chart (2 cols) */}
          <div className="lg:col-span-2 bg-[#16191F] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h2 className="text-base font-bold text-white">
                    Penyelesaian Jam Pelajaran (7 JP) per Modul
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Distribusi target JP terhadap perolehan JP aktual berdasarkan modul yang telah diselesaikan.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-blue-400 font-mono">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm" />
                  <span>Target JP</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                  <span>JP Selesai</span>
                </div>
              </div>
            </div>

            {/* Recharts Bar Chart for Modules */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleProgressData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis 
                    dataKey="shortName" 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={{ stroke: "#334155" }}
                  />
                  <YAxis 
                    domain={[0, 2.5]} 
                    ticks={[0, 0.5, 1.0, 1.5, 2.0]} 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false}
                    unit=" JP"
                    axisLine={{ stroke: "#334155" }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-[#0F1115] border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[220px]">
                            <div className="font-bold text-white border-b border-slate-800 pb-1">
                              {item.fullTitle}
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>Bobot Materi:</span>
                              <span className="font-mono font-bold text-blue-400">{item.targetJp} JP</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>Pencapaian:</span>
                              <span className="font-mono font-bold text-emerald-400">{item.earnedJp} JP ({item.completionRate}%)</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>Total Bagian/Topik:</span>
                              <span className="font-mono text-slate-200">{item.sectionsCount} Sub-Modul</span>
                            </div>
                            <div className="pt-1">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.earnedJp > 0
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-slate-800 text-slate-400 border border-slate-700"
                              }`}>
                                Status: {item.status}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="targetJp" fill="#334155" radius={[4, 4, 0, 0]} name="Target JP" />
                  <Bar dataKey="earnedJp" fill="#10B981" radius={[4, 4, 0, 0]} name="JP Selesai" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick List of Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {syllabusModules.map((m) => {
                const isCompleted = completedModuleIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => onNavigateTab("syllabus")}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                      isCompleted
                        ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isCompleted ? "bg-emerald-500 text-slate-900" : "bg-slate-800 text-slate-500"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[10px] font-bold">{m.moduleNumber}</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 truncate">{m.title}</span>
                        <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-1">{m.jp} JP</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{m.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Curriculum Share Donut / Pie Chart (1 col) */}
          <div className="bg-[#16191F] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h2 className="text-base font-bold text-white">
                  Porsi Kurikulum 7 JP
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Pembagian beban studi wajib kompetensi digitalisasi UMKM berbasis syariah.
              </p>

              <div className="h-52 w-full mt-2 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieDistributionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          opacity={entry.isDone ? 1 : 0.4} 
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#0F1115] border border-slate-700 p-2 rounded-lg text-xs font-mono text-white shadow-lg">
                              <div>{data.name}</div>
                              <div className="text-emerald-400 font-bold">{data.value} JP ({Math.round((data.value / 7) * 100)}%)</div>
                              <div className="text-[10px] text-slate-400">
                                {data.isDone ? "✓ Selesai dipelajari" : "○ Belum selesai"}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center text in donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold font-mono text-white">{completedJp}/7</span>
                  <span className="text-[10px] text-slate-400">JP Tuntas</span>
                </div>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
              {pieDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 font-mono">
                    <span className="text-slate-400">{item.value} JP</span>
                    {item.isDone ? (
                      <span className="text-emerald-400 text-[10px]">✓</span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">○</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Section 3: Radar Competency Mastery & Detailed Attempt Log */}
      {(activeMetricView === "all" || activeMetricView === "competency") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar Chart (1 col) */}
          <div className="bg-[#16191F] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h2 className="text-base font-bold text-white">
                Peta Radar Penguasaan Domain
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Evaluasi multi-dimensi berdasarkan 5 pilar kurikulum syariah digital.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={domainRadarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
                  <Radar
                    name="Tingkat Penguasaan"
                    dataKey="score"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.45}
                  />
                  <Radar
                    name="Benchmark Rata-rata"
                    dataKey="benchmark"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.15}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#0F1115] border border-slate-700 p-2.5 rounded-lg text-xs space-y-1">
                            <div className="font-bold text-white">{d.subject}</div>
                            <div className="text-emerald-400 font-mono">Skor Anda: {d.score}%</div>
                            <div className="text-indigo-400 font-mono">Benchmark: {d.benchmark}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-mono pt-1 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                <span>Penguasaan Anda</span>
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm" />
                <span>Benchmark Industri</span>
              </span>
            </div>
          </div>

          {/* Competency Mastery List & Insights (2 cols) */}
          <div className="lg:col-span-2 bg-[#16191F] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">
                    Matriks Penguasaan Kompetensi Standar Industri
                  </h2>
                </div>
                <span className="text-xs text-emerald-400 font-mono">Standar BPJPH & OJK</span>
              </div>

              <div className="mt-4 space-y-3">
                {initialDomainCompetencies.map((dom, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{dom.domain}</span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline">— {dom.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">{dom.score}%</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          {dom.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                      <div 
                        className="bg-emerald-500 h-full rounded-full" 
                        style={{ width: `${dom.score}%` }} 
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {dom.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Sertifikat kelulusan diterbitkan otomatis setelah menyelesaikan seluruh 4 modul dan nilai ujian ≥ 70.
              </span>
              {onOpenCertificate && (
                <button
                  onClick={onOpenCertificate}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Lihat E-Sertifikat</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Section 4: 12-Month Yearly Growth Trends & Trajectory */}
      {(activeMetricView === "all" || activeMetricView === "yearly" || selectedTimeframe === "year") && (
        <div className="bg-[#16191F] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Tren Pertumbuhan 12 Bulan Terakhir (Yearly Progress & Trajectory)</span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Rekam jejak pertumbuhan holistik 12 bulan: evaluasi skor kuis, jam belajar kurikulum 7 JP, kesiapan audit sertifikasi halal, dan indeks kelayakan 5C perbankan syariah.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                Okt 2025 – Sep 2026 (12 Bulan)
              </span>
              <button
                id="btn-download-yearly-progress-section"
                onClick={handleDownloadYearlyProgress}
                disabled={isGeneratingYearlyPdf}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group active:scale-95 disabled:opacity-60"
                title="Download detailed 12-month PDF report summarizing growth trends"
              >
                <FileText className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                <span>{isGeneratingYearlyPdf ? "Menyiapkan PDF..." : "Download Yearly Progress"}</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Mini KPI Badges for 12 Months */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400">Akselerasi Skor Ujian</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    45% ➔ {yearlyMetrics.currentScore}%
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-emerald-500 font-medium mt-1">
                +{yearlyMetrics.scoreDelta} Poin (+{yearlyMetrics.scoreGrowthPercent}% pertumbuhan)
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400">Total Akumulasi Belajar</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-sky-400">
                    {yearlyMetrics.totalStudyHoursJp} JP
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">({yearlyMetrics.totalStudyMinutes} mnt)</span>
                </div>
              </div>
              <p className="text-[10px] text-sky-400 font-medium mt-1">
                {yearlyMetrics.totalSessions} Sesi Pembelajaran & Kuis Aktif
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400">Transformasi Kesiapan Halal</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    22% ➔ {yearlyMetrics.currentHalalScore}%
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium mt-1">
                Status: SIAP AUDIT SIHALAL BPJPH ✓
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400">Kelayakan Finansial 5C</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-amber-400">
                    42% ➔ {yearlyMetrics.current5CScore}%
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-amber-400 font-medium mt-1">
                Kelayakan Bank Syariah: Grade A (Sangat Layak)
              </p>
            </div>
          </div>

          {/* 12-Month Multi-Metric Area Chart */}
          <div className="pt-2">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={default12MonthGrowthData}
                  margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="scoreGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="halalGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="bankableGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="monthLabel" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    unit="%" 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      color: "#f8fafc",
                    }}
                    formatter={(val: any, name: string) => [`${val}%`, name]}
                    labelFormatter={(label: string) => {
                      const rec = default12MonthGrowthData.find((r) => r.monthLabel === label);
                      return `${label} — ${rec ? rec.milestoneTopic : ""}`;
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} 
                  />
                  <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Passing Grade (70%)", fill: "#ef4444", fontSize: 10, position: "insideBottomRight" }} />
                  <Area
                    type="monotone"
                    dataKey="averageQuizScore"
                    name="Rata-rata Skor Kuis (%)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGrowthGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="halalReadinessScore"
                    name="Kesiapan Halal BPJPH (%)"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#halalGrowthGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="bankable5CScore"
                    name="Kelayakan 5C Bankable (%)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#bankableGrowthGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quarterly Trajectory Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-emerald-400">Q4 2025</span>
                <span className="text-[10px] text-slate-400 font-mono">45% ➔ 58%</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">Fondasi Fiqih & Akad Kuliner</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Pemahaman rukun jual beli (Ba'i), eliminasi riba/gharar, dan penyelesaian Modul 1 (2 JP).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-sky-400">Q1 2026</span>
                <span className="text-[10px] text-slate-400 font-mono">64% ➔ 74%</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">Kepatuhan SJPH & BPJPH</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Penyusunan manual SJPH, audit bahan kritis, pemisahan dapur, dan penyelesaian Modul 2 (2 JP).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-indigo-400">Q2 2026</span>
                <span className="text-[10px] text-slate-400 font-mono">78% ➔ 85%</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">Akuntansi Kas & Zakat Mal</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Pemisahan rekening usaha, buku kas harian syariah, nisab zakat 2.5%, dan Modul 3 (1.5 JP).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-amber-400">Q3 2026</span>
                <span className="text-[10px] text-slate-400 font-mono">88% ➔ 94%</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">Fintech 5C & Kelulusan 7 JP</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Rating bankable Grade A, integrasi fintech halal, kelulusan ujian capstone, dan e-sertifikasi resmi.
              </p>
            </div>
          </div>

          {/* Download Callout Box */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-lg">
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">Laporan PDF Lengkap Tren 12 Bulan:</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mencakup ledger 12 bulan lengkap, analisis kuartalan, delta 5 pilar kompetensi, rencana aksi 1 tahun ke depan, serta pengesahan digital resmi.
              </p>
            </div>
            <button
              onClick={handleDownloadYearlyProgress}
              disabled={isGeneratingYearlyPdf}
              className="self-start sm:self-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0 active:scale-95 disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingYearlyPdf ? "Memproses PDF..." : "Download Yearly Progress (PDF)"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Management Feedback & Module Evaluation Section */}
      {(activeMetricView === "all" || activeMetricView === "feedback") && (
        <div id="management-feedback-dashboard" className="bg-[#16191F] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Management Live Dashboard
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Terintegrasi dengan Quick Feedback Footer
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
                <span>Evaluasi & Umpan Balik Materi Modul (Quick Feedback Feed)</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Hasil penilaian kepuasan materi, skor kejelasan akad, relevansi bisnis kuliner, dan ulasan teks peserta UMKM yang dikirimkan secara langsung ke tim kurikulum & manajemen.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Skor Rata-Rata</span>
                <span className="text-lg font-bold text-amber-400 flex items-center justify-end gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{feedbackStats.averageRating}</span>
                  <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
                </span>
              </div>
            </div>
          </div>

          {/* KPI Cards for Feedback */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Indeks Kepuasan Materi</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-amber-400">★ {feedbackStats.averageRating}</span>
                <span className="text-[10px] text-slate-500">/ 5.0</span>
              </div>
              <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full" 
                  style={{ width: `${(feedbackStats.averageRating / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Tingkat Kejelasan Konsep</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {Math.round((feedbackStats.averageClarity / 5) * 100)}%
                </span>
                <span className="text-[10px] text-slate-500">({feedbackStats.averageClarity}/5)</span>
              </div>
              <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${(feedbackStats.averageClarity / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Relevansi Bisnis Kuliner</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-sky-400">
                  {Math.round((feedbackStats.averageRelevance / 5) * 100)}%
                </span>
                <span className="text-[10px] text-slate-500">({feedbackStats.averageRelevance}/5)</span>
              </div>
              <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-500 h-full rounded-full" 
                  style={{ width: `${(feedbackStats.averageRelevance / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Ulasan Masuk</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-white">
                  {feedbackStats.totalCount}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Tersinkron Real-Time</span>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>5 Bintang: {feedbackStats.ratingDistribution[5] || 0}</span>
                <span>4 Bintang: {feedbackStats.ratingDistribution[4] || 0}</span>
              </div>
            </div>
          </div>

          {/* Module-by-Module Satisfaction Scoreboard */}
          <div>
            <span className="text-xs font-bold text-slate-300 block mb-2">
              Breakdown Rating per Modul Kurikulum (7 JP):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {feedbackStats.moduleBreakdown.map((item) => (
                <div 
                  key={item.moduleId}
                  onClick={() => setFeedbackModuleFilter(feedbackModuleFilter === item.moduleId ? "all" : item.moduleId)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    feedbackModuleFilter === item.moduleId
                      ? "bg-emerald-950/40 border-emerald-500 shadow-xs"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Modul {item.moduleNumber}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.avgRating}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {item.moduleTitle}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{item.count} Ulasan</span>
                    <span className="text-emerald-400 font-semibold">Kejelasan: {item.avgClarity}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter & Search Bar for Feed */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Modul */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Modul:</span>
                <select
                  value={feedbackModuleFilter}
                  onChange={(e) => setFeedbackModuleFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="all">Semua Modul (1—4)</option>
                  <option value="modul-1">Modul 1: Prinsip Bisnis Islam</option>
                  <option value="modul-2">Modul 2: Perencanaan Keuangan</option>
                  <option value="modul-3">Modul 3: Pemasaran Anti-Gharar</option>
                  <option value="modul-4">Modul 4: SJPH & Pembiayaan 5C</option>
                </select>
              </div>

              {/* Filter Star */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Rating:</span>
                <select
                  value={feedbackStarFilter}
                  onChange={(e) => setFeedbackStarFilter(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-hidden focus:border-emerald-500"
                >
                  <option value={0}>Semua Rating (1—5 ★)</option>
                  <option value={5}>5 Bintang (Sempurna)</option>
                  <option value={4}>4 Bintang (Sangat Baik)</option>
                  <option value={3}>3 Bintang (Cukup)</option>
                  <option value={2}>2 Bintang (Perlu Revisi)</option>
                </select>
              </div>
            </div>

            {/* Search Commentary */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={feedbackSearchQuery}
                onChange={(e) => setFeedbackSearchQuery(e.target.value)}
                placeholder="Cari teks ulasan atau nama peserta..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Feedback Feed List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredFeedbackList.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
                Tidak ada ulasan materi yang sesuai dengan filter pencarian.
              </div>
            ) : (
              filteredFeedbackList.map((item) => {
                const isReviewed = reviewedIds.includes(item.id) || item.status === "reviewed" || item.status === "actioned";
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-[11px] text-emerald-400">
                          {item.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">{item.userName}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 text-[11px]">{item.businessName}</span>
                            {item.culinaryCategory && (
                              <span className="hidden sm:inline text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                {item.culinaryCategory}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, sIdx) => (
                            <Star
                              key={sIdx}
                              className={`w-3.5 h-3.5 ${sIdx < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
                            />
                          ))}
                        </div>

                        <span className="font-mono text-[10px] text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Meta Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                        Modul {item.moduleNumber}: {item.moduleTitle.slice(0, 35)}...
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Aspek: {item.aspectTag}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                        Kejelasan: <strong className="text-emerald-400">{item.clarityRating}/5</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                        Relevansi: <strong className="text-sky-400">{item.relevanceRating}/5</strong>
                      </span>
                    </div>

                    {/* Commentary Text */}
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                      <p className="text-slate-200 leading-relaxed italic text-xs">
                        "{item.commentary}"
                      </p>
                    </div>

                    {/* Suggestions */}
                    {item.suggestion && (
                      <div className="text-[11px] text-slate-400 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-start gap-1.5">
                        <span className="font-semibold text-amber-400 shrink-0">Saran Peserta:</span>
                        <span>{item.suggestion}</span>
                      </div>
                    )}

                    {/* Management Response */}
                    {item.managementResponse && (
                      <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/25 flex items-start gap-1.5">
                        <span className="font-semibold text-emerald-400 shrink-0">Tindak Lanjut Manajemen:</span>
                        <span>{item.managementResponse}</span>
                      </div>
                    )}

                    {/* Management Footer Actions */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleReviewed(item.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                            isReviewed
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isReviewed ? "Telah Ditelaah Asesor" : "Tandai Telah Ditelaah"}</span>
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-500 font-mono">
                        ID: {item.id}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Attempt History Table */}
      <div className="bg-[#16191F] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Log Riwayat Pengerjaan Kuis & Evaluasi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Catatan riwayat lengkap setiap percobaan ujian, perolehan nilai, durasi pengerjaan, dan status kelulusan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Unduh seluruh riwayat kuis dan progres ke format CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unduh CSV Riwayat</span>
            </button>
            <button
              onClick={() => onNavigateTab("quiz-test")}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kerjakan Ujian Baru</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Percobaan</th>
                <th className="py-2.5 px-3">Nama Tes Evaluasi</th>
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Akurasi Soal</th>
                <th className="py-2.5 px-3">Nilai Skor</th>
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredAttempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-300">
                    #{attempt.attemptNumber}
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    {attempt.title}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                    {attempt.date}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {attempt.correctAnswers} / {attempt.totalQuestions} Benar
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={`text-sm ${attempt.score >= 70 ? "text-emerald-400" : "text-rose-400"}`}>
                      {attempt.score}
                    </span>
                    <span className="text-slate-500 text-[10px]">/100</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                    {attempt.timeSpentMinutes} Menit
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      attempt.passed
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {attempt.passed ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>LULUS</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>REMEDIAL</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigateTab("quiz-test")}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                    >
                      Buka Evaluasi &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
