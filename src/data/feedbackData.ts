export interface ModuleFeedback {
  id: string;
  moduleId: string; // e.g., "modul-1", "modul-2", "modul-3", "modul-4"
  moduleNumber: number;
  moduleTitle: string;
  userName: string;
  businessName: string;
  culinaryCategory?: string;
  rating: number; // 1 to 5 stars
  clarityRating: number; // 1 to 5
  relevanceRating: number; // 1 to 5
  aspectTag: 
    | "Kejelasan Akad Muamalah" 
    | "Kriteria 5C Bankable" 
    | "SJPH & Titik Kritis Halal" 
    | "Pemisahan Kas & Rekening" 
    | "Pemasaran Amanah (Anti-Gharar)" 
    | "Materi Umum & Studi Kasus";
  commentary: string;
  suggestion?: string;
  status: "submitted" | "reviewed" | "actioned";
  managementResponse?: string;
  sentiment: "positive" | "neutral" | "constructive";
  createdAt: string; // ISO string
}

export const initialModuleFeedbackList: ModuleFeedback[] = [
  {
    id: "fb-101",
    moduleId: "modul-1",
    moduleNumber: 1,
    moduleTitle: "Prinsip dan Etika Bisnis Islam pada Usaha Terdigitalisasi",
    userName: "Hj. Siti Rahmah",
    businessName: "Dapur Sambal Berkah",
    culinaryCategory: "Aneka Masakan Nusantara",
    rating: 5,
    clarityRating: 5,
    relevanceRating: 5,
    aspectTag: "Kriteria 5C Bankable",
    commentary: "Penjelasan mengenai 5C (Character, Capacity, Capital, Collateral, Condition) sangat aplikatif untuk warung kuliner. Baru paham bagaimana memisahkan rekening pribadi dengan modal warung agar dinilai bankable oleh BSI.",
    suggestion: "Mohon ditambahkan template proposal pengajuan pembiayaan Murabahah sederhana dalam format PDF/Excel.",
    status: "reviewed",
    managementResponse: "Jazakillah Khairan Bu Siti. Template proposal pembiayaan syariah siap pakai telah ditambahkan pada lampiran Modul 1 & Kalkulator 5C.",
    sentiment: "positive",
    createdAt: "2026-09-08T10:15:00Z"
  },
  {
    id: "fb-102",
    moduleId: "modul-4",
    moduleNumber: 4,
    moduleTitle: "Sistem Jaminan Produk Halal (SJPH) dan Akses Pembiayaan Bankable",
    userName: "Bambang Triyono",
    businessName: "Gudeg Yu Djum Barokah",
    culinaryCategory: "Aneka Masakan Nusantara",
    rating: 5,
    clarityRating: 4,
    relevanceRating: 5,
    aspectTag: "SJPH & Titik Kritis Halal",
    commentary: "Panduan audit titik kritis daging ayam dan santan kelapa sangat rinci. Kami sekarang tahu cara memeriksa surat ketetapan halal dari RPH pemasok daging tanpa bingung.",
    suggestion: "Contoh foto dokumen SJPH yang lolos audit BPJPH mohon diperbanyak resolusinya.",
    status: "reviewed",
    managementResponse: "Terima kasih Pak Bambang. Galeri visual dokumen SJPH beresolusi tinggi sudah disinkronkan ke tab Halal Readiness Tracker.",
    sentiment: "positive",
    createdAt: "2026-09-07T14:30:00Z"
  },
  {
    id: "fb-103",
    moduleId: "modul-2",
    moduleNumber: 2,
    moduleTitle: "Perencanaan Keuangan dan Pemisahan Kas Syariah",
    userName: "Fadhil Muhammad, S.Kom.",
    businessName: "Kopi Seduh Ukhuwah",
    culinaryCategory: "Minuman & Kopi Kekinian",
    rating: 4,
    clarityRating: 5,
    relevanceRating: 4,
    aspectTag: "Pemisahan Kas & Rekening",
    commentary: "Rumus perhitungan margin bagi hasil Mudharabah dan pemisahan kas harian warung kopi sangat membantu kami menetapkan gaji pemilik yang adil tanpa merusak cash flow usaha.",
    suggestion: "Akan lebih lengkap bila ada studi kasus pencatatan kasir digital berbasis cloud (POS).",
    status: "actioned",
    managementResponse: "Saran diterima! Integrasi alur kasir POS syariah telah dijadwalkan pada pembaruan kurikulum batch berikutnya.",
    sentiment: "positive",
    createdAt: "2026-09-06T09:45:00Z"
  },
  {
    id: "fb-104",
    moduleId: "modul-3",
    moduleNumber: 3,
    moduleTitle: "Pemasaran Digital Berbasis Etika dan Anti-Gharar",
    userName: "Dewi Anggraini",
    businessName: "Roti & Pastry Berkah Sleman",
    culinaryCategory: "Kue & Roti (Bakery/Pastry)",
    rating: 5,
    clarityRating: 5,
    relevanceRating: 5,
    aspectTag: "Pemasaran Amanah (Anti-Gharar)",
    commentary: "Sangat tercerahkan mengenai batasan endorsement dan larangan promosi overclaim dalam Islam. Kami mengubah deskripsi produk cake kami agar transparan terkait berat bersih dan tanggal kedaluwarsa.",
    suggestion: "Tolong adakan sesi webinar tanya jawab langsung dengan praktisi digital marketer muslim.",
    status: "reviewed",
    managementResponse: "Alhamdulillah. Anda dapat memanfaatkan fitur Mentor Connection untuk sesi 1-on-1 bersama praktisi franchise syariah kami.",
    sentiment: "positive",
    createdAt: "2026-09-05T16:20:00Z"
  },
  {
    id: "fb-105",
    moduleId: "modul-1",
    moduleNumber: 1,
    moduleTitle: "Prinsip dan Etika Bisnis Islam pada Usaha Terdigitalisasi",
    userName: "Hendra Kusuma",
    businessName: "Frozen Food Barokah Mandiri",
    culinaryCategory: "Camilan & Frozen Food",
    rating: 4,
    clarityRating: 4,
    relevanceRating: 5,
    aspectTag: "Kejelasan Akad Muamalah",
    commentary: "Perbedaan akad Murabahah, Salam, dan Istishna' dijelaskan dengan gamblang. Sangat berguna untuk kami yang memproduksi frozen food sistem pre-order.",
    suggestion: "Mohon sertakan bagan alir visual interaktif untuk alur akad Salam produk katering.",
    status: "submitted",
    sentiment: "neutral",
    createdAt: "2026-09-04T11:00:00Z"
  }
];

