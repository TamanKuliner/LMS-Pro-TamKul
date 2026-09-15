export interface QuickKnowledgeQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  citation: string;
}

export interface ModuleVideoInfo {
  moduleId: string;
  moduleNumber: number;
  title: string;
  lectureTopic: string;
  instructorName: string;
  instructorTitle: string;
  totalDurationSeconds: number;
  durationFormatted: string;
  thumbnailBadge: string;
  subtitles: Array<{
    startSec: number;
    endSec: number;
    text: string;
  }>;
}

export const moduleVideoInfoList: Record<string, ModuleVideoInfo> = {
  "modul-1": {
    moduleId: "modul-1",
    moduleNumber: 1,
    title: "Video Kuliah 1: Fondasi Fiqih Muamalah & Kriteria 5C Bankable UMKM",
    lectureTopic: "Mindset Bisnis Syariah Digital, Akad Kemitraan, & Standar Kelayakan Perbankan",
    instructorName: "Ust. Dr. Muhammad Zaki, M.E.I",
    instructorTitle: "Dewan Pakar Muamalah & Konsultan Bank Syariah",
    totalDurationSeconds: 240, // 4 menit ringkasan video modul
    durationFormatted: "04:00",
    thumbnailBadge: "Fiqih Muamalah & 5C",
    subtitles: [
      { startSec: 0, endSec: 15, text: "Assalamu'alaikum wr. wb. Selamat datang di Modul 1: Prinsip dan Etika Bisnis Islam di Era Digital." },
      { startSec: 16, endSec: 40, text: "Teknologi adalah wasilah (alat), sedangkan syariat Islam adalah maqashid (tujuan mulia) menjaga kehalalan harta dan ketenteraman batin." },
      { startSec: 41, endSec: 75, text: "Dalam perbankan syariah, evaluasi kelayakan menggunakan pilar 5C: Character, Capacity, Capital, Collateral, dan Condition." },
      { startSec: 76, endSec: 120, text: "Pilar 'Capacity' menguji kapasitas manajemen pengusaha mengelola pesanan, kestabilan omzet, dan kemampuan melunasi kewajiban." },
      { startSec: 121, endSec: 170, text: "Pahami akad: Mudharabah (modal 100% investor, bagi hasil) dan Murabahah (jual beli barang margin transparan)." },
      { startSec: 171, endSec: 210, text: "Hindari Tadlis (penipuan takaran/kondisi bahan) dan Gharar (ketidakjelasan menu). Kejujuran adalah magnet rezeki berkah." },
      { startSec: 211, endSec: 240, text: "Selamat menyelesaikan video! Bersiaplah mengikuti Quick Knowledge Check untuk menguji pemahaman Anda." },
    ],
  },
  "modul-2": {
    moduleId: "modul-2",
    moduleNumber: 2,
    title: "Video Kuliah 2: Akuntansi Digital, Pemisahan Kas, & Simulasi Murabahah",
    lectureTopic: "Pencatatan Keuangan Syariah, Aplikasi Kasir Digital, & Zakat Perniagaan 2.5%",
    instructorName: "Hj. Ratna Safitri, S.E., Ak., CA",
    instructorTitle: "Praktisi Akuntansi Syariah & Pembina Finansial UMKM",
    totalDurationSeconds: 270,
    durationFormatted: "04:30",
    thumbnailBadge: "Akuntansi & Zakat",
    subtitles: [
      { startSec: 0, endSec: 20, text: "Selamat datang di Modul 2: Penyusunan Laporan Keuangan dan Akuntansi Syariah UMKM Kuliner." },
      { startSec: 21, endSec: 60, text: "Langkah terpenting bagi pedagang makanan adalah memisahkan rekening pribadi dengan rekening kas operasional dapur." },
      { startSec: 61, endSec: 110, text: "Akad Murabahah sangat cocok untuk pengadaan alat dapur seperti oven atau freezer dengan cicilan tetap tanpa bunga siluman." },
      { startSec: 111, endSec: 165, text: "Gunakan fintech syariah resmi berizin OJK untuk pengajuan pembiayaan modal kerja yang transparan dan diawasi Dewan Pengawas Syariah." },
      { startSec: 166, endSec: 220, text: "Zakat perniagaan wajib 2.5% dari aktiva lancar bersih setelah mencapai nisab setara 85 gram emas dan haul 1 tahun." },
      { startSec: 221, endSec: 270, text: "Alhamdulillah! Video tuntas. Uji pemahaman Anda dengan menjawab 3 soal evaluasi singkat berikut." },
    ],
  },
  "modul-3": {
    moduleId: "modul-3",
    moduleNumber: 3,
    title: "Video Kuliah 3: Pemasaran Digital Beretika & Anti-Overclaim di Media Sosial",
    lectureTopic: "Strategi Konten Kejujuran (As-Sidq), Anti-Tadlis, & Storytelling Dapur Halal",
    instructorName: "Farhan Ramadhan, M.B.A",
    instructorTitle: "Digital Marketing Strategist & Konsultan Branding Halal",
    totalDurationSeconds: 250,
    durationFormatted: "04:10",
    thumbnailBadge: "Pemasaran As-Sidq",
    subtitles: [
      { startSec: 0, endSec: 20, text: "Di Modul 3, kita mempelajari cara mempromosikan produk kuliner di media sosial dengan nilai luhur As-Sidq (Kejujuran)." },
      { startSec: 21, endSec: 70, text: "Foto menu harus mencerminkan porsi dan kualitas nyata di piring konsumen. Hindari overclaim khasiat yang tidak teruji medis." },
      { startSec: 71, endSec: 130, text: "Haram hukumnya melakukan Bai' Najasy: merekayasa review chat palsu atau menyuruh buzzer pura-pura memborong makanan." },
      { startSec: 131, endSec: 190, text: "Gunakan storytelling autentik: perlihatkan kebersihan dapur, asal bahan baku bersertifikat halal, dan kepedulian higienitas." },
      { startSec: 191, endSec: 250, text: "Konsumen modern menghargai transparansi. Sekarang, mari selesaikan Quick Knowledge Check Modul 3!" },
    ],
  },
  "modul-4": {
    moduleId: "modul-4",
    moduleNumber: 4,
    title: "Video Kuliah 4: Strategi Menembus Sertifikasi Halal BPJPH & Audit SJPH",
    lectureTopic: "Regulasi UU No. 33/2014, Kriteria SJPH, & Sukses Submit Portal SIHALAL",
    instructorName: "Ir. H. Budi Santoso, M.Si",
    instructorTitle: "Auditor Halal Senior LPPOM MUI & BPJPH Kemenag RI",
    totalDurationSeconds: 280,
    durationFormatted: "04:40",
    thumbnailBadge: "Regulasi SJPH & SIHALAL",
    subtitles: [
      { startSec: 0, endSec: 25, text: "Selamat di modul penutup: Strategi Menuju Sertifikasi Halal Resmi BPJPH dan Evaluasi Capstone." },
      { startSec: 26, endSec: 75, text: "UU No. 33 Tahun 2014 mewajibkan seluruh pelaku usaha kuliner memiliki sertifikat halal untuk melindungi hak konsumen muslim." },
      { startSec: 76, endSec: 135, text: "Perhatikan nama produk: dilarang menggunakan nama yang berkonotasi keharaman, mistis, atau setan (seperti 'Mie Iblis')." },
      { startSec: 136, endSec: 200, text: "Pendaftaran dilakukan melalui portal resmi SIHALAL di ptsp.halal.go.id, baik jalur Self-Declare UMK maupun reguler." },
      { startSec: 201, endSec: 250, text: "Pastikan dokumen bahan baku, daftar penyelia halal, dan alur proses produksi halal (PPH) tercatat rapi." },
      { startSec: 251, endSec: 280, text: "Selesai! Selamat menyelesaikan video Modul 4. Tuntaskan Quick Knowledge Check untuk menyempurnakan kompetensi Anda." },
    ],
  },
};

