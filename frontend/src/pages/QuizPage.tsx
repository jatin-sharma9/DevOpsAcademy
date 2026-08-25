import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Timer, CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw, Trophy, Zap } from "lucide-react";
import { getQuizByCourseSlug, QuizQuestion } from "@/data/quizzes";
import { getCourseBySlug } from "@/data/courses";
import { cn } from "@/lib/utils";

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
          if (t <= 1) { clearInterval(timerRef.current!); setPhase("result"); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  if (!quiz || !course) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center"><h2 className="text-xl font-bold mb-2">Quiz not found</h2><Link to="/courses" className="text-primary">Back to courses</Link></div>
    </div>
  );

  const question = quiz.questions[current];
  const totalQ = quiz.questions.length;
  const selectedAnswer = answers[question?.id];

  const score = Math.round(quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length / totalQ * 100);
  const passed = score >= quiz.passingScore;
  const correct = quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length;

  const selectAnswer = (optId: string) => {
    if (revealed) return;
    setAnswers(prev => ({ ...prev, [question.id]: optId }));
  };

  const handleReveal = () => setRevealed(true);

  const handleNext = () => {
    if (current < totalQ - 1) { setCurrent(c => c + 1); setRevealed(false); }
    else { clearInterval(timerRef.current!); setPhase("result"); }
  };

  const restart = () => { setCurrent(0); setAnswers({}); setRevealed(false); setTimeLeft(quiz.timeLimitMinutes * 60); setPhase("intro"); };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // INTRO
  if (phase === "intro") return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-2xl border border-border bg-card text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto"><Zap className="w-8 h-8" /></div>
        <div>
          <h1 className="text-2xl font-display font-bold mb-2">{quiz.title}</h1>
          <p className="text-muted-foreground">{course.title}</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Questions", value: totalQ },
            { label: "Time Limit", value: `${quiz.timeLimitMinutes}m` },
            { label: "Passing Score", value: `${quiz.passingScore}%` },
          ].map(stat => (
            <div key={stat.label} className="p-3 rounded-xl bg-muted text-center">
              <div className="text-xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-amber-400 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Instructions</p>
          <p>• Select the best answer for each question</p>
          <p>• Use "Reveal Answer" to see explanation before moving on</p>
          <p>• The timer will auto-submit when it reaches zero</p>
        </div>
        <button onClick={() => setPhase("quiz")} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
          Start Quiz <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );

  // RESULT
  if (phase === "result") return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
        <div className={cn("p-8 rounded-2xl border text-center space-y-5", passed ? "border-secondary bg-secondary/5" : "border-destructive bg-destructive/5")}>
          {passed ? <Trophy className="w-14 h-14 text-yellow-400 mx-auto" /> : <XCircle className="w-14 h-14 text-destructive mx-auto" />}
          <div>
            <h2 className="text-3xl font-display font-bold mb-1">{score}%</h2>
            <p className="text-lg font-semibold">{passed ? "🎉 Passed!" : "❌ Not Passed"}</p>
            <p className="text-muted-foreground text-sm mt-1">{correct}/{totalQ} correct · Passing: {quiz.passingScore}%</p>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden"><div className="progress-fill h-full rounded-full transition-all" style={{ width: `${score}%` }} /></div>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"><RotateCcw className="w-4 h-4" /> Try Again</button>
            <Link to={`/courses/${slug}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"><ArrowRight className="w-4 h-4" /> Back to Course</Link>
          </div>
        </div>

        {/* Answer Review */}
        <h3 className="font-display font-bold text-lg">Answer Review</h3>
        <div className="space-y-4">
          {quiz.questions.map((q, i) => {
            const userAns = answers[q.id];
            const correct = userAns === q.correctAnswer;
            return (
              <div key={q.id} className={cn("p-5 rounded-xl border", correct ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5")}>
                <div className="flex items-start gap-3 mb-3">
                  {correct ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                  <p className="font-medium text-sm">{i + 1}. {q.question}</p>
                </div>
                <div className="pl-8 space-y-1.5 text-sm">
                  {q.options.map(opt => (
                    <div key={opt.id} className={cn("px-3 py-1.5 rounded-lg", opt.id === q.correctAnswer ? "bg-green-500/15 text-green-400" : opt.id === userAns && !correct ? "bg-red-500/15 text-red-400" : "text-muted-foreground")}>
                      {opt.id}. {opt.text}
                    </div>
                  ))}
                  <p className="pt-2 text-muted-foreground italic text-xs">💡 {q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );

  // QUIZ
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-muted-foreground">Question {current + 1} of {totalQ}</p>
        <div className={cn("flex items-center gap-1.5 font-mono text-sm font-semibold px-3 py-1.5 rounded-lg", timeLeft < 60 ? "text-red-400 bg-red-400/10" : "text-primary bg-primary/10")}>
          <Timer className="w-4 h-4" /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-8">
        <div className="progress-fill h-full rounded-full" style={{ width: `${((current) / totalQ) * 100}%` }} />
      </div>

      <motion.div key={question.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        {/* Question */}
        <h2 className="text-lg font-display font-semibold leading-relaxed">{question.question}</h2>

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
              <button key={opt.id} onClick={() => selectAnswer(opt.id)} className={cn(cls, "w-full text-left flex items-center gap-3")}>
                <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">{opt.id.toUpperCase()}</span>
                <span className="text-sm">{opt.text}</span>
                {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />}
                {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 ml-auto" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">💡 Explanation</p>
            <p>{question.explanation}</p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!revealed && selectedAnswer && (
            <button onClick={handleReveal} className="flex-1 py-2.5 rounded-xl border border-primary text-primary font-medium text-sm hover:bg-primary/10 transition-colors">
              Reveal Answer
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={cn("flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all",
              selectedAnswer ? "bg-primary text-primary-foreground hover:bg-primary/90 flex-1" : "bg-muted text-muted-foreground cursor-not-allowed flex-1")}
          >
            {current === totalQ - 1 ? "Finish Quiz" : "Next Question"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
