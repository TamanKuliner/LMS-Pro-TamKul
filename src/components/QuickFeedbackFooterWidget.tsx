import React, { useState, useEffect } from "react";
import { 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ShieldCheck, 
  BarChart2, 
  ArrowRight,
  BookOpen,
  ThumbsUp,
  HelpCircle,
  ExternalLink,
  MessageSquarePlus,
  ChevronRight,
  Sliders,
  Check
} from "lucide-react";
import { 
  ModuleFeedback, 
  addModuleFeedback, 
  loadStoredFeedback, 
  computeFeedbackStats 
} from "../data/feedbackData";
import { syllabusModules } from "../data/syllabusData";
import { ParticipantProfile } from "../types";

export interface QuickFeedbackFooterWidgetProps {
  activeModuleId?: string; // e.g., "modul-1"
  profile: ParticipantProfile;
  onNavigateToManagementDashboard: () => void;
  onShowToast?: (msg: string) => void;
  onFeedbackSubmitted?: (newFeedback: ModuleFeedback) => void;
}

export const QuickFeedbackFooterWidget: React.FC<QuickFeedbackFooterWidgetProps> = ({
  activeModuleId = "modul-1",
  profile,
  onNavigateToManagementDashboard,
  onShowToast,
  onFeedbackSubmitted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(activeModuleId);
  const [activeTabInModal, setActiveTabInModal] = useState<"form" | "recent">("form");

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [clarityRating, setClarityRating] = useState<number>(5);
  const [relevanceRating, setRelevanceRating] = useState<number>(5);
  const [aspectTag, setAspectTag] = useState<ModuleFeedback["aspectTag"]>("Kejelasan Akad Muamalah");
  const [commentary, setCommentary] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<ModuleFeedback | null>(null);

  // Live feed and stats
  const [feedbackList, setFeedbackList] = useState<ModuleFeedback[]>(() => loadStoredFeedback());

  // Update selected module when activeModuleId changes
  useEffect(() => {
    if (activeModuleId) {
      setSelectedModuleId(activeModuleId);
    }
  }, [activeModuleId]);

  // Current active module details
  const currentModule = syllabusModules.find((m) => m.id === selectedModuleId) || syllabusModules[0];

  const aspectOptions: ModuleFeedback["aspectTag"][] = [
    "Kejelasan Akad Muamalah",
    "Kriteria 5C Bankable",
    "SJPH & Titik Kritis Halal",
    "Pemisahan Kas & Rekening",
    "Pemasaran Amanah (Anti-Gharar)",
    "Materi Umum & Studi Kasus"
  ];

  const quickSuggestions = [
    "Penjelasan materi sangat lugas dan mudah dipraktikkan.",
    "Contoh kriteria 5C bankable membuka wawasan permodalan warung kami.",
    "Panduan titik kritis bahan baku halal sangat membantu audit dapur.",
    "Perhitungan bagi hasil syirkah/mudharabah sangat transparan dan adil.",
    "Mohon diperbanyak template dokumen siap cetak untuk pengajuan bank."
  ];

  const ratingDescriptions: { [key: number]: string } = {
    1: "Perlu Peningkatan Signifikan (Materi Kurang Jelas)",
    2: "Cukup Jelas, Butuh Lebih Banyak Contoh Nyata",
    3: "Baik & Bermanfaat untuk Usaha Kuliner",
    4: "Sangat Bagus, Terstruktur & Relevan",
    5: "Luar Biasa! Sangat Aplikatif, Mudah Dipahami & Berkah"
  };

  const handleOpen = () => {
    // Reset state for new entry
    setSubmittedFeedback(null);
    setIsSubmitting(false);
    setSelectedModuleId(activeModuleId);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentary.trim()) {
      if (onShowToast) onShowToast("Mohon tuliskan ulasan singkat mengenai materi modul.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const { savedItem, allItems } = addModuleFeedback({
        moduleId: currentModule.id,
        moduleNumber: currentModule.moduleNumber,
        moduleTitle: currentModule.title,
        userName: profile.fullName || "Peserta UMKM",
        businessName: profile.businessName || "Usaha Kuliner Berkah",
        culinaryCategory: profile.culinaryCategory || "Kuliner Nusantara",
        rating,
        clarityRating,
        relevanceRating,
        aspectTag,
        commentary: commentary.trim(),
        suggestion: suggestion.trim() || undefined
      });

      setFeedbackList(allItems);
      setSubmittedFeedback(savedItem);
      setIsSubmitting(false);

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(savedItem);
      }

      if (onShowToast) {
        onShowToast(`Alhamdulillah! Feedback Modul ${currentModule.moduleNumber} berhasil dikirim langsung ke Dashboard Manajemen.`);
      }
    }, 400);
  };

  const stats = computeFeedbackStats(feedbackList);

  return (
    <>
      {/* FOOTER TRIGGER WIDGET BUTTON */}
      <div className="flex items-center gap-2">
        <button
          id="btn-quick-feedback-footer"
          onClick={handleOpen}
          className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 transition-all text-[11px] font-semibold shadow-xs"
          title={`Beri rating dan masukan materi untuk Modul ${currentModule.moduleNumber} langsung ke Dashboard Manajemen`}
        >
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Quick Feedback</span>
          </div>

          <span className="hidden sm:inline-block w-px h-3 bg-emerald-500/30 mx-0.5" />

          <span className="hidden sm:inline-block text-[10px] text-slate-300 font-mono">
            M{currentModule.moduleNumber}
          </span>

          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono">
            ★ {stats.averageRating > 0 ? stats.averageRating : 4.9}
          </span>

          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      {/* QUICK FEEDBACK MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div 
            className="relative w-full max-w-xl bg-[#16191F] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner mt-0.5">
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      LMS Management Direct Feed
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {feedbackList.length} Masukan Terarsip
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                    Quick Feedback & Rating Modul
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sampaikan evaluasi materi langsung ke dewan asesor & manajemen kurikulum TamanKuliner.com
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Header Tabs */}
            <div className="px-5 pt-3 pb-2 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTabInModal("form")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTabInModal === "form"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Kirim Ulasan Baru</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTabInModal("recent")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTabInModal === "recent"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Feed Manajemen ({feedbackList.length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToManagementDashboard();
                }}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Buka Dashboard Analitik</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Modal Body */}
            {activeTabInModal === "recent" ? (
              /* RECENT FEEDBACK STREAM VIEW */
              <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Stats Summary Box */}
                <div className="grid grid-cols-3 gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Rata-rata Rating</span>
                    <span className="text-base font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                      ★ {stats.averageRating} <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Tingkat Kejelasan</span>
                    <span className="text-base font-bold text-emerald-400 mt-0.5 block">
                      {Math.round((stats.averageClarity / 5) * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Total Masukan</span>
                    <span className="text-base font-bold text-white mt-0.5 block font-mono">
                      {stats.totalCount} Ulasan
                    </span>
                  </div>
                </div>

                {/* List of Feedback */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">
                    Ulasan Terkini dari Peserta UMKM Kuliner:
                  </span>

                  {feedbackList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{item.userName}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 text-[11px]">{item.businessName}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium inline-block mt-1">
                            Modul {item.moduleNumber}: {item.moduleTitle.slice(0, 32)}...
                          </span>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-0.5 text-amber-400 font-bold">
                            {Array.from({ length: 5 }).map((_, sIdx) => (
                              <Star
                                key={sIdx}
                                className={`w-3 h-3 ${sIdx < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
                              />
                            ))}
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                            {new Date(item.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed">
                        "{item.commentary}"
                      </p>

                      {item.suggestion && (
                        <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-500 font-semibold">Saran Peserta:</span> {item.suggestion}
                        </div>
                      )}

                      {item.managementResponse && (
                        <div className="text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                          <span className="font-semibold text-emerald-400">Tanggapan Manajemen:</span> {item.managementResponse}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTabInModal("form")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                  >
                    + Kirim Ulasan Anda Sekarang
                  </button>
                </div>
              </div>
            ) : submittedFeedback ? (
              /* SUCCESS STATE VIEW */
              <div className="p-6 sm:p-8 space-y-5 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    Feedback Berhasil Dikirim ke Dashboard Manajemen!
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Terima kasih atas ulasan dan masukan Anda untuk <strong className="text-slate-200">Modul {submittedFeedback.moduleNumber}</strong>. Data telah langsung disinkronkan ke feed analitik manajemen.
                  </p>
                </div>

                {/* Feedback Receipt */}
                <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">ID Ulasan:</span>
                    <span className="font-mono text-emerald-400 font-bold">{submittedFeedback.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Rating Evaluasi:</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      ★ {submittedFeedback.rating} / 5.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Aspek Utama:</span>
                    <span className="text-slate-200 font-medium">{submittedFeedback.aspectTag}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 block mb-1">Ulasan Anda:</span>
                    <p className="text-slate-200 italic bg-slate-950/60 p-2 rounded border border-slate-800">
                      "{submittedFeedback.commentary}"
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onNavigateToManagementDashboard();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950"
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span>Lihat di Dashboard Manajemen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedFeedback(null);
                      setCommentary("");
                      setSuggestion("");
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Tulis Ulasan Lain
                  </button>
                </div>
              </div>
            ) : (
              /* FORM SUBMISSION VIEW */
              <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* 1. Pilih Modul yang Dinilai */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>1. Modul Pembelajaran yang Dievaluasi</span>
                    <span className="text-[10px] text-emerald-400 font-normal">
                      Aktif: Modul {currentModule.moduleNumber} ({currentModule.jp} JP)
                    </span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {syllabusModules.map((m) => {
                      const isSelected = selectedModuleId === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedModuleId(m.id)}
                          className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? "bg-emerald-600/20 border-emerald-500 text-white shadow-xs"
                              : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold text-xs text-white">M{m.moduleNumber}</span>
                            <span className="text-[9px] font-mono text-slate-500">{m.jp} JP</span>
                          </div>
                          <span className="text-[10px] line-clamp-1 text-slate-300 mt-1">
                            {m.title.split(" ")[0]} {m.title.split(" ")[1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">Modul {currentModule.moduleNumber}:</span>
                    <span className="truncate">{currentModule.title}</span>
                  </div>
                </div>

                {/* 2. Rating Bintang Utama (1 to 5 Stars) */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-center">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                    2. Berikan Rating Kepuasan Materi Modul
                  </label>

                  <div className="flex items-center justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const activeStar = hoverRating || rating;
                      const isFilled = starVal <= activeStar;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starVal)}
                          className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-hidden"
                          title={`${starVal} Bintang`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              isFilled
                                ? "text-amber-400 fill-amber-400 drop-shadow-md"
                                : "text-slate-700 hover:text-slate-500"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-xs font-semibold text-emerald-400">
                    {ratingDescriptions[hoverRating || rating]}
                  </div>
                </div>

                {/* 3. Sub-Kriteria: Kejelasan & Relevansi Kuliner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Kejelasan */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">Kejelasan Bahasa & Konsep:</span>
                      <span className="text-emerald-400 font-bold">{clarityRating} / 5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setClarityRating(num)}
                          className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-colors ${
                            clarityRating >= num
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Relevansi */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">Relevansi Bisnis Kuliner:</span>
                      <span className="text-emerald-400 font-bold">{relevanceRating} / 5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRelevanceRating(num)}
                          className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-colors ${
                            relevanceRating >= num
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Tag Aspek Fokus */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200">
                    3. Fokus Aspek Materi
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {aspectOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAspectTag(opt)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          aspectTag === opt
                            ? "bg-emerald-600/30 border-emerald-500 text-white font-semibold shadow-xs"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Ulasan Teks (Text Commentary) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>4. Ulasan & Komentar Materi (Text Commentary)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Wajib diisi</span>
                  </label>

                  <textarea
                    rows={3}
                    required
                    value={commentary}
                    onChange={(e) => setCommentary(e.target.value)}
                    placeholder="Contoh: Pembahasan akad muamalah sangat aplikatif untuk warung kami, terutama cara memisahkan kas modal harian dari pengeluaran dapur..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />

                  {/* Preset Quick Chips for rapid insertion */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 block mb-1">
                      Klik masukan cepat (opsional):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {quickSuggestions.slice(0, 3).map((snippet, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCommentary((prev) => prev ? `${prev} ${snippet}` : snippet)}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-left transition-colors"
                        >
                          + "{snippet.slice(0, 38)}..."
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. Saran Peningkatan (Opsional) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>5. Saran Pengembangan Tambahan (Opsional)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Untuk tim kurikulum</span>
                  </label>
                  <input
                    type="text"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Contoh: Mohon sertakan simulasi POS kasir syariah atau template Excel..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Identity Preview Note */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Pengirim: <strong className="text-white">{profile.fullName}</strong> ({profile.businessName})</span>
                  <span className="text-emerald-400 font-mono text-[10px]">Terkirim Langsung ✓</span>
                </div>

                {/* Submit Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Batal
                  </button>

                  <button
                    id="btn-submit-quick-feedback"
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Mengirim...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Feedback ke Manajemen</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
