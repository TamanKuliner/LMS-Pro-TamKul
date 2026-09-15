import { HalalChecklistItem, QuizAttempt } from "../types";
import { syllabusModules } from "../data/syllabusData";
import { initialDomainCompetencies } from "../data/learningAnalyticsData";

/**
 * Generates an RFC 4180-compliant CSV string for the Halal Readiness Checklist,
 * prefixed with UTF-8 BOM (\uFEFF) for seamless opening in Excel, Google Sheets, & Numbers.
 */
export function generateHalalChecklistCsv(
  items: HalalChecklistItem[],
  businessName: string
): string {
  const BOM = "\uFEFF";

  const escapeCsv = (val: string | number | boolean | undefined | null): string => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const currentDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const headers = [
    "No",
    "ID Indikator",
    "Kategori",
    "Indikator Kesiapan Halal",
    "Deskripsi & Ketentuan SJPH",
    "Sifat Persyaratan",
    "Status Pemenuhan",
    "Skor Biner",
    "Catatan Kustom Pengguna",
    "Nama Usaha",
    "Tanggal Audit Terakhir",
    "Catatan & Tindak Lanjut BPJPH"
  ];

  const rows = items.map((item, index) => {
    const sifat = item.required ? "Wajib (Mandatori BPJPH)" : "Disarankan";
    const status = item.checked ? "LENGKAP (TERPENUHI)" : "BELUM LENGKAP";
    const skorBiner = item.checked ? 1 : 0;
    const userNotes = item.notes ? item.notes : "-";
    const recommendation = item.checked
      ? "Sudah siap diverifikasi oleh LPH / Pendamping Halal (PPH)"
      : item.required
      ? "PERHATIAN KRITIS: Wajib dilengkapi sebelum pengajuan izin edar & SIHALAL"
      : "Dapat dilengkapi bertahap selama pendampingan operasional";

    return [
      index + 1,
      item.id.toUpperCase(),
      item.category,
      item.title,
      item.desc,
      sifat,
      status,
      skorBiner,
      userNotes,
      businessName || "UMKM Kuliner",
      currentDate,
      recommendation
    ]
      .map(escapeCsv)
      .join(",");
  });

  return BOM + [headers.map(escapeCsv).join(","), ...rows].join("\r\n");
}

/**
 * Triggers the browser download of the Halal Checklist CSV file.
 * Returns the downloaded file name.
 */
export function downloadHalalChecklistCsv(
  items: HalalChecklistItem[],
  businessName: string
): string {
  const csvContent = generateHalalChecklistCsv(items, businessName);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const cleanName = (businessName || "UMKM")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Audit_Kesiapan_Halal_${cleanName}_${dateStr}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return fileName;
}

export interface LearningAnalyticsExportOptions {
  quizAttempts: QuizAttempt[];
  completedModuleIds: string[];
  highestScore: number;
  hasPassedExam: boolean;
  businessName: string;
  fullName: string;
}

/**
 * Generates an RFC 4180-compliant CSV string for the user's quiz attempt history,
 * module progression (7 JP), and domain competency mastery scores.
 * Prefixed with UTF-8 BOM (\uFEFF) for seamless opening in Excel, Google Sheets, & Numbers.
 */
