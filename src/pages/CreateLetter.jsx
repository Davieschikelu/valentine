import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { createLetter } from '../lib/db';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateLetter() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [creatorName, setCreatorName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('I like you... will you be mine?');
  const [error, setError] = useState('');

  const handleNextStep = () => {
    if (!creatorName.trim() || !recipientName.trim()) {
      setError("Please enter both names.");
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSave = () => {
    setError('');
    if (!message.trim()) {
      setError("Please put some heart into a message!");
      return;
    }

    const letter = createLetter(creatorName, recipientName, message);
    navigate(`/letter/dashboard/${letter.id}`);
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-3xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-8">
        <Heart size={48} className="text-pink-500 fill-pink-500/20 mx-auto mb-4" />
        <h1 className="text-3xl font-bold bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Write a Custom Love Letter</h1>
        <p className="text-valentine-dark/60 mt-2">Send a sweet message and see their reply</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center font-medium border border-red-200">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
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
                    value={recipientName} 
                    onChange={e => setRecipientName(e.target.value)} 
                  />
                </div>
                <div className="pt-4">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={handleNextStep}>
                    Next: Write Message <ArrowRight className="ml-2" size={20} />
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <Button variant="ghost" onClick={() => navigate('/')}>
                    <ArrowLeft className="mr-2" size={16} /> Back to Home
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="p-8 border-pink-200 shadow-pink-100">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-pink-700 mb-4 text-center">Your Custom Message</label>
                  <textarea
                    className="w-full h-40 rounded-2xl border-2 border-pink-200 bg-pink-50/50 p-4 text-lg transition-colors focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-400/10 resize-none font-medium text-valentine-dark"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something lovely..."
                  />
                  <p className="text-xs text-center text-valentine-dark/40 mt-2">This message will be shown beautifully when they open the link.</p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button variant="secondary" className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2" size={20} /> Back
                  </Button>
                  <Button className="flex-1 bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/30" onClick={handleSave}>
                    Create Letter <Heart className="ml-2" size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
