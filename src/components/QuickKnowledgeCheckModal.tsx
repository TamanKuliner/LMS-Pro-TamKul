import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  X,
  Sparkles,
  BookOpen,
  Check,
  ChevronRight,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import {
  QuickKnowledgeQuestion,
  quickKnowledgeQuestionsByModule,
} from "../data/quickKnowledgeCheckData";
import { triggerAllModulesCompletedConfetti } from "../utils/confetti";

export interface QuickKnowledgeCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  moduleTitle: string;
  moduleNumber: number;
  onMarkModuleComplete?: (moduleId: string) => void;
  onNextModule?: () => void;
  hasNextModule?: boolean;
}

export const QuickKnowledgeCheckModal: React.FC<QuickKnowledgeCheckModalProps> = ({
  isOpen,
  onClose,
  moduleId,
  moduleTitle,
  moduleNumber,
  onMarkModuleComplete,
  onNextModule,
  hasNextModule = false,
}) => {
  const questions: QuickKnowledgeQuestion[] =
    quickKnowledgeQuestionsByModule[moduleId] || quickKnowledgeQuestionsByModule["modul-1"];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [hasTriggeredCompletion, setHasTriggeredCompletion] = useState<boolean>(false);

  // Reset state when modal opens or moduleId changes
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setHasTriggeredCompletion(false);
    }
  }, [isOpen, moduleId]);

  if (!isOpen) return null;

  const currentQ = questions[currentQuestionIndex];
  const totalQuestions = questions.length; // Always 3
  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === totalQuestions;

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optIdx,
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    return {
      correctCount,
      totalCount: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100),
      passed: correctCount >= 2, // 2 of 3 = 67% pass threshold
    };
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const result = calculateScore();

    if (result.passed) {
      try {
        triggerAllModulesCompletedConfetti();
      } catch (e) {}

      // Save pass record in local storage
      try {
        const stored = JSON.parse(localStorage.getItem("tk_quick_checks") || "{}");
        stored[moduleId] = {
          passed: true,
          score: result.percentage,
          correctCount: result.correctCount,
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem("tk_quick_checks", JSON.stringify(stored));
      } catch (e) {}

      // Mark module complete in main app state
      if (onMarkModuleComplete && !hasTriggeredCompletion) {
        onMarkModuleComplete(moduleId);
        setHasTriggeredCompletion(true);
      }
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const result = isSubmitted ? calculateScore() : null;

  return (
    <div
      id="quick-knowledge-check-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="quick-knowledge-check-modal"
        className="bg-[#141820] border border-slate-700/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-blue-950/40 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner shrink-0 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Quick Knowledge Check • Modul {moduleNumber}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                  3 Soal Mini-Quiz
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1 leading-tight">
                {moduleTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Progress Tracker Bar */}
        {!isSubmitted && (
          <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Pertanyaan</span>
              <strong className="text-xs text-white">
                {currentQuestionIndex + 1} dari {totalQuestions}
              </strong>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5">
              {questions.map((_, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isDone = selectedAnswers[idx] !== undefined;

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-2 rounded-full transition-all ${
                      isCurrent
                        ? "bg-emerald-500 w-8"
                        : isDone
                        ? "bg-emerald-700"
                        : "bg-slate-800"
                    }`}
                    title={`Pindah ke Soal ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-200">
          {!isSubmitted ? (
            /* ACTIVE QUIZ QUESTION VIEW */
            <div className="space-y-5">
              {/* Question Box */}
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>Soal {currentQuestionIndex + 1}</span>
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  const optionLetters = ["A", "B", "C", "D"];

                  return (
                    <button
                      key={optIdx}
                      id={`qkc-opt-${optIdx}`}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-emerald-950/40 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/40"
                          : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 shadow-sm"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {optionLetters[optIdx]}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* QUIZ RESULTS & EXPLANATIONS VIEW */
            <div className="space-y-5">
              {/* Score Hero Banner */}
              <div
                className={`p-5 rounded-2xl border text-center space-y-2 relative overflow-hidden ${
                  result?.passed
                    ? "bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/50 shadow-xl"
                    : "bg-gradient-to-b from-amber-950/50 to-slate-900 border-amber-500/40 shadow-xl"
                }`}
              >
                <div className="inline-flex p-3 rounded-full bg-slate-900 border border-slate-800 mb-1">
                  {result?.passed ? (
                    <Award className="w-8 h-8 text-emerald-400 animate-bounce" />
                  ) : (
                    <RotateCcw className="w-8 h-8 text-amber-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {result?.passed
                      ? "Alhamdulillah! Anda Lolos Quick Knowledge Check"
                      : "Belum Mencapai Passing Grade (Min. 2/3)"}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    {result?.passed
                      ? `Selamat! Anda berhasil menjawab ${result.correctCount} dari ${result.totalCount} soal dengan benar (${result.percentage}%). Modul telah ditandai tuntas!`
                      : `Anda menjawab ${result?.correctCount} dari ${result?.totalCount} soal (${result?.percentage}%). Pelajari kembali penjelasan materi dan coba lagi.`}
                  </p>
                </div>

                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-emerald-400 mt-2">
                  <span>Skor: {result?.correctCount} / {result?.totalCount} Benar</span>
                  <span>•</span>
                  <span>Nilai: {result?.percentage}%</span>
                </div>
              </div>

              {/* Review of All 3 Questions with Syariah Explanations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                  <span>Pembahasan Lengkap 3 Soal</span>
                  <span>Standar Fatwa & Kurikulum 7 JP</span>
                </div>

                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctAnswer;
                  const optionLetters = ["A", "B", "C", "D"];

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border space-y-3 ${
                        isCorrect
                          ? "bg-emerald-950/20 border-emerald-500/40"
                          : "bg-red-950/20 border-red-500/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                              isCorrect
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-red-500/20 text-red-400 border border-red-500/40"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <h5 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                            {q.question}
                          </h5>
                        </div>

                        {isCorrect ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Benar</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-red-400 shrink-0 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Salah</span>
                          </span>
                        )}
                      </div>

                      {/* User's Selected vs Correct Answer */}
                      <div className="space-y-1 text-xs">
                        {!isCorrect && (
                          <div className="p-2 rounded bg-red-950/40 border border-red-500/20 text-red-300">
                            <strong>Jawaban Anda:</strong> {optionLetters[userAns]} -{" "}
                            {q.options[userAns]}
                          </div>
                        )}
                        <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-300">
                          <strong>Kunci Jawaban Tepat:</strong> {optionLetters[q.correctAnswer]} -{" "}
                          {q.options[q.correctAnswer]}
                        </div>
                      </div>

                      {/* Explanation Box */}
                      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Rujukan Muamalah & Dasar Penjelasan:</span>
                        </div>
                        <p className="leading-relaxed">{q.explanation}</p>
                        <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-slate-500" />
                          <span>{q.citation}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {!isSubmitted ? (
            <>
              <button
                id="btn-prev-q"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>

              <div className="text-xs text-slate-400">
                Terjawab: <strong className="text-white font-mono">{answeredCount} / {totalQuestions}</strong>
              </div>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  id="btn-next-q"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950"
                >
                  <span>Lanjut ke Soal Berikutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  id="btn-submit-qkc"
                  onClick={handleSubmitQuiz}
                  disabled={!isAllAnswered}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950"
                >
                  <Check className="w-4 h-4" />
                  <span>Kirim Jawaban Evaluasi</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                id="btn-retake-qkc"
                onClick={handleRetake}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Mini-Quiz</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="btn-close-qkc"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                >
                  Tutup
                </button>

                {result?.passed && hasNextModule && onNextModule && (
                  <button
                    id="btn-next-module-qkc"
                    onClick={() => {
                      onClose();
                      onNextModule();
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950"
                  >
                    <span>Lanjut ke Modul {moduleNumber + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
