export interface VerifiedMentor {
  id: string;
  name: string;
  title: string;
  institution: string;
  culinaryCategories: string[];
  recommendedCategory: string;
  experienceYears: number;
  rating: number;
  totalMentees: number;
  photoInitials: string;
  avatarBgColor: string;
  verifiedBadges: string[];
  specialties: string[];
  bio: string;
  progressFocus: {
    minModules: number;
    recommendedStage: string;
    rationale: string;
  };
  availableSlots: Array<{
    date: string;
    time: string;
    sessionType: "Online Video Call" | "Tatap Muka Sleman";
  }>;
}

export interface MentorshipRequest {
  id: string;
  bookingCode: string;
  mentorId: string;
  mentorName: string;
  mentorTitle: string;
  menteeName: string;
  businessName: string;
  culinaryCategory: string;
  completedModulesCount: number;
  focusTopic: string;
  selectedDate: string;
  selectedTime: string;
  sessionType: "Online Video Call" | "Tatap Muka Sleman";
  notes: string;
  status: "confirmed" | "scheduled" | "completed";
  createdAt: string;
}

export const verifiedMentorsList: VerifiedMentor[] = [
  {
    id: "mentor-nusantara-1",
    name: "Dr. H. Ahmad Fauzi, M.E.I., CPSA",
    title: "Konsultan Senior Bisnis Syariah & Pakar Fiqih Muamalah Kuliner Nusantara",
    institution: "Dewan Pakar Muamalah BAZNAS & Asosiasi Pengusaha Kuliner Muslim",
    culinaryCategories: ["Aneka Masakan Nusantara", "Katering & Siap Saji"],
    recommendedCategory: "Aneka Masakan Nusantara",
    experienceYears: 14,
    rating: 4.96,
    totalMentees: 342,
    photoInitials: "AF",
    avatarBgColor: "from-emerald-600 to-teal-800",
    verifiedBadges: [
      "Verified Syariah Expert",
      "Pakar Muamalah DSN-MUI",
      "Asesor 5C Bankable UMKM"
    ],
    specialties: [
      "Audit Halal Rantai Pasok Bumbu & Daging Tradisional",
      "Restrukturisasi Akad Modal Kerja Murabahah & Mudharabah",
      "Sistem Akuntansi Warung/Resto Syariah Tanpa Riba",
      "Strategi Ekspansi Rumah Makan Nusantara Berkah"
    ],
    bio: "Berpengalaman lebih dari 14 tahun mendampingi ratusan rumah makan tradisional, restoran Padang, warung nusantara, dan UMKM sambal/olahan khas daerah untuk naik kelas menjadi usaha yang bankable, terstandarisasi syariah, dan bebas praktik muamalah fasid.",
    progressFocus: {
      minModules: 2,
      recommendedStage: "Scaling & Validasi Pembiayaan",
      rationale: "Sangat ideal untuk UMKM Aneka Masakan Nusantara yang telah menuntaskan modul dasar dan membutuhkan validasi akad pembiayaan dapur produksi serta sertifikasi rantai pasok rempah."
    },
    availableSlots: [
      { date: "Besok (10:00 WIB)", time: "10:00 - 11:00 WIB", sessionType: "Online Video Call" },
      { date: "Lusa (14:00 WIB)", time: "14:00 - 15:00 WIB", sessionType: "Online Video Call" },
      { date: "Jumat (15:30 WIB)", time: "15:30 - 16:30 WIB", sessionType: "Tatap Muka Sleman" },
      { date: "Senin Depan (09:00 WIB)", time: "09:00 - 10:00 WIB", sessionType: "Online Video Call" }
    ]
  },
  {
    id: "mentor-beverage-1",
    name: "Ustadz Ir. M. Syukron Habibie, M.M., C.Sh.",
    title: "Praktisi Franchise Syariah & Konsultan Minuman/Coffee Shop Halal",
    institution: "Komite Kuliner Halal Kadin & Dewan Pengawas Syariah",
    culinaryCategories: ["Minuman & Kopi Kekinian", "Camilan & Frozen Food"],
    recommendedCategory: "Minuman & Kopi Kekinian",
    experienceYears: 11,
    rating: 4.94,
    totalMentees: 278,
    photoInitials: "SH",
    avatarBgColor: "from-amber-600 to-yellow-800",
    verifiedBadges: [
      "Verified Syariah Expert",
      "Spesialis Franchise Syariah",
      "Lead Auditor SJPH Minuman"
    ],
    specialties: [
      "Verifikasi Kehalalan Sirup, Flavor & Ekstrak Kopi",
      "Akad Syirkah Inan untuk Pembukaan Outlet/Booth Baru",
      "Etika Promosi Media Sosial Anti-Gharar & Zero-Hype",
      "Manajemen HPP & Cash Flow Kedai Minuman Berkelanjutan"
    ],
    bio: "Pendamping lebih dari 80 brand coffee shop dan booth minuman modern di berbagai kota. Fokus pada pemurnian bahan baku sirup impor/lokal, model kemitraan syirkah berkeadilan, dan digitalisasi kasir syariah.",
    progressFocus: {
      minModules: 1,
      recommendedStage: "Fondasi Bisnis & Kemitraan",
      rationale: "Membantu pelaku usaha minuman modern memvalidasi kehalalan perasa/emulsi serta menyusun akad bagi hasil syirkah yang adil bagi mitra investor."
    },
    availableSlots: [
      { date: "Besok (13:30 WIB)", time: "13:30 - 14:30 WIB", sessionType: "Online Video Call" },
      { date: "Kamis (10:00 WIB)", time: "10:00 - 11:00 WIB", sessionType: "Online Video Call" },
      { date: "Sabtu (10:00 WIB)", time: "10:00 - 11:00 WIB", sessionType: "Tatap Muka Sleman" }
    ]
  },
  {
    id: "mentor-bakery-1",
    name: "Hj. Ratna Kusuma, S.Pt., M.Sc.",
    title: "Auditor Senior LPH & Konsultan Kepatuhan Bahan Baku Bakery/Pastry",
    institution: "Lembaga Pemeriksa Halal & Praktisi Industri Roti Halal",
    culinaryCategories: ["Kue & Roti (Bakery/Pastry)", "Camilan & Frozen Food"],
    recommendedCategory: "Kue & Roti (Bakery/Pastry)",
    experienceYears: 13,
    rating: 4.98,
    totalMentees: 310,
    photoInitials: "RK",
    avatarBgColor: "from-rose-600 to-pink-800",
    verifiedBadges: [
      "Verified Syariah Expert",
      "Asesor Halal BPJPH",
      "Ahli Titik Kritis Emulsifier"
    ],
    specialties: [
      "Audit Bahan Kritis Bakery (Emulsifier, Gelatin, Shortening)",
      "Penyusunan Manual SJPH Mandatori Pabrik/Dapur Roti",
      "Sistem Penyelia Halal Internal Sesuai UU No. 33/2014",
      "Simulasi Pembiayaan Alat Oven/Mixer Murabahah"
    ],
    bio: "Pakar bahan baku pangan dengan spesialisasi titik kritis produk olahan tepung, lemak reroti, enzim ragi, dan pewarna makanan. Berhasil mengantarkan lebih dari 150 produsen bakery meraih sertifikat halal BPJPH tanpa kendala audit.",
    progressFocus: {
      minModules: 3,
      recommendedStage: "Audit Halal & SJPH Lanjutan",
      rationale: "Fokus mendalam pada eliminasi risiko turunan lemak hewan non-halal pada margarin, shortening, dan perisa cake/pastry."
    },
    availableSlots: [
      { date: "Kamis (14:00 WIB)", time: "14:00 - 15:00 WIB", sessionType: "Online Video Call" },
      { date: "Jumat (09:30 WIB)", time: "09:30 - 10:30 WIB", sessionType: "Online Video Call" },
      { date: "Senin Depan (13:30 WIB)", time: "13:30 - 14:30 WIB", sessionType: "Tatap Muka Sleman" }
    ]
  },
  {
    id: "mentor-frozen-1",
    name: "Ir. Hendra Gunawan, S.T., M.Si., CSFP",
    title: "Spesialis Cold Chain Halal & Digital Scale-up Frozen Food",
    institution: "Asosiasi Rantai Dingin Indonesia & Inkubator Industri Halal",
    culinaryCategories: ["Camilan & Frozen Food", "Aneka Masakan Nusantara"],
    recommendedCategory: "Camilan & Frozen Food",
    experienceYears: 10,
    rating: 4.92,
    totalMentees: 224,
    photoInitials: "HG",
    avatarBgColor: "from-sky-600 to-blue-800",
    verifiedBadges: [
      "Verified Syariah Expert",
      "Konsultan Cold Chain Halal",
      "Ahli Pemasaran Marketplace B2B"
    ],
    specialties: [
      "Standarisasi Higienitas & Pemisahan Fasilitas Cold Storage Halal",
      "Pengemasan Vakum & Ketahanan Produk Tanpa Pengawet Terlarang",
      "Integrasi Marketplace Kuliner & Reseller Muamalah Amanah",
      "Kalkulasi Zakat Perniagaan Stok Frozen Food Akhir Tahun"
    ],
    bio: "Membimbing UMKM frozen food dan camilan kemasan dalam membangun sistem logistik rantai dingin higienis, pencatatan batch produksi halal, dan pengelolaan jaringan reseller berbasis akad Wakalah bil Ujrah.",
    progressFocus: {
      minModules: 2,
      recommendedStage: "Pemasaran & Logistik Terpadu",
      rationale: "Cocok untuk UMKM yang ingin memperluas jangkauan antar-kota dengan jaminan rantai dingin halal dan kepatuhan akad titip jual."
    },
    availableSlots: [
      { date: "Rabu (15:00 WIB)", time: "15:00 - 16:00 WIB", sessionType: "Online Video Call" },
      { date: "Jumat (10:00 WIB)", time: "10:00 - 11:00 WIB", sessionType: "Online Video Call" },
      { date: "Selasa Depan (14:00 WIB)", time: "14:00 - 15:00 WIB", sessionType: "Tatap Muka Sleman" }
    ]
  },
  {
    id: "mentor-catering-1",
    name: "Dra. Hj. Nurul Hidayati, M.Si., Ak., CA",
    title: "Pakar Tata Kelola Keuangan Syariah & Katering Skala Komersial",
    institution: "Ikatan Akuntan Indonesia (Kompartemen Syariah) & Konsultan Katering",
    culinaryCategories: ["Katering & Siap Saji", "Aneka Masakan Nusantara"],
    recommendedCategory: "Katering & Siap Saji",
    experienceYears: 15,
    rating: 4.97,
    totalMentees: 380,
    photoInitials: "NH",
    avatarBgColor: "from-purple-600 to-indigo-800",
    verifiedBadges: [
      "Verified Syariah Expert",
      "Akuntan Publik Syariah (IAI)",
      "Pendamping 500+ Dapur Katering"
    ],
    specialties: [
      "Penyusunan Laporan Laba Rugi Sesuai PSAK 101/102 Syariah",
      "Pengajuan Pembiayaan Modal Kerja Pengadaan Bahan Baku Partai Besar",
      "Audit Menu Prasmanan & Dapur Sentral Bersertifikat SJPH",
      "Manajemen Piutang Katering Korporat Bebas Riba Jahiliyah"
    ],
    bio: "Pakar akuntansi syariah berpengalaman 15 tahun membantu bisnis katering pernikahan, katering kantor, dan dapur sentral merapikan cash flow, menghindari denda keterlambatan ribawi, dan mengakses fasilitas pembiayaan bank syariah hingga miliaran rupiah.",
    progressFocus: {
      minModules: 2,
      recommendedStage: "Finansial Bankable & Skala Besar",
      rationale: "Solusi terdepan bagi pelaku katering yang berhadapan dengan permodalan belanja tempo besar dan kebutuhan akuntansi yang ketat."
    },
    availableSlots: [
      { date: "Kamis (11:00 WIB)", time: "11:00 - 12:00 WIB", sessionType: "Online Video Call" },
      { date: "Jumat (13:30 WIB)", time: "13:30 - 14:30 WIB", sessionType: "Tatap Muka Sleman" },
      { date: "Senin Depan (15:00 WIB)", time: "15:00 - 16:00 WIB", sessionType: "Online Video Call" }
    ]
  }
];

