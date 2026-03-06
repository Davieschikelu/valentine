import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = forwardRef(({ className, variant = 'primary', size = 'md', children, animate = true, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-valentine-primary/50 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-valentine-primary text-white hover:bg-valentine-dark shadow-md hover:shadow-lg",
    secondary: "bg-white text-valentine-primary border-2 border-valentine-primary hover:bg-valentine-50",
    ghost: "text-valentine-primary hover:bg-valentine-primary/10",
  };
  
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  const buttonContent = (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );

  if (animate && !props.disabled) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {buttonContent}
      </motion.div>
    );
  }

  return buttonContent;
});

Button.displayName = "Button";

export { Button };
