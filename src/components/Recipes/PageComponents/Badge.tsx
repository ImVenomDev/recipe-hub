export default function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-700 border border-${color}-300`}>
      {label}
    </span>
  );
}
