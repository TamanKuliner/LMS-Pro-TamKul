import React, { useState, useMemo, useEffect } from "react";
import { 
  UserCheck, 
  X, 
  Building, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  FileCheck2, 
  TrendingUp, 
  Zap,
  Lock,
  ArrowRight,
  Target,
  Calendar
} from "lucide-react";
import { ParticipantProfile, Language, TabType, QuizAttempt } from "../types";
import { evaluateUserBadges, calculateTotalBadgePoints } from "../data/badgesData";
import { BadgesDisplay } from "./BadgesDisplay";
import { syllabusModules } from "../data/syllabusData";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  onSaveProfile: (profile: ParticipantProfile) => void;
  completedModuleIds?: string[];
  quizAttempts?: QuizAttempt[];
  highestScore?: number;
  hasPassedExam?: boolean;
  onNavigateTab?: (tab: TabType) => void;
  onSelectModule?: (moduleId: string) => void;
  onOpenCertificate?: () => void;
  onOpenPdfReport?: () => void;
  onShowToast?: (msg: string) => void;
  defaultTab?: "badges" | "profile" | "transcript";
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  completedModuleIds = ["modul-1", "modul-2", "modul-3"],
  quizAttempts = [],
  highestScore = 91,
  hasPassedExam = true,
  onNavigateTab,
  onSelectModule,
  onOpenCertificate,
  onOpenPdfReport,
  onShowToast,
  defaultTab = "badges",
}) => {
  const [formData, setFormData] = useState<ParticipantProfile>(profile);
  const [activeTab, setActiveTab] = useState<"badges" | "profile" | "transcript">(defaultTab);

  // Sync formData when profile changes
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  // Compute dynamic badges
  const badges = useMemo(() => {
    return evaluateUserBadges({
      completedModuleIds,
      quizAttempts,
      highestScore,
      hasPassedExam,
      profile,
    });
  }, [completedModuleIds, quizAttempts, highestScore, hasPassedExam, profile]);

  const stats = useMemo(() => calculateTotalBadgePoints(badges), [badges]);

  // Compute completed JP based on completedModuleIds and syllabus data
  const completedJP = useMemo(() => {
    return syllabusModules
      .filter((m) => completedModuleIds.includes(m.id))
      .reduce((acc, m) => acc + m.jp, 0);
  }, [completedModuleIds]);

  const targetGoalJP = typeof formData.monthlyLearningGoalJP === "number" && formData.monthlyLearningGoalJP > 0 
    ? formData.monthlyLearningGoalJP 
    : 7;
  const goalProgressPercentage = Math.min(100, Math.round((completedJP / targetGoalJP) * 100));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    if (onShowToast) {
      onShowToast("Profil & Identitas Usaha Kuliner berhasil diperbarui!");
    }
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "TK";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#12151B] rounded-2xl w-full max-w-4xl border border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* MODAL HEADER WITH USER PROFILE BANNER */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-[#151922] to-slate-950 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-emerald-400/40 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg">
                  {getInitials(profile.fullName)}
                </div>
                <div 
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center border-2 border-[#12151B]"
                  title="Identitas Terverifikasi NIB"
                >
                  <ShieldCheck className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    {profile.fullName}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Admin UMKM
                  </span>
                  {profile.hasNIB && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                      NIB {profile.nibNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{profile.businessName}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{profile.culinaryCategory}</span>
                </p>

                {/* Quick Unlocked Badges Preview Strip */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Medali Utama:</span>
                  {badges
                    .filter((b) => b.isUnlocked)
                    .slice(0, 3)
                    .map((b) => (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold"
                      >
                        <Award className="w-2.5 h-2.5 text-amber-400" />
                        <span>{b.name}</span>
                      </span>
                    ))}
                  {badges.filter((b) => b.isUnlocked).length > 3 && (
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      +{badges.filter((b) => b.isUnlocked).length - 3} lainnya
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB BAR NAVIGATION */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
            <button
              type="button"
              id="tab-profile-badges"
              onClick={() => setActiveTab("badges")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "badges"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Koleksi Medali & Badges</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === "badges" ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-amber-400"
              }`}>
                {stats.unlockedCount}/{stats.totalCount}
              </span>
            </button>

            <button
              type="button"
              id="tab-profile-identity"
              onClick={() => setActiveTab("profile")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "profile"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Identitas & Usaha Kuliner</span>
            </button>

            <button
              type="button"
              id="tab-profile-transcript"
              onClick={() => setActiveTab("transcript")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "transcript"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Transkrip & Capaian (7 JP)</span>
            </button>
          </div>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: BADGES SHOWCASE SYSTEM */}
          {activeTab === "badges" && (
            <BadgesDisplay
              badges={badges}
              fullName={profile.fullName}
              businessName={profile.businessName}
              onNavigateTab={onNavigateTab}
              onSelectModule={onSelectModule}
              onCloseModal={onClose}
              onShowToast={onShowToast}
            />
          )}

          {/* TAB 2: PROFILE FORM */}
          {activeTab === "profile" && (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-4">
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Informasi Pemilik Usaha & Legalitas OSS</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Data ini digunakan sebagai identitas resmi pada E-Sertifikat Digital (7 JP) dan Berita Acara Kelayakan Finansial Syariah.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Lengkap Pemilik Usaha (Sesuai KTP)
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Contoh: Hj. Siti Rahmah, S.E"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Usaha / Brand Kuliner
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Contoh: Dapur Sambal Berkah"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kategori Makanan / Minuman
                  </label>
                  <select
                    value={formData.culinaryCategory}
                    onChange={(e) => setFormData({ ...formData, culinaryCategory: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Aneka Masakan Nusantara">Aneka Masakan Nusantara</option>
                    <option value="Minuman & Kopi Kekinian">Minuman & Kopi Kekinian</option>
                    <option value="Kue & Roti (Bakery/Pastry)">Kue & Roti (Bakery/Pastry)</option>
                    <option value="Camilan & Frozen Food">Camilan & Frozen Food</option>
                    <option value="Katering & Siap Saji">Katering & Siap Saji</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nomor Induk Berusaha (NIB 13 Digit)
                  </label>
                  <input
                    type="text"
                    value={formData.nibNumber}
                    onChange={(e) => setFormData({ ...formData, nibNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
                    placeholder="13 Digit NIB OSS RBA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email Aktif
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="email@bisnis.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    WhatsApp / No. HP
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
                    placeholder="0812-3456-7890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Alamat Dapur / Lokasi Gerai Usaha
                </label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Contoh: Jl. Taman Kuliner No. 14, Condongcatur, Sleman, Yogyakarta"
                />
              </div>

              {/* SECTION: TARGET BELAJAR BULANAN (MONTHLY LEARNING GOAL) */}
              <div id="monthly-learning-goal-section" className="bg-[#111317] p-4 rounded-xl border border-slate-800 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>Target Belajar Bulanan (Monthly Learning Goal)</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          goalProgressPercentage >= 100 
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : goalProgressPercentage >= 50
                            ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}>
                          {goalProgressPercentage}% Tercapai
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Atur target Jam Pelajaran (JP) yang ingin Anda kuasai setiap bulan untuk akselerasi UMKM Bankable.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Calculated Progress Bar Preview */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">Kalkulasi Progres Saat Ini:</span>
                      <span className="font-bold text-white font-mono bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {completedJP} JP Selesai
                      </span>
                      <span className="text-slate-400">dari target</span>
                      <span className="font-bold text-emerald-400 font-mono bg-emerald-950/50 px-2 py-0.5 rounded text-[11px] border border-emerald-500/30">
                        {targetGoalJP} JP
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono font-bold text-xs">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className={goalProgressPercentage >= 100 ? "text-emerald-400" : "text-sky-400"}>
                        {goalProgressPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goalProgressPercentage >= 100
                          ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300"
                          : goalProgressPercentage >= 50
                          ? "bg-gradient-to-r from-sky-500 to-emerald-400"
                          : "bg-gradient-to-r from-amber-500 to-emerald-500"
                      }`}
                      style={{ width: `${goalProgressPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>0 JP</span>
                    <span className="text-emerald-400 font-semibold">
                      {completedJP >= targetGoalJP 
                        ? "🎉 Target Belajar Bulanan Anda Telah Terpenuhi!" 
                        : `Sisa ${targetGoalJP - completedJP} JP lagi untuk mencapai sasaran bulan ini`}
                    </span>
                    <span>{targetGoalJP} JP</span>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label 
                      htmlFor="input-monthly-learning-goal-jp"
                      className="block text-xs font-bold text-slate-300 mb-1"
                    >
                      Target Jam Pelajaran (JP) / Bulan
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="input-monthly-learning-goal-jp"
                        min={1}
                        max={30}
                        required
                        value={formData.monthlyLearningGoalJP ?? 7}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setFormData({
                            ...formData,
                            monthlyLearningGoalJP: isNaN(val) ? 1 : Math.max(1, Math.min(val, 30))
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono text-xs pr-20"
                        placeholder="7"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono pointer-events-none">
                        JP / Bulan
                      </span>
                    </div>

                    {/* Quick Preset Selector Buttons */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] text-slate-500">Preset:</span>
                      {[
                        { label: "2 JP", val: 2, desc: "Santai (1 Modul/bln)" },
                        { label: "4 JP", val: 4, desc: "Moderat (2 Modul/bln)" },
                        { label: "7 JP", val: 7, desc: "Silabus Penuh (Rekomendasi)" },
                        { label: "10 JP", val: 10, desc: "Intensif + Kuis" },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          id={`btn-preset-goal-${preset.val}`}
                          onClick={() => setFormData({ ...formData, monthlyLearningGoalJP: preset.val })}
                          title={preset.desc}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                            (formData.monthlyLearningGoalJP ?? 7) === preset.val
                              ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                              : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label 
                      htmlFor="input-monthly-goal-month"
                      className="block text-xs font-bold text-slate-300 mb-1"
                    >
                      Bulan / Periode Target
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="input-monthly-goal-month"
                        value={formData.monthlyGoalMonth || "September 2026"}
                        onChange={(e) => setFormData({ ...formData, monthlyGoalMonth: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs"
                        placeholder="Contoh: September 2026"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Target waktu evaluasi progres & penyelesaian modul
                    </span>
                  </div>
                </div>

                <div>
                  <label 
                    htmlFor="input-monthly-goal-focus"
                    className="block text-xs font-bold text-slate-300 mb-1"
                  >
                    Fokus Prioritas Belajar Bulan Ini (Opsional)
                  </label>
                  <input
                    type="text"
                    id="input-monthly-goal-focus"
                    value={formData.monthlyGoalFocus || ""}
                    onChange={(e) => setFormData({ ...formData, monthlyGoalFocus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs"
                    placeholder="Contoh: Menuntaskan Modul 4 (SJPH Halal) & Lulus Ujian Capstone 5C"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Data Profil</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: TRANSCRIPT & MILESTONES */}
          {activeTab === "transcript" && (
            <div className="space-y-4 max-w-3xl mx-auto text-xs text-slate-300">
              {/* Summary Banner */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Jam Belajar</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {completedModuleIds.length === 4 ? "7 JP (100%)" : `${completedModuleIds.length === 3 ? "5 JP" : `${completedModuleIds.length * 2} JP`}`}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Modul Tuntas</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                    {completedModuleIds.length} / 4 Modul
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Skor Capstone</div>
                  <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                    {highestScore} / 100
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Status Kelulusan</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">
                    {hasPassedExam ? "LULUS ✓" : "BELUM LULUS"}
                  </div>
                </div>
              </div>

              {/* Monthly Goal Tracker Banner in Transcript */}
              <div className="bg-[#111317] p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">Target Belajar Bulanan ({formData.monthlyGoalMonth || "September 2026"})</span>
                      <span className="text-[10px] px-2 py-0.2 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {completedJP} / {targetGoalJP} JP ({goalProgressPercentage}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {completedJP >= targetGoalJP 
                        ? "✓ Sasaran belajar bulan ini telah tercapai dengan optimal!" 
                        : `Memerlukan ${targetGoalJP - completedJP} JP lagi untuk menuntaskan target bulanan.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    Atur Target
                  </button>
                </div>
              </div>

              {/* Modules breakdown */}
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Daftar Capaian Kurikulum (7 JP)
                </h4>
                <div className="space-y-2">
                  {syllabusModules.map((m) => {
                    const isCompleted = completedModuleIds.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isCompleted
                            ? "bg-slate-900/80 border-emerald-500/30 text-slate-200"
                            : "bg-slate-900/30 border-slate-800 text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isCompleted
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-800 text-slate-500 border border-slate-700"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">
                              {m.title}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Bobot: {m.jp} JP ({m.jp * 45} Menit) • {m.level}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              isCompleted
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-800 text-slate-500 border border-slate-700"
                            }`}
                          >
                            {isCompleted ? "Tuntas" : "Terkunci"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="text-[11px] text-slate-400">
                  Dokumen diterbitkan dengan verifikasi QR-Code & E2EE Hash.
                </div>
                <div className="flex items-center gap-2">
                  {onOpenCertificate && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCertificate();
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Buka E-Sertifikat</span>
                    </button>
                  )}
                  {onOpenPdfReport && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPdfReport();
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 border border-slate-700 shadow-sm transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Cetak Transkrip PDF</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
