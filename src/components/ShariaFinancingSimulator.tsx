import React, { useState } from "react";
import { 
  Coins, 
  HelpCircle, 
  TrendingUp, 
  Scale, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";
import { Language, TabType } from "../types";

interface ShariaFinancingSimulatorProps {
  language: Language;
  onNavigateTab: (tab: TabType) => void;
}

export const ShariaFinancingSimulator: React.FC<ShariaFinancingSimulatorProps> = ({
  language,
  onNavigateTab,
}) => {
  const [activeAkad, setActiveAkad] = useState<"murabahah" | "mudharabah" | "zakat">("murabahah");

  // Murabahah state
  const [assetPrice, setAssetPrice] = useState<number>(20000000); // 20 juta
  const [downPayment, setDownPayment] = useState<number>(2000000); // 2 juta (10%)
  const [tenorMonths, setTenorMonths] = useState<number>(12); // 12 bulan
  const [marginPercentYearly, setMarginPercentYearly] = useState<number>(9); // 9% flat margin

  // Mudharabah state
  const [workingCapital, setWorkingCapital] = useState<number>(30000000); // 30 juta
  const [projectedMonthlyProfit, setProjectedMonthlyProfit] = useState<number>(7500000); // 7.5 juta
  const [managerRatio, setManagerRatio] = useState<number>(70); // 70% Pengelola, 30% Investor

  // Zakat Perniagaan state
  const [currentAssets, setCurrentAssets] = useState<number>(85000000); // Kas + Stok Bahan
  const [shortTermDebts, setShortTermDebts] = useState<number>(10000000); // Utang jatuh tempo

  // Calculations:
  // Murabahah
  const principalFinanced = Math.max(0, assetPrice - downPayment);
  const totalMargin = principalFinanced * (marginPercentYearly / 100) * (tenorMonths / 12);
  const totalRepayment = principalFinanced + totalMargin;
  const monthlyInstallment = Math.round(totalRepayment / tenorMonths);

  // Mudharabah
  const investorRatio = 100 - managerRatio;
  const managerMonthlyShare = Math.round(projectedMonthlyProfit * (managerRatio / 100));
  const investorMonthlyShare = Math.round(projectedMonthlyProfit * (investorRatio / 100));

  // Zakat (Nisab 85 gr emas ~ Rp 120.000.000 @ Rp 1.400.000/gr)
  const goldPricePerGram = 1400000;
  const nisabThreshold = 85 * goldPricePerGram; // 119 Juta
  const netZakatBase = Math.max(0, currentAssets - shortTermDebts);
  const isZakatObligated = netZakatBase >= nisabThreshold;
  const yearlyZakat = Math.round(netZakatBase * 0.025);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Coins className="w-3.5 h-3.5" />
            <span>Simulasi Akuntansi & Fintech Syariah (Modul 2)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Kalkulator Pembiayaan & Zakat Bisnis Syariah
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulasikan angsuran tetap tanpa bunga (Murabahah), nisbah bagi hasil adil (Mudharabah), dan perhitungan zakat perniagaan kuliner.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveAkad("murabahah")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeAkad === "murabahah"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Murabahah (Alat)
          </button>
          <button
            onClick={() => setActiveAkad("mudharabah")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeAkad === "mudharabah"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Mudharabah (Bagi Hasil)
          </button>
          <button
            onClick={() => setActiveAkad("zakat")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeAkad === "zakat"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Zakat (2.5%)
          </button>
        </div>
      </div>

      {/* Simulator Content based on activeAkad */}
      {activeAkad === "murabahah" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-5">
            <div className="pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">
                Pengadaan Alat & Mesin Dapur (Akad Jual Beli Murabahah)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Bank/Fintech Syariah membeli alat dapur, lalu menjual kembali ke UMKM dengan margin keuntungan yang disepakati di awal tanpa bunga floating.
              </p>
            </div>

            {/* Asset Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-slate-300">Harga Perolehan Alat Dapur / Mesin</label>
                <span className="text-emerald-400 font-mono">Rp {assetPrice.toLocaleString("id-ID")}</span>
              </div>
              <input
                type="range"
                min="5000000"
                max="100000000"
                step="1000000"
                value={assetPrice}
                onChange={(e) => setAssetPrice(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Rp 5 Juta (Chiller kecil)</span>
                <span>Rp 100 Juta (Kitchen set komersial)</span>
              </div>
            </div>

            {/* Down Payment */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-slate-300">Uang Muka / Urobun (DP)</label>
                <span className="text-emerald-400 font-mono">Rp {downPayment.toLocaleString("id-ID")} ({Math.round((downPayment / assetPrice) * 100)}%)</span>
              </div>
              <input
                type="range"
                min="0"
                max={assetPrice * 0.5}
                step="500000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Tenor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Jangka Waktu Pembiayaan (Tenor)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[6, 12, 24, 36].map((months) => (
                  <button
                    key={months}
                    onClick={() => setTenorMonths(months)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      tenorMonths === months
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {months} Bulan
                  </button>
                ))}
              </div>
            </div>

            {/* Margin Flat */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-slate-300">Nisbah Margin Keuntungan Bank / Tahun</label>
                <span className="text-emerald-400 font-mono">{marginPercentYearly}% Flat / Tahun</span>
              </div>
              <input
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={marginPercentYearly}
                onChange={(e) => setMarginPercentYearly(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results (5 cols) */}
          <div className="lg:col-span-5 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
              Rincian Angsuran Tetap Murabahah
            </h3>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Angsuran Tetap Per Bulan:
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono mt-1 block">
                Rp {monthlyInstallment.toLocaleString("id-ID")}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Pasti & tidak berubah selama {tenorMonths} bulan
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Plafon Pembiayaan Pokok:</span>
                <span className="font-bold text-white font-mono">Rp {principalFinanced.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Total Margin Disepakati:</span>
                <span className="font-bold text-white font-mono">Rp {Math.round(totalMargin).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Total Harga Jual Akhir:</span>
                <span className="font-bold text-emerald-400 font-mono">Rp {Math.round(totalRepayment).toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-white block mb-0.5">Keunggulan Syariah:</span>
              Bebas dari riba denda bergulung (compounding interest). Jika terjadi keterlambatan karena musibah riil, bank syariah mengutamakan restrukturisasi musyawarah.
            </div>
          </div>
        </div>
      )}

      {activeAkad === "mudharabah" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mudharabah Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-5">
            <div className="pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">
                Simulasi Kemitraan Bagi Hasil (Akad Mudharabah)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pemilik modal menyetorkan 100% modal kerja, pengelola UMKM mengoperasikan usaha kuliner. Laba dibagi sesuai kesepakatan nisbah (%).
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-slate-300">Modal Kerja Yang Dibutuhkan</label>
                <span className="text-emerald-400 font-mono">Rp {workingCapital.toLocaleString("id-ID")}</span>
              </div>
              <input
                type="range"
                min="10000000"
                max="150000000"
                step="2500000"
                value={workingCapital}
                onChange={(e) => setWorkingCapital(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-slate-300">Estimasi Laba Bersih Usaha Kuliner / Bulan</label>
                <span className="text-emerald-400 font-mono">Rp {projectedMonthlyProfit.toLocaleString("id-ID")}</span>
              </div>
              <input
                type="range"
                min="2000000"
                max="25000000"
                step="500000"
                value={projectedMonthlyProfit}
                onChange={(e) => setProjectedMonthlyProfit(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-slate-300">Nisbah Bagi Hasil Pengelola UMKM</label>
                <span className="text-emerald-400 font-mono">{managerRatio}% Pengelola : {investorRatio}% Investor</span>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                step="5"
                value={managerRatio}
                onChange={(e) => setManagerRatio(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Mudharabah Results (5 cols) */}
          <div className="lg:col-span-5 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
              Proyeksi Pembagian Hasil Riil
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Pengelola ({managerRatio}%)
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-1 block">
                  Rp {managerMonthlyShare.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-slate-500">Per Bulan</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Investor ({investorRatio}%)
                </span>
                <span className="text-base sm:text-lg font-bold text-sky-400 font-mono mt-1 block">
                  Rp {investorMonthlyShare.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-slate-500">Per Bulan</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1 text-slate-400 leading-relaxed">
              <span className="font-bold text-white block">Prinsip Al-Ghunmu bil Ghurmi:</span>
              Keuntungan sejalan dengan risiko. Apabila terjadi penurunan omzet, setoran bagi hasil menyesuaikan laba riil yang didapat, sehingga UMKM tidak tercekik beban utang tetap saat musim sepi.
            </div>
          </div>
        </div>
      )}

      {activeAkad === "zakat" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Zakat Inputs */}
          <div className="lg:col-span-7 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-5">
            <div className="pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">
                Kalkulator Zakat Perniagaan (Zakat Mal Kuliner)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kewajiban zakat 2.5% dari harta perniagaan lancar bersih jika telah mencapai nisab setara 85 gram emas selama 1 tahun (haul).
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-slate-300">Total Harta Lancar (Kas + Bank + Stok Makanan/Bahan)</label>
                <span className="text-emerald-400 font-mono">Rp {currentAssets.toLocaleString("id-ID")}</span>
              </div>
              <input
                type="range"
                min="10000000"
                max="250000000"
                step="5000000"
                value={currentAssets}
                onChange={(e) => setCurrentAssets(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-slate-300">Utang Jangka Pendek / Kewajiban Segera</label>
                <span className="text-emerald-400 font-mono">Rp {shortTermDebts.toLocaleString("id-ID")}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000000"
                step="1000000"
                value={shortTermDebts}
                onChange={(e) => setShortTermDebts(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Zakat Results */}
          <div className="lg:col-span-5 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
              Kewajiban Zakat Perniagaan
            </h3>

            <div className={`p-5 rounded-xl border text-center ${
              isZakatObligated
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {isZakatObligated ? "Status: Wajib Zakat (Mencapai Nisab)" : "Status: Belum Wajib Zakat"}
              </span>
              <span className="text-2xl sm:text-3xl font-bold font-mono mt-1.5 block">
                {isZakatObligated ? `Rp ${yearlyZakat.toLocaleString("id-ID")}` : "Rp 0"}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                Nisab Emas 85g: Rp {nisabThreshold.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-white block mb-0.5">Keberkahan Perniagaan:</span>
              Menunaikan zakat perniagaan membersihkan harta usaha kuliner dan membuka pintu rezeki yang berkah bagi kemaslahatan umat.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
