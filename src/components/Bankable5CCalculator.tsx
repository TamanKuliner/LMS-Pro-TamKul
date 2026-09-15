import React, { useState } from "react";
import { 
  Calculator, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  FileSpreadsheet, 
  TrendingUp, 
  ShieldCheck, 
  Printer, 
  Coins 
} from "lucide-react";
import { BankableEvaluation, Language, TabType } from "../types";
import { computeSHA256Hash } from "../utils/crypto";

interface Bankable5CCalculatorProps {
  language: Language;
  onNavigateTab: (tab: TabType) => void;
  businessName: string;
}

export const Bankable5CCalculator: React.FC<Bankable5CCalculatorProps> = ({
  language,
  onNavigateTab,
  businessName,
}) => {
  const [characterScore, setCharacterScore] = useState<number>(85);
  const [capacityScore, setCapacityScore] = useState<number>(75);
  const [capitalScore, setCapitalScore] = useState<number>(70);
  const [collateralScore, setCollateralScore] = useState<number>(65);
  const [conditionScore, setConditionScore] = useState<number>(80);

  const [hasSeparateBankAccount, setHasSeparateBankAccount] = useState<boolean>(true);
  const [usesDigitalPOS, setUsesDigitalPOS] = useState<boolean>(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(25000000);
  const [generatedAuditHash, setGeneratedAuditHash] = useState<string>("");

  // Weighted score calculation
  const totalScore = Math.round(
    characterScore * 0.25 +
    capacityScore * 0.25 +
    capitalScore * 0.20 +
    collateralScore * 0.15 +
    conditionScore * 0.15
  );

  let readinessLevel = "Unbankable";
  let badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
  let recommendation = "";

  if (totalScore >= 80) {
    readinessLevel = "Sangat Bankable (Layak Pembiayaan Komersial Syariah)";
    badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    recommendation = "Usaha kuliner Anda telah memiliki fondasi karakter, kapasitas, dan permodalan yang solid. Sangat direkomendasikan untuk mengajukan pembiayaan Murabahah atau Musyarakah modal kerja hingga Rp 100-500 Juta di Bank Syariah Indonesia (BSI) atau Fintech Syariah OJK.";
  } else if (totalScore >= 65) {
    readinessLevel = "Potensial Bankable (Siap Pembiayaan Mikro Syariah)";
    badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    recommendation = "Usaha Anda telah berada di jalur positif. Tingkatkan pemisahan kas pribadi vs usaha, perkuat pembukuan digital kasir harian, dan lengkapi legalitas NIB untuk memaksimalkan plafon pembiayaan mikro syariah Rp 10-50 Juta.";
  } else {
    readinessLevel = "Unbankable (Memerlukan Penguatan Manajemen Dasar)";
    badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    recommendation = "Fokus utama saat ini adalah merapikan pencatatan kas terpisah, mengamankan margin kotor kuliner di atas 35%, dan mengumpulkan riwayat omzet minimal 6 bulan berturut-turut sebelum mengajukan permohonan ke bank syariah.";
  }

  const handleGenerateAuditReport = async () => {
    const rawData = `${businessName}|Score:${totalScore}|C:${characterScore}|Cap:${capacityScore}|Date:${new Date().toISOString()}`;
    const hash = await computeSHA256Hash(rawData);
    setGeneratedAuditHash(hash);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Modul 1.2 • Algoritma Penilaian Bankability</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Simulasi Evaluasi 5C Berbasis Syariah
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ukur kelayakan usaha kuliner <span className="font-semibold text-white">{businessName}</span> untuk bertransformasi dari unbankable menjadi bankable.
          </p>
        </div>

        <button
          onClick={handleGenerateAuditReport}
          className="px-3.5 py-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center space-x-2 shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Kunci Hash Kripto Laporan 5C</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Form Parameters (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-5">
            <h2 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
              Parameter Penilaian 5 Pilar (5C)
            </h2>

            {/* 1. Character */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    1. Character (Karakter, Amanah & Integritas)
                  </span>
                  <p className="text-[11px] text-slate-500">Bobot 25% • Kejujuran rekam jejak, komitmen syariah, anti-riba</p>
                </div>
                <span className="text-sm font-bold text-emerald-400 font-mono">{characterScore}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={characterScore}
                onChange={(e) => setCharacterScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* 2. Capacity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    2. Capacity (Kapasitas Arus Kas & Manajemen)
                  </span>
                  <p className="text-[11px] text-slate-500">Bobot 25% • Kestabilan pesanan harian, margin laba kuliner</p>
                </div>
                <span className="text-sm font-bold text-emerald-400 font-mono">{capacityScore}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={capacityScore}
                onChange={(e) => setCapacityScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* 3. Capital */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    3. Capital (Struktur Permodalan Sendiri)
                  </span>
                  <p className="text-[11px] text-slate-500">Bobot 20% • Tabungan modal usaha, rasio ekuitas bersih</p>
                </div>
                <span className="text-sm font-bold text-emerald-400 font-mono">{capitalScore}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={capitalScore}
                onChange={(e) => setCapitalScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* 4. Collateral */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    4. Collateral (Agunan & Aset Produktif)
                  </span>
                  <p className="text-[11px] text-slate-500">Bobot 15% • Mesin dapur stainless, chiller, tempat usaha atau jaminan fidusia</p>
                </div>
                <span className="text-sm font-bold text-emerald-400 font-mono">{collateralScore}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={collateralScore}
                onChange={(e) => setCollateralScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* 5. Condition */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    5. Condition (Kondisi Tren Pasar Kuliner)
                  </span>
                  <p className="text-[11px] text-slate-500">Bobot 15% • Prospek industri F&B lokal, daya beli pembeli</p>
                </div>
                <span className="text-sm font-bold text-emerald-400 font-mono">{conditionScore}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={conditionScore}
                onChange={(e) => setConditionScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Checkbox boosters */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Faktor Penguat Kesiapan (Booster):
              </span>
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={hasSeparateBankAccount}
                  onChange={(e) => setHasSeparateBankAccount(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                />
                <span>Memiliki Rekening Bank Syariah Terpisah Khusus Usaha (+5 Poin Karakter)</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={usesDigitalPOS}
                  onChange={(e) => setUsesDigitalPOS(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                />
                <span>Menggunakan Aplikasi Kasir / QRIS Terintegrasi (+5 Poin Kapasitas)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Scorecard & Sharia Recommendation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>Hasil Penilaian Bankability</span>
              <span className="text-[10px] font-mono text-slate-500">Standar BSI & OJK</span>
            </h2>

            {/* Score Ring Display */}
            <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-[#16191F] shadow-inner">
                <span className="text-3xl font-bold text-white font-mono leading-none">
                  {totalScore}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">
                  Skor 5C
                </span>
              </div>

              <div className="mt-3">
                <span className={`inline-block px-3 py-1 rounded text-xs font-bold border ${badgeColor}`}>
                  {readinessLevel}
                </span>
              </div>
            </div>

            {/* Detailed Recommendation */}
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Rekomendasi Pembiayaan Syariah:
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                {recommendation}
              </p>
            </div>

            {/* Next Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onNavigateTab("financing-sim")}
                className="w-full py-2.5 px-3 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center justify-center space-x-2 transition-all"
              >
                <Coins className="w-4 h-4" />
                <span>Simulasikan Angsuran Murabahah / Mudharabah</span>
              </button>

              <button
                onClick={() => onNavigateTab("ai-advisor")}
                className="w-full py-2.5 px-3 rounded-lg font-medium text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Konsultasikan Skor dengan AI Syariah</span>
              </button>
            </div>

            {/* Hash Stamp Box */}
            {generatedAuditHash && (
              <div className="p-3 rounded-lg bg-slate-900 text-emerald-400 text-[10px] font-mono break-all border border-emerald-500/20">
                <span className="text-slate-500 block text-[9px]">SHA-256 E2EE Stamp:</span>
                {generatedAuditHash}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
