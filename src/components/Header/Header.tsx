import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, AutocompleteItem, Button, Spinner, User } from "@heroui/react";
import { Search, XCircle, Menu } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../../firebase.config";
import { useAuth } from "../../contexts/AuthContext";
import logo from "/assets/logo-black.svg";
import small_logo from "/assets/logo-small.png";
import type { Recipe } from "../../types";
import { motion } from "framer-motion";

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

type Props = { onMenuClick: () => void };

export default function Header({ onMenuClick }: Props) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [recipes, setRecipes] = useState<{ id: string; label: string; recipe: Recipe }[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const debouncedSearch = useDebounce(search, 300);

    const fetchRecipes = useCallback(async () => {
        if (!debouncedSearch.trim()) {
            setRecipes([]);
            return;
        }
        setLoadingSearch(true);
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
            setLoadingSearch(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (debouncedSearch.trim()) {
            navigate(`/search?q=${encodeURIComponent(debouncedSearch.trim())}`);
        }
    };

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full fixed z-50 flex flex-wrap items-center justify-between px-4 py-3 bg-white shadow-md gap-4 sm:gap-6"
        >
            {/* Left: Menu + Logo */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 flex-shrink-0"
            >
                <button className="p-2 rounded-full hover:bg-gray-100" onClick={onMenuClick}>
                    <Menu className="w-6 h-6 text-purple-900" />
                </button>

                <img
                    onClick={() => navigate('/')}
                    src={small_logo}
                    alt="logo mobile"
                    className="h-6 w-auto cursor-pointer block md:hidden"
                />
                <img
                    onClick={() => navigate('/')}
                    src={logo}
                    alt="logo desktop"
                    className="h-12 w-auto cursor-pointer hidden md:block"
                />
            </motion.div>

            {/* Center: Search */}
            <motion.form
                onSubmit={handleSearchSubmit}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-1 w-full sm:w-auto sm:flex-[2] max-w-3xl order-3 sm:order-none"
            >
                <Autocomplete
                    allowsCustomValue
                    inputValue={search}
                    onInputChange={setSearch}
                    isLoading={loadingSearch}
                    placeholder="Cerca ricette, categorie o hashtag..."
                    variant="bordered"
                    radius="full"
                    className="w-full"
                    items={recipes}
                    startContent={<Search className="w-5 h-5 text-purple-600" />}
                    endContent={
                        search.length > 0 && !loadingSearch && (
                            <button type="button" onClick={() => setSearch("")}>
                                <XCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 transition" />
                            </button>
                        )
                    }
                    onSelectionChange={(key) => {
                        const found = recipes.find(r => r.id === key);
                        if (found) navigate(`/recipe/${found.id}`);
                    }}
                    listboxProps={{ className: "max-h-72" }}
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
            </motion.form>

            {/* Right: User / Auth */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 ml-auto"
            >
                {loading ? (
                    <Spinner size="sm" />
                ) : user ? (
                    <>
                        <User
                            avatarProps={{
                                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                            }}
                            name={user.displayName}
                            className="hidden sm:flex"
                        />
                        <Button
                            className="bg-[#9340ff] text-white font-semibold px-4 py-1 text-sm"
                            variant="flat"
                            onPress={() => auth.signOut()}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button
                        className="bg-[#9340ff] text-white font-semibold px-4 py-1 text-sm"
                        onPress={() => navigate('/login')}
                    >
                        Accedi
                    </Button>
                )}
            </motion.div>
        </motion.header>
    );
}
