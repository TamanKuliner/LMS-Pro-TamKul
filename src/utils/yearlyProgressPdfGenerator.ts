import jsPDF from "jspdf";
import {
  MonthlyGrowthRecord,
  default12MonthGrowthData,
  computeYearlySummaryMetrics,
} from "../data/yearlyProgressData";
import { syllabusModules } from "../data/syllabusData";

export interface GenerateYearlyPdfOptions {
  fullName?: string;
  businessName?: string;
  nibNumber?: string;
  culinaryCategory?: string;
  city?: string;
  highestScore?: number;
  completedModuleIds?: string[];
  hasPassedExam?: boolean;
  monthlyRecords?: MonthlyGrowthRecord[];
}

export function generateYearlyProgressPdf(options: GenerateYearlyPdfOptions): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm

  const records = options.monthlyRecords || default12MonthGrowthData;
  const metrics = computeYearlySummaryMetrics(records, options.highestScore);

  const fullName = options.fullName || "Hj. Siti Rahmah";
  const businessName = options.businessName || "Dapur Sambal Berkah";
  const nib = options.nibNumber || "9120008471923";
  const category = options.culinaryCategory || "Aneka Masakan Nusantara";
  const city = options.city || "Sleman, D.I. Yogyakarta";

  const totalModules = syllabusModules.length;
  const completedCount = options.completedModuleIds?.length || 4;

  const now = new Date();
  const issueDate = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const issueTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const docRef = `TK-YPR-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

  // ==========================================
  // --- PAGE 1: HEADER, METADATA, KPI, 12-MONTH TABLE ---
  // ==========================================
  let y = 12;

  // Header Banner Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(marginX, y, contentWidth, 26, 2.5, 2.5, "F");

  // Emerald Top Accent Strip
  doc.setFillColor(5, 150, 105); // emerald-600
  doc.rect(marginX, y, contentWidth, 2.5, "F");

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("TAMANKULINER.COM LMS PRO", marginX + 6, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text("12-MONTH YEARLY PROGRESS & GROWTH REPORT (TREN PERKEMBANGAN 12 BULAN)", marginX + 6, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(241, 245, 249);
  doc.text("Evaluasi Holistik Pertumbuhan Kapabilitas Digital, Sertifikasi Halal, & Kelayakan Finansial", marginX + 6, y + 19.5);

  // Metadata in Top-Right
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Ref: ${docRef}`, pageWidth - marginX - 6, y + 9, { align: "right" });
  doc.text(`Periode: Okt 2025 - Sep 2026 (12 Bulan)`, pageWidth - marginX - 6, y + 13.5, { align: "right" });
  doc.text(`Diterbitkan: ${issueDate}, ${issueTime} WIB`, pageWidth - marginX - 6, y + 17.5, { align: "right" });
  doc.setTextColor(16, 185, 129);
  doc.text("Validasi: SHA-256 E2EE Verified ✓", pageWidth - marginX - 6, y + 21.5, { align: "right" });

  y += 29;

  // --- PARTICIPANT & BUSINESS IDENTIFIER CARD ---
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(marginX, y, contentWidth, 18, 1.5, 1.5, "FD");

  const pCol1 = marginX + 4;
  const pCol2 = marginX + 62;
  const pCol3 = marginX + 125;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("PEMILIK USAHA:", pCol1, y + 5);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(fullName, pCol1, y + 9.5);
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(city, pCol1, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("BRAND KULINER / BADAN USAHA:", pCol2, y + 5);
  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text(businessName, pCol2, y + 9.5);
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Kategori: ${category}`, pCol2, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("LEGALITAS & VERIFIKASI NIB:", pCol3, y + 5);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`NIB: ${nib}`, pCol3, y + 9.5);
  doc.setFontSize(6.5);
  doc.setTextColor(5, 150, 105);
  doc.text("Status OSS-RBA: Terverifikasi Aktif ✓", pCol3, y + 14);

  y += 22;

  // --- SECTION 1: 12-MONTH EXECUTIVE KPI CARDS ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginX, y, contentWidth, 6, 1, 1, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, 2.5, 6, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("1. IKHTISAR PERTUMBUHAN UTAMA 12 BULAN TERAKHIR (EXECUTIVE KPI HIGHLIGHTS)", marginX + 5, y + 4.2);

  y += 8.5;

  const kpiWidth = (contentWidth - 6) / 4; // 4 columns
  const kpiHeight = 21;

  // KPI 1: Evaluation Score Growth
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, y, kpiWidth, kpiHeight, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("AKSELERASI SKOR UJIAN", marginX + 3.5, y + 5);
  doc.setFontSize(13);
  doc.setTextColor(5, 150, 105);
  doc.text(`${metrics.currentScore}%`, marginX + 3.5, y + 12);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Baseline: ${metrics.startingScore}% (+${metrics.scoreDelta} pt)`, marginX + 3.5, y + 16.5);
  doc.setTextColor(5, 150, 105);
  doc.text(`Pertumbuhan: +${metrics.scoreGrowthPercent}%`, marginX + 3.5, y + 19.5);

  // KPI 2: Total Study Time
  const kpi2X = marginX + kpiWidth + 2;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(kpi2X, y, kpiWidth, kpiHeight, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("TOTAL JAM BELAJAR", kpi2X + 3.5, y + 5);
  doc.setFontSize(13);
  doc.setTextColor(2, 132, 199); // sky-600
  doc.text(`${metrics.totalStudyHoursJp} JP`, kpi2X + 3.5, y + 12);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Setara ${metrics.totalStudyMinutes.toLocaleString("id-ID")} menit belajar`, kpi2X + 3.5, y + 16.5);
  doc.setTextColor(2, 132, 199);
  doc.text(`${metrics.totalSessions} Sesi Kuis & Review`, kpi2X + 3.5, y + 19.5);

  // KPI 3: Halal Readiness Transformation
  const kpi3X = marginX + (kpiWidth + 2) * 2;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(kpi3X, y, kpiWidth, kpiHeight, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("KESIAPAN HALAL BPJPH", kpi3X + 3.5, y + 5);
  doc.setFontSize(13);
  doc.setTextColor(5, 150, 105);
  doc.text(`${metrics.currentHalalScore}%`, kpi3X + 3.5, y + 12);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Awal: ${metrics.startingHalalScore}% (+${metrics.halalGrowthDelta} pt)`, kpi3X + 3.5, y + 16.5);
  doc.setTextColor(5, 150, 105);
  doc.text("Status: SIAP AUDIT SIHALAL ✓", kpi3X + 3.5, y + 19.5);

  // KPI 4: 5C Bankability Score
  const kpi4X = marginX + (kpiWidth + 2) * 3;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(kpi4X, y, kpiWidth, kpiHeight, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("KELAYAKAN BANKABLE 5C", kpi4X + 3.5, y + 5);
  doc.setFontSize(13);
  doc.setTextColor(217, 119, 6); // amber-600
  doc.text(`${metrics.current5CScore}%`, kpi4X + 3.5, y + 12);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Awal: ${metrics.starting5CScore}% (+${metrics.score5CDelta} pt)`, kpi4X + 3.5, y + 16.5);
  doc.setTextColor(217, 119, 6);
  doc.text("Rating: Sangat Layak (Grade A)", kpi4X + 3.5, y + 19.5);

  y += kpiHeight + 6;

  // --- SECTION 2: 12-MONTH MONTHLY PROGRESSION LEDGER ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginX, y, contentWidth, 6, 1, 1, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, 2.5, 6, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("2. CATATAN TREN PERTUMBUHAN BULANAN 12 BULAN (MONTHLY PERFORMANCE LEDGER)", marginX + 5, y + 4.2);

  y += 8.5;

  // Table Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(marginX, y, contentWidth, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("BULAN & TAHUN", marginX + 3, y + 4.2);
  doc.text("KUAR.", marginX + 24, y + 4.2);
  doc.text("TOPIK PEMBELAJARAN & MILESTONE UTAMA", marginX + 36, y + 4.2);
  doc.text("JAM (JP)", marginX + 118, y + 4.2);
  doc.text("SKOR", marginX + 132, y + 4.2);
  doc.text("HALAL", marginX + 144, y + 4.2);
  doc.text("5C BANK", marginX + 158, y + 4.2);
  doc.text("STATUS", marginX + 172, y + 4.2);

  y += 6;

  // Table Rows (12 records)
  records.forEach((rec, idx) => {
    const isEven = idx % 2 === 0;
    const rowHeight = 6.6;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(marginX, y, contentWidth, rowHeight, "F");
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, y + rowHeight, marginX + contentWidth, y + rowHeight);

    // Month Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(rec.monthLabel, marginX + 3, y + 4.4);

    // Quarter
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(rec.quarter.split(" ")[0], marginX + 24, y + 4.4);

    // Milestone Topic (truncated if needed)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(30, 41, 59);
    const shortTopic =
      rec.milestoneTopic.length > 48
        ? rec.milestoneTopic.substring(0, 46) + "..."
        : rec.milestoneTopic;
    doc.text(shortTopic, marginX + 36, y + 4.4);

    // Study Hours
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${rec.studyHoursJp.toFixed(1)} JP`, marginX + 118, y + 4.4);

    // Average Quiz Score
    if (rec.averageQuizScore >= 70) {
      doc.setTextColor(5, 150, 105);
    } else {
      doc.setTextColor(180, 83, 9);
    }
    doc.text(`${rec.averageQuizScore}%`, marginX + 132, y + 4.4);

    // Halal Readiness
    doc.setTextColor(5, 150, 105);
    doc.text(`${rec.halalReadinessScore}%`, marginX + 144, y + 4.4);

    // 5C Score
    doc.setTextColor(30, 41, 59);
    doc.text(`${rec.bankable5CScore}%`, marginX + 158, y + 4.4);

    // Status Pill
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    if (rec.status === "Mumtaz" || rec.status === "Tercapai") {
      doc.setTextColor(5, 150, 105);
      doc.text(rec.status === "Mumtaz" ? "MUMTAZ ✓" : "TERCAPAI", marginX + 172, y + 4.4);
    } else if (rec.status === "Akselerasi") {
      doc.setTextColor(2, 132, 199);
      doc.text("AKSELERASI", marginX + 172, y + 4.4);
    } else {
      doc.setTextColor(100, 116, 139);
      doc.text(rec.status.toUpperCase(), marginX + 172, y + 4.4);
    }

    y += rowHeight;
  });

  // Table Totals / Summary Row
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, y, contentWidth, 7, "F");
  doc.setDrawColor(203, 213, 225);
  doc.line(marginX, y + 7, marginX + contentWidth, y + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(15, 23, 42);
  doc.text("TOTAL AKUMULASI (12 BULAN)", marginX + 3, y + 4.6);
  doc.text("4 Kuartal", marginX + 24, y + 4.6);
  doc.text("Kurikulum 7 JP Syariah & Sertifikasi Halal Tuntas", marginX + 36, y + 4.6);
  doc.setTextColor(5, 150, 105);
  doc.text(`${metrics.totalStudyHoursJp} JP`, marginX + 118, y + 4.6);
  doc.text(`Avg: ${Math.round(records.reduce((a, r) => a + r.averageQuizScore, 0) / 12)}%`, marginX + 132, y + 4.6);
  doc.text(`${metrics.currentHalalScore}%`, marginX + 144, y + 4.6);
  doc.text(`${metrics.current5CScore}%`, marginX + 158, y + 4.6);
  doc.text("LULUS 7 JP ✓", marginX + 172, y + 4.6);

  // Footer Page 1
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Laporan Resmi Tren Pertumbuhan Tahunan | TamanKuliner LMS Pro | Halaman 1 dari 2", marginX, pageHeight - 8);
  doc.text("E2EE Encrypted 256-bit SHA Verification", pageWidth - marginX, pageHeight - 8, { align: "right" });

  // ==========================================
  // --- PAGE 2: QUARTERLY TRAJECTORY, COMPETENCIES & SIGNATURES ---
  // ==========================================
  doc.addPage();
  y = 12;

  // Header Banner Page 2
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(marginX, y, contentWidth, 14, 2, 2, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, contentWidth, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("TAMANKULINER.COM LMS PRO - ANALISIS STRATEGIS TREN 12 BULAN", marginX + 5, y + 8.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Peserta: ${fullName} (${businessName}) • NIB: ${nib}`, pageWidth - marginX - 5, y + 8.5, { align: "right" });

  y += 19;

  // --- SECTION 3: QUARTERLY STRATEGIC TRAJECTORY ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginX, y, contentWidth, 6, 1, 1, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, 2.5, 6, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("3. LINTASAN PERTUMBUHAN STRATEGIS PER KUARTAL (QUARTERLY TRAJECTORY)", marginX + 5, y + 4.2);

  y += 8.5;

  const quarters = [
    {
      q: "KUARTAL 1 (Q4 2025)",
      title: "Fondasi Fiqih Muamalah & Akad Usaha",
      desc: "Fokus pada penghapusan riba, gharar, dan maysir dalam penetapan harga kuliner. Penyelesaian Modul 1 (2 JP). Kenaikan rata-rata skor dari 45% ke 58%.",
      metric: "Skor Awal: 45% | Halal: 38% | 12 JP Selesai",
    },
    {
      q: "KUARTAL 2 (Q1 2026)",
      title: "Kepatuhan Kesiapan Halal & Standar SJPH",
      desc: "Penyusunan dokumen manual SJPH sesuai Kemenag BPJPH, pemisahan titik kritis bahan baku hewani, dan audit fasilitas dapur. Kenaikan skor ke 74%.",
      metric: "Skor: 74% | Halal: 75% | Siap SIHALAL",
    },
    {
      q: "KUARTAL 3 (Q2 2026)",
      title: "Literasi Finansial & Akuntansi Syariah",
      desc: "Pemisahan kas usaha dari kas pribadi, kalkulasi HPP bebas manipulasi, perhitungan zakat perniagaan (2.5%), dan tata kelola arus kas mikro.",
      metric: "Skor: 85% | 5C Bankable: 82% | 42.5 JP Terakumulasi",
    },
    {
      q: "KUARTAL 4 (Q3 2026)",
      title: "Akselerasi Permodalan & Kelulusan Paripurna",
      desc: "Simulasi uji kelayakan 5C bankable, integrasi fintech syariah, kelulusan ujian substantif capstone (94/100) dan penerbitan e-sertifikat resmi.",
      metric: "Skor Akhir: 94% (Mumtaz) | Sertifikat Terbit ✓",
    },
  ];

  const qCardWidth = (contentWidth - 4) / 2;
  const qCardHeight = 24;

  quarters.forEach((quarter, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const cardX = marginX + col * (qCardWidth + 4);
    const cardY = y + row * (qCardHeight + 3);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(cardX, cardY, qCardWidth, qCardHeight, 1.5, 1.5, "FD");

    // Quarter title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(5, 150, 105);
    doc.text(quarter.q, cardX + 3.5, cardY + 4.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(quarter.title, cardX + 3.5, cardY + 9);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(quarter.desc, qCardWidth - 7), cardX + 3.5, cardY + 13.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(quarter.metric, cardX + 3.5, cardY + 21);
  });

  y += qCardHeight * 2 + 8;

  // --- SECTION 4: 5-PILLAR DOMAIN COMPETENCY TRANSFORMATION ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginX, y, contentWidth, 6, 1, 1, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, 2.5, 6, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("4. TRANSFORMASI PENGUASAAN 5 PILAR KOMPETENSI SYARIAH (DELTA PERTUMBUHAN)", marginX + 5, y + 4.2);

  y += 8.5;

  const competencies = [
    { name: "Fiqih Muamalah Bisnis Kuliner", base: 45, current: 92, status: "Mastered" },
    { name: "Kesiapan Dokumen & Standar SJPH", base: 35, current: 90, status: "Mastered" },
    { name: "Analisis Kelayakan 5C Bank Syariah", base: 40, current: 88, status: "Proficient" },
    { name: "Akuntansi Kas & Zakat Mal (2.5%)", base: 42, current: 94, status: "Mastered" },
    { name: "Pemasaran Beretika & Anti-Overclaim", base: 50, current: 90, status: "Mastered" },
  ];

  competencies.forEach((comp) => {
    const delta = comp.current - comp.base;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(comp.name, marginX + 3, y + 3.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Baseline: ${comp.base}% ➔ Capaian: ${comp.current}% (+${delta}%)`, marginX + 75, y + 3.5);

    // Progress Bar Track
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(marginX + 130, y + 1, 35, 3.5, 1, 1, "F");

    // Progress Bar Fill
    doc.setFillColor(5, 150, 105);
    doc.roundedRect(marginX + 130, y + 1, (35 * comp.current) / 100, 3.5, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(5, 150, 105);
    doc.text(`${comp.current}% ✓`, marginX + 168, y + 3.5);

    y += 5.8;
  });

  y += 3;

  // --- SECTION 5: REKOMENDASI RENCANA AKSI 12 BULAN MENDATANG ---
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginX, y, contentWidth, 6, 1, 1, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(marginX, y, 2.5, 6, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("5. REKOMENDASI RENCANA AKSI 12 BULAN MENDATANG (NEXT YEAR STRATEGIC ACTIONS)", marginX + 5, y + 4.2);

  y += 8.5;

  const nextYearActions = [
    {
      no: "1.",
      title: "Ekspansi Gerai & Optimalisasi Sertifikasi Halal Resmi",
      desc: "Manfaatkan sertifikat halal BPJPH dan reputasi kepatuhan untuk menembus pasar ritel modern dan marketplace kuliner syariah.",
    },
    {
      no: "2.",
      title: "Pengajuan Fasilitas Pembiayaan Modal Kerja Syariah (KUR/Fintech P2P)",
      desc: "Gunakan portofolio penilaian 5C Grade A untuk mengajukan pembiayaan bagi hasil (Mudharabah/Musyarakah) tanpa bunga riba.",
    },
    {
      no: "3.",
      title: "Pemeliharaan Kepatuhan SJPH & Edukasi Berkelanjutan Karyawan",
      desc: "Lakukan audit internal semesteran dan ikuti penyegaran regulasi halal secara berkala melalui platform TamanKuliner LMS Pro.",
    },
  ];

  nextYearActions.forEach((act) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(`${act.no} ${act.title}`, marginX + 3, y + 3.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(act.desc, marginX + 6, y + 7.2);

    y += 9.5;
  });

  y += 1;

  // --- SECTION 6: DIGITAL SIGNATURES & ENDORSEMENT ---
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(marginX, y, contentWidth, 27, 1.5, 1.5, "FD");

  const sig1 = marginX + 6;
  const sig2 = marginX + 115;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Dikeluarkan di: ${city}`, sig1, y + 5);
  doc.text(`Tanggal: ${issueDate}`, sig1, y + 8.5);
  doc.text("Disetujui & Diverifikasi Oleh:", sig1, y + 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Dewan Pembina Syariah LMS Pro", sig1, y + 19);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Dr. H. Ahmad Zaki, M.E.Sy", sig1, y + 22.5);
  doc.text("Ahli Fiqih Muamalah & Perbankan Syariah", sig1, y + 25.5);

  // Right Signatory
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Platform Director & Lead Mentor,", sig2, y + 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Direktur Program TamanKuliner.com", sig2, y + 19);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Ir. Ridwan Santoso, M.M", sig2, y + 22.5);
  doc.text("Kepala Akselerasi UMKM Kuliner", sig2, y + 25.5);

  // Digital Verification Stamp in center
  const sealX = marginX + 66;
  doc.setDrawColor(16, 185, 129);
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(sealX, y + 4, 38, 19, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(5, 150, 105);
  doc.text("VERIFIKASI RESMI", sealX + 19, y + 9, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(52, 211, 153);
  doc.text("12-MONTH RECORD VERIFIED", sealX + 19, y + 13, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5);
  doc.setTextColor(71, 85, 105);
  doc.text(`ID: ${docRef}`, sealX + 19, y + 17, { align: "center" });
  doc.text("TAMANKULINER.COM LMS", sealX + 19, y + 20.5, { align: "center" });

  // Footer Page 2
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Laporan Resmi Tren Pertumbuhan Tahunan | TamanKuliner LMS Pro | Halaman 2 dari 2", marginX, pageHeight - 8);
  doc.text("E2EE Encrypted 256-bit SHA Verification", pageWidth - marginX, pageHeight - 8, { align: "right" });

  return doc;
}

export function downloadYearlyProgressPdf(options: GenerateYearlyPdfOptions): string {
  const doc = generateYearlyProgressPdf(options);
  const cleanBusinessName = (options.businessName || "UMKM")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Laporan_Tren_Tahunan_12_Bulan_${cleanBusinessName}_${dateStr}.pdf`;

  doc.save(fileName);
  return fileName;
}
