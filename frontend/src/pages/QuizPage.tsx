import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Timer, CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw, Trophy, Zap, Award, Sparkles } from "lucide-react";
import { getQuizByCourseSlug, QuizQuestion } from "@/data/quizzes";
import { getCourseBySlug } from "@/data/courses";
import { lmsStore } from "@/services/lmsStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Phase = "intro" | "quiz" | "result";

export default function QuizPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const course = getCourseBySlug(slug || "");
  const quiz = getQuizByCourseSlug(slug || "");
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz ? quiz.timeLimitMinutes * 60 : 0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "quiz") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            handleFinishQuiz();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  if (!quiz || !course) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold font-display">Assessment Not Found</h2>
          <p className="text-muted-foreground text-sm">We couldn't locate this assessment module.</p>
          <Link to="/courses" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const question = quiz.questions[current];
  const totalQ = quiz.questions.length;
  const selectedAnswer = answers[question?.id];

  const score = Math.round((quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length / totalQ) * 100);
  const passed = score >= quiz.passingScore;
  const correct = quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length;

  const selectAnswer = (optId: string) => {
    if (revealed) return;
    setAnswers(prev => ({ ...prev, [question.id]: optId }));
  };

  const handleReveal = () => setRevealed(true);

  const handleFinishQuiz = () => {
    clearInterval(timerRef.current!);
    const calculatedScore = Math.round((quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length / totalQ) * 100);
    const hasPassed = calculatedScore >= quiz.passingScore;

    // Save to local store
    lmsStore.saveQuizAttempt({
      quizId: quiz.id,
      courseSlug: course.slug,
      score: calculatedScore,
      passed: hasPassed,
      totalQuestions: totalQ,
      correctCount: quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length,
      date: new Date().toISOString(),
    });

    if (hasPassed) {
      toast.success(`🎉 Assessment Passed! Score: ${calculatedScore}%`);
    } else {
      toast.error(`Assessment not passed. Score: ${calculatedScore}%`);
    }

    setPhase("result");
  };

  const handleNext = () => {
    if (current < totalQ - 1) {
      setCurrent(c => c + 1);
      setRevealed(false);
    } else {
      handleFinishQuiz();
    }
  };

  const restart = () => {
    setCurrent(0);
    setAnswers({});
    setRevealed(false);
    setTimeLeft(quiz.timeLimitMinutes * 60);
    setPhase("intro");
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // INTRO PHASE
  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl border border-border bg-card text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto shadow-md">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Technical Knowledge Check
            </span>
            <h1 className="text-2xl font-display font-extrabold text-foreground">{quiz.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{course.title}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Questions", value: totalQ },
              { label: "Time Limit", value: `${quiz.timeLimitMinutes}m` },
              { label: "Passing Score", value: `${quiz.passingScore}%` },
            ].map(stat => (
              <div key={stat.label} className="p-3 rounded-2xl bg-muted/60 text-center border border-border/50">
                <div className="text-xl font-bold font-display text-primary">{stat.value}</div>
                <div className="text-[11px] text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left space-y-1.5 text-xs text-muted-foreground">
            <p className="font-semibold text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Assessment Guidelines
            </p>
            <p>• Select the single best answer for each scenario</p>
            <p>• Use "Reveal Answer" to review the technical explanation before moving forward</p>
            <p>• Results are automatically saved to your student profile & competency radar</p>
          </div>

          <button
            onClick={() => setPhase("quiz")}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Start Assessment <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  // RESULT PHASE
  if (phase === "result") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className={cn("p-8 rounded-3xl border text-center space-y-5 shadow-xl", passed ? "border-green-500/30 bg-green-500/5" : "border-destructive/30 bg-destructive/5")}>
            {passed ? <Trophy className="w-16 h-16 text-yellow-400 mx-auto" /> : <XCircle className="w-16 h-16 text-destructive mx-auto" />}
            <div>
              <h2 className="text-4xl font-display font-extrabold mb-1">{score}%</h2>
              <p className="text-lg font-bold">{passed ? "🎉 Assessment Passed!" : "❌ Not Passed"}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {correct}/{totalQ} correct answers · Passing criteria: {quiz.passingScore}%
              </p>
            </div>

            <div className="h-2.5 bg-muted rounded-full overflow-hidden max-w-md mx-auto">
              <div
                className={cn("h-full rounded-full transition-all duration-700", passed ? "bg-green-400" : "bg-destructive")}
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="flex gap-3 justify-center flex-wrap pt-2">
              <button
                onClick={restart}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
              <Link
                to={`/learn/${course.slug}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" /> Continue Course
              </Link>
              {passed && (
                <Link
                  to={`/certificate/${course.slug}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 shadow-md shadow-yellow-400/20 transition-all cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" /> View Certificate
                </Link>
              )}
            </div>
          </div>

          {/* Answer Review Section */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base text-foreground">Detailed Question Breakdown</h3>
            <div className="space-y-3">
              {quiz.questions.map((q, i) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "p-5 rounded-2xl border transition-all",
                      isCorrect ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"
                    )}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <p className="font-semibold text-sm text-foreground">
                        {i + 1}. {q.question}
                      </p>
                    </div>

                    <div className="pl-8 space-y-1.5 text-xs">
                      {q.options.map(opt => (
                        <div
                          key={opt.id}
                          className={cn(
                            "px-3 py-2 rounded-xl font-medium",
                            opt.id === q.correctAnswer
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : opt.id === userAns && !isCorrect
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "text-muted-foreground bg-muted/30"
                          )}
                        >
                          <span className="font-bold mr-2">{opt.id.toUpperCase()}.</span>
                          {opt.text}
                        </div>
                      ))}
                      <p className="pt-2 text-muted-foreground text-xs leading-relaxed">
                        💡 <strong className="text-foreground">Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ACTIVE QUIZ QUESTION PHASE
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Question {current + 1} of {totalQ}
        </p>
        <div
          className={cn(
            "flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 rounded-xl border",
            timeLeft < 60
              ? "text-red-400 bg-red-400/10 border-red-400/30 animate-pulse"
              : "text-primary bg-primary/10 border-primary/20"
          )}
        >
          <Timer className="w-3.5 h-3.5" /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-8">
        <div
          className="progress-fill h-full rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / totalQ) * 100}%` }}
        />
      </div>

      <motion.div key={question.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        {/* Question Heading */}
        <h2 className="text-lg sm:text-xl font-display font-bold text-foreground leading-relaxed">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt.id;
            const isCorrect = opt.id === question.correctAnswer;
            let cls = "";
            if (revealed) {
              if (isCorrect) cls = "quiz-option correct";
              else if (isSelected && !isCorrect) cls = "quiz-option wrong";
              else cls = "quiz-option opacity-60";
            } else {
              cls = cn("quiz-option", isSelected && "selected");
            }

            return (
              <button
                key={opt.id}
                onClick={() => selectAnswer(opt.id)}
                className={cn(cls, "w-full text-left flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer")}
              >
                <span className="w-7 h-7 rounded-xl border border-current flex items-center justify-center text-xs font-bold shrink-0">
                  {opt.id.toUpperCase()}
                </span>
                <span className="text-xs sm:text-sm font-medium flex-1">{opt.text}</span>
                {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 ml-auto" />}
                {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-auto" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground space-y-1"
          >
            <p className="font-semibold text-foreground">💡 Key Technical Takeaway</p>
            <p className="leading-relaxed">{question.explanation}</p>
          </motion.div>
        )}

        {/* Actions Row */}
        <div className="flex gap-3 pt-2">
          {!revealed && selectedAnswer && (
            <button
              onClick={handleReveal}
              className="flex-1 py-3 rounded-xl border border-primary/30 text-primary font-semibold text-xs hover:bg-primary/10 transition-colors cursor-pointer"
            >
              Reveal Explanation
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs transition-all cursor-pointer",
              selectedAnswer
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 flex-1"
                : "bg-muted text-muted-foreground cursor-not-allowed flex-1"
            )}
          >
            {current === totalQ - 1 ? "Complete & Submit Assessment" : "Next Question"} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