export const quickKnowledgeQuestionsByModule: Record<string, QuickKnowledgeQuestion[]> = {
  "modul-1": [
    {
      id: "qkc-m1-1",
      moduleId: "modul-1",
      question: "Dalam prinsip evaluasi kelayakan pembiayaan syariah 5C untuk UMKM kuliner, pilar 'Capacity' mengukur aspek apa?",
      options: [
        "Integritas moral pribadi dan komitmen keagamaan pengusaha",
        "Kapasitas manajemen operasional, stabilitas arus kas, dan kemampuan melunasi kewajiban",
        "Nilai agunan aset tanah atau sertifikat rumah yang dijaminkan",
        "Kondisi persaingan pasar di lokasi sekitar cabang kuliner"
      ],
      correctAnswer: 1,
      explanation: "Pilar 'Capacity' mengukur kapasitas operasional pengusaha kuliner dalam menghasilkan omzet yang stabil, tata kelola dapur, dan kemampuan menghasilkan arus kas untuk melunasi kewajiban angsuran.",
      citation: "Modul 1: Kriteria UMKM Bankable (Konsep 5C Berbasis Syariah)"
    },
    {
      id: "qkc-m1-2",
      moduleId: "modul-1",
      question: "Jika pemilik modal menyetorkan 100% modal usaha dan pengusaha kuliner bertindak sebagai pengelola penuh dengan nisbah bagi hasil yang disepakati bersama, akad muamalah yang berlaku adalah...",
      options: [
        "Akad Wakalah bil Ujrah",
        "Akad Mudharabah",
        "Akad Murabahah Bil Wakalah",
        "Akad Rahn Tasjily"
      ],
      correctAnswer: 1,
      explanation: "Akad Mudharabah adalah kemitraan usaha antara penyedia modal (shahibul maal) yang menyetorkan 100% dana dengan pengelola usaha (mudharib) berdasarkan kesepakatan nisbah bagi hasil.",
      citation: "Modul 1: Akad-Akad Muamalah dan Prinsip Syariah dalam Bisnis Digital"
    },
    {
      id: "qkc-m1-3",
      moduleId: "modul-1",
      question: "Mengapa menyembunyikan kecacatan bahan baku makanan atau memanipulasi timbangan porsi dilarang keras dalam fiqih muamalah?",
      options: [
        "Karena tergolong transaksi Tadlis (penipuan) dan merugikan hak khiyar konsumen",
        "Karena membuat biaya operasional dapur menjadi lebih tinggi",
        "Karena dilarang oleh asosiasi katering perhotelan",
        "Karena membatalkan izin sertifikat halal secara sepihak"
      ],
      correctAnswer: 0,
      explanation: "Menyembunyikan kecacatan objek barang atau mengurangi porsi secara sengaja termasuk dalam perbuatan Tadlis (penipuan) yang diharamkan syariat dan melanggar prinsip keadilan transaksi.",
      citation: "Modul 1: Prinsip Keadilan & Pencegahan Tadlis dalam Muamalah"
    }
  ],

  "modul-2": [
    {
      id: "qkc-m2-1",
      moduleId: "modul-2",
      question: "Langkah paling mendasar dalam akuntansi syariah bagi UMKM kuliner agar arus kas usaha tidak tercampur adalah...",
      options: [
        "Mencatat semua pengeluaran hanya saat akhir tahun buku",
        "Memisahkan secara tegas rekening bank dan dompet kas pribadi dari kas operasional warung",
        "Meminjam dana ke rentenir untuk menutup kas dapur yang minus",
        "Menolak sistem pembayaran nontunai QRIS"
      ],
      correctAnswer: 1,
      explanation: "Pemisahan rekening pribadi dan operasional usaha adalah fondasi akuntansi amanah yang memungkinkan pengusaha mengetahui laba bersih riil dan menghitung zakat perniagaan secara presisi.",
      citation: "Modul 2: Karakteristik Pembukuan dan Laporan Keuangan Syariah"
    },
    {
      id: "qkc-m2-2",
      moduleId: "modul-2",
      question: "Sebuah warung makan membeli mesin pendingin (chiller) seharga Rp 18.000.000 melalui bank syariah, di mana bank membelikan alat tersebut lalu menjualnya ke UMKM dengan margin disepakati Rp 2.000.000 dan dicicil selama 12 bulan. Akad pembiayaan ini disebut...",
      options: [
        "Akad Murabahah (Jual Beli dengan Margin Transparan)",
        "Akad Ijarah Muntahiya Bittamlik",
        "Akad Qardhul Hasan",
        "Akad Hawalah"
      ],
      correctAnswer: 0,
      explanation: "Akad Murabahah adalah akad jual beli barang dengan menyatakan harga perolehan dan penambahan margin keuntungan yang disepakati bersama dengan skema pembayaran tunai maupun angsuran tetap.",
      citation: "Modul 2: Pembiayaan Berbasis Syariah untuk UMKM Kuliner"
    },
    {
      id: "qkc-m2-3",
      moduleId: "modul-2",
      question: "Berapa kadar zakat perniagaan (zakat mal) yang wajib ditunaikan oleh pelaku usaha kuliner muslim apabila total aset lancar bersih telah mencapai nisab setara 85 gram emas selama 1 tahun (haul)?",
      options: [
        "1.0% dari laba kotor harian",
        "2.5% dari aktiva lancar bersih (kas + piutang lancar + persediaan bahan - kewajiban lancar)",
        "5.0% setiap kali ada pesanan katering baru",
        "10.0% dari total omzet tahunan bruto"
      ],
      correctAnswer: 1,
      explanation: "Kadar zakat perniagaan adalah 2,5% dari aktiva lancar bersih yang telah mencapai nisab 85 gram emas dan genap haul 1 tahun qamariyah menurut fiqih zakat kontemporer.",
      citation: "Modul 2: Perhitungan Zakat Perniagaan UMKM Kuliner"
    }
  ],

  "modul-3": [
    {
      id: "qkc-m3-1",
      moduleId: "modul-3",
      question: "Dalam promosi media sosial kuliner, pilar etika syariah 'As-Sidq' (kejujuran) menuntut pelaku usaha untuk...",
      options: [
        "Mengunggah foto editan berlebihan yang tidak sesuai dengan porsi riil di meja pelanggan",
        "Menyajikan deskripsi menu, porsi, berat bersih, dan komposisi secara jujur tanpa overclaim manipulatif",
        "Menghapus seluruh ulasan kritis yang membangun dari pelanggan",
        "Mengklaim hidangan dapat menyembuhkan penyakit kronis tanpa bukti medis resmi"
      ],
      correctAnswer: 1,
      explanation: "Prinsip As-Sidq mewajibkan kejujuran dalam deskripsi hidangan, porsi, dan bahan baku, serta melarang klaim berlebihan (overclaim) yang dapat mengecoh selera dan ekspektasi konsumen.",
      citation: "Modul 3: Etika & Prinsip Dasar Pemasaran Syariah"
    },
    {
      id: "qkc-m3-2",
      moduleId: "modul-3",
      question: "Mengapa praktik menyewa buzzer atau bot untuk merekayasa chat testimoni palsu dilarang keras dalam syariat?",
      options: [
        "Karena tergolong perbuatan Tadlis (pemalsuan fakta) yang menipu persepsi calon pembeli secara batil",
        "Karena algoritma media sosial akan menaikkan tarif iklan berbayar",
        "Karena menurunkan jumlah engagement video di TikTok",
        "Karena membuat staf dapur terlalu cepat kelelahan"
      ],
      correctAnswer: 0,
      explanation: "Testimoni palsu adalah rekayasa penipuan (tadlis) yang merugikan publik dan melanggar larangan memakan harta manusia dengan jalan yang batil sebagaimana ditegaskan dalam Al-Qur'an.",
      citation: "Modul 3: Larangan Testimoni Fiktif dan Manipulasi Ulasan"
    },
    {
      id: "qkc-m3-3",
      moduleId: "modul-3",
      question: "Istilah fiqih untuk rekayasa menawar harga tinggi secara pura-pura dalam siaran Live Belanja daring agar penonton lain terpancing ikut membeli dengan harga mahal adalah...",
      options: [
        "Bai' Inah",
        "Bai' Najasy (praktik penawaran semu yang diharamkan Rasulullah SAW)",
        "Bai' Salam",
        "Syirkah Wujuh"
      ],
      correctAnswer: 1,
      explanation: "Bai' Najasy adalah praktik penawaran semu di mana seseorang menawar produk dengan harga tinggi bukan untuk membeli, melainkan untuk memancing pembeli lain agar membayar lebih mahal.",
      citation: "Modul 3: Strategi Promosi Digital yang Bersih dari Najasy"
    }
  ],

  "modul-4": [
    {
      id: "qkc-m4-1",
      moduleId: "modul-4",
      question: "Regulasi hukum nasional utama di Indonesia yang mewajibkan seluruh produk makanan dan minuman memiliki sertifikat halal adalah...",
      options: [
        "Undang-Undang No. 33 Tahun 2014 tentang Jaminan Produk Halal (UU JPH)",
        "Undang-Undang No. 7 Tahun 2014 tentang Perdagangan",
        "Undang-Undang No. 11 Tahun 2008 tentang ITE",
        "Undang-Undang No. 20 Tahun 2008 tentang UMKM"
      ],
      correctAnswer: 0,
      explanation: "UU No. 33 Tahun 2014 tentang Jaminan Produk Halal adalah payung hukum utama yang mewajibkan sertifikasi halal bagi produk makanan dan minuman yang beredar di Indonesia.",
      citation: "Modul 4: Regulasi UU No. 33/2014 dan Sistem Jaminan Produk Halal"
    },
    {
      id: "qkc-m4-2",
      moduleId: "modul-4",
      question: "Berdasarkan kriteria Sistem Jaminan Produk Halal (SJPH), ketentuan manakah yang WAJIB dipatuhi terkait penamaan produk kuliner?",
      options: [
        "Bebas menggunakan nama apa saja asalkan cita rasanya pedas gurih",
        "Nama menu tidak boleh mengarah pada keharaman, kemaksiatan, atau terminologi setan/iblis (misal dilarang: 'Mie Pocong' / 'Rawon Neraka')",
        "Nama menu wajib menggunakan ejaan bahasa Belanda kuno",
        "Nama menu wajib memuat minimal 5 kata panjang"
      ],
      correctAnswer: 1,
      explanation: "Standar SJPH MUI dan BPJPH melarang penamaan produk yang mengarah pada keharaman, kekufuran, kemaksiatan, atau nama setan/hantu demi menjaga adab dan kemuliaan produk halal.",
      citation: "Modul 4: Kriteria Sistem Jaminan Produk Halal (SJPH) untuk UMKM"
    },
    {
      id: "qkc-m4-3",
      moduleId: "modul-4",
      question: "Portal sistem informasi resmi Kementerian Agama RI yang dikelola oleh BPJPH untuk pendaftaran sertifikasi halal UMKM (jalur Self-Declare) adalah...",
      options: [
        "Portal OSS-RBA (oss.go.id)",
        "Portal SIHALAL (ptsp.halal.go.id)",
        "Portal SIMBA Baznas (baznas.go.id)",
        "Portal Satu Data Kemenkeu"
      ],
      correctAnswer: 1,
      explanation: "SIHALAL (ptsp.halal.go.id) adalah sistem layanan daring resmi BPJPH Kementerian Agama Republik Indonesia untuk pendaftaran, verifikasi bahan, dan penerbitan sertifikat halal.",
      citation: "Modul 4: Tahapan Pendaftaran di Portal SIHALAL BPJPH"
    }
  ]
};
