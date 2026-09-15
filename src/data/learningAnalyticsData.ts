import { QuizAttempt } from "../types";

export const initialQuizAttempts: QuizAttempt[] = [
  {
    id: "att-1",
    attemptNumber: 1,
    title: "Pre-Test Diagnostik Substansi",
    date: "18 Aug",
    fullDate: "2026-08-18T10:15:00Z",
    score: 48,
    totalQuestions: 10,
    correctAnswers: 5,
    passed: false,
    timeSpentMinutes: 14,
    domainScores: {
      fiqihMuamalah: 50,
      bankable5C: 40,
      sjphHalal: 45,
      akuntansiSyariah: 50,
      pemasaranDigital: 55,
    },
  },
  {
    id: "att-2",
    attemptNumber: 2,
    title: "Evaluasi Modul 1 & 2 (Akad & 5C)",
    date: "23 Aug",
    fullDate: "2026-08-23T14:30:00Z",
    score: 62,
    totalQuestions: 10,
    correctAnswers: 6,
    passed: false,
    timeSpentMinutes: 12,
    domainScores: {
      fiqihMuamalah: 65,
      bankable5C: 60,
      sjphHalal: 55,
      akuntansiSyariah: 65,
      pemasaranDigital: 65,
    },
  },
  {
    id: "att-3",
    attemptNumber: 3,
    title: "Simulasi Uji Tengah Modul",
    date: "29 Aug",
    fullDate: "2026-08-29T09:20:00Z",
    score: 74,
    totalQuestions: 10,
    correctAnswers: 7,
    passed: true,
    timeSpentMinutes: 11,
    domainScores: {
      fiqihMuamalah: 75,
      bankable5C: 70,
      sjphHalal: 70,
      akuntansiSyariah: 75,
      pemasaranDigital: 80,
    },
  },
  {
    id: "att-4",
    attemptNumber: 4,
    title: "Try Out Komprehensif SJPH & Fintech",
    date: "03 Sep",
    fullDate: "2026-09-03T16:45:00Z",
    score: 83,
    totalQuestions: 10,
    correctAnswers: 8,
    passed: true,
    timeSpentMinutes: 10,
    domainScores: {
      fiqihMuamalah: 85,
      bankable5C: 80,
      sjphHalal: 80,
      akuntansiSyariah: 85,
      pemasaranDigital: 85,
    },
  },
  {
    id: "att-5",
    attemptNumber: 5,
    title: "Uji Substansi Kelulusan Peserta Pro",
    date: "07 Sep",
    fullDate: "2026-09-07T11:00:00Z",
    score: 91,
    totalQuestions: 10,
    correctAnswers: 9,
    passed: true,
    timeSpentMinutes: 9,
    domainScores: {
      fiqihMuamalah: 92,
      bankable5C: 88,
      sjphHalal: 88,
      akuntansiSyariah: 94,
      pemasaranDigital: 94,
    },
  },
];

export interface DomainCompetency {
  domain: string;
  fullName: string;
  score: number;
  benchmark: number;
  status: "Mastered" | "Proficient" | "Developing";
  description: string;
}

export const initialDomainCompetencies: DomainCompetency[] = [
  {
    domain: "Fiqih Muamalah",
    fullName: "Prinsip Akad & Larangan Riba/Gharar",
    score: 92,
    benchmark: 70,
    status: "Mastered",
    description: "Penguasaan rukun jual beli, akad Mudharabah, Musyarakah, dan pencegahan transaksi terlarang.",
  },
  {
    domain: "5C Bankable",
    fullName: "Analisis Kelayakan Finansial 5C",
    score: 88,
    benchmark: 65,
    status: "Mastered",
    description: "Kesiapan Character, Capacity, Capital, Collateral, dan Condition untuk pembiayaan.",
  },
  {
    domain: "SJPH BPJPH",
    fullName: "Sistem Jaminan Produk Halal & SIHALAL",
    score: 84,
    benchmark: 68,
    status: "Proficient",
    description: "Pemisahan bahan kritis, penyusunan manual SJPH, dan navigasi ptsp.halal.go.id.",
  },
  {
    domain: "Akuntansi Syariah",
    fullName: "Pembukuan Kas & Zakat Mal (2.5%)",
    score: 94,
    benchmark: 62,
    status: "Mastered",
    description: "Pengakuan pendapatan sah, pemisahan kas usaha, kalkulasi nisab zakat perniagaan.",
  },
  {
    domain: "Pemasaran Syariah",
    fullName: "Etika Pemasaran & Anti-Overclaim",
    score: 90,
    benchmark: 72,
    status: "Mastered",
    description: "Kejujuran ulasan menu, larangan praktek najasy, transparansi harga dan takaran.",
  },
];
