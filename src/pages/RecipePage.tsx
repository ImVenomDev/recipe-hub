import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addToast, Button, Skeleton } from "@heroui/react";
import { Clock, ChefHat, BookOpenText, StickyNote, Sparkles, Flame, Timer, Star } from "lucide-react";

import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";


import RecipeHeader from "../components/Recipes/PageComponents/RecipeHeader";
import RecipeImage from "../components/Recipes/PageComponents/RecipeImage";
import DifficultyDots from "../components/Recipes/PageComponents/DifficultyDots";
import RecipeSection from "../components/Recipes/PageComponents/RecipeSection";
import NutritionCard from "../components/Recipes/PageComponents/NutritionCard";

import { Helmet } from "react-helmet-async";
import { generateRecipeSEO } from "../utils/seo";
import RecipeRatingModal from "../components/Recipes/PageComponents/RecipeRatingModal";
import { useAuth } from "../contexts/AuthContext";

export default function RecipePage() {
    const { user } = useAuth();

    const navigate = useNavigate();
    const { id } = useParams();
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isRatingModalOpen, setRatingModalOpen] = useState(false);


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
        return <div className="flex justify-center items-center h-screen">
                <Skeleton key={0} className="h-52 w-96 rounded-md" />
            </div>
    }

    if (!recipe) {
        return <div className="text-center text-red-600">Ricetta non trovata</div>;
    }

    const seo = generateRecipeSEO(recipe);

    const handleRatingSubmit = async (ratingValue: number, reviewText: string) => {
        if (!recipe || !user) {
            addToast({ description: "Devi essere loggato per lasciare una recensione.", color: "danger" });
            return;
        }

        const recipeRef = doc(db, "recipes", recipe.id);
        let updatedReviews = recipe.reviews || [];

        try {
            let newTotalRating = recipe.totalRating || 0;
            let newRatingCount = recipe.ratingCount || 0;

            if (userReview) {
                // Modifica esistente
                updatedReviews = updatedReviews.map((r: any) =>
                    r.uid === user.uid
                        ? { ...r, rating: ratingValue, review: reviewText, editedAt: new Date().toISOString() }
                        : r
                );
                newTotalRating = newTotalRating - userReview.rating + ratingValue;
            } else {
                // Aggiunta nuova
                updatedReviews = [
                    ...updatedReviews,
                    {
                        uid: user.uid,
                        displayName: user.displayName || user.email || "Utente",
                        rating: ratingValue,
                        review: reviewText,
                        createdAt: new Date().toISOString(),
                    },
                ];
                newTotalRating += ratingValue;
                newRatingCount += 1;
            }

            const newAverageRating = parseFloat((newTotalRating / newRatingCount).toFixed(1));

            await updateDoc(recipeRef, {
                reviews: updatedReviews,
                totalRating: newTotalRating,
                ratingCount: newRatingCount,
                averageRating: newAverageRating,
            });

            addToast({
                description: userReview ? "Recensione aggiornata con successo!" : "Grazie per aver lasciato la tua recensione!",
                color: "success",
            });

            setRecipe({
                ...recipe,
                reviews: updatedReviews,
                totalRating: newTotalRating,
                ratingCount: newRatingCount,
                averageRating: newAverageRating,
            });
        } catch (error) {
            console.error("Errore durante il salvataggio della recensione:", error);
            addToast({ description: "Errore durante il salvataggio della recensione.", color: "danger" });
        }
};

    const userReview = recipe.reviews?.find((r: any) => r.uid === user?.uid);
    
    const handleDeleteReview = async () => {
        if (!recipe || !user || !userReview) return;
        const recipeRef = doc(db, "recipes", recipe.id);

        try {
            const updatedReviews = recipe.reviews.filter((r: any) => r.uid !== user.uid);
            const newTotalRating = (recipe.totalRating || 0) - userReview.rating;
            const newRatingCount = (recipe.ratingCount || 1) - 1;
            const newAverageRating = newRatingCount > 0 ? parseFloat((newTotalRating / newRatingCount).toFixed(1)) : 0;

            await updateDoc(recipeRef, {
                reviews: updatedReviews,
                totalRating: newTotalRating,
                ratingCount: newRatingCount,
                averageRating: newAverageRating,
            });

            addToast({ description: "Recensione eliminata correttamente.", color: "success" });
            setRecipe({
                ...recipe,
                reviews: updatedReviews,
                totalRating: newTotalRating,
                ratingCount: newRatingCount,
                averageRating: newAverageRating,
            });
        } catch (error) {
            console.error("Errore durante l'eliminazione della recensione:", error);
            addToast({ description: "Errore durante l'eliminazione.", color: "danger" });
        }
    };



    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <link rel="canonical" href={seo.url} />

                {/* Open Graph */}
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:image" content={seo.image} />
                <meta property="og:url" content={seo.url} />
                <meta property="og:type" content="article" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seo.title} />
                <meta name="twitter:description" content={seo.description} />
                <meta name="twitter:image" content={seo.image} />

                {/* JSON-LD */}
                <script type="application/ld+json">
                    {JSON.stringify(seo.jsonLd)}
                </script>
            </Helmet>

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
                <p className="flex items-center gap-1">
                    <Star className="inline text-yellow-400" fill="#facc15" />
                    <strong className="mr-1">Valutazione:</strong>
                    <span className="text-purple-800 font-semibold">
                        {recipe.averageRating ? recipe.averageRating.toFixed(1) : "N/A"} / 5
                    </span>
                    {recipe.ratingCount ? (
                        <span className="text-gray-500 ml-1">({recipe.ratingCount} valutazioni)</span>
                    ) : null}
                </p>

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
            
            <Button className="mt-4 bg-purple-600 text-white font-semibold" onPress={() => setRatingModalOpen(true)}>
                {userReview ? "Modifica la tua recensione" : "Vota questa ricetta"}
            </Button>

            {userReview && (
                <Button className="mt-2 bg-red-500 text-white font-semibold" onPress={handleDeleteReview}>
                    Elimina la tua recensione
                </Button>
                )}


            {recipe.reviews && recipe.reviews.length > 0 && (
                <RecipeSection title={`Recensioni (${recipe.reviews.length})`} icon={Star}>
                    <div className="space-y-4">
                        {recipe.reviews
                            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((review: any, idx: number) => (
                            <div key={idx} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-purple-700">{review.displayName}</p>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={`${
                                                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                                                }`}
                                                fill={i < review.rating ? "#facc15" : "none"}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.review && (
                                    <p className="text-sm text-gray-800">{review.review}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </RecipeSection>
            )}

            
            <RecipeRatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setRatingModalOpen(false)}
                onSubmit={handleRatingSubmit}
                initialRating={userReview?.rating ?? 0}
                initialReview={userReview?.review ?? ""}
            />


            <footer className="text-sm text-gray-500 pt-4 border-t border-gray-200">
                Creata il {new Date(recipe.createdAt.seconds * 1000).toLocaleDateString()} da <span onClick={() => navigate(`/user-recipes/${recipe.author}`)} className="text-purple-500 font-semibold cursor-pointer">{recipe.author}</span>
            </footer>
        </div>
    );
}