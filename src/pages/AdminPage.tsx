import { useEffect, useState } from "react";
import { db } from "../../firebase.config";
import {
  collection, getDocs, doc, addDoc, updateDoc, deleteDoc
} from "firebase/firestore";
import {
  Input, Button, Spinner, Card, CardHeader, CardBody
} from "@heroui/react";
import { Users, BookOpenText, Tag, LayoutDashboard, Pencil, Trash2, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import RecipeEditModal from "../components/Admin/RecipeEditModal";
import type { Recipe } from "../types";

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [recipes, setRecipes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [hashtags, setHashtags] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState({ title: "", img: "", show: true });
    const [newHashtag, setNewHashtag] = useState("");

    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [editingHashtag, setEditingHashtag] = useState<any | null>(null);

    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isRecipeModalOpen, setRecipeModalOpen] = useState(false);

    
    useEffect(() => {
        const fetchAll = async () => {
        try {
            const [usersSnap, recipesSnap, categoriesSnap, hashtagsSnap] = await Promise.all([
            getDocs(collection(db, "users")),
            getDocs(collection(db, "recipes")),
            getDocs(collection(db, "categories")),
            getDocs(collection(db, "hashtags")),
            ]);
            setUsers(usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setRecipes(recipesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setCategories(categoriesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setHashtags(hashtagsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error("Errore caricamento:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchAll();
    }, []);

    const handleOpenEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalOpen(true);
    };

    const handleSaveRecipe = async (updated: Recipe) => {
    await updateDoc(doc(db, "recipes", updated.id), updated);
    setRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    };
    const addDocWithReset = async (
        col: string,
        data: any,
        reset: () => void,
        setter: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
        try {
        const docRef = await addDoc(collection(db, col), data);
        setter((prev) => [...prev, { id: docRef.id, ...data }]);
        reset();
        } catch (err) {
        console.error(`Errore aggiunta in ${col}:`, err);
        }
    };

    const updateDocData = async (col: string, id: string, data: any, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        try {
        await updateDoc(doc(db, col, id), data);
        setter((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
        } catch (err) {
        console.error(`Errore aggiornamento in ${col}:`, err);
        }
    };

    const deleteDocData = async (col: string, id: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        try {
        await deleteDoc(doc(db, col, id));
        setter((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
        console.error(`Errore eliminazione da ${col}:`, err);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-10"><Spinner label="Caricamento..." /></div>;
    }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-purple-800">Pannello di Amministrazione</h1>

      {/* STATISTICHE */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Users className="w-5 h-5" />, label: "Utenti", value: users.length },
          { icon: <BookOpenText className="w-5 h-5" />, label: "Ricette", value: recipes.length },
          { icon: <LayoutDashboard className="w-5 h-5" />, label: "Categorie", value: categories.length },
          { icon: <Tag className="w-5 h-5" />, label: "Hashtag", value: hashtags.length }
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex items-center gap-2 text-purple-700 font-semibold">{stat.icon} {stat.label}</CardHeader>
            <CardBody>{stat.value}</CardBody>
          </Card>
        ))}
      </section>

      {/* LISTE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categorie */}
        <motion.div layout className="bg-white border p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Categorie</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-2">
                  <img src={cat.img || "https://via.placeholder.com/50"} alt={cat.title} className="w-10 h-10 rounded-full" />
                  <span>{cat.title}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingCategory(cat)} className="text-blue-600"><Pencil size={16} /></button>
                  <button onClick={() => deleteDocData("categories", cat.id, setCategories)} className="text-red-600"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>

          {/* Modifica categoria */}
          <AnimatePresence>
            {editingCategory && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 bg-gray-50 p-4 border rounded-lg">
                <Input label="Titolo" value={editingCategory.title} onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })} className="mb-2" />
                <Input label="Immagine (link)" value={editingCategory.img} onChange={(e) => setEditingCategory({ ...editingCategory, img: e.target.value })} className="mb-2" />
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked={editingCategory.show} onChange={(e) => setEditingCategory({ ...editingCategory, show: e.target.checked })} />
                  <label>Mostra pubblicamente</label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => {
                    updateDocData("categories", editingCategory.id, editingCategory, setCategories);
                    setEditingCategory(null);
                  }} className="bg-green-600 text-white">Salva</Button>
                  <Button onClick={() => setEditingCategory(null)}>Annulla</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hashtag */}
        <motion.div layout className="bg-white border p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Hashtag</h3>
          <ul className="space-y-2 text-sm">
            {hashtags.map((tag) => (
              <li key={tag.id} className="flex justify-between items-center border-b pb-2">
                <span>{tag.title}</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditingHashtag(tag)} className="text-blue-600"><Pencil size={16} /></button>
                  <button onClick={() => deleteDocData("hashtags", tag.id, setHashtags)} className="text-red-600"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>

          {/* Modifica hashtag */}
          <AnimatePresence>
            {editingHashtag && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 bg-gray-50 p-4 border rounded-lg">
                <Input label="Titolo" value={editingHashtag.title} onChange={(e) => setEditingHashtag({ ...editingHashtag, title: e.target.value })} />
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => {
                    updateDocData("hashtags", editingHashtag.id, editingHashtag, setHashtags);
                    setEditingHashtag(null);
                  }} className="bg-green-600 text-white">Salva</Button>
                  <Button onClick={() => setEditingHashtag(null)}>Annulla</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* AGGIUNTA */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form categorie */}
        <form onSubmit={(e) => {
          e.preventDefault();
          addDocWithReset("categories", newCategory, () => setNewCategory({ title: "", img: "", show: true }), setCategories);
        }} className="bg-white border p-4 rounded-lg shadow-sm space-y-2">
          <h3 className="text-purple-700 font-semibold">Nuova Categoria</h3>
          <Input placeholder="Titolo" value={newCategory.title} onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })} />
          <Input placeholder="Link immagine" value={newCategory.img} onChange={(e) => setNewCategory({ ...newCategory, img: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={newCategory.show} onChange={(e) => setNewCategory({ ...newCategory, show: e.target.checked })} />
            Mostra pubblicamente
          </label>
          <Button type="submit" className="bg-purple-600 text-white">Aggiungi</Button>
        </form>

        {/* Form hashtag */}
        <form onSubmit={(e) => {
          e.preventDefault();
          addDocWithReset("hashtags", { title: newHashtag }, () => setNewHashtag(""), setHashtags);
        }} className="bg-white border p-4 rounded-lg shadow-sm space-y-2">
          <h3 className="text-purple-700 font-semibold">Nuovo Hashtag</h3>
          <Input placeholder="#veloce" value={newHashtag} onChange={(e) => setNewHashtag(e.target.value)} />
          <Button type="submit" className="bg-purple-600 text-white">Aggiungi</Button>
        </form>
      </section>

      {/* UTENTI e RICETTE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Utenti</h3>
          <ul className="space-y-2 text-sm max-h-64 overflow-auto">
            {users.map((u) => (
              <li key={u.id} className="border-b pb-1">
                <div className="flex items-center gap-2">
                    <p>{u.username}</p>
                    <p className={`text-xs ${u.admin ? "text-green-600" : "text-gray-500"}`}>
                        {u.admin ? "Amministratore" : "Utente"}
                    </p>
                </div>
                <p className="text-gray-400">{u.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  
                  <Button
                    size="sm"
                    color={u.admin ? "danger" : "success"}
                    onPress={() => updateDocData("users", u.id, { admin: !u.admin }, setUsers)}
                  >
                    {u.admin ? "Rimuovi Admin" : "Rendi Admin"}
                  </Button>
                  <p>
                    <Settings size={16} />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Ricette</h3>
          <ul className="space-y-2 text-sm max-h-64 overflow-auto">
            {recipes.map((r) => (
              <li key={r.id} className="border-b pb-1">
                {r.title || "Senza titolo"} - <span className="text-gray-500">{r.category}</span>
                <button onClick={() => handleOpenEdit(r)} className="text-blue-600"><Pencil size={16} /></button>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <RecipeEditModal
        isOpen={isRecipeModalOpen}
        onClose={() => setRecipeModalOpen(false)}
        recipe={selectedRecipe}
        onSave={handleSaveRecipe}
        />

    </motion.div>
  );
}
