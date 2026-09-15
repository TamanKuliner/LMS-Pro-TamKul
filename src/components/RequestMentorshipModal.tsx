import React, { useState } from "react";
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Building, 
  User, 
  ArrowRight,
  FileCheck,
  Send,
  MessageSquare
} from "lucide-react";
import { VerifiedMentor, MentorshipRequest } from "../data/mentorsData";
import { ParticipantProfile } from "../types";

interface RequestMentorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: VerifiedMentor;
  profile: ParticipantProfile;
  completedModulesCount: number;
  highestScore?: number;
  onConfirmBooking: (booking: MentorshipRequest) => void;
  onShowToast?: (msg: string) => void;
}

export const RequestMentorshipModal: React.FC<RequestMentorshipModalProps> = ({
  isOpen,
  onClose,
  mentor,
  profile,
  completedModulesCount,
  highestScore = 91,
  onConfirmBooking,
  onShowToast,
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [sessionType, setSessionType] = useState<"Online Video Call" | "Tatap Muka Sleman">("Online Video Call");
  const [focusTopic, setFocusTopic] = useState<string>(
    `Audit Kehalalan Rantai Pasok & Bumbu ${profile.culinaryCategory || "Kuliner"}`
  );
  const [customTopic, setCustomTopic] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<MentorshipRequest | null>(null);

  if (!isOpen) return null;

  const standardTopics = [
    `Audit Kehalalan Rantai Pasok & Bumbu ${profile.culinaryCategory || "Kuliner"}`,
    `Review Kelayakan 5C & Pengajuan Pembiayaan Murabahah Bank Syariah`,
    `Restrukturisasi Pembukuan & Pemisahan Rekening Usaha dari Pribadi`,
    `Strategi Pemasaran Digital Beretika (Anti-Overclaim & Zero-Hype)`,
    `Verifikasi SJPH Mandatori & Pendampingan Pendaftaran SIHALAL BPJPH`,
    `Lainnya (Kebutuhan Khusus)`
  ];

  const selectedSlot = mentor.availableSlots[selectedSlotIndex] || mentor.availableSlots[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingCode = `MNT-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
    const effectiveTopic = focusTopic === "Lainnya (Kebutuhan Khusus)" && customTopic.trim()
      ? customTopic.trim()
      : focusTopic;

    const newBooking: MentorshipRequest = {
      id: `booking-${Date.now()}`,
      bookingCode,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorTitle: mentor.title,
      menteeName: profile.fullName,
      businessName: profile.businessName,
      culinaryCategory: profile.culinaryCategory,
      completedModulesCount,
      focusTopic: effectiveTopic,
      selectedDate: selectedSlot.date,
      selectedTime: selectedSlot.time,
      sessionType,
      notes: notes.trim(),
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    setConfirmedBooking(newBooking);
    setIsSubmitted(true);
    onConfirmBooking(newBooking);

    if (onShowToast) {
      onShowToast(`Alhamdulillah! Sesi Mentorship bersama ${mentor.name} berhasil diajukan (Kode: ${bookingCode}).`);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#16191F] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mentor.avatarBgColor} text-white flex items-center justify-center font-bold text-base shadow-md border border-white/10 shrink-0`}>
              {mentor.photoInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Syariah Expert
                </span>
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                  ★ {mentor.rating} ({mentor.totalMentees} UMKM)
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                {isSubmitted ? "Konfirmasi Sesi Mentorship" : "Ajukan Sesi Mentorship 1-on-1"}
              </h3>
              <p className="text-xs text-slate-400">
                Mentor: <span className="text-slate-200 font-medium">{mentor.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSubmitted && confirmedBooking ? (
          /* SUCCESS STATE */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Sesi Mentorship Berhasil Dikonfirmasi!
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Permintaan konsultasi bisnis syariah Anda telah terdaftar dalam sistem reservasi mentor terverifikasi. Notifikasi pengingat & tautan sesi telah dikirimkan.
              </p>
            </div>

            {/* Booking Details Card */}
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 sm:p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">Kode Booking Resmi:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {confirmedBooking.bookingCode}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 text-[11px] block">Pakar / Mentor:</span>
                  <span className="text-white font-semibold">{confirmedBooking.mentorName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Brand Kuliner Peserta:</span>
                  <span className="text-white font-semibold">
                    {confirmedBooking.businessName} ({confirmedBooking.culinaryCategory})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Jadwal & Waktu:</span>
                  <span className="text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {confirmedBooking.selectedDate} ({confirmedBooking.selectedTime})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Metode Konsultasi:</span>
                  <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                    {confirmedBooking.sessionType === "Online Video Call" ? (
                      <Video className="w-3.5 h-3.5 text-sky-400" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {confirmedBooking.sessionType}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-500 text-[11px] block">Fokus Topik:</span>
                <span className="text-slate-200 font-medium">{confirmedBooking.focusTopic}</span>
              </div>

              {confirmedBooking.notes && (
                <div className="pt-1">
                  <span className="text-slate-500 text-[11px] block">Catatan Tambahan Peserta:</span>
                  <p className="text-slate-300 italic text-[11px] bg-slate-950/60 p-2 rounded border border-slate-800/80 mt-1">
                    "{confirmedBooking.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-950"
              >
                Tutup & Kembali ke Panel
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            {/* Context Notice: Match explanation */}
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Rekomendasi Berdasarkan Profil Anda:</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    {profile.culinaryCategory}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {mentor.progressFocus.rationale}
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 font-mono">
                  <span>Progres Anda: {completedModulesCount}/4 Modul Tuntas</span>
                  <span>•</span>
                  <span>Skor Substansi: {highestScore}/100</span>
                </div>
              </div>
            </div>

            {/* 1. Pilih Topik Konsultasi */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                1. Pilih Fokus Topik Konsultasi Bisnis Syariah
              </label>
              <div className="space-y-1.5">
                {standardTopics.map((topic, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      focusTopic === topic
                        ? "bg-emerald-950/40 border-emerald-500/50 text-white"
                        : "bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="focusTopic"
                      checked={focusTopic === topic}
                      onChange={() => setFocusTopic(topic)}
                      className="mt-0.5 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="leading-snug">{topic}</span>
                  </label>
                ))}
              </div>

              {focusTopic === "Lainnya (Kebutuhan Khusus)" && (
                <div className="pt-1">
                  <input
                    type="text"
                    required
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Tuliskan topik spesifik yang ingin dikonsultasikan..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* 2. Pilihan Waktu / Slot Jadwal Mentor */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>2. Pilih Jadwal Sesi Tersedia</span>
                <span className="text-[10px] text-emerald-400 font-normal">
                  {mentor.availableSlots.length} Slot Tersedia Pekan Ini
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mentor.availableSlots.map((slot, sIdx) => {
                  const isSelected = selectedSlotIndex === sIdx;
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => {
                        setSelectedSlotIndex(sIdx);
                        setSessionType(slot.sessionType);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-600/20 border-emerald-500 text-white shadow-sm"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{slot.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{slot.time}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        slot.sessionType === "Online Video Call"
                          ? "bg-sky-500/10 text-sky-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {slot.sessionType === "Online Video Call" ? "Online" : "Tatap Muka"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Metode Sesi Konsultasi */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                3. Pilihan Media Konsultasi
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSessionType("Online Video Call")}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    sessionType === "Online Video Call"
                      ? "bg-sky-500/20 border-sky-500 text-sky-200 font-semibold"
                      : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Video className="w-4 h-4 text-sky-400" />
                  <span>Online Video Call (Meet)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSessionType("Tatap Muka Sleman")}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    sessionType === "Tatap Muka Sleman"
                      ? "bg-amber-500/20 border-amber-500 text-amber-200 font-semibold"
                      : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Tatap Muka (Sleman Hub)</span>
                </button>
              </div>
            </div>

            {/* 4. Catatan / Pertanyaan Spesifik Usaha */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>4. Pertanyaan / Tantangan Bisnis Kuliner Anda (Opsional)</span>
                <span className="text-[10px] text-slate-500 font-normal">Membantu mentor menyiapkan bahan</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Kami ingin menanyakan alternatif sertifikasi halal untuk pemasok bumbu rempah tradisional dan cara pemisahan kas modal harian..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Profil Pemohon Preview */}
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-slate-500">Pemohon:</span>{" "}
                <span className="text-white font-medium">{profile.fullName}</span> ({profile.businessName})
              </div>
              <div>
                <span className="text-slate-500">Kontak:</span>{" "}
                <span className="text-slate-300">{profile.phone || profile.email}</span>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                id="btn-confirm-mentorship-session"
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Konfirmasi & Ajukan Sesi Mentorship</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
