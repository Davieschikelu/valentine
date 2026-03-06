import { forwardRef } from 'react';
import { cn } from './Button';
import { motion } from 'framer-motion';

const Card = forwardRef(({ className, children, animate = true, ...props }, ref) => {
  const content = (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-valentine-primary/5 overflow-hidden p-6 md:p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
});

Card.displayName = "Card";

export { Card };
