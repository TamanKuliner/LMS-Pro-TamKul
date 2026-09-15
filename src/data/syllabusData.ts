import { SyllabusModule, QuizQuestion, ParticipantRequirement } from "../types";

export const participantRequirements: ParticipantRequirement[] = [
  {
    id: "req-1",
    title: "Warga Negara Indonesia (WNI)",
    description: "Dibuktikan dengan kepemilikan KTP / Kartu Keluarga (KK) yang masih berlaku.",
    mandatory: true,
  },
  {
    id: "req-2",
    title: "Usia Produktif 17 — 50 Tahun",
    description: "Diutamakan berusia 17 hingga 50 tahun untuk memastikan adopsi kecakapan digital optimal.",
    mandatory: true,
  },
  {
    id: "req-3",
    title: "Memiliki Usaha Kuliner (Makanan & Minuman)",
    description: "Usaha masih aktif berjalan di sektor F&B, food court, warung kuliner, katering, atau makanan kemasan.",
    mandatory: true,
  },
  {
    id: "req-4",
    title: "Memiliki Email Pribadi / Usaha Aktif",
    description: "Digunakan untuk akses modul LMS, akun SIHALAL, dan laporan fintech perbankan syariah.",
    mandatory: true,
  },
  {
    id: "req-5",
    title: "Memiliki Akun Media Sosial Usaha",
    description: "Diutamakan memiliki akun Instagram, TikTok, Facebook Page, atau WhatsApp Business untuk praktik pemasaran syariah.",
    mandatory: false,
  },
  {
    id: "req-6",
    title: "Memiliki Toko Daring / Saluran Online",
    description: "Sudah memiliki toko di e-commerce (Shopee/Tokopedia), GoFood/GrabFood/ShopeeFood, atau website profil.",
    mandatory: false,
  },
  {
    id: "req-7",
    title: "Komitmen Prinsip Syariah",
    description: "Tertarik dan bersungguh-sungguh menjalankan usaha terdigitalisasi sesuai prinsip dan etika Islam.",
    mandatory: true,
  },
];

