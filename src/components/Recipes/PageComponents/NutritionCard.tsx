import { useEffect, useState, useCallback } from "react";
import { Flame, AlertCircle, RefreshCw, Info } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Sicurezza: usa variabile env
const ai = new GoogleGenAI({ apiKey: API_KEY });

type Ingredient = { name: string; quantity: number; unit: string };
type Section = { title: string; lines: string[] };

export default function NutritionCard({ ingredients }: { ingredients: Ingredient[] }) {
    const [nutrition, setNutrition] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parseSections = (raw: string): Section[] =>
        raw
            .split("**\n")
            .filter(Boolean)
            .map((sec) => {
                const [titleLine, ...rest] = sec.split("\n").filter(Boolean);
                return { title: titleLine.replace(/\*/g, "").trim(), lines: rest };
            });

    const calculateNutrition = useCallback(async () => {
        if (!ingredients.length) return;

        setLoading(true);
        setError(null);

        const prompt = `
            Sei un nutrizionista professionista. Calcola i valori nutrizionali ESATTI per la ricetta completa considerando SOLO gli ingredienti forniti, senza variazioni o commenti. Restituisci in italiano questa sezione in forma di lista chiusa:

            **Valori totali per l'intera ricetta**:
            kcal:
            carboidrati:
            proteine:
            grassi:
            fibre:


            Ingredienti:
            ${ingredients.map(i => `- ${i.quantity} ${i.unit} di ${i.name}`).join("\n")}`;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: { temperature: 0},
            });

            const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
            if (!text) throw new Error("Risposta vuota dall'AI.");
            
            setNutrition(text);
            
        } catch (e: any) {
            console.error(e);
            setError("Errore nel calcolo. Riprova più tardi.");
        } finally {
            setLoading(false);
        }
    }, [ingredients]);

    useEffect(() => {
        calculateNutrition();
    }, [calculateNutrition]);

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6">
            <header className="flex items-center justify-between">
                <h3 className="flex items-center text-2xl font-bold text-green-700 gap-2">
                    <Flame className="w-6 h-6 text-orange-500" /> Valori Nutrizionali
                </h3>
                {!loading && error && (
                    <button onClick={calculateNutrition} className="text-green-600 hover:text-green-800">
                        <RefreshCw className="w-6 h-6" />
                    </button>
                )}
            </header>

            {loading ? (
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
            ) : error ? (
                <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{error}</p>
                </div>
            ) : nutrition ? (
                <>
                    {parseSections(nutrition).map((sec) => (
                        <section key={sec.title} className="bg-green-50 border border-green-200 p-4 rounded-2xl">
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {sec.lines.map((l, i) => (
                                    <li key={i}>{l}</li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </>
            ) : (
                <p className="text-gray-500 italic">Aggiungi ingredienti per visualizzare i valori.</p>
            )}

            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-2xl flex gap-3">
                <Info className="w-5 h-5 text-yellow-600" />
                <p className="text-sm">
                    <strong>Attenzione.</strong> I valori nutrizionali forniti sono stime generate da Gemini in base agli
                    ingredienti indicati e non sostituiscono un consulto medico. Assicurati di verificare sempre le informazioni 
                    nutrizionali con un professionista della salute. 
                </p>
            </div>
        </div>
    );
}
