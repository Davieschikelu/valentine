import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, CheckCircle2, Save, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { createQuiz } from '../lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '../components/ui/Button';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [creatorName, setCreatorName] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [questions, setQuestions] = useState([
    { id: uuidv4(), text: 'Where was our first date?', options: ['At a cafe', 'Movie theater', 'Restaurant', 'Park'], correctOptionIndex: 0 },
    { id: uuidv4(), text: 'What is my favorite food?', options: ['Pizza', 'Sushi', 'Pasta', 'Burger'], correctOptionIndex: 0 },
  ]);
  const [error, setError] = useState('');

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: uuidv4(), text: '', options: ['', '', '', ''], correctOptionIndex: 0 }]);
  };

  const handleRemoveQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleOptionChange = (qId, optIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleCorrectOptionChange = (qId, optIndex) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, correctOptionIndex: optIndex } : q));
  };

  const handleSave = () => {
    setError('');
    const validQuestions = questions.filter(q => q.text.trim() && q.options.every(o => o.trim()));
    if (validQuestions.length < questions.length) {
      setError("Please fill out all questions and options fully.");
      return;
    }

    const quiz = createQuiz(creatorName, spouseName, validQuestions);
    navigate(`/dashboard/${quiz.id}`);
  };

  const handleNextStep = () => {
    if (!creatorName.trim() || !spouseName.trim()) {
      setError("Please enter both names.");
      return;
    }
    setError('');
    setStep(2);
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <Heart size={40} className="text-valentine-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Create Your Quiz</h1>
        <p className="text-valentine-dark/60 mt-2">Test your partner's knowledge</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center font-medium border border-red-200">
          {error}
        </div>
      )}

      {step === 1 ? (
        <Card>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Your Name</label>
              <Input 
                placeholder="e.g. John" 
                value={creatorName} 
                onChange={e => setCreatorName(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Partner's Name</label>
              <Input 
                placeholder="e.g. Jane" 
                value={spouseName} 
                onChange={e => setSpouseName(e.target.value)} 
              />
            </div>
            <Button className="w-full mt-4" onClick={handleNextStep}>
              Next: Add Questions
            </Button>
          </div>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Questions List</h2>
            <Button variant="secondary" size="sm" onClick={() => setStep(1)}>
              Back
            </Button>
          </div>
          
          <div className="space-y-8">
            <AnimatePresence>
              {questions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="relative pt-10">
                    <button 
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="absolute top-4 right-4 text-valentine-dark/30 hover:text-red-500 transition-colors"
                      title="Remove question"
                    >
                      <Trash2 size={20} />
                    </button>
                    
                    <div className="absolute top-4 left-6 bg-valentine-100 text-valentine-primary font-bold px-3 py-1 rounded-full text-sm">
                      Question {index + 1}
                    </div>

                    <div className="mb-6 mt-2">
                      <Input 
                        placeholder="Type your question..." 
                        value={q.text}
                        onChange={(e) => handleQuestionChange(q.id, 'text', e.target.value)}
                        className="font-medium text-lg border-b-2 border-b-valentine-primary/20 rounded-none bg-transparent px-0 focus:border-b-valentine-primary focus:ring-0 focus:bg-transparent"
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-valentine-dark/60">Options & Correct Answer</p>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center space-x-3">
                          <button
                            onClick={() => handleCorrectOptionChange(q.id, oIdx)}
                            className={cn(
                              "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
                              q.correctOptionIndex === oIdx 
                                ? "border-green-500 bg-green-50 text-green-500" 
                                : "border-valentine-dark/20 text-transparent hover:border-valentine-primary/50"
                            )}
                          >
                            <CheckCircle2 size={16} className={q.correctOptionIndex === oIdx ? "opacity-100" : "opacity-0"} />
                          </button>
                          <Input 
                            placeholder={`Option ${oIdx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(q.id, oIdx, e.target.value)}
                            className={cn(
                              "h-12",
                              q.correctOptionIndex === oIdx && "border-green-500/50 focus:border-green-500 ring-green-500/10"
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            <Button variant="ghost" className="w-full border-2 border-dashed border-valentine-primary/30" onClick={handleAddQuestion}>
              <Plus size={20} className="mr-2" />
              Add Another Question
            </Button>

            <div className="pt-8 pb-12">
              <Button size="lg" className="w-full shadow-xl shadow-valentine-primary/20" onClick={handleSave}>
                <Save size={20} className="mr-2" />
                Save && Generate Link
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
