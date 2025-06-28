import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Input, Button } from "@heroui/react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";

interface Category {
    id: string;
    title: string;
    img: string;
    show: boolean;
}

interface Props {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export default function CategorieSection({ categories, setCategories }: Props) {
    const [editing, setEditing] = useState<Category | null>(null);

    const handleUpdate = async () => {
        if (!editing) return;
        try {
            const { id, ...fieldsToUpdate } = editing;
            await updateDoc(doc(db, "categories", editing.id), fieldsToUpdate);
            setCategories((prev) =>
                prev.map((cat) => (cat.id === editing.id ? editing : cat))
            );
            setEditing(null);
        } catch (err) {
            console.error("Errore aggiornamento categoria:", err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "categories", id));
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
        } catch (err) {
            console.error("Errore eliminazione categoria:", err);
        }
    };

    return (
        <motion.div layout className="bg-white border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-purple-700">Categorie</h3>
            <ul className="space-y-2 text-sm">
                {categories.map((cat) => (
                    <li
                        key={cat.id}
                        className="flex justify-between items-center border-b pb-2"
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={cat.img || "https://via.placeholder.com/50"}
                                alt={cat.title}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span>{cat.title}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditing(cat)}
                                className="text-blue-600"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-red-600"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modifica categoria */}
            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 bg-gray-50 p-4 border rounded-lg"
                    >
                        <Input
                            label="Titolo"
                            value={editing.title}
                            onChange={(e) =>
                                setEditing({ ...editing, title: e.target.value })
                            }
                            className="mb-2"
                        />
                        <Input
                            label="Immagine (link)"
                            value={editing.img}
                            onChange={(e) =>
                                setEditing({ ...editing, img: e.target.value })
                            }
                            className="mb-2"
                        />
                        <label className="flex items-center gap-2 mb-2 text-sm">
                            <input
                                type="checkbox"
                                checked={editing.show}
                                onChange={(e) =>
                                    setEditing({ ...editing, show: e.target.checked })
                                }
                            />
                            Mostra pubblicamente
                        </label>
                        <div className="flex gap-2">
                            <Button onClick={handleUpdate} className="bg-green-600 text-white">
                                Salva
                            </Button>
                            <Button onClick={() => setEditing(null)}>Annulla</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
