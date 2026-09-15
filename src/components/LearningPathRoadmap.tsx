import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  ArrowRight,
  BookOpen,
  Award,
  ShieldCheck,
  Layers,
  Sparkles,
  Clock,
  Compass,
  Check,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  ExternalLink,
  Zap,
  Info,
  SlidersHorizontal,
  FileCheck2,
  GraduationCap
} from "lucide-react";
import { syllabusModules } from "../data/syllabusData";
import { Language, TabType } from "../types";

export interface LearningPathRoadmapProps {
  language: Language;
  completedModuleIds: string[];
  onToggleModuleCompletion?: (moduleId: string) => void;
  onNavigateTab: (tab: TabType) => void;
  onSelectModule?: (moduleId: string) => void;
  hasPassedExam?: boolean;
  businessName?: string;
  onOpenCertificate?: () => void;
  onResetModules?: () => void;
  onCompleteAllModules?: () => void;
}

export interface RoadmapNode {
  id: string;
  type: "module" | "capstone";
  stepNumber: number;
  moduleNumber?: number;
  title: string;
  shortTitle: string;
  jp: number;
  level: string;
  category: string;
  description: string;
  prerequisiteId?: string;
  prerequisiteTitle?: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  relatedTab: TabType;
  relatedToolName: string;
  skillsGained: string[];
  topicsCount: number;
  estimatedDuration: string;
  colorTheme: {
    accent: string;
    border: string;
    bg: string;
    text: string;
  };
}

