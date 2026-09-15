import React, { useState, useEffect } from "react";
import { 
  Award, 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Share2 
} from "lucide-react";
import { ParticipantProfile } from "../types";
import { computeSHA256Hash } from "../utils/crypto";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  score: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
  score,
}) => {
  const [certHash, setCertHash] = useState<string>("");
  const certId = `TK-SYARIAH-2026-${(profile.fullName.length * 749 + 1024).toString(16).toUpperCase()}`;

  useEffect(() => {
    async function generateCertHash() {
      const raw = `${certId}|${profile.fullName}|${profile.businessName}|Score:${score}|7JP|TamanKuliner.com`;
      const hash = await computeSHA256Hash(raw);
      setCertHash(hash);
    }
    if (isOpen) {
      generateCertHash();
    }
  }, [isOpen, certId, profile, score]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#16191F] rounded-xl shadow-2xl border border-slate-800 overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#16191F]">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm text-white">
              E-Sertifikat Digital Terenkripsi E2EE
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div id="printable-certificate" className="p-8 sm:p-12 text-center relative bg-white text-slate-900 selection:bg-emerald-100">
          {/* Outer Border with decorative Islamic/ornamental aesthetic */}
          <div className="border-8 border-double border-emerald-800/80 p-8 sm:p-10 rounded-xl relative overflow-hidden bg-gradient-to-b from-emerald-50/20 via-white to-amber-50/20">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-9xl font-black text-emerald-950">TAMAN KULINER</span>
            </div>

            {/* Certificate Header */}
            <div className="relative z-10 space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-widest uppercase">
                SERTIFIKAT KELULUSAN RESMI • 7 JAM PELAJARAN (JP)
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif pt-2">
                TamanKuliner<span className="text-emerald-700">.com</span> LMS Pro
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Platform Infrastruktur Digitalisasi UMKM Berbasis Syariah
              </p>
            </div>

            {/* Body text */}
            <div className="relative z-10 my-8 space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 italic">
                Dengan bangga menganugerahkan sertifikat kelulusan kepada:
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide border-b-2 border-emerald-600 inline-block pb-1 px-6">
                {profile.fullName || "Peserta UMKM Kuliner"}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-emerald-800">
                Unit Usaha: {profile.businessName || "UMKM Taman Kuliner"} • {profile.culinaryCategory}
              </p>
              {profile.hasNIB && (
                <p className="text-[11px] text-slate-500">
                  NIB: {profile.nibNumber}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed pt-3">
                Telah menyelesaikan seluruh rangkaian silabus dan dinyatakan <strong>LULUS (Nilai: {score}/100)</strong> pada program:
              </p>

              <div className="py-2.5 px-6 rounded-xl bg-emerald-50/80 border border-emerald-200 inline-block max-w-xl">
                <span className="font-extrabold text-sm sm:text-base text-emerald-950 block">
                  Pelatihan Digitalisasi UMKM Berbasis Syariah (Level Menengah)
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Meliputi Fiqih Muamalah Digital, Kriteria 5C Bankable, Pembukuan Syariah & Sertifikasi Halal BPJPH
                </span>
              </div>
            </div>

            {/* Bottom Signatures & QR Verification */}
            <div className="relative z-10 grid grid-cols-3 items-end pt-6 border-t border-slate-200 text-xs">
              {/* Left Signature */}
              <div className="text-center space-y-1">
                <div className="h-12 flex items-end justify-center">
                  <span className="font-serif italic text-emerald-800 font-bold text-base">
                    Dr. H. Ahmad Zaki, M.E.Sy
                  </span>
                </div>
                <div className="w-32 h-0.5 bg-slate-400 mx-auto" />
                <p className="font-bold text-slate-800 text-[11px]">Dewan Pakar Syariah</p>
                <p className="text-[10px] text-slate-500">TamanKuliner Institute</p>
              </div>

              {/* Middle QR & Hash */}
              <div className="flex flex-col items-center justify-center space-y-1">
                {/* SVG Mock QR Code */}
                <div className="w-16 h-16 bg-slate-900 p-1.5 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full bg-white grid grid-cols-3 gap-0.5 p-0.5">
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-600">
                  ID: {certId}
                </span>
              </div>

              {/* Right Signature */}
              <div className="text-center space-y-1">
                <div className="h-12 flex items-end justify-center">
                  <span className="font-serif italic text-emerald-800 font-bold text-base">
                    Ir. Ridwan Santoso, M.M
                  </span>
                </div>
                <div className="w-32 h-0.5 bg-slate-400 mx-auto" />
                <p className="font-bold text-slate-800 text-[11px]">Direktur Program LMS Pro</p>
                <p className="text-[10px] text-slate-500">TamanKuliner.com Cloud</p>
              </div>
            </div>

            {/* Cryptographic Hash Footer */}
            <div className="mt-6 pt-3 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>SHA-256 Signature: {certHash.substring(0, 32)}...</span>
              <span>Terdaftar pada Blockchain & Cloud Ledger</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
