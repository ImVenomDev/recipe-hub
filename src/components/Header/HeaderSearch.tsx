import { useState } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Search } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../../types";

export default function HeaderSearch() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearchChange = async (value: string) => {
        setSearch(value);

        if (value.trim().length === 0) {
            setRecipes([]);
            return;
        }

        try {
            const snap = await getDocs(collection(db, "recipes"));
            const filtered = snap.docs
                .map((doc) => ({ id: doc.id, ...doc.data() } as Recipe))
                .filter(
                    (r) =>
                        (r.title && r.title.toLowerCase().includes(value.toLowerCase())) ||
                        (r.category && r.category.toLowerCase().includes(value.toLowerCase())) ||
                        (r.hashtags && r.hashtags.some((tag: string) => tag.toLowerCase().includes(value.toLowerCase())))
                )
                .slice(0, 10); // Limita a 10 risultati per velocità

            setRecipes(filtered);
        } catch (err) {
            console.error("Errore ricerca ricette:", err);
        }
    };

    const handleSelect = (id: string) => {
        navigate(`/recipe/${id}`);
    };
function highlightMatch(text: string, keyword: string) {
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, index) =>
        regex.test(part) ? <span key={index} className="text-purple-600 font-semibold">{part}</span> : part
    );
}

    return (
        <Autocomplete
            placeholder="Cerca ricette..."
            inputValue={search}
            onInputChange={(value: string) => { handleSearchChange(value); }}
            onSelectionChange={(key) => key && handleSelect(key.toString())}
            className="w-full"
            startContent={<Search className="w-5 h-5 text-purple-900" />}
            aria-label="Ricerca ricette"
        >
            {recipes.map((recipe) => (
                <AutocompleteItem key={recipe.id} textValue={recipe.title}>
                    <div className="flex items-center gap-2">
                        <img src={recipe.imageUrl} alt={recipe.title} className="w-8 h-8 rounded object-cover" />
                        <div className="flex flex-col">
                            <span className="font-medium">{highlightMatch(recipe.title, search)}</span>
                            <span className="text-xs text-gray-500">{recipe.category}</span>
                        </div>
                    </div>
                </AutocompleteItem>
            ))}
        </Autocomplete>
    );
}
