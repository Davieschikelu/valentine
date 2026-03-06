import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, Users, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getQuizById, getAttemptsByQuizId } from '../lib/db';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchedQuiz = getQuizById(quizId);
    if (!fetchedQuiz) {
      navigate('/');
      return;
    }
    setQuiz(fetchedQuiz);
    setAttempts(getAttemptsByQuizId(quizId));
  }, [quizId, navigate]);

  if (!quiz) return null;

  const quizUrl = `${window.location.origin}/quiz/${quiz.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(quizUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Quiz Dashboard</h1>
        <p className="text-valentine-dark/70 font-medium">
          Manage your quiz for <span className="text-valentine-primary">{quiz.spouseName}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Users className="mr-2 text-valentine-primary" />
              Share Link
            </h2>
            <p className="text-sm text-valentine-dark/60 mb-6 font-medium">
              Copy this link and send it to your partner. They will take the quiz and you'll see the results here.
            </p>
          </div>
          
          <div className="bg-valentine-100/50 p-4 rounded-xl flex items-center gap-3 border border-valentine-primary/10">
            <div className="flex-1 truncate text-sm font-medium text-valentine-dark/80">
              {quizUrl}
            </div>
            <Button size="sm" onClick={copyLink} className="flex-shrink-0">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center">
             <ShieldAlert className="mr-2 text-valentine-primary" />
             Attempts ({attempts.length})
          </h2>

          {attempts.length === 0 ? (
            <div className="text-center py-8 text-valentine-dark/50 bg-white/50 rounded-2xl border border-dashed border-valentine-primary/20">
              <p className="font-medium">No one has taken your quiz yet.</p>
              <p className="text-sm mt-1">Waiting for {quiz.spouseName} to answer...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map(attempt => (
                <motion.div 
                  key={attempt.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-4 rounded-xl border border-valentine-primary/10 shadow-sm flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{attempt.submitterName}</h3>
                    <p className="text-sm text-valentine-dark/60 font-medium">
                      Score: <span className="text-valentine-primary font-bold">{attempt.score} / {attempt.totalQuestions}</span>
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="rounded-full w-10 h-10 p-0" onClick={() => navigate(`/result/${attempt.id}`)}>
                    <ArrowRight size={20} />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
