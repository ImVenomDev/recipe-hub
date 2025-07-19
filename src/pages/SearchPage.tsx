import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, startAfter } from "firebase/firestore";
import { db } from "../../firebase.config";
import type { Recipe } from "../types";
import {
    Card, CardBody, CardFooter,
    Button, Chip, Select, SelectItem,
    Skeleton
} from "@heroui/react";
import { Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SORT_OPTIONS = [
    { value: "recent", label: "Più recenti" },
    { value: "popular", label: "Più popolari" },
    { value: "duration", label: "Tempo di preparazione" },
];

export default function SearchPage() {
    const q = useQuery().get("q")?.toLowerCase() || "";
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [sort, setSort] = useState("recent");
    const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchRecipes = async (isLoadMore = false) => {
        const sortField = sort === "recent" ? "createdAt" :
                          sort === "popular" ? "rating" :
                          "preparationTime";

        setLoading(isLoadMore ? false : true);

        try {
            const baseQuery = query(
                collection(db, "recipes"),
                orderBy(sortField, "desc"),
                ...(isLoadMore && lastVisible ? [startAfter(lastVisible)] : [])
            );

            const qSnap = await getDocs(baseQuery);
            const fetched = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));

            const filtered = fetched.filter(r => {
                const matchQuery =
                    r.title?.toLowerCase().includes(q) ||
                    r.category?.toLowerCase().includes(q) ||
                    r.author?.toLowerCase().includes(q) ||
                    (Array.isArray(r.hashtags) && r.hashtags.some(h => h.toLowerCase().includes(q)));
                const matchHashtag =
                    selectedHashtag ? r.hashtags?.includes(selectedHashtag) : true;
                return matchQuery && matchHashtag;
            });

            if (isLoadMore) {
                setRecipes(prev => [...prev, ...filtered]);
            } else {
                setRecipes(filtered);
            }
            setLastVisible(qSnap.docs[qSnap.docs.length - 1]);

            // Tracking ricerca (integrabile Firestore / Plausible / LogRocket)
            console.log(`[TRACKING] Ricerca: "${q}", risultati: ${filtered.length}`);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, [q, sort, selectedHashtag]);

    return (
        <div className="max-w-2xl mx-auto p-4 pt-24 space-y-6">
            <Helmet>
                <title>Risultati per "{q}" | Recipe Hub</title>
                <meta name="description" content={`Scopri ricette, categorie e hashtag per "${q}" su Recipe Hub.`} />
            </Helmet>

            <div className="flex flex-wrap justify-between items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-purple-800">
                    Risultati per: "{q}"
                </h1>
                <Select
                    size="sm"
                    placeholder="Ordina per"
                    selectedKeys={[sort]}
                    onSelectionChange={(keys) => setSort(Array.from(keys)[0] as string)}
                    className="max-w-[180px]"
                >
                    {SORT_OPTIONS.map(opt => (
                        <SelectItem key={opt.value}>{opt.label}</SelectItem>
                    ))}
                </Select>
            </div>

            {loading ? (
                <div className="flex flex-col gap-4 py-10">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-52 w-full rounded-md" />
                    ))}
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center text-gray-500 py-10">Nessun risultato trovato.</div>
            ) : (
                <>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
                        }}
                        className="flex flex-col gap-4"
                    >
                        {recipes.map(recipe => (
                            <motion.div
                                key={recipe.id}
                                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                            >
                                <Card
                                    isPressable
                                    onPress={() => navigate(`/recipe/${recipe.id}`)}
                                    className="hover:shadow-md transition overflow-hidden items-center justify-center text-center m-0 flex w-full"
                                >
                                    <img
                                        src={recipe.imageUrl || "https://via.placeholder.com/400"}
                                        alt={recipe.title}
                                        className="w-full h-96 object-cover"
                                    />
                                    <CardBody className="p-4 space-y-2">
                                        <h2 className="font-semibold text-lg text-purple-800">
                                            {recipe.title}
                                        </h2>
                                        <div className="text-sm text-gray-600 flex flex-wrap gap-2">
                                            <span>🍽️ {recipe.category}</span>
                                            <span>✍️ {recipe.author}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-700">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-purple-700" /> {recipe.preparationTime}
                                            </span>
                                            {recipe.rating !== undefined && (
                                                <span className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500" /> {recipe.rating.toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {recipe.hashtags?.map((tag:any, idx:any) => (
                                                <Chip
                                                    key={idx}
                                                    size="sm"
                                                    className={`bg-gray-200/60 ${selectedHashtag === tag ? 'font-semibold' : ''}`}
                                                    onClick={() => setSelectedHashtag(selectedHashtag === tag ? null : tag)}
                                                >
                                                    #{tag}
                                                </Chip>
                                            ))}
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <Button
                                            variant="flat"
                                            color="secondary"
                                            fullWidth
                                            onPress={() => navigate(`/recipe/${recipe.id}`)}
                                        >
                                            Visualizza Ricetta
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    );
}
