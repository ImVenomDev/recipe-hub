import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { Spinner } from "@heroui/react";
import RecipeHeader from "../components/Recipes/PageComponents/RecipeHeader";
import RecipeImage from "../components/Recipes/PageComponents/RecipeImage";
import DifficultyDots from "../components/Recipes/PageComponents/DifficultyDots";
import RecipeSection from "../components/Recipes/PageComponents/RecipeSection";
import NutritionCard from "../components/Recipes/PageComponents/NutritionCard";
import { Clock, ChefHat, BookOpenText, StickyNote, Sparkles, Flame, Timer } from "lucide-react";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", id!);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Nessuna ricetta trovata.");
        }
      } catch (error) {
        console.error("Errore nel recupero della ricetta:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-10"><Spinner label="Caricamento ricetta..." /></div>;
  }

  if (!recipe) {
    return <div className="text-center text-red-600">Ricetta non trovata</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <RecipeHeader title={recipe.title} badges={{ glutenFree: recipe.glutenFree, proteic: recipe.isProteic, unique: recipe.isUnique }} servings={recipe.servings} />
      <RecipeImage imageUrl={recipe.imageUrl} title={recipe.title} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm p-6 bg-purple-50 border-purple-200 rounded-xl border">
        <p><Sparkles className="inline mr-1 text-purple-600" /> <strong>Categoria:</strong> {recipe.category}</p>
        <p><ChefHat className="inline mr-1 text-purple-600" /> <strong>Ingredienti:</strong> {recipe.total_ingredients}</p>
        <p><Clock className="inline mr-1 text-purple-600" /> <strong>Preparazione:</strong> {recipe.preparationTime}</p>
        {recipe.risingTime && <p><Clock className="inline mr-1 text-purple-600" /> <strong>Lievitazione:</strong> {recipe.risingTime}</p>}
        {recipe.sleepTime && <p><Clock className="inline mr-1 text-purple-600" /> <strong>Riposo:</strong> {recipe.sleepTime}</p>}
        <p><Clock className="inline mr-1 text-purple-600" /> <strong>Tempo Totale:</strong> {recipe.totalTime}</p>
        <p className="flex items-center"><Flame className="inline mr-1 text-purple-600" /><strong className="mr-2">Difficoltà:</strong><DifficultyDots level={recipe.difficulty || 1} /></p>
      </div>

      <RecipeSection title="Ingredienti" icon={BookOpenText}>
        <ul className="space-y-2 pl-5 list-disc text-gray-800 text-sm">
          {recipe.ingredients.map((ing: any, idx: number) => (
            <li key={idx}>
              {ing.unit === "q.b." ? ( <span><strong>{ing.name}</strong> q.b.</span> ) 
              : ( <span>{ing.quantity} {ing.unit} di <strong>{ing.name}</strong></span> )}
            </li>
          ))}
        </ul>
      </RecipeSection>

      <RecipeSection title="Procedimento" icon={BookOpenText}>
        <ol className="space-y-4 list-decimal list-inside text-gray-800 text-sm">
          {recipe.steps.map((step: string, idx: number) => {
            const ingredientNames = recipe.ingredients.map((ing: any) => ing.name);
            const pattern = new RegExp(`\\b(${ingredientNames.join("|")})\\b`, "gi");
            const parts = step.split(pattern).map((part: string, i: number) => {
              const isIngredient = ingredientNames.some((name: string) => name.toLowerCase() === part.toLowerCase());
              return isIngredient
                ? <strong key={i} className="text-purple-700 font-semibold">{part}</strong>
                : <span key={i}>{part}</span>;
            });
            return (
              <li key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                {parts}
              </li>
            );
          })}
        </ol>
      </RecipeSection>

    {recipe.conservation && (
        <RecipeSection title="Conservazione" icon={Timer    }>
            <p className="bg-blue-50 p-4 rounded-xl text-sm border border-blue-200 text-gray-800">{recipe.conservation}</p>
        </RecipeSection>
    )}

      {recipe.notes && (
        <RecipeSection title="Note" icon={StickyNote}>
          <p className="bg-yellow-50 p-4 rounded-xl text-sm border border-yellow-200 text-gray-800">{recipe.notes}</p>
        </RecipeSection>
      )}

      <NutritionCard ingredients={recipe.ingredients} />

      <footer className="text-sm text-gray-500 pt-4 border-t border-gray-200">
        Creata il {new Date(recipe.createdAt.seconds * 1000).toLocaleDateString()} da <span className="text-purple-500 font-semibold">{recipe.author}</span>
      </footer>
    </div>
  );
}