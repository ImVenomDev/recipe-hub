import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase.config";
import type { Category, Recipe } from "../types";
import { Card, CardBody, Button, Spinner, CardFooter, Chip } from "@heroui/react";
import { Helmet } from "react-helmet-async";
import { Clock, Star } from "lucide-react";

// Add global type for window.gtag
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

type Props = {
    categories: Category[];
};

export default function CategoryPage({ categories }: Props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const matchedCategory = categories.find(
        (cat) => cat.title.toLowerCase() === id?.toLowerCase()
    );

    useEffect(() => {
        const fetchRecipes = async () => {
            if (!matchedCategory) return;
            setLoading(true);
            try {
                const recipesQuery =
                matchedCategory.title.toLowerCase() === "senza glutine"
                    ? query(
                        collection(db, "recipes"),
                        where("glutenFree", "==", true),
                        orderBy("createdAt", "desc")
                    )
                    : query(
                        collection(db, "recipes"),
                        where("category", "==", matchedCategory.title),
                        orderBy("createdAt", "desc")
                    );

const qSnap = await getDocs(recipesQuery);

                const fetched = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
                setRecipes(fetched);

                // Tracking
                if (window.gtag) {
                    window.gtag("event", "view_category", {
                        category: matchedCategory.title,
                        recipe_count: fetched.length,
                    });
                }
            } catch (error) {
                console.error("Errore caricamento ricette categoria:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [matchedCategory]);

    if (!matchedCategory) {
        return (
            <div className="text-center py-24">
                <p className="text-gray-500">Categoria non trovata.</p>
                <Button onPress={() => navigate(-1)} className="mt-4">Torna indietro</Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 pt-10 space-y-6">
            <Helmet>
                <title>{matchedCategory.title} | Recipe Hub</title>
                <meta name="description" content={`Scopri le ricette per la categoria ${matchedCategory.title} su Recipe Hub.`} />
            </Helmet>

            <h1 className="text-2xl sm:text-3xl font-bold text-purple-900">
                {matchedCategory.title}
            </h1>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Spinner label="Caricamento ricette..." />
                </div>
            ) : recipes.length === 0 ? (
                <p className="text-center text-gray-500">Nessuna ricetta trovata in questa categoria.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recipes.map(recipe => (
                        <Card
                            key={recipe.id}
                            isPressable
                            onPress={() => navigate(`/recipe/${recipe.id}`)}
                            className="hover:shadow transition"
                        >
                            <img
                                src={recipe.imageUrl || "https://via.placeholder.com/400"}
                                alt={recipe.title}
                                className="w-full h-48 object-cover"
                            />
                            <CardBody className="p-4 space-y-1">
                                <div className="flex justify-between">
                                    <h2 className="font-semibold text-lg text-purple-800">{recipe.title}</h2>
                                    
                                    {recipe.rating !== undefined && (
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            {recipe.rating.toFixed(1)}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-600">
                                    ✍️ {recipe.author || "Autore sconosciuto"}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-700">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-purple-700" />
                                        {recipe.preparationTime}
                                    </span>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <div className="flex flex-wrap gap-2">
                                    {recipe.glutenFree ? <Chip color="danger" variant="dot" size="sm">
                                        Senza glutine
                                    </Chip> : null}
                                    {recipe.isProteic ? <Chip color="warning" variant="dot" size="sm">
                                        Proteica
                                    </Chip> : null}{recipe.isUnique ? <Chip color="success" variant="dot" size="sm">
                                        Unica
                                    </Chip> : null}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
