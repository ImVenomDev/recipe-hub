// Database per 100 g (USDA & fonti online)
const NUTRITION_DB: Record<string, { kcal: number; protein: number; fat: number; carbs: number; fiber: number }> = {
  farina: { kcal: 364, protein: 10, fat: 1, carbs: 76, fiber: 2 },
  zucchero: { kcal: 387, protein: 0, fat: 0, carbs: 100, fiber: 0 },
  uovo: { kcal: 155, protein: 13, fat: 11, carbs: 1, fiber: 0 },
  latte: { kcal: 42, protein: 3.4, fat: 1, carbs: 5, fiber: 0 },
  "olio d'oliva": { kcal: 884, protein: 0, fat: 100, carbs: 0, fiber: 0 },
  burro: { kcal: 744, protein: 0.5, fat: 82, carbs: 0.1, fiber: 0 },
  riso: { kcal: 117, protein: 2.4, fat: 0.3, carbs: 25.8, fiber: 0.4 },
  pollo: { kcal: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0 },
  manzo: { kcal: 250, protein: 26, fat: 15, carbs: 0, fiber: 0 },
  olio: { kcal: 884, protein: 0, fat: 100, carbs: 0, fiber: 0 },
  avocado: { kcal: 171, protein: 2, fat: 15, carbs: 9, fiber: 7 },
  spinaci: { kcal: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2 },
};

export function calculateNutrition(ingredients: { name: string; quantity: number | string }[]) {
  const total = { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 };
  ingredients.forEach((ing) => {
    const key = ing.name.toLowerCase();
    const db = NUTRITION_DB[key];
    const qty = typeof ing.quantity === 'string' ? parseFloat(ing.quantity) : ing.quantity;
    if (!db || isNaN(qty)) return;
    const factor = qty / 100;
    total.kcal += db.kcal * factor;
    total.protein += db.protein * factor;
    total.fat += db.fat * factor;
    total.carbs += db.carbs * factor;
    total.fiber += db.fiber * factor;
  });
  return {
    kcal: Math.round(total.kcal),
    protein: total.protein.toFixed(1),
    fat: total.fat.toFixed(1),
    carbs: total.carbs.toFixed(1),
    fiber: total.fiber.toFixed(1),
  };
}
