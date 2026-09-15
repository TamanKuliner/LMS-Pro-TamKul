export type Language = "id" | "en" | "ar";

export type TabType = 
  | "overview" 
  | "syllabus" 
  | "bankable-calc" 
  | "financing-sim" 
  | "halal-tracker" 
  | "quiz-test" 
  | "learning-analytics"
  | "ai-advisor" 
  | "cloud-infra";

export interface QuizAttempt {
  id: string;
  attemptNumber: number;
  title: string;
  date: string;
  fullDate: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  timeSpentMinutes: number;
  domainScores: {
    fiqihMuamalah: number;
    bankable5C: number;
    sjphHalal: number;
    akuntansiSyariah: number;
    pemasaranDigital: number;
  };
}

export interface ParticipantRequirement {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
}

export interface ModuleSection {
  id: string;
  title: string;
  duration: string;
  content: string[];
  keyPoints: string[];
  practicalTips: string[];
  qna: Array<{ q: string; a: string }>;
}

export interface SyllabusModule {
  id: string;
  moduleNumber: number;
  title: string;
  jp: number;
  level: string;
  description: string;
  sections: ModuleSection[];
  skillsGained: string[];
}

export interface QuizQuestion {
  id: number;
  moduleId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  citation: string;
}

export interface BankableEvaluation {
  characterScore: number; // 0-100
  capacityScore: number; // 0-100
  capitalScore: number; // 0-100
  collateralScore: number; // 0-100
  conditionScore: number; // 0-100
  notes: string;
}

export interface CloudNode {
  id: string;
  provider: "Google Cloud" | "AWS" | "Microsoft Azure";
  region: string;
  latency: number;
  status: "healthy" | "degraded" | "standby";
  trafficShare: number;
  load: number;
}

export interface CicdPipeline {
  id: string;
  branch: string;
  commit: string;
  status: "success" | "running" | "failed";
  duration: string;
  timestamp: string;
  author: string;
}

export interface AnomalyAlert {
  id: string;
  level: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface LiveTelemetry {
  cpuPercentage: number;
  memoryPercentage: number;
  averageLatencyMs: number;
  requestsPerSec: number;
  activeLearners: number;
  e2eePacketsSecured: number;
}

export interface ThirdPartyIntegration {
  id: string;
  name: string;
  type: string;
  status: "connected" | "active" | "error" | "syncing";
  ping: string;
  lastSync: string;
}

export interface PushNotificationConfig {
  systemAnomalies: boolean;
  highLatencyAlerts: boolean;
  cicdDeployments: boolean;
  syllabusDeadlines: boolean;
  halalAuditStatus: boolean;
  financingProposals: boolean;
  soundAlerts: boolean;
  frequency: "instant" | "hourly-digest" | "daily-summary";
}

export interface HalalChecklistItem {
  id: string;
  category: 
    | "Bahan Baku"
    | "Proses Produksi"
    | "Peralatan"
    | "Legalitas & Personel"
    | "Legalitas"
    | "Personel"
    | "Bahan"
    | "Fasilitas"
    | "Prosedur"
    | string;
  title: string;
  desc: string;
  checked: boolean;
  required: boolean;
  deadline?: string; // Target completion date in ISO format YYYY-MM-DD
  notes?: string;
  notesUpdatedAt?: string;
  pendingSince?: string; // ISO timestamp recording when item became pending / unchecked
}

export interface HalalReminderConfig {
  enabled: boolean;
  thresholdHours: number; // default 48 hours
  checkIntervalMinutes: number; // Interval for background check, default 60
  lastNotifiedAt?: string | null;
  notificationCount: number;
}

export interface PendingItemAudit {
  item: HalalChecklistItem;
  hoursPending: number;
  isOverdue48h: boolean;
  pendingSinceFormatted: string;
}

export interface ParticipantProfile {
  id?: string;
  fullName: string;
  businessName: string;
  culinaryCategory: string;
  age?: number;
  phone: string;
  email: string;
  city?: string;
  address?: string;
  hasNIB: boolean;
  nibNumber: string;
  currentMonthlyRevenue: number;
  onlineChannels?: string[];
  isVerified: boolean;
  e2eeEncryptedKey?: string;
  monthlyLearningGoalJP?: number; // Target Jam Pelajaran (JP) per bulan (default 7 JP)
  monthlyGoalMonth?: string; // Bulan target, misal 'September 2026'
  monthlyGoalFocus?: string; // Fokus prioritas belajar bulan ini
}

export type BadgeTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "legendary";

export type BadgeCategory = "all" | "academic" | "exam" | "syariah" | "speed";

export interface DigitalBadge {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  criteria: string;
  tier: BadgeTier;
  category: BadgeCategory;
  iconName: "zap" | "shield-check" | "award" | "book-open" | "calculator" | "coins" | "trophy" | "star" | "trending-up" | "sparkles";
  points: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: {
    current: number;
    max: number;
    unit: string;
    percentage: number;
  };
  hashProof?: string;
}
