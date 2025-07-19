import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase.config";
import type { Recipe } from "../types";
import { Card, CardBody, Skeleton } from "@heroui/react";
import { Helmet } from "react-helmet-async";

export default function UserRecipesPage() {
    const { user } = useParams();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    if (!user) {
        return <div className="text-center text-red-500">Utente non fornito.</div>;
    }

    const navigate = useNavigate();

    useEffect(() => {
        console.log(`Fetching recipes for user: ${user}`);
        
        const fetchRecipes = async () => {
            try {
                const qSnap = await getDocs(
                    query(collection(db, "recipes"), where("author", "==", user), orderBy("createdAt", "desc"))
                );
                console.log(`Fetched ${qSnap.docs.length} recipes for user ${user}`);
                
                const data = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
                setRecipes(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, [user]);

    return (
        <div className="max-w-2xl mx-auto p-4 pt-24 space-y-4">
            <Helmet>
                <title>Le mie ricette | Recipe Hub</title>
            </Helmet>
            <h1 className="text-2xl font-bold text-purple-700 mb-4">Le ricette di {user}</h1>

            {loading ? (
                <div className="flex flex-col gap-4 py-10">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-52 w-full rounded-md" />
                    ))}
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center text-gray-500">Non hai ancora pubblicato ricette.</div>
            ) : (
                <div className="flex flex-col gap-4">
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
                                loading="lazy"
                                className="w-full h-52 object-cover"
                            />
                            <CardBody>
                                <h2 className="font-semibold text-lg text-purple-800">{recipe.title}</h2>
                                <p className="text-sm text-gray-600">{recipe.category} • {recipe.preparationTime}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
