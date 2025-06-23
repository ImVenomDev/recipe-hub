import clsx from "clsx";

export default function DifficultyDots({ level }: { level: number }) {
  const colors = ["bg-green-300", "bg-green-600", "bg-yellow-400", "bg-orange-500", "bg-red-500"];
  return (
    <div className="flex space-x-1 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={clsx(
            "w-3 h-3 rounded-full",
            i < level ? colors[level - 1] : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}
