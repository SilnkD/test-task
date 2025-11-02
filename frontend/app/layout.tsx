import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';

export const metadata = { title: 'App', description: 'Auth demo' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-neutral-50 text-neutral-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
