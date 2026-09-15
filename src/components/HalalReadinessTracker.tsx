import React, { useState, useMemo } from "react";
import { 
  FileCheck2, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  FileText, 
  FileSpreadsheet,
  Printer, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Filter,
  Search,
  X,
  Clock,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Package,
  UtensilsCrossed,
  Activity,
  Users,
  CheckCheck,
  FolderOpen,
  Flag,
  MessageSquare,
  MessageSquarePlus,
  Pencil,
  Trash2,
  Check,
  Calendar,
  CalendarClock,
  Timer,
  Bell,
  BellRing
} from "lucide-react";
import { Language, TabType, HalalChecklistItem } from "../types";
import { initialHalalChecklist } from "../data/halalChecklistData";
import { downloadHalalChecklistCsv } from "../utils/csvExport";
import { HalalScheduledReminderCard } from "./HalalScheduledReminderCard";
import { auditPendingHalalItems } from "../utils/halalNotificationService";

export type HalalStatusFilter = "all" | "completed" | "incomplete" | "mandatory" | "has_notes" | "has_deadline" | "pending_48h";

export interface DeadlineInfo {
  hasDeadline: boolean;
  rawDate: string;
  formattedDate: string;
  diffDays: number;
  status: "completed" | "overdue" | "due_today" | "urgent" | "soon" | "upcoming";
  label: string;
  badgeClass: string;
  iconClass: string;
}

export const getDeadlineInfo = (deadline?: string, isChecked?: boolean): DeadlineInfo | null => {
  if (!deadline) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const parts = deadline.split("-").map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return null;

  const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = targetDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short"
  });

  if (isChecked) {
    return {
      hasDeadline: true,
      rawDate: deadline,
      formattedDate,
      diffDays,
      status: "completed",
      label: `Selesai (${formattedDate})`,
      badgeClass: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
      iconClass: "text-emerald-400"
    };
  }

  if (diffDays < 0) {
    const daysLate = Math.abs(diffDays);
    return {
      hasDeadline: true,
      rawDate: deadline,
      formattedDate,
      diffDays,
      status: "overdue",
      label: `Terlewat ${daysLate} hari (${formattedDate})`,
      badgeClass: "bg-rose-950/90 text-rose-300 border-rose-500/80 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/40 font-extrabold",
      iconClass: "text-rose-400"
    };
  }

  if (diffDays === 0) {
    return {
      hasDeadline: true,
      rawDate: deadline,
      formattedDate,
      diffDays,
      status: "due_today",
      label: "Jatuh Tempo Hari Ini!",
      badgeClass: "bg-amber-950/90 text-amber-300 border-amber-500/80 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.35)] ring-1 ring-amber-500/50 font-black",
      iconClass: "text-amber-400"
    };
  }

  if (diffDays === 1) {
    return {
      hasDeadline: true,
      rawDate: deadline,
      formattedDate,
      diffDays,
      status: "urgent",
      label: `Besok (Sisa 1 hari)`,
      badgeClass: "bg-amber-950/80 text-amber-300 border-amber-500/60 font-bold",
      iconClass: "text-amber-400"
    };
  }

  if (diffDays <= 3) {
    return {
      hasDeadline: true,
      rawDate: deadline,
      formattedDate,
      diffDays,
      status: "soon",
      label: `Sisa ${diffDays} hari (${formattedDate})`,
      badgeClass: "bg-amber-950/60 text-amber-200 border-amber-500/40 font-bold",
      iconClass: "text-amber-400"
    };
  }

  return {
    hasDeadline: true,
    rawDate: deadline,
    formattedDate,
    diffDays,
    status: "upcoming",
    label: `Sisa ${diffDays} hari (${formattedDate})`,
    badgeClass: "bg-slate-900/90 text-sky-300 border-sky-500/30 font-medium",
    iconClass: "text-sky-400"
  };
};

interface HalalReadinessTrackerProps {
  language: Language;
  onNavigateTab: (tab: TabType) => void;
  businessName: string;
  items?: HalalChecklistItem[];
  onToggleItem?: (id: string) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  onUpdateDeadline?: (id: string, deadline?: string) => void;
  onOpenPdfReport?: () => void;
  onDownloadPdf?: () => void;
  onShowToast?: (msg: string) => void;
}

