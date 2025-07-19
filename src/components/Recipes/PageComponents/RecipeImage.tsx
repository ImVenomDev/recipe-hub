export default function RecipeImage({ imageUrl, title }: { imageUrl?: string; title: string }) {
  if (!imageUrl) return null;
  return (
    <div className="overflow-hidden rounded-xl shadow-lg border">
      <img src={imageUrl} alt={title} loading="lazy" className="w-full object-cover max-h-[400px]" />
    </div>
  );
}
