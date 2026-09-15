import { HalalChecklistItem } from "../types";

export const initialHalalChecklist: HalalChecklistItem[] = [
  // Kategori: Bahan Baku
  {
    id: "h-bb-1",
    category: "Bahan Baku",
    title: "Daftar Bahan Kritis Bersertifikat Halal",
    desc: "Daging ayam, sapi, bumbu olahan, kecap, saus, dan keju telah memiliki sertifikat halal resmi BPJPH/MUI.",
    checked: true,
    required: true,
    deadline: "2026-09-04",
  },
  {
    id: "h-bb-2",
    category: "Bahan Baku",
    title: "Daftar Bahan Non-Kritis (Positive List)",
    desc: "Bahan alami segar mentah (beras, sayur, buah, bumbu dapur segar) terdata rapi dalam matriks bahan.",
    checked: true,
    required: true,
    deadline: "2026-09-06",
  },
  {
    id: "h-bb-3",
    category: "Bahan Baku",
    title: "Verifikasi Bahan Tambahan Pangan (BTP) & Perisa",
    desc: "Pewarna, perisa, pengemulsi, dan ragi terverifikasi bebas kandungan hewani non-halal dan alkohol.",
    checked: true,
    required: false,
  },

  // Kategori: Proses Produksi
  {
    id: "h-pp-1",
    category: "Proses Produksi",
    title: "Dokumen Manual SJPH (Sistem Jaminan Produk Halal)",
    desc: "Memiliki panduan tertulis komitmen halal, SOP pembelian bahan, dan SOP penanganan produk cacat.",
    checked: false,
    required: true,
    deadline: "2026-09-12",
    pendingSince: "2026-09-06T14:00:00.000Z", // Tertunda > 48 jam
  },
  {
    id: "h-pp-2",
    category: "Proses Produksi",
    title: "Alur Produksi Bebas Kontaminasi Silang",
    desc: "Alur pengolahan makanan mulai dari penerimaan bahan hingga penyajian dijamin bebas paparan najis.",
    checked: true,
    required: true,
    deadline: "2026-09-05",
  },
  {
    id: "h-pp-3",
    category: "Proses Produksi",
    title: "Audit Internal Halal & Tinjauan Berkala",
    desc: "Pemeriksaan internal mandiri minimal sekali tiap 6 bulan oleh Penyelia Halal untuk evaluasi operasional.",
    checked: false,
    required: false,
    pendingSince: "2026-09-06T16:30:00.000Z", // Tertunda > 48 jam
  },

  // Kategori: Peralatan
  {
    id: "h-pr-1",
    category: "Peralatan",
    title: "Pemisahan Alat & Dapur Bebas Najis",
    desc: "Wadah, pisau, talenan, wajan, dan blender tidak pernah digunakan untuk mengolah bahan non-halal/najis.",
    checked: true,
    required: true,
    deadline: "2026-09-08",
  },
  {
    id: "h-pr-2",
    category: "Peralatan",
    title: "SOP Kebersihan & Sanitasi Ruang Produksi",
    desc: "Jadwal pencucian peralatan, penanganan limbah minyak jelantah, dan penyimpanan higienis terstandar.",
    checked: true,
    required: false,
  },
  {
    id: "h-pr-3",
    category: "Peralatan",
    title: "Wadah & Tempat Penyimpanan Dingin Khusus Halal",
    desc: "Chiller, freezer, dan rak penyimpanan diberi label khusus dan terpisah dari bahan lain yang belum jelas kehalalannya.",
    checked: true,
    required: true,
    deadline: "2026-09-10",
  },

  // Kategori: Legalitas & Personel
  {
    id: "h-lp-1",
    category: "Legalitas & Personel",
    title: "Nomor Induk Berusaha (NIB) Berbasis Risiko",
    desc: "NIB aktif terdaftar di OSS RBA dengan KBLI industri atau kedai makanan dan minuman yang relevan.",
    checked: true,
    required: true,
    deadline: "2026-09-03",
  },
  {
    id: "h-lp-2",
    category: "Legalitas & Personel",
    title: "Penetapan Penyelia Halal Internal",
    desc: "Menunjuk minimal 1 staf/pemilik beragama Islam yang memiliki Surat Keputusan (SK) Penyelia Halal.",
    checked: true,
    required: true,
    deadline: "2026-09-15",
  },
];

