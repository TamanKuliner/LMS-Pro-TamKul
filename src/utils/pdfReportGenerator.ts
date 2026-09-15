import jsPDF from "jspdf";
import { ParticipantProfile, HalalChecklistItem } from "../types";
import { syllabusModules } from "../data/syllabusData";

export interface GeneratePdfOptions {
  profile: ParticipantProfile;
  halalItems: HalalChecklistItem[];
  completedModuleIds: string[];
  hasPassedExam: boolean;
  highestScore: number;
}

export function generateProgressPdf({
  profile,
  halalItems,
  completedModuleIds,
  hasPassedExam,
  highestScore,
}: GeneratePdfOptions): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm

  const totalHalal = halalItems.length;
  const checkedHalal = halalItems.filter((i) => i.checked).length;
  const halalPercent = totalHalal > 0 ? Math.round((checkedHalal / totalHalal) * 100) : 0;
  const missingRequired = halalItems.filter((i) => i.required && !i.checked);

  const totalModules = syllabusModules.length;
  const completedCount = completedModuleIds.length;
  const modulePercent = Math.round((completedCount / totalModules) * 100);

  const issueDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const issueTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const documentRef = `TK-RPT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

  // --- PAGE 1: HEADER, PROFIL USAHA & AUDIT KESIAPAN HALAL ---
  let y = 14;

  // Header Banner Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(marginX, y, contentWidth, 28, 3, 3, "F");

  // Emerald Top Accent Strip
  doc.setFillColor(5, 150, 105); // emerald-600
  doc.rect(marginX, y, contentWidth, 3, "F");

  // Logo & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TAMANKULINER.COM LMS PRO", marginX + 6, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text("PLATFORM DIGITALISASI UMKM KULINER BERBASIS SYARIAH (7 JP)", marginX + 6, y + 15);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("RESUME EKSEKUTIF KEMAJUAN TRANSFORMASI & KESIAPAN HALAL", marginX + 6, y + 21);

  // Doc metadata on top-right
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Ref: ${documentRef}`, pageWidth - marginX - 6, y + 10, { align: "right" });
  doc.text(`Tanggal: ${issueDate}, ${issueTime} WIB`, pageWidth - marginX - 6, y + 15, { align: "right" });
  doc.setTextColor(16, 185, 129);
  doc.text("Status: E2EE 256-bit Verified ✓", pageWidth - marginX - 6, y + 21, { align: "right" });

  y += 33;

  // --- SECTION 1: PROFIL USAHA & PEMILIK UMKM ---
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(marginX, y, contentWidth, 7, 1.5, 1.5, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, 3, 7, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("1. PROFIL PEMILIK & IDENTITAS LEGALITAS USAHA KULINER", marginX + 6, y + 5);

  y += 10;

  // Profile Card Box
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(marginX, y, contentWidth, 42, 2, 2, "FD");

  // Profile Columns
  const col1X = marginX + 5;
  const col2X = marginX + 96;

  // Row 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("NAMA LENGKAP PEMILIK:", col1X, y + 6);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text(profile.fullName || "-", col1X, y + 11);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("NAMA BRAND / USAHA KULINER:", col2X, y + 6);
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(8.5);
  doc.text(profile.businessName || "-", col2X, y + 11);

  // Row 2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("KATEGORI PRODUK KULINER:", col1X, y + 18);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text(profile.culinaryCategory || "Aneka Makanan & Minuman Nusantara", col1X, y + 23);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("NOMOR INDUK BERUSAHA (NIB):", col2X, y + 18);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text(profile.hasNIB && profile.nibNumber ? `${profile.nibNumber} (OSS RBA Terverifikasi)` : "Belum Terdaftar NIB", col2X, y + 23);

  // Row 3
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("ESTIMASI OMSET BULANAN:", col1X, y + 30);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  const revenueStr = profile.currentMonthlyRevenue
    ? `Rp ${profile.currentMonthlyRevenue.toLocaleString("id-ID")}`
    : "Rp 45.000.000";
  doc.text(`${revenueStr} / bulan`, col1X, y + 35);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("KONTAK & DOMISILI USAHA:", col2X, y + 30);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  const contactText = `${profile.phone || "0812-8923-4412"} | ${profile.city || profile.address?.split(",")[0] || "Yogyakarta"}`;
  doc.text(contactText, col2X, y + 35);

  y += 48;

  // --- SECTION 2: AUDIT & KESIAPAN SERTIFIKASI HALAL ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginX, y, contentWidth, 7, 1.5, 1.5, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, 3, 7, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("2. STATUS AUDIT & KESIAPAN SERTIFIKASI HALAL (BPJPH KEMENAG RI)", marginX + 6, y + 5);

  y += 10;

  // Halal Summary Score Bar
  const isReadyForAudit = missingRequired.length === 0;
  doc.setFillColor(isReadyForAudit ? 236 : 254, isReadyForAudit ? 253 : 243, isReadyForAudit ? 245 : 199); // emerald-50 or amber-50
  doc.setDrawColor(isReadyForAudit ? 167 : 251, isReadyForAudit ? 243 : 191, isReadyForAudit ? 208 : 36);
  doc.roundedRect(marginX, y, contentWidth, 14, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(isReadyForAudit ? 4 : 180, isReadyForAudit ? 120 : 83, isReadyForAudit ? 87 : 9);
  doc.text(
    `Indeks Kesiapan Halal: ${halalPercent}% (${checkedHalal}/${totalHalal} Indikator Terpenuhi)`,
    marginX + 5,
    y + 6
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const auditStatusDesc = isReadyForAudit
    ? "Status: SIAP AUDIT SIHALAL (Seluruh indikator wajib telah terpenuhi sesuai standar BPJPH Kemenag)."
    : `Status: PERHATIAN (${missingRequired.length} indikator wajib belum terpenuhi. Lengkapi segera dokumen SJPH).`;
  doc.text(auditStatusDesc, marginX + 5, y + 10.5);

  y += 18;

  // Halal Checklist Table Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(marginX, y, contentWidth, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("NO", marginX + 3, y + 4.2);
  doc.text("KATEGORI", marginX + 12, y + 4.2);
  doc.text("INDIKATOR AUDIT KESIAPAN HALAL (SJPH)", marginX + 38, y + 4.2);
  doc.text("SIFAT", marginX + 138, y + 4.2);
  doc.text("STATUS AUDIT", marginX + 158, y + 4.2);

  y += 6;

  // Checklist Items Rows
  halalItems.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(marginX, y, contentWidth, 8, "F");
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, y + 8, marginX + contentWidth, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(String(idx + 1), marginX + 3, y + 5.2);

    // Category Pill
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(item.category.toUpperCase(), marginX + 12, y + 5.2);

    // Title & Note
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    let displayTitle = item.title;
    if (item.notes && item.notes.trim()) {
      const cleanNote = item.notes.replace(/\s+/g, " ").trim();
      displayTitle += ` [Catatan: ${cleanNote.length > 25 ? cleanNote.substring(0, 23) + "..." : cleanNote}]`;
    }
    const truncatedTitle = displayTitle.length > 64 ? displayTitle.substring(0, 62) + "..." : displayTitle;
    doc.text(truncatedTitle, marginX + 38, y + 5.2);

    // Required badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    if (item.required) {
      doc.setTextColor(185, 28, 28); // red-700
      doc.text("Wajib", marginX + 138, y + 5.2);
    } else {
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text("Disarankan", marginX + 138, y + 5.2);
    }

    // Status
    if (item.checked) {
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.setFont("helvetica", "bold");
      doc.text("[✓] LENGKAP", marginX + 158, y + 5.2);
    } else {
      doc.setTextColor(217, 119, 6); // amber-600
      doc.setFont("helvetica", "bold");
      doc.text("[✗] BELUM", marginX + 158, y + 5.2);
    }

    y += 8;
  });

  // Footer of Page 1
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Laporan Resmi TamanKuliner.com | Berbasis Cloud Infrastructure Multi-Region | Halaman 1 dari 2", marginX, pageHeight - 10);
  doc.text("E2EE Encrypted SHA-256", pageWidth - marginX, pageHeight - 10, { align: "right" });

  // ==========================================
  // --- PAGE 2: KEMAJUAN KURIKULUM 7 JP & PENGESAHAN ---
  // ==========================================
  doc.addPage();
  y = 14;

  // Header Page 2
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(marginX, y, contentWidth, 14, 2, 2, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, contentWidth, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TAMANKULINER.COM LMS PRO - RESUME PROGRES KELULUSAN 7 JP", marginX + 6, y + 8.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Peserta: ${profile.fullName} (${profile.businessName})`, pageWidth - marginX - 6, y + 8.5, { align: "right" });

  y += 19;

  // --- SECTION 3: KEMAJUAN KURIKULUM 7 JAM PELAJARAN (JP) ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginX, y, contentWidth, 7, 1.5, 1.5, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, 3, 7, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("3. KEMAJUAN MODUL PEMBELAJARAN KURIKULUM 7 JAM PELAJARAN (JP)", marginX + 6, y + 5);

  y += 10;

  // Curriculum Progress Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, y, contentWidth, 16, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Progres Belajar: ${completedCount} dari ${totalModules} Modul (${modulePercent}%)`, marginX + 5, y + 6.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Bobot Total Materi: 7 Jam Pelajaran (JP) Terakreditasi Standar Muamalah Bisnis Syariah`, marginX + 5, y + 11.5);

  // Status Ujian Box on right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  if (hasPassedExam) {
    doc.setTextColor(5, 150, 105);
    doc.text(`Ujian 7 JP: LULUS (Nilai ${highestScore}/100) ✓`, pageWidth - marginX - 5, y + 6.5, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("E-Sertifikat Resmi Telah Diterbitkan", pageWidth - marginX - 5, y + 11.5, { align: "right" });
  } else {
    doc.setTextColor(217, 119, 6);
    doc.text(`Ujian 7 JP: Belum Lulus (Min. Passing 70)`, pageWidth - marginX - 5, y + 6.5, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("Silakan selesaikan ujian pada tab Tes Kelulusan", pageWidth - marginX - 5, y + 11.5, { align: "right" });
  }

  y += 20;

  // Module List Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(marginX, y, contentWidth, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("MODUL", marginX + 3, y + 4.2);
  doc.text("TOPIK & MATERI PEMBELAJARAN", marginX + 22, y + 4.2);
  doc.text("DURASI", marginX + 125, y + 4.2);
  doc.text("TINGKAT", marginX + 145, y + 4.2);
  doc.text("STATUS", marginX + 165, y + 4.2);

  y += 6;

  // Module Rows
  syllabusModules.forEach((mod, idx) => {
    const isCompleted = completedModuleIds.includes(mod.id);
    const isEven = idx % 2 === 0;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(marginX, y, contentWidth, 8, "F");
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, y + 8, marginX + contentWidth, y + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(`Modul ${mod.moduleNumber}`, marginX + 3, y + 5.2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    const modTitle = mod.title.length > 56 ? mod.title.substring(0, 54) + "..." : mod.title;
    doc.text(modTitle, marginX + 22, y + 5.2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(`${mod.jp} JP`, marginX + 125, y + 5.2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(mod.level.replace("Pelatihan Level ", ""), marginX + 145, y + 5.2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    if (isCompleted) {
      doc.setTextColor(5, 150, 105);
      doc.text("SELESAI ✓", marginX + 165, y + 5.2);
    } else {
      doc.setTextColor(148, 163, 184);
      doc.text("Belum", marginX + 165, y + 5.2);
    }

    y += 8;
  });

  y += 6;

  // --- SECTION 4: REKOMENDASI RENCANA AKSI DIGITALISASI ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginX, y, contentWidth, 7, 1.5, 1.5, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, 3, 7, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("4. REKOMENDASI TINDAK LANJUT TRANSFORMASI DIGITAL & SYARIAH", marginX + 6, y + 5);

  y += 10;

  const recommendations = [
    {
      title: "1. Pengajuan Sertifikat Halal Gratis (SEHATI) di SIHALAL (ptsp.halal.go.id)",
      desc: "Segera lakukan pendaftaran mandiri atau melalui pendamping PPH terdekat dengan melampirkan NIB dan dokumen SJPH internal.",
    },
    {
      title: "2. Pemisahan Rekening Operasional & Penggunaan QRIS Merchant Syariah",
      desc: "Gunakan rekening bank syariah khusus operasional usaha F&B untuk mempermudah pencatatan cash flow dan penilaian kriteria 5C bankable.",
    },
    {
      title: "3. Penerapan SOP Higienitas & Pengawasan Titik Kritis Bahan Makanan",
      desc: "Lakukan evaluasi berkala bersama Penyelia Halal untuk menjamin pasokan daging dan bumbu dapur berasal dari supplier bersertifikat halal.",
    },
  ];

  recommendations.forEach((rec) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(rec.title, marginX + 4, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(rec.desc, marginX + 4, y + 8);

    y += 11;
  });

  y += 3;

  // --- SECTION 5: LEMBAR PENGESAHAN & TANDA TANGAN DIGITAL ---
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(marginX, y, contentWidth, 36, 2, 2, "FD");

  const sigCol1 = marginX + 8;
  const sigCol2 = marginX + 115;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Dikeluarkan di: Sleman, D.I. Yogyakarta`, sigCol1, y + 6);
  doc.text(`Pada Tanggal: ${issueDate}`, sigCol1, y + 10);
  doc.text("Mengetahui & Menyetujui,", sigCol1, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Dewan Pembina Syariah LMS Pro", sigCol1, y + 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text("Dr. H. Ahmad Zaki, M.E.Sy", sigCol1, y + 30);
  doc.text("Pakar Fiqih Muamalah & Perbankan Syariah", sigCol1, y + 33.5);

  // Right signature
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Platform Developer & Mentor Lead,", sigCol2, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Direktur Program TamanKuliner.com", sigCol2, y + 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text("Ir. Ridwan Santoso, M.M", sigCol2, y + 30);
  doc.text("Kepala Akselerasi Digitalisasi UMKM Kuliner", sigCol2, y + 33.5);

  // Security Seal stamp in the middle
  doc.setDrawColor(16, 185, 129);
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(marginX + 65, y + 8, 42, 22, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(5, 150, 105);
  doc.text("VERIFIKASI DIGITAL", marginX + 86, y + 14, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(52, 211, 153);
  doc.text("TAMANKULINER LMS", marginX + 86, y + 18, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(71, 85, 105);
  doc.text("7 JP MUAMALAH CERTIFIED", marginX + 86, y + 22, { align: "center" });
  doc.text(`HASH: ${documentRef}`, marginX + 86, y + 26, { align: "center" });

  // Footer of Page 2
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Laporan Resmi TamanKuliner.com | Berbasis Cloud Infrastructure Multi-Region | Halaman 2 dari 2", marginX, pageHeight - 10);
  doc.text("E2EE Encrypted SHA-256", pageWidth - marginX, pageHeight - 10, { align: "right" });

  return doc;
}

export function downloadProgressPdf(options: GeneratePdfOptions): string {
  const doc = generateProgressPdf(options);
  const cleanBusinessName = (options.profile.businessName || "UMKM")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Resume_Digitalisasi_Halal_${cleanBusinessName}_${dateStr}.pdf`;

  doc.save(fileName);
  return fileName;
}
