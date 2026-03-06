import { forwardRef } from 'react';
import { cn } from './Button'; // reuse the cn utility

const Input = forwardRef(({ className, wrapperClassName, icon: Icon, error, ...props }, ref) => {
  return (
    <div className={cn("w-full relative", wrapperClassName)}>
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-valentine-primary/50">
          <Icon size={20} />
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full h-14 rounded-2xl border-2 border-valentine-primary/20 bg-white/50 px-4 text-base transition-colors",
          "placeholder:text-valentine-dark/40",
          "focus:border-valentine-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-valentine-primary/10",
          Icon && "pl-11",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500 font-medium px-2">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
