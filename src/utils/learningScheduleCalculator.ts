/**
 * Learning Schedule Calculator for TamanKuliner LMS Pro
 * Computes personalized daily study plans for the 7 JP (420 minutes)
 * Syariah UMKM Digitalization Curriculum based on user-defined timeframes.
 */

export interface StudyUnit {
  id: string;
  moduleId: string;
  moduleNumber: number;
  moduleTitle: string;
  unitNumber: number;
  title: string;
  durationMinutes: number;
  jp: number;
  keyTopic: string;
  actionTip: string;
  isCapstone?: boolean;
}

export const curriculumStudyUnits: StudyUnit[] = [
  // Modul 1: 1 JP = 60 mins (2 units x 30 mins)
  {
    id: "unit-1",
    moduleId: "modul-1",
    moduleNumber: 1,
    moduleTitle: "Prinsip & Etika Bisnis Islam Digital",
    unitNumber: 1,
    title: "Mindset Bisnis Syariah & Transformasi Digital",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Maqashid syariah dalam kuliner, wasilah teknologi, dan pencegahan transaksi manipulatif",
    actionTip: "Evaluasi daftar menu warung: pastikan informasi berat porsi, rasa pedas, dan komposisi jujur tanpa overclaim.",
  },
  {
    id: "unit-2",
    moduleId: "modul-1",
    moduleNumber: 1,
    moduleTitle: "Prinsip & Etika Bisnis Islam Digital",
    unitNumber: 2,
    title: "Akad Muamalah Digital & Evaluasi 5C Bankable",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Akad Bai', Wakalah, Mudharabah, Musyarakah serta pemisahan rekening pribadi vs usaha",
    actionTip: "Buka tab kalkulator 5C Bankable dan periksa kelayakan karakter & kapasitas warung makan Anda.",
  },

  // Modul 2: 2 JP = 120 mins (4 units x 30 mins)
  {
    id: "unit-3",
    moduleId: "modul-2",
    moduleNumber: 2,
    moduleTitle: "Akuntansi Digital & Fintech Syariah",
    unitNumber: 3,
    title: "Pembukuan Kas Harian Syariah Digital",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Pencatatan arus kas digital, pengakuan pendapatan riil, dan eliminasi biaya syubhat",
    actionTip: "Mulai rekap seluruh pembayaran QRIS harian ke dalam satu buku kas khusus operasional.",
  },
  {
    id: "unit-4",
    moduleId: "modul-2",
    moduleNumber: 2,
    moduleTitle: "Akuntansi Digital & Fintech Syariah",
    unitNumber: 4,
    title: "Kalkulasi Zakat Perniagaan (Nisab 85g Emas)",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Formula zakat perniagaan: (Aset Lancar - Utang Jangka Pendek) x 2.5%",
    actionTip: "Hitung perkiraan nisab zakat tahunan usaha kuliner Anda untuk keberkahan omzet.",
  },
  {
    id: "unit-5",
    moduleId: "modul-2",
    moduleNumber: 2,
    moduleTitle: "Akuntansi Digital & Fintech Syariah",
    unitNumber: 5,
    title: "Pembiayaan Syariah Murabahah & Mudharabah",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Mekanisme margin keuntungan transparan vs bunga perbankan konvensional",
    actionTip: "Simulasikan kebutuhan mesin chiller/oven baru dengan kalkulator pembiayaan Murabahah.",
  },
  {
    id: "unit-6",
    moduleId: "modul-2",
    moduleNumber: 2,
    moduleTitle: "Akuntansi Digital & Fintech Syariah",
    unitNumber: 6,
    title: "Fintech P2P Lending Syariah Berizin OJK",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Integrasi platform fintech syariah terpercaya dan mitigasi jeratan pinjol ilegal",
    actionTip: "Pastikan hanya menggunakan fintech yang terdaftar di OJK dan memiliki Dewan Pengawas Syariah (DPS).",
  },

  // Modul 3: 2 JP = 120 mins (4 units x 30 mins)
  {
    id: "unit-7",
    moduleId: "modul-3",
    moduleNumber: 3,
    moduleTitle: "Pemasaran Digital Berbasis Syariah",
    unitNumber: 7,
    title: "Etika Promosi Digital Amanah & Larangan Gharar",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Larangan manipulasi review (fake order), buzzer tipu daya (najasy), dan misleading visual",
    actionTip: "Audit foto profil menu di etalase online: gunakan foto asli masakan sendiri, bukan comotan internet.",
  },
  {
    id: "unit-8",
    moduleId: "modul-3",
    moduleNumber: 3,
    moduleTitle: "Pemasaran Digital Berbasis Syariah",
    unitNumber: 8,
    title: "Optimasi Food Delivery (GoFood, GrabFood, ShopeeFood)",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Penetapan harga transparan, akad komisi pengantaran (ujrah), dan kepuasan pelanggan",
    actionTip: "Perbarui jam operasional toko di aplikasi merchant agar tidak ada pesanan tertolak tiba-tiba.",
  },
  {
    id: "unit-9",
    moduleId: "modul-3",
    moduleNumber: 3,
    moduleTitle: "Pemasaran Digital Berbasis Syariah",
    unitNumber: 9,
    title: "Content Marketing Halal & Storytelling Thayyib",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Membangun narasi kebersihan dapur, higienitas bahan, dan keberkahan hidangan nusantara",
    actionTip: "Buat 1 video pendek berdurasi 30 detik yang menampilkan proses masak higienis di dapur Anda.",
  },
  {
    id: "unit-10",
    moduleId: "modul-3",
    moduleNumber: 3,
    moduleTitle: "Pemasaran Digital Berbasis Syariah",
    unitNumber: 10,
    title: "Evaluasi Pemasaran & Strategi Loyalitas Pelanggan",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Program retensi berbasis sedekah/diskon berkah tanpa skema untung-untungan (maysir)",
    actionTip: "Susun program 'Jumat Berkah' berupa sedekah porsi ekstra atau air minum gratis.",
  },

  // Modul 4: 2 JP = 120 mins (4 units x 30 mins)
  {
    id: "unit-11",
    moduleId: "modul-4",
    moduleNumber: 4,
    moduleTitle: "Persiapan Sertifikasi Halal BPJPH",
    unitNumber: 11,
    title: "Mandatori Regulasi UU 33/2014 & Kriteria Bahan Kritis",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Daftar bahan kritis kuliner: daging sembelihan, kecap, saus, gelatin, ragi, dan emulsifier",
    actionTip: "Minta sertifikat halal resmi dari pemasok daging ayam/sapi langganan usaha Anda.",
  },
  {
    id: "unit-12",
    moduleId: "modul-4",
    moduleNumber: 4,
    moduleTitle: "Persiapan Sertifikasi Halal BPJPH",
    unitNumber: 12,
    title: "Manual SJPH (Sistem Jaminan Produk Halal) & Dapur Halal",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Pemisahan peralatan masak, fasilitas penyimpanan, dan penunjukan Penyelia Halal internal",
    actionTip: "Beri label hijau 'Khusus Bahan Halal Terverifikasi' pada wadah penyimpanan di chiller.",
  },
  {
    id: "unit-13",
    moduleId: "modul-4",
    moduleNumber: 4,
    moduleTitle: "Persiapan Sertifikasi Halal BPJPH",
    unitNumber: 13,
    title: "Alur Pendaftaran SIHALAL BPJPH (ptsp.halal.go.id)",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Persyaratan NIB OSS, verifikasi LP3H / PPH pendamping, dan jalur Self-Declare UMKM",
    actionTip: "Siapkan akun OSS berbasis NIB untuk sinkronisasi otomatis dengan portal SIHALAL BPJPH.",
  },
  {
    id: "unit-14",
    moduleId: "modul-4",
    moduleNumber: 4,
    moduleTitle: "Persiapan Sertifikasi Halal BPJPH",
    unitNumber: 14,
    title: "Evaluasi Capstone 7 JP & Sertifikasi Kelulusan",
    durationMinutes: 30,
    jp: 0.5,
    keyTopic: "Uji substansi komprehensif, review kelulusan passing grade 70%, dan penerbitan E-Sertifikat resmi",
    actionTip: "Tuntaskan seluruh 10 soal evaluasi substansi di tab 'Test Kuis' untuk klaim sertifikat ber-barcode.",
    isCapstone: true,
  },
];

export type StudyRhythm = "everyday" | "weekdays" | "triweekly";
export type PreferredTimeWindow = "morning" | "afternoon" | "evening";

export interface ScheduleOptions {
  totalDays: number; // e.g., 3, 5, 7, 14, 21, 30
  studyRhythm: StudyRhythm;
  timeWindow: PreferredTimeWindow;
  startDate?: Date;
  completedModuleIds?: string[];
  filterMode?: "all_curriculum" | "remaining_only";
}

export interface DailySchedulePlan {
  dayIndex: number;
  calendarDate: Date;
  dateFormatted: string;
  dayName: string;
  timeSlotLabel: string;
  assignedUnits: StudyUnit[];
  totalMinutes: number;
  totalJp: number;
  primaryModuleId: string;
  primaryModuleNumber: number;
  primaryModuleTitle: string;
  dayHeadline: string;
  daySummary: string;
  actionTip: string;
  hasCapstone: boolean;
  isAllCompleted: boolean;
}

export interface CalculatedSchedule {
  totalCurriculumJp: number;
  totalCurriculumMinutes: number;
  effectiveTargetDays: number;
  calendarSpanDays: number;
  dailyMinutes: number;
  dailyJp: number;
  startDate: Date;
  targetCompletionDate: Date;
  startDateFormatted: string;
  targetCompletionDateFormatted: string;
  pacingTier: "intensive" | "optimal" | "relaxed";
  pacingBadge: string;
  pacingDescription: string;
  studyRhythmLabel: string;
  timeWindowLabel: string;
  dailyPlans: DailySchedulePlan[];
  completedUnitsCount: number;
  totalUnitsCount: number;
  completionPercentage: number;
}

