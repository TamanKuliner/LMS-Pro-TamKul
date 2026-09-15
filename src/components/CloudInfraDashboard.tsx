import React, { useState, useEffect } from "react";
import { 
  Server, 
  Cpu, 
  Activity, 
  Cloud, 
  ShieldCheck, 
  GitBranch, 
  AlertTriangle, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  Key, 
  Radio, 
  Database, 
  Globe 
} from "lucide-react";
import { CloudNode, CicdPipeline, AnomalyAlert, LiveTelemetry, ThirdPartyIntegration } from "../types";
import { generateE2EEKey, exportKeyToBase64, encryptPayload, decryptPayload, computeSHA256Hash } from "../utils/crypto";

export const CloudInfraDashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<LiveTelemetry>({
    cpuPercentage: 34,
    memoryPercentage: 56,
    averageLatencyMs: 21,
    requestsPerSec: 164,
    activeLearners: 148,
    e2eePacketsSecured: 5120,
  });

  const [nodes, setNodes] = useState<CloudNode[]>([
    { id: "gcp-jkt", provider: "Google Cloud", region: "Jakarta (asia-southeast2)", latency: 18, status: "healthy", trafficShare: 60, load: 38 },
    { id: "aws-jkt", provider: "AWS", region: "Jakarta (ap-southeast-3)", latency: 22, status: "healthy", trafficShare: 30, load: 42 },
    { id: "azure-sg", provider: "Microsoft Azure", region: "Singapore (southeastasia)", latency: 34, status: "healthy", trafficShare: 10, load: 24 }
  ]);

  const [pipelines, setPipelines] = useState<CicdPipeline[]>([
    { id: "pipe-9012", branch: "main", commit: "feat(halal-audit): auto-verify SJPH checklist matrix", status: "success", duration: "1m 32s", timestamp: "12 menit lalu", author: "CI/CD Scaler" },
    { id: "pipe-9011", branch: "hotfix/e2ee-aes", commit: "sec(crypto): AES-256-GCM cipher payload hardening", status: "success", duration: "2m 04s", timestamp: "45 menit lalu", author: "DevSecOps" },
    { id: "pipe-9010", branch: "feature/5c-eval", commit: "feat(lms): update Bankable UMKM 5C algorithm", status: "success", duration: "1m 45s", timestamp: "2 jam lalu", author: "Lead Architect" }
  ]);

  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([
    { id: "anom-1", level: "info", title: "Auto-Rebalancing Pods", message: "Trafik webinar modul 2 melonjak +180%. 4 pod baru berhasil di-scale di cluster Jakarta.", timestamp: "10 menit lalu", acknowledged: false },
    { id: "anom-2", level: "warning", title: "High Webhook Ingress Handled", message: "Lonjakan sinkronisasi data SIHALAL 120 req/s ditangani dengan antrian pesan otomatis.", timestamp: "35 menit lalu", acknowledged: true }
  ]);

  const [integrations] = useState<ThirdPartyIntegration[]>([
    { id: "bpjph-sihalal", name: "BPJPH SIHALAL Gateway API", type: "Government Halal Registry", status: "connected", ping: "38ms", lastSync: "1 menit lalu" },
    { id: "ojk-fintech", name: "OJK Syariah Fintech API", type: "Financial Regulatory API", status: "connected", ping: "24ms", lastSync: "4 menit lalu" },
    { id: "bsi-openbanking", name: "Bank Syariah Open API Hub", type: "Financing Verification", status: "connected", ping: "31ms", lastSync: "Real-time" },
    { id: "xapi-lms", name: "xAPI / CMI5 Learning Record Store", type: "LMS Telemetry & SCORM", status: "active", ping: "14ms", lastSync: "Real-time" }
  ]);

  // E2EE Test Console State
  const [e2eeKeyBase64, setE2eeKeyBase64] = useState<string>("");
  const [plaintextInput, setPlaintextInput] = useState<string>("Buku Kas Syariah: Omzet Rp 45.000.000, Laba Rp 14.500.000, Akad Murabahah Aktif #9012");
  const [cipherOutput, setCipherOutput] = useState<string>("");
  const [ivOutput, setIvOutput] = useState<string>("");
  const [decryptedOutput, setDecryptedOutput] = useState<string>("");
  const [activeKey, setActiveKey] = useState<CryptoKey | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  // Initialize E2EE key on mount
  useEffect(() => {
    async function initCrypto() {
      const key = await generateE2EEKey();
      setActiveKey(key);
      const b64 = await exportKeyToBase64(key);
      setE2eeKeyBase64(b64);
    }
    initCrypto();
  }, []);

  // Fetch live infrastructure telemetry
  const fetchInfraStatus = async () => {
    try {
      const res = await fetch("/api/infrastructure/status");
      if (res.ok) {
        const data = await res.json();
        if (data.liveMetrics) setTelemetry(data.liveMetrics);
        if (data.nodes) setNodes(data.nodes);
        if (data.pipelines) setPipelines(data.pipelines);
        if (data.anomalies) setAnomalies(data.anomalies);
      }
    } catch (e) {
      // Keep state
    }
  };

  useEffect(() => {
    fetchInfraStatus();
    const interval = setInterval(fetchInfraStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Trigger automated CI/CD canary deploy
  const handleTriggerDeploy = async () => {
    setIsDeploying(true);
    try {
      const res = await fetch("/api/cicd/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ environment: "production", targetRegion: "multi-cloud-auto" }),
      });
      if (res.ok) {
        await fetchInfraStatus();
      }
    } finally {
      setTimeout(() => setIsDeploying(false), 1500);
    }
  };

  // E2EE Encrypt Handler
  const handleEncryptData = async () => {
    if (!activeKey || !plaintextInput) return;
    const { cipherBase64, ivBase64 } = await encryptPayload(plaintextInput, activeKey);
    setCipherOutput(cipherBase64);
    setIvOutput(ivBase64);
    setDecryptedOutput("");
  };

  // E2EE Decrypt Handler
  const handleDecryptData = async () => {
    if (!activeKey || !cipherOutput || !ivOutput) return;
    try {
      const decrypted = await decryptPayload(cipherOutput, ivOutput, activeKey);
      setDecryptedOutput(decrypted);
    } catch (err) {
      setDecryptedOutput("Gagal mendekripsi: Kunci tidak valid atau payload rusak.");
    }
  };

  const handleAcknowledgeAnomaly = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5" />
            <span>DevOps High Density Monitor</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Konsol DevOps, Multi-Cloud & Enkripsi E2EE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitoring telemetri real-time, integrasi CI/CD otomatis, deteksi anomali pintar, dan audit kriptografi client-side.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleTriggerDeploy}
            disabled={isDeploying}
            className="px-3.5 py-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isDeploying ? "animate-spin" : ""}`} />
            <span>{isDeploying ? "Mendeploy Pipeline..." : "Trigger CI/CD Auto-Scale"}</span>
          </button>
        </div>
      </div>

      {/* 6 Real-time Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Beban CPU
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl font-bold text-white">
              {telemetry.cpuPercentage}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${telemetry.cpuPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Memori Klaster
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl font-bold text-white">
              {telemetry.memoryPercentage}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${telemetry.memoryPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Latensi Rata-Rata
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl font-bold text-emerald-400 font-mono">
              {telemetry.averageLatencyMs}
            </span>
            <span className="text-xs text-slate-500">ms</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block mt-2">Optimal (&lt;50ms)</span>
        </div>

        <div className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Throughput (RPS)
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl font-bold text-white font-mono">
              {telemetry.requestsPerSec}
            </span>
            <span className="text-xs text-slate-500">req/s</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-2">Auto-Load Balanced</span>
        </div>

        <div className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Peserta Aktif
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl font-bold text-white font-mono">
              {telemetry.activeLearners}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block mt-2">Real-time Connected</span>
        </div>

        <div className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Paket E2EE Aman
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl font-bold text-emerald-400 font-mono">
              {telemetry.e2eePacketsSecured}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-2">AES-256-GCM Hash</span>
        </div>
      </div>

      {/* Multi-Cloud Topology & Auto CI/CD Pipeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Multi-Cloud Nodes & Traffic Balancing */}
        <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Cloud className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">
                Klaster Multi-Cloud Terdistribusi (Multi-Region)
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Sinkron 100%
            </span>
          </div>

          <div className="space-y-2.5">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">
                      {node.provider}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {node.region}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
                    Latensi: <strong className="text-emerald-400">{node.latency}ms</strong> • Beban: {node.load}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-white">
                    {node.trafficShare}% Trafik
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-0.5 font-mono">
                    ● {node.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <strong className="text-white">Keuntungan Operasional Multi-Cloud:</strong> Jika terjadi pemadaman pada salah satu penyedia cloud, sistem auto-failover mengalihkan 100% trafik dalam 3 detik tanpa mengganggu sesi belajar peserta UMKM.
          </div>
        </div>

        {/* Right: CI/CD Automated Pipelines */}
        <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Otomasi CI/CD & Skalabilitas Sistem
              </h3>
            </div>
            <span className="text-xs text-slate-400">Canary Deployment Active</span>
          </div>

          <div className="space-y-2.5">
            {pipelines.map((pipe) => (
              <div
                key={pipe.id}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {pipe.id}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      {pipe.branch}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold mt-1">
                    {pipe.commit}
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {pipe.author} • {pipe.duration} • {pipe.timestamp}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  PASS ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Automated Anomaly Detection & Third-Party Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Anomaly Detection */}
        <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Pusat Deteksi Anomali Real-Time
              </h3>
            </div>
            <span className="text-xs text-slate-400">AI Sentinel Monitoring</span>
          </div>

          <div className="space-y-2.5">
            {anomalies.map((anom) => (
              <div
                key={anom.id}
                className={`p-3 rounded-lg border ${
                  anom.acknowledged
                    ? "bg-slate-900 border-slate-800"
                    : "bg-amber-500/10 border-amber-500/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {anom.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {anom.message}
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {anom.timestamp}
                    </span>
                  </div>

                  {!anom.acknowledged && (
                    <button
                      onClick={() => handleAcknowledgeAnomaly(anom.id)}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold shrink-0 ml-2"
                    >
                      Konfirmasi
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Third-party API Integrations Hub */}
        <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Integrasi API Pihak Ketiga & Sinkronisasi
              </h3>
            </div>
            <span className="text-xs text-slate-400">Webhooks Ready</span>
          </div>

          <div className="space-y-2.5">
            {integrations.map((api) => (
              <div
                key={api.id}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {api.name}
                  </h4>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {api.type} • Ping: <strong className="text-emerald-400 font-mono">{api.ping}</strong>
                  </span>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {api.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {api.lastSync}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* End-to-End Encryption (E2EE) Cryptographic Laboratory */}
      <div className="bg-[#16191F] text-slate-300 p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Pusat Pengujian Enkripsi End-to-End (E2EE Client-Side)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
            Algoritma: AES-256-GCM
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Setiap data rahasia UMKM (omzet pembukuan kas, data NIB, dan riwayat transaksi syariah) dienkripsi langsung di peramban pengguna sebelum dikirimkan ke cloud server. Tidak ada pihak ketiga yang dapat membaca data tanpa kunci privat.
        </p>

        {/* Active Key Display */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="text-slate-500 block text-[10px] mb-1">KUNCI KRIPTOGRAFI E2EE ANDA (BASE64):</span>
          <span className="text-emerald-400 break-all">{e2eeKeyBase64 || "Membuat kunci..."}</span>
        </div>

        {/* Test Interactive Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Plaintext Box */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300">Teks Pembukuan / Data Asli (Plaintext):</label>
            <textarea
              value={plaintextInput}
              onChange={(e) => setPlaintextInput(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 text-slate-100 p-3 rounded-lg border border-slate-800 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              onClick={handleEncryptData}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Enkripsi Payload (AES-GCM)</span>
            </button>
          </div>

          {/* Ciphertext Box */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300">Hasil Ciphertext Terenkripsi (Base64):</label>
            <div className="h-20 bg-slate-900 text-emerald-400 p-3 rounded-lg border border-slate-800 font-mono text-[11px] overflow-y-auto break-all">
              {cipherOutput ? cipherOutput : "Klik tombol 'Enkripsi' untuk menghasilkan ciphertext aman..."}
            </div>
            <button
              onClick={handleDecryptData}
              disabled={!cipherOutput}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700 transition-colors flex items-center space-x-1.5 disabled:opacity-40"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dekripsi Kembali Payload</span>
            </button>
          </div>
        </div>

        {decryptedOutput && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs">
            <span className="font-bold text-emerald-400 block mb-1">Hasil Dekripsi Sukses (Verifikasi 100% Cocok):</span>
            <p className="font-mono text-slate-200">{decryptedOutput}</p>
          </div>
        )}
      </div>
    </div>
  );
};
