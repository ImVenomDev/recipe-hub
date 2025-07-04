import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Autocomplete,
    AutocompleteItem
} from "@heroui/react";
import { Search, XCircle } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase.config";
import type { Recipe } from "../../types";

function useDebounce(value: string, delay: number) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

function highlightMatch(text: string, keyword: string) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, i) =>
        regex.test(part)
            ? <span key={i} className="text-purple-600 font-semibold">{part}</span>
            : part
    );
}

export default function HeaderSearch() {
    const [search, setSearch] = useState("");
    const [recipes, setRecipes] = useState<{ id: string; label: string; recipe: Recipe }[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const debouncedSearch = useDebounce(search, 300);

    const fetchRecipes = useCallback(async () => {
        if (!debouncedSearch.trim()) {
            setRecipes([]);
            return;
        }
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "recipes"));
            const allRecipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
            const lowerSearch = debouncedSearch.toLowerCase();

            const filtered = allRecipes.filter(r =>
                r.title?.toLowerCase().includes(lowerSearch) ||
                r.category?.toLowerCase().includes(lowerSearch) ||
                r.author?.toLowerCase().includes(lowerSearch) ||
                (Array.isArray(r.hashtags) && r.hashtags.some((h: string) => h.toLowerCase().includes(lowerSearch)))
            );

            const structured = filtered.map(r => ({
                id: r.id,
                label: r.title || "Senza titolo",
                recipe: r
            }));

            setRecipes(structured);
        } catch (error) {
            console.error("Errore caricamento ricette:", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (debouncedSearch.trim()) {
            navigate(`/search?q=${encodeURIComponent(debouncedSearch.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <Autocomplete
                allowsCustomValue
                inputValue={search}
                onInputChange={setSearch}
                isLoading={loading}
                placeholder="Cerca ricette, categorie o hashtag..."
                variant="bordered"
                radius="full"
                className="w-full"
                items={recipes}
                startContent={<Search className="w-5 h-5 text-purple-600" />}
                endContent={
                    search.length > 0 && !loading && (
                        <button type="button" onClick={() => setSearch("")}>
                            <XCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 transition" />
                        </button>
                    )
                }
                onSelectionChange={(key) => {
                    const found = recipes.find(r => r.id === key);
                    if (found) navigate(`/recipe/${found.id}`);
                }}
                listboxProps={{
                    className: "max-h-72"
                }}
            >
                {(item) => (
                    <AutocompleteItem
                        key={item.id}
                        textValue={item.label}
                        className="flex items-center gap-3 py-2 px-2"
                    >
                        <img
                            src={item.recipe.imageUrl || "https://via.placeholder.com/40"}
                            alt={item.recipe.title}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col">
                            <span className="font-medium">
                                {highlightMatch(item.label, debouncedSearch)}
                            </span>
                            <span className="text-xs text-gray-500">
                                {item.recipe.category} • {item.recipe.author}
                            </span>
                        </div>
                    </AutocompleteItem>
                )}
            </Autocomplete>
        </form>
    );
}
