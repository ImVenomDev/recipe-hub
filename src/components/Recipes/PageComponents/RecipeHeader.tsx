import Badge from "./Badge";

export default function RecipeHeader({
  title,
  badges,
  servings,
}: {
  title: string;
  badges: { glutenFree?: boolean; proteic?: boolean; unique?: boolean };
  servings?: number;
}) {
  return (
    <header className="text-center space-y-2">
      <h1 className="text-4xl font-extrabold text-purple-700">{title}</h1>
      <div className="flex justify-center gap-2 mt-2 flex-wrap">
        {badges.glutenFree && <Badge label="Senza Glutine" color="teal" />}
        {badges.proteic && <Badge label="Proteico" color="blue" />}
        {badges.unique && <Badge label="Piatto Unico" color="amber" />}
        {servings && <Badge label={`${servings} persone`} color="purple" />}
      </div>
    </header>
  );
}