export const LearningPathRoadmap: React.FC<LearningPathRoadmapProps> = ({
  language,
  completedModuleIds = ["modul-1"],
  onToggleModuleCompletion,
  onNavigateTab,
  onSelectModule,
  hasPassedExam = false,
  businessName = "UMKM Kuliner",
  onOpenCertificate,
  onResetModules,
  onCompleteAllModules,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("modul-1");
  const [filterMode, setFilterMode] = useState<"all" | "in_progress" | "completed" | "locked">("all");
  const [viewLayout, setViewLayout] = useState<"roadmap" | "timeline">("roadmap");
  const [showDemoControls, setShowDemoControls] = useState<boolean>(false);

  // Build the 5 sequential roadmap nodes (4 modules + 1 capstone milestone)
  const roadmapNodes: RoadmapNode[] = useMemo(() => {
    // Module 1 is always unlocked
    const isM1Completed = completedModuleIds.includes("modul-1");

    // Module 2 is unlocked if Module 1 is completed
    const isM2Unlocked = isM1Completed;
    const isM2Completed = completedModuleIds.includes("modul-2");

    // Module 3 is unlocked if Module 2 is completed
    const isM3Unlocked = isM2Completed;
    const isM3Completed = completedModuleIds.includes("modul-3");

    // Module 4 is unlocked if Module 3 is completed
    const isM4Unlocked = isM3Completed;
    const isM4Completed = completedModuleIds.includes("modul-4");

    // Capstone is unlocked if all 4 modules are completed
    const isCapstoneUnlocked = isM1Completed && isM2Completed && isM3Completed && isM4Completed;
    const isCapstoneCompleted = hasPassedExam;

    // Determine current active node (the first unlocked but not completed node)
    let currentNodeId = "modul-1";
    if (!isM1Completed) {
      currentNodeId = "modul-1";
    } else if (!isM2Completed) {
      currentNodeId = "modul-2";
    } else if (!isM3Completed) {
      currentNodeId = "modul-3";
    } else if (!isM4Completed) {
      currentNodeId = "modul-4";
    } else if (!isCapstoneCompleted) {
      currentNodeId = "milestone-capstone";
    } else {
      currentNodeId = "milestone-capstone";
    }

    const m1 = syllabusModules.find((m) => m.id === "modul-1")!;
    const m2 = syllabusModules.find((m) => m.id === "modul-2")!;
    const m3 = syllabusModules.find((m) => m.id === "modul-3")!;
    const m4 = syllabusModules.find((m) => m.id === "modul-4")!;

    return [
      {
        id: "modul-1",
        type: "module",
        stepNumber: 1,
        moduleNumber: 1,
        title: m1.title,
        shortTitle: "Prinsip & Etika Syariah",
        jp: 1,
        level: m1.level,
        category: "Fondasi Bisnis & Fiqih",
        description: m1.description,
        prerequisiteId: undefined,
        prerequisiteTitle: undefined,
        isUnlocked: true,
        isCompleted: isM1Completed,
        isCurrent: currentNodeId === "modul-1",
        relatedTab: "bankable-calc",
        relatedToolName: "Kalkulator 5C Bankable",
        skillsGained: m1.skillsGained,
        topicsCount: m1.sections.length,
        estimatedDuration: "1 JP (45 Menit)",
        colorTheme: {
          accent: "emerald",
          border: "border-emerald-500",
          bg: "bg-emerald-500/10",
          text: "text-emerald-400",
        },
      },
      {
        id: "modul-2",
        type: "module",
        stepNumber: 2,
        moduleNumber: 2,
        title: m2.title,
        shortTitle: "Akuntansi & Fintech Syariah",
        jp: 2,
        level: m2.level,
        category: "Keuangan & Tata Kelola",
        description: m2.description,
        prerequisiteId: "modul-1",
        prerequisiteTitle: "Modul 1: Prinsip & Etika Bisnis Islam",
        isUnlocked: isM2Unlocked,
        isCompleted: isM2Completed,
        isCurrent: currentNodeId === "modul-2",
        relatedTab: "financing-sim",
        relatedToolName: "Simulasi Pembiayaan Syariah",
        skillsGained: m2.skillsGained,
        topicsCount: m2.sections.length,
        estimatedDuration: "2 JP (90 Menit)",
        colorTheme: {
          accent: "teal",
          border: "border-teal-500",
          bg: "bg-teal-500/10",
          text: "text-teal-400",
        },
      },
      {
        id: "modul-3",
        type: "module",
        stepNumber: 3,
        moduleNumber: 3,
        title: m3.title,
        shortTitle: "Pemasaran Digital Amanah",
        jp: 2,
        level: m3.level,
        category: "Pemasaran & Akselerasi",
        description: m3.description,
        prerequisiteId: "modul-2",
        prerequisiteTitle: "Modul 2: Akuntansi Digital & Fintech",
        isUnlocked: isM3Unlocked,
        isCompleted: isM3Completed,
        isCurrent: currentNodeId === "modul-3",
        relatedTab: "ai-advisor",
        relatedToolName: "AI Konsultan Syariah",
        skillsGained: m3.skillsGained,
        topicsCount: m3.sections.length,
        estimatedDuration: "2 JP (90 Menit)",
        colorTheme: {
          accent: "sky",
          border: "border-sky-500",
          bg: "bg-sky-500/10",
          text: "text-sky-400",
        },
      },
      {
        id: "modul-4",
        type: "module",
        stepNumber: 4,
        moduleNumber: 4,
        title: m4.title,
        shortTitle: "Sertifikasi Halal BPJPH",
        jp: 2,
        level: m4.level,
        category: "Kepatuhan & Sertifikasi",
        description: m4.description,
        prerequisiteId: "modul-3",
        prerequisiteTitle: "Modul 3: Pemasaran Digital Syariah",
        isUnlocked: isM4Unlocked,
        isCompleted: isM4Completed,
        isCurrent: currentNodeId === "modul-4",
        relatedTab: "halal-tracker",
        relatedToolName: "Tracker Kesiapan Halal SJPH",
        skillsGained: m4.skillsGained,
        topicsCount: m4.sections.length,
        estimatedDuration: "2 JP (90 Menit)",
        colorTheme: {
          accent: "amber",
          border: "border-amber-500",
          bg: "bg-amber-500/10",
          text: "text-amber-400",
        },
      },
      {
        id: "milestone-capstone",
        type: "capstone",
        stepNumber: 5,
        title: "Ujian Evaluasi Substansi & Kelulusan E-Sertifikat",
        shortTitle: "Evaluasi Kelulusan 7 JP",
        jp: 0,
        level: "Ujian Akhir Kompetensi",
        category: "Kelulusan & Kredensial",
        description:
          "Ujian evaluasi kelulusan 10 soal komprehensif untuk menguji seluruh materi 7 JP dan menerbitkan E-Sertifikat Digital E2EE Terverifikasi.",
        prerequisiteId: "modul-4",
        prerequisiteTitle: "Modul 1 s.d. 4 (Tuntas 7 JP)",
        isUnlocked: isCapstoneUnlocked,
        isCompleted: isCapstoneCompleted,
        isCurrent: currentNodeId === "milestone-capstone",
        relatedTab: "quiz-test",
        relatedToolName: "Test Substansi 10 Soal",
        skillsGained: [
          "Verifikasi Kelulusan 7 JP",
          "Kredensial Digital E2EE",
          "Kesiapan Akses Permodalan Bankable",
        ],
        topicsCount: 10,
        estimatedDuration: "20 Menit (10 Soal)",
        colorTheme: {
          accent: "purple",
          border: "border-purple-500",
          bg: "bg-purple-500/10",
          text: "text-purple-400",
        },
      },
    ];
  }, [completedModuleIds, hasPassedExam]);

  // Active inspected node object
  const activeNode = useMemo(() => {
    return roadmapNodes.find((n) => n.id === selectedNodeId) || roadmapNodes[0];
  }, [roadmapNodes, selectedNodeId]);

  // Overall metrics calculation
  const metrics = useMemo(() => {
    const completedModules = roadmapNodes.filter((n) => n.type === "module" && n.isCompleted).length;
    const completedJp = roadmapNodes
      .filter((n) => n.type === "module" && n.isCompleted)
      .reduce((sum, n) => sum + n.jp, 0);
    const totalJp = 7;
    const progressPercent = Math.round((completedJp / totalJp) * 100);

    const currentNode = roadmapNodes.find((n) => n.isCurrent) || roadmapNodes[0];

    return {
      completedModules,
      completedJp,
      totalJp,
      progressPercent,
      currentNode,
      allModulesCompleted: completedModules === 4,
    };
  }, [roadmapNodes]);

  // Filtering for display
  const filteredNodes = useMemo(() => {
    if (filterMode === "completed") return roadmapNodes.filter((n) => n.isCompleted);
    if (filterMode === "in_progress") return roadmapNodes.filter((n) => n.isUnlocked && !n.isCompleted);
    if (filterMode === "locked") return roadmapNodes.filter((n) => !n.isUnlocked);
    return roadmapNodes;
  }, [roadmapNodes, filterMode]);

  // Handler to open module in course player
  const handleLaunchModule = (node: RoadmapNode) => {
    if (!node.isUnlocked) return;
    if (node.type === "capstone") {
      onNavigateTab("quiz-test");
      return;
    }
    if (onSelectModule) {
      onSelectModule(node.id);
    }
    onNavigateTab("syllabus");
  };

  return (
    <div
      id="learning-path-roadmap-section"
      className="bg-[#16191F] rounded-2xl border border-slate-800 shadow-2xl p-4 sm:p-6 space-y-6 text-slate-300"
    >
      {/* 1. Header & Progress Overview Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Alur Belajar Terarah • 7 Jam Pelajaran (JP)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Peta Jalur Pembelajaran Digital UMKM Syariah</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Panduan kurikulum interaktif berurutan untuk {businessName}. Setiap modul membuka modul berikutnya saat diselesaikan, memastikan kesiapan holistik dari akad muamalah, pembukuan, hingga sertifikasi halal BPJPH.
          </p>
        </div>

        {/* Global Progress Metrics Box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
          <div className="space-y-1 min-w-[160px]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Progres Kurikulum</span>
              <span className="text-emerald-400 font-bold font-mono">{metrics.progressPercent}%</span>
            </div>
            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${metrics.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{metrics.completedJp} dari {metrics.totalJp} JP Tuntas</span>
              <span>{metrics.completedModules} / 4 Modul</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          {/* Current Focus CTA */}
          <div>
            <button
              id="btn-continue-roadmap"
              onClick={() => handleLaunchModule(metrics.currentNode)}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {metrics.allModulesCompleted
                  ? hasPassedExam
                    ? "Buka E-Sertifikat"
                    : "Mulai Ujian Akhir"
                  : `Lanjut ${metrics.currentNode.shortTitle}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1 rounded-md transition-all font-semibold ${
              filterMode === "all" ? "bg-slate-700 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Semua Tahap ({roadmapNodes.length})
          </button>
          <button
            onClick={() => setFilterMode("in_progress")}
            className={`px-3 py-1 rounded-md transition-all font-semibold ${
              filterMode === "in_progress" ? "bg-slate-700 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sedang Berjalan ({roadmapNodes.filter((n) => n.isUnlocked && !n.isCompleted).length})
          </button>
          <button
            onClick={() => setFilterMode("completed")}
            className={`px-3 py-1 rounded-md transition-all font-semibold ${
              filterMode === "completed" ? "bg-slate-700 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Selesai ({roadmapNodes.filter((n) => n.isCompleted).length})
          </button>
          <button
            onClick={() => setFilterMode("locked")}
            className={`px-3 py-1 rounded-md transition-all font-semibold ${
              filterMode === "locked" ? "bg-slate-700 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Terkunci ({roadmapNodes.filter((n) => !n.isUnlocked).length})
          </button>
        </div>

        {/* View Mode & Simulation Tools */}
        <div className="flex items-center gap-2">
          {/* Layout Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewLayout("roadmap")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                viewLayout === "roadmap" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Tampilan Peta Alur Interaktif dengan Garis Penghubung"
            >
              Peta Alur
            </button>
            <button
              onClick={() => setViewLayout("timeline")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                viewLayout === "timeline" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Tampilan Garis Waktu Linier Bertingkat"
            >
              Timeline
            </button>
          </div>

          {/* Fast Simulation Toggle */}
          <button
            onClick={() => setShowDemoControls(!showDemoControls)}
            className={`px-2.5 py-1.5 rounded-lg border transition-all flex items-center space-x-1 font-medium ${
              showDemoControls
                ? "bg-slate-800 border-slate-700 text-slate-200"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300"
            }`}
            title="Buka panel simulasi buka/kunci progres"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Uji Buka/Kunci</span>
          </button>
        </div>
      </div>

      {/* Optional Demo / Simulation Controls Banner */}
      {showDemoControls && (
        <div className="p-3 bg-slate-900/90 rounded-xl border border-dashed border-emerald-500/40 text-xs flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center space-x-2 text-slate-300">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Simulasi Progres Interaktif:</strong> Uji perubahan status dan jalur visual dari terkunci menjadi terbuka/selesai seketika:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (onCompleteAllModules) {
                  onCompleteAllModules();
                } else if (onToggleModuleCompletion) {
                  ["modul-1", "modul-2", "modul-3", "modul-4"].forEach((m) => {
                    if (!completedModuleIds.includes(m)) onToggleModuleCompletion(m);
                  });
                }
              }}
              className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-semibold transition-all"
            >
              ✓ Buka & Tuntaskan Semua Modul
            </button>
            <button
              onClick={() => {
                if (onResetModules) {
                  onResetModules();
                } else if (onToggleModuleCompletion) {
                  completedModuleIds.forEach((m) => onToggleModuleCompletion(m));
                }
              }}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold transition-all flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset ke Modul 1 Saja</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. VISUAL ROADMAP PRESENTATION (Horizontal Connected Grid on Desktop, Vertical Connected on Mobile) */}
      {viewLayout === "roadmap" ? (
        <div className="relative pt-2">
          {/* Desktop SVG Visual Connectors Layer (Displayed on >= md) */}
          <div className="hidden lg:block relative mb-8">
            {/* SVG Connecting Track bridging between the 5 nodes */}
            <svg
              className="w-full h-12 overflow-visible"
              viewBox="0 0 1000 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id="activeEnergyFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Segments between Nodes */}
              {/* Centers of 5 nodes across 1000px: 100, 300, 500, 700, 900 */}
              {[
                { fromIndex: 0, toIndex: 1, x1: 100, x2: 300 },
                { fromIndex: 1, toIndex: 2, x1: 300, x2: 500 },
                { fromIndex: 2, toIndex: 3, x1: 500, x2: 700 },
                { fromIndex: 3, toIndex: 4, x1: 700, x2: 900 },
              ].map((seg, idx) => {
                const sourceNode = roadmapNodes[seg.fromIndex];
                const targetNode = roadmapNodes[seg.toIndex];

                const isConnectedCompleted = sourceNode.isCompleted && targetNode.isCompleted;
                const isConnectedActive = sourceNode.isCompleted && targetNode.isUnlocked && !targetNode.isCompleted;
                const isLocked = !targetNode.isUnlocked;

                return (
                  <g key={idx}>
                    {/* Background track line */}
                    <line
                      x1={seg.x1 + 24}
                      y1={24}
                      x2={seg.x2 - 24}
                      y2={24}
                      stroke="#1e293b"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* Dynamic state connector */}
                    {isConnectedCompleted && (
                      <line
                        x1={seg.x1 + 24}
                        y1={24}
                        x2={seg.x2 - 24}
                        y2={24}
                        stroke="url(#emeraldGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />
                    )}

                    {isConnectedActive && (
                      <>
                        <line
                          x1={seg.x1 + 24}
                          y1={24}
                          x2={seg.x2 - 24}
                          y2={24}
                          stroke="url(#activeEnergyFlow)"
                          strokeWidth="4"
                          strokeDasharray="8 6"
                          strokeLinecap="round"
                          className="animate-pulse"
                          filter="url(#glow)"
                        />
                        {/* Animated flowing energy particle */}
                        <circle
                          cx={(seg.x1 + seg.x2) / 2}
                          y={24}
                          r="4"
                          fill="#38bdf8"
                          className="animate-ping"
                        />
                      </>
                    )}

                    {isLocked && (
                      <line
                        x1={seg.x1 + 24}
                        y1={24}
                        x2={seg.x2 - 24}
                        y2={24}
                        stroke="#334155"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                      />
                    )}
                  </g>
                );
              })}

              {/* Node Checkpoint Badges on the Track */}
              {roadmapNodes.map((node, nIdx) => {
                const cx = 100 + nIdx * 200;
                const cy = 24;
                const isSelected = selectedNodeId === node.id;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Outer glow ring if current or selected */}
                    {(node.isCurrent || isSelected) && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="24"
                        fill="none"
                        stroke={node.isCompleted ? "#10b981" : "#0ea5e9"}
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="animate-spin"
                        style={{ animationDuration: "12s" }}
                        opacity="0.6"
                      />
                    )}

                    {/* Center Node Circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="18"
                      fill={
                        node.isCompleted
                          ? "#064e3b"
                          : node.isUnlocked
                          ? "#0c4a6e"
                          : "#0f172a"
                      }
                      stroke={
                        node.isCompleted
                          ? "#10b981"
                          : node.isUnlocked
                          ? "#38bdf8"
                          : "#334155"
                      }
                      strokeWidth={isSelected ? "3" : "2"}
                    />

                    {/* Step Number or Status Mark in SVG */}
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fill={
                        node.isCompleted
                          ? "#a7f3d0"
                          : node.isUnlocked
                          ? "#bae6fd"
                          : "#64748b"
                      }
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {node.isCompleted ? "✓" : node.type === "capstone" ? "★" : node.stepNumber}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 5 Milestone Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;

              return (
                <div
                  key={node.id}
                  id={`roadmap-node-card-${node.id}`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`relative rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between border ${
                    isSelected
                      ? "ring-2 ring-emerald-400 bg-slate-900 shadow-xl border-emerald-500/80"
                      : node.isCompleted
                      ? "bg-[#16191F] border-emerald-500/30 hover:border-emerald-500/60"
                      : node.isUnlocked
                      ? "bg-[#16191F] border-sky-500/30 hover:border-sky-500/60"
                      : "bg-[#111317]/80 border-slate-800/80 opacity-75 hover:opacity-90"
                  }`}
                >
                  {/* Top Row: Milestone Step & Status Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 border ${
                            node.isCompleted
                              ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                              : node.isUnlocked
                              ? "bg-sky-950 border-sky-500 text-sky-300"
                              : "bg-slate-900 border-slate-700 text-slate-500"
                          }`}
                        >
                          {node.isCompleted ? "✓" : node.stepNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                          {node.type === "capstone" ? "Capstone" : `Modul ${node.moduleNumber}`}
                        </span>
                      </div>

                      {/* Status Pill */}
                      {node.isCompleted ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Selesai</span>
                        </span>
                      ) : node.isUnlocked ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-950/80 text-sky-300 border border-sky-500/40 animate-pulse">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>{node.isCurrent ? "Sedang Berjalan" : "Terbuka"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                          <Lock className="w-2.5 h-2.5 text-slate-500" />
                          <span>Terkunci</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${
                        node.isUnlocked ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {node.title}
                    </h3>

                    {/* JP Duration & Category */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {node.jp > 0 && (
                        <span className="inline-flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{node.jp} JP</span>
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-400">
                        {node.category}
                      </span>
                    </div>

                    {/* Prerequisite Note if Locked */}
                    {!node.isUnlocked && (
                      <div className="mt-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] text-amber-400/90 flex items-start space-x-1.5">
                        <Lock className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                        <span>Prasyarat: Selesaikan {node.prerequisiteTitle}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Quick Actions */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex flex-col gap-2">
                    {/* Primary Button */}
                    {node.isUnlocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchModule(node);
                        }}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                          node.isCompleted
                            ? "bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                        }`}
                      >
                        <span>
                          {node.type === "capstone"
                            ? node.isCompleted
                              ? "Tinjau Hasil Ujian"
                              : "Mulai Ujian"
                            : node.isCompleted
                            ? "Ulas Kembali"
                            : "Mulai Belajar"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="w-full py-1.5 px-2 rounded-lg text-[11px] font-medium bg-slate-900 text-slate-500 text-center border border-slate-800 flex items-center justify-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Terkunci</span>
                      </div>
                    )}

                    {/* Inline Completion Toggle (for modules) */}
                    {node.type === "module" && onToggleModuleCompletion && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleModuleCompletion(node.id);
                        }}
                        className={`w-full py-1 px-2 rounded text-[10px] font-medium transition-all flex items-center justify-center space-x-1 ${
                          node.isCompleted
                            ? "text-slate-400 hover:text-rose-400 hover:bg-slate-800/60"
                            : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30"
                        }`}
                        title="Tandai modul sudah atau belum diselesaikan"
                      >
                        <Check className="w-3 h-3" />
                        <span>{node.isCompleted ? "Batal Selesai" : "Tandai Selesai"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 4. ALTERNATIVE TIMELINE VIEW (Vertical with Connecting Spine) */
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {filteredNodes.map((node, idx) => {
            const isSelected = selectedNodeId === node.id;

            return (
              <div
                key={node.id}
                id={`timeline-node-${node.id}`}
                onClick={() => setSelectedNodeId(node.id)}
                className={`relative rounded-xl p-4 transition-all cursor-pointer border ${
                  isSelected
                    ? "ring-2 ring-emerald-400 bg-slate-900 border-emerald-500 shadow-xl"
                    : node.isCompleted
                    ? "bg-[#16191F] border-emerald-500/30 hover:border-emerald-500/60"
                    : node.isUnlocked
                    ? "bg-[#16191F] border-sky-500/30 hover:border-sky-500/60"
                    : "bg-[#111317]/80 border-slate-800 opacity-75"
                }`}
              >
                {/* Node icon on the timeline spine */}
                <div
                  className={`absolute -left-9 sm:-left-11 top-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2 transition-all ${
                    node.isCompleted
                      ? "bg-emerald-900 border-emerald-500 text-emerald-300 shadow-md"
                      : node.isUnlocked
                      ? "bg-sky-900 border-sky-400 text-sky-200 ring-2 ring-sky-500/30 animate-pulse"
                      : "bg-slate-900 border-slate-700 text-slate-500"
                  }`}
                >
                  {node.isCompleted ? "✓" : node.stepNumber}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        Tahap {node.stepNumber} • {node.type === "capstone" ? "Ujian Akhir" : `${node.jp} JP`}
                      </span>
                      {node.isCompleted ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          Selesai
                        </span>
                      ) : node.isUnlocked ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/40">
                          Siap Dimulai
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Terkunci
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">{node.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{node.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {node.isUnlocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchModule(node);
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center space-x-1"
                      >
                        <span>{node.isCompleted ? "Ulas Modul" : "Mulai Belajar"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <Lock className="w-3 h-3" />
                        <span>Selesaikan Tahap {node.stepNumber - 1}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. INTERACTIVE NODE INSPECTOR (Details for selected node) */}
      <div
        id="roadmap-node-inspector"
        className="mt-6 p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                activeNode.isCompleted
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : activeNode.isUnlocked
                  ? "bg-sky-500/10 border-sky-500/40 text-sky-400"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              {activeNode.type === "capstone" ? (
                <Award className="w-5 h-5" />
              ) : activeNode.isCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : activeNode.isUnlocked ? (
                <BookOpen className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Tahap {activeNode.stepNumber}: {activeNode.type === "capstone" ? "Capstone" : `Modul ${activeNode.moduleNumber}`}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {activeNode.estimatedDuration}
                </span>
                {activeNode.isCompleted && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40">
                    ✓ Tuntas Diselesaikan
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {activeNode.title}
              </h3>
            </div>
          </div>

          {/* Action CTAs for the inspected node */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Practical tool shortcut */}
            <button
              onClick={() => onNavigateTab(activeNode.relatedTab)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 flex items-center space-x-1.5 transition-all"
              title={`Buka perangkat praktik: ${activeNode.relatedToolName}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{activeNode.relatedToolName}</span>
            </button>

            {/* Launch module button */}
            {activeNode.isUnlocked ? (
              <button
                onClick={() => handleLaunchModule(activeNode)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center space-x-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {activeNode.type === "capstone"
                    ? activeNode.isCompleted
                      ? "Lihat Riwayat Ujian"
                      : "Buka Test Substansi"
                    : activeNode.isCompleted
                    ? "Buka Materi Modul"
                    : "Mulai Pelajari Modul"}
                </span>
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-500 flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Terkunci (Selesaikan Prasyarat)</span>
              </span>
            )}

            {/* Toggle completion for this node */}
            {activeNode.type === "module" && onToggleModuleCompletion && (
              <button
                onClick={() => onToggleModuleCompletion(activeNode.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center space-x-1"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                <span>{activeNode.isCompleted ? "Batal Selesai" : "Tandai Selesai"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Node Details: Description, Syllabus Topics, & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Col 1: Overview */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Ringkasan Capaian:
            </span>
            <p className="text-slate-300 leading-relaxed">{activeNode.description}</p>
            {activeNode.prerequisiteTitle && (
              <div className="pt-2 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Prasyarat Terbuka:</span>{" "}
                {activeNode.prerequisiteTitle}
              </div>
            )}
          </div>

          {/* Col 2: Topics Breakdown */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Topik & Silabus ({activeNode.topicsCount} Bagian):
            </span>
            {activeNode.type === "module" ? (
              <div className="space-y-1.5">
                {syllabusModules
                  .find((m) => m.id === activeNode.id)
                  ?.sections.map((sec, sIdx) => (
                    <div
                      key={sec.id}
                      className="p-2 rounded bg-slate-900/60 border border-slate-800/60 text-slate-300 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono ml-2">
                        {sec.duration}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 space-y-1">
                <div className="font-semibold text-white">10 Butir Soal Evaluasi Substansi</div>
                <div className="text-[11px] text-slate-400">
                  Standar kelulusan nilai minimal 80 untuk penerbitan E-Sertifikat Digital E2EE Terverifikasi.
                </div>
              </div>
            )}
          </div>

          {/* Col 3: Competencies & Skills Gained */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Kompetensi Yang Dikuasai:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeNode.skillsGained.map((skill, skIdx) => (
                <span
                  key={skIdx}
                  className="px-2 py-1 rounded-md bg-slate-900 text-emerald-300 border border-slate-800 text-[11px] flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>

            {/* Quick Helper Note */}
            <div className="mt-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>
                Menuntaskan tahapan ini secara berurutan membuka kredensial bankable dan kepatuhan syariah bagi {businessName}.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
