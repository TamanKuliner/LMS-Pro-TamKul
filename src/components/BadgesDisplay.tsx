import React, { useState, useMemo } from "react";
import { 
  Award, 
  Zap, 
  ShieldCheck, 
  BookOpen, 
  Calculator, 
  Coins, 
  Trophy, 
  Star, 
  TrendingUp, 
  Sparkles,
  Lock,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Info,
  Filter,
  ArrowRight,
  Share2,
  X
} from "lucide-react";
import { DigitalBadge, BadgeTier, BadgeCategory, TabType } from "../types";
import { calculateTotalBadgePoints } from "../data/badgesData";

interface BadgesDisplayProps {
  badges: DigitalBadge[];
  onNavigateTab?: (tab: TabType) => void;
  onSelectModule?: (moduleId: string) => void;
  onCloseModal?: () => void;
  fullName: string;
  businessName: string;
  onShowToast?: (msg: string) => void;
}

export const BadgesDisplay: React.FC<BadgesDisplayProps> = ({
  badges,
  onNavigateTab,
  onSelectModule,
  onCloseModal,
  fullName,
  businessName,
  onShowToast,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<DigitalBadge | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [categoryFilter, setCategoryFilter] = useState<BadgeCategory>("all");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const stats = useMemo(() => calculateTotalBadgePoints(badges), [badges]);

  // Filtered badges
  const filteredBadges = useMemo(() => {
    return badges.filter((b) => {
      if (statusFilter === "unlocked" && !b.isUnlocked) return false;
      if (statusFilter === "locked" && b.isUnlocked) return false;
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
      return true;
    });
  }, [badges, statusFilter, categoryFilter]);

  // Find next closest locked badge
  const nextBadge = useMemo(() => {
    const locked = badges.filter((b) => !b.isUnlocked);
    if (locked.length === 0) return null;
    return [...locked].sort((a, b) => b.progress.percentage - a.progress.percentage)[0];
  }, [badges]);

  const handleCopyHash = (hash: string, badgeName: string) => {
    navigator.clipboard.writeText(`Verifikasi Medali Digital: ${badgeName} | Peserta: ${fullName} (${businessName}) | Hash: ${hash}`);
    setCopiedHash(hash);
    if (onShowToast) {
      onShowToast(`Hash pembuktian digital medali ${badgeName} berhasil disalin!`);
    }
    setTimeout(() => {
      setCopiedHash(null);
    }, 2500);
  };

  const renderIcon = (iconName: DigitalBadge["iconName"], className = "w-6 h-6") => {
    switch (iconName) {
      case "zap":
        return <Zap className={className} />;
      case "shield-check":
        return <ShieldCheck className={className} />;
      case "book-open":
        return <BookOpen className={className} />;
      case "calculator":
        return <Calculator className={className} />;
      case "coins":
        return <Coins className={className} />;
      case "trophy":
        return <Trophy className={className} />;
      case "star":
        return <Star className={className} />;
      case "trending-up":
        return <TrendingUp className={className} />;
      case "sparkles":
        return <Sparkles className={className} />;
      case "award":
      default:
        return <Award className={className} />;
    }
  };

  // Get tier visual styling
  const getTierStyles = (tier: BadgeTier, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        badgeBg: "bg-slate-900/60 border-slate-800 text-slate-500",
        medalDisc: "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-slate-500",
        ribbonBg: "from-slate-700 to-slate-800",
        glow: "",
        pill: "bg-slate-800 text-slate-400 border-slate-700",
        label: "TERKUNCI",
      };
    }

    switch (tier) {
      case "diamond":
        return {
          badgeBg: "bg-cyan-950/20 border-cyan-500/30 text-cyan-300 hover:border-cyan-400/60",
          medalDisc: "bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600 border-cyan-200 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)]",
          ribbonBg: "from-sky-500 via-cyan-400 to-blue-600",
          glow: "shadow-[0_0_15px_rgba(56,189,248,0.2)]",
          pill: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
          label: "DIAMOND",
        };
      case "legendary":
        return {
          badgeBg: "bg-purple-950/20 border-purple-500/30 text-purple-300 hover:border-purple-400/60",
          medalDisc: "bg-gradient-to-br from-amber-300 via-purple-500 to-fuchsia-600 border-amber-300 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]",
          ribbonBg: "from-amber-400 via-purple-600 to-amber-400",
          glow: "shadow-[0_0_15px_rgba(168,85,247,0.25)]",
          pill: "bg-purple-500/15 text-purple-300 border-purple-500/30",
          label: "LEGENDARY",
        };
      case "platinum":
        return {
          badgeBg: "bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60",
          medalDisc: "bg-gradient-to-br from-emerald-300 via-teal-400 to-emerald-600 border-emerald-200 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]",
          ribbonBg: "from-emerald-500 via-teal-400 to-emerald-600",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]",
          pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          label: "PLATINUM",
        };
      case "gold":
        return {
          badgeBg: "bg-amber-950/20 border-amber-500/30 text-amber-300 hover:border-amber-400/60",
          medalDisc: "bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-600 border-yellow-200 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]",
          ribbonBg: "from-amber-400 via-yellow-300 to-amber-500",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]",
          pill: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          label: "GOLD 24K",
        };
      case "silver":
        return {
          badgeBg: "bg-slate-900/60 border-slate-700/60 text-slate-200 hover:border-slate-500",
          medalDisc: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 border-slate-200 text-slate-900 shadow-[0_0_15px_rgba(203,213,225,0.2)]",
          ribbonBg: "from-slate-400 via-slate-300 to-slate-500",
          glow: "shadow-[0_0_10px_rgba(203,213,225,0.15)]",
          pill: "bg-slate-700/50 text-slate-200 border-slate-600",
          label: "SILVER",
        };
      case "bronze":
      default:
        return {
          badgeBg: "bg-amber-950/10 border-amber-800/40 text-amber-200 hover:border-amber-700",
          medalDisc: "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border-amber-500 text-amber-100 shadow-[0_0_15px_rgba(180,83,9,0.2)]",
          ribbonBg: "from-amber-700 via-amber-600 to-amber-800",
          glow: "shadow-[0_0_10px_rgba(180,83,9,0.15)]",
          pill: "bg-amber-800/30 text-amber-300 border-amber-700/50",
          label: "BRONZE",
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. GAMIFICATION SUMMARY HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-[#131720] to-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Showcase Medali & Prestasi Digital</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Verified
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  Pencapaian kompetensi tervalidasi berbasis 4 Modul Kurikulum (7 JP) dan Ujian Substansi
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Medals Count Pill */}
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Medali Diraih</div>
                <div className="text-xs font-bold text-white font-mono">
                  {stats.unlockedCount} <span className="text-slate-500 font-normal">/ {stats.totalCount}</span>
                </div>
              </div>
            </div>

            {/* Total Points XP */}
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Poin Prestasi</div>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  +{stats.earnedPoints} <span className="text-slate-500 text-[10px] font-normal">XP</span>
                </div>
              </div>
            </div>

            {/* Rank Status */}
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Gelar Peserta</div>
                <div className="text-xs font-bold text-cyan-300 truncate max-w-[150px]">
                  {stats.userRank.split("(")[0]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span>Kelengkapan Medali:</span>
              <strong className="text-slate-200">{Math.round((stats.unlockedCount / stats.totalCount) * 100)}%</strong>
            </span>
            {nextBadge && (
              <span className="text-[11px] text-amber-400/90 font-medium">
                Peluang Terdekat: <strong className="text-white">{nextBadge.name}</strong> ({nextBadge.progress.percentage}%)
              </span>
            )}
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${(stats.unlockedCount / stats.totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. FILTER & SORT TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusFilter === "all"
                ? "bg-slate-800 text-white shadow-xs font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Semua ({badges.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("unlocked")}
            className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === "unlocked"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Diraih ({stats.unlockedCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("locked")}
            className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === "locked"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Terkunci ({stats.totalCount - stats.unlockedCount})</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
          <span className="text-slate-500 px-1 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span className="hidden md:inline">Kategori:</span>
          </span>
          {(
            [
              { id: "all", label: "Semua" },
              { id: "syariah", label: "Syariah & Halal" },
              { id: "academic", label: "Kurikulum Modul" },
              { id: "exam", label: "Ujian & Skor" },
              { id: "speed", label: "Kecepatan & Konsistensi" },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id as BadgeCategory)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? "bg-slate-800 text-slate-100 font-semibold border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DIGITAL MEDALS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[55vh] overflow-y-auto pr-1">
        {filteredBadges.map((badge) => {
          const style = getTierStyles(badge.tier, badge.isUnlocked);
          return (
            <div
              key={badge.id}
              id={`badge-card-${badge.id}`}
              onClick={() => setSelectedBadge(badge)}
              className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${style.badgeBg} ${style.glow} hover:scale-[1.01]`}
            >
              <div>
                {/* Top bar of the medal card */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${style.pill}`}>
                    {style.label}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold font-mono">
                    <span className={badge.isUnlocked ? "text-emerald-400" : "text-slate-500"}>
                      +{badge.points} XP
                    </span>
                  </div>
                </div>

                {/* Digital Medal Emblem Graphic */}
                <div className="flex items-center gap-3 my-2">
                  {/* The Physical-styled Medal Disc with Ribbon */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    {/* Folded Medal Ribbon V-shape */}
                    <div className="w-5 h-3 flex justify-center -mb-1 z-0">
                      <div className={`w-3 h-3 bg-gradient-to-b ${style.ribbonBg} rounded-t-sm shadow-xs`} />
                    </div>

                    {/* Medal Ring Outer Bevel */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center p-0.5 border shadow-md relative z-10 transition-transform group-hover:scale-110 ${style.medalDisc}`}
                    >
                      {/* Inner concentric ring */}
                      <div className="w-full h-full rounded-full border border-black/20 flex items-center justify-center">
                        {renderIcon(badge.iconName, "w-5 h-5")}
                      </div>

                      {/* Unlocked checkmark pill or lock icon overlay */}
                      <div className="absolute -bottom-1 -right-1">
                        {badge.isUnlocked ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs border border-emerald-300">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center shadow-xs border border-slate-700">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badge Text Content */}
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                      <span>{badge.name}</span>
                      {badge.tier === "diamond" && <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      {badge.tier === "legendary" && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                      "{badge.tagline}"
                    </p>
                  </div>
                </div>

                {/* Criteria Snippet */}
                <p className="text-xs text-slate-300 line-clamp-2 my-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Card Footer: Unlock Date or Progress */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                {badge.isUnlocked ? (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Diraih {badge.unlockedAt}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-white flex items-center gap-0.5">
                      <span>Detail</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Progres: {badge.progress.current}/{badge.progress.max} {badge.progress.unit}</span>
                      <span className="font-mono text-amber-400 font-semibold">{badge.progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${badge.progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. SELECTED BADGE DETAIL & PROOF MODAL */}
      {selectedBadge && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151921] rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative p-6 text-center border-b border-slate-800 bg-gradient-to-b from-slate-900 to-[#151921]">
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Animated Digital Medal */}
              <div className="flex flex-col items-center justify-center mb-3">
                {/* Large Ribbon */}
                <div className="w-8 h-4 flex justify-center -mb-1.5 z-0">
                  <div
                    className={`w-5 h-4 bg-gradient-to-b ${
                      getTierStyles(selectedBadge.tier, selectedBadge.isUnlocked).ribbonBg
                    } rounded-t shadow-sm`}
                  />
                </div>

                {/* Big Medal Disc */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center p-1 border-2 shadow-2xl relative z-10 transition-transform ${
                    getTierStyles(selectedBadge.tier, selectedBadge.isUnlocked).medalDisc
                  }`}
                >
                  <div className="w-full h-full rounded-full border-2 border-black/25 flex items-center justify-center">
                    {renderIcon(selectedBadge.iconName, "w-9 h-9")}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    getTierStyles(selectedBadge.tier, selectedBadge.isUnlocked).pill
                  }`}
                >
                  {getTierStyles(selectedBadge.tier, selectedBadge.isUnlocked).label}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                  +{selectedBadge.points} XP
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                {selectedBadge.name}
              </h3>
              <p className="text-xs text-slate-400 italic">
                "{selectedBadge.tagline}"
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs text-slate-300">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Deskripsi Prestasi
                </span>
                <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {selectedBadge.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Kriteria Kelulusan
                </span>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-300">{selectedBadge.criteria}</span>
                    <div className="mt-2 flex items-center gap-2 text-[11px]">
                      <span className="text-slate-400">Status Pencapaian:</span>
                      {selectedBadge.isUnlocked ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terpenuhi 100% (Diraih {selectedBadge.unlockedAt})</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold">
                          {selectedBadge.progress.current}/{selectedBadge.progress.max} {selectedBadge.progress.unit} ({selectedBadge.progress.percentage}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Proof / Verification Hash */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Bukti Kriptografis Medali (SHA-256)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">E2EE Provenance</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-slate-800 font-mono text-[11px] text-slate-400">
                  <span className="truncate pr-2 select-all">{selectedBadge.hashProof}</span>
                  <button
                    onClick={() => handleCopyHash(selectedBadge.hashProof || "", selectedBadge.name)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white shrink-0 flex items-center gap-1"
                    title="Salin Hash"
                  >
                    {copiedHash === selectedBadge.hashProof ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Penerima Medali:</span>
                  <span className="font-semibold text-slate-200">{fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Identitas Usaha:</span>
                  <span className="font-semibold text-slate-200">{businessName}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                {!selectedBadge.isUnlocked && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBadge(null);
                      if (onCloseModal) onCloseModal();
                      // Smart navigate based on badge
                      if (selectedBadge.id === "badge-fintech-innovator") {
                        if (onSelectModule) onSelectModule("modul-4");
                        if (onNavigateTab) onNavigateTab("syllabus");
                      } else if (selectedBadge.id === "badge-halal-expert") {
                        if (onNavigateTab) onNavigateTab("halal-tracker");
                      } else if (selectedBadge.category === "exam") {
                        if (onNavigateTab) onNavigateTab("quiz-test");
                      } else {
                        if (onNavigateTab) onNavigateTab("syllabus");
                      }
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>Kerjakan Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {selectedBadge.isUnlocked && (
                  <button
                    type="button"
                    onClick={() => handleCopyHash(selectedBadge.hashProof || "", selectedBadge.name)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan Bukti Medali</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Crown icon fallback
const Crown: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);
