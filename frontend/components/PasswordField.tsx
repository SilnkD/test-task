'use client';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import TextField from './TextField';

type Props = Omit<React.ComponentProps<typeof TextField>, 'type'>;

export default function PasswordField(props: Props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <TextField type={isVisible ? 'text' : 'password'} {...props} />
      <button
        type="button"
        onClick={() => setIsVisible(v => !v)}
        className="absolute right-3 top-8 text-neutral-500 hover:text-neutral-800"
        aria-label={isVisible ? 'Hide password' : 'Show password'}
      >
        {isVisible
          ? <EyeSlashIcon className="h-5 w-5" />
          : <EyeIcon className="h-5 w-5" />}
      </button>
    </div>
  );
}
