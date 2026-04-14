import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDailySummary, getConsumedItems, getWeight, extractDailyNutrition, extractFoodItems, resolveProducts } from "@/lib/yazio";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json({ error: "No user found" }, { status: 404 });

  const results: string[] = [];

  if (process.env.YAZIO_USERNAME) {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split("T")[0];

      const [summary, items] = await Promise.all([
        getDailySummary(dateStr),
        getConsumedItems(dateStr),
      ]);

      const totals = extractDailyNutrition(summary);
      let foods = extractFoodItems(items);
      if (items.products?.length > 0) {
        foods = await resolveProducts(items);
      }

      if (totals.calories > 0 || foods.length > 0) {
        const nutritionDay = await prisma.nutritionDay.upsert({
          where: { userId_date: { userId: user.id, date: dateStr } },
          update: { ...totals },
          create: { userId: user.id, date: dateStr, ...totals },
        });

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
        results.push(`Yazio: ${foods.length} Lebensmittel fuer ${dateStr} (${Math.round(totals.calories)} kcal)`);
      } else {
        results.push(`Yazio: Keine Eintraege fuer ${dateStr}`);
      }

      const weight = await getWeight(dateStr);
      if (weight && weight.value) {
        await prisma.weightEntry.upsert({
          where: { userId_date_source: { userId: user.id, date: weight.date.split(" ")[0], source: "yazio" } },
          update: { weightKg: weight.value },
          create: { userId: user.id, date: weight.date.split(" ")[0], weightKg: weight.value, source: "yazio" },
        });
        results.push(`Yazio Gewicht: ${weight.value} kg`);
      }
    } catch (e) {
      results.push(`Yazio Fehler: ${e instanceof Error ? e.message : String(e)}`);
    }
  } else {
    results.push("Yazio: Nicht konfiguriert");
  }

  return NextResponse.json({ success: true, results, syncedAt: new Date().toISOString() });
}
