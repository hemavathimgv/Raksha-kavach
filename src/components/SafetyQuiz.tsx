import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, CheckCircle2, XCircle, ChevronRight, RefreshCw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion } from '@/types';
import { generateSafetyQuiz } from '@/services/geminiService';
import { toast } from 'sonner';

interface SafetyQuizProps {
  taskName: string;
  onComplete: (score: number) => void;
}

export function SafetyQuiz({ taskName, onComplete }: SafetyQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      setIsLoading(true);
      const quiz = await generateSafetyQuiz(taskName);
      setQuestions(quiz);
      setIsLoading(false);
    }
    loadQuiz();
  }, [taskName]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(s => s + 20);
      toast.success("Correct!", { description: "Safety knowledge is key." });
    } else {
      toast.error("Incorrect", { description: "Review safety protocols." });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsDone(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <RefreshCw className="w-12 h-12 text-industrial-yellow animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Generating AI Safety Quiz...</p>
      </div>
    );
  }

  if (isDone) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center"
      >
        <div className="bg-industrial-yellow/10 p-8 rounded-2xl flex flex-col items-center">
          <Trophy className="w-16 h-16 text-industrial-yellow mb-4" />
          <h2 className="text-2xl font-black text-industrial-black">ASSESSMENT COMPLETE</h2>
          <p className="text-gray-500 mt-2">Safety Competency Score</p>
          <div className="text-5xl font-black text-industrial-yellow mt-4">
            {score}%
          </div>
        </div>
        <Button onClick={() => onComplete(score)} className="w-full h-12 high-vis-button">
          Continue to Risk Audit
        </Button>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-industrial-yellow" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <span className="text-xs font-black text-industrial-yellow">{score} PTS</span>
      </div>

      <Progress value={progress} className="h-1" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-gray-800 leading-tight">
            {currentQ.question}
          </h3>

          <div className="grid gap-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctAnswer;
              const showResult = selectedAnswer !== null;

              let style = "border-gray-200 hover:border-industrial-yellow bg-white";
              if (showResult) {
                if (isCorrect) style = "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100";
                else if (isSelected) style = "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-100";
                else style = "border-gray-100 opacity-50";
              }

              return (
                <button
                  key={idx}
                  disabled={showResult}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between group ${style}`}
                >
                  <span className="font-medium">{option}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button onClick={nextQuestion} className="w-full h-12 high-vis-button group">
                {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
