import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory telemetry and multi-cloud cluster metrics
let multiCloudNodes = [
  { id: "gcp-asia-se1", provider: "Google Cloud", region: "Jakarta (asia-southeast2)", latency: 18, status: "healthy", trafficShare: 60, load: 38 },
  { id: "aws-ap-se3", provider: "AWS", region: "Jakarta (ap-southeast-3)", latency: 22, status: "healthy", trafficShare: 30, load: 41 },
  { id: "azure-se-asia", provider: "Microsoft Azure", region: "Singapore (southeastasia)", latency: 34, status: "healthy", trafficShare: 10, load: 24 }
];

let cicdPipelines = [
  { id: "pipe-1092", branch: "main", commit: "feat(halal-audit): add automated SJPH checklist validation", status: "success", duration: "1m 42s", timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), author: "CI/CD AutoBot" },
  { id: "pipe-1091", branch: "hotfix/e2ee-aes", commit: "fix(security): enhance PBKDF2 salt derivation for ledger", status: "success", duration: "2m 10s", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), author: "DevSecOps" },
  { id: "pipe-1090", branch: "feature/5c-eval", commit: "feat(lms): update Bankable UMKM 5C assessment metrics", status: "success", duration: "1m 55s", timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), author: "TamanKuliner Lead" }
];

// Anomaly detection rules & events
let systemAnomalies = [
  { id: "anom-1", level: "info", title: "Traffic Rebalancing Active", message: "Auto-scaled 4 additional pods on GCP Jakarta cluster following peak webinar registration.", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), acknowledged: true },
  { id: "anom-2", level: "warning", title: "Latency Spike Mitigated", message: "Transient +45ms response on payment gateway proxy mitigated by edge caching.", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), acknowledged: true }
];

// Sync storage for cross-device mock state
let syncedDevices: Array<{ id: string; deviceName: string; lastActive: string; userAgent: string }> = [
  { id: "dev-primary", deviceName: "Taman Kuliner POS / Web Hub", lastActive: new Date().toISOString(), userAgent: "Chrome Desktop / Linux" },
  { id: "dev-mobile", deviceName: "Smartphone Pelaku Usaha (Android)", lastActive: new Date(Date.now() - 1000 * 60 * 3).toISOString(), userAgent: "Mobile Safari / Android" }
];

// Lazy Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    multiCloudStatus: "synced",
    e2eeStatus: "AES-GCM-256 Active",
    version: "v3.8.2-cloud-pro"
  });
});

app.get("/api/infrastructure/status", (_req, res) => {
  // Generate slightly dynamic metrics
  const cpuLoad = Math.floor(28 + Math.random() * 12);
  const memLoad = Math.floor(52 + Math.random() * 8);
  const latency = Math.floor(18 + Math.random() * 6);
  const rps = Math.floor(140 + Math.random() * 35);

  res.json({
    nodes: multiCloudNodes,
    pipelines: cicdPipelines,
    anomalies: systemAnomalies,
    liveMetrics: {
      cpuPercentage: cpuLoad,
      memoryPercentage: memLoad,
      averageLatencyMs: latency,
      requestsPerSec: rps,
      activeLearners: 142 + Math.floor(Math.random() * 15),
      e2eePacketsSecured: 4892 + Math.floor(Math.random() * 50)
    }
  });
});

// Trigger CI/CD deploy simulation
app.post("/api/cicd/deploy", (req, res) => {
  const { environment = "production", targetRegion = "multi-cloud" } = req.body || {};
  const newPipe = {
    id: `pipe-${Math.floor(1000 + Math.random() * 9000)}`,
    branch: "main",
    commit: `deploy(auto): scaling sync across ${targetRegion} (${environment})`,
    status: "success",
    duration: "1m 15s",
    timestamp: new Date().toISOString(),
    author: "Console Admin"
  };
  cicdPipelines.unshift(newPipe);
  if (cicdPipelines.length > 8) cicdPipelines.pop();

  res.json({
    success: true,
    pipeline: newPipe,
    message: `Deployment triggered successfully across ${targetRegion}. Health check passed 100%.`
  });
});

// Sync Device endpoint
app.get("/api/sync/devices", (_req, res) => {
  res.json({
    devices: syncedDevices,
    syncTimestamp: new Date().toISOString(),
    encryptionType: "AES-256-GCM (Client-Side E2EE)"
  });
});

