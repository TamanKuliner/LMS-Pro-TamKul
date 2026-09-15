export interface MonthlyGrowthRecord {
  monthKey: string; // e.g., "2025-10"
  monthLabel: string; // e.g., "Okt 2025"
  fullMonthName: string; // e.g., "Oktober 2025"
  quarter: "Q4 2025" | "Q1 2026" | "Q2 2026" | "Q3 2026";
  studyHoursJp: number;
  studyMinutes: number;
  cumulativeHoursJp: number;
  averageQuizScore: number;
  halalReadinessScore: number;
  bankable5CScore: number;
  activeQuizzesCount: number;
  milestoneTopic: string;
  status: "Fondasi" | "Kepatuhan" | "Literasi Finansial" | "Akselerasi" | "Tercapai" | "Mumtaz";
}

export const default12MonthGrowthData: MonthlyGrowthRecord[] = [
  {
    monthKey: "2025-10",
    monthLabel: "Okt 2025",
    fullMonthName: "Oktober 2025",
    quarter: "Q4 2025",
    studyHoursJp: 3.5,
    studyMinutes: 210,
    cumulativeHoursJp: 3.5,
    averageQuizScore: 45,
    halalReadinessScore: 22,
    bankable5CScore: 42,
    activeQuizzesCount: 2,
    milestoneTopic: "Pre-test Diagnostik & Fondasi Fiqih Muamalah F&B",
    status: "Fondasi",
  },
  {
    monthKey: "2025-11",
    monthLabel: "Nov 2025",
    fullMonthName: "November 2025",
    quarter: "Q4 2025",
    studyHoursJp: 4.0,
    studyMinutes: 240,
    cumulativeHoursJp: 7.5,
    averageQuizScore: 52,
    halalReadinessScore: 30,
    bankable5CScore: 48,
    activeQuizzesCount: 2,
    milestoneTopic: "Pendalaman Akad Ba'i, Pencegahan Riba & Gharar",
    status: "Fondasi",
  },
  {
    monthKey: "2025-12",
    monthLabel: "Des 2025",
    fullMonthName: "Desember 2025",
    quarter: "Q4 2025",
    studyHoursJp: 4.5,
    studyMinutes: 270,
    cumulativeHoursJp: 12.0,
    averageQuizScore: 58,
    halalReadinessScore: 38,
    bankable5CScore: 54,
    activeQuizzesCount: 3,
    milestoneTopic: "Tuntas Modul 1 (Fiqih Muamalah Bisnis Kuliner - 2 JP)",
    status: "Tercapai",
  },
  {
    monthKey: "2026-01",
    monthLabel: "Jan 2026",
    fullMonthName: "Januari 2026",
    quarter: "Q1 2026",
    studyHoursJp: 5.0,
    studyMinutes: 300,
    cumulativeHoursJp: 17.0,
    averageQuizScore: 64,
    halalReadinessScore: 48,
    bankable5CScore: 60,
    activeQuizzesCount: 2,
    milestoneTopic: "Audit Bahan Baku Kritis & Pemisahan Fasilitas Dapur",
    status: "Kepatuhan",
  },
  {
    monthKey: "2026-02",
    monthLabel: "Feb 2026",
    fullMonthName: "Februari 2026",
    quarter: "Q1 2026",
    studyHoursJp: 5.5,
    studyMinutes: 330,
    cumulativeHoursJp: 22.5,
    averageQuizScore: 70,
    halalReadinessScore: 62,
    bankable5CScore: 65,
    activeQuizzesCount: 3,
    milestoneTopic: "Penyusunan Manual SJPH Standar BPJPH Kemenag",
    status: "Kepatuhan",
  },
  {
    monthKey: "2026-03",
    monthLabel: "Mar 2026",
    fullMonthName: "Maret 2026",
    quarter: "Q1 2026",
    studyHoursJp: 4.5,
    studyMinutes: 270,
    cumulativeHoursJp: 27.0,
    averageQuizScore: 74,
    halalReadinessScore: 75,
    bankable5CScore: 70,
    activeQuizzesCount: 2,
    milestoneTopic: "Tuntas Modul 2 (Sertifikasi Halal & Standar SJPH - 2 JP)",
    status: "Tercapai",
  },
  {
    monthKey: "2026-04",
    monthLabel: "Apr 2026",
    fullMonthName: "April 2026",
    quarter: "Q2 2026",
    studyHoursJp: 5.0,
    studyMinutes: 300,
    cumulativeHoursJp: 32.0,
    averageQuizScore: 78,
    halalReadinessScore: 80,
    bankable5CScore: 74,
    activeQuizzesCount: 2,
    milestoneTopic: "Pemisahan Rekening Usaha & Buku Kas Harian Syariah",
    status: "Literasi Finansial",
  },
  {
    monthKey: "2026-05",
    monthLabel: "Mei 2026",
    fullMonthName: "Mei 2026",
    quarter: "Q2 2026",
    studyHoursJp: 5.5,
    studyMinutes: 330,
    cumulativeHoursJp: 37.5,
    averageQuizScore: 82,
    halalReadinessScore: 85,
    bankable5CScore: 78,
    activeQuizzesCount: 3,
    milestoneTopic: "Kalkulasi HPP Bebas Gharar & Nisab Zakat Mal (2.5%)",
    status: "Literasi Finansial",
  },
  {
    monthKey: "2026-06",
    monthLabel: "Jun 2026",
    fullMonthName: "Juni 2026",
    quarter: "Q2 2026",
    studyHoursJp: 5.0,
    studyMinutes: 300,
    cumulativeHoursJp: 42.5,
    averageQuizScore: 85,
    halalReadinessScore: 88,
    bankable5CScore: 82,
    activeQuizzesCount: 2,
    milestoneTopic: "Tuntas Modul 3 (Akuntansi & Manajemen Keuangan - 1.5 JP)",
    status: "Tercapai",
  },
  {
    monthKey: "2026-07",
    monthLabel: "Jul 2026",
    fullMonthName: "Juli 2026",
    quarter: "Q3 2026",
    studyHoursJp: 6.0,
    studyMinutes: 360,
    cumulativeHoursJp: 48.5,
    averageQuizScore: 88,
    halalReadinessScore: 92,
    bankable5CScore: 85,
    activeQuizzesCount: 3,
    milestoneTopic: "Simulasi 5C Kelayakan Bank Syariah & Fintech P2P Halal",
    status: "Akselerasi",
  },
  {
    monthKey: "2026-08",
    monthLabel: "Agu 2026",
    fullMonthName: "Agustus 2026",
    quarter: "Q3 2026",
    studyHoursJp: 6.5,
    studyMinutes: 390,
    cumulativeHoursJp: 55.0,
    averageQuizScore: 91,
    halalReadinessScore: 96,
    bankable5CScore: 87,
    activeQuizzesCount: 4,
    milestoneTopic: "Tuntas Modul 4 (Fintech & Akses Permodalan Syariah - 1.5 JP)",
    status: "Tercapai",
  },
  {
    monthKey: "2026-09",
    monthLabel: "Sep 2026",
    fullMonthName: "September 2026",
    quarter: "Q3 2026",
    studyHoursJp: 7.0,
    studyMinutes: 420,
    cumulativeHoursJp: 62.0,
    averageQuizScore: 94,
    halalReadinessScore: 100,
    bankable5CScore: 90,
    activeQuizzesCount: 3,
    milestoneTopic: "Lulus Uji Evaluasi Substansi 7 JP & Sertifikasi Digital Pro",
    status: "Mumtaz",
  },
];

export interface YearlySummaryMetrics {
  startingScore: number;
  currentScore: number;
  scoreDelta: number;
  scoreGrowthPercent: number;
  totalStudyHoursJp: number;
  totalStudyMinutes: number;
  totalSessions: number;
  startingHalalScore: number;
  currentHalalScore: number;
  halalGrowthDelta: number;
  starting5CScore: number;
  current5CScore: number;
  score5CDelta: number;
}

export function computeYearlySummaryMetrics(
  records: MonthlyGrowthRecord[] = default12MonthGrowthData,
  currentHighestScore?: number
): YearlySummaryMetrics {
  const first = records[0];
  const last = records[records.length - 1];

  const effectiveCurrentScore =
    currentHighestScore !== undefined && currentHighestScore > 0
      ? Math.max(currentHighestScore, last.averageQuizScore)
      : last.averageQuizScore;

  const scoreDelta = effectiveCurrentScore - first.averageQuizScore;
  const scoreGrowthPercent = Math.round((scoreDelta / first.averageQuizScore) * 100);

  const totalStudyHoursJp = records.reduce((acc, r) => acc + r.studyHoursJp, 0);
  const totalStudyMinutes = records.reduce((acc, r) => acc + r.studyMinutes, 0);
  const totalSessions = records.reduce((acc, r) => acc + r.activeQuizzesCount, 0);

  return {
    startingScore: first.averageQuizScore,
    currentScore: effectiveCurrentScore,
    scoreDelta,
    scoreGrowthPercent,
    totalStudyHoursJp: Math.round(totalStudyHoursJp * 10) / 10,
    totalStudyMinutes,
    totalSessions,
    startingHalalScore: first.halalReadinessScore,
    currentHalalScore: last.halalReadinessScore,
    halalGrowthDelta: last.halalReadinessScore - first.halalReadinessScore,
    starting5CScore: first.bankable5CScore,
    current5CScore: last.bankable5CScore,
    score5CDelta: last.bankable5CScore - first.bankable5CScore,
  };
}
