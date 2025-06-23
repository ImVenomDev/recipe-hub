import type { ElementType, ReactNode } from "react";

export default function RecipeSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ElementType;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-3 flex items-center text-purple-600">
        <Icon className="w-6 h-6 mr-2" /> {title}
      </h2>
      {children}
    </section>
  );
}
