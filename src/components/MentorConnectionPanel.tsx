import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Video, 
  MapPin, 
  ChevronRight, 
  Award, 
  Building2, 
  MessageSquare,
  BookOpen,
  Check,
  RefreshCw,
  SlidersHorizontal
} from "lucide-react";
import { 
  VerifiedMentor, 
  MentorshipRequest, 
  verifiedMentorsList, 
  getSuggestedMentor 
} from "../data/mentorsData";
import { ParticipantProfile, TabType } from "../types";
import { RequestMentorshipModal } from "./RequestMentorshipModal";

export interface MentorConnectionPanelProps {
  profile: ParticipantProfile;
  completedModulesCount?: number;
  completedModuleIds?: string[];
  hasPassedExam?: boolean;
  highestScore?: number;
  onNavigateTab?: (tab: TabType) => void;
  onShowToast?: (msg: string) => void;
}

export const MentorConnectionPanel: React.FC<MentorConnectionPanelProps> = ({
  profile,
  completedModulesCount = 3,
  completedModuleIds = ["modul-1", "modul-2", "modul-3"],
  hasPassedExam = true,
  highestScore = 91,
  onNavigateTab,
  onShowToast,
}) => {
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [showAllMentors, setShowAllMentors] = useState<boolean>(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>("all");

  // Load booked sessions from localStorage
  const [mentorshipBookings, setMentorshipBookings] = useState<MentorshipRequest[]>(() => {
    try {
      const saved = localStorage.getItem("tk_mentorship_sessions");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Gagal membaca tk_mentorship_sessions dari localStorage", e);
    }
    // Default seed session for realistic experience
    return [
      {
        id: "seed-booking-1",
        bookingCode: "MNT-8821-2026",
        mentorId: "mentor-nusantara-1",
        mentorName: "Dr. H. Ahmad Fauzi, M.E.I., CPSA",
        mentorTitle: "Konsultan Senior Bisnis Syariah & Pakar Fiqih Muamalah Kuliner Nusantara",
        menteeName: profile.fullName || "Hj. Siti Rahmah",
        businessName: profile.businessName || "Dapur Sambal Berkah",
        culinaryCategory: profile.culinaryCategory || "Aneka Masakan Nusantara",
        completedModulesCount: 3,
        focusTopic: "Audit Kehalalan Rantai Pasok Bumbu & Review Akad Murabahah Dapur",
        selectedDate: "Jumat Pekan Ini (15:30 WIB)",
        selectedTime: "15:30 - 16:30 WIB",
        sessionType: "Online Video Call",
        notes: "Konsultasi persiapan pengajuan fasilitas pembiayaan bank syariah dan verifikasi sertifikat halal pemasok cabai & rempah.",
        status: "confirmed",
        createdAt: "2026-09-08T09:00:00Z"
      }
    ];
  });

  // Persist bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("tk_mentorship_sessions", JSON.stringify(mentorshipBookings));
    } catch (e) {
      console.error("Gagal menyimpan tk_mentorship_sessions ke localStorage", e);
    }
  }, [mentorshipBookings]);

  // Compute recommended mentor based on culinary category & learning progress
  const recommendation = useMemo(() => {
    return getSuggestedMentor(
      profile.culinaryCategory || "Aneka Masakan Nusantara",
      completedModulesCount,
      hasPassedExam,
      highestScore
    );
  }, [profile.culinaryCategory, completedModulesCount, hasPassedExam, highestScore]);

  // Active mentor being viewed (defaults to recommendation)
  const currentMentor: VerifiedMentor = useMemo(() => {
    if (selectedMentorId) {
      const found = verifiedMentorsList.find((m) => m.id === selectedMentorId);
      if (found) return found;
    }
    return recommendation.mentor;
  }, [selectedMentorId, recommendation.mentor]);

  const handleConfirmBooking = (newBooking: MentorshipRequest) => {
    setMentorshipBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setMentorshipBookings((prev) => prev.filter((b) => b.id !== bookingId));
    if (onShowToast) {
      onShowToast("Pengajuan sesi mentorship telah dibatalkan.");
    }
  };

  // Filtered mentor catalog if user wants to browse other verified experts
  const filteredMentors = useMemo(() => {
    if (activeFilterCategory === "all") return verifiedMentorsList;
    return verifiedMentorsList.filter((m) =>
      m.culinaryCategories.some((cat) => cat.toLowerCase() === activeFilterCategory.toLowerCase())
    );
  }, [activeFilterCategory]);

  return (
    <div id="mentor-connection-panel" className="bg-[#16191F] rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-300">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/40 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Mentor Connection
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                1-on-1 Syariah Business Mentorship
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              Pendampingan Ahli & Kurator Bisnis Syariah
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
              Konsultasikan akselerasi usaha kuliner Anda bersama dewan pakar muamalah, asesor SJPH halal, dan praktisi perbankan syariah terverifikasi.
            </p>
          </div>
        </div>

        {/* Quick stat pill */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            id="btn-toggle-all-mentors"
            onClick={() => setShowAllMentors((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showAllMentors ? "Tutup Katalog Pakar" : "Lihat Semua Pakar (5)"}</span>
          </button>

          <button
            id="btn-request-mentorship-top"
            onClick={() => setIsRequestModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Request Mentorship Session</span>
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* RECOMMENDED MENTOR SHOWCASE CARD */}
        <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/30 p-5 sm:p-6 relative overflow-hidden shadow-lg">
          {/* Subtle Accent Glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Matching Indicator Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Rekomendasi Utama Berdasarkan Kategori & Progres Anda
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {recommendation.matchScore}% Kecocokan Profil
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Kategori: {profile.culinaryCategory}
              </span>
            </div>
          </div>

          {/* Personalized Rationale Callout */}
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="text-emerald-200 font-medium leading-relaxed">
                {recommendation.matchReason}
              </p>
              <p className="text-slate-400 text-[11px]">
                {recommendation.progressContext}
              </p>
            </div>
          </div>

          {/* Mentor Profile Details */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Avatar & Identity (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${currentMentor.avatarBgColor} text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-xl border border-white/10 shrink-0`}>
                  {currentMentor.photoInitials}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {currentMentor.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                    {currentMentor.title}
                  </p>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{currentMentor.institution}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <div className="flex items-center text-amber-400 font-bold gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{currentMentor.rating}</span>
                      <span className="text-slate-500 font-normal">({currentMentor.totalMentees} UMKM Didampingi)</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-medium">{currentMentor.experienceYears}+ Tahun Pengalaman</span>
                  </div>
                </div>
              </div>

              {/* Verified badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentMentor.verifiedBadges.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    {badge}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {currentMentor.bio}
              </p>

              {/* Specialties */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Keahlian & Bidang Kurasi Spesifik:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentMentor.specialties.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking Box & Recommended Topics (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800/80 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Jadwal Sesi Mendatang
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Tersedia {currentMentor.availableSlots.length} Slot
                  </span>
                </div>

                {/* Slot preview pills */}
                <div className="space-y-2">
                  {currentMentor.availableSlots.slice(0, 2).map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-white block">{slot.date}</span>
                        <span className="text-[11px] text-slate-400">{slot.time}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        slot.sessionType === "Online Video Call"
                          ? "bg-sky-500/10 text-sky-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {slot.sessionType}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Recommended discussion topics */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Topik Diskusi Terarah (Curated Topics):
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {recommendation.recommendedTopics.slice(0, 3).map((topic, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-snug">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ACTION BUTTON - REQUIRED BY PROMPT */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  id="btn-request-mentorship-session"
                  onClick={() => setIsRequestModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950 active:scale-[0.99]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Mentorship Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Fasilitas resmi kurikulum 7 JP TamanKuliner.com • Bebas biaya untuk peserta terverifikasi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BROWSE ALL VERIFIED MENTORS (EXPANDABLE CATALOG) */}
        {showAllMentors && (
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Katalog Seluruh Pakar Bisnis Syariah Terverifikasi
                </h3>
                <p className="text-xs text-slate-400">
                  Pilih mentor spesialis yang sesuai dengan sektor kuliner atau kebutuhan pendampingan spesifik Anda
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1 text-xs">
                {[
                  { id: "all", label: "Semua Kategori" },
                  { id: "Aneka Masakan Nusantara", label: "Masakan Nusantara" },
                  { id: "Minuman & Kopi Kekinian", label: "Minuman & Kopi" },
                  { id: "Kue & Roti (Bakery/Pastry)", label: "Bakery / Pastry" },
                  { id: "Camilan & Frozen Food", label: "Frozen Food" },
                  { id: "Katering & Siap Saji", label: "Katering" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilterCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      activeFilterCategory === cat.id
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMentors.map((mentor) => {
                const isCurrent = currentMentor.id === mentor.id;
                return (
                  <div
                    key={mentor.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? "bg-slate-900 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mentor.avatarBgColor} text-white flex items-center justify-center font-bold text-sm shadow border border-white/10 shrink-0`}>
                            {mentor.photoInitials}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                              {mentor.name}
                            </h4>
                            <p className="text-[11px] text-emerald-400 font-medium line-clamp-1">
                              {mentor.title}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              ★ {mentor.rating} ({mentor.totalMentees} UMKM) • {mentor.experienceYears}+ Thn
                            </span>
                          </div>
                        </div>

                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                            Terpilih
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2">
                        {mentor.bio}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {mentor.specialties.slice(0, 2).map((spec, spIdx) => (
                          <span key={spIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {mentor.availableSlots.length} slot jadwal aktif
                      </span>

                      <div className="flex items-center gap-2">
                        {!isCurrent && (
                          <button
                            onClick={() => {
                              setSelectedMentorId(mentor.id);
                              if (onShowToast) {
                                onShowToast(`Mentor terpilih dialihkan ke ${mentor.name}`);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                          >
                            Pilih Mentor
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedMentorId(mentor.id);
                            setIsRequestModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1"
                        >
                          <span>Request Sesi</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MY SESSIONS LIST (JADWAL SESI MENTORSHIP PESERTA) */}
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Jadwal Sesi Mentorship Anda ({mentorshipBookings.length})
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">
              Notifikasi dikirim via Email & WhatsApp
            </span>
          </div>

          {mentorshipBookings.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs space-y-2">
              <p>Belum ada jadwal sesi mentorship yang diajukan.</p>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="text-emerald-400 font-semibold underline hover:text-emerald-300"
              >
                Klik di sini untuk mengajukan sesi pertama Anda bersama {currentMentor.name}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {mentorshipBookings.map((session) => (
                <div
                  key={session.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                        {session.bookingCode}
                      </span>
                      <span className="font-bold text-white">
                        {session.mentorName}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                        Terkonfirmasi ✓
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-snug">
                      Fokus: <span className="text-slate-100 font-medium">{session.focusTopic}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-300">
                        <Clock className="w-3 h-3" />
                        {session.selectedDate} • {session.selectedTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {session.sessionType === "Online Video Call" ? (
                          <Video className="w-3 h-3 text-sky-400" />
                        ) : (
                          <MapPin className="w-3 h-3 text-amber-400" />
                        )}
                        {session.sessionType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => {
                        if (onShowToast) {
                          onShowToast(`Tautan sesi Google Meet untuk ${session.bookingCode} telah disalin ke clipboard!`);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Video className="w-3 h-3 text-emerald-400" />
                      <span>Link Sesi Meet</span>
                    </button>

                    <button
                      onClick={() => handleCancelBooking(session.id)}
                      className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors text-xs"
                      title="Batalkan Sesi"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* REQUEST MENTORSHIP MODAL */}
      <RequestMentorshipModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        mentor={currentMentor}
        profile={profile}
        completedModulesCount={completedModulesCount}
        highestScore={highestScore}
        onConfirmBooking={handleConfirmBooking}
        onShowToast={onShowToast}
      />
    </div>
  );
};
