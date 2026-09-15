import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ChevronRight, 
  Lightbulb, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Captions,
  Award,
  Check,
  GraduationCap
} from "lucide-react";
import { syllabusModules } from "../data/syllabusData";
import { Language, TabType } from "../types";
import { 
  moduleVideoInfoList,
  quickKnowledgeQuestionsByModule 
} from "../data/quickKnowledgeCheckData";
import { QuickKnowledgeCheckModal } from "./QuickKnowledgeCheckModal";

interface CoursePlayerProps {
  language: Language;
  onNavigateTab: (tab: TabType) => void;
  completedModuleIds: string[];
  onToggleModuleCompletion: (moduleId: string) => void;
  activeModuleId?: string;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  language,
  onNavigateTab,
  completedModuleIds,
  onToggleModuleCompletion,
  activeModuleId,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(activeModuleId || "modul-1");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("m1-s1");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [openQnaIndex, setOpenQnaIndex] = useState<number | null>(null);

  // Video Module Player States
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [videoSpeed, setVideoSpeed] = useState<number>(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoNotice, setVideoNotice] = useState<string | null>(null);

  // Quick Knowledge Check Modal State
  const [isQuickCheckModalOpen, setIsQuickCheckModalOpen] = useState(false);

  // Persistence for completed videos & quick checks
  const [completedVideoModules, setCompletedVideoModules] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("tk_completed_videos");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [quickCheckRecords, setQuickCheckRecords] = useState<Record<string, { passed: boolean; score: number }>>(() => {
    try {
      const stored = localStorage.getItem("tk_quick_checks");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  const currentVideoInfo = moduleVideoInfoList[selectedModuleId] || moduleVideoInfoList["modul-1"];
  const currentModule = syllabusModules.find((m) => m.id === selectedModuleId) || syllabusModules[0];
  const currentSection = currentModule.sections.find((s) => s.id === selectedSectionId) || currentModule.sections[0];
  const isCurrentModuleCompleted = completedModuleIds.includes(currentModule.id);
  const isCurrentVideoCompleted = completedVideoModules.includes(selectedModuleId);
  const currentQuickCheck = quickCheckRecords[selectedModuleId];

  // Update selected module when activeModuleId prop changes
  useEffect(() => {
    if (activeModuleId && activeModuleId !== selectedModuleId) {
      setSelectedModuleId(activeModuleId);
      const mod = syllabusModules.find((m) => m.id === activeModuleId);
      if (mod && mod.sections.length > 0) {
        setSelectedSectionId(mod.sections[0].id);
      }
    }
  }, [activeModuleId]);

  // Reset video progress when changing modules
  useEffect(() => {
    setVideoCurrentTime(0);
    setIsVideoPlaying(false);
    setVideoNotice(null);
  }, [selectedModuleId]);

  // Video playback timer
  useEffect(() => {
    let interval: any = null;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoCurrentTime((prev) => {
          const next = prev + 1 * videoSpeed;
          if (next >= currentVideoInfo.totalDurationSeconds) {
            setIsVideoPlaying(false);
            handleAutoVideoCompletion();
            return currentVideoInfo.totalDurationSeconds;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVideoPlaying, videoSpeed, currentVideoInfo.totalDurationSeconds, selectedModuleId]);

  // Stop speech when changing sections or unmounting
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedSectionId, selectedModuleId]);

  const handleToggleSpeech = () => {
    if (!window.speechSynthesis) {
      alert("Browser Anda belum mendukung fitur Web Speech Text-to-Speech.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const fullTextToRead = `${currentSection.title}. ${currentSection.content.join(" ")}`;
      const utterance = new SpeechSynthesisUtterance(fullTextToRead);
      utterance.lang = "id-ID";
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Video Controls
  const togglePlayVideo = () => {
    if (videoCurrentTime >= currentVideoInfo.totalDurationSeconds) {
      setVideoCurrentTime(0);
    }
    setIsVideoPlaying((prev) => !prev);
  };

  const handleSeek = (newSec: number) => {
    const clamped = Math.max(0, Math.min(currentVideoInfo.totalDurationSeconds, newSec));
    setVideoCurrentTime(clamped);
  };

  const handleSkipTime = (delta: number) => {
    handleSeek(videoCurrentTime + delta);
  };

  // Automatic Video Completion & Mini-Quiz Trigger
  const handleAutoVideoCompletion = () => {
    setCompletedVideoModules((prev) => {
      if (!prev.includes(selectedModuleId)) {
        const updated = [...prev, selectedModuleId];
        try {
          localStorage.setItem("tk_completed_videos", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      }
      return prev;
    });

    setVideoNotice("Video modul tuntas (100%)! Membuka Quick Knowledge Check...");

    // Automatically trigger the Quick Knowledge Check modal!
    setTimeout(() => {
      setIsQuickCheckModalOpen(true);
    }, 400);
  };

  // Fast manual completion button ("Selesaikan Video Modul")
  const handleFastCompleteVideo = () => {
    setVideoCurrentTime(currentVideoInfo.totalDurationSeconds);
    setIsVideoPlaying(false);
    handleAutoVideoCompletion();
  };

  const handleKnowledgeCheckPassed = (modId: string) => {
    if (!completedModuleIds.includes(modId)) {
      onToggleModuleCompletion(modId);
    }
    setQuickCheckRecords((prev) => {
      const updated = {
        ...prev,
        [modId]: { passed: true, score: 100 },
      };
      try {
        localStorage.setItem("tk_quick_checks", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const currentModuleIndex = syllabusModules.findIndex((m) => m.id === selectedModuleId);
  const hasNextModule = currentModuleIndex >= 0 && currentModuleIndex < syllabusModules.length - 1;

  const handleGoToNextModule = () => {
    if (hasNextModule) {
      const nextMod = syllabusModules[currentModuleIndex + 1];
      setSelectedModuleId(nextMod.id);
      if (nextMod.sections.length > 0) {
        setSelectedSectionId(nextMod.sections[0].id);
      }
    }
  };

  // Format seconds to mm:ss
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  // Find active subtitle text
  const activeSubtitle = currentVideoInfo.subtitles.find(
    (s) => videoCurrentTime >= s.startSec && videoCurrentTime <= s.endSec
  )?.text || currentVideoInfo.subtitles[0]?.text;

  const videoProgressPercent = Math.min(
    100,
    Math.round((videoCurrentTime / currentVideoInfo.totalDurationSeconds) * 100)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-300">
      {/* Top Module Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {syllabusModules.map((mod) => {
          const isSelected = mod.id === selectedModuleId;
          const isDone = completedModuleIds.includes(mod.id);
          const hasPassedQC = quickCheckRecords[mod.id]?.passed;

          return (
            <button
              key={mod.id}
              onClick={() => {
                setSelectedModuleId(mod.id);
                setSelectedSectionId(mod.sections[0].id);
              }}
              className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-[#16191F] border-emerald-500 shadow-xl ring-1 ring-emerald-500/30 text-white"
                  : "bg-[#16191F] text-slate-300 border-slate-800 hover:border-slate-700 shadow-xl"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      isSelected
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-900 text-slate-400"
                    }`}
                  >
                    Modul {mod.moduleNumber} • {mod.jp} JP
                  </span>
                  <div className="flex items-center gap-1">
                    {hasPassedQC && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]" title="Quick Knowledge Check Lolos">
                        ✓
                      </span>
                    )}
                    {isDone && (
                      <CheckCircle2
                        className={`w-4 h-4 ${isSelected ? "text-emerald-400" : "text-emerald-500"}`}
                      />
                    )}
                  </div>
                </div>
                <h4 className="text-xs sm:text-sm font-bold leading-snug line-clamp-2 text-white">
                  {mod.title}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className={isSelected ? "text-emerald-400" : "text-slate-500"}>
                  {mod.sections.length} Topik Pembahasan
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Learning Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Section Navigator & Quick Knowledge Check Shortcut (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Knowledge Check Status Card in Sidebar */}
          <div className="bg-[#16191F] rounded-xl p-5 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Quick Knowledge Check
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  currentQuickCheck?.passed
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : isCurrentVideoCompleted
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                    : "bg-slate-900 text-slate-400"
                }`}
              >
                {currentQuickCheck?.passed
                  ? "Lolos 3/3 ✓"
                  : isCurrentVideoCompleted
                  ? "Siap Dikerjakan"
                  : "3 Soal Evaluasi"}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {currentQuickCheck?.passed
                ? `Alhamdulillah! Anda telah menguasai konsep inti Modul ${currentModule.moduleNumber}. Anda dapat mengulang mini-quiz sewaktu-waktu.`
                : `Evaluasi 3 soal pilihan ganda otomatis muncul setelah Anda menyelesaikan video modul.`}
            </p>

            <button
              id="btn-sidebar-open-qkc"
              onClick={() => setIsQuickCheckModalOpen(true)}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                currentQuickCheck?.passed
                  ? "bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {currentQuickCheck?.passed
                  ? "Review / Ulangi Mini-Quiz (3 Soal)"
                  : "Buka Quick Knowledge Check (3 Soal)"}
              </span>
            </button>
          </div>

          <div className="bg-[#16191F] rounded-xl p-5 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Daftar Topik Modul {currentModule.moduleNumber}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-900 font-semibold text-slate-400">
                Total {currentModule.jp} JP
              </span>
            </div>

            <div className="space-y-2">
              {currentModule.sections.map((section, idx) => {
                const isActive = section.id === currentSection.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`w-full text-left p-3 rounded-lg text-xs sm:text-sm transition-all flex items-start space-x-3 ${
                      isActive
                        ? "bg-slate-800/90 text-white border border-emerald-500/40 font-semibold"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                      isActive ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{section.title}</p>
                      <span className="text-[10px] text-slate-500">{section.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  if (!isCurrentModuleCompleted) {
                    // Trigger Quick Knowledge Check to verify knowledge upon completion!
                    setIsQuickCheckModalOpen(true);
                  } else {
                    onToggleModuleCompletion(currentModule.id);
                  }
                }}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  isCurrentModuleCompleted
                    ? "bg-slate-900 text-emerald-400 border border-emerald-500/30"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isCurrentModuleCompleted ? "Tandai Belum Selesai" : "Tandai Modul Selesai ✓"}
                </span>
              </button>
            </div>
          </div>

          {/* Practical Simulation Links */}
          <div className="bg-[#16191F] rounded-xl p-5 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Alat Praktek Terkait Modul
            </h3>
            <p className="text-xs text-slate-400">
              Gunakan simulator interaktif untuk menguji penerapan materi bisnis Anda secara langsung.
            </p>

            <div className="space-y-2">
              {currentModule.id === "modul-1" && (
                <button
                  onClick={() => onNavigateTab("bankable-calc")}
                  className="w-full text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between border border-slate-800 transition-colors"
                >
                  <span>Kalkulator 5C Bankable UMKM</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              )}
              {currentModule.id === "modul-2" && (
                <button
                  onClick={() => onNavigateTab("financing-sim")}
                  className="w-full text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between border border-slate-800 transition-colors"
                >
                  <span>Simulasi Pembiayaan Murabahah vs Bagi Hasil</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              )}
              {currentModule.id === "modul-4" && (
                <button
                  onClick={() => onNavigateTab("halal-tracker")}
                  className="w-full text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between border border-slate-800 transition-colors"
                >
                  <span>Audit Dokumen SJPH & SIHALAL Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              )}
              <button
                onClick={() => onNavigateTab("ai-advisor")}
                className="w-full text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between border border-slate-800 transition-colors"
              >
                <span>Konsultasi Syariah & Halal AI</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Video Module Player + Content Reader (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* VIDEO MODULE PLAYER SECTION */}
          <div
            id="video-module-player"
            className="bg-[#16191F] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl"
          >
            {/* Video Header Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Video Pembelajaran Modul {currentModule.moduleNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Durasi: {currentVideoInfo.durationFormatted}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  {currentVideoInfo.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Narasumber: <span className="text-slate-200 font-medium">{currentVideoInfo.instructorName}</span> ({currentVideoInfo.instructorTitle})
                </p>
              </div>

              {/* Status Badge & Fast Action */}
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                {isCurrentVideoCompleted ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Video Tuntas 100%</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                    {videoProgressPercent}% Ditonton
                  </span>
                )}

                <button
                  id="btn-fast-complete-video"
                  onClick={handleFastCompleteVideo}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Selesaikan video langsung dan buka Quick Knowledge Check"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selesaikan Video & Mini-Quiz</span>
                </button>
              </div>
            </div>

            {/* Notification Banner when video finishes */}
            {videoNotice && (
              <div className="bg-emerald-950/70 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>{videoNotice}</span>
                </div>
                <button
                  onClick={() => setIsQuickCheckModalOpen(true)}
                  className="underline font-bold hover:text-white"
                >
                  Buka Sekarang
                </button>
              </div>
            )}

            {/* Simulated 16:9 Video Canvas Stage */}
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group flex flex-col justify-between p-4 sm:p-6 select-none">
              {/* Video Backdrop & Graphics */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/30" />
              
              {/* Subtle Grid / Geometric Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Top Video Watermark & Lecture Card */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-left space-y-0.5 max-w-sm sm:max-w-md">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Materi Inti: {currentVideoInfo.thumbnailBadge}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                    {currentVideoInfo.lectureTopic}
                  </h4>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                  <span className="text-emerald-400 font-bold">7 JP</span>
                  <span>Kurikulum Standar</span>
                </div>
              </div>

              {/* Center Lecture Stage Visual & Big Play Button */}
              <div className="relative z-10 my-auto text-center space-y-4">
                <div className="inline-flex items-center justify-center">
                  <button
                    id="btn-center-play-video"
                    onClick={togglePlayVideo}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group-hover:ring-4 group-hover:ring-emerald-500/30"
                    title={isVideoPlaying ? "Jeda Video" : "Putar Video"}
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-7 h-7 sm:w-8 sm:h-8" />
                    ) : (
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" />
                    )}
                  </button>
                </div>

                {/* Animated Audio/Playback Waves while playing */}
                {isVideoPlaying && (
                  <div className="flex items-center justify-center gap-1 h-4">
                    <span className="w-1 bg-emerald-400 animate-pulse h-2 rounded" />
                    <span className="w-1 bg-emerald-400 animate-pulse h-4 rounded delay-75" />
                    <span className="w-1 bg-emerald-400 animate-pulse h-3 rounded delay-150" />
                    <span className="w-1 bg-emerald-400 animate-pulse h-4 rounded delay-100" />
                    <span className="w-1 bg-emerald-400 animate-pulse h-2 rounded" />
                  </div>
                )}
              </div>

              {/* Subtitles Overlay Bar */}
              {showSubtitles && (
                <div className="relative z-10 mx-auto max-w-xl text-center">
                  <div className="inline-block bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-100 shadow-lg leading-relaxed">
                    {activeSubtitle}
                  </div>
                </div>
              )}

              {/* Video Scrubber & Playback Controls Bar */}
              <div className="relative z-10 pt-3 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 px-4 py-3 sm:px-6">
                {/* Clickable Seek Bar */}
                <div
                  className="w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative mb-3 group/bar"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    handleSeek(pos * currentVideoInfo.totalDurationSeconds);
                  }}
                >
                  <div
                    className="h-full bg-emerald-500 transition-all rounded-full relative"
                    style={{ width: `${videoProgressPercent}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
                  </div>
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-xs text-slate-300">
                  {/* Left Controls: Play/Pause, Skip -10s, Skip +10s, Timecode */}
                  <div className="flex items-center gap-3">
                    <button
                      id="btn-ctrl-play"
                      onClick={togglePlayVideo}
                      className="text-white hover:text-emerald-400 transition-colors p-1"
                      title={isVideoPlaying ? "Jeda" : "Putar"}
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleSkipTime(-10)}
                      className="hover:text-white transition-colors p-1"
                      title="Mundur 10 detik"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleSkipTime(10)}
                      className="hover:text-white transition-colors p-1"
                      title="Maju 10 detik"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>

                    <span className="font-mono text-[11px] text-slate-400">
                      {formatSeconds(videoCurrentTime)} / {currentVideoInfo.durationFormatted}
                    </span>
                  </div>

                  {/* Right Controls: Speed, CC, Mute, Mini-Quiz Trigger */}
                  <div className="flex items-center gap-2.5">
                    {/* Speed Selector */}
                    <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                      {[1, 1.25, 1.5].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setVideoSpeed(spd)}
                          className={`px-1 rounded ${
                            videoSpeed === spd
                              ? "text-emerald-400 font-bold"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    {/* CC Subtitle Toggle */}
                    <button
                      onClick={() => setShowSubtitles((prev) => !prev)}
                      className={`p-1 rounded transition-colors ${
                        showSubtitles
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                      title="Tampilkan/Sembunyikan Subtitle Teks"
                    >
                      <Captions className="w-4 h-4" />
                    </button>

                    {/* Mute Toggle */}
                    <button
                      onClick={() => setIsMuted((prev) => !prev)}
                      className="p-1 hover:text-white transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quick Knowledge Check Prompt Banner */}
            <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {currentQuickCheck?.passed
                      ? `Knowledge Check Modul ${currentModule.moduleNumber}: Lolos ✓`
                      : `Selesaikan Video & Uji Pemahaman (3 Soal)`}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {currentQuickCheck?.passed
                      ? `Nilai: ${currentQuickCheck.score}% • Modul telah ditandai tuntas dalam kurikulum.`
                      : `Mini-quiz 3 soal pilihan ganda menguji konsep inti modul ${currentModule.moduleNumber}.`}
                  </p>
                </div>
              </div>

              <button
                id="btn-open-quick-check-modal"
                onClick={() => setIsQuickCheckModalOpen(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 ${
                  currentQuickCheck?.passed
                    ? "bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950"
                }`}
              >
                <Award className="w-4 h-4" />
                <span>
                  {currentQuickCheck?.passed
                    ? "Review / Ulangi Mini-Quiz"
                    : "Mulai Quick Knowledge Check (3 Soal)"}
                </span>
              </button>
            </div>
          </div>

          {/* DETAILED CONTENT READER & TTS NARRATION */}
          <div className="bg-[#16191F] rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl">
            {/* Top Reader Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Modul {currentModule.moduleNumber} • Bagian Terpilih
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {currentSection.title}
                </h2>
              </div>

              {/* TTS Audio Narration Button */}
              <button
                id="btn-voice-narration"
                onClick={handleToggleSpeech}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shrink-0 ${
                  isSpeaking
                    ? "bg-amber-500 text-white animate-pulse"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{isSpeaking ? "Hentikan Narasi Suara" : "Dengarkan Audio Narasi"}</span>
              </button>
            </div>

            {/* Main Content Paragraphs */}
            <div className="mt-5 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentSection.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Takeaways Box */}
            {currentSection.keyPoints && currentSection.keyPoints.length > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-slate-900 border-l-4 border-emerald-500 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Prinsip Kunci (Fiqih Muamalah & Bisnis)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentSection.keyPoints.map((point, kIdx) => (
                    <li key={kIdx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical Culinary Implementation Tips */}
            {currentSection.practicalTips && currentSection.practicalTips.length > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Penerapan Praktis untuk Usaha Makanan & Minuman:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentSection.practicalTips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Collapsible Sharia Q&A */}
            {currentSection.qna && currentSection.qna.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>Tanya Jawab Syariah & Fatwa Relevan</span>
                </div>

                {currentSection.qna.map((item, qIdx) => {
                  const isOpen = openQnaIndex === qIdx;
                  return (
                    <div
                      key={qIdx}
                      className="rounded-lg border border-slate-800 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenQnaIndex(isOpen ? null : qIdx)}
                        className="w-full text-left p-3.5 bg-slate-900 hover:bg-slate-850 font-bold text-xs sm:text-sm text-white flex items-center justify-between"
                      >
                        <span>{item.q}</span>
                        <span className="text-emerald-400 text-base">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen && (
                        <div className="p-3.5 bg-[#16191F] text-xs text-slate-300 leading-relaxed border-t border-slate-800">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK KNOWLEDGE CHECK MODAL */}
      <QuickKnowledgeCheckModal
        isOpen={isQuickCheckModalOpen}
        onClose={() => setIsQuickCheckModalOpen(false)}
        moduleId={currentModule.id}
        moduleTitle={currentModule.title}
        moduleNumber={currentModule.moduleNumber}
        onMarkModuleComplete={handleKnowledgeCheckPassed}
        hasNextModule={hasNextModule}
        onNextModule={handleGoToNextModule}
      />
    </div>
  );
};

