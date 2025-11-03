import { ButtonHTMLAttributes } from 'react';
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean };

export default function Button({ isLoading, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center rounded-md border border-neutral-200 bg-neutral-900 px-4 py-2 text-white 
                  font-medium transition-all hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-400 
                  disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {isLoading ? 'Loading…' : props.children}
    </button>
  );
}