export default function FormError({ message }: { message?: string }) {
  if (!message) return null;

  const lines = message.split(/\n+/);

  return (
    <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 space-y-1">
      {lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}