import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, MessageCircle, Share, Home, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getLetterById, getReplyByLetterId } from '../lib/db';
import { motion } from 'framer-motion';

export default function LetterDashboard() {
  const { letterId } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const [reply, setReply] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchedLetter = getLetterById(letterId);
    if (!fetchedLetter) {
      navigate('/');
      return;
    }
    setLetter(fetchedLetter);
    setReply(getReplyByLetterId(letterId));
  }, [letterId, navigate]);

  if (!letter) return null;

  const letterUrl = `${window.location.origin}/letter/${letter.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(letterUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10 px-2 sm:px-0">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 break-words">Letter Dashboard</h1>
        <p className="text-valentine-dark/70 font-medium break-words">
          Awaiting a response from <span className="text-pink-600 font-bold">{letter.recipientName}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col justify-between border-pink-200">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center text-pink-700">
              <Share className="mr-2" />
              Send Your Letter
            </h2>
            <p className="text-sm text-valentine-dark/60 mb-6 font-medium">
              Copy the private link below and send it to {letter.recipientName}. They will see your animation and message when they click it.
            </p>
          </div>
          
          <div className="bg-pink-50 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3 border border-pink-100">
            <div className="flex-1 min-w-0 w-full truncate text-sm font-medium text-valentine-dark/80 select-all sm:text-left text-center">
              {letterUrl}
            </div>
            <Button size="sm" onClick={copyLink} className="w-full sm:w-auto shrink-0 bg-pink-500 hover:bg-pink-600">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
        </Card>

        <Card className="border-pink-200 bg-white/60">
          <h2 className="text-xl font-bold mb-4 flex items-center text-pink-700">
             <MessageCircle className="mr-2" />
             The Response
          </h2>

          {!reply ? (
            <div className="text-center py-10 text-valentine-dark/50 bg-pink-50/50 rounded-2xl border border-dashed border-pink-200">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                 <Heart className="mx-auto mb-3 text-pink-300" size={32} />
              </motion.div>
              <p className="font-medium">No reply yet.</p>
              <p className="text-sm mt-1">Waiting eagerly for {letter.recipientName}...</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-pink-300 shadow-xl shadow-pink-100"
            >
              <div className="text-center mb-4">
                <div className="inline-block py-1 px-3 bg-pink-100 text-pink-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  They replied!
                </div>
                {reply.responseType === 'yes' && (
                  <h3 className="text-2xl sm:text-3xl font-black text-green-500 break-words">YES! 🎉</h3>
                )}
                {reply.responseType === 'no' && (
                  <h3 className="text-xl font-bold text-red-500 break-words">No 😢</h3>
                )}
                {reply.responseType === 'custom' && (
                  <h3 className="text-xl font-bold text-pink-600 break-words">They wrote back! 💌</h3>
                )}
              </div>
              
              {reply.customMessage && (
                <div className="mt-4 p-3 sm:p-4 bg-pink-50 rounded-xl border border-pink-100 italic text-valentine-dark/80 text-center break-words text-sm sm:text-base">
                  "{reply.customMessage}"
                </div>
              )}
            </motion.div>
          )}
        </Card>
      </div>
      
      <div className="mt-10 text-center">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <Home className="mr-2" size={16} /> Return Home
        </Button>
      </div>
    </div>
  );
}
