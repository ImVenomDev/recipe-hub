import { useState } from "react";
import { Input, Button, Select, SelectItem } from "../styles";
import type { Ingredient, RecipeFormProps } from "../../types";
import { Checkbox, CheckboxGroup } from "@heroui/react";

const units = ["kg", "gr", "l", "ml", "pz", "cucchiaio", "cucchiaino", "bicchiere", "q.b."];
const difficulties = [1, 2, 3, 4, 5];

export default function RecipeForm({ categories = ["Primi", "Secondi", "Dolci"], onSubmit }: RecipeFormProps) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    glutenFree: false,
    servings: "",
    difficulty: "1",
    isUnique: false,
    isProteic: false,
    ingredients: [{ name: "", quantity: "", unit: "gr" }],
    steps: [""],
    preparationTime: "",
    risingTime: "",
    sleepTime: "",
    totalTime: "",
    notes: "",
    imageUrl: "",
    author: ""
  });

  const updateForm = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...form.ingredients];
    updated[index][field] = value;
    updateForm("ingredients", updated);
  };

  const handleStepChange = (index: number, value: string) => {
    const updated = [...form.steps];
    updated[index] = value;
    updateForm("steps", updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      difficulty: parseInt(form.difficulty, 10),
      total_ingredients: form.ingredients.length,
      createdAt: new Date(),
    });
    setForm({
      title: "",
      category: "",
      glutenFree: false,
      servings: "",
      difficulty: "1",
      isUnique: false,
      isProteic: false,
      ingredients: [{ name: "", quantity: "", unit: "gr" }],
      steps: [""],
      preparationTime: "",
      risingTime: "",
      sleepTime: "",
      totalTime: "",
      notes: "",
      imageUrl: "",
      author: ""
    });
  };

  return (
    <div className="py-4 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">🍽️ Crea Ricetta</h1>
          <p className="text-gray-600">Condividi la tua ricetta speciale</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input required label="Autore" value={form.author} onChange={(e: any) => updateForm("author", e.target.value)} />
          <Input required label="Titolo" value={form.title} onChange={(e: any) => updateForm("title", e.target.value)} className="my-5" />

          <div className="flex items-center gap-4">
            <Input required label="Dosi per... persone" value={form.servings} onChange={(e: any) => updateForm("servings", e.target.value)} className="flex-1" />
            <Select label="Difficoltà" value={form.difficulty} onChange={(e: any) => updateForm("difficulty", e.target.value)} className="flex-1">
              {difficulties.map((n) => (
                <SelectItem key={n} value={n}>{n} / 5</SelectItem>
              ))}
            </Select>
          </div>

          <CheckboxGroup orientation="horizontal">
            <Checkbox value="unique" checked={form.isUnique} onChange={(e) => updateForm("isUnique", e.target.checked)}>
              <span className="text-sm text-gray-700">Piatto unico</span>
            </Checkbox>
            <Checkbox value="proteic" checked={form.isProteic} onChange={(e) => updateForm("isProteic", e.target.checked)}>
              <span className="text-sm text-gray-700">Proteico</span>
            </Checkbox>
            <Checkbox value="gluten free" checked={form.glutenFree} onChange={() => updateForm("glutenFree", !form.glutenFree)}>
              <span className="text-sm text-gray-700">Gluten Free</span>
            </Checkbox>
          </CheckboxGroup>

          <Select required label="Categoria" onChange={(e: any) => updateForm("category", e.target.value)} value={form.category}>
            {categories.map((cat) => <SelectItem key={cat}>{cat}</SelectItem>)}
          </Select>

          {/* INGREDIENTI */}
          <div className="bg-purple-50 rounded-xl p-4 space-y-4 my-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">🥄 Ingredienti</h3>
            {form.ingredients.map((ing, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                <div className="flex flex-col gap-3">
                  <Input label="Ingrediente" value={ing.name} onChange={(e: any) => handleIngredientChange(i, "name", e.target.value)} required className="w-full" />
                  <div className="flex gap-3">
                    {ing.unit !== "q.b." && (
                      <Input label="Quantità" type="number" value={ing.quantity} onChange={(e: any) => handleIngredientChange(i, "quantity", e.target.value)} className="flex-1" required />
                    )}
                    <Select label="Unità" value={ing.unit} onChange={(e: any) => handleIngredientChange(i, "unit", e.target.value)} className={ing.unit === "q.b." ? "flex-1" : "w-20 flex-shrink-0"}>
                      {units.map((u) => <SelectItem key={u} textValue={u}>{u}</SelectItem>)}
                    </Select>
                    {form.ingredients.length > 1 && (
                      <button type="button" onClick={() => updateForm("ingredients", form.ingredients.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 rounded-lg p-2 transition-colors self-end mb-1">🗑️</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" onPress={() => updateForm("ingredients", [...form.ingredients, { name: "", quantity: "", unit: "gr" }])} variant="light" className="w-full">➕ Aggiungi ingrediente</Button>
          </div>

          {/* STEP */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">📝 Procedimento</h3>
            {form.steps.map((step, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">{i + 1}</div>
                  <textarea value={step} onChange={(e) => handleStepChange(i, e.target.value)} className="flex-1 border rounded-lg p-3 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" placeholder={`Descrivi il passo ${i + 1}...`} required />
                  {form.steps.length > 1 && (
                    <button type="button" onClick={() => updateForm("steps", form.steps.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 rounded-lg p-2 transition-colors flex-shrink-0">🗑️</button>
                  )}
                </div>
              </div>
            ))}
            <Button type="button" onPress={() => updateForm("steps", [...form.steps, ""])} variant="light" className="w-full">➕ Aggiungi passo</Button>
          </div>

          {/* TEMPI */}
          <div className="bg-green-50 rounded-xl p-4 space-y-4 my-5">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">⏰ Tempi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Tempo di preparazione" required value={form.preparationTime} onChange={(e: any) => updateForm("preparationTime", e.target.value)} />
              <Input label="Tempo totale" required value={form.totalTime} onChange={(e: any) => updateForm("totalTime", e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Tempo di lievitazione (opzionale)" value={form.risingTime} onChange={(e: any) => updateForm("risingTime", e.target.value)} />
              <Input label="Tempo di riposo (opzionale)" value={form.sleepTime} onChange={(e: any) => updateForm("sleepTime", e.target.value)} />
            </div>
          </div>

          {/* NOTE E IMMAGINE */}
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">📝 Note aggiuntive</h3>
              <textarea className="w-full border rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none" placeholder="Aggiungi eventuali note, consigli o varianti..." value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} />
            </div>
            <Input required type="url" label="🖼️ Immagine (URL)" placeholder="https://esempio.com/immagine.jpg" value={form.imageUrl} onChange={(e: any) => updateForm("imageUrl", e.target.value)} />
          </div>

          <Button type="submit" className="bg-gradient-to-r mt-5 from-purple-600 to-indigo-600 text-white w-full py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            ✨ Crea la tua ricetta ✨
          </Button>
        </form>
      </div>
    </div>
  );
}