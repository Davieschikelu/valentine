import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-valentine-primary/20"
            initial={{ 
              y: '100vh', 
              x: Math.random() * 100 + 'vw',
              scale: Math.random() * 1.5 + 0.5,
              opacity: 0
            }}
            animate={{ 
              y: '-10vh',
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          >
            <Heart size={40} className="fill-current" />
          </motion.div>
        ))}
      </div>

      <div className="z-10 w-full max-w-lg">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-valentine-100/50 shadow-inner mb-6"
          >
            <Heart size={48} className="text-valentine-primary fill-valentine-primary" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Valentine's Quiz
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-valentine-dark/70 font-medium"
          >
            How well does your partner really know you? 
            <br className="hidden md:block"/> Create a quiz and find out!
          </motion.p>
        </div>

        <Card className="text-center mb-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold bg-linear-to-r from-valentine-primary to-rose-400 bg-clip-text text-transparent">Challenge your Partner</h2>
            <Button 
              className="w-full text-lg py-6"
              onClick={() => navigate('/create')}
            >
              <Sparkles className="mr-2" size={24} />
              Create A Quiz
            </Button>
            <p className="text-sm text-valentine-dark/50 font-medium pt-2">
              Test how well they know you!
            </p>
          </div>
        </Card>

        <Card className="text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-bold bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Send a Love Letter</h2>
            <Button 
              variant="secondary"
              className="w-full text-lg py-6 border-pink-400 text-pink-600 hover:bg-pink-50"
              onClick={() => navigate('/letter/create')}
            >
              <Heart className="mr-2" size={24} />
              Write a Custom Letter
            </Button>
            <p className="text-sm text-valentine-dark/50 font-medium pt-2">
              Send a sweet message & get their reply!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