const INDONESIAN_DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export function formatIndonesianDate(date: Date, includeYear = true): string {
  const dayName = INDONESIAN_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const monthName = INDONESIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return includeYear ? `${dayName}, ${dayNum} ${monthName} ${year}` : `${dayName}, ${dayNum} ${monthName}`;
}

export function getTimeWindowDetails(window: PreferredTimeWindow): { label: string; timeRange: string; tip: string } {
  switch (window) {
    case "morning":
      return {
        label: "Pagi Hari (Sebelum Belanja Dapur)",
        timeRange: "06:00 - 07:00 WIB",
        tip: "Pikiran masih segar sebelum kesibukan belanja pasar & persiapan bumbu dapur.",
      };
    case "afternoon":
      return {
        label: "Siang / Sore (Jeda Waktu Senggang)",
        timeRange: "14:30 - 15:30 WIB",
        tip: "Cocok dimanfaatkan saat pergantian shift atau jeda waktu sepi antara makan siang dan malam.",
      };
    case "evening":
    default:
      return {
        label: "Malam Hari (Setelah Tutup Warung)",
        timeRange: "20:30 - 21:30 WIB",
        tip: "Waktu paling direkomendasikan para pemilik usaha F&B setelah closing kasir & rekap harian.",
      };
  }
}

/**
 * Computes the recommended daily study plan based on user-defined parameters
 */
export function calculateLearningSchedule(options: ScheduleOptions): CalculatedSchedule {
  const {
    totalDays = 7,
    studyRhythm = "everyday",
    timeWindow = "evening",
    startDate = new Date(),
    completedModuleIds = [],
    filterMode = "all_curriculum",
  } = options;

  const totalCurriculumJp = 7;
  const totalCurriculumMinutes = 420; // 14 units * 30 min

  let unitsToSchedule = [...curriculumStudyUnits];
  if (filterMode === "remaining_only" && completedModuleIds.length > 0) {
    const filtered = curriculumStudyUnits.filter(u => !completedModuleIds.includes(u.moduleId));
    if (filtered.length > 0) {
      unitsToSchedule = filtered;
    }
  }

  const boundedTargetDays = Math.max(1, Math.min(60, totalDays));
  const timeDetails = getTimeWindowDetails(timeWindow);

  // Generate calendar dates honoring study rhythm
  const scheduledDates: Date[] = [];
  let currDate = new Date(startDate);
  // Normalize time to start of day
  currDate.setHours(0, 0, 0, 0);

  while (scheduledDates.length < boundedTargetDays) {
    const dayOfWeek = currDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    let isValidDay = true;

    if (studyRhythm === "weekdays") {
      // Mon (1) to Fri (5)
      isValidDay = dayOfWeek >= 1 && dayOfWeek <= 5;
    } else if (studyRhythm === "triweekly") {
      // Mon (1), Wed (3), Fri (5)
      isValidDay = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
    }

    if (isValidDay) {
      scheduledDates.push(new Date(currDate));
    }
    currDate.setDate(currDate.getDate() + 1);
  }

  const completionDate = scheduledDates.length > 0 ? scheduledDates[scheduledDates.length - 1] : new Date();
  const calendarSpanDays = Math.ceil((completionDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Distribute units evenly across the boundedTargetDays
  const dailyPlans: DailySchedulePlan[] = [];
  const totalUnits = unitsToSchedule.length;
  
  for (let d = 0; d < boundedTargetDays; d++) {
    const date = scheduledDates[d];
    
    // Distribute using proportional slicing
    const startIndex = Math.floor((d * totalUnits) / boundedTargetDays);
    const endIndex = Math.floor(((d + 1) * totalUnits) / boundedTargetDays);
    
    let dayUnits = unitsToSchedule.slice(startIndex, endIndex);
    // If somehow a day is empty because totalDays > totalUnits, pick nearest or mark as review
    if (dayUnits.length === 0) {
      const fallbackUnit = unitsToSchedule[Math.min(startIndex, totalUnits - 1)];
      dayUnits = [fallbackUnit];
    }

    const totalMinutes = dayUnits.reduce((acc, u) => acc + u.durationMinutes, 0);
    const totalJp = dayUnits.reduce((acc, u) => acc + u.jp, 0);
    const primaryUnit = dayUnits[0];
    const hasCapstone = dayUnits.some(u => u.isCapstone);

    const isAllCompleted = dayUnits.every(u => completedModuleIds.includes(u.moduleId));

    const dayHeadline = dayUnits.length === 1 
      ? primaryUnit.title 
      : `${primaryUnit.title} & ${dayUnits[dayUnits.length - 1].title}`;

    const daySummary = dayUnits.map(u => u.keyTopic).join(". ");
    const actionTip = primaryUnit.actionTip;

    dailyPlans.push({
      dayIndex: d + 1,
      calendarDate: date,
      dateFormatted: formatIndonesianDate(date, false),
      dayName: INDONESIAN_DAYS[date.getDay()],
      timeSlotLabel: timeDetails.timeRange,
      assignedUnits: dayUnits,
      totalMinutes,
      totalJp: parseFloat(totalJp.toFixed(2)),
      primaryModuleId: primaryUnit.moduleId,
      primaryModuleNumber: primaryUnit.moduleNumber,
      primaryModuleTitle: primaryUnit.moduleTitle,
      dayHeadline,
      daySummary,
      actionTip,
      hasCapstone,
      isAllCompleted,
    });
  }

  const avgMinutes = Math.round(totalCurriculumMinutes / boundedTargetDays);
  const avgJp = parseFloat((totalCurriculumJp / boundedTargetDays).toFixed(2));

  // Determine Pacing Tier
  let pacingTier: "intensive" | "optimal" | "relaxed" = "optimal";
  let pacingBadge = "Optimal & Seimbang (Sangat Direkomendasikan)";
  let pacingDescription = "Ritme belajar 45-60 menit sehari sangat ideal bagi pelaku UMKM. Tidak membebani jam produksi dapur, namun progres kurikulum tetap konsisten.";

  if (avgMinutes >= 80) {
    pacingTier = "intensive";
    pacingBadge = "Intensif Sprint (Perlu Komitmen Waktu)";
    pacingDescription = `Belajar ~${avgMinutes} menit per hari membutuhkan alokasi waktu khusus tanpa distraksi operasional. Cocok untuk libur akhir pekan atau persiapan mendesak audit sertifikasi halal.`;
  } else if (avgMinutes <= 35) {
    pacingTier = "relaxed";
    pacingBadge = "Santai & Ringan (Konsistensi Harian)";
    pacingDescription = `Hanya ~${avgMinutes} menit per hari. Sangat ringan dan mudah diselesaikan saat rehat santai tanpa merasa terbebani.`;
  }

  let rhythmLabel = "Setiap Hari (7 Hari/Minggu)";
  if (studyRhythm === "weekdays") rhythmLabel = "Hari Kerja (Senin–Jumat)";
  if (studyRhythm === "triweekly") rhythmLabel = "3x Seminggu (Senin, Rabu, Jumat)";

  const completedUnits = curriculumStudyUnits.filter(u => completedModuleIds.includes(u.moduleId)).length;
  const completionPercentage = Math.round((completedUnits / curriculumStudyUnits.length) * 100);

  return {
    totalCurriculumJp,
    totalCurriculumMinutes,
    effectiveTargetDays: boundedTargetDays,
    calendarSpanDays,
    dailyMinutes: avgMinutes,
    dailyJp: avgJp,
    startDate,
    targetCompletionDate: completionDate,
    startDateFormatted: formatIndonesianDate(startDate),
    targetCompletionDateFormatted: formatIndonesianDate(completionDate),
    pacingTier,
    pacingBadge,
    pacingDescription,
    studyRhythmLabel: rhythmLabel,
    timeWindowLabel: timeDetails.label,
    dailyPlans,
    completedUnitsCount: completedUnits,
    totalUnitsCount: curriculumStudyUnits.length,
    completionPercentage,
  };
}

/**
 * Generates an iCalendar (.ics) string for importing into Google Calendar / Apple Calendar
 */
export function generateLearningScheduleIcs(schedule: CalculatedSchedule, businessName = "UMKM Kuliner"): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatUtc = (d: Date) => {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };

  const nowStr = formatUtc(new Date());

  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TamanKuliner//LMS Syariah Learning Schedule//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Jadwal Belajar 7 JP Syariah - ${businessName}`,
    "X-WR-TIMEZONE:Asia/Jakarta",
  ];

  schedule.dailyPlans.forEach((plan) => {
    // Set event time based on selected time window
    const eventStart = new Date(plan.calendarDate);
    const startHour = schedule.timeWindowLabel.includes("Pagi") ? 6 : schedule.timeWindowLabel.includes("Siang") ? 14 : 20;
    const startMin = schedule.timeWindowLabel.includes("Pagi") ? 0 : 30;
    eventStart.setHours(startHour, startMin, 0, 0);

    const eventEnd = new Date(eventStart.getTime() + plan.totalMinutes * 60000);

    const uid = `tk-session-day${plan.dayIndex}-${plan.calendarDate.getTime()}@tamankuliner.com`;
    const summary = `[LMS Syariah] Hari ${plan.dayIndex}: ${plan.dayHeadline} (${plan.totalJp} JP)`;
    const description = `Rencana Belajar 7 JP TamanKuliner.com\\nModul: ${plan.primaryModuleTitle}\\nTopik: ${plan.daySummary}\\nPraktik: ${plan.actionTip}\\nPlatform: https://TamanKuliner.com`;

    ics.push("BEGIN:VEVENT");
    ics.push(`UID:${uid}`);
    ics.push(`DTSTAMP:${nowStr}`);
    ics.push(`DTSTART:${formatUtc(eventStart)}`);
    ics.push(`DTEND:${formatUtc(eventEnd)}`);
    ics.push(`SUMMARY:${summary}`);
    ics.push(`DESCRIPTION:${description}`);
    ics.push("STATUS:CONFIRMED");
    ics.push("BEGIN:VALARM");
    ics.push("TRIGGER:-PT15M");
    ics.push("ACTION:DISPLAY");
    ics.push(`DESCRIPTION:Pengingat Belajar: ${summary}`);
    ics.push("END:VALARM");
    ics.push("END:VEVENT");
  });

  ics.push("END:VCALENDAR");
  return ics.join("\r\n");
}

