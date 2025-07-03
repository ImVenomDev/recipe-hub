import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import type { Recipe } from '../types';
import { Spinner, Card, CardBody, Button, Select, SelectItem, Badge } from '@heroui/react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
    const query = useQuery();
    const navigate = useNavigate();
    const searchTerm = query.get('q')?.toLowerCase() || '';

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('recent');

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const snapshot = await getDocs(collection(db, 'recipes'));
                let filtered: Recipe[] = [];
                snapshot.forEach(doc => {
                    const data = doc.data() as Recipe;
                    const hashtags = (data as any).hashtags || [];

                    if (
                        data.title?.toLowerCase().includes(searchTerm) ||
                        data.category?.toLowerCase().includes(searchTerm) ||
                        (Array.isArray(hashtags) && hashtags.some(tag => tag.toLowerCase().includes(searchTerm)))
                    ) {
                        filtered.push({
                            ...data,
                            id: doc.id
                        });
                    }
                });

                setRecipes(filtered);
            } catch (err) {
                console.error('Errore ricerca:', err);
            } finally {
                setLoading(false);
            }
        };

        if (searchTerm.length > 0) {
            fetchRecipes();
        } else {
            setLoading(false);
            setRecipes([]);
        }
    }, [searchTerm]);

    const sortedRecipes = recipes.slice().sort((a, b) => {
        if (sort === 'rating') {
            return (b.rating ?? 0) - (a.rating ?? 0);
        } else if (sort === 'time') {
            return (parseInt(a.time) || 0) - (parseInt(b.time) || 0);
        } else {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        }
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4"
        >
            <Button
                isIconOnly
                variant="light"
                className="mb-2"
                onPress={() => navigate(-1)}
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>

            <h1 className="text-2xl font-bold text-purple-800">
                Risultati per: <span className="text-purple-600">{searchTerm}</span>
            </h1>

            <div className="flex items-center gap-4 justify-between">
                <p className="text-sm text-gray-600">{recipes.length} ricette trovate</p>
                <Select
                    label="Ordina per"
                    selectedKeys={[sort]}
                    onSelectionChange={(keys) => setSort(String(Array.from(keys)[0]))}
                    size="sm"
                >
                    <SelectItem key="recent">Più recenti</SelectItem>
                    <SelectItem key="rating">Maggiore valutazione</SelectItem>
                    <SelectItem key="time">Tempo di preparazione</SelectItem>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Spinner label="Caricamento ricette..." />
                </div>
            ) : sortedRecipes.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Nessuna ricetta trovata per questa ricerca.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sortedRecipes.map(recipe => (
                        <Card
                            key={recipe.id}
                            isPressable
                            onPress={() => navigate(`/recipe/${recipe.id}`)}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <CardBody className="flex gap-4 items-center p-3">
                                {recipe.imageUrl && (
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                )}
                                <div className="flex flex-col">
                                    <p className="font-medium">{recipe.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                        <Badge color="secondary" variant="flat" size="sm">
                                            {recipe.category}
                                        </Badge>
                                        {recipe.rating && <>⭐ {recipe.rating}/5</>}
                                        {recipe.preparationTime && <>⏱️ {recipe.preparationTime} min</>}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