export function generateLearningAnalyticsCsv(
  options: LearningAnalyticsExportOptions
): string {
  const BOM = "\uFEFF";

  const escapeCsv = (val: string | number | boolean | undefined | null): string => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const currentDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalModules = syllabusModules.length;
  const completedModules = options.completedModuleIds.length;
  const totalJp = syllabusModules.reduce((acc, m) => acc + m.jp, 0);
  const completedJp = syllabusModules
    .filter((m) => options.completedModuleIds.includes(m.id))
    .reduce((acc, m) => acc + m.jp, 0);
  const jpPercent = Math.round((completedJp / totalJp) * 100);

  // Section 1: Candidate Metadata & Progress Overview
  const metadataRows = [
    ["=== LAPORAN RIWAYAT KUIS & PROGRES PEMBELAJARAN TAMAN KULINER DIGITAL ==="],
    ["Nama Peserta", options.fullName || "Peserta Pelatihan"],
    ["Nama Usaha", options.businessName || "UMKM Kuliner Halal"],
    ["Waktu Ekspor", `${currentDate}, ${currentTime} WIB`],
    ["Modul Selesai", `${completedModules} dari ${totalModules} Modul (${Math.round((completedModules / totalModules) * 100)}%)`],
    ["Jam Pelajaran (JP)", `${completedJp} dari ${totalJp} JP (${jpPercent}%)`],
    ["Skor Ujian Tertinggi", `${options.highestScore}/100`],
    ["Status Kelulusan", options.hasPassedExam ? "LULUS (Passing Grade >= 70 Terpenuhi)" : "BELUM LULUS (Perlu Remedial)"],
    ["Total Percobaan Kuis", `${options.quizAttempts.length} Sesi Evaluasi`],
    [] // Separator line
  ];

  // Section 2: Quiz History Table
  const quizHeaders = [
    "No Percobaan",
    "Nama Evaluasi / Ujian",
    "Tanggal Ujian",
    "Skor Akhir (0-100)",
    "Jawaban Benar",
    "Total Soal",
    "Akurasi (%)",
    "Durasi (Menit)",
    "Status Kelulusan",
    "Fiqih Muamalah (%)",
    "Kelayakan Finansial 5C (%)",
    "SJPH BPJPH (%)",
    "Akuntansi Syariah (%)",
    "Pemasaran Syariah (%)"
  ];

  const quizRows = options.quizAttempts.map((att) => {
    const accuracy = Math.round((att.correctAnswers / att.totalQuestions) * 100);
    const domain = att.domainScores || {
      fiqihMuamalah: "-",
      bankable5C: "-",
      sjphHalal: "-",
      akuntansiSyariah: "-",
      pemasaranDigital: "-"
    };
    return [
      `#${att.attemptNumber}`,
      att.title,
      att.date,
      att.score,
      att.correctAnswers,
      att.totalQuestions,
      `${accuracy}%`,
      att.timeSpentMinutes,
      att.passed ? "LULUS" : "REMEDIAL",
      domain.fiqihMuamalah,
      domain.bankable5C,
      domain.sjphHalal,
      domain.akuntansiSyariah,
      domain.pemasaranDigital
    ];
  });

  // Section 3: Module Completion Progress Table
  const moduleHeaders = [
    "ID Modul",
    "Modul Ke",
    "Judul Modul Silabus",
    "Bobot (JP)",
    "JP Diperoleh",
    "Status Pengerjaan",
    "Persentase Selesai (%)",
    "Jumlah Sub-Topik"
  ];

  const moduleRows = syllabusModules.map((m) => {
    const isDone = options.completedModuleIds.includes(m.id);
    return [
      m.id,
      `Modul ${m.moduleNumber}`,
      m.title,
      m.jp,
      isDone ? m.jp : 0,
      isDone ? "Selesai (Completed)" : "Belum Selesai (Pending)",
      isDone ? "100%" : "0%",
      m.sections.length
    ];
  });

  // Section 4: Domain Competency Mastery Table
  const competencyHeaders = [
    "Pilar Kompetensi",
    "Nama Standar Kompetensi",
    "Skor Penguasaan (%)",
    "Benchmark Industri (%)",
    "Status Penguasaan",
    "Deskripsi Ruang Lingkup Materi"
  ];

  const competencyRows = initialDomainCompetencies.map((comp) => [
    comp.domain,
    comp.fullName,
    `${comp.score}%`,
    `${comp.benchmark}%`,
    comp.status,
    comp.description
  ]);

  const allBlocks: string[] = [
    ...metadataRows.map(row => row.map(escapeCsv).join(",")),
    escapeCsv("--- RIWAYAT PERCOBAAN EVALUASI & KUIS ---"),
    quizHeaders.map(escapeCsv).join(","),
    ...quizRows.map(row => row.map(escapeCsv).join(",")),
    "",
    escapeCsv("--- PROGRES KURIKULUM & JAM PELAJARAN (7 JP) ---"),
    moduleHeaders.map(escapeCsv).join(","),
    ...moduleRows.map(row => row.map(escapeCsv).join(",")),
    "",
    escapeCsv("--- MATRIKS PENGUASAAN KOMPETENSI STANDAR INDUSTRI ---"),
    competencyHeaders.map(escapeCsv).join(","),
    ...competencyRows.map(row => row.map(escapeCsv).join(","))
  ];

  return BOM + allBlocks.join("\r\n");
}

/**
 * Triggers the browser download of the user's Learning Analytics and Quiz History CSV file.
 * Returns the downloaded file name.
 */
export function downloadLearningAnalyticsCsv(
  options: LearningAnalyticsExportOptions
): string {
  const csvContent = generateLearningAnalyticsCsv(options);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const cleanName = (options.businessName || options.fullName || "Peserta")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Riwayat_Kuis_Progres_${cleanName}_${dateStr}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return fileName;
}