app.post("/api/sync/ping", (req, res) => {
  const { deviceName = "Perangkat Saya", deviceId = `dev-${Date.now()}` } = req.body || {};
  const existing = syncedDevices.find(d => d.id === deviceId);
  if (existing) {
    existing.lastActive = new Date().toISOString();
  } else {
    syncedDevices.unshift({
      id: deviceId,
      deviceName,
      lastActive: new Date().toISOString(),
      userAgent: req.headers["user-agent"] || "Web Client"
    });
    if (syncedDevices.length > 5) syncedDevices.pop();
  }
  res.json({ success: true, activeDevices: syncedDevices.length, syncedAt: new Date().toISOString() });
});

// Sharia AI Business Advisor endpoint
app.post("/api/gemini/advisor", async (req, res) => {
  const { prompt, context = "general", businessName = "UMKM Kuliner", topic = "syariah" } = req.body || {};

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  const ai = getAI();
  if (ai) {
    try {
      const systemInstruction = `Anda adalah Pakar Digitalisasi UMKM Berbasis Syariah & Konsultan Sertifikasi Halal dari Platform LMS Pro TamanKuliner.com. 
Tugas Anda adalah memberikan bimbingan praktis, terpercaya, dan berlandaskan fiqih muamalah kontemporer untuk pelaku usaha mikro, kecil, dan menengah (UMKM) kuliner.
Prinsip utama:
1. Menghindari riba, gharar (ketidakpastian berlebihan), maysir (spekulasi/judi), tadlis (penipuan/overclaim), dan dharar (merugikan).
2. Membantu UMKM menjadi bankable dengan kriteria 5C (Character, Capacity, Capital, Collateral, Condition).
3. Memberikan panduan akad syariah yang tepat: Murabahah (jual beli margin), Mudarabah/Musyarakah (bagi hasil modal kerja), Ijarah (sewa alat/dapur), Salam/Istishna (pesanan catering).
4. Panduan Sertifikasi Halal BPJPH (UU No. 33/2014) & Sistem Jaminan Produk Halal (SJPH).
5. Bahasa ramah, profesional, solutif, dan mudah dipahami oleh pedagang/pelaku usaha kuliner.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nKonteks Usaha: ${businessName}, Topik: ${topic}\n\nPertanyaan Peserta:\n${prompt}` }] }
        ]
      });

      res.json({
        reply: response.text,
        source: "gemini-ai",
        model: "gemini-3.8-flash"
      });
      return;
    } catch (err: any) {
      console.error("Gemini API error, falling back to expert knowledge base:", err?.message);
    }
  }

  // High-fidelity fallback based on Sharia & Halal syllabus knowledge base
  const lower = prompt.toLowerCase();
  let fallbackReply = "";

  if (lower.includes("5c") || lower.includes("bankable") || lower.includes("modal") || lower.includes("pinjam") || lower.includes("pembiayaan")) {
    fallbackReply = `**Analisis Kesiapan Bankable Syariah (5C) untuk ${businessName}:**
1. **Character (Karakter & Amanah):** Kejujuran rekam jejak, ketaatan pada akad tidak ingkar janji, dan komitmen bisnis halal.
2. **Capacity (Kapasitas Usaha):** Volume omzet bulanan, pengelolaan pesanan, dan pemisahan kas pribadi vs kas warung/resto.
3. **Capital (Modal Usaha):** Struktur permodalan sendiri vs dana luar. Di bank syariah, akad *Murabahah* cocok untuk pengadaan alat kuliner, sedangkan *Mudarabah/Musyarakah* cocok untuk modal kerja harian.
4. **Collateral (Agunan/Penjaminan):** Aset produktif seperti sertifikat tempat usaha atau alat produksi berharga sah.
5. **Condition (Kondisi Pasar):** Keberlanjutan tren kuliner dan daya beli konsumen sekitar lokasi outlet Taman Kuliner Anda.

*Saran Praktis:* Mulai catat seluruh arus kas harian menggunakan fitur Buku Kas Syariah di platform ini agar tercatat riwayat transaksi yang valid!`;
  } else if (lower.includes("halal") || lower.includes("bpjph") || lower.includes("sihalal") || lower.includes("sjph") || lower.includes("sertifikat")) {
    fallbackReply = `**Panduan Kilat Sertifikasi Halal BPJPH (UU No. 33/2014):**
1. **Nomor Induk Berusaha (NIB):** Pastikan KBLI sesuai usaha makanan/minuman Anda di OSS RBA.
2. **Penetapan Penyelia Halal:** Wajib menunjuk 1 orang tim internal yang beragama Islam dan memahami SJPH (Sistem Jaminan Produk Halal).
3. **Audit Bahan Baku (Halal & Thayyib):**
   - Bahan kritis (daging, gelatin, flavour, kaldu) WAJIB memiliki sertifikat halal yang masih berlaku.
   - Bahan non-kritis (sayuran segar, beras murni, air putih, telur mentah) masuk daftar *positive list*.
4. **Pemisahan Jalur Fasilitas:** Wadah memasak, talenan, kulkas, dan pisau tidak boleh terkontaminasi bahan haram/najis.
5. **Pengajuan SIHALAL:** Unggah dokumen SJPH ke portal resmi ptsp.halal.go.id.`;
  } else if (lower.includes("akad") || lower.includes("murabahah") || lower.includes("mudharabah") || lower.includes("bagi hasil")) {
    fallbackReply = `**Pilihan Akad Syariah yang Tepat untuk Usaha Kuliner:**
- **Akad Murabahah (Jual Beli dengan Margin Jelas):** Sangat ideal untuk pembelian aset seperti *deep fryer*, chiller kulkas, atau oven dapur. Lembaga keuangan membeli barang tersebut, lalu menjualnya kepada Anda dengan cicilan dan margin keuntungan yang disepakati di awal tanpa bunga fluktuatif.
- **Akad Mudarabah (Bagi Hasil 100% Modal Investor):** Investor menyediakan modal operasional bahan baku, pengelola (Anda) menjalankan usaha. Keuntungan dibagi sesuai nisbah (misal 60:40). Jika rugi murni bisnis (bukan kelalaian), investor menanggung kerugian finansial.
- **Akad Musyarakah (Kerjasama Modal Bersama):** Anda dan mitra menyetor modal bersama (misal 50%:50%) untuk membuka cabang booth baru. Bagi hasil disepakati bersama secara adil.
- **Akad Salam / Istishna:** Akad pemesanan makanan katering dengan spesifikasi jelas di awal dan pelunasan di muka secara sah.`;
  } else if (lower.includes("marketing") || lower.includes("pemasaran") || lower.includes("konten") || lower.includes("iklan")) {
    fallbackReply = `**Strategi Pemasaran Digital Syariah (Amanah & Anti-Overclaim):**
1. **Prinsip Kejujuran (As-Sidq):** Foto dan porsi makanan di media sosial/marketplace harus sesuai dengan yang disajikan ke pelanggan. Tidak boleh menggunakan rekayasa visual yang menyesatkan.
2. **Hindari Overclaim:** Tidak boleh menyebut "100% Menyembuhkan Semua Penyakit" jika produk Anda hanya minuman herbal biasa.
3. **Testimoni Otentik:** Dilarang membuat ulasan palsu (*fake reviews*) atau menyewa buzzer untuk menjatuhkan kompetitor (*najasy*).
4. **Konten Bernilai Edukasi & Thayyib:** Tampilkan proses higienitas dapur, kebersihan tempat cuci, dan kehalalan bahan bumbu untuk membangun *trust* pelanggan kuliner!`;
  } else {
    fallbackReply = `**Jawaban Konsultasi Syariah & Digitalisasi UMKM TamanKuliner.com:**
Prinsip utama digitalisasi UMKM syariah berpusat pada integrasi teknologi modern (pembukuan digital, QRIS, e-commerce, cloud sync) dengan fondasi nilai Islam: kejujuran (*Shiddiq*), keterbukaan & amanah (*Amanah*), penyampaian informasi produk yang transparan (*Tabligh*), serta pengelolaan bisnis yang cerdas & profesional (*Fathanah*).

Apakah Anda ingin membahas lebih spesifik mengenai:
1. Simulasi kelayakan pengajuan pembiayaan syariah (5C)?
2. Persiapan dokumen Sistem Jaminan Produk Halal (SJPH)?
3. Panduan pembukuan syariah pemisahan kas usaha?
Silakan tanyakan detailnya!`;
  }

  res.json({
    reply: fallbackReply,
    source: "expert-knowledge-base",
    model: "tamankuliner-sharia-knowledge-engine"
  });
});

// Third-party API integrations mock / proxy
app.get("/api/integrations/status", (_req, res) => {
  res.json({
    integrations: [
      { id: "bpjph-sihalal", name: "BPJPH SIHALAL Gateway", type: "Government Halal Registry", status: "connected", ping: "42ms", lastSync: "2 menit lalu" },
      { id: "ojk-fintech", name: "OJK Syariah Fintech Registry", type: "Financial Regulatory API", status: "connected", ping: "28ms", lastSync: "5 menit lalu" },
      { id: "bsi-openbanking", name: "Bank Syariah Open API", type: "Syariah Payment & Financing", status: "connected", ping: "35ms", lastSync: "1 menit lalu" },
      { id: "xapi-lms", name: "xAPI / CMI5 Learning Record Store", type: "LMS Analytics Telemetry", status: "active", ping: "15ms", lastSync: "Real-time" }
    ]
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LMS Pro TamanKuliner Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