export const HalalReadinessTracker: React.FC<HalalReadinessTrackerProps> = ({
  language,
  onNavigateTab,
  businessName,
  items: externalItems,
  onToggleItem: externalToggleItem,
  onUpdateNotes: externalUpdateNotes,
  onUpdateDeadline: externalUpdateDeadline,
  onOpenPdfReport,
  onDownloadPdf,
  onShowToast,
}) => {
  const [internalItems, setInternalItems] = useState<HalalChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem("tk_halal_checklist_items");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const savedMap = new Map(parsed.map((item: HalalChecklistItem) => [item.id, item]));
          return initialHalalChecklist.map((initialItem) => {
            const savedItem = savedMap.get(initialItem.id);
            if (savedItem) {
              return {
                ...initialItem,
                checked: typeof savedItem.checked === "boolean" ? savedItem.checked : initialItem.checked,
                deadline: savedItem.deadline !== undefined ? savedItem.deadline : initialItem.deadline,
                notes: savedItem.notes !== undefined ? savedItem.notes : initialItem.notes,
                notesUpdatedAt: savedItem.notesUpdatedAt || initialItem.notesUpdatedAt,
              };
            }
            return initialItem;
          });
        }
      }
    } catch (e) {
      console.error("Gagal memuat data checklist halal dari localStorage", e);
    }
    return initialHalalChecklist;
  });

  const items = externalItems || internalItems;

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<HalalStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [csvDownloadSuccess, setCsvDownloadSuccess] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  
  // Custom notes state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingNotesText, setEditingNotesText] = useState<string>("");

  // Deadline state
  const [editingDeadlineToId, setEditingDeadlineToId] = useState<string | null>(null);
  const [customDeadlineInput, setCustomDeadlineInput] = useState<string>("");

  const toggleItem = (id: string) => {
    if (externalToggleItem) {
      externalToggleItem(id);
    } else {
      setInternalItems((prev) => {
        const updated = prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it));
        try {
          localStorage.setItem("tk_halal_checklist_items", JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }
  };

  const handleSaveNotes = (id: string, notes: string) => {
    if (externalUpdateNotes) {
      externalUpdateNotes(id, notes);
    } else {
      setInternalItems((prev) => {
        const updated = prev.map((it) =>
          it.id === id
            ? { ...it, notes, notesUpdatedAt: new Date().toISOString() }
            : it
        );
        try {
          localStorage.setItem("tk_halal_checklist_items", JSON.stringify(updated));
        } catch (e) {
          console.error("Gagal menyimpan catatan checklist halal ke localStorage", e);
        }
        return updated;
      });
    }

    setEditingItemId(null);
    setEditingNotesText("");
    if (onShowToast) {
      onShowToast(notes ? "Catatan butir checklist berhasil disimpan!" : "Catatan dihapus.");
    }
  };

  const handleSaveDeadline = (id: string, deadline?: string) => {
    if (externalUpdateDeadline) {
      externalUpdateDeadline(id, deadline);
    } else {
      setInternalItems((prev) => {
        const updated = prev.map((it) => (it.id === id ? { ...it, deadline } : it));
        try {
          localStorage.setItem("tk_halal_checklist_items", JSON.stringify(updated));
        } catch (e) {
          console.error("Gagal menyimpan deadline ke localStorage", e);
        }
        return updated;
      });
    }

    setEditingDeadlineToId(null);
    setCustomDeadlineInput("");
    if (onShowToast) {
      onShowToast(deadline ? `Target deadline berhasil disimpan: ${deadline}` : "Target deadline telah dihapus.");
    }
  };

  const startEditingNotes = (id: string, currentNotes: string) => {
    setEditingItemId(id);
    setEditingNotesText(currentNotes);
  };

  const totalItems = items.length;
  const checkedItems = items.filter((it) => it.checked).length;
  const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  const remainingItems = totalItems - checkedItems;

  const mandatoryItems = items.filter((it) => it.required);
  const checkedMandatory = mandatoryItems.filter((it) => it.checked).length;
  const mandatoryFulfilled = checkedMandatory === mandatoryItems.length;

  const itemsWithNotes = items.filter((it) => !!it.notes && it.notes.trim().length > 0);
  const itemsWithDeadline = items.filter((it) => !!it.deadline);

  const overdueItems = items.filter((it) => {
    if (it.checked || !it.deadline) return false;
    const info = getDeadlineInfo(it.deadline, it.checked);
    return info && info.status === "overdue";
  });

  const urgentItems = items.filter((it) => {
    if (it.checked || !it.deadline) return false;
    const info = getDeadlineInfo(it.deadline, it.checked);
    return info && (info.status === "due_today" || info.status === "urgent" || info.status === "soon");
  });

  // Calculate Halal items audit for 48h pending check
  const pendingAudit = useMemo(() => {
    return auditPendingHalalItems(items, 48);
  }, [items]);

  const filteredItems = items.filter((it) => {
    if (filterStatus === "completed" && !it.checked) return false;
    if (filterStatus === "incomplete" && it.checked) return false;
    if (filterStatus === "mandatory" && !it.required) return false;
    if (filterStatus === "has_notes" && (!it.notes || !it.notes.trim())) return false;
    if (filterStatus === "has_deadline" && !it.deadline) return false;
    if (filterStatus === "pending_48h") {
      if (it.checked) return false;
      const pendingTimestamp = it.pendingSince
        ? new Date(it.pendingSince).getTime()
        : Date.now() - 52 * 3600 * 1000;
      const diffHours = (Date.now() - pendingTimestamp) / (3600 * 1000);
      if (diffHours < 48) return false;
    }

    if (filterCategory !== "all" && it.category !== filterCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = it.title.toLowerCase().includes(q);
      const matchDesc = it.desc.toLowerCase().includes(q);
      const matchCat = it.category.toLowerCase().includes(q);
      const matchNotes = it.notes ? it.notes.toLowerCase().includes(q) : false;
      const matchDeadline = it.deadline ? it.deadline.includes(q) : false;
      if (!matchTitle && !matchDesc && !matchCat && !matchNotes && !matchDeadline) return false;
    }

    return true;
  });

  const categoryMetadataMap: Record<string, { label: string; desc: string; icon: React.ElementType; color: string }> = {
    "Bahan Baku": {
      label: "Bahan Baku",
      desc: "Kehalalan bahan baku hewani, bumbu olahan, dan bahan tambahan pangan (BTP).",
      icon: Package,
      color: "emerald",
    },
    "Bahan": {
      label: "Bahan Baku",
      desc: "Kehalalan bahan baku hewani, bumbu olahan, dan bahan tambahan pangan (BTP).",
      icon: Package,
      color: "emerald",
    },
    "Proses Produksi": {
      label: "Proses Produksi",
      desc: "Alur pengolahan makanan, manual SJPH, dan pencegahan kontaminasi silang.",
      icon: Activity,
      color: "cyan",
    },
    "Prosedur": {
      label: "Proses Produksi",
      desc: "Alur pengolahan makanan, manual SJPH, dan pencegahan kontaminasi silang.",
      icon: Activity,
      color: "cyan",
    },
    "Peralatan": {
      label: "Peralatan",
      desc: "Wadah, pisau, talenan, sanitasi, dan chiller terbebas dari paparan najis.",
      icon: UtensilsCrossed,
      color: "amber",
    },
    "Fasilitas": {
      label: "Peralatan",
      desc: "Wadah, pisau, talenan, sanitasi, dan chiller terbebas dari paparan najis.",
      icon: UtensilsCrossed,
      color: "amber",
    },
    "Legalitas & Personel": {
      label: "Legalitas & Personel",
      desc: "Perizinan NIB berbasis risiko OSS RBA dan penetapan Penyelia Halal internal.",
      icon: ShieldCheck,
      color: "indigo",
    },
    "Legalitas": {
      label: "Legalitas Usaha",
      desc: "Perizinan NIB berbasis risiko OSS RBA dengan KBLI industri kuliner yang sesuai.",
      icon: ShieldCheck,
      color: "indigo",
    },
    "Personel": {
      label: "Penyelia Halal",
      desc: "Penetapan staf/pemilik beragama Islam pemegang SK Penyelia Halal internal.",
      icon: Users,
      color: "purple",
    },
  };

  const preferredCategoryOrder = [
    "Bahan Baku",
    "Proses Produksi",
    "Peralatan",
    "Legalitas & Personel",
    "Legalitas",
    "Personel",
    "Bahan",
    "Fasilitas",
    "Prosedur",
  ];

  const presentCategories: string[] = Array.from(new Set(items.map((it) => it.category as string)));
  const orderedCategories: string[] = [
    ...preferredCategoryOrder.filter((cat) => presentCategories.includes(cat)),
    ...presentCategories.filter((cat) => !preferredCategoryOrder.includes(cat)),
  ];

  const categoryStats = orderedCategories.map((catKey) => {
    const catItems = items.filter((it) => it.category === catKey);
    const catChecked = catItems.filter((it) => it.checked).length;
    const catPct = catItems.length > 0 ? Math.round((catChecked / catItems.length) * 100) : 0;
    const meta = categoryMetadataMap[catKey] || {
      label: catKey,
      desc: `Checklist persiapan ${catKey}`,
      icon: Package,
      color: "emerald",
    };
    return {
      key: catKey,
      label: meta.label,
      desc: meta.desc,
      icon: meta.icon,
      color: meta.color,
      total: catItems.length,
      checked: catChecked,
      pct: catPct,
    };
  });

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const expandAllCategories = () => {
    setCollapsedCategories({});
  };

  const collapseAllCategories = () => {
    const allCollapsed: Record<string, boolean> = {};
    orderedCategories.forEach((cat) => {
      allCollapsed[cat] = true;
    });
    setCollapsedCategories(allCollapsed);
  };

  const handleToggleCategoryAll = (catKey: string, targetChecked: boolean) => {
    const targetItems = items.filter((it) => it.category === catKey && it.checked !== targetChecked);
    if (externalToggleItem) {
      targetItems.forEach((it) => externalToggleItem(it.id));
    } else {
      setInternalItems((prev) =>
        prev.map((it) => (it.category === catKey ? { ...it, checked: targetChecked } : it))
      );
    }
  };

  const handleExportCsv = () => {
    try {
      const fileName = downloadHalalChecklistCsv(items, businessName);
      setCsvDownloadSuccess(true);
      setTimeout(() => setCsvDownloadSuccess(false), 3000);
      if (onShowToast) {
        onShowToast(`File CSV "${fileName}" berhasil diekspor untuk pembukuan luring!`);
      }
    } catch (err) {
      console.error("Gagal mengekspor CSV:", err);
      if (onShowToast) {
        onShowToast("Terjadi kendala saat mengekspor data CSV.");
      }
    }
  };

  const handleDownloadTemplate = () => {
    const sjphContent = `MANUAL SISTEM JAMINAN PRODUK HALAL (SJPH) UMKM KULINER
Nama Usaha: ${businessName}
Status Dokumen: Draft Resmi Standar BPJPH Kemenag RI
Tanggal: ${new Date().toLocaleDateString("id-ID")}

1. KOMITMEN KEBIJAKAN HALAL
Kami berkomitmen secara konsisten hanya memproduksi makanan halal dan thayyib sesuai syariat Islam.

2. PENYELIA HALAL
Telah ditunjuk Penyelia Halal internal yang mengawasi alur pengadaan bahan, pencucian alat, dan pengemasan produk.

3. DAFTAR BAHAN HALAL
Semua bahan olahan daging dan bumbu kemasan wajib memiliki ID Sertifikat Halal BPJPH/MUI yang masih berlaku.`;

    const blob = new Blob([sjphContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Template_SJPH_${businessName.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Modul 4 • Audit Mandiri Kepatuhan Regulasi Halal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Pelacak Kesiapan Sertifikasi Halal (SJPH & SIHALAL)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Persiapkan dokumen dan dapur usaha <span className="font-semibold text-white">{businessName}</span> untuk mendaftar sertifikasi halal resmi di BPJPH Kemenag RI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {(onOpenPdfReport || onDownloadPdf) && (
            <button
              onClick={onOpenPdfReport || onDownloadPdf}
              className="px-3.5 py-2 rounded-lg font-bold text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5 transition-all shadow-sm"
              title="Unduh Resume Resmi Laporan (Format PDF atau Excel)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Unduh Laporan (PDF/Excel)</span>
            </button>
          )}

          <button
            id="btn-export-halal-csv"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg font-bold text-xs bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 transition-all shadow-sm"
            title="Ekspor Data Checklist Kesiapan Halal ke format CSV untuk arsip offline & Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{csvDownloadSuccess ? "CSV Berhasil Diunduh ✓" : "Ekspor CSV Checklist"}</span>
          </button>

          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-2 rounded-lg font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Draft Manual SJPH</span>
          </button>

          <a
            href="https://ptsp.halal.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <span>Portal SIHALAL BPJPH</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Top Prominent Search Bar */}
      <div 
        id="halal-readiness-top-search-section"
        className="bg-[#16191F] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3.5 transition-all focus-within:border-emerald-500/50"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Pencarian Butir Checklist Kesiapan Halal
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Cari syarat audit, dokumen, peralatan, atau bahan baku di semua kategori secara instan.
              </p>
            </div>
          </div>

          {searchQuery.trim() && (
            <div className="flex items-center space-x-2 text-xs self-start sm:self-center">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px]">
                {filteredItems.length} dari {totalItems} butir cocok
              </span>
              <button
                id="btn-clear-top-search"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-white hover:underline flex items-center space-x-1 text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800"
                title="Hapus kata kunci pencarian"
              >
                <RotateCcw className="w-3 h-3 text-emerald-400" />
                <span>Reset</span>
              </button>
            </div>
          )}
        </div>

        {/* Search Input Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className={`w-4 h-4 transition-colors ${searchQuery.trim() ? "text-emerald-400" : "text-slate-500"}`} />
          </div>
          <input
            id="top-halal-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari butir checklist (contoh: 'sertifikat', 'penyelia', 'manual SJPH', 'chiller', 'pisau', 'BTP', 'NIB')..."
            className="w-full pl-10 pr-24 sm:pr-28 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-all shadow-inner"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center space-x-1.5">
            {searchQuery ? (
              <button
                id="btn-clear-search-query-top"
                onClick={() => setSearchQuery("")}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Hapus kata kunci"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center text-[10px] text-slate-400 bg-slate-800/90 border border-slate-700/70 px-2 py-0.5 rounded font-mono">
                Pencarian Cepat
              </span>
            )}
          </div>
        </div>

        {/* Quick Keyword Suggestion Tags */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Topik Populer:
          </span>
          {[
            "Bahan Kritis",
            "Penyelia Halal",
            "Manual SJPH",
            "Pemisahan Alat",
            "BTP & Perisa",
            "Sanitasi",
            "Chiller",
            "NIB OSS",
          ].map((tag) => {
            const isSelected = searchQuery.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                id={`btn-search-tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                onClick={() => setSearchQuery(isSelected ? "" : tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 flex items-center space-x-1 ${
                  isSelected
                    ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-xs"
                    : "bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                }`}
                title={`Cari butir yang berhubungan dengan "${tag}"`}
              >
                <span>{tag}</span>
                {isSelected && <X className="w-2.5 h-2.5 ml-0.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Progress Bar & Readiness Gauge */}
      <div 
        id="halal-readiness-progress-section"
        className="bg-[#16191F] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5"
      >
        {/* Top Header: Progress Overview & Live Metrics */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Indeks Kesiapan Sertifikasi Halal BPJPH
              </h3>
              {progressPercent === 100 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center space-x-1 animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  <span>100% Siap Audit</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Checklist mandiri pemenuhan Standar Jaminan Produk Halal (SJPH) untuk jalur self-declare / reguler SIHALAL.
            </p>
          </div>

          {/* Metric Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Percentage Display Pill */}
            <div 
              id="halal-progress-percentage-pill"
              className={`px-3.5 py-1.5 rounded-xl border flex items-center space-x-2 shadow-xs transition-colors ${
                progressPercent === 100
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : progressPercent >= 75
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : progressPercent >= 40
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Kesiapan</div>
                <div className="text-xl font-black font-mono leading-none">
                  {progressPercent}%
                </div>
              </div>
            </div>

            {/* Total Count Pill */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Item Terpenuhi</div>
              <div className="text-sm font-bold font-mono">
                <span className="text-white font-bold">{checkedItems}</span>
                <span className="text-slate-500">/{totalItems}</span>
                <span className="text-[10px] text-slate-400 ml-1 font-sans">
                  ({remainingItems === 0 ? "Lengkap" : `${remainingItems} tersisa`})
                </span>
              </div>
            </div>

            {/* Mandatory Criteria Pill */}
            <div className={`px-3 py-1.5 rounded-xl border ${
              mandatoryFulfilled 
                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                : "bg-slate-900 border-slate-800 text-slate-300"
            }`}>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Syarat Mandatori</div>
              <div className="text-sm font-bold font-mono flex items-center space-x-1">
                {mandatoryFulfilled ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {checkedMandatory}/{mandatoryItems.length} Terpenuhi
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {checkedMandatory}/{mandatoryItems.length} Wajib
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Component with Checkpoints */}
        <div className="space-y-2">
          {/* Main Visual Progress Track */}
          <div 
            id="halal-progress-track"
            className="relative w-full h-4 bg-slate-900/90 rounded-full p-0.5 border border-slate-700/60 overflow-hidden shadow-inner"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Kesiapan Sertifikasi Halal ${progressPercent}%`}
          >
            {/* Background subtle guide lines at 25%, 50%, 75% */}
            <div className="absolute inset-0 flex justify-between px-[25%] pointer-events-none opacity-20">
              <div className="w-px h-full bg-slate-400" />
              <div className="w-px h-full bg-slate-400" />
            </div>

            {/* Active Filled Bar with dynamic gradient */}
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out relative ${
                progressPercent === 100
                  ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-md shadow-emerald-500/30"
                  : progressPercent >= 75
                  ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400"
                  : progressPercent >= 40
                  ? "bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-400"
                  : "bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400"
              }`}
              style={{ width: `${Math.max(progressPercent, progressPercent > 0 ? 3 : 0)}%` }}
            >
              {/* Highlight line on top edge for tactile 3D effect */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-white/30 rounded-t-full" />
            </div>
          </div>

          {/* Stepper Milestones Indicators below bar */}
          <div className="grid grid-cols-4 text-[10px] sm:text-[11px] text-slate-500 pt-0.5">
            <div className="text-left">
              <span className={`font-semibold ${progressPercent >= 0 ? "text-slate-300" : ""}`}>0% Mulai</span>
            </div>
            <div className="text-center">
              <span className={`font-semibold ${progressPercent >= 25 ? "text-emerald-400" : ""}`}>
                25% Bahan & Dapur
              </span>
            </div>
            <div className="text-center">
              <span className={`font-semibold ${progressPercent >= 50 ? "text-emerald-400" : ""}`}>
                50% Fasilitas Bersih
              </span>
            </div>
            <div className="text-right">
              <span className={`font-semibold ${progressPercent >= 80 ? "text-emerald-400 font-bold" : ""}`}>
                {progressPercent === 100 ? "100% Siap SIHALAL ✓" : "80%+ Ambang Batas"}
              </span>
            </div>
          </div>
        </div>

        {/* Category Breakdown Progress Chips */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Cakupan Pemenuhan Berdasarkan Kategori:
            </span>
            <span className="text-[10px] text-slate-500">
              Klik kategori untuk memfilter butir checklist
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {categoryStats.map((cat) => {
              const isFull = cat.pct === 100;
              const isSelected = filterCategory === cat.key;
              const CatIcon = cat.icon || Package;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    const nextCat = isSelected ? "all" : cat.key;
                    setFilterCategory(nextCat);
                    if (nextCat !== "all") {
                      setCollapsedCategories((prev) => ({ ...prev, [nextCat]: false }));
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-slate-800 border-emerald-500/50 ring-1 ring-emerald-500/30"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  }`}
                  title={`Filter kategori ${cat.label}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <CatIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-300 truncate">
                        {cat.label}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${
                      isFull ? "text-emerald-400" : cat.pct > 0 ? "text-cyan-400" : "text-slate-500"
                    }`}>
                      {cat.pct}%
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull 
                          ? "bg-emerald-400" 
                          : cat.pct > 0 
                          ? "bg-cyan-500" 
                          : "bg-slate-700"
                      }`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{cat.checked}/{cat.total} butir</span>
                    {isFull && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Readiness Verdict Banner */}
        <div className={`p-3 rounded-xl border flex items-center justify-between flex-wrap gap-2 ${
          progressPercent >= 80 && mandatoryFulfilled
            ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
            : "bg-amber-950/20 border-amber-500/30 text-amber-300"
        }`}>
          <div className="flex items-center space-x-2.5">
            {progressPercent >= 80 && mandatoryFulfilled ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold block">
                {progressPercent >= 80 && mandatoryFulfilled
                  ? "Kelayakan BPJPH: Siap untuk Pengajuan Akun SIHALAL"
                  : "Kelayakan BPJPH: Masih Memerlukan Pemenuhan Persyaratan Kritis"}
              </span>
              <p className="text-[11px] text-slate-400">
                {progressPercent >= 80 && mandatoryFulfilled
                  ? "Seluruh persyaratan mandatori terpenuhi. Anda dapat melanjutkan pendaftaran self-declare di portal PTSP Halal."
                  : "Lengkapi minimal 80% checklist dan seluruh persyaratan bertanda *Mandatori sebelum menjadwalkan audit pendampingan."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
              Skor Kesiapan: {progressPercent}/100
            </span>
          </div>
        </div>

        {/* Deadline & Reminder Summary Card */}
        {itemsWithDeadline.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <CalendarClock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center flex-wrap gap-2 text-xs font-bold text-white">
                  <span>Jadwal & Deadline Butir Penting</span>
                  {overdueItems.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-extrabold animate-pulse">
                      {overdueItems.length} Terlewat!
                    </span>
                  )}
                  {urgentItems.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                      {urgentItems.length} Mendekati Deadline
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {itemsWithDeadline.length} Butir Ber-Deadline
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Pantau sisa waktu penyelesaian dokumen kritis sebelum batas waktu audit sertifikasi halal.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
              <button
                type="button"
                id="btn-quick-filter-deadline"
                onClick={() => setFilterStatus(filterStatus === "has_deadline" ? "all" : "has_deadline")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center space-x-1.5 shadow-xs ${
                  filterStatus === "has_deadline"
                    ? "bg-amber-500 text-slate-950 border-amber-400"
                    : "bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30 hover:border-amber-500/60"
                }`}
              >
                <CalendarClock className="w-3.5 h-3.5" />
                <span>{filterStatus === "has_deadline" ? "Tampilkan Semua" : "Lihat Butir Ber-Deadline"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scheduled Notification System Card (Web Notification API) */}
      <HalalScheduledReminderCard
        businessName={businessName}
        items={items}
        onToggleItem={toggleItem}
        onFilterOverdue={() => setFilterStatus("pending_48h")}
        onShowToast={onShowToast}
        onNavigateTab={onNavigateTab}
      />

      {/* Comprehensive Filter Controls Deck */}
      <div 
        id="halal-checklist-filter-deck"
        className="bg-[#16191F] p-4 rounded-xl border border-slate-800 shadow-md space-y-3"
      >
        {/* Row 1: Status Filters + Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status / Priority Filter Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filter Status:</span>
            </span>

            {/* Filter: Semua */}
            <button
              id="filter-status-all"
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                filterStatus === "all"
                  ? "bg-slate-700 text-white shadow-xs border border-slate-600"
                  : "bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              <span>Semua</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filterStatus === "all" ? "bg-slate-600 text-white" : "bg-slate-800 text-slate-400"
              }`}>
                {totalItems}
              </span>
            </button>

            {/* Filter: Selesai */}
            <button
              id="filter-status-completed"
              onClick={() => setFilterStatus("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                filterStatus === "completed"
                  ? "bg-emerald-600 text-white shadow-xs border border-emerald-500"
                  : "bg-slate-900/90 text-slate-400 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Selesai</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filterStatus === "completed" ? "bg-emerald-700 text-white" : "bg-slate-800 text-emerald-400"
              }`}>
                {checkedItems}
              </span>
            </button>

            {/* Filter: Belum Selesai */}
            <button
              id="filter-status-incomplete"
              onClick={() => setFilterStatus("incomplete")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                filterStatus === "incomplete"
                  ? "bg-amber-600 text-white shadow-xs border border-amber-500"
                  : "bg-slate-900/90 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Belum Selesai</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filterStatus === "incomplete" ? "bg-amber-700 text-white" : "bg-slate-800 text-amber-400"
              }`}>
                {remainingItems}
              </span>
            </button>

            {/* Filter: Penting (Mandatori) */}
            <button
              id="filter-status-mandatory"
              onClick={() => setFilterStatus("mandatory")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                filterStatus === "mandatory"
                  ? "bg-amber-500 text-slate-950 shadow-xs border border-amber-400 font-extrabold"
                  : "bg-slate-900/90 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40"
              }`}
              title="Tampilkan hanya butir bertanda Penting (Mandatori BPJPH)"
            >
              <Flag className={`w-3.5 h-3.5 ${filterStatus === "mandatory" ? "text-slate-950 fill-slate-950" : "text-amber-400 fill-amber-400/30"}`} />
              <span>Penting</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                filterStatus === "mandatory" ? "bg-slate-900 text-amber-400" : "bg-slate-800 text-amber-400"
              }`}>
                {mandatoryItems.length}
              </span>
            </button>

            {/* Filter: Memiliki Catatan */}
            <button
              id="filter-status-has-notes"
              onClick={() => setFilterStatus("has_notes")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                filterStatus === "has_notes"
                  ? "bg-sky-600 text-white shadow-xs border border-sky-500 font-extrabold"
                  : "bg-slate-900/90 text-slate-400 hover:text-sky-300 border border-slate-800 hover:border-sky-500/40"
              }`}
              title="Tampilkan butir yang memiliki catatan atau komentar audit"
            >
              <MessageSquare className={`w-3.5 h-3.5 ${filterStatus === "has_notes" ? "text-white" : "text-sky-400"}`} />
              <span>Catatan</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                filterStatus === "has_notes" ? "bg-slate-900 text-sky-300" : "bg-slate-800 text-sky-400"
              }`}>
                {itemsWithNotes.length}
              </span>
            </button>

            {/* Filter: Memiliki Deadline */}
            <button
              id="filter-status-has-deadline"
              onClick={() => setFilterStatus("has_deadline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                filterStatus === "has_deadline"
                  ? "bg-amber-500 text-slate-950 shadow-xs border border-amber-400 font-extrabold"
                  : "bg-slate-900/90 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40"
              }`}
              title="Tampilkan butir yang memiliki target tanggal deadline"
            >
              <CalendarClock className={`w-3.5 h-3.5 ${filterStatus === "has_deadline" ? "text-slate-950" : "text-amber-400"}`} />
              <span>Deadline</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                filterStatus === "has_deadline" ? "bg-slate-900 text-amber-400" : "bg-slate-800 text-amber-400"
              }`}>
                {itemsWithDeadline.length}
              </span>
            </button>

            {/* Filter: Tertunda > 48 Jam */}
            <button
              id="filter-status-pending-48h"
              onClick={() => setFilterStatus(filterStatus === "pending_48h" ? "all" : "pending_48h")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                filterStatus === "pending_48h"
                  ? "bg-rose-600 text-white shadow-xs border border-rose-500 font-extrabold"
                  : "bg-slate-900/90 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40"
              }`}
              title="Tampilkan butir checklist yang tertunda lebih dari 48 jam"
            >
              <BellRing className={`w-3.5 h-3.5 ${filterStatus === "pending_48h" ? "text-white" : "text-rose-400"}`} />
              <span>Tertunda &gt; 48 Jam</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                filterStatus === "pending_48h" ? "bg-slate-900 text-rose-300" : "bg-slate-800 text-rose-400"
              }`}>
                {pendingAudit.totalOverdue}
              </span>
            </button>
          </div>

          {/* Search Box & CSV Download */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-halal-items"
                type="text"
                placeholder="Cari butir checklist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  title="Hapus kata kunci pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              id="btn-quick-export-csv"
              onClick={handleExportCsv}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-xs shrink-0"
              title="Download file CSV checklist ini untuk Microsoft Excel / Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Unduh CSV</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category Filter Pills & Live Result Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Kategori:
            </span>
            {["all", ...orderedCategories].map((cat) => {
              const meta = categoryMetadataMap[cat];
              const label = cat === "all" ? "Semua Kategori" : meta?.label || cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    if (cat !== "all") {
                      setCollapsedCategories((prev) => ({ ...prev, [cat]: false }));
                    }
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all shrink-0 ${
                    filterCategory === cat
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-xs"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 shrink-0">
            <span className="text-[11px]">
              Menampilkan <strong className="text-white">{filteredItems.length}</strong> dari {totalItems} butir
            </span>

            {(filterStatus !== "all" || filterCategory !== "all" || searchQuery !== "") && (
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterCategory("all");
                  setSearchQuery("");
                }}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-medium flex items-center space-x-1 ml-1"
                title="Reset semua filter ke kondisi awal"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Categories Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        <div className="flex items-center space-x-2">
          <FolderOpen className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Daftar Butir Kesiapan Berdasarkan Kategori
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            {orderedCategories.filter((cat) => filteredItems.some((it) => it.category === cat)).length} Kategori
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            id="btn-expand-all-categories"
            onClick={expandAllCategories}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium flex items-center space-x-1.5 transition-all text-xs"
            title="Buka semua kategori checklist"
          >
            <ChevronsUpDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Buka Semua</span>
          </button>
          <button
            id="btn-collapse-all-categories"
            onClick={collapseAllCategories}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium flex items-center space-x-1.5 transition-all text-xs"
            title="Tutup semua kategori checklist"
          >
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            <span>Tutup Semua</span>
          </button>
        </div>
      </div>

      {/* Collapsible Category Sections or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3.5">
          {orderedCategories
            .filter((catKey) => filteredItems.some((it) => it.category === catKey))
            .map((catKey) => {
              const catItemsInFilter = filteredItems.filter((it) => it.category === catKey);
              const catAllItems = items.filter((it) => it.category === catKey);
              const catCheckedCount = catAllItems.filter((it) => it.checked).length;
              const catPct = catAllItems.length > 0 ? Math.round((catCheckedCount / catAllItems.length) * 100) : 0;
              const isCategoryFullyChecked = catAllItems.length > 0 && catCheckedCount === catAllItems.length;
              
              const catMandatoryItems = catAllItems.filter((it) => it.required);
              const catMandatoryChecked = catMandatoryItems.filter((it) => it.checked).length;
              const isCatMandatoryFulfilled = catMandatoryItems.length === 0 || catMandatoryChecked === catMandatoryItems.length;

              const isCollapsed = searchQuery.trim() ? false : !!collapsedCategories[catKey];
              const meta = categoryMetadataMap[catKey] || {
                label: catKey,
                desc: `Daftar persyaratan kesiapan ${catKey}`,
                icon: Package,
                color: "emerald",
              };
              const CatIcon = meta.icon;

              return (
                <div
                  key={catKey}
                  id={`category-section-${catKey.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  className="rounded-xl border border-slate-800/90 bg-[#16191F] overflow-hidden shadow-md transition-all"
                >
                  {/* Category Collapsible Header */}
                  <div
                    onClick={() => toggleCategoryCollapse(catKey)}
                    className="p-3.5 sm:p-4 cursor-pointer select-none bg-slate-900/60 hover:bg-slate-900/90 border-b border-slate-800/80 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Icon, Title & Meta */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <button
                          type="button"
                          className="p-1 rounded-md text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700/60 shrink-0"
                          title={isCollapsed ? "Buka kategori ini" : "Tutup kategori ini"}
                          aria-expanded={!isCollapsed}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isCollapsed ? "-rotate-90 text-slate-500" : "rotate-0 text-emerald-400"
                            }`}
                          />
                        </button>

                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isCategoryFullyChecked
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}>
                          <CatIcon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h4 className="text-sm font-bold text-white tracking-tight">
                              {meta.label}
                            </h4>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              {catItemsInFilter.length} {catItemsInFilter.length === catAllItems.length ? "butir" : `dari ${catAllItems.length} butir`}
                            </span>
                            {searchQuery.trim() && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {catItemsInFilter.length} cocok
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate hidden sm:block">
                            {meta.desc}
                          </p>
                        </div>
                      </div>

                      {/* Right: Badges, Progress & Quick Actions */}
                      <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-center">
                        {/* Status Badges */}
                        {isCategoryFullyChecked ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Lengkap (100%)</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold">
                            {catCheckedCount}/{catAllItems.length} Selesai ({catPct}%)
                          </span>
                        )}

                        {!isCatMandatoryFulfilled && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-950/50 border border-rose-500/40 text-rose-300 text-[10px] font-bold flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3 text-rose-400" />
                            <span className="hidden md:inline">Mandatori Pending</span>
                          </span>
                        )}

                        {/* Quick Toggle All Items in Category */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCategoryAll(catKey, !isCategoryFullyChecked);
                          }}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center space-x-1 ${
                            isCategoryFullyChecked
                              ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700"
                              : "bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50"
                          }`}
                          title={isCategoryFullyChecked ? "Batalkan semua centang di kategori ini" : "Centang semua butir di kategori ini"}
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span className="hidden sm:inline">
                            {isCategoryFullyChecked ? "Batal Semua" : "Selesaikan Semua"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Category Mini Progress Line */}
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-2.5">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isCategoryFullyChecked
                            ? "bg-emerald-400"
                            : catPct > 0
                            ? "bg-emerald-500/80"
                            : "bg-slate-800"
                        }`}
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Category Body: Checklist Items Grid */}
                  {!isCollapsed && (
                    <div className="p-3.5 sm:p-4 bg-slate-950/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {catItemsInFilter.map((item) => {
                          const isPenting = item.required;
                          return (
                            <div
                              key={item.id}
                              id={`checklist-item-${item.id}`}
                              onClick={() => toggleItem(item.id)}
                              className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                                isPenting
                                  ? item.checked
                                    ? "bg-slate-900/90 border-l-4 border-l-emerald-500 border-emerald-500/30 hover:border-emerald-500/50 shadow-xs"
                                    : "bg-gradient-to-r from-amber-500/10 via-[#171a22] to-[#16191F] border-l-4 border-l-amber-500 border-amber-500/40 hover:border-amber-400/70 shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20"
                                  : item.checked
                                  ? "bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/50"
                                  : "bg-[#16191F] border-slate-800 hover:border-slate-700"
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {item.checked ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                                ) : isPenting ? (
                                  <Square className="w-4 h-4 text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-600" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1.5 flex-wrap mb-1">
                                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                      {meta.label}
                                    </span>

                                    {isPenting ? (
                                      <span
                                        className={`inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md border shadow-xs transition-colors ${
                                          item.checked
                                            ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                                            : "bg-amber-950/90 border-amber-500/70 text-amber-300 ring-1 ring-amber-500/30"
                                        }`}
                                        title="Item bertanda Penting (Wajib Mandatori). Syarat mutlak kelulusan audit sertifikasi halal BPJPH."
                                      >
                                        <Flag
                                          className={`w-3 h-3 ${
                                            item.checked
                                              ? "text-emerald-400 fill-emerald-400/40"
                                              : "text-amber-400 fill-amber-400 animate-pulse"
                                          }`}
                                        />
                                        <span>{item.checked ? "Penting ✓" : "Penting"}</span>
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-medium text-slate-500 px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-800/80">
                                        Standar
                                      </span>
                                    )}

                                    {/* Badge Indikator Sisa Waktu Deadline (khusus item Penting) */}
                                    {isPenting && (() => {
                                      const deadlineInfo = getDeadlineInfo(item.deadline, item.checked);
                                      if (deadlineInfo) {
                                        return (
                                          <button
                                            type="button"
                                            id={`btn-deadline-badge-${item.id}`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingDeadlineToId(editingDeadlineToId === item.id ? null : item.id);
                                              setCustomDeadlineInput(item.deadline || "");
                                            }}
                                            className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all hover:scale-105 cursor-pointer shadow-xs ${deadlineInfo.badgeClass}`}
                                            title={`Target tanggal: ${deadlineInfo.formattedDate} (${item.deadline}). Sisa waktu: ${deadlineInfo.label}. Klik untuk atur tanggal target.`}
                                          >
                                            <CalendarClock className={`w-3 h-3 ${deadlineInfo.iconClass}`} />
                                            <span>{deadlineInfo.label}</span>
                                          </button>
                                        );
                                      } else {
                                        return (
                                          <button
                                            type="button"
                                            id={`btn-set-deadline-${item.id}`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingDeadlineToId(editingDeadlineToId === item.id ? null : item.id);
                                              setCustomDeadlineInput("");
                                            }}
                                            className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-400 hover:text-amber-300 border border-dashed border-slate-700 hover:border-amber-500/50 transition-colors cursor-pointer"
                                            title="Atur target deadline penyelesaian butir penting ini"
                                          >
                                            <Calendar className="w-3 h-3 text-slate-400" />
                                            <span>+ Set Deadline</span>
                                          </button>
                                        );
                                      }
                                    })()}

                                    {/* Badge Indikator Tertunda > 48 Jam */}
                                    {!item.checked && (() => {
                                      const pendingTimestamp = item.pendingSince
                                        ? new Date(item.pendingSince).getTime()
                                        : Date.now() - 52 * 3600 * 1000;
                                      const hours = Math.round(((Date.now() - pendingTimestamp) / (3600 * 1000)) * 10) / 10;
                                      if (hours >= 48) {
                                        return (
                                          <span
                                            className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/60 text-rose-300 font-mono shadow-xs"
                                            title={`Indikator ini belum diselesaikan selama ${hours} jam. Pengingat peramban terjadwal aktif.`}
                                          >
                                            <BellRing className="w-2.5 h-2.5 text-rose-400 animate-pulse" />
                                            <span>Tertunda &gt; 48 Jam ({hours}h)</span>
                                          </span>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>

                                  {isPenting && !item.checked && (
                                    <span className="text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30 flex items-center space-x-1">
                                      <AlertCircle className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                      <span>Prioritas Audit</span>
                                    </span>
                                  )}
                                </div>

                                <h4 className={`text-xs sm:text-sm font-bold leading-snug ${
                                  item.checked 
                                    ? "text-slate-300" 
                                    : isPenting 
                                    ? "text-white font-extrabold" 
                                    : "text-slate-100"
                                }`}>
                                  {item.title}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                  {item.desc}
                                </p>

                                {/* Deadline Editor Box for Important Items */}
                                {editingDeadlineToId === item.id && (
                                  <div
                                    id={`deadline-editor-${item.id}`}
                                    className="mt-3 p-3 rounded-xl bg-slate-950 border border-amber-500/60 ring-1 ring-amber-500/30 shadow-xl space-y-2.5 text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-amber-300 flex items-center space-x-1.5 text-[11px]">
                                        <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Target Tanggal Penyelesaian (Deadline Butir Penting)</span>
                                      </span>
                                      <span className="text-[10px] text-slate-400">Sinkronisasi Jadwal Audit</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                      <div className="relative flex-1">
                                        <input
                                          id={`input-deadline-date-${item.id}`}
                                          type="date"
                                          value={customDeadlineInput}
                                          onChange={(e) => setCustomDeadlineInput(e.target.value)}
                                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
                                        />
                                      </div>

                                      {/* Preset Shortcuts */}
                                      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                                        <span className="text-[10px] text-slate-500 shrink-0 mr-1">Pintasan:</span>
                                        {[
                                          { label: "+3 Hari", days: 3 },
                                          { label: "+7 Hari (1 Mgg)", days: 7 },
                                          { label: "+14 Hari (2 Mgg)", days: 14 },
                                          { label: "+30 Hari (1 Bln)", days: 30 },
                                        ].map((preset) => (
                                          <button
                                            key={preset.label}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const d = new Date();
                                              d.setDate(d.getDate() + preset.days);
                                              const iso = d.toISOString().split("T")[0];
                                              setCustomDeadlineInput(iso);
                                            }}
                                            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 text-[10px] font-medium whitespace-nowrap transition-colors"
                                          >
                                            {preset.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                                      <div>
                                        {item.deadline && (
                                          <button
                                            type="button"
                                            id={`btn-delete-deadline-${item.id}`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSaveDeadline(item.id, undefined);
                                            }}
                                            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center space-x-1 transition-colors"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                            <span>Hapus Deadline</span>
                                          </button>
                                        )}
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingDeadlineToId(null);
                                            setCustomDeadlineInput("");
                                          }}
                                          className="px-2.5 py-1 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                        >
                                          Batal
                                        </button>
                                        <button
                                          type="button"
                                          id={`btn-save-deadline-${item.id}`}
                                          disabled={!customDeadlineInput}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (customDeadlineInput) {
                                              handleSaveDeadline(item.id, customDeadlineInput);
                                            }
                                          }}
                                          className="px-3 py-1 rounded-md text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 flex items-center space-x-1.5 shadow-sm transition-colors"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                          <span>Simpan Target</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Custom Notes / Comments Section */}
                                {editingItemId === item.id ? (
                                  <div
                                    id={`note-editor-${item.id}`}
                                    className="mt-3 p-3 rounded-xl bg-slate-950/95 border border-emerald-500/50 text-xs space-y-2.5 ring-1 ring-emerald-500/20 shadow-xl"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1.5">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>{item.notes ? "Edit Catatan Butir" : "Tambah Catatan / Komentar"}</span>
                                      </span>
                                      <span className="text-[10px] text-slate-500">Tersimpan di sesi</span>
                                    </div>

                                    <textarea
                                      id={`textarea-notes-${item.id}`}
                                      value={editingNotesText}
                                      onChange={(e) => setEditingNotesText(e.target.value)}
                                      placeholder="Tuliskan catatan tindak lanjut audit, nomor sertifikat bahan, PIC, atau catatan supplier..."
                                      rows={2}
                                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-y min-h-[56px]"
                                      autoFocus
                                    />

                                    {/* Quick suggestion tags */}
                                    <div className="flex flex-wrap gap-1 items-center">
                                      <span className="text-[10px] text-slate-500 shrink-0">Pintasan:</span>
                                      {[
                                        "Sertifikat Halal Aktif",
                                        "Perlu Konfirmasi Supplier",
                                        "Dalam Proses SIHALAL",
                                        "SOP Terpasang",
                                        "PIC: Penyelia Halal"
                                      ].map((chip) => (
                                        <button
                                          key={chip}
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingNotesText((prev) => prev.trim() ? `${prev.trim()}. ${chip}` : chip);
                                          }}
                                          className="text-[10px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800 transition-colors"
                                        >
                                          + {chip}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-800">
                                      <span className="text-[10px] text-slate-500 font-mono">
                                        {editingNotesText.length} karakter
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <button
                                          type="button"
                                          id={`btn-cancel-note-${item.id}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingItemId(null);
                                            setEditingNotesText("");
                                          }}
                                          className="px-2.5 py-1 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                        >
                                          Batal
                                        </button>
                                        <button
                                          type="button"
                                          id={`btn-save-note-${item.id}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSaveNotes(item.id, editingNotesText.trim());
                                          }}
                                          className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 shadow-sm transition-colors"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                          <span>Simpan</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : item.notes && item.notes.trim() ? (
                                  <div
                                    id={`note-display-${item.id}`}
                                    className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs flex flex-col gap-1.5 transition-all hover:border-slate-700"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-between gap-1 flex-wrap">
                                      <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
                                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>Catatan Audit</span>
                                        {item.notesUpdatedAt && (
                                          <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">
                                            • {new Date(item.notesUpdatedAt).toLocaleDateString("id-ID", {
                                              day: "numeric",
                                              month: "short",
                                              hour: "2-digit",
                                              minute: "2-digit"
                                            })}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <button
                                          type="button"
                                          id={`btn-edit-note-${item.id}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEditingNotes(item.id, item.notes || "");
                                          }}
                                          className="px-2 py-0.5 rounded text-[11px] text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center space-x-1 transition-colors"
                                          title="Edit Catatan"
                                        >
                                          <Pencil className="w-3 h-3 text-emerald-400" />
                                          <span>Ubah</span>
                                        </button>
                                        <button
                                          type="button"
                                          id={`btn-delete-note-${item.id}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSaveNotes(item.id, "");
                                          }}
                                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                                          title="Hapus Catatan"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/60 p-2 rounded-md border border-slate-800/80">
                                      {item.notes}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="mt-2.5 flex items-center space-x-2 flex-wrap gap-y-1" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      id={`btn-add-note-${item.id}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditingNotes(item.id, "");
                                      }}
                                      className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center space-x-1.5 px-2 py-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
                                    >
                                      <MessageSquarePlus className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                      <span>Tambah Catatan / Komentar</span>
                                    </button>

                                    {isPenting && (
                                      <button
                                        type="button"
                                        id={`btn-manage-deadline-${item.id}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingDeadlineToId(editingDeadlineToId === item.id ? null : item.id);
                                          setCustomDeadlineInput(item.deadline || "");
                                        }}
                                        className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center space-x-1.5 px-2 py-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group"
                                      >
                                        <CalendarClock className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                                        <span>{item.deadline ? `Target: ${item.deadline}` : "+ Target Deadline"}</span>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        <div className="p-8 rounded-xl border border-slate-800 bg-[#16191F] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Filter className="w-5 h-5 text-slate-400" />
          </div>
          <h4 className="text-sm font-bold text-white">
            Tidak ada butir checklist yang sesuai
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tidak ditemukan indikator kesiapan halal dengan kombinasi filter saat ini.
            Coba pilih status lain atau reset filter untuk menampilkan semua butir checklist.
          </p>
          <button
            onClick={() => {
              setFilterStatus("all");
              setFilterCategory("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm inline-flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      )}

      {/* 5 Steps SIHALAL Guide Accordion / Timeline */}
      <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">
          5 Tahapan Pengajuan Sertifikasi Halal di BPJPH
        </h3>
        <p className="text-xs text-slate-400">
          Ikuti alur resmi dari pendaftaran portal hingga sertifikat halal terbit dan berlaku seumur hidup.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {[
            { step: "1", title: "Registrasi SIHALAL", desc: "Buat akun di ptsp.halal.go.id menggunakan NIB & email aktif usaha." },
            { step: "2", title: "Input Bahan & Menu", desc: "Ketik matriks komposisi bahan makanan & upload dokumen manual SJPH." },
            { step: "3", title: "Pilih LPH / Pendamping", desc: "Tunjuk Lembaga Pemeriksa Halal atau Pendamping PPH jalur self-declare." },
            { step: "4", title: "Audit Lapangan", desc: "Pemeriksaan kebersihan dapur & wawancara Penyelia Halal." },
            { step: "5", title: "Sidang Fatwa & Sertifikat", desc: "Komisi Fatwa MUI menetapkan kehalalan dan BPJPH menerbitkan sertifikat." }
          ].map((s) => (
            <div key={s.step} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center mb-2">
                {s.step}
              </span>
              <h4 className="text-xs font-bold text-white">
                {s.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
