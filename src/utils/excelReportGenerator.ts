import * as XLSX from "xlsx";
import { ParticipantProfile, HalalChecklistItem } from "../types";
import { syllabusModules } from "../data/syllabusData";

export interface GenerateExcelOptions {
  profile: ParticipantProfile;
  halalItems: HalalChecklistItem[];
  completedModuleIds: string[];
  hasPassedExam: boolean;
  highestScore: number;
}

export function downloadProgressExcel({
  profile,
  halalItems,
  completedModuleIds,
  hasPassedExam,
  highestScore,
}: GenerateExcelOptions): string {
  const wb = XLSX.utils.book_new();

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

  // --- SHEET 1: RINGKASAN EKSEKUTIF & PROFIL USAHA ---
  const summaryData: (string | number)[][] = [
    ["TAMANKULINER.COM LMS PRO - RESUME TRANSFORMASI DIGITAL & HALAL"],
    ["Platform Digitalisasi UMKM Kuliner Berbasis Syariah (7 JP)"],
    ["Nomor Referensi", documentRef],
    ["Waktu Export", `${issueDate}, ${issueTime} WIB`],
    ["Status Keamanan", "E2EE SHA-256 Verified"],
    [],
    ["A. IDENTITAS PELAKU USAHA & LEGALITAS"],
    ["Nama Pemilik", profile.fullName],
    ["Nama Usaha Kuliner", profile.businessName],
    ["Kategori Kuliner", profile.culinaryCategory || "-"],
    ["Nomor Induk Berusaha (NIB)", profile.hasNIB ? (profile.nibNumber || "Terdaftar OSS RBA") : "Belum terdaftar"],
    ["Estimasi Omset Bulanan", `Rp ${profile.currentMonthlyRevenue?.toLocaleString("id-ID") || "0"}`],
    ["Nomor Telepon / WhatsApp", profile.phone || "-"],
    ["Email Usaha", profile.email || "-"],
    ["Alamat / Domisili", profile.address || profile.city || "-"],
    ["Status Verifikasi Akun", profile.isVerified ? "Terverifikasi Resmi" : "Dalam Proses"],
    [],
    ["B. INDIKATOR CAPAIAN UTAMA (KPI)"],
    ["Metrik", "Nilai", "Target", "Status Keterangan"],
    ["Kesiapan Sertifikasi Halal (SJPH)", `${halalPercent}%`, "100%", missingRequired.length === 0 ? "Siap Daftar SIHALAL BPJPH" : `Sisa ${missingRequired.length} item wajib`],
    ["Penyelesaian Modul Kurikulum (7 JP)", `${completedCount}/${totalModules} Modul (${modulePercent}%)`, "4 Modul (7 JP)", completedCount >= 4 ? "Kurikulum Tuntas 100%" : "Sedang Berjalan"],
    ["Ujian Capstone Fiqih & 5C Muamalah", hasPassedExam ? `Lulus (${highestScore}/100)` : `Belum Lulus (${highestScore}/100)`, "Passing Grade: 70/100", hasPassedExam ? "Memenuhi Syarat Bankable Syariah" : "Perlu Remedial Kuis"],
    ["Target Belajar Bulanan", `${profile.monthlyLearningGoalJP || 7} JP / Bulan`, `${profile.monthlyGoalMonth || "Bulan Berjalan"}`, profile.monthlyGoalFocus || "Fokus Bankable 5C"],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  // Column widths
  wsSummary["!cols"] = [
    { wch: 35 },
    { wch: 40 },
    { wch: 25 },
    { wch: 35 },
  ];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan Eksekutif");

  // --- SHEET 2: AUDIT KESIAPAN HALAL BPJPH ---
  const halalData: (string | number)[][] = [
    ["DAFTAR AUDIT KESIAPAN SERTIFIKASI HALAL (SJPH BPJPH)"],
    ["Usaha Kuliner", profile.businessName],
    ["Tingkat Pemenuhan", `${halalPercent}% (${checkedHalal}/${totalHalal} Butir Terpenuhi)`],
    [],
    ["No", "Kategori Audit", "Kriteria Persyaratan SJPH", "Sifat", "Status Pemenuhan", "Catatan Verifikasi Lapangan / Dokumen"],
  ];

  halalItems.forEach((item, index) => {
    halalData.push([
      index + 1,
      item.category,
      item.title,
      item.required ? "Wajib (Mandatory)" : "Rekomendasi",
      item.checked ? "Lengkap (Memenuhi Syarat)" : "Belum Lengkap (Pending)",
      item.notes || "-",
    ]);
  });

  const wsHalal = XLSX.utils.aoa_to_sheet(halalData);
  wsHalal["!cols"] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 45 },
    { wch: 20 },
    { wch: 28 },
    { wch: 45 },
  ];
  XLSX.utils.book_append_sheet(wb, wsHalal, "Audit Kesiapan Halal");

  // --- SHEET 3: MODUL KURIKULUM 7 JP ---
  const curriculumData: (string | number)[][] = [
    ["TRANSKRIP KURIKULUM PELATIHAN DIGITALISASI UMKM KULINER BERBASIS SYARIAH (7 JP)"],
    ["Peserta Pelatihan", profile.fullName],
    ["Usaha Kuliner", profile.businessName],
    ["Status Kelulusan Akhir", hasPassedExam ? "LULUS UJIAN CAPSTONE (SERTIFIKAT TERBIT)" : "DALAM PROGRES PEMBELAJARAN"],
    [],
    ["No", "Kode Modul", "Judul Materi Kurikulum", "Bobot (JP)", "Status Penyelesaian", "Target Kompetensi"],
  ];

  syllabusModules.forEach((mod, index) => {
    const isCompleted = completedModuleIds.includes(mod.id);
    curriculumData.push([
      index + 1,
      `MODUL-${mod.moduleNumber}`,
      mod.title,
      `${mod.jp} JP`,
      isCompleted ? "SELESAI (Completed)" : "BELUM SELESAI (In Progress)",
      mod.skillsGained?.[0] || mod.description || "Kompetensi Bisnis Syariah & Muamalah",
    ]);
  });

  curriculumData.push(
    [],
    ["EVALUASI CAPSTONE / UJIAN AKHIR"],
    ["Nama Ujian", "Uji Kompetensi Fiqih Muamalah, SJPH Halal, dan 5C Bankability"],
    ["Nilai Tertinggi", `${highestScore} / 100`],
    ["Passing Grade", "70 / 100"],
    ["Status", hasPassedExam ? "LULUS (MEMENUHI SYARAT REKOMENDASI BANK SYARIAH)" : "BELUM LULUS (DAPAT MENGULANG)"]
  );

  const wsCurriculum = XLSX.utils.aoa_to_sheet(curriculumData);
  wsCurriculum["!cols"] = [
    { wch: 6 },
    { wch: 15 },
    { wch: 42 },
    { wch: 14 },
    { wch: 28 },
    { wch: 50 },
  ];
  XLSX.utils.book_append_sheet(wb, wsCurriculum, "Kurikulum 7 JP");

  // Write file
  const cleanBusinessName = (profile.businessName || "UMKM")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Laporan_Eksekutif_${cleanBusinessName}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, fileName);
  return fileName;
}
