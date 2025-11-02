export default function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{message}</p>;
}
