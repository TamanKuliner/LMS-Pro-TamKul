import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { HighDensityHeader } from "./components/HighDensityHeader";
import { QuickActionsSidebar } from "./components/QuickActionsSidebar";
import { CourseOverview } from "./components/CourseOverview";
import { CoursePlayer } from "./components/CoursePlayer";
import { Bankable5CCalculator } from "./components/Bankable5CCalculator";
import { ShariaFinancingSimulator } from "./components/ShariaFinancingSimulator";
import { HalalReadinessTracker } from "./components/HalalReadinessTracker";
import { SubstanceTestQuiz } from "./components/SubstanceTestQuiz";
import { CertificateModal } from "./components/CertificateModal";
import { ShariaAdvisorChat } from "./components/ShariaAdvisorChat";
import { CloudInfraDashboard } from "./components/CloudInfraDashboard";
import { LearningAnalytics } from "./components/LearningAnalytics";
import { ProfileModal } from "./components/ProfileModal";
import { PdfReportModal } from "./components/PdfReportModal";
import { QuickFeedbackFooterWidget } from "./components/QuickFeedbackFooterWidget";
import { TabType, Language, ParticipantProfile, HalalChecklistItem, QuizAttempt } from "./types";
import { initialHalalChecklist } from "./data/halalChecklistData";
import { initialQuizAttempts } from "./data/learningAnalyticsData";
import { downloadProgressPdf } from "./utils/pdfReportGenerator";
import { translations } from "./translations";
import { useTheme } from "./context/ThemeContext";
import { Sparkles, Zap, FileText } from "lucide-react";
import { evaluateUserBadges } from "./data/badgesData";
import {
  triggerAllModulesCompletedConfetti,
  triggerExamPassedConfetti,
} from "./utils/confetti";
import {
  loadHalalReminderConfig,
  saveHalalReminderConfig,
  auditPendingHalalItems,
  triggerHalalReminderNotification,
} from "./utils/halalNotificationService";

export default function App() {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [language, setLanguage] = useState<Language>("id");
  const [isHighDensityMode, setIsHighDensityMode] = useState<boolean>(true); // High Density mode state
  const [isQuickActionsMobileOpen, setIsQuickActionsMobileOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing">("synced");

  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("tk_completed_modules");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ["modul-1", "modul-2", "modul-3"];
  });
  const [activeCourseModuleId, setActiveCourseModuleId] = useState<string>("modul-1");
  const [highestScore, setHighestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("tk_highest_score");
      if (saved) return Number(saved);
    } catch (e) {}
    return 91;
  });
  const [hasPassedExam, setHasPassedExam] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("tk_has_passed_exam");
      if (saved) return saved === "true";
    } catch (e) {}
    return true;
  });
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem("tk_quiz_attempts");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialQuizAttempts;
  });
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [analyticsMetricView, setAnalyticsMetricView] = useState<"all" | "quiz" | "modules" | "competency" | "yearly" | "feedback">("all");

  const [halalItems, setHalalItems] = useState<HalalChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem("tk_halal_checklist_items");
      if (saved) {
        const parsed: HalalChecklistItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const savedMap = new Map(parsed.map((item) => [item.id, item]));
          return initialHalalChecklist.map((initialItem) => {
            const savedItem = savedMap.get(initialItem.id);
            if (savedItem) {
              return {
                ...initialItem,
                checked: typeof savedItem.checked === "boolean" ? savedItem.checked : initialItem.checked,
                deadline: savedItem.deadline !== undefined ? savedItem.deadline : initialItem.deadline,
                notes: savedItem.notes !== undefined ? savedItem.notes : initialItem.notes,
                notesUpdatedAt: savedItem.notesUpdatedAt || initialItem.notesUpdatedAt,
                pendingSince: savedItem.pendingSince !== undefined ? savedItem.pendingSince : initialItem.pendingSince,
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

  // Persist halal items across sessions
  useEffect(() => {
    try {
      localStorage.setItem("tk_halal_checklist_items", JSON.stringify(halalItems));
    } catch (e) {
      console.error("Gagal menyimpan data checklist halal ke localStorage", e);
    }
  }, [halalItems]);

  const [profile, setProfile] = useState<ParticipantProfile>(() => {
    try {
      const saved = localStorage.getItem("tk_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          monthlyLearningGoalJP: parsed.monthlyLearningGoalJP ?? 7,
          monthlyGoalMonth: parsed.monthlyGoalMonth || "September 2026",
          monthlyGoalFocus: parsed.monthlyGoalFocus || "Tuntaskan 4 Modul Kurikulum & Kesiapan Bankable 5C",
        };
      }
    } catch (e) {}
    return {
      id: "usr-tk-901",
      fullName: "Hj. Siti Rahmah",
      businessName: "Dapur Sambal Berkah",
      culinaryCategory: "Aneka Masakan Nusantara",
      age: 34,
      hasNIB: true,
      nibNumber: "9120008471923",
      email: "siti.rahmah@dapursambal.id",
      phone: "0812-8923-4412",
      address: "Jl. Taman Kuliner No. 14, Condongcatur, Sleman, D.I. Yogyakarta",
      currentMonthlyRevenue: 45000000,
      isVerified: true,
      monthlyLearningGoalJP: 7,
      monthlyGoalMonth: "September 2026",
      monthlyGoalFocus: "Tuntaskan 4 Modul Kurikulum & Kesiapan Bankable 5C",
    };
  });

  // Persist profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("tk_user_profile", JSON.stringify(profile));
    } catch (e) {
      console.error("Gagal menyimpan data profil ke localStorage", e);
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleTriggerSync = () => {
    setSyncStatus("syncing");
    showToast("Memulai sinkronisasi edge multi-region (AWS, GCP, Azure)...");
    setTimeout(() => {
      setSyncStatus("synced");
      showToast("Sinkronisasi real-time selesai! Status 99.98% optimal.");
    }, 1500);
  };

  const handleToggleModuleCompletion = (moduleId: string) => {
    setCompletedModuleIds((prev) => {
      const exists = prev.includes(moduleId);
      const updated = exists ? prev.filter((id) => id !== moduleId) : [...prev, moduleId];
      try {
        localStorage.setItem("tk_completed_modules", JSON.stringify(updated));
      } catch (e) {}

      // If user just marked the final module complete (all 4 modules now completed)
      if (!exists && updated.length >= 4) {
        triggerAllModulesCompletedConfetti();
        showToast("Mabruk! Seluruh 4 Modul Kurikulum (7 JP) tuntas! Evaluasi Capstone siap dikerjakan.");
      } else {
        showToast(exists ? "Modul ditandai belum selesai" : "Alhamdulillah! Modul berhasil diselesaikan");
      }
      return updated;
    });
  };

  const handleResetModules = () => {
    setCompletedModuleIds(["modul-1"]);
    try {
      localStorage.setItem("tk_completed_modules", JSON.stringify(["modul-1"]));
    } catch (e) {}
    showToast("Progres di-reset: Modul 1 Terbuka, Modul 2-4 Terkunci");
  };

  const handleCompleteAllModules = () => {
    const all = ["modul-1", "modul-2", "modul-3", "modul-4"];
    setCompletedModuleIds(all);
    try {
      localStorage.setItem("tk_completed_modules", JSON.stringify(all));
    } catch (e) {}
    triggerAllModulesCompletedConfetti();
    showToast("Alhamdulillah! Seluruh 4 Modul (7 JP) tuntas. Evaluasi Capstone siap dikerjakan!");
  };

  const handleSetPassedExam = (passed: boolean, score: number) => {
    setHasPassedExam(passed);
    try {
      localStorage.setItem("tk_has_passed_exam", passed ? "true" : "false");
    } catch (e) {}

    setHighestScore((prev) => {
      const updated = Math.max(prev, score);
      try {
        localStorage.setItem("tk_highest_score", updated.toString());
      } catch (e) {}
      return updated;
    });

    if (passed) {
      triggerExamPassedConfetti();
      showToast(`Mabruk! Anda lulus dengan nilai ${score}/100. Sertifikat siap diakses!`);
    } else {
      showToast(`Nilai Anda ${score}/100. Silakan tinjau kembali pembahasan materi.`);
    }
  };

  const handleRecordQuizAttempt = (newAttempt: QuizAttempt) => {
    setQuizAttempts((prev) => {
      const itemWithNumber: QuizAttempt = {
        ...newAttempt,
        attemptNumber: prev.length + 1,
      };
      const updated = [...prev, itemWithNumber];
      try {
        localStorage.setItem("tk_quiz_attempts", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleToggleHalalItem = (id: string) => {
    setHalalItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const newChecked = !it.checked;
          return {
            ...it,
            checked: newChecked,
            pendingSince: newChecked ? undefined : new Date().toISOString(),
          };
        }
        return it;
      })
    );
  };

  // Scheduled Halal Readiness Reminder: notifies user via Browser Notification API if items pending > 48 hours
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const checkHalalReminders = () => {
      const config = loadHalalReminderConfig();
      if (!config.enabled) return;

      const audit = auditPendingHalalItems(halalItems, config.thresholdHours || 48);
      if (audit.totalOverdue === 0) return;

      const now = Date.now();
      const lastSent = config.lastNotifiedAt ? new Date(config.lastNotifiedAt).getTime() : 0;
      const COOLDOWN_MS = 2 * 60 * 60 * 1000;

      if (now - lastSent >= COOLDOWN_MS) {
        const sent = triggerHalalReminderNotification({
          overdueItems: audit.overdueItems,
          businessName: profile.businessName,
          onOpenChecklist: () => {
            window.focus();
            setActiveTab("halal-tracker");
          },
          isManualTest: false,
        });

        if (sent) {
          const updated = {
            ...config,
            lastNotifiedAt: new Date().toISOString(),
            notificationCount: (config.notificationCount || 0) + 1,
          };
          saveHalalReminderConfig(updated);
        }
      }
    };

    checkHalalReminders();
    const interval = setInterval(checkHalalReminders, 60 * 1000);
    return () => clearInterval(interval);
  }, [halalItems, profile.businessName]);

  const handleUpdateHalalItemNotes = (id: string, notes: string) => {
    setHalalItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, notes, notesUpdatedAt: new Date().toISOString() }
          : it
      )
    );
  };

  const handleUpdateHalalItemDeadline = (id: string, deadline?: string) => {
    setHalalItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, deadline } : it))
    );
  };

  const handleDownloadPdfSummary = () => {
    try {
      const fileName = downloadProgressPdf({
        profile,
        halalItems,
        completedModuleIds,
        hasPassedExam,
        highestScore,
      });
      showToast(`Dokumen PDF "${fileName}" berhasil diunduh!`);
    } catch (err) {
      console.error("Gagal mengunduh PDF:", err);
      showToast("Gagal men-generate file PDF. Silakan coba lagi.");
    }
  };

  // Evaluate dynamic user badges for profile, medals showcase, and navbar count
  const userBadges = useMemo(() => {
    return evaluateUserBadges({
      completedModuleIds,
      quizAttempts,
      highestScore,
      hasPassedExam,
      profile,
    });
  }, [completedModuleIds, quizAttempts, highestScore, hasPassedExam, profile]);

  const unlockedBadgesCount = useMemo(() => {
    return userBadges.filter((b) => b.isUnlocked).length;
  }, [userBadges]);

  const t = translations[language];

  return (
    <div className="flex h-screen w-full bg-[#0A0B0D] text-slate-300 font-sans overflow-hidden antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-[#16191F] text-slate-100 px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Action Pill for Mobile when in High Density Mode */}
      {isHighDensityMode && (
        <button
          onClick={() => setIsQuickActionsMobileOpen(true)}
          className="xl:hidden fixed bottom-14 right-4 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-full shadow-xl flex items-center gap-1.5 text-xs font-semibold border border-emerald-400/40"
          title="Buka Quick Actions"
          aria-label="Open Quick Actions Mobile Drawer"
        >
          <Zap className="w-4 h-4" />
          <span className="hidden sm:inline text-[11px]">Quick Actions</span>
        </button>
      )}

      {/* High-Density Navigation Sidebar */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        language={language}
        onSelectLanguage={setLanguage}
        darkMode={isDarkMode}
        onToggleDarkMode={toggleTheme}
        onOpenNotifications={() => setActiveTab("cloud-infra")}
        unreadAnomaliesCount={1}
        syncStatus={syncStatus}
        onTriggerSync={handleTriggerSync}
        e2eeSecuredCount={5120}
        fullName={profile.fullName}
        businessName={profile.businessName}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        unlockedBadgesCount={unlockedBadgesCount}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0A0B0D] overflow-hidden">
        {/* High-Density Header */}
        <HighDensityHeader
          language={language}
          onSelectLanguage={setLanguage}
          darkMode={isDarkMode}
          onToggleDarkMode={toggleTheme}
          onOpenNotifications={() => setActiveTab("cloud-infra")}
          unreadAnomaliesCount={1}
          syncStatus={syncStatus}
          onTriggerSync={handleTriggerSync}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          fullName={profile.fullName}
          businessName={profile.businessName}
          isHighDensity={isHighDensityMode}
          unlockedBadgesCount={unlockedBadgesCount}
          onToggleHighDensity={() => {
            const nextMode = !isHighDensityMode;
            setIsHighDensityMode(nextMode);
            showToast(nextMode ? "Mode High Density diaktifkan. Quick Actions sidebar ditampilkan!" : "Mode High Density dinonaktifkan. Quick Actions sidebar disembunyikan.");
          }}
          onToggleQuickActionsMobile={() => setIsQuickActionsMobileOpen(true)}
        />

        {/* Split View: Viewport + QuickActionsSidebar (High Density Mode Only) */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Scrollable Viewport */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 min-w-0">
            {activeTab === "overview" && (
              <CourseOverview
                language={language}
                onNavigateTab={setActiveTab}
                profile={profile}
                onUpdateProfile={setProfile}
                completedModulesCount={completedModuleIds.length}
                completedModuleIds={completedModuleIds}
                onOpenCertificate={() => setIsCertModalOpen(true)}
                hasPassedExam={hasPassedExam}
                businessName={profile.businessName}
                onOpenPdfReport={() => setIsPdfModalOpen(true)}
                onDownloadPdf={handleDownloadPdfSummary}
                onToggleModuleCompletion={handleToggleModuleCompletion}
                onSelectModule={(modId) => {
                  setActiveCourseModuleId(modId);
                  setActiveTab("syllabus");
                }}
                onResetModules={handleResetModules}
                onCompleteAllModules={handleCompleteAllModules}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                quizAttempts={quizAttempts}
                highestScore={highestScore}
                onShowToast={showToast}
              />
            )}

            {activeTab === "syllabus" && (
              <CoursePlayer
                language={language}
                onNavigateTab={setActiveTab}
                completedModuleIds={completedModuleIds}
                onToggleModuleCompletion={handleToggleModuleCompletion}
                activeModuleId={activeCourseModuleId}
              />
            )}

            {activeTab === "bankable-calc" && (
              <Bankable5CCalculator
                language={language}
                onNavigateTab={setActiveTab}
                businessName={profile.businessName}
              />
            )}

            {activeTab === "financing-sim" && (
              <ShariaFinancingSimulator
                language={language}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === "halal-tracker" && (
              <HalalReadinessTracker
                language={language}
                onNavigateTab={setActiveTab}
                businessName={profile.businessName}
                items={halalItems}
                onToggleItem={handleToggleHalalItem}
                onUpdateNotes={handleUpdateHalalItemNotes}
                onUpdateDeadline={handleUpdateHalalItemDeadline}
                onOpenPdfReport={() => setIsPdfModalOpen(true)}
                onDownloadPdf={handleDownloadPdfSummary}
                onShowToast={showToast}
              />
            )}

            {activeTab === "quiz-test" && (
              <SubstanceTestQuiz
                language={language}
                onNavigateTab={setActiveTab}
                onOpenCertificateModal={() => setIsCertModalOpen(true)}
                hasPassedExam={hasPassedExam}
                onSetPassedExam={handleSetPassedExam}
                highestScore={highestScore}
                onRecordQuizAttempt={handleRecordQuizAttempt}
              />
            )}

            {activeTab === "learning-analytics" && (
              <LearningAnalytics
                language={language}
                onNavigateTab={setActiveTab}
                completedModuleIds={completedModuleIds}
                hasPassedExam={hasPassedExam}
                highestScore={highestScore}
                quizAttempts={quizAttempts}
                businessName={profile.businessName}
                fullName={profile.fullName}
                nibNumber={profile.nibNumber}
                culinaryCategory={profile.culinaryCategory}
                city={profile.city || profile.address?.split(",")[0]}
                onOpenCertificate={() => setIsCertModalOpen(true)}
                onShowToast={showToast}
                initialMetricView={analyticsMetricView}
              />
            )}

            {activeTab === "ai-advisor" && (
              <ShariaAdvisorChat
                language={language}
                businessName={profile.businessName}
              />
            )}

            {activeTab === "cloud-infra" && (
              <CloudInfraDashboard />
            )}
          </main>

          {/* Quick Actions Sidebar (Appears ONLY in High Density Mode) */}
          {isHighDensityMode && (
            <QuickActionsSidebar
              isHighDensity={isHighDensityMode}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onTriggerSync={handleTriggerSync}
              syncStatus={syncStatus}
              profile={profile}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenCertificateModal={() => setIsCertModalOpen(true)}
              completedModulesCount={completedModuleIds.length}
              totalModulesCount={4}
              hasPassedExam={hasPassedExam}
              highestScore={highestScore}
              unreadAnomaliesCount={1}
              language={language}
              onShowToast={showToast}
              onToggleHighDensity={() => setIsHighDensityMode(!isHighDensityMode)}
              isMobileDrawerOpen={isQuickActionsMobileOpen}
              onCloseMobileDrawer={() => setIsQuickActionsMobileOpen(false)}
              onOpenPdfReport={() => setIsPdfModalOpen(true)}
              onDownloadPdf={handleDownloadPdfSummary}
              darkMode={isDarkMode}
              onToggleDarkMode={toggleTheme}
            />
          )}
        </div>

        {/* High-Density Compact Footer with Quick Feedback Widget */}
        <footer className="min-h-10 h-auto sm:h-10 py-1.5 sm:py-0 border-t border-slate-800 bg-[#0A0B0D] px-3 sm:px-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 text-[10px] text-slate-500 shrink-0 select-none z-30">
          <div className="flex items-center gap-2 truncate">
            <span className="truncate">
              © {new Date().getFullYear()} Pro TamanKuliner.com | Platform Digitalisasi UMKM Berbasis Syariah (7 JP)
            </span>
          </div>

          {/* Quick Feedback Footer Widget directly connected to Management Dashboard */}
          <div className="flex items-center gap-2">
            <QuickFeedbackFooterWidget
              activeModuleId={activeCourseModuleId}
              profile={profile}
              onNavigateToManagementDashboard={() => {
                setAnalyticsMetricView("feedback");
                setActiveTab("learning-analytics");
                setTimeout(() => {
                  const el = document.getElementById("management-feedback-dashboard");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 150);
              }}
              onShowToast={showToast}
            />
          </div>

          <div className="hidden md:flex items-center gap-3 font-mono text-[10px]">
            <span>Cloud: <span className="text-emerald-500 font-bold">Stable</span></span>
            <span className="text-slate-700">|</span>
            <span>API: <span className="text-emerald-500 font-bold">Connected</span></span>
            <span className="text-slate-700">|</span>
            <span>E2EE: <span className="text-emerald-500 font-bold">Verified</span></span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        profile={profile}
        score={highestScore || 90}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => {
          setProfile(updated);
          showToast("Data profil & identitas usaha kuliner berhasil diperbarui!");
        }}
        completedModuleIds={completedModuleIds}
        quizAttempts={quizAttempts}
        highestScore={highestScore}
        hasPassedExam={hasPassedExam}
        onNavigateTab={setActiveTab}
        onSelectModule={(modId) => {
          setActiveCourseModuleId(modId);
          setActiveTab("syllabus");
        }}
        onOpenCertificate={() => setIsCertModalOpen(true)}
        onOpenPdfReport={() => setIsPdfModalOpen(true)}
        onShowToast={showToast}
      />

      <PdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        profile={profile}
        halalItems={halalItems}
        completedModuleIds={completedModuleIds}
        hasPassedExam={hasPassedExam}
        highestScore={highestScore}
        onShowToast={showToast}
      />
    </div>
  );
}
