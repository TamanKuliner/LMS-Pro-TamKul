import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Award, 
  Sparkles, 
  AlertTriangle,
  Printer,
  ChevronRight,
  FileSpreadsheet,
  Check,
  Mail,
  MailCheck,
  Send,
  Eye,
  FileCheck2,
  ExternalLink,
  Layers
} from "lucide-react";
import { ParticipantProfile, HalalChecklistItem } from "../types";
import { syllabusModules } from "../data/syllabusData";
import { downloadProgressPdf } from "../utils/pdfReportGenerator";
import { downloadProgressExcel } from "../utils/excelReportGenerator";

export type ReportFileFormat = "pdf" | "excel";

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  halalItems: HalalChecklistItem[];
  completedModuleIds: string[];
  hasPassedExam: boolean;
  highestScore: number;
  onShowToast?: (msg: string) => void;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  halalItems,
  completedModuleIds,
  hasPassedExam,
  highestScore,
  onShowToast,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ReportFileFormat>("pdf");
  const [activePreviewPage, setActivePreviewPage] = useState<1 | 2>(1);
  const [showFullDocPreview, setShowFullDocPreview] = useState<boolean>(true);
  const [sendToEmail, setSendToEmail] = useState<boolean>(Boolean(profile.email));
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [lastSentTime, setLastSentTime] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalHalal = halalItems.length;
  const checkedHalal = halalItems.filter((i) => i.checked).length;
  const halalPercent = totalHalal > 0 ? Math.round((checkedHalal / totalHalal) * 100) : 0;
  const missingRequired = halalItems.filter((i) => i.required && !i.checked);
  const isHalalReady = missingRequired.length === 0;

  const totalModules = syllabusModules.length;
  const completedCount = completedModuleIds.length;
  const modulePercent = Math.round((completedCount / totalModules) * 100);

  const registeredEmail = profile.email?.trim() || "";

  /**
   * Mock handler that simulates sending the generated document
   * to the email address stored in the user profile state (profile.email).
   */
  const mockSendReportToEmail = async (params: {
    targetEmail: string;
    businessName: string;
    format: ReportFileFormat;
    fileName: string;
  }): Promise<{ success: boolean; timestamp: string; message: string }> => {
    // Artificial latency to simulate server SMTP dispatch & delivery
    await new Promise((resolve) => setTimeout(resolve, 850));

    if (!params.targetEmail || !params.targetEmail.includes("@")) {
      throw new Error("Email bisnis belum terdaftar pada profil pengguna. Silakan perbarui profil Anda.");
    }

    const timeString = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      success: true,
      timestamp: timeString,
      message: `Salinan berkas ${params.fileName} (${params.format.toUpperCase()}) berhasil dikirimkan ke email bisnis: ${params.targetEmail}`,
    };
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setEmailStatus("idle");

      let generatedFileName = "";

      if (selectedFormat === "excel") {
        generatedFileName = downloadProgressExcel({
          profile,
          halalItems,
          completedModuleIds,
          hasPassedExam,
          highestScore,
        });
      } else {
        generatedFileName = downloadProgressPdf({
          profile,
          halalItems,
          completedModuleIds,
          hasPassedExam,
          highestScore,
        });
      }

      // If the user checked "Kirim laporan ke email bisnis saya", trigger mock handler
      if (sendToEmail) {
        setIsSendingEmail(true);
        try {
          const sendResult = await mockSendReportToEmail({
            targetEmail: registeredEmail,
            businessName: profile.businessName,
            format: selectedFormat,
            fileName: generatedFileName,
          });

          setEmailStatus("sent");
          setLastSentTime(sendResult.timestamp);
          if (onShowToast) {
            onShowToast(
              `Dokumen ${selectedFormat.toUpperCase()} "${generatedFileName}" berhasil diunduh dan ${sendResult.message}`
            );
          }
        } catch (emailErr: any) {
          setEmailStatus("error");
          if (onShowToast) {
            onShowToast(
              emailErr?.message || `Dokumen berhasil diunduh, namun email bisnis belum terdaftar di profil.`
            );
          }
        } finally {
          setIsSendingEmail(false);
        }
      } else {
        if (onShowToast) {
          onShowToast(
            `Dokumen ${selectedFormat === "excel" ? "Excel" : "PDF"} "${generatedFileName}" berhasil diunduh!`
          );
        }
      }
    } catch (err) {
      console.error("Gagal men-generate laporan:", err);
      if (onShowToast) {
        onShowToast(`Terjadi kendala saat men-generate file ${selectedFormat.toUpperCase()}. Silakan coba lagi.`);
      }
    } finally {
      setTimeout(() => setIsGenerating(false), 700);
    }
  };

  /**
   * Standalone mock action to simulate dispatching to the registered profile email
   */
  const handleSimulateEmailSend = async () => {
    if (!registeredEmail) {
      if (onShowToast) {
        onShowToast("Alamat email bisnis belum terdaftar di profil pengguna.");
      }
      return;
    }

    setIsSendingEmail(true);
    try {
      const mockFileName = selectedFormat === "excel"
        ? `Laporan_Eksekutif_${(profile.businessName || "UMKM").replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`
        : `Laporan_Eksekutif_${(profile.businessName || "UMKM").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

      const result = await mockSendReportToEmail({
        targetEmail: registeredEmail,
        businessName: profile.businessName,
        format: selectedFormat,
        fileName: mockFileName,
      });

      setEmailStatus("sent");
      setLastSentTime(result.timestamp);
      if (onShowToast) {
        onShowToast(result.message);
      }
    } catch (err: any) {
      setEmailStatus("error");
      if (onShowToast) {
        onShowToast(err?.message || "Gagal mengirimkan simulasi laporan ke email bisnis.");
      }
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#0F1115] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#16191F]/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              selectedFormat === "excel"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            }`}>
              {selectedFormat === "excel" ? (
                <FileSpreadsheet className="w-4 h-4" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 id="report-modal-title" className="text-sm font-bold text-white flex items-center gap-2">
                <span>Resume Eksekutif Transformasi Digital & Halal</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border transition-colors ${
                  selectedFormat === "excel"
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                }`}>
                  {selectedFormat === "excel" ? "Excel (.xlsx)" : "PDF (.pdf)"}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Arsip resmi untuk pengajuan pembiayaan bank syariah, audit BPJPH, & pembukuan UMKM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup pratinjau"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Report Preview */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-300">
          {/* FORMAT SELECTION SECTION */}
          <div id="format-selection-card" className="p-4 rounded-xl bg-[#14171E] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <span>Pilih Format File Laporan</span>
                <span className="text-[10px] font-normal text-slate-400 font-mono">
                  (Pilih sebelum mengunduh)
                </span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Format aktif: <span className="text-emerald-400 font-bold uppercase">{selectedFormat}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: PDF */}
              <button
                type="button"
                id="btn-select-format-pdf"
                onClick={() => setSelectedFormat("pdf")}
                className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  selectedFormat === "pdf"
                    ? "bg-emerald-950/20 border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-xs"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${
                      selectedFormat === "pdf"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>Dokumen PDF Resmi</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300">
                          .pdf
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Format Cetak A4 & Stempel Digital
                      </div>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                    selectedFormat === "pdf"
                      ? "bg-emerald-500 border-emerald-500 text-slate-950"
                      : "border-slate-700 bg-slate-800"
                  }`}>
                    {selectedFormat === "pdf" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                  <p>
                    Cocok untuk: <span className="text-slate-300 font-medium">Lampiran pengajuan bank syariah, cetak fisik, & verifikasi BPJPH.</span>
                  </p>
                  <div className="flex items-center gap-2 pt-0.5 text-[9px] text-slate-500 font-mono">
                    <span>✓ Layout 2 Halaman A4</span>
                    <span>•</span>
                    <span>✓ SHA-256 Hash</span>
                  </div>
                </div>
              </button>

              {/* Option 2: Excel */}
              <button
                type="button"
                id="btn-select-format-excel"
                onClick={() => setSelectedFormat("excel")}
                className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  selectedFormat === "excel"
                    ? "bg-emerald-950/20 border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-xs"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${
                      selectedFormat === "excel"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>Buku Kerja Excel</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300">
                          .xlsx
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Spreadsheet 3 Sheet Terstruktur
                      </div>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                    selectedFormat === "excel"
                      ? "bg-emerald-500 border-emerald-500 text-slate-950"
                      : "border-slate-700 bg-slate-800"
                  }`}>
                    {selectedFormat === "excel" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                  <p>
                    Cocok untuk: <span className="text-slate-300 font-medium">Olah data mandiri, audit internal, input akuntansi, & filter tabel.</span>
                  </p>
                  <div className="flex items-center gap-2 pt-0.5 text-[9px] text-slate-500 font-mono">
                    <span>✓ 3 Sheet Workbook</span>
                    <span>•</span>
                    <span>✓ Editable & Kolom Teratur</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* AUTO-EMAIL DELIVERY TOGGLE SECTION */}
          <div
            id="email-report-delivery-card"
            className={`p-4 rounded-xl border transition-all ${
              sendToEmail
                ? "bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/30"
                : "bg-[#14171E] border-slate-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 transition-colors ${
                    sendToEmail
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label
                      htmlFor="checkbox-auto-email-report"
                      className="text-xs font-bold text-white cursor-pointer select-none"
                    >
                      Kirim laporan ke email bisnis saya
                    </label>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border transition-colors ${
                        sendToEmail
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-slate-800 text-slate-500 border-slate-700"
                      }`}
                    >
                      {sendToEmail ? "Aktif" : "Nonaktif"}
                    </span>
                    {emailStatus === "sending" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <div className="w-2.5 h-2.5 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin" />
                        Mengirim...
                      </span>
                    )}
                    {emailStatus === "sent" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        Terkirim {lastSentTime ? `(${lastSentTime})` : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Otomatis kirimkan berkas laporan ({selectedFormat.toUpperCase()}) ke alamat email yang tersimpan di profil bisnis:
                  </p>
                  <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                    <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 inline-flex items-center gap-1.5 shadow-inner">
                      <MailCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{registeredEmail || "Belum ada email bisnis terdaftar di profil"}</span>
                    </span>
                    {!registeredEmail && (
                      <span className="text-[10px] text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                        Lengkapi email di menu profil agar simulasi email berhasil
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* The Checkbox Toggle Control */}
              <div className="flex items-center gap-3 self-end sm:self-center shrink-0 pt-1 sm:pt-0">
                <label
                  htmlFor="checkbox-auto-email-report"
                  className="flex items-center gap-2.5 cursor-pointer select-none group"
                >
                  <input
                    type="checkbox"
                    id="checkbox-auto-email-report"
                    checked={sendToEmail}
                    onChange={(e) => {
                      setSendToEmail(e.target.checked);
                      setEmailStatus("idle");
                    }}
                    className="sr-only"
                  />
                  {/* Custom Checkbox visual */}
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      sendToEmail
                        ? "bg-emerald-500 border-emerald-500 text-slate-950 shadow-xs"
                        : "bg-slate-900 border-slate-700 group-hover:border-slate-500"
                    }`}
                  >
                    {sendToEmail && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Toggle Switch visual */}
                  <div
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      sendToEmail ? "bg-emerald-500" : "bg-slate-700 group-hover:bg-slate-600"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        sendToEmail ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>

            {sendToEmail && (
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3 h-3 shrink-0" />
                  <span>
                    Dokumen akan disimulasikan terkirim ke <strong>{registeredEmail || "email profil"}</strong> menggunakan mock dispatch service.
                  </span>
                </div>

                {registeredEmail && (
                  <button
                    type="button"
                    onClick={handleSimulateEmailSend}
                    disabled={isSendingEmail || isGenerating}
                    className="self-start sm:self-auto px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    title="Uji coba pengiriman dokumen ke email secara langsung"
                  >
                    {isSendingEmail ? (
                      <>
                        <div className="w-2.5 h-2.5 border-2 border-emerald-400/40 border-t-emerald-400 rounded-full animate-spin" />
                        <span>Mengirim Simulasi...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-2.5 h-2.5" />
                        <span>Uji Kirim Email Sekarang</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* VISUAL DOCUMENT PREVIEW (PRATINJAU DOKUMEN CETAK A4) */}
          <div id="pdf-visual-preview-section" className="rounded-xl border border-slate-700/80 bg-slate-950/90 overflow-hidden shadow-xl space-y-0">
            {/* Preview Toolbar */}
            <div className="px-4 py-2.5 bg-[#141720] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Pratinjau Tata Letak Lembar Dokumen</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-normal">
                      (A4 Print-Ready)
                    </span>
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Pastikan seluruh data profil, kesiapan halal, dan modul 7 JP telah akurat sebelum diunduh
                  </p>
                </div>
              </div>

              {/* Page Switcher and Toggle Full View */}
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setActivePreviewPage(1)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-all ${
                      activePreviewPage === 1
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Halaman 1 (Profil & Halal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewPage(2)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-all ${
                      activePreviewPage === 2
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Halaman 2 (7 JP & Pengesahan)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFullDocPreview((prev) => !prev)}
                  className="px-2 py-1 rounded text-[10px] font-mono text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
                >
                  {showFullDocPreview ? "Sembunyikan Visual" : "Tampilkan Visual"}
                </button>
              </div>
            </div>

            {/* Visual Canvas Simulation of A4 Paper */}
            {showFullDocPreview && (
              <div className="p-3 sm:p-5 bg-slate-900/60 flex justify-center">
                <div
                  id="a4-document-preview-sheet"
                  className="w-full max-w-2xl bg-white text-slate-900 rounded-lg shadow-2xl p-5 sm:p-7 space-y-4 font-sans border border-slate-200 transition-all select-none"
                >
                  {/* Page indicator header banner */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Tamankuliner.com Digital Certificate & LMS
                    </span>
                    <span>
                      Halaman <strong className="text-slate-900">{activePreviewPage}</strong> dari 2 (A4 Standard)
                    </span>
                  </div>

                  {activePreviewPage === 1 ? (
                    /* PAGE 1 CONTENT SIMULATION */
                    <div className="space-y-4">
                      {/* Document Letterhead */}
                      <div className="bg-slate-900 text-white rounded-lg p-3.5 relative overflow-hidden border-t-4 border-emerald-500 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="text-[13px] font-black tracking-wide text-white">
                              TAMANKULINER.COM LMS PRO
                            </div>
                            <div className="text-[9px] font-semibold text-emerald-400 tracking-wider">
                              PLATFORM DIGITALISASI UMKM KULINER BERBASIS SYARIAH (7 JP)
                            </div>
                            <div className="text-[11px] font-bold text-slate-100 mt-1">
                              RESUME EKSEKUTIF KEMAJUAN TRANSFORMASI & KESIAPAN HALAL
                            </div>
                          </div>
                          <div className="text-right text-[8px] sm:text-[9px] text-slate-400 font-mono space-y-0.5 border-t sm:border-t-0 pt-1 sm:pt-0 border-slate-800">
                            <div>Ref: TK-RPT-2026-OFFICIAL</div>
                            <div>Tanggal: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
                            <div className="text-emerald-400 font-semibold">Status: E2EE 256-bit Verified ✓</div>
                          </div>
                        </div>
                      </div>

                      {/* Section 1: Profil Usaha */}
                      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                        <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5 text-[11px] font-bold text-slate-900">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          <span>1. PROFIL PEMILIK & IDENTITAS LEGALITAS USAHA KULINER</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div>
                            <span className="text-slate-500 text-[9px] block">NAMA LENGKAP PEMILIK:</span>
                            <span className="font-bold text-slate-900">{profile.fullName || "-"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[9px] block">NAMA BRAND / USAHA KULINER:</span>
                            <span className="font-bold text-emerald-700">{profile.businessName || "-"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[9px] block">KATEGORI PRODUK:</span>
                            <span className="text-slate-800">{profile.culinaryCategory || "Makanan & Minuman"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[9px] block">NOMOR INDUK BERUSAHA (NIB):</span>
                            <span className="font-mono font-bold text-slate-900">
                              {profile.hasNIB && profile.nibNumber ? `${profile.nibNumber} (OSS RBA)` : "Belum terdaftar"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[9px] block">ESTIMASI OMSET BULANAN:</span>
                            <span className="font-mono text-slate-900 font-semibold">
                              Rp {profile.currentMonthlyRevenue?.toLocaleString("id-ID") || "45.000.000"} / bulan
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[9px] block">KONTAK & DOMISILI:</span>
                            <span className="text-slate-800">{profile.phone || "-"} • {profile.city || "Yogyakarta"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Halal Readiness Audit */}
                      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-900">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <span>2. STATUS AUDIT & KESIAPAN SERTIFIKASI HALAL (BPJPH KEMENAG RI)</span>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                            isHalalReady
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}>
                            {halalPercent}% Terpenuhi
                          </span>
                        </div>

                        {/* Halal Status banner */}
                        <div className={`p-2 rounded border text-[10px] ${
                          isHalalReady
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-amber-50 border-amber-200 text-amber-900"
                        }`}>
                          <strong>Status:</strong> {isHalalReady
                            ? "SIAP AUDIT SIHALAL (Seluruh indikator wajib telah terpenuhi sesuai standar BPJPH Kemenag)."
                            : `PERHATIAN (${missingRequired.length} butir wajib belum lengkap. Lengkapi segera dokumen SJPH).`}
                        </div>

                        {/* Checklist Items preview table */}
                        <div className="border border-slate-200 rounded overflow-hidden text-[9px]">
                          <div className="bg-slate-800 text-white font-bold grid grid-cols-12 px-2 py-1">
                            <span className="col-span-1">NO</span>
                            <span className="col-span-3">KATEGORI</span>
                            <span className="col-span-6">INDIKATOR AUDIT KESIAPAN HALAL (SJPH)</span>
                            <span className="col-span-2 text-right">STATUS</span>
                          </div>
                          <div className="divide-y divide-slate-200 max-h-36 overflow-y-auto bg-white">
                            {halalItems.map((item, idx) => (
                              <div key={item.id} className="grid grid-cols-12 px-2 py-1 items-center hover:bg-slate-50">
                                <span className="col-span-1 text-slate-500 font-mono">{idx + 1}</span>
                                <span className="col-span-3 font-semibold text-slate-600 truncate">{item.category}</span>
                                <span className="col-span-6 truncate text-slate-800 pr-1">
                                  {item.title} {item.required && <span className="text-red-600 font-bold">*Wajib</span>}
                                </span>
                                <span className={`col-span-2 text-right font-mono font-bold ${
                                  item.checked ? "text-emerald-700" : "text-amber-700"
                                }`}>
                                  {item.checked ? "LENGKAP ✓" : "BELUM ✗"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-[8px] text-slate-400 text-right pt-1 font-mono">
                        Halaman 1 selesai • Lanjut ke Halaman 2 untuk Progres Kurikulum 7 JP & Pengesahan
                      </div>
                    </div>
                  ) : (
                    /* PAGE 2 CONTENT SIMULATION */
                    <div className="space-y-4">
                      {/* Header Page 2 */}
                      <div className="bg-slate-900 text-white rounded-lg p-2.5 flex items-center justify-between border-t-2 border-emerald-500">
                        <span className="text-[11px] font-bold tracking-wide">
                          TAMANKULINER.COM LMS PRO - RESUME PROGRES KELULUSAN 7 JP
                        </span>
                        <span className="text-[9px] font-mono text-slate-300">
                          {profile.businessName}
                        </span>
                      </div>

                      {/* Section 3: 7 JP Curriculum */}
                      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-900">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <span>3. KEMAJUAN MODUL PEMBELAJARAN KURIKULUM 7 JAM PELAJARAN (JP)</span>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            {completedCount}/6 Modul ({modulePercent}%)
                          </span>
                        </div>

                        {/* Exam Status Badge */}
                        <div className={`p-2 rounded border text-[10px] flex items-center justify-between ${
                          hasPassedExam
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-amber-50 border-amber-200 text-amber-900"
                        }`}>
                          <span>
                            <strong>Hasil Ujian 7 JP:</strong>{" "}
                            {hasPassedExam
                              ? `LULUS dengan Skor ${highestScore}/100 (Passing Grade 70 Terlampaui) ✓`
                              : "Dalam Proses (Belum Lulus Passing Grade 70)"}
                          </span>
                          <span className="font-mono text-[9px] font-bold">
                            {hasPassedExam ? "SERTIFIKAT RESMI TERBIT" : "PERLU RETAKE"}
                          </span>
                        </div>

                        {/* Module Table */}
                        <div className="border border-slate-200 rounded overflow-hidden text-[9px] bg-white">
                          <div className="bg-slate-800 text-white font-bold grid grid-cols-12 px-2 py-1">
                            <span className="col-span-2">MODUL</span>
                            <span className="col-span-7">TOPIK & MATERI</span>
                            <span className="col-span-1 text-center">JP</span>
                            <span className="col-span-2 text-right">STATUS</span>
                          </div>
                          <div className="divide-y divide-slate-200">
                            {syllabusModules.map((mod) => {
                              const isCompleted = completedModuleIds.includes(mod.id);
                              return (
                                <div key={mod.id} className="grid grid-cols-12 px-2 py-1 items-center hover:bg-slate-50">
                                  <span className="col-span-2 font-mono font-semibold text-slate-700">
                                    Modul {mod.moduleNumber}
                                  </span>
                                  <span className="col-span-7 truncate text-slate-800 font-medium">
                                    {mod.title}
                                  </span>
                                  <span className="col-span-1 text-center font-mono text-slate-600">
                                    {mod.jp} JP
                                  </span>
                                  <span className={`col-span-2 text-right font-mono font-bold ${
                                    isCompleted ? "text-emerald-700" : "text-slate-400"
                                  }`}>
                                    {isCompleted ? "SELESAI ✓" : "BELUM"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Section 4 & 5: Recommendations & Signatures with Official Stamp */}
                      <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
                        <div className="text-[10px] font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center justify-between">
                          <span>LEMBAR PENGESAHAN & TANDA TANGAN DIGITAL RESMI</span>
                          <span className="text-[8px] font-mono text-slate-500">Dikeluarkan: D.I. Yogyakarta</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[9px] items-center pt-1">
                          {/* Signature Left */}
                          <div className="text-center p-2 rounded bg-slate-50 border border-slate-200/80">
                            <div className="text-slate-500 text-[8px]">Mengetahui & Menyetujui:</div>
                            <div className="h-9 flex items-center justify-center font-serif text-slate-700 italic text-[11px] font-bold">
                              Dr. H. Ahmad Zaki
                            </div>
                            <div className="font-bold text-slate-900 text-[9px]">Dewan Pembina Syariah</div>
                            <div className="text-[8px] text-slate-500">Pakar Fiqih Muamalah</div>
                          </div>

                          {/* Official Verified Stamp Badge Center */}
                          <div className="text-center p-2 rounded-lg bg-emerald-50 border border-emerald-300 space-y-0.5 shadow-inner">
                            <div className="w-5 h-5 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px]">
                              ✓
                            </div>
                            <div className="font-bold text-emerald-900 text-[9px] tracking-wider uppercase">
                              VERIFIKASI DIGITAL
                            </div>
                            <div className="text-[8px] font-mono text-emerald-700">TAMANKULINER LMS PRO</div>
                            <div className="text-[7px] text-slate-500 font-mono">HASH: TK-RPT-2026-CERT</div>
                          </div>

                          {/* Signature Right */}
                          <div className="text-center p-2 rounded bg-slate-50 border border-slate-200/80">
                            <div className="text-slate-500 text-[8px]">Direktur Pelaksana:</div>
                            <div className="h-9 flex items-center justify-center font-serif text-slate-700 italic text-[11px] font-bold">
                              Ir. Ridwan Santoso
                            </div>
                            <div className="font-bold text-slate-900 text-[9px]">Direktur Program LMS</div>
                            <div className="text-[8px] text-slate-500">Akselerasi UMKM Kuliner</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-[8px] text-slate-400 text-right font-mono">
                        Dokumen digital sah yang diakreditasi untuk permohonan pembiayaan bank syariah & audit BPJPH.
                      </div>
                    </div>
                  )}

                  {/* Document sheet page footer */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-400 font-mono">
                    <span>Laporan Resmi TamanKuliner.com • Platform Digitalisasi UMKM Kuliner</span>
                    <span>Halaman {activePreviewPage} dari 2 • SHA-256 E2EE Verified</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Quick Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium">Usaha Terdaftar</div>
                <div className="text-xs font-bold text-white truncate">{profile.businessName}</div>
                <div className="text-[9px] text-emerald-400 font-mono">NIB: {profile.nibNumber || "OSS RBA"}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium">Kesiapan Audit Halal</div>
                <div className="text-xs font-bold text-emerald-400">{halalPercent}% Terpenuhi</div>
                <div className="text-[9px] text-slate-400">
                  {isHalalReady ? "Siap Daftar SIHALAL" : `${missingRequired.length} butir wajib tersisa`}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium">Kurikulum 7 JP</div>
                <div className="text-xs font-bold text-white">
                  {completedCount}/{totalModules} Modul ({modulePercent}%)
                </div>
                <div className="text-[9px] text-amber-400 font-mono">
                  {hasPassedExam ? `Lulus Ujian (${highestScore}/100)` : "Ujian Dalam Proses"}
                </div>
              </div>
            </div>
          </div>

          {/* Document Section 1: Profil Usaha */}
          <div className="p-4 rounded-xl bg-[#16191F] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>1. Profil & Legalitas Pelaku Usaha</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">E2EE Verified</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Nama Pemilik:</span>
                <span className="font-semibold text-white">{profile.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Nama Usaha Kuliner:</span>
                <span className="font-semibold text-emerald-400">{profile.businessName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Kategori Makanan / Minuman:</span>
                <span className="text-slate-300">{profile.culinaryCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Nomor Induk Berusaha (NIB):</span>
                <span className="font-mono text-white">
                  {profile.hasNIB ? `${profile.nibNumber} (Terverifikasi OSS RBA)` : "Belum terdaftar"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Estimasi Omset Bulanan:</span>
                <span className="font-mono text-white">
                  Rp {profile.currentMonthlyRevenue?.toLocaleString("id-ID") || "45.000.000"} / bulan
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Kontak & Domisili:</span>
                <span className="text-slate-300">
                  {profile.phone} • {profile.city || profile.address?.split(",")[0] || "Yogyakarta"}
                </span>
              </div>
            </div>
          </div>

          {/* Document Section 2: Audit Halal Readiness */}
          <div className="p-4 rounded-xl bg-[#16191F] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>2. Kesiapan Sertifikasi Halal BPJPH (SJPH)</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isHalalReady
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}>
                {halalPercent}% Terpenuhi
              </span>
            </div>

            <div className="space-y-1.5">
              {halalItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.checked ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 font-mono text-slate-400 shrink-0">
                        {item.category}
                      </span>
                      <span className={`truncate ${item.checked ? "text-slate-200" : "text-slate-400"}`}>
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.required && (
                        <span className="text-[9px] text-red-400 font-semibold">Wajib</span>
                      )}
                      <span className={`text-[10px] font-mono font-bold ${
                        item.checked ? "text-emerald-400" : "text-amber-400"
                      }`}>
                        {item.checked ? "Lengkap ✓" : "Belum ✗"}
                      </span>
                    </div>
                  </div>

                  {item.notes && item.notes.trim() && (
                    <div className="ml-4 pl-2 border-l border-emerald-500/40 text-[10px] text-slate-400 italic">
                      Catatan: <span className="text-slate-300 not-italic">{item.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Document Section 3: Modul 7 JP Selesai */}
          <div className="p-4 rounded-xl bg-[#16191F] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>3. Progres Kurikulum 7 Jam Pelajaran (JP)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {completedCount}/6 Modul ({modulePercent}%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {syllabusModules.map((mod) => {
                const isCompleted = completedModuleIds.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
                      isCompleted
                        ? "bg-emerald-500/5 border-emerald-500/20 text-slate-200"
                        : "bg-slate-900/50 border-slate-800 text-slate-500"
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="text-[10px] font-mono text-slate-400">Modul {mod.moduleNumber} • {mod.jp} JP</div>
                      <div className="truncate font-medium">{mod.title}</div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold shrink-0 ${
                      isCompleted ? "text-emerald-400" : "text-slate-600"
                    }`}>
                      {isCompleted ? "SELESAI ✓" : "BELUM"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">Uji Kelulusan Fiqih & Muamalah</span>
              </div>
              <div className="font-mono text-xs">
                {hasPassedExam ? (
                  <span className="text-emerald-400 font-bold">LULUS (Skor: {highestScore}/100)</span>
                ) : (
                  <span className="text-amber-400 font-semibold">Passing Grade 70 (Belum Lulus)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-800 bg-[#16191F]/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap">
            {selectedFormat === "excel" ? (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Format Excel (.xlsx) mencakup 3 sheet interaktif untuk pelaporan audit dan arsip pembukuan.</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Dokumen PDF dilengkapi tata letak A4 resmi, enkripsi SHA-256, dan stempel digital resmi.</span>
              </>
            )}
            {sendToEmail && registeredEmail && (
              <span className="text-emerald-400 font-medium inline-flex items-center gap-1 pl-1">
                • <Mail className="w-3 h-3 text-emerald-400 inline" /> Auto-email ke {registeredEmail}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Tutup
            </button>

            <button
              id="btn-download-report-file"
              onClick={handleDownload}
              disabled={isGenerating || isSendingEmail}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              {isGenerating || isSendingEmail ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {sendToEmail && registeredEmail
                      ? `Membuat & Mengirim ${selectedFormat.toUpperCase()}...`
                      : `Membuat File ${selectedFormat.toUpperCase()}...`}
                  </span>
                </>
              ) : (
                <>
                  {sendToEmail && registeredEmail ? (
                    <Send className="w-3.5 h-3.5" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {sendToEmail && registeredEmail
                      ? selectedFormat === "excel"
                        ? "Unduh & Kirim ke Email (.xlsx)"
                        : "Unduh & Kirim ke Email (.pdf)"
                      : selectedFormat === "excel"
                      ? "Unduh Buku Kerja Excel (.xlsx)"
                      : "Unduh Dokumen PDF Resmi (.pdf)"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
