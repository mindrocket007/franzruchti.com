const BASE_URL = "https://yzapi.yazio.com/v15";
const CLIENT_ID = "1_4hiybetvfksgw40o0sog4s884kwc840wwso8go4k8c04goo4c";
const CLIENT_SECRET = "6rok2m65xuskgkgogw40wkkk8sw0osg84s8cggsc4woos4s8o";

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getToken() {
  if (cachedToken && cachedToken.expires_at > Date.now()) {
    return cachedToken.access_token;
  }

  const res = await fetch(`${BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: process.env.YAZIO_USERNAME!,
      password: process.env.YAZIO_PASSWORD!,
      grant_type: "password",
    }),
  });

  if (!res.ok) throw new Error(`Yazio auth failed: ${res.status}`);
  const data = await res.json();

  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.access_token;
}

async function yazioFetch<T>(endpoint: string): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Yazio API error: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Typen ──────────────────────────────────────────────

interface YazioMealNutrients {
  "energy.energy"?: number;
  "nutrient.protein"?: number;
  "nutrient.fat"?: number;
  "nutrient.carb"?: number;
  "nutrient.fiber"?: number;
  "nutrient.sugar"?: number;
}

interface YazioDailySummary {
  meals: {
    breakfast: { nutrients: YazioMealNutrients };
    lunch: { nutrients: YazioMealNutrients };
    dinner: { nutrients: YazioMealNutrients };
    snack: { nutrients: YazioMealNutrients };
  };
  goals: Record<string, number>;
  water_intake: number;
}

interface YazioConsumedProduct {
  id: string;
  date: string;
  daytime: string;
  product_id: string;
  amount: number;
  serving: string | null;
}

interface YazioSimpleProduct {
  id: string;
  date: string;
  daytime: string;
  name: string;
  nutrients: YazioMealNutrients;
}

interface YazioConsumedItems {
  products: YazioConsumedProduct[];
  simple_products: YazioSimpleProduct[];
  recipe_portions: YazioSimpleProduct[];
}

interface YazioWeight {
  id: string;
  date: string;
  value: number;
}

// ─── API Funktionen ─────────────────────────────────────

export async function getDailySummary(date: string): Promise<YazioDailySummary> {
  return yazioFetch(`/user/widgets/daily-summary?date=${date}`);
}

export async function getConsumedItems(date: string): Promise<YazioConsumedItems> {
  return yazioFetch(`/user/consumed-items?date=${date}`);
}

export async function getWeight(date: string): Promise<YazioWeight | null> {
  try {
    return await yazioFetch(`/user/bodyvalues/weight/last?date=${date}`);
  } catch {
    return null;
  }
}

export async function getProductDetails(productId: string) {
  return yazioFetch<{ name: string; nutrients: YazioMealNutrients }>(`/products/${productId}`);
}

// ─── Helper: Tages-Makros aus Summary extrahieren ───────

export function extractDailyNutrition(summary: YazioDailySummary) {
  let calories = 0, fat = 0, carbs = 0, protein = 0, fiber = 0, sugar = 0;

  for (const meal of Object.values(summary.meals)) {
    const n = meal.nutrients;
    calories += n["energy.energy"] || 0;
    protein += n["nutrient.protein"] || 0;
    fat += n["nutrient.fat"] || 0;
    carbs += n["nutrient.carb"] || 0;
    fiber += n["nutrient.fiber"] || 0;
    sugar += n["nutrient.sugar"] || 0;
  }

  return { calories, fat, carbs, protein, fiber, sugar };
}

export function extractMeals(summary: YazioDailySummary) {
  const meals: { mealType: string; foodName: string; calories: number; protein: number; carbs: number; fat: number }[] = [];

  for (const [type, meal] of Object.entries(summary.meals)) {
    const n = meal.nutrients;
    const cal = n["energy.energy"] || 0;
    if (cal > 0) {
      meals.push({
        mealType: type,
        foodName: type === "breakfast" ? "Fruehstueck" : type === "lunch" ? "Mittagessen" : type === "dinner" ? "Abendessen" : "Snack",
        calories: cal,
        protein: n["nutrient.protein"] || 0,
        carbs: n["nutrient.carb"] || 0,
        fat: n["nutrient.fat"] || 0,
      });
    }
  }

  return meals;
}

// Einzelne Lebensmittel aus consumed-items extrahieren
export function extractFoodItems(items: YazioConsumedItems) {
  const foods: { mealType: string; foodName: string; calories: number; protein: number; carbs: number; fat: number; yazio_id: string }[] = [];

  // Simple products (haben Name + Nährstoffe direkt)
  for (const item of items.simple_products || []) {
    const n = item.nutrients;
    foods.push({
      mealType: item.daytime || "snack",
      foodName: item.name || "Unbekannt",
      calories: n["energy.energy"] || 0,
      protein: n["nutrient.protein"] || 0,
      carbs: n["nutrient.carb"] || 0,
      fat: n["nutrient.fat"] || 0,
      yazio_id: item.id,
    });
  }

  // Recipe portions (haben auch Name + Nährstoffe)
  for (const item of items.recipe_portions || []) {
    const n = item.nutrients;
    foods.push({
      mealType: item.daytime || "snack",
      foodName: item.name || "Rezept",
      calories: n["energy.energy"] || 0,
      protein: n["nutrient.protein"] || 0,
      carbs: n["nutrient.carb"] || 0,
      fat: n["nutrient.fat"] || 0,
      yazio_id: item.id,
    });
  }

  return foods;
}

// Products brauchen einen extra API-Call fuer den Namen
export async function resolveProducts(items: YazioConsumedItems) {
  const foods = extractFoodItems(items);

  // Products (haben nur product_id, brauchen Details-Abruf)
  // Nährwerte von getProductDetails sind pro 1g/1ml → mit amount multiplizieren
  for (const item of items.products || []) {
    try {
      const details = await getProductDetails(item.product_id);
      const amount = item.amount || 1;
      foods.push({
        mealType: item.daytime || "snack",
        foodName: details.name || "Produkt",
        calories: Math.round((details.nutrients["energy.energy"] || 0) * amount),
        protein: Math.round((details.nutrients["nutrient.protein"] || 0) * amount * 10) / 10,
        carbs: Math.round((details.nutrients["nutrient.carb"] || 0) * amount * 10) / 10,
        fat: Math.round((details.nutrients["nutrient.fat"] || 0) * amount * 10) / 10,
        yazio_id: item.id,
      });
    } catch {
      // Product details not available, skip
    }
  }

  return foods;
}
