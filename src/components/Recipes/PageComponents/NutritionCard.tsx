import { useEffect, useState, useCallback } from "react";
import { Flame, AlertCircle, RefreshCw, Info } from "lucide-react";

const DEV_MODE = false;
const MOCK_DELAY = 1000;
const GROQ_API_KEY = "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";

type Ingredient = { name: string; quantity: number; unit: string };

type Section = { title: string; lines: string[] };

export default function NutritionCard({ ingredients }: { ingredients: Ingredient[] }) {
  const [nutrition, setNutrition] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockApiCall = async (_prompt: string) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return { choices: [{ message: { content: `**Valori totali per l'intera ricetta**:\nKcal: 1500\nCarboidrati: 200g\nProteine: 50g\nGrassi: 60g\nFibre: 10g\n\n**Valori medi per 100g di ricetta**:\nKcal: 250\nCarboidrati: 33g\nProteine: 8g\nGrassi: 10g\nFibre: 1.6g` } }] };
  };

  const realApiCall = async (prompt: string) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 1000,
      }),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  };

  const parseSections = (raw: string): Section[] =>
    raw
      .split("**")
      .filter(Boolean)
      .map((sec) => {
        const [titleLine, ...rest] = sec.split("\n").filter(Boolean);
        return { title: titleLine.replace(/\*/g, "").trim(), lines: rest };
      });

  const calculateNutrition = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNutrition(null);

    const prompt = `Calcola come un nutrizionista, i valori nutrizionali totali per questa ricetta completa. Gli ingredienti sono: ${ingredients
      .map((i) => `${i.quantity} ${i.unit} di ${i.name}`)
      .join(", ")}. Restituisci in italiano una sezione: **Valori totali per l'intera ricetta**, elencando kcal, carboidrati, proteine, grassi e fibre. Solo liste con numeri.`;

    try {
      const res = DEV_MODE ? await mockApiCall(prompt) : await realApiCall(prompt);
      const content = res.choices[0].message.content.trim();
      setNutrition(content);
    } catch (e: any) {
      console.error(e);
      setError("Problema nel calcolo. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }, [ingredients]);

  useEffect(() => {
    if (ingredients.length) calculateNutrition();
  }, [ingredients, calculateNutrition]);

  return (
    <div className=" mx-auto bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6">
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
              <h4 className="text-lg font-semibold text-green-800 mb-2">{sec.title}</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {sec.lines.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </section>
          ))}

          
        </>
      ) : (
        <p className="text-gray-500 italic">Aggiungi ingredienti per vedere i valori.</p>
      )}

      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-2xl flex gap-3">
        <Info className="w-5 h-5 text-yellow-600" />
        <p className="text-sm">
          <strong>Attenzione.</strong> I valori nutrizionali e i dati di apporto calorico sono forniti da DeepSeek a scopo informativo. Rappresentano stime basate su ingredienti e metodo di preparazione. Non sostituiscono il parere medico. Verifica sempre la compatibilità con le tue esigenze e consulta uno specialista in caso di dubbi.
        </p>
      </div>
    </div>
  );
}
