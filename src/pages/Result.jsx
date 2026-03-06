import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAttemptById, getQuizById } from '../lib/db';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Trophy, Home, XCircle, CheckCircle2, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../components/ui/Button';

export default function Result() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchedAttempt = getAttemptById(attemptId);
    if (!fetchedAttempt) {
      navigate('/');
      return;
    }
    const fetchedQuiz = getQuizById(fetchedAttempt.quizId);
    setAttempt(fetchedAttempt);
    setQuiz(fetchedQuiz);
  }, [attemptId, navigate]);

  if (!attempt || !quiz) return null;

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  
  let scoreMessage = "Good try!";
  if (percentage === 100) scoreMessage = "Perfect Match! 💖";
  else if (percentage >= 80) scoreMessage = "You know them so well! 🥰";
  else if (percentage >= 50) scoreMessage = "Not bad, but room to grow! 🌱";
  else scoreMessage = "Oof! Might need to talk more! 😅";

  return (
    <div className="min-h-screen py-10 px-4 max-w-3xl mx-auto">
      <Card className="text-center mb-8 border-valentine-primary/20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-500 mb-4 shadow-inner"
        >
          <Trophy size={40} />
        </motion.div>

        <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
        <p className="text-valentine-dark/70 font-medium mb-6">
          <span className="font-bold text-valentine-dark">{attempt.submitterName}</span>'s results for <span className="font-bold text-valentine-primary">{quiz.creatorName}</span>'s quiz
        </p>

        <div className="bg-valentine-50 rounded-2xl p-6 mb-6">
          <div className="text-5xl font-black text-valentine-primary mb-2">
            {attempt.score} <span className="text-2xl text-valentine-dark/40">/ {attempt.totalQuestions}</span>
          </div>
          <div className="text-lg font-bold text-valentine-dark">
            {scoreMessage}
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-bold px-2">Detailed Results</h2>
        {quiz.questions.map((q, qIndex) => {
          const answer = attempt.answers.find(a => a.questionId === q.id);
          const isCorrect = answer?.isCorrect;
          
          return (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
            >
              <Card className={cn(
                "p-6 border-l-8",
                isCorrect ? "border-l-green-500" : "border-l-red-500"
              )}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-lg pr-4">{q.text}</h3>
                  {isCorrect ? (
                    <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
                  ) : (
                    <XCircle className="text-red-500 flex-shrink-0" size={24} />
                  )}
                </div>

                <div className="space-y-3">
                  {q.options.map((opt, oIndex) => {
                    const isSelected = answer?.selectedOptionIndex === oIndex;
                    const isActuallyCorrect = q.correctOptionIndex === oIndex;
                    
                    let bgClass = "bg-white border-valentine-dark/10";
                    if (isActuallyCorrect) bgClass = "bg-green-50 border-green-200 text-green-900";
                    else if (isSelected && !isActuallyCorrect) bgClass = "bg-red-50 border-red-200 text-red-900";

                    return (
                      <div 
                        key={oIndex} 
                        className={cn(
                          "px-4 py-3 rounded-xl border font-medium flex justify-between items-center text-sm md:text-base transition-colors",
                          bgClass,
                          isSelected && "ring-2 ring-offset-1 " + (isActuallyCorrect ? "ring-green-500" : "ring-red-500")
                        )}
                      >
                        <span>{opt}</span>
                        <div className="flex gap-2 text-xs font-bold uppercase tracking-wider">
                          {isActuallyCorrect && <span className="text-green-600">Correct Answer</span>}
                          {isSelected && !isActuallyCorrect && <span className="text-red-600">Your Answer</span>}
                          {isSelected && isActuallyCorrect && <span className="text-green-600">Your Answer</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center space-x-4">
        <Button onClick={() => navigate('/')}>
          <Home className="mr-2" size={20} />
          Create Your Own Quiz
        </Button>
      </div>
    </div>
  );
}