/**
 * Formats a Date into Google Calendar URL compatible string (YYYYMMDDTHHmmss)
 */
function formatGCalDateTime(d: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

/**
 * Generates a direct 1-click Google Calendar Web Intent URL for a specific study day session
 */
export function generateGoogleCalendarSessionUrl(
  plan: DailySchedulePlan,
  timeWindow: PreferredTimeWindow = "evening",
  businessName = "UMKM Kuliner"
): string {
  const startHour = timeWindow === "morning" ? 6 : timeWindow === "afternoon" ? 14 : 20;
  const startMin = timeWindow === "morning" ? 0 : 30;

  const startDate = new Date(plan.calendarDate);
  startDate.setHours(startHour, startMin, 0, 0);

  const endDate = new Date(startDate.getTime() + plan.totalMinutes * 60000);

  const title = `[LMS Syariah] Hari ${plan.dayIndex}: ${plan.dayHeadline} (${plan.totalJp} JP)`;
  
  const details = [
    `🎓 Sesi Belajar 7 JP Digitalisasi Kuliner Syariah - TamanKuliner.com`,
    `🏢 Peserta: ${businessName}`,
    `📅 Jadwal: Hari ${plan.dayIndex} (${plan.dateFormatted})`,
    `⏱️ Durasi: ${plan.totalMinutes} Menit (~${plan.totalJp} JP)`,
    ``,
    `📌 Modul Utama: Modul ${plan.primaryModuleNumber} - ${plan.primaryModuleTitle}`,
    `📖 Pokok Bahasan: ${plan.daySummary}`,
    `💡 Praktik Usaha Harian: ${plan.actionTip}`,
    ``,
    `🔗 Buka Materi Pelajaran: https://TamanKuliner.com`,
    `✅ Lolos Passing Grade 70% Evaluasi Capstone untuk Klaim E-Sertifikat Resmi Terverifikasi.`,
  ].join("\n");

  const datesParam = `${formatGCalDateTime(startDate)}/${formatGCalDateTime(endDate)}`;

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", title);
  url.searchParams.set("dates", datesParam);
  url.searchParams.set("details", details);
  url.searchParams.set("location", "TamanKuliner.com - LMS Kuliner Syariah");
  url.searchParams.set("ctz", "Asia/Jakarta");

  return url.toString();
}

/**
 * Generates a direct 1-click Google Calendar URL for the entire study series (Recurring Event)
 */
export function generateGoogleCalendarSeriesUrl(
  schedule: CalculatedSchedule,
  timeWindow: PreferredTimeWindow = "evening",
  businessName = "UMKM Kuliner"
): string {
  const startHour = timeWindow === "morning" ? 6 : timeWindow === "afternoon" ? 14 : 20;
  const startMin = timeWindow === "morning" ? 0 : 30;

  const startDate = new Date(schedule.startDate);
  startDate.setHours(startHour, startMin, 0, 0);

  const endDate = new Date(startDate.getTime() + schedule.dailyMinutes * 60000);

  // Recurrence rule based on schedule rhythm
  let rrule = `RRULE:FREQ=DAILY;COUNT=${schedule.effectiveTargetDays}`;
  if (schedule.studyRhythmLabel.includes("Hari Kerja")) {
    rrule = `RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=${schedule.effectiveTargetDays}`;
  } else if (schedule.studyRhythmLabel.includes("3x Seminggu")) {
    rrule = `RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=${schedule.effectiveTargetDays}`;
  }

  const title = `[LMS Syariah 7 JP] Sesi Belajar Harian - ${businessName}`;
  const details = [
    `🎓 Rencana Belajar 7 JP Kurikulum Digitalisasi Kuliner Syariah`,
    `🏢 Peserta: ${businessName}`,
    `🎯 Target Selesai: ${schedule.effectiveTargetDays} Hari (${schedule.studyRhythmLabel})`,
    `⏱️ Komitmen: ~${schedule.dailyMinutes} Menit/Hari (~${schedule.dailyJp} JP/hari)`,
    `📅 Periode: ${schedule.startDateFormatted} s/d ${schedule.targetCompletionDateFormatted}`,
    ``,
    `📚 Kurikulum Terstandar 7 JP:`,
    `1. Modul 1: Prinsip & Etika Bisnis Islam Digital (1 JP)`,
    `2. Modul 2: Akuntansi Digital & Fintech Syariah (2 JP)`,
    `3. Modul 3: Pemasaran Digital Berbasis Syariah (2 JP)`,
    `4. Modul 4: Persiapan Sertifikasi Halal BPJPH & Capstone (2 JP)`,
    ``,
    `🔗 Platform Belajar: https://TamanKuliner.com`,
  ].join("\n");

  const datesParam = `${formatGCalDateTime(startDate)}/${formatGCalDateTime(endDate)}`;

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", title);
  url.searchParams.set("dates", datesParam);
  url.searchParams.set("details", details);
  url.searchParams.set("recur", rrule);
  url.searchParams.set("location", "TamanKuliner.com - LMS Kuliner Syariah");
  url.searchParams.set("ctz", "Asia/Jakarta");

  return url.toString();
}

/**
 * Returns the Google Calendar direct Import settings URL
 */
export function getGoogleCalendarImportUrl(): string {
  return "https://calendar.google.com/calendar/u/0/r/settings/export";
}

/**
 * Triggers instant browser download of the generated .ics file
 */
export function downloadLearningScheduleIcs(schedule: CalculatedSchedule, businessName = "Dapur_Sambal_Berkah"): string {
  const icsContent = generateLearningScheduleIcs(schedule, businessName);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileName = `Jadwal_Belajar_7JP_Syariah_${schedule.effectiveTargetDays}Hari_${businessName.replace(/\s+/g, "_")}.ics`;
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
  return fileName;
}
