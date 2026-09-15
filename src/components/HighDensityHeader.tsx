import React from "react";
import { 
  Bell, 
  Globe, 
  RefreshCw, 
  Sun, 
  Moon, 
  Menu,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Layers
} from "lucide-react";
import { Language } from "../types";

export interface HighDensityHeaderProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenNotifications: () => void;
  unreadAnomaliesCount: number;
  syncStatus: "synced" | "syncing";
  onTriggerSync: () => void;
  onOpenProfile: () => void;
  onToggleMobileMenu: () => void;
  fullName?: string;
  businessName?: string;
  isHighDensity?: boolean;
  onToggleHighDensity?: () => void;
  onToggleQuickActionsMobile?: () => void;
  unlockedBadgesCount?: number;
}

export const HighDensityHeader: React.FC<HighDensityHeaderProps> = ({
  language,
  onSelectLanguage,
  darkMode,
  onToggleDarkMode,
  onOpenNotifications,
  unreadAnomaliesCount,
  syncStatus,
  onTriggerSync,
  onOpenProfile,
  onToggleMobileMenu,
  fullName = "Hj. Siti Rahmah",
  businessName = "Dapur Sambal Berkah",
  isHighDensity = true,
  onToggleHighDensity,
  onToggleQuickActionsMobile,
  unlockedBadgesCount = 7,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#0F1115] flex items-center justify-between px-4 sm:px-6 shrink-0 select-none z-30">
      {/* Left side: Mobile Toggle & High-Density Status Telemetry */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-slate-500 text-xs hidden sm:inline">Status:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-xs border border-emerald-500/20 font-medium whitespace-nowrap flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Optimal - Multi Region</span>
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 font-mono text-xs hidden md:inline">
            v2.4.1-stable
          </span>
        </div>
      </div>

      {/* Right side: Density Toggle, Language, Sync, Alerts & Admin Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* High Density Mode Indicator / Toggle */}
        {onToggleHighDensity && (
          <button
            onClick={onToggleHighDensity}
            className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${
              isHighDensity
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs"
                : "bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-white"
            }`}
            title="Mode High Density (Quick Actions sidebar hanya muncul pada mode ini)"
          >
            <Zap className={`w-3 h-3 ${isHighDensity ? "text-emerald-400" : "text-slate-500"}`} />
            <span className="hidden lg:inline">HD Mode:</span>
            <span>{isHighDensity ? "ON" : "OFF"}</span>
          </button>
        )}

        {/* Mobile Quick Actions button (for screens < xl) */}
        {isHighDensity && onToggleQuickActionsMobile && (
          <button
            onClick={onToggleQuickActionsMobile}
            className="xl:hidden p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1"
            title="Buka Quick Actions"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase hidden sm:inline">Actions</span>
          </button>
        )}

        {/* Sync Trigger */}
        <button
          onClick={onTriggerSync}
          className={`p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs ${
            syncStatus === "syncing" ? "text-emerald-400" : ""
          }`}
          title="Edge Sync Real-time"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === "syncing" ? "animate-spin text-emerald-400" : ""}`} />
          <span className="hidden 2xl:inline text-[11px] font-mono text-slate-400">
            {syncStatus === "syncing" ? "Syncing..." : "Sync 99.98%"}
          </span>
        </button>

        {/* Language Selector */}
        <div className="flex items-center gap-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={language}
            onChange={(e) => onSelectLanguage(e.target.value as Language)}
            className="bg-transparent text-slate-300 border-none outline-none cursor-pointer text-xs focus:ring-0 font-medium"
            aria-label="Select language"
          >
            <option value="id" className="bg-slate-900 text-slate-200">ID</option>
            <option value="en" className="bg-slate-900 text-slate-200">EN</option>
            <option value="ar" className="bg-slate-900 text-slate-200">AR</option>
          </select>
        </div>

        {/* Notification Bell with Anomaly indicator */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Real-time Anomaly Alerts"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-400" />
          {unreadAnomaliesCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0F1115]" />
          )}
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <div className="h-4 w-px bg-slate-800 hidden sm:block" />

        {/* Admin UMKM Badge */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity p-1 rounded-lg hover:bg-slate-850"
          title="Buka Profil & Showcase Medali Digital"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
              SR
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-black border border-[#0F1115]">
              ★
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-medium text-slate-200 leading-tight flex items-center gap-1.5">
              <span>Admin UMKM</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold font-mono">
                {unlockedBadgesCount} Medali
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{businessName}</div>
          </div>
        </button>
      </div>
    </header>
  );
};
