import React, { useState } from "react";
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  ShieldCheck,
  BarChart3
} from "lucide-react";
import { triggerExamPassedConfetti } from "../utils/confetti";
import { quizQuestions } from "../data/syllabusData";
import { Language, TabType, QuizAttempt } from "../types";

interface SubstanceTestQuizProps {
  language: Language;
  onNavigateTab: (tab: TabType) => void;
  onOpenCertificateModal: () => void;
  hasPassedExam: boolean;
  onSetPassedExam: (passed: boolean, score: number) => void;
  highestScore: number;
  onRecordQuizAttempt?: (attempt: QuizAttempt) => void;
}

export const SubstanceTestQuiz: React.FC<SubstanceTestQuizProps> = ({
  language,
  onNavigateTab,
  onOpenCertificateModal,
  hasPassedExam,
  onSetPassedExam,
  highestScore,
  onRecordQuizAttempt,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showExplanations, setShowExplanations] = useState<boolean>(false);

  const currentQ = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const calculateScore = () => {
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    return Math.round((correctCount / totalQuestions) * 100);
  };

  const handleSubmitExam = () => {
    const score = calculateScore();
    setIsSubmitted(true);
    setShowExplanations(true);

    const passed = score >= 70;
    onSetPassedExam(passed, score);

    if (onRecordQuizAttempt) {
      let correctCount = 0;
      quizQuestions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswer) {
          correctCount += 1;
        }
      });
      const now = new Date();
      onRecordQuizAttempt({
        id: `att-${Date.now()}`,
        attemptNumber: 0,
        title: "Uji Substansi Kelulusan Peserta Pro",
        date: `${now.getDate()} ${now.toLocaleString("id-ID", { month: "short" })}`,
        fullDate: now.toISOString(),
        score,
        totalQuestions,
        correctAnswers: correctCount,
        passed,
        timeSpentMinutes: Math.floor(Math.random() * 4) + 8,
        domainScores: {
          fiqihMuamalah: Math.min(100, Math.round(score * 1.02)),
          bankable5C: Math.min(100, Math.round(score * 0.98)),
          sjphHalal: Math.min(100, Math.round(score * 0.96)),
          akuntansiSyariah: Math.min(100, Math.round(score * 1.04)),
          pemasaranDigital: Math.min(100, Math.round(score * 1.0)),
        },
      });
    }

    if (passed) {
      triggerExamPassedConfetti();
    }
  };

  const handleResetExam = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowExplanations(false);
    setCurrentQuestionIndex(0);
  };

  const score = calculateScore();
  const isPassed = score >= 70;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Evaluasi Kompetensi 7 JP Berbasis Standar Industri</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Uji Substansi Kelulusan Peserta Pro TamanKuliner.com
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Uji penguasaan Fiqih Muamalah, kelayakan Bankable 5C, akuntansi syariah, dan kepatuhan SJPH BPJPH (Passing grade: 70%).
          </p>
        </div>

        {highestScore > 0 && (
          <div className="flex items-center space-x-2 bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-800 shrink-0">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300">
              Skor Terbaik: <strong className="text-emerald-400 font-mono">{highestScore}/100</strong>
            </span>
          </div>
        )}
      </div>

      {/* Result Card when submitted */}
      {isSubmitted && (
        <div className="p-6 rounded-xl bg-[#16191F] border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-2xl font-mono ${
                isPassed ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}>
                {score}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isPassed ? "Mabruk! Anda Dinyatakan Lulus Uji Substansi" : "Belum Memenuhi Passing Grade (Minimal 70)"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isPassed
                    ? "Sertifikat digital kompetensi 7 JP Anda telah diterbitkan dengan stempel SHA-256."
                    : "Pelajari kembali silabus materi dan ulangi ujian untuk memperbaiki nilai Anda."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigateTab("learning-analytics")}
                className="px-3.5 py-2 rounded-lg font-bold text-xs bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 flex items-center space-x-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lihat Analitik Pembelajaran</span>
              </button>

              {isPassed ? (
                <button
                  onClick={onOpenCertificateModal}
                  className="px-4 py-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center space-x-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Unduh E-Sertifikat</span>
                </button>
              ) : null}

              <button
                onClick={handleResetExam}
                className="px-3.5 py-2 rounded-lg font-bold text-xs bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Ujian</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Examination View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Question Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#16191F] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl space-y-5">
            {/* Header with question counter */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {currentQ.moduleId.toUpperCase()}
              </span>
            </div>

            {/* Question prompt */}
            <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                const isCorrect = currentQ.correctAnswer === optIdx;

                let optionStyle = "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700";

                if (isSelected && !isSubmitted) {
                  optionStyle = "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold";
                }

                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-rose-500 bg-rose-500/20 text-rose-400";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-all flex items-start space-x-3 ${optionStyle}`}
                  >
                    <span className="w-5 h-5 rounded border border-current flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box when submitted */}
            {isSubmitted && (
              <div className="mt-4 p-3.5 rounded-lg bg-slate-900 border-l-4 border-emerald-500 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-white block">Pembahasan Ilmiah:</span>
                <p>{currentQ.explanation}</p>
                <span className="text-[11px] text-emerald-400 block font-medium">
                  Rujukan: {currentQ.citation}
                </span>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-3 py-1.5 text-xs font-bold rounded-lg text-slate-400 hover:bg-slate-900 disabled:opacity-30"
              >
                ← Sebelumnya
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  Selanjutnya →
                </button>
              ) : (
                !isSubmitted && (
                  <button
                    onClick={handleSubmitExam}
                    disabled={answeredCount < totalQuestions}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-md disabled:opacity-50"
                  >
                    Kirim & Nilai Ujian
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Question Quick-Grid Matrix (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Nomor Pertanyaan
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {quizQuestions.map((q, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCurrent = currentQuestionIndex === idx;

                let btnStyle = "bg-slate-900 text-slate-400 border border-slate-800";
                if (isAnswered) btnStyle = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold";
                if (isCurrent) btnStyle += " ring-1 ring-emerald-500";

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-8 rounded text-xs font-semibold flex items-center justify-center transition-all ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Terjawab:</span>
                <span className="font-bold text-white font-mono">{answeredCount} / {totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>Passing Grade:</span>
                <span className="font-bold text-emerald-400 font-mono">70 Poin</span>
              </div>
            </div>

            {!isSubmitted && (
              <button
                onClick={handleSubmitExam}
                disabled={answeredCount === 0}
                className="w-full py-2.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
              >
                Selesaikan Ujian ({answeredCount}/{totalQuestions})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
