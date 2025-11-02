import { ButtonHTMLAttributes } from 'react';
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean };
export default function Button({ isLoading, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border border-neutral-300 bg-neutral-900 px-4 py-2 text-white 
                  hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading ? 'Loading…' : props.children}
    </button>
  );
}
