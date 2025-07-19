import { useEffect, useState } from "react";
import type { Recipe } from "../types";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase.config";
import RecipeSection from "../components/Home/Recipes/RecipeSection";

export default function MostPopular() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestRecipes = async () => {
            setLoading(true);
            try {
                const recipesQuery = query(
                    collection(db, "recipes"),
                    orderBy("rating", "desc"),
                    limit(10)
                );
                const qSnap = await getDocs(recipesQuery);
                const fetched = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
                setRecipes(fetched);

                // Tracking
                if (window.gtag) {
                    window.gtag("event", "view_latest_recipes", {
                        recipe_count: fetched.length,
                    });
                }
            } catch (error) {
                console.error("Errore caricamento ultime ricette:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestRecipes();
    }, []);

    return (
        <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="mt-10 md:mt-1 text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Ricette più popolari
            </h1>
            {loading ? (
                <p>Caricamento...</p>
            ) : (
                <RecipeSection recipes={recipes} />
            )}
        </div>
    );
}