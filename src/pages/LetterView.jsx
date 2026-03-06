import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Send, CheckCircle2, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getLetterById, submitReply, getReplyByLetterId } from '../lib/db';
import { motion, AnimatePresence } from 'framer-motion';

export default function LetterView() {
  const { letterId } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  
  const [step, setStep] = useState(0); // 0: unread envelope, 1: reading, 2: replied
  const [customResponse, setCustomResponse] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    const fetchedLetter = getLetterById(letterId);
    if (!fetchedLetter) {
      navigate('/');
      return;
    }
    setLetter(fetchedLetter);

    const existingReply = getReplyByLetterId(letterId);
    if (existingReply) {
      setStep(2); // already replied
    }
  }, [letterId, navigate]);

  if (!letter) return null;

  const handleReply = (type) => {
    if (type === 'custom' && !showCustomInput) {
      setShowCustomInput(true);
      return;
    }
    submitReply(letterId, type, type === 'custom' ? customResponse : "");
    setStep(2);
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-2xl mx-auto flex flex-col justify-center overflow-hidden">
      
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
         {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500/30"
            initial={{ y: '100vh', x: `${Math.random() * 100}vw`, scale: Math.random() + 0.5 }}
            animate={{ y: '-10vh', rotate: 360 }}
            transition={{ duration: Math.random() * 5 + 10, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
          >
            <Heart size={30} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="envelope"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0, y: -50 }}
            className="z-10 text-center"
          >
            <h1 className="text-3xl font-bold mb-6 text-pink-800">For {letter.recipientName}</h1>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(1)}
              className="cursor-pointer inline-block"
            >
              <Card className="p-10 border-4 border-pink-300 bg-pink-50 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-tr from-pink-200 to-rose-100 opacity-50 group-hover:opacity-100 transition-opacity" />
                <Heart 
                  size={100} 
                  className="text-pink-500 fill-pink-500 mx-auto relative z-10 drop-shadow-lg group-hover:animate-pulse" 
                />
                <p className="mt-6 font-bold text-xl text-pink-800 relative z-10 uppercase tracking-widest">
                  Tap to Open
                </p>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="letter"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="z-10"
          >
            <Card className="p-8 md:p-12 shadow-2xl shadow-pink-200/50 bg-white/90 backdrop-blur-md border-pink-200 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-bl-full -z-10 opacity-50" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-100 rounded-tr-full -z-10 opacity-50" />
              
              <h2 className="text-2xl font-bold text-pink-700 mb-8">Dear {letter.recipientName},</h2>
              
              <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed whitespace-pre-wrap font-serif italic mb-12">
                {letter.message}
              </p>
              
              <div className="text-right">
                <p className="text-lg font-bold text-valentine-primary">Love,</p>
                <p className="text-xl font-bold text-pink-800">{letter.creatorName}</p>
              </div>

              <div className="mt-12 pt-8 border-t-2 border-pink-100 space-y-4">
                <h3 className="text-center font-bold text-slate-600 mb-6 uppercase tracking-wider text-sm">Send your reply</h3>
                
                {!showCustomInput ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-green-500 hover:bg-green-600 h-14 text-lg shadow-green-500/20 shadow-lg" onClick={() => handleReply('yes')}>
                      YES! 💖
                    </Button>
                    <Button variant="secondary" className="border-red-200 text-red-500 hover:bg-red-50 h-14 text-lg" onClick={() => handleReply('no')}>
                      No 😢
                    </Button>
                    <Button variant="ghost" className="col-span-2 mt-2 text-pink-600 hover:bg-pink-50" onClick={() => setShowCustomInput(true)}>
                      Write your own response
                    </Button>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                    <textarea 
                      className="w-full h-32 rounded-xl border-2 border-pink-200 p-4 focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none resize-none font-medium"
                      placeholder="Write your beautiful reply..."
                      value={customResponse}
                      onChange={e => setCustomResponse(e.target.value)}
                    />
                    <div className="flex gap-4">
                      <Button variant="ghost" className="flex-1" onClick={() => setShowCustomInput(false)}>Cancel</Button>
                      <Button className="flex-1 bg-pink-500 hover:bg-pink-600" onClick={() => handleReply('custom')} disabled={!customResponse.trim()}>
                        <Send size={18} className="mr-2" /> Send Reply
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="z-10 text-center"
          >
            <Card className="p-10 border-pink-200">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Reply Sent!</h2>
              <p className="text-lg text-slate-600 font-medium">{letter.creatorName} will see your response on their dashboard.</p>
              
              <Button className="mt-8" onClick={() => navigate('/')}>
                 <Home size={18} className="mr-2" /> Create Your Own
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
