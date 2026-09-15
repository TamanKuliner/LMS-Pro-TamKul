import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Download,
  Copy,
  Check,
  ChevronRight,
  BookOpen,
  Zap,
  Target,
  Layers,
  HelpCircle,
  Bell,
  Sun,
  Coffee,
  Moon,
  Flame,
  Award,
  CalendarPlus,
  ExternalLink,
} from "lucide-react";
import {
  calculateLearningSchedule,
  downloadLearningScheduleIcs,
  PreferredTimeWindow,
  StudyRhythm,
  formatIndonesianDate,
  generateGoogleCalendarSessionUrl,
} from "../utils/learningScheduleCalculator";
import { TabType } from "../types";
import { GoogleCalendarExportModal } from "./GoogleCalendarExportModal";

export interface SuggestedLearningScheduleProps {
  completedModuleIds?: string[];
  onSelectModule?: (moduleId: string) => void;
  onNavigateTab: (tab: TabType) => void;
  businessName?: string;
  onShowToast?: (msg: string) => void;
}

export const SuggestedLearningSchedule: React.FC<SuggestedLearningScheduleProps> = ({
  completedModuleIds = ["modul-1"],
  onSelectModule,
  onNavigateTab,
  businessName = "Dapur Sambal Berkah",
  onShowToast,
}) => {
  // State for user-defined timeframe and preferences
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const [studyRhythm, setStudyRhythm] = useState<StudyRhythm>("everyday");
  const [timeWindow, setTimeWindow] = useState<PreferredTimeWindow>("evening");
  const [filterMode, setFilterMode] = useState<"all_curriculum" | "remaining_only">("all_curriculum");
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [downloadIcsSuccess, setDownloadIcsSuccess] = useState<string | null>(null);
  const [manualCompletedDayIndices, setManualCompletedDayIndices] = useState<number[]>([]);
  const [isGCalModalOpen, setIsGCalModalOpen] = useState(false);

  // Calculate the schedule dynamically
  const schedule = useMemo(() => {
    return calculateLearningSchedule({
      totalDays: selectedDays,
      studyRhythm,
      timeWindow,
      startDate: new Date(),
      completedModuleIds,
      filterMode,
    });
  }, [selectedDays, studyRhythm, timeWindow, completedModuleIds, filterMode]);

  // Preset timeframes
  const presetDays = [
    { days: 3, label: "3 Hari", desc: "Sprint Akhir Pekan", icon: Flame },
    { days: 5, label: "5 Hari", desc: "Senin – Jumat", icon: Zap },
    { days: 7, label: "7 Hari (1 Minggu)", desc: "Rekomendasi Terbaik", icon: Target, isPopular: true },
    { days: 14, label: "14 Hari (2 Minggu)", desc: "Santai 30 Mnt/Hari", icon: Coffee },
    { days: 21, label: "21 Hari (3 Minggu)", desc: "Konsisten Bertahap", icon: CalendarDays },
    { days: 30, label: "30 Hari (1 Bulan)", desc: "Fleksibel Sambil Buka Warung", icon: Calendar },
  ];

  // Handle ICS Download
  const handleDownloadIcs = () => {
    try {
      const fileName = downloadLearningScheduleIcs(schedule, businessName);
      setDownloadIcsSuccess(fileName);
      if (onShowToast) {
        onShowToast(`Jadwal Kalender (.ics) berhasil diunduh: ${fileName}`);
      }
      setTimeout(() => setDownloadIcsSuccess(null), 5000);
    } catch (e) {
      console.error("Gagal mengunduh file kalender:", e);
    }
  };

  // Handle Copy text plan
  const handleCopyTextPlan = () => {
    const textLines = [
      `======================================================`,
      `RENCANA JADWAL BELAJAR 7 JP SYARIAH - ${businessName.toUpperCase()}`,
      `Platform LMS Pro TamanKuliner.com`,
      `======================================================`,
      `Target Waktu : ${schedule.effectiveTargetDays} Hari (${schedule.studyRhythmLabel})`,
      `Waktu Harian : ~${schedule.dailyMinutes} Menit / Hari (${schedule.dailyJp} JP/hari)`,
      `Jam Pilihan  : ${schedule.timeWindowLabel}`,
      `Mulai - Selesai: ${schedule.startDateFormatted} s/d ${schedule.targetCompletionDateFormatted}`,
      `Intensitas   : ${schedule.pacingBadge}`,
      `======================================================`,
      ``,
      ...schedule.dailyPlans.map(
        (p) =>
          `[Hari ${p.dayIndex} - ${p.dateFormatted} | ${p.timeSlotLabel}]\n` +
          `• Modul: Modul ${p.primaryModuleNumber} - ${p.primaryModuleTitle}\n` +
          `• Topik: ${p.dayHeadline} (${p.totalMinutes} mnt / ${p.totalJp} JP)\n` +
          `• Praktik UMKM: ${p.actionTip}\n`
      ),
      `======================================================`,
    ];

    navigator.clipboard.writeText(textLines.join("\n"));
    setCopiedSuccess(true);
    if (onShowToast) {
      onShowToast("Rencana belajar berhasil disalin ke clipboard!");
    }
    setTimeout(() => setCopiedSuccess(false), 4000);
  };

  const toggleManualDay = (dayIndex: number) => {
    setManualCompletedDayIndices((prev) =>
      prev.includes(dayIndex) ? prev.filter((i) => i !== dayIndex) : [...prev, dayIndex]
    );
  };

  return (
    <section id="suggested-learning-schedule" className="space-y-5">
      {/* Container Card */}
      <div className="bg-[#16191F] rounded-xl border border-slate-800 shadow-xl p-5 sm:p-6 space-y-6">
        {/* Header with Badges */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>Suggested Learning Schedule (Rencana Jadwal Belajar 7 JP)</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                7 JP • 420 Menit
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Kalkulator rencana belajar harian adaptif untuk menuntaskan kurikulum 7 Jam Pelajaran (JP) Digitalisasi UMKM Kuliner Syariah sesuai target waktu yang Anda tentukan secara fleksibel tanpa mengorbankan operasional dapur.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-open-gcal-modal"
              onClick={() => setIsGCalModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md group active:scale-95 shadow-blue-950/40"
              title="Sinkronkan seluruh jadwal belajar langsung ke Google Calendar smartphone & laptop Anda"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-blue-200 group-hover:scale-110 transition-transform" />
              <span>Ekspor ke Google Calendar</span>
            </button>
            <button
              id="btn-download-ics-calendar"
              onClick={handleDownloadIcs}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group active:scale-95"
              title="Unduh file kalender .ics untuk diimpor ke Google Calendar / Apple Calendar HP"
            >
              <Download className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
              <span>Unduh .ics</span>
            </button>
            <button
              id="btn-copy-study-plan"
              onClick={handleCopyTextPlan}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Salin ringkasan jadwal belajar dalam bentuk teks"
            >
              {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedSuccess ? "Tersalin!" : "Salin Rencana"}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert for ICS download */}
        {downloadIcsSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                File kalender berhasil diunduh: <strong className="font-mono">{downloadIcsSuccess}</strong>. Buka file ini di smartphone Anda untuk otomatis memasang reminder belajar 15 menit sebelum sesi!
              </span>
            </div>
            <button onClick={() => setDownloadIcsSuccess(null)} className="text-emerald-400 hover:text-emerald-200 text-xs font-medium">
              Tutup
            </button>
          </div>
        )}

        {/* 1. TIMEFRAME & PREFERENCE CONTROLS */}
        <div className="space-y-4 bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>1. Tentukan Target Waktu Penyelesaian Anda (User-Defined Timeframe)</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Mode Materi:</span>
              <button
                onClick={() => setFilterMode(filterMode === "all_curriculum" ? "remaining_only" : "all_curriculum")}
                className={`text-[11px] px-2.5 py-1 rounded-md border font-medium transition-colors ${
                  filterMode === "remaining_only"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                }`}
                title="Beralih antara menjadwalkan seluruh 7 JP atau sisa materi yang belum selesai"
              >
                {filterMode === "remaining_only" ? "Hanya Modul Belum Selesai" : "Semua Modul (7 JP Lengkap)"}
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <div className="text-[11px] font-medium text-slate-400 mb-2">Pilih Durasi Cepat (Quick Presets):</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {presetDays.map((preset) => {
                const IconComponent = preset.icon;
                const isSelected = selectedDays === preset.days;
                return (
                  <button
                    key={preset.days}
                    onClick={() => setSelectedDays(preset.days)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-emerald-600/20 border-emerald-500 text-white shadow-md shadow-emerald-950/40"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    {preset.isPopular && (
                      <span className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 shadow-xs">
                        POPULER
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <IconComponent className={`w-4 h-4 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{preset.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Days Range Slider & Counter */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80">
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs text-slate-300 font-semibold">Kustom Jumlah Hari:</span>
              <div className="flex items-center border border-slate-700 bg-slate-900 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSelectedDays((d) => Math.max(1, d - 1))}
                  className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-bold text-sm"
                  title="Kurang 1 hari"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                  {selectedDays} Hari
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDays((d) => Math.min(60, d + 1))}
                  className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-bold text-sm"
                  title="Tambah 1 hari"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3">
              <span className="text-[10px] text-slate-500">1 Hari</span>
              <input
                type="range"
                min={1}
                max={60}
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-slate-500">60 Hari</span>
            </div>
          </div>

          {/* Additional Preferences: Rhythm & Time Window */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Study Rhythm */}
            <div className="p-3 bg-slate-950/30 rounded-lg border border-slate-800/60 space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-sky-400" />
                <span>Ritme Hari Belajar:</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "everyday", label: "Setiap Hari (7/7)", sub: "Non-stop" },
                  { key: "weekdays", label: "Hari Kerja (Sen-Jum)", sub: "Weekend Libur" },
                  { key: "triweekly", label: "3x Seminggu", sub: "Sen, Rab, Jum" },
                ].map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setStudyRhythm(r.key as StudyRhythm)}
                    className={`px-2 py-1.5 rounded-lg text-left border text-xs transition-all ${
                      studyRhythm === r.key
                        ? "bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <div className="text-[11px] truncate leading-tight">{r.label}</div>
                    <div className="text-[9px] text-slate-500 truncate">{r.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Time Window */}
            <div className="p-3 bg-slate-950/30 rounded-lg border border-slate-800/60 space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Jam Belajar Ideal Pelaku Kuliner:</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "morning", label: "Pagi", time: "06:00 WIB", icon: Sun },
                  { key: "afternoon", label: "Siang", time: "14:30 WIB", icon: Coffee },
                  { key: "evening", label: "Malam", time: "20:30 WIB", icon: Moon, isDefault: true },
                ].map((w) => {
                  const IconComp = w.icon;
                  return (
                    <button
                      key={w.key}
                      onClick={() => setTimeWindow(w.key as PreferredTimeWindow)}
                      className={`px-2 py-1.5 rounded-lg text-left border text-xs transition-all ${
                        timeWindow === w.key
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[11px] leading-tight">
                        <IconComp className="w-3 h-3 text-amber-400" />
                        <span>{w.label}</span>
                      </div>
                      <div className="text-[9px] text-slate-500">{w.time}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2. DYNAMIC CALCULATION SUMMARY KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Daily Commitment */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Rekomendasi Waktu Harian</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-baseline gap-1">
                <span>{schedule.dailyMinutes}</span>
                <span className="text-xs text-slate-400 font-normal">Menit / Hari</span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400">
              Setara <strong className="text-emerald-400 font-mono">~{schedule.dailyJp} JP</strong> beban belajar harian
            </div>
          </div>

          {/* Target Completion Date */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Target Tanggal Selesai</span>
              <div className="text-sm font-bold text-white mt-1 leading-snug">
                {schedule.targetCompletionDateFormatted}
              </div>
            </div>
            <div className="mt-2 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{schedule.calendarSpanDays} hari dari sekarang ({schedule.effectiveTargetDays} hari belajar)</span>
            </div>
          </div>

          {/* Total Learning Sessions */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Jumlah Sesi Belajar</span>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1 flex items-baseline gap-1">
                <span>{schedule.effectiveTargetDays}</span>
                <span className="text-xs text-slate-400 font-normal">Sesi Terstruktur</span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-sky-400">
              4 Modul Lengkap + Evaluasi Capstone Ujian
            </div>
          </div>

          {/* Pacing Assessment Badge */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Tingkat Intensitas Pacing</span>
              <div className="mt-1">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    schedule.pacingTier === "intensive"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : schedule.pacingTier === "relaxed"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {schedule.pacingBadge}
                </span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 leading-tight">
              {schedule.pacingDescription}
            </p>
          </div>
        </div>

        {/* 3. DAY-BY-DAY LEARNING PLAN BREAKDOWN */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Jadwal Harian Terstruktur ({schedule.dailyPlans.length} Hari Rencana)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Alur materi 7 JP dibagi proporsional ke dalam target {selectedDays} hari Anda
              </p>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Jam Pilihan: <strong className="text-slate-200">{schedule.timeWindowLabel}</strong></span>
            </div>
          </div>

          {/* Daily Plan Items Grid / Cards */}
          <div className="space-y-2.5">
            {schedule.dailyPlans.map((plan) => {
              const isManuallyChecked = manualCompletedDayIndices.includes(plan.dayIndex);
              const isComplete = plan.isAllCompleted || isManuallyChecked;

              return (
                <div
                  key={plan.dayIndex}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isComplete
                      ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  {/* Left Column: Day Badge & Info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleManualDay(plan.dayIndex)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                        isComplete
                          ? "bg-emerald-500 text-slate-950 border-emerald-400"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
                      }`}
                      title={isComplete ? "Tandai belum selesai" : "Tandai selesai"}
                    >
                      {isComplete ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-xs font-bold">{plan.dayIndex}</span>}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">
                          Hari {plan.dayIndex} • {plan.dateFormatted}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 font-mono">
                          <Clock className="w-2.5 h-2.5 text-slate-400" />
                          <span>{plan.timeSlotLabel}</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {plan.totalMinutes} mnt (~{plan.totalJp} JP)
                        </span>
                        {plan.hasCapstone && (
                          <span className="text-[10px] px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-400" />
                            <span>Ujian Capstone & Sertifikat</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-200">
                        Modul {plan.primaryModuleNumber}: {plan.dayHeadline}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                        {plan.daySummary}
                      </p>

                      {/* Practical Action Tip */}
                      <div className="mt-2 text-[11px] text-emerald-300/90 bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-lg flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Praktik Hari Ini:</strong> {plan.actionTip}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Module Launch Action & Google Calendar */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0">
                    <a
                      href={generateGoogleCalendarSessionUrl(plan, timeWindow, businessName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border border-slate-700 hover:border-blue-500/40 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
                      title={`Tambah sesi Hari ${plan.dayIndex} ke Google Calendar`}
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-blue-400" />
                      <span className="hidden sm:inline">Google Calendar</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    <button
                      onClick={() => {
                        if (onSelectModule) {
                          onSelectModule(plan.primaryModuleId);
                        }
                        onNavigateTab("syllabus");
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Pelajari Modul</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. FOOTER ADVICE & QUICK LAUNCH CALLOUT */}
        <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 p-4 rounded-xl border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Komitmen Belajar Berkelanjutan UMKM</span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              "Sebaik-baik amalan adalah yang konsisten meskipun sedikit." (HR. Bukhari). Belajar teratur 45–60 menit tiap malam akan membawa usaha kuliner Anda lolos mandatori sertifikasi halal dan siap menerima pembiayaan bank syariah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsGCalModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Sinkronkan jadwal belajar langsung ke Google Calendar"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-blue-200" />
              <span>Google Calendar</span>
            </button>
            <button
              onClick={() => {
                if (onSelectModule) {
                  onSelectModule("modul-1");
                }
                onNavigateTab("syllabus");
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <span>Mulai Sesi Hari Ini</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDownloadIcs}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pasang Pengingat HP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Calendar Sync & Export Modal */}
      <GoogleCalendarExportModal
        isOpen={isGCalModalOpen}
        onClose={() => setIsGCalModalOpen(false)}
        schedule={schedule}
        timeWindow={timeWindow}
        businessName={businessName}
        onShowToast={onShowToast}
      />
    </section>
  );
};