export const syllabusModules: SyllabusModule[] = [
  {
    id: "modul-1",
    moduleNumber: 1,
    title: "Prinsip dan Etika Bisnis Islam pada Usaha Terdigitalisasi",
    jp: 1,
    level: "Pelatihan Level Menengah",
    description: "Membangun mindset kewirausahaan syariah di era digital, memahami akad muamalah, serta menguasai kriteria 5C agar UMKM kuliner menjadi bankable dan layak pembiayaan.",
    skillsGained: [
      "Mindset Bisnis Syariah Digital",
      "Kriteria 5C Kelayakan Bankable",
      "Pemilihan Akad (Bai', Wakalah, Mudharabah, Musyarakah)",
      "Pencegahan Riba, Gharar, Maysir, dan Tadlis"
    ],
    sections: [
      {
        id: "m1-s1",
        title: "Pengantar Transformasi Digital & Nilai Islam",
        duration: "15 Menit",
        content: [
          "Perkembangan teknologi digital telah mengubah lanskap bisnis secara signifikan, termasuk dalam sektor kuliner UMKM.",
          "Di era digitalisasi, kecepatan transaksi harus diimbangi dengan kepatuhan syariat agar terhindar dari transaksi manipulatif dan spekulatif.",
          "Nilai-nilai Islam bukan penghambat inovasi, melainkan kompas integritas yang membedakan UMKM berdaya saing tinggi dan berkeberkahan."
        ],
        keyPoints: [
          "Teknologi sebagai wasilah (alat), syariat sebagai maqashid (tujuan mulia perlindungan harta dan jiwa).",
          "Digitalisasi membuka akses pasar tanpa batas, menuntut transparansi informasi produk makanan/minuman."
        ],
        practicalTips: [
          "Selalu pastikan deskripsi menu kuliner mencantumkan berat bersih, komposisi utama, dan status sertifikasi secara jelas di etalase daring."
        ],
        qna: [
          {
            q: "Apakah menggunakan platform marketplace konvensional diperbolehkan dalam muamalah syariah?",
            a: "Boleh, selama akad transaksi jual beli yang terjadi memenuhi rukun jual beli (ada penjual, pembeli, barang halal yang jelas, dan ijab kabul digital) serta terhindar dari skema bunga/riba dan penipuan."
          }
        ]
      },
      {
        id: "m1-s2",
        title: "Kriteria UMKM Bankable (Konsep 5C Berbasis Syariah)",
        duration: "25 Menit",
        content: [
          "Konsep 5C merupakan evaluasi umum yang digunakan perbankan dan fintech syariah untuk menilai kelayakan pendanaan usaha UMKM:",
          "1. Character (Karakter & Kejujuran): Integritas moral, ketaatan pada janji akad, rekam jejak amanah, dan komitmen bisnis halal.",
          "2. Capacity (Kapasitas & Manajemen): Kemampuan mengelola operasional harian, omzet yang stabil, dan adaptasi teknologi pemesanan.",
          "3. Capital (Permodalan Usaha): Struktur modal sendiri, kontribusi ekuitas, dan rasio permodalan yang sehat tanpa jeratan utang rentenir.",
          "4. Collateral (Agunan/Jaminan): Aset bernilai ekonomis yang sah menurut syariat untuk mitigasi risiko pembiayaan.",
          "5. Condition (Kondisi Pasar & Tren): Analisis tren kuliner di lokasi usaha, ketahanan pangan, dan prospek keberlanjutan bisnis."
        ],
        keyPoints: [
          "Bank syariah memandang pelaku usaha bukan sebagai debitur yang diperas bunga, melainkan mitra (*sharik*) yang didorong bertumbuh.",
          "Pemisahan rekening pribadi dan rekening warung makan adalah syarat mutlak pembuktian Capacity & Character."
        ],
        practicalTips: [
          "Buka rekening khusus perbankan syariah atas nama usaha Anda dan setorkan seluruh omzet harian QRIS langsung ke sana."
        ],
        qna: [
          {
            q: "Bagaimana jika UMKM kuliner saya belum memiliki agunan fisik (collateral)?",
            a: "Lembaga keuangan syariah kini memiliki skema pembiayaan mikro syariah berbasis reputasi transaksi digital (transaction-based lending) atau agunan fidusia mesin dapur produktif."
          }
        ]
      },
      {
        id: "m1-s3",
        title: "Akad-Akad Muamalah Digital & Studi Kasus Kuliner",
        duration: "20 Menit",
        content: [
          "Akad adalah perjanjian perikatan yang sah dalam hukum Islam. Ragam akad digital kuliner:",
          "• Jual Beli (Bai'): Akad pertukaran barang dengan uang. Syarat: spesifikasi menu jelas, harga transparan, tanpa gharar (ketidakjelasan gramasi).",
          "• Wakalah: Pelaku usaha memberikan kuasa kepada platform kurir atau aggregator pengantaran untuk mewakili pengantaran makanan.",
          "• Mudharabah: Pemilik modal (Shahibul Maal) menyediakan dana 100%, pengelola (Mudharib) mengoperasikan resto kuliner dengan nisbah bagi hasil yang disepakati.",
          "• Musyarakah: Patungan modal antara dua pihak atau lebih untuk membuka cabang baru outlet Taman Kuliner, laba dan risiko dibagi proporsional."
        ],
        keyPoints: [
          "Akad harus jelas di awal, terutama porsi nisbah persentase bagi hasil (bukan nominal rupiah tetap yang menyerupai bunga).",
          "Hindari penalti keterlambatan yang dijadikan keuntungan oleh kreditur (denda keterlambatan dalam syariah hanya untuk dana sosial qardhul hasan/sedekah)."
        ],
        practicalTips: [
          "Dokumentasikan setiap perjanjian kemitraan dalam surat akad digital yang bertanda tangan dan memuat hak serta kewajiban yang berimbang."
        ],
        qna: [
          {
            q: "Apa perbedaan mendasar Mudharabah dan Musyarakah dalam usaha makanan?",
            a: "Pada Mudharabah, pemilik modal menyetor 100% uang dan pelaku usaha menyumbang keahlian; sedangkan pada Musyarakah, semua pihak sama-sama menyetorkan modal dana ke dalam usaha kuliner tersebut."
          }
        ]
      }
    ]
  },
  {
    id: "modul-2",
    moduleNumber: 2,
    title: "Akuntansi Digital dan Fintech Syariah",
    jp: 2,
    level: "Pelatihan Level Menengah",
    description: "Menguasai pembukuan syariah terstandar, pengakuan pendapatan yang sah, kalkulasi zakat perniagaan, serta simulasi pembiayaan syariah tanpa bunga (Murabahah, Mudharabah, Ijarah).",
    skillsGained: [
      "Pembukuan Arus Kas Syariah",
      "Pengakuan Pendapatan Bebas Gharar",
      "Kalkulasi Zakat Usaha Kuliner (2.5%)",
      "Simulasi Angsuran & Margin Murabahah",
      "Integrasi Fintech Syariah OJK"
    ],
    sections: [
      {
        id: "m2-s1",
        title: "Karakteristik Pembukuan & Laporan Keuangan Syariah",
        duration: "30 Menit",
        content: [
          "Laporan keuangan syariah memiliki pilar transparansi akuntabilitas ilahiah:",
          "1. Pengakuan Pendapatan: Pendapatan hanya diakui setelah makanan/minuman benar-benar diserahkan kepada konsumen. Tidak mengakui laba spekulatif di muka.",
          "2. Pencadangan Kerugian: Hanya dilakukan berdasar bukti objektif, bukan manipulasi pajak atau rekayasa buku.",
          "3. Pengungkapan Transparan: Wajib memisahkan dana titipan (wadiah), modal kerja, bagian bagi hasil mitra, dan kewajiban zakat perniagaan.",
          "4. Kepatuhan Audit Syariah: Memastikan tidak ada percampuran dana haram (seperti cashback perjudian, bunga bank konvensional) ke dalam neraca usaha kuliner."
        ],
        keyPoints: [
          "Pemisahan dana non-halal wajib disalurkan ke pos kebajikan sosial (dana kebajikan), tidak boleh diakui sebagai laba kotor.",
          "Perhitungan zakat mal perniagaan dihitung apabila saldo modal kerja + laba mencapai nisab (setara 85 gram emas) selama satu haul (1 tahun hijriyah)."
        ],
        practicalTips: [
          "Gunakan pencatatan kas harian digital: Catat Penjualan Tunai, QRIS, Biaya Bahan Baku Segar, Gaji Karyawan, dan Pajak PB1."
        ],
        qna: [
          {
            q: "Bagaimana cara memperlakukan bunga bank yang terlanjur masuk ke rekening giro usaha?",
            a: "Bunga bank tersebut harus dikeluarkan dari pembukuan laba usaha dan dialokasikan ke dana sosial kebajikan umum (seperti perbaikan fasilitas umum/MCK), tidak boleh dipakai operasional dapur."
          }
        ]
      },
      {
        id: "m2-s2",
        title: "Skema Pembiayaan Syariah untuk UMKM Kuliner",
        duration: "45 Menit",
        content: [
          "Berbagai alternatif pembiayaan syariah yang menggantikan pinjaman berbasis bunga:",
          "• Murabahah: Akad jual beli aset (misal: mesin espresso, oven roti, showcase display). Bank membeli mesin seharga Rp 15.000.000, lalu menjual ke pelaku usaha seharga Rp 16.500.000 dengan angsuran tetap 12 bulan. Margin keuntungan telah diketahui dan disepakati di awal tanpa lonjakan bunga floating.",
          "• Mudarabah: Pembiayaan modal kerja bahan baku. Laba bulanan dibagi sesuai nisbah (misal 70% pengelola, 30% bank/investor).",
          "• Musyarakah Mutanaqisah: Pembiayaan kepemilikan ruko/tempat usaha di mana porsi modal bank berkurang bertahap seiring angsuran UMKM.",
          "• Ijarah Muntahiyah Bittamlik (IMBT): Sewa menyewa peralatan dapur dengan opsi pengalihan hak milik di akhir masa sewa.",
          "• Bai' al-Istishna: Pembiayaan pesanan manufaktur khusus gerobak kuliner/kitchen set berbahan stainless steel sesuai desain spesifik."
        ],
        keyPoints: [
          "Murabahah memberikan kepastian angsuran tetap dari awal hingga lunas.",
          "Mudarabah dan Musyarakah mengedepankan prinsip 'al-ghunmu bil ghurmi' (keuntungan sebanding dengan kesiapan menanggung risiko)."
        ],
        practicalTips: [
          "Untuk kebutuhan beli alat dapur baru, pilihlah skema Murabahah. Untuk kebutuhan stok bahan baku menjelang Ramadhan, pilihlah skema Mudharabah modal kerja."
        ],
        qna: [
          {
            q: "Apakah jika usaha saya merugi pada akad Mudharabah, saya harus mengganti modal investor?",
            a: "Jika kerugian terjadi murni karena fluktuasi pasar dan bukan karena kelalaian pengelola (bukan karena penggelapan atau kecerobohan), maka kerugian finansial ditanggung pemilik modal."
          }
        ]
      },
      {
        id: "m2-s3",
        title: "Aplikasi Fintech Syariah & Simulasi Digital",
        duration: "45 Menit",
        content: [
          "Kehadiran platform fintech syariah berizin OJK mempermudah akses modal tanpa harus datang antre di kantor cabang:",
          "• Fitur Pengajuan Online: Verifikasi KTP, NIB, foto tempat usaha, dan mutasi rekening via aplikasi ponsel.",
          "• Simulasi Angsuran Instan: Calon nasabah dapat melihat simulasi margin, jangka waktu (tenor), dan angsuran per bulan secara transparan.",
          "• Pelacakan Real-Time: Notifikasi proses verifikasi dokumen hingga pencairan langsung ke rekening bank syariah UMKM.",
          "• Keamanan Data: Enkripsi end-to-end data nasabah dan kepatuhan perlindungan data pribadi (UU PDP)."
        ],
        keyPoints: [
          "Pastikan platform fintech syariah memiliki sertifikat tanda berizin dari OJK dan pengawasan dari Dewan Pengawas Syariah (DPS) MUI.",
          "Waspada terhadap pinjol ilegal berkedok syariah yang memungut biaya admin tersembunyi hingga 30% di muka."
        ],
        practicalTips: [
          "Selalu simpan bukti akad digital PDF dan pastikan nomor akad tercantum jelas dalam setiap transfer angsuran bulanan."
        ],
        qna: [
          {
            q: "Bagaimana cara mengecek fintech syariah yang terdaftar resmi?",
            a: "Kunjungi situs resmi OJK (ojk.go.id) atau AFSI (Asosiasi Fintech Syariah Indonesia) untuk melihat daftar penyelenggara fintech P2P syariah berizin."
          }
        ]
      }
    ]
  },
  {
    id: "modul-3",
    moduleNumber: 3,
    title: "Memaksimalkan Pemasaran Digital Berbasis Syariah",
    jp: 2,
    level: "Pelatihan Level Menengah",
    description: "Strategi pemasaran modern di media sosial dan marketplace yang menjunjung tinggi etika kejujuran, anti-overclaim, testimoni autentik, serta membangun brand halal dan thayyib.",
    skillsGained: [
      "Prinsip Kejujuran (As-Sidq) Pemasaran",
      "Pencegahan Overclaim Produk Kuliner",
      "Verifikasi Testimoni Asli Konsumen",
      "Storytelling Dapur Bersih & Halal",
      "Optimalisasi Saluran Media Sosial & Foto Menu"
    ],
    sections: [
      {
        id: "m3-s1",
        title: "Etika & Prinsip Dasar Pemasaran Syariah",
        duration: "40 Menit",
        content: [
          "Pemasaran syariah bukan sekadar menempelkan label arab, melainkan integritas total dalam memasarkan produk:",
          "1. Jujur & Amanah (As-Sidq wal Amanah): Informasi menu, berat, dan rasa harus sesuai realitas saat hidangan disajikan.",
          "2. Tidak Overclaim: Menolak penggunaan klaim bombastis seperti 'Obat Mujarab Semua Kanker' untuk minuman herbal atau 'Rasa Terenak di Seluruh Dunia' tanpa verifikasi.",
          "3. Testimoni Jujur: Dilarang keras merekrut buzzer untuk review palsu bintang 5 atau membuat rekayasa tangkapan layar chat WhatsApp fiktif.",
          "4. Halal & Thayyib: Menekankan nilai kebaikan, higienitas, kesegaran nutrisi, dan kehalalan bahan bumbu masakan.",
          "5. Keadilan & Anti-Najasy: Tidak menaikkan harga secara artifisial menjelang diskon ('diskon tipuan') atau berpura-pura menawar barang sendiri di siaran live shopping."
        ],
        keyPoints: [
          "Kepercayaan pelanggan (*amanah*) adalah aset termahal yang menghasilkan *repeat order* jangka panjang.",
          "Praktek *najasy* (menawar palsu untuk menaikkan harga) diharamkan secara tegas oleh Rasulullah SAW."
        ],
        practicalTips: [
          "Tampilkan foto asli hidangan kuliner tanpa filter berlebihan yang mengubah porsi atau warna produk secara menipu."
        ],
        qna: [
          {
            q: "Apakah diskon kilat (flash sale) diperbolehkan dalam syariah?",
            a: "Diperbolehkan, asalkan harga sebelum diskon adalah harga riil yang berlaku sebelumnya dan stok barang yang disediakan benar-benar ada."
          }
        ]
      },
      {
        id: "m3-s2",
        title: "Strategi Konten Kuliner Halal & Saluran Digital",
        duration: "40 Menit",
        content: [
          "Membangun konten digital yang edukatif dan menumbuhkan daya tarik konsumen:",
          "• Konten 'Behind The Kitchen': Dokumentasikan kebersihan proses pencucian sayur, pemotongan ayam bersertifikat halal, dan penggunaan minyak goreng jernih.",
          "• Segmentasi Pasar: Kenali target pelanggan keluarga muslim, pekerja kantoran makan siang cepat, atau penikmat kopi kekinian.",
          "• Interaksi Hangat & Santun: Membalas ulasan negatif dengan istighfar, permohonan maaf terbuka, dan tawaran penggantian hidangan secara ikhlas.",
          "• Kolaborasi Influencer Berakhlak: Memilih mitra food vlogger yang objektif dan tidak memeras pengusaha kuliner kecil."
        ],
        keyPoints: [
          "Transparansi dapur modern (open kitchen vibe) di video TikTok/Reels sangat efektif melipatgandakan kepercayaan konsumen.",
          "Ulasan jujur pelanggan adalah dakwah kebaikan yang mengangkat citra kuliner nusantara."
        ],
        practicalTips: [
          "Buat seri video mingguan 30 detik: 'Dari Mana Asal Daging Sapi Kami?' untuk menunjukkan sertifikat halal Rumah Potong Hewan (RPH)."
        ],
        qna: [
          {
            q: "Bagaimana cara menyikapi pelanggan yang komplain di media sosial?",
            a: "Jawab dengan adab santun, jangan berdebat, akui jika ada kekurangan, tawarkan kompensasi yang adil, dan perbaiki SOP dapur sesegera mungkin."
          }
        ]
      },
      {
        id: "m3-s3",
        title: "Audit Mandiri Konten Pemasaran Syariah",
        duration: "40 Menit",
        content: [
          "Lakukan checklist sebelum mengunggah materi promosi kuliner Anda:",
          "[✓] Apakah ada klaim khasiat berlebihan yang belum diuji lab BPOM?",
          "[✓] Apakah ada unsur mengejek atau menjatuhkan merek kuliner kompetitor?",
          "[✓] Apakah audio/musik latar yang digunakan memiliki lisensi hak cipta yang sah dan tidak melanggar adab?",
          "[✓] Apakah informasi harga sudah mencakup pajak dan biaya kemasan dengan gamblang tanpa jebakan *hidden cost*?"
        ],
        keyPoints: [
          "Hak cipta dalam Islam diakui sebagai *haqqul ibtida* (hak kepemilikan intelektual), dilarang membajak konten kreator lain.",
          "Transparansi total harga di awal transaksi menghindarkan akad dari cacat gharar."
        ],
        practicalTips: [
          "Tuliskan di struk dan menu online: 'Harga sudah termasuk PPN 10% dan kemasan ramah lingkungan'."
        ],
        qna: [
          {
            q: "Bolehkah membandingkan produk kuliner saya dengan kompetitor dalam iklan?",
            a: "Boleh memaparkan keunggulan objektif produk sendiri (misal: 'menggunakan gula tebu asli tanpa pemanis buatan'), namun dilarang menyebut atau mencemarkan nama pesaing."
          }
        ]
      }
    ]
  },
  {
    id: "modul-4",
    moduleNumber: 4,
    title: "Proses Pengajuan Sertifikasi Halal untuk UMKM Makanan dan Minuman",
    jp: 2,
    level: "Pelatihan Level Menengah",
    description: "Panduan tuntas Sistem Jaminan Produk Halal (SJPH) sesuai UU No. 33/2014, penunjukan Penyelia Halal, persiapan bahan baku, dan navigasi portal SIHALAL BPJPH (halal.go.id).",
    skillsGained: [
      "Pemahaman UU Jaminan Produk Halal No. 33/2014",
      "Penyusunan Dokumen Manual SJPH / SJH",
      "Tugas & Wewenang Penyelia Halal",
      "Pemisahan Bahan Kritis vs Bahan Bebas",
      "Pendaftaran Portal SIHALAL (ptsp.halal.go.id)"
    ],
    sections: [
      {
        id: "m4-s1",
        title: "Dasar Hukum UU No. 33/2014 & Kriteria Halal",
        duration: "30 Menit",
        content: [
          "Sertifikasi halal kini bersifat mandatori (wajib) di Indonesia untuk produk makanan dan minuman.",
          "Undang-Undang Nomor 33 Tahun 2014 tentang Jaminan Produk Halal (JPH) menetapkan:",
          "• BPJPH (Badan Penyelenggara Jaminan Produk Halal): Regulator penerbit sertifikat halal di bawah Kementerian Agama.",
          "• LPH (Lembaga Pemeriksa Halal): Lembaga independen (seperti LPPOM MUI, Sucofindo, Surveyor Indonesia) yang mengaudit bahan dan pabrik/dapur.",
          "• Komisi Fatwa MUI: Lembaga yang menetapkan fatwa kehalalan produk setelah sidang ilmiah auditor LPH."
        ],
        keyPoints: [
          "Kriteria mencakup: Bahan baku halal, Fasilitas produksi bebas kontaminasi najis, Prosedur penanganan tertulis, dan Sumber daya manusia yang terlatih.",
          "Kewajiban sertifikasi halal memberikan perlindungan konsumen dan jaminan kepastian hukum."
        ],
        practicalTips: [
          "Simpan seluruh kemasan bumbu pabrikan berlogo Halal Indonesia (gunungan ungu) yang dibeli di pasar sebagai bukti fisik saat auditor LPH berkunjung."
        ],
        qna: [
          {
            q: "Apa sanksi bagi UMKM kuliner yang belum bersertifikat halal setelah masa tenggang mandatori?",
            a: "Berdasarkan regulasi, sanksi administratif berupa teguran tertulis, denda, hingga penarikan produk dari peredaran pasar."
          }
        ]
      },
      {
        id: "m4-s2",
        title: "Persyaratan & Dokumen Manual SJPH (Sistem Jaminan Produk Halal)",
        duration: "45 Menit",
        content: [
          "Dokumen penting yang harus disiapkan oleh pelaku usaha kuliner:",
          "1. Nomor Induk Berusaha (NIB): Berbasis risiko via OSS RBA dengan KBLI makanan/minuman yang sesuai.",
          "2. Data Pelaku Usaha & Profil Dapur: Alamat dapur produksi, denah alur kerja dari bahan mentah hingga matang.",
          "3. Daftar Nama Produk & Bahan Baku: Matriks bahan mencakup nama bumbu, produsen, nomor sertifikat halal bahan, dan masa berlakunya.",
          "4. Surat Penetapan Penyelia Halal: Ditandatangani pemilik usaha, menunjuk staf muslim internal yang bertanggung jawab atas proses halal.",
          "5. Manual SJPH Sederhana: Berisi SOP penerimaan bahan, SOP pencucian peralatan, SOP penyimpanan di chiller, dan SOP penanganan produk yang tidak memenuhi kriteria."
        ],
        keyPoints: [
          "Penyelia halal tidak boleh merangkap auditor eksternal; ia adalah penjaga gawang integritas halal di dapur internal UMKM.",
          "Jika ada bahan baru yang akan dipakai, wajib diperiksa status kehalalannya terlebih dahulu sebelum dimasukkan ke dalam resep masakan."
        ],
        practicalTips: [
          "Buat folder khusus bertanda 'DOKUMEN SJPH TAMAN KULINER' yang berisi daftar pemasok daging ayam potong dan bumbu halal."
        ],
        qna: [
          {
            q: "Apakah warung makan kecil (self-declare) bisa mengajukan sertifikasi halal gratis (SEHATI)?",
            a: "Bisa, program SEHATI (Sertifikasi Halal Gratis) diperuntukkan bagi UMK dengan proses sederhana yang tidak menggunakan bahan berbahaya dan diverifikasi oleh Pendamping PPH."
          }
        ]
      },
      {
        id: "m4-s3",
        title: "Tahapan Pengajuan Portal SIHALAL & Audit Lapangan",
        duration: "45 Menit",
        content: [
          "Langkah demi langkah mendaftar di ptsp.halal.go.id:",
          "1. Registrasi Akun: Masukkan NIB, email aktif, dan nomor telepon penanggung jawab usaha.",
          "2. Input Data Produk & Resep: Ketik nama hidangan kuliner (contoh: Nasi Bakar Ayam Suwir, Es Cendol Nangka) beserta seluruh komposisinya.",
          "3. Pilih Lembaga Pemeriksa Halal (LPH) / Pendamping PPH: Sesuai wilayah domisili gerai Taman Kuliner Anda.",
          "4. Verifikasi & Audit Lapangan: Tim auditor memeriksa kebersihan dapur, freezer penyimpanan daging, dan wawancara dengan Penyelia Halal.",
          "5. Sidang Fatwa & Unduh Sertifikat: Setelah dinyatakan lolos fatwa halal, sertifikat ber-barcode resmi BPJPH dapat diunduh langsung dan dicetak untuk dipajang di gerai."
        ],
        keyPoints: [
          "Gunakan nama menu yang santun dan tidak menggunakan nama yang mengarah pada keharaman (misal dilarang: 'Rawon Setan', 'Mie Iblis').",
          "Sertifikat Halal BPJPH kini berlaku seumur hidup selama tidak ada perubahan komposisi bahan dan proses produksi."
        ],
        practicalTips: [
          "Bila nama menu kuliner Anda saat ini berkonotasi negatif atau menyeramkan, segera lakukan *rebranding* sebelum mendaftar di portal SIHALAL."
        ],
        qna: [
          {
            q: "Berapa lama rata-rata proses pengajuan hingga sertifikat halal terbit?",
            a: "Untuk skema self-declare jalur UMK umumnya berkisar 12 hingga 21 hari kerja sejak verifikasi berkas oleh pendamping PPH selesai."
          }
        ]
      }
    ]
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    moduleId: "modul-1",
    question: "Dalam prinsip evaluasi kelayakan pembiayaan syariah 5C untuk UMKM, pilar 'Capacity' mengukur aspek apa?",
    options: [
      "Integritas pribadi dan komitmen moral pengusaha",
      "Kemampuan manajemen dan kestabilan arus kas operasional usaha",
      "Aset fisik tanah dan bangunan yang dijaminkan",
      "Kondisi politik dan makroekonomi nasional"
    ],
    correctAnswer: 1,
    explanation: "Capacity mengukur kapasitas manajemen pelaku usaha dalam mengelola bisnis, kestabilan omzet, dan kemampuan menghasilkan arus kas untuk melunasi kewajiban.",
    citation: "Modul 1: Prinsip dan Etika Bisnis Islam - Kriteria UMKM Bankable (5C)"
  },
  {
    id: 2,
    moduleId: "modul-1",
    question: "Manakah akad yang paling tepat jika pemilik modal menyetorkan dana 100% dan pengusaha kuliner mengelola usaha dengan bagi hasil yang disepakati bersama?",
    options: [
      "Akad Wakalah",
      "Akad Mudharabah",
      "Akad Murabahah",
      "Akad Rahn"
    ],
    correctAnswer: 1,
    explanation: "Akad Mudharabah adalah kerjasama antara pemilik modal (shahibul maal) yang menyediakan 100% dana dengan pengelola usaha (mudharib) berdasarkan nisbah bagi hasil yang disepakati.",
    citation: "Modul 1: Akad-Akad dan Prinsip Syariah dalam Bisnis Digital"
  },
  {
    id: 3,
    moduleId: "modul-1",
    question: "Unsur transaksi yang mengandung ketidakpastian, spekulasi berlebihan, atau penipuan dalam fiqih muamalah disebut...",
    options: [
      "Maysir dan Riba",
      "Gharar dan Tadlis",
      "Wadiah dan Amanah",
      "Qardhul Hasan"
    ],
    correctAnswer: 1,
    explanation: "Gharar adalah ketidakjelasan/ketidakpastian objek transaksi, sedangkan Tadlis adalah penipuan/penyembunyian cacat barang dari pembeli.",
    citation: "Modul 1: Prinsip Keadilan & Kejujuran Transaksi Bisnis Digital"
  },
  {
    id: 4,
    moduleId: "modul-2",
    question: "Kapan pendapatan boleh diakui secara sah dalam pembukuan dan akuntansi berbasis syariah?",
    options: [
      "Saat calon pembeli baru memasukkan makanan ke dalam keranjang belanja",
      "Setelah barang atau jasa benar-benar diserahkan dan diterima pembayarannya",
      "Saat pelaku usaha memprediksi omzet bulan depan",
      "Saat mengajukan proposal pembiayaan ke bank"
    ],
    correctAnswer: 1,
    explanation: "Dalam akuntansi syariah, pendapatan hanya diakui setelah barang/jasa benar-benar telah diserahkan dan hak kepemilikannya beralih secara nyata.",
    citation: "Modul 2: Karakteristik Pembukuan dan Laporan Keuangan Syariah"
  },
  {
    id: 5,
    moduleId: "modul-2",
    question: "Pelaku UMKM kuliner ingin membeli oven roti seharga Rp 20 juta melalui bank syariah. Bank membeli oven tersebut lalu menjualnya ke UMKM dengan cicilan tetap dan margin keuntungan yang disepakati. Akad ini disebut...",
    options: [
      "Akad Murabahah",
      "Akad Musyarakah",
      "Akad Ijarah",
      "Akad Mudharabah"
    ],
    correctAnswer: 0,
    explanation: "Akad Murabahah adalah akad jual beli barang dengan menyatakan harga perolehan dan penambahan margin keuntungan yang disepakati kedua pihak dengan skema pembayaran tunai atau cicil.",
    citation: "Modul 2: Pembiayaan Berbasis Syariah untuk UMKM Kuliner"
  },
  {
    id: 6,
    moduleId: "modul-2",
    question: "Berapakah kadar persentase zakat perniagaan (zakat mal) yang wajib dikeluarkan pelaku usaha muslim apabila kekayaan usaha telah mencapai nisab setara 85 gram emas selama 1 tahun?",
    options: [
      "1.5%",
      "2.5%",
      "5.0%",
      "10.0%"
    ],
    correctAnswer: 1,
    explanation: "Kadar zakat perniagaan adalah 2,5% dari aktiva lancar dikurangi kewajiban jangka pendek jika telah mencapai nisab dan haul.",
    citation: "Modul 2: Modul Zakat Perniagaan dan Akuntansi Syariah"
  },
  {
    id: 7,
    moduleId: "modul-3",
    question: "Dalam etika pemasaran digital syariah, praktek merekayasa tangkapan layar review chat fiktif atau menyewa buzzer untuk pura-pura memuji hidangan disebut pelanggaran terhadap prinsip...",
    options: [
      "Istishna dan Ijarah",
      "Jujur, Amanah (As-Sidq), dan Anti-Tadlis",
      "Mudharabah Muqayyadah",
      "Wakalah bil Ujrah"
    ],
    correctAnswer: 1,
    explanation: "Testimoni palsu melanggar prinsip kejujuran (as-sidq) dan amanah, serta masuk dalam kategori penipuan (tadlis) yang merugikan hak konsumen.",
    citation: "Modul 3: Memaksimalkan Pemasaran Digital Berbasis Syariah"
  },
  {
    id: 8,
    moduleId: "modul-3",
    question: "Praktek menaikkan harga kuliner secara pura-pura dalam siaran belanja live atau persekongkolan menawar barang agar konsumen lain terpancing membeli mahal disebut praktek terlarang...",
    options: [
      "Najasy",
      "Riba Fadhl",
      "Tawarruq",
      "Kafalah"
    ],
    correctAnswer: 0,
    explanation: "Najasy adalah rekayasa penawaran palsu untuk menaikkan harga komoditas dan memanipulasi pasar, yang secara tegas dilarang oleh Rasulullah SAW.",
    citation: "Modul 3: Etika Pemasaran Syariah & Anti-Overclaim"
  },
  {
    id: 9,
    moduleId: "modul-4",
    question: "Undang-Undang di Indonesia yang menjadi landasan hukum utama kewajiban Sertifikasi Halal dan Sistem Jaminan Produk Halal (SJPH) adalah...",
    options: [
      "Undang-Undang Nomor 33 Tahun 2014",
      "Undang-Undang Nomor 11 Tahun 2008",
      "Undang-Undang Nomor 20 Tahun 2008",
      "Undang-Undang Nomor 7 Tahun 2014"
    ],
    correctAnswer: 0,
    explanation: "UU No. 33 Tahun 2014 tentang Jaminan Produk Halal (JPH) adalah landasan regulasi resmi penyelenggaraan jaminan produk halal di Indonesia.",
    citation: "Modul 4: UU No. 33 Th 2014 mengenai Sistem Jaminan Produk Halal (SJPH)"
  },
  {
    id: 10,
    moduleId: "modul-4",
    question: "Portal sistem informasi resmi pemerintah Indonesia yang digunakan pelaku usaha untuk mendaftarkan permohonan sertifikasi halal adalah...",
    options: [
      "SIHALAL (ptsp.halal.go.id)",
      "OSS RBA (oss.go.id)",
      "DJKI Kemenkumham (dgip.go.id)",
      "SIMBA Baznas (baznas.go.id)"
    ],
    correctAnswer: 0,
    explanation: "SIHALAL (Sistem Informasi Halal) yang dapat diakses di ptsp.halal.go.id adalah portal resmi yang dikelola oleh BPJPH Kementerian Agama Republik Indonesia.",
    citation: "Modul 4: Tahapan Pengajuan Sertifikasi Halal untuk UMKM Makanan dan Minuman"
  }
];