const LOCAL_STORAGE_KEY = "tk_module_feedback_list";

export function loadStoredFeedback(): ModuleFeedback[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Gagal memuat feedback dari localStorage", e);
  }
  return initialModuleFeedbackList;
}

export function saveStoredFeedback(feedbackList: ModuleFeedback[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(feedbackList));
  } catch (e) {
    console.error("Gagal menyimpan feedback ke localStorage", e);
  }
}

export function addModuleFeedback(
  newFeedback: Omit<ModuleFeedback, "id" | "createdAt" | "status" | "sentiment"> & {
    sentiment?: "positive" | "neutral" | "constructive";
  }
): { savedItem: ModuleFeedback; allItems: ModuleFeedback[] } {
  const currentList = loadStoredFeedback();
  
  // Calculate automatic sentiment if not provided
  let sentiment: "positive" | "neutral" | "constructive" = newFeedback.sentiment || "positive";
  if (!newFeedback.sentiment) {
    if (newFeedback.rating >= 4) {
      sentiment = "positive";
    } else if (newFeedback.rating === 3) {
      sentiment = "neutral";
    } else {
      sentiment = "constructive";
    }
  }

  const item: ModuleFeedback = {
    ...newFeedback,
    id: `fb-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "submitted",
    sentiment
  };

  const updatedList = [item, ...currentList];
  saveStoredFeedback(updatedList);

  return { savedItem: item, allItems: updatedList };
}

export interface FeedbackSummaryStats {
  totalCount: number;
  averageRating: number;
  averageClarity: number;
  averageRelevance: number;
  ratingDistribution: { [star: number]: number };
  moduleBreakdown: Array<{
    moduleId: string;
    moduleNumber: number;
    moduleTitle: string;
    count: number;
    avgRating: number;
    avgClarity: number;
  }>;
}

export function computeFeedbackStats(feedbackList: ModuleFeedback[]): FeedbackSummaryStats {
  const totalCount = feedbackList.length;
  if (totalCount === 0) {
    return {
      totalCount: 0,
      averageRating: 0,
      averageClarity: 0,
      averageRelevance: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      moduleBreakdown: []
    };
  }

  let sumRating = 0;
  let sumClarity = 0;
  let sumRelevance = 0;
  const ratingDist: { [star: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const moduleMap = new Map<string, { moduleNumber: number; title: string; count: number; sumRating: number; sumClarity: number }>();

  // Initialize with the 4 modules
  const defaultModules = [
    { id: "modul-1", num: 1, title: "Prinsip dan Etika Bisnis Islam pada Usaha Terdigitalisasi" },
    { id: "modul-2", num: 2, title: "Perencanaan Keuangan dan Pemisahan Kas Syariah" },
    { id: "modul-3", num: 3, title: "Pemasaran Digital Berbasis Etika dan Anti-Gharar" },
    { id: "modul-4", num: 4, title: "Sistem Jaminan Produk Halal (SJPH) dan Akses Pembiayaan Bankable" },
  ];

  defaultModules.forEach(m => {
    moduleMap.set(m.id, { moduleNumber: m.num, title: m.title, count: 0, sumRating: 0, sumClarity: 0 });
  });

  feedbackList.forEach(fb => {
    sumRating += fb.rating;
    sumClarity += fb.clarityRating;
    sumRelevance += fb.relevanceRating;

    const roundedStar = Math.min(5, Math.max(1, Math.round(fb.rating)));
    ratingDist[roundedStar] = (ratingDist[roundedStar] || 0) + 1;

    const mod = moduleMap.get(fb.moduleId) || {
      moduleNumber: fb.moduleNumber,
      title: fb.moduleTitle,
      count: 0,
      sumRating: 0,
      sumClarity: 0
    };

    mod.count += 1;
    mod.sumRating += fb.rating;
    mod.sumClarity += fb.clarityRating;
    moduleMap.set(fb.moduleId, mod);
  });

  const moduleBreakdown = Array.from(moduleMap.entries()).map(([mId, data]) => ({
    moduleId: mId,
    moduleNumber: data.moduleNumber,
    moduleTitle: data.title,
    count: data.count,
    avgRating: data.count > 0 ? Number((data.sumRating / data.count).toFixed(1)) : 5.0,
    avgClarity: data.count > 0 ? Number((data.sumClarity / data.count).toFixed(1)) : 5.0,
  })).sort((a, b) => a.moduleNumber - b.moduleNumber);

  return {
    totalCount,
    averageRating: Number((sumRating / totalCount).toFixed(2)),
    averageClarity: Number((sumClarity / totalCount).toFixed(2)),
    averageRelevance: Number((sumRelevance / totalCount).toFixed(2)),
    ratingDistribution: ratingDist,
    moduleBreakdown
  };
}