export interface SuggestedMentorResult {
  mentor: VerifiedMentor;
  matchScore: number;
  matchReason: string;
  progressContext: string;
  recommendedTopics: string[];
}

export function getSuggestedMentor(
  culinaryCategory: string = "Aneka Masakan Nusantara",
  completedModulesCount: number = 3,
  hasPassedExam: boolean = true,
  highestScore: number = 91
): SuggestedMentorResult {
  // 1. Find mentor with exact or primary category match
  let matchedMentor = verifiedMentorsList.find(
    (m) => m.recommendedCategory.toLowerCase() === culinaryCategory.toLowerCase()
  );

  // 2. If not found by primary, find by includes
  if (!matchedMentor) {
    matchedMentor = verifiedMentorsList.find((m) =>
      m.culinaryCategories.some((cat) =>
        cat.toLowerCase().includes(culinaryCategory.toLowerCase()) ||
        culinaryCategory.toLowerCase().includes(cat.toLowerCase())
      )
    );
  }

  // 3. Fallback to Dr. H. Ahmad Fauzi (Nusantara & general)
  if (!matchedMentor) {
    matchedMentor = verifiedMentorsList[0];
  }

  // 4. Calculate match score based on category alignment and progress
  let matchScore = 94;
  if (matchedMentor.recommendedCategory.toLowerCase() === culinaryCategory.toLowerCase()) {
    matchScore += 4;
  }
  if (completedModulesCount >= matchedMentor.progressFocus.minModules) {
    matchScore += 2;
  }
  matchScore = Math.min(99, matchScore);

  // 5. Generate tailored progress context
  let progressContext = "";
  if (completedModulesCount >= 4 && hasPassedExam) {
    progressContext = `Peserta telah menuntaskan seluruh 4 Modul Kurikulum (7 JP) dengan Skor Evaluasi ${highestScore}/100. Berada di tahap Capstone: siap mengajukan proposal pembiayaan bankable dan sertifikasi mandatori BPJPH.`;
  } else if (completedModulesCount >= 3) {
    progressContext = `Peserta telah menyelesaikan 3 dari 4 Modul (75% Progres Kurikulum). Memiliki fondasi kuat dalam 5C Bankable, akuntansi syariah, dan pemasaran amanah. Siap menuntaskan modul SJPH Halal.`;
  } else if (completedModulesCount >= 2) {
    progressContext = `Peserta menyelesaikan 2 dari 4 Modul (50% Kurikulum). Sedang aktif mempelajari pembukuan syariah dan simulasi pembiayaan Murabahah.`;
  } else {
    progressContext = `Peserta berada di tahap awal kurikulum (Modul 1: Prinsip Bisnis Islam & Kriteria 5C Bankable). Membutuhkan arahan strategi fondasi dan pemisahan rekening usaha.`;
  }

  // 6. Generate tailored match reason
  const matchReason = `Direkomendasikan secara khusus untuk brand kuliner "${culinaryCategory}". ${matchedMentor.name} memiliki rekam jejak ${matchedMentor.experienceYears}+ tahun dalam klaster ${matchedMentor.recommendedCategory} dan selaras dengan capaian progres belajar Anda saat ini (${completedModulesCount}/4 Modul tuntas).`;

  // 7. Dynamic recommended topics for the session
  const recommendedTopics = [
    `Audit Kehalalan Rantai Pasok Khusus Usaha ${culinaryCategory}`,
    `Review Kelayakan 5C & Proposal Pembiayaan Murabahah Bank Syariah`,
    `Verifikasi Akad Muamalah Penjualan Online Bebas Gharar & Overclaim`,
    `Penyusunan Dokumen Penyelia Halal & Registrasi Akun SIHALAL BPJPH`
  ];

  return {
    mentor: matchedMentor,
    matchScore,
    matchReason,
    progressContext,
    recommendedTopics
  };
}
