import { forwardRef } from 'react';

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary: 'bg-primary text-slate-950 shadow-neon hover:shadow-[0_0_0_1px_rgba(0,229,160,0.25),0_0_40px_rgba(0,229,160,0.35)]',
  secondary: 'border border-white/10 bg-white/5 text-slate-100 hover:border-primary/40 hover:bg-white/10',
  ghost: 'text-slate-200 hover:bg-white/5',
  danger: 'bg-critical text-white hover:brightness-110',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', icon: Icon, loading = false, className = '', type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      aria-label={props['aria-label'] || (typeof children === 'string' ? children : 'button')}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" aria-hidden="true" />
      ) : Icon ? (
        <Icon className="h-4 w-4" aria-hidden="true" />
      ) : null}
      <span>{children}</span>
    </button>
  );
});
