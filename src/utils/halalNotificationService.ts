import { HalalChecklistItem, HalalReminderConfig, PendingItemAudit } from "../types";

export const STORAGE_KEY_HALAL_REMINDER = "tk_halal_reminder_config";

export const defaultHalalReminderConfig: HalalReminderConfig = {
  enabled: true,
  thresholdHours: 48,
  checkIntervalMinutes: 60,
  lastNotifiedAt: null,
  notificationCount: 0,
};

/**
 * Checks if the Web Notification API is supported in the current environment.
 */
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Retrieves the current permission state of the Notification API.
 */
export function getNotificationPermissionState(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) {
    return "unsupported";
  }
  return Notification.permission;
}

/**
 * Requests browser notification permission safely with error handling for iframe constraints.
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!isNotificationSupported()) {
    return "unsupported";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn("Browser Notification.requestPermission restricted or unsupported in frame:", err);
    return Notification.permission || "unsupported";
  }
}

/**
 * Audits the Halal checklist items to identify any uncompleted items pending > thresholdHours (default 48h).
 */
export function auditPendingHalalItems(
  items: HalalChecklistItem[],
  thresholdHours: number = 48
): {
  pendingItems: PendingItemAudit[];
  overdueItems: PendingItemAudit[];
  totalPending: number;
  totalOverdue: number;
} {
  const now = Date.now();
  const pendingList: PendingItemAudit[] = [];

  for (const item of items) {
    if (!item.checked) {
      // If item has a pendingSince timestamp, calculate elapsed time;
      // otherwise, fallback to 52 hours ago for existing pending items
      const pendingTimestamp = item.pendingSince
        ? new Date(item.pendingSince).getTime()
        : now - 52 * 3600 * 1000;

      const diffMs = Math.max(0, now - pendingTimestamp);
      const hoursPending = Math.round((diffMs / (3600 * 1000)) * 10) / 10;
      const isOverdue48h = hoursPending >= thresholdHours;

      const dateObj = new Date(pendingTimestamp);
      const pendingSinceFormatted = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });

      pendingList.push({
        item,
        hoursPending,
        isOverdue48h,
        pendingSinceFormatted,
      });
    }
  }

  // Sort by hoursPending descending (longest pending first)
  pendingList.sort((a, b) => b.hoursPending - a.hoursPending);

  const overdueItems = pendingList.filter((p) => p.isOverdue48h);

  return {
    pendingItems: pendingList,
    overdueItems,
    totalPending: pendingList.length,
    totalOverdue: overdueItems.length,
  };
}

/**
 * Loads the stored notification configuration from localStorage.
 */
export function loadHalalReminderConfig(): HalalReminderConfig {
  if (typeof window === "undefined") return defaultHalalReminderConfig;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HALAL_REMINDER);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultHalalReminderConfig,
        ...parsed,
      };
    }
  } catch (err) {
    console.error("Gagal memuat konfigurasi pengingat halal dari localStorage", err);
  }
  return defaultHalalReminderConfig;
}

/**
 * Saves the notification configuration to localStorage.
 */
export function saveHalalReminderConfig(config: HalalReminderConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_HALAL_REMINDER, JSON.stringify(config));
  } catch (err) {
    console.error("Gagal menyimpan konfigurasi pengingat halal ke localStorage", err);
  }
}

/**
 * Triggers a browser desktop notification via the Notification API.
 * Returns true if notification was successfully posted, false otherwise.
 */
export function triggerHalalReminderNotification(options: {
  overdueItems: PendingItemAudit[];
  businessName: string;
  onOpenChecklist?: () => void;
  isManualTest?: boolean;
}): boolean {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }

  const { overdueItems, businessName, onOpenChecklist, isManualTest } = options;
  const count = overdueItems.length;
  const primary = overdueItems[0]?.item;

  const title = isManualTest
    ? `[Tes Pengingat] Kesiapan Halal: ${businessName}`
    : `⚠️ Pengingat Halal: ${count} Butir Tertunda > 48 Jam`;

  let body = "";
  if (isManualTest) {
    body = `Sistem pengingat aktif! Terdapat ${count} butir checklist tertunda > 48 jam. Klik untuk melengkapi dokumen SJPH di Taman Kuliner.`;
  } else if (count === 1 && primary) {
    body = `Butir "${primary.title}" (${primary.category}) tertunda ${overdueItems[0].hoursPending} jam. Segera selesaikan sebelum audit BPJPH.`;
  } else {
    body = `${count} butir checklist kesiapan halal untuk "${businessName}" tertunda lebih dari 48 jam (${primary?.title || "Manual SJPH"}). Klik untuk meninjau.`;
  }

  try {
    const notifOptions: NotificationOptions = {
      body,
      icon: "/favicon.ico",
      tag: isManualTest ? `test-notif-${Date.now()}` : "halal-readiness-48h-reminder",
    };

    const notification = new Notification(title, notifOptions);

    notification.onclick = () => {
      window.focus();
      if (onOpenChecklist) {
        onOpenChecklist();
      }
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn("Gagal membuat notifikasi browser:", err);
    return false;
  }
}
