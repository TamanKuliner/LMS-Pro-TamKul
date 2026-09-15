import React, { useState } from "react";
import {
  Calendar,
  CalendarCheck,
  CalendarPlus,
  ExternalLink,
  Download,
  Copy,
  Check,
  X,
  Clock,
  Sparkles,
  Info,
  ArrowRight,
  Layers,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Laptop
} from "lucide-react";
import {
  CalculatedSchedule,
  PreferredTimeWindow,
  generateGoogleCalendarSeriesUrl,
  generateGoogleCalendarSessionUrl,
  getGoogleCalendarImportUrl,
  downloadLearningScheduleIcs,
} from "../utils/learningScheduleCalculator";

export interface GoogleCalendarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: CalculatedSchedule;
  timeWindow: PreferredTimeWindow;
  businessName?: string;
  onShowToast?: (msg: string) => void;
}

export const GoogleCalendarExportModal: React.FC<GoogleCalendarExportModalProps> = ({
  isOpen,
  onClose,
  schedule,
  timeWindow,
  businessName = "UMKM Kuliner",
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<"series" | "batch" | "individual">("series");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [hasTriggeredImport, setHasTriggeredImport] = useState(false);

  if (!isOpen) return null;

  const seriesUrl = generateGoogleCalendarSeriesUrl(schedule, timeWindow, businessName);

  const handleOpenSeriesInGCal = () => {
    window.open(seriesUrl, "_blank", "noopener,noreferrer");
    if (onShowToast) {
      onShowToast("Membuka Google Calendar untuk menjadwalkan seri belajar 7 JP!");
    }
  };

  const handleCopyUrl = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(label);
    if (onShowToast) {
      onShowToast(`Link Google Calendar ${label} berhasil disalin!`);
    }
    setTimeout(() => setCopiedLink(null), 3500);
  };

  const handleBatchImportAction = () => {
    // 1. Trigger ICS download
    const fileName = downloadLearningScheduleIcs(schedule, businessName);
    // 2. Open Google Calendar import page in new tab
    const gcalImportUrl = getGoogleCalendarImportUrl();
    window.open(gcalImportUrl, "_blank", "noopener,noreferrer");
    setHasTriggeredImport(true);

    if (onShowToast) {
      onShowToast(`File ${fileName} diunduh & Halaman Impor Google Calendar terbuka!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#141820] border border-slate-700/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-emerald-950/30 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-inner shrink-0">
              <CalendarPlus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white leading-tight">
                  Sinkronisasi ke Google Calendar
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Google Calendar Export
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sinkronkan jadwal belajar 7 JP ({schedule.effectiveTargetDays} Hari) langsung ke kalender smartphone & laptop Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Schedule Context Banner */}
        <div className="bg-slate-900/90 px-5 py-2.5 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Target:</span>
            <strong className="text-white font-mono">{schedule.effectiveTargetDays} Hari</strong>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Jam:</span>
            <strong className="text-emerald-400">{schedule.timeWindowLabel}</strong>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3 h-3 text-sky-400" />
            <span>~{schedule.dailyMinutes} Menit / Sesi ({schedule.dailyJp} JP)</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-2 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("series")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "series"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>1-Klik Seri Lengkap (Paling Praktis)</span>
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "batch"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Impor Seluruh Sesi Terpisah</span>
          </button>
          <button
            onClick={() => setActiveTab("individual")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "individual"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pilih Sesi Per Hari ({schedule.dailyPlans.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-slate-200 text-xs leading-relaxed">
          {/* TAB 1: 1-CLICK RECURRING SERIES */}
          {activeTab === "series" && (
            <div className="space-y-4">
              <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Sinkronisasi 1-Klik Seri Berulang (Recurring Event)
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">
                      Membuka Google Calendar dengan parameter jadwal otomatis berulang selama <strong>{schedule.effectiveTargetDays} Hari</strong> ({schedule.studyRhythmLabel}) di jam pilihan Anda.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Judul Acara:</span>
                    <span className="text-white font-sans font-medium text-right truncate max-w-[280px]">
                      [LMS Syariah 7 JP] Sesi Belajar Harian - {businessName}
                    </span>
                  </div>
                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Waktu Mulai:</span>
                    <span className="text-emerald-400">{schedule.startDateFormatted}</span>
                  </div>
                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Target Berakhir:</span>
                    <span className="text-sky-400">{schedule.targetCompletionDateFormatted}</span>
                  </div>
                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Zona Waktu:</span>
                    <span className="text-slate-300">WIB (Asia/Jakarta)</span>
                  </div>
                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Pengingat:</span>
                    <span className="text-amber-400">Notifikasi 15 Menit Sebelum</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
                  <button
                    id="btn-open-gcal-series"
                    onClick={handleOpenSeriesInGCal}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all group"
                  >
                    <span>Buka & Simpan di Google Calendar</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleCopyUrl(seriesUrl, "Seri Berulang")}
                    className="py-3 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    title="Salin tautan langsung untuk dikirim ke WhatsApp / Telegram"
                  >
                    {copiedLink === "Seri Berulang" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{copiedLink === "Seri Berulang" ? "Tersalin!" : "Salin Link"}</span>
                  </button>
                </div>
              </div>

              {/* Cross-Device Compatibility Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400 text-[11px]">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Di Smartphone (Android / iOS):</strong>
                    <p className="mt-0.5">Otomatis membuka aplikasi Google Calendar dan muncul alarm pengingat harian di layar ponsel Anda.</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <Laptop className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Di Laptop / Browser:</strong>
                    <p className="mt-0.5">Membuka tab Google Calendar Web di akun Google Anda dan langsung siap disimpan dengan 1 klik.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BATCH ICS IMPORT INTO GCAL */}
          {activeTab === "batch" && (
            <div className="space-y-4">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Impor Seluruh Sesi Lengkap dengan Rincian Topik Spesifik
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">
                      Metode ini mengimpor seluruh <strong>14 unit materi 7 JP</strong> ke Google Calendar Anda sebagai acara terpisah per hari lengkap dengan topik modul, catatan praktik kuliner, dan tautan materi.
                    </p>
                  </div>
                </div>

                {/* 3 Simple Steps */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px]">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <div>
                      <strong className="text-white">Unduh File Kalender .ics:</strong>
                      <p className="text-slate-400">Berisi seluruh jadwal, durasi JP, dan alarm pengingat 15 menit sebelum waktu belajar.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px]">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <div>
                      <strong className="text-white">Buka Setelan Impor Google Calendar:</strong>
                      <p className="text-slate-400">Halaman impor Google Calendar akan terbuka di tab baru secara otomatis.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px]">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      3
                    </span>
                    <div>
                      <strong className="text-white">Pilih File & Klik "Impor":</strong>
                      <p className="text-slate-400">Pilih file .ics yang baru diunduh tadi, lalu klik tombol "Impor". Selesai!</p>
                    </div>
                  </div>
                </div>

                {/* Single Combined Action Button */}
                <button
                  id="btn-batch-import-gcal"
                  onClick={handleBatchImportAction}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File .ics & Buka Halaman Impor Google Calendar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                {hasTriggeredImport && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>File .ics berhasil diunduh dan tab Google Calendar Import telah dibuka. Cukup unggah file tersebut di tab Google Calendar!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INDIVIDUAL DAY SESSIONS */}
          {activeTab === "individual" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Pilih sesi belajar hari tertentu untuk langsung ditambahkan ke Google Calendar Anda secara mandiri:
              </p>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {schedule.dailyPlans.map((plan) => {
                  const dayUrl = generateGoogleCalendarSessionUrl(plan, timeWindow, businessName);
                  const isCopied = copiedLink === `Hari ${plan.dayIndex}`;

                  return (
                    <div
                      key={plan.dayIndex}
                      className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-bold text-white">
                            Hari {plan.dayIndex} • {plan.dateFormatted}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {plan.timeSlotLabel}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                            {plan.totalMinutes} mnt (~{plan.totalJp} JP)
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-300 truncate">
                          {plan.primaryModuleTitle}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {plan.dayHeadline}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyUrl(dayUrl, `Hari ${plan.dayIndex}`)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
                          title="Salin link Google Calendar hari ini"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <a
                          href={dayUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <span>Google Calendar</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Format iCal / Google Calendar Web Intent standar resmi tanpa perlu izin akun berbahaya.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
