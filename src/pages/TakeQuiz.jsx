import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, cn } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { getQuizById, submitAttempt } from '../lib/db';
import { motion, AnimatePresence } from 'framer-motion';

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  
  const [submitterName, setSubmitterName] = useState('');
  const [step, setStep] = useState(0); // 0 = start screen, 1+ = questions
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchedQuiz = getQuizById(quizId);
    if (!fetchedQuiz) {
      navigate('/');
      return;
    }
    setQuiz(fetchedQuiz);
  }, [quizId, navigate]);

  if (!quiz) return null;

  const currentQuestionIndex = step - 1;
  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleStart = () => {
    if (submitterName.trim()) {
      setStep(1);
    }
  };

  const handleSelectOption = (qId, optionIndex) => {
    const existingAnswerIndex = answers.findIndex(a => a.questionId === qId);
    let newAnswers;
    if (existingAnswerIndex >= 0) {
      newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = { questionId: qId, selectedOptionIndex: optionIndex };
    } else {
      newAnswers = [...answers, { questionId: qId, selectedOptionIndex: optionIndex }];
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < quiz.questions.length) {
      setStep(step + 1);
    } else {
      const attempt = submitAttempt(quiz.id, submitterName, answers);
      navigate(`/result/${attempt.id}`);
    }
  };

  const hasAnsweredCurrentUrl = answers.find(a => a.questionId === currentQuestion?.id) !== undefined;

  return (
    <div className="min-h-screen py-10 px-4 max-w-2xl mx-auto flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="text-center p-10">
              <Heart size={48} className="text-valentine-primary mx-auto mb-6 drop-shadow-md" />
              <h1 className="text-3xl font-bold mb-2">You've been challenged!</h1>
              <p className="text-valentine-dark/70 font-medium mb-8">
                <span className="text-valentine-primary font-bold">{quiz.creatorName}</span> has created a quiz to test your knowledge about them. Are you ready?
              </p>
              
              <div className="space-y-4 max-w-sm mx-auto">
                <Input 
                  placeholder="Enter your name to begin..."
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  className="text-center font-medium"
                />
                <Button 
                  className="w-full text-lg h-14" 
                  onClick={handleStart}
                  disabled={!submitterName.trim()}
                >
                  Start The Quiz <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key={`question-${currentQuestion.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <div className="mb-6 flex items-center justify-between font-medium text-valentine-dark/60">
              <span>Question {step} of {quiz.questions.length}</span>
              <div className="flex gap-1">
                {quiz.questions.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors", 
                      i < step ? "bg-valentine-primary" : "bg-valentine-primary/20"
                    )} 
                  />
                ))}
              </div>
            </div>

            <Card className="p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-8 text-center leading-tight">
                {currentQuestion.text}
              </h2>

              <div className="space-y-4">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = answers.find(a => a.questionId === currentQuestion.id)?.selectedOptionIndex === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(currentQuestion.id, i)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-lg",
                        isSelected 
                          ? "border-valentine-primary bg-valentine-50 text-valentine-dark" 
                          : "border-valentine-primary/10 hover:border-valentine-primary/30 hover:bg-white"
                      )}
                    >
                      <div className="flex items-center">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center transition-colors",
                          isSelected ? "border-valentine-primary" : "border-valentine-dark/20"
                        )}>
                          {isSelected && <div className="w-3 h-3 rounded-full bg-valentine-primary" />}
                        </div>
                        {opt}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex justify-between items-center">
                {step > 1 ? (
                  <Button variant="ghost" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="mr-2" size={20} /> Back
                  </Button>
                ) : <div />}
                
                <Button 
                  onClick={handleNext}
                  disabled={!hasAnsweredCurrentUrl}
                  className="px-8"
                >
                  {step === quiz.questions.length ? 'Submit Quiz' : 'Next'} 
                  {step !== quiz.questions.length && <ArrowRight className="ml-2" size={20} />}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
