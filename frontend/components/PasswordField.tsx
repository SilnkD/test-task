import { useState } from 'react';
import TextField from './TextField';
type Props = Omit<React.ComponentProps<typeof TextField>, 'type'>;
export default function PasswordField(props: Props) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="relative">
      <TextField type={isVisible ? 'text' : 'password'} {...props} />
      <button type="button" onClick={() => setIsVisible(v => !v)} className="absolute right-2 top-8 text-sm underline">
        {isVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
