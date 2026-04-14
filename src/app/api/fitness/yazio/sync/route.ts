import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { getDailySummary, getConsumedItems, getWeight, extractDailyNutrition, extractFoodItems, resolveProducts } from "@/lib/yazio";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date } = await req.json();
  const dateStr = date || new Date().toISOString().split("T")[0];

  if (!process.env.YAZIO_USERNAME) {
    return NextResponse.json({ error: "Yazio nicht konfiguriert" }, { status: 400 });
  }

  const results: string[] = [];

  try {
    // Get summary (for totals) and consumed items (for individual foods)
    const [summary, items] = await Promise.all([
      getDailySummary(dateStr),
      getConsumedItems(dateStr),
    ]);

    const totals = extractDailyNutrition(summary);

    // Get individual food items with names
    let foods = extractFoodItems(items);

    // If there are products (need extra API call for names), resolve them
    if (items.products?.length > 0) {
      foods = await resolveProducts(items);
    }

    if (totals.calories > 0 || foods.length > 0) {
      const nutritionDay = await prisma.nutritionDay.upsert({
        where: { userId_date: { userId: user.id, date: dateStr } },
        update: { ...totals },
        create: { userId: user.id, date: dateStr, ...totals },
      });

      // Replace meals with individual food items
      await prisma.meal.deleteMany({ where: { nutritionDayId: nutritionDay.id } });
      for (const food of foods) {
        await prisma.meal.create({
          data: {
            nutritionDayId: nutritionDay.id,
            mealType: food.mealType,
            foodName: food.foodName,
            calories: food.calories,
            fat: food.fat,
            carbs: food.carbs,
            protein: food.protein,
            fatsecretId: food.yazio_id,
          },
        });
      }
      results.push(`${Math.round(totals.calories)} kcal, ${foods.length} Lebensmittel`);
    } else {
      results.push("Keine Eintraege fuer " + dateStr);
    }

    // Sync weight
    const weight = await getWeight(dateStr);
    if (weight && weight.value) {
      await prisma.weightEntry.upsert({
        where: { userId_date_source: { userId: user.id, date: weight.date.split(" ")[0], source: "yazio" } },
        update: { weightKg: weight.value },
        create: { userId: user.id, date: weight.date.split(" ")[0], weightKg: weight.value, source: "yazio" },
      });
      results.push(`Gewicht: ${weight.value} kg`);
    }
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }

  return NextResponse.json({ success: true, results, date: dateStr });
}
