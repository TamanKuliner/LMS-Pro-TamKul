import React, { useState, useEffect, useMemo } from "react";
import {
  Bell,
  BellRing,
  BellOff,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  HelpCircle,
  Flag,
} from "lucide-react";
import { HalalChecklistItem, HalalReminderConfig, TabType } from "../types";
import {
  isNotificationSupported,
  getNotificationPermissionState,
  requestBrowserNotificationPermission,
  auditPendingHalalItems,
  loadHalalReminderConfig,
  saveHalalReminderConfig,
  triggerHalalReminderNotification,
} from "../utils/halalNotificationService";

interface HalalScheduledReminderCardProps {
  businessName: string;
  items: HalalChecklistItem[];
  onToggleItem: (id: string) => void;
  onFilterOverdue?: () => void;
  onShowToast?: (msg: string) => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const HalalScheduledReminderCard: React.FC<HalalScheduledReminderCardProps> = ({
  businessName,
  items,
  onToggleItem,
  onFilterOverdue,
  onShowToast,
  onNavigateTab,
}) => {
  const [config, setConfig] = useState<HalalReminderConfig>(() => loadHalalReminderConfig());
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() =>
    getNotificationPermissionState()
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // Sync notification permission status on mount
  useEffect(() => {
    setPermission(getNotificationPermissionState());
  }, []);

  // Compute pending audit with 48h threshold
  const audit = useMemo(() => {
    return auditPendingHalalItems(items, config.thresholdHours || 48);
  }, [items, config.thresholdHours]);

  // Scheduled background checker: runs every 60 seconds
  useEffect(() => {
    if (!config.enabled) return;
    if (permission !== "granted") return;
    if (audit.totalOverdue === 0) return;

    const performScheduledCheck = () => {
      const now = Date.now();
      const lastSent = config.lastNotifiedAt ? new Date(config.lastNotifiedAt).getTime() : 0;
      // Cooldown of 2 hours between reminders to avoid spamming the user
      const COOLDOWN_MS = 2 * 60 * 60 * 1000;

      if (now - lastSent >= COOLDOWN_MS) {
        const sent = triggerHalalReminderNotification({
          overdueItems: audit.overdueItems,
          businessName,
          onOpenChecklist: () => {
            window.focus();
            if (onNavigateTab) onNavigateTab("halal-tracker");
          },
          isManualTest: false,
        });

        if (sent) {
          const updated: HalalReminderConfig = {
            ...config,
            lastNotifiedAt: new Date().toISOString(),
            notificationCount: (config.notificationCount || 0) + 1,
          };
          setConfig(updated);
          saveHalalReminderConfig(updated);
        }
      }
    };

    // Run initial check
    performScheduledCheck();

    const timer = setInterval(performScheduledCheck, 60 * 1000);
    return () => clearInterval(timer);
  }, [config, permission, audit.totalOverdue, audit.overdueItems, businessName, onNavigateTab]);

  const handleRequestPermission = async () => {
    const result = await requestBrowserNotificationPermission();
    setPermission(result);

    if (result === "granted") {
      setFeedbackMessage("✓ Izin notifikasi browser berhasil diaktifkan!");
      if (onShowToast) {
        onShowToast("Izin notifikasi browser aktif! Pengingat otomatis 48 jam diaktifkan.");
      }
    } else if (result === "denied") {
      setFeedbackMessage("⚠️ Izin notifikasi diblokir browser. Izinkan melalui ikon gembok di bilah alamat browser.");
    } else {
      setFeedbackMessage("Izin notifikasi belum diberikan.");
    }

    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  const handleToggleEnable = (newEnabled: boolean) => {
    const updated: HalalReminderConfig = { ...config, enabled: newEnabled };
    setConfig(updated);
    saveHalalReminderConfig(updated);

    if (newEnabled && permission !== "granted") {
      handleRequestPermission();
    } else {
      const msg = newEnabled
        ? "Sistem pengingat 48 jam diaktifkan."
        : "Sistem pengingat 48 jam dinonaktifkan.";
      if (onShowToast) onShowToast(msg);
      setFeedbackMessage(msg);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleTestNotification = async () => {
    setIsTesting(true);

    // If permission not granted, request it first
    if (permission !== "granted") {
      const perm = await requestBrowserNotificationPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setFeedbackMessage("⚠️ Izin notifikasi diperlukan untuk menampilkan notifikasi di layar.");
        setIsTesting(false);
        setTimeout(() => setFeedbackMessage(null), 4000);
        return;
      }
    }

    const itemsForTest = audit.overdueItems.length > 0 ? audit.overdueItems : audit.pendingItems;

    const sent = triggerHalalReminderNotification({
      overdueItems: itemsForTest.length > 0 ? itemsForTest : [
        {
          item: {
            id: "test-indicator",
            title: "Dokumen Manual SJPH (Sistem Jaminan Produk Halal)",
            category: "Proses Produksi",
            desc: "Uji coba pengingat otomatis kesiapan halal BPJPH",
            checked: false,
            required: true,
          },
          hoursPending: 49.5,
          isOverdue48h: true,
          pendingSinceFormatted: "6 Sep, 21:00",
        },
      ],
      businessName,
      onOpenChecklist: () => {
        window.focus();
        if (onNavigateTab) onNavigateTab("halal-tracker");
      },
      isManualTest: true,
    });

    setIsTesting(false);

    if (sent) {
      setFeedbackMessage("✓ Notifikasi browser berhasil dikirim ke layar Anda!");
      if (onShowToast) onShowToast("Notifikasi browser berhasil dikirim!");
    } else {
      setFeedbackMessage("Browser tidak dapat memunculkan notifikasi atau dibatasi oleh izin iframe.");
    }

    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  const supported = isNotificationSupported();

  return (
    <div
      id="halal-scheduled-notification-card"
      className="bg-[#16191F] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4 transition-all"
    >
      {/* Card Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              audit.totalOverdue > 0
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}
          >
            {audit.totalOverdue > 0 ? (
              <BellRing className="w-5 h-5 animate-bounce" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Pengingat Kesiapan Halal Terjadwal (Web Notification API)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Ambang Batas: 48 Jam
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Memberikan notifikasi desktop otomatis jika indikator checklist belum diselesaikan selama lebih dari 48 jam.
            </p>
          </div>
        </div>

        {/* Status Pill & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Permission Status Pill */}
          {permission === "granted" ? (
            <span
              id="notif-permission-granted"
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center space-x-1.5"
              title="Izin notifikasi browser telah aktif"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Izin Notifikasi Aktif</span>
            </span>
          ) : permission === "denied" ? (
            <span
              id="notif-permission-denied"
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center space-x-1.5"
              title="Izin diblokir di peramban"
            >
              <BellOff className="w-3.5 h-3.5 text-rose-400" />
              <span>Izin Diblokir Browser</span>
            </span>
          ) : supported ? (
            <button
              id="btn-request-notification-permission"
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm flex items-center space-x-1.5 transition-all"
              title="Aktifkan izin notifikasi di browser Anda"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Aktifkan Izin Notifikasi</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400">
              API Tidak Didukung
            </span>
          )}

          {/* Test Notification Button */}
          <button
            id="btn-test-notification"
            onClick={handleTestNotification}
            disabled={isTesting}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all disabled:opacity-50"
            title="Kirimkan uji coba notifikasi desktop sekarang"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isTesting ? "Mengirim..." : "Uji Notifikasi Sekarang"}</span>
          </button>

          {/* Enable / Disable Toggle Switch */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <label className="relative inline-flex items-center cursor-pointer" title="Aktifkan/Nonaktifkan pengingat 48 jam">
              <input
                type="checkbox"
                id="toggle-halal-reminder-enabled"
                checked={config.enabled}
                onChange={(e) => handleToggleEnable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-xs font-semibold text-slate-300">
                {config.enabled ? "Aktif" : "Nonaktif"}
              </span>
            </label>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title={isExpanded ? "Sembunyikan rincian pengingat" : "Tampilkan rincian pengingat"}
            aria-label="Toggle reminder card expansion"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Banner */}
      {feedbackMessage && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 flex items-center space-x-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Expanded Details & Overdue Items List */}
      {isExpanded && (
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          {/* Overdue Items Alert Header */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              audit.totalOverdue > 0
                ? "bg-rose-950/30 border-rose-500/40 text-rose-300"
                : "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
            }`}
          >
            <div className="flex items-center space-x-3">
              {audit.totalOverdue > 0 ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <div>
                <span className="text-xs font-bold block">
                  {audit.totalOverdue > 0
                    ? `${audit.totalOverdue} Butir Checklist Halal Tertunda > 48 Jam`
                    : "Semua Butir Terkelola Tepat Waktu (Tidak Ada Yang Tertunda > 48 Jam)"}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {audit.totalOverdue > 0
                    ? `Perhatian untuk ${businessName}: Butir di bawah ini belum diselesaikan lebih dari 48 jam. Pengingat desktop aktif untuk memastikan dokumen SJPH tidak terbengkalai.`
                    : "Tidak ada butir yang tertunda lebih dari ambang batas 48 jam. Pengingat otomatis akan muncul jika ada butir yang tertunda di kemudian hari."}
                </p>
              </div>
            </div>

            {audit.totalOverdue > 0 && onFilterOverdue && (
              <button
                onClick={onFilterOverdue}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-all shrink-0 self-start sm:self-center"
              >
                Tinjau Semua Butir Tertunda
              </button>
            )}
          </div>

          {/* List of Overdue Items (> 48h) */}
          {audit.overdueItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Rincian Indikator Yang Tertunda &gt; 48 Jam:</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {audit.overdueItems.map(({ item, hoursPending, pendingSinceFormatted }) => (
                  <div
                    key={item.id}
                    id={`overdue-reminder-item-${item.id}`}
                    className="p-3 rounded-xl bg-slate-950/70 border border-rose-500/30 hover:border-rose-500/60 transition-all flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {item.category}
                          </span>
                          {item.required && (
                            <span className="inline-flex items-center space-x-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-950/90 border border-amber-500/60 text-amber-300">
                              <Flag className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                              <span>Mandatori</span>
                            </span>
                          )}
                        </div>

                        {/* Hours Pending Badge */}
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 font-mono">
                          <Clock className="w-3 h-3 text-rose-400" />
                          <span>Tertunda {hoursPending} jam</span>
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-400">
                      <span>Tertunda sejak: {pendingSinceFormatted}</span>
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className="px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10px] font-bold transition-all flex items-center space-x-1"
                        title="Tandai butir ini telah selesai"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Tandai Selesai</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informational Guidance Footer */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-2.5">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>
                <strong className="text-slate-300">Cara Kerja Sistem Pengingat:</strong> Notifikasi browser Web Notification API bekerja di latar belakang (background) peramban Anda. Bila diizinkan, peramban akan memunculkan pop-up pemberitahuan desktop berkala jika terdapat syarat audit halal yang belum dipenuhi lebih dari 48 jam.
              </p>
              <p className="text-[10px] text-slate-400">
                Catatan: Jika peramban berada dalam mode preview iframe atau tab pribadi (incognito), klik &quot;Uji Notifikasi Sekarang&quot; untuk mengonfirmasi bahwa izin notifikasi dapat diproses secara tepat.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
