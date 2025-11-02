import { InputHTMLAttributes, forwardRef } from 'react';
type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };
const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ label, error, ...props }, ref) => (
  <label className="block space-y-1">
    <span className="text-sm font-medium">{label}</span>
    <input
      ref={ref}
      className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-800"
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </label>
));
TextField.displayName = 'TextField';
export default TextField;
