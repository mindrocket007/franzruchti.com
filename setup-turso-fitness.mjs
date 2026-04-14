// Setup Turso database tables for Fitness Dashboard
import 'dotenv/config';

const url = process.env.TURSO_DATABASE_URL.replace('libsql://', 'https://');
const token = process.env.TURSO_AUTH_TOKEN;

const statements = [
  // User
  `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "password" TEXT NOT NULL, "name" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,

  // NutritionDay
  `CREATE TABLE IF NOT EXISTS "NutritionDay" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "date" TEXT NOT NULL, "calories" REAL NOT NULL, "fat" REAL NOT NULL, "carbs" REAL NOT NULL, "protein" REAL NOT NULL, "fiber" REAL NOT NULL DEFAULT 0, "sugar" REAL NOT NULL DEFAULT 0, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, CONSTRAINT "NutritionDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "NutritionDay_userId_date_key" ON "NutritionDay"("userId", "date")`,
  `CREATE INDEX IF NOT EXISTS "NutritionDay_userId_idx" ON "NutritionDay"("userId")`,

  // Meal
  `CREATE TABLE IF NOT EXISTS "Meal" ("id" TEXT NOT NULL PRIMARY KEY, "nutritionDayId" TEXT NOT NULL, "mealType" TEXT NOT NULL, "foodName" TEXT NOT NULL, "calories" REAL NOT NULL, "fat" REAL NOT NULL, "carbs" REAL NOT NULL, "protein" REAL NOT NULL, "servingSize" TEXT, "fatsecretId" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Meal_nutritionDayId_fkey" FOREIGN KEY ("nutritionDayId") REFERENCES "NutritionDay" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE INDEX IF NOT EXISTS "Meal_nutritionDayId_idx" ON "Meal"("nutritionDayId")`,

  // WeightEntry
  `CREATE TABLE IF NOT EXISTS "WeightEntry" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "date" TEXT NOT NULL, "weightKg" REAL NOT NULL, "fatPct" REAL, "source" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "WeightEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "WeightEntry_userId_date_source_key" ON "WeightEntry"("userId", "date", "source")`,
  `CREATE INDEX IF NOT EXISTS "WeightEntry_userId_idx" ON "WeightEntry"("userId")`,

  // GarminActivity
  `CREATE TABLE IF NOT EXISTS "GarminActivity" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "garminActivityId" TEXT NOT NULL, "activityType" TEXT NOT NULL, "activityName" TEXT, "startTime" TEXT NOT NULL, "durationSec" INTEGER NOT NULL, "distanceM" REAL, "avgHr" INTEGER, "maxHr" INTEGER, "caloriesBurned" REAL, "trainingEffect" REAL, "vo2max" REAL, "rawJson" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "GarminActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "GarminActivity_garminActivityId_key" ON "GarminActivity"("garminActivityId")`,
  `CREATE INDEX IF NOT EXISTS "GarminActivity_userId_idx" ON "GarminActivity"("userId")`,
  `CREATE INDEX IF NOT EXISTS "GarminActivity_startTime_idx" ON "GarminActivity"("startTime")`,

  // GarminDaily
  `CREATE TABLE IF NOT EXISTS "GarminDaily" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "date" TEXT NOT NULL, "steps" INTEGER, "bodyBatteryHigh" INTEGER, "bodyBatteryLow" INTEGER, "avgStress" INTEGER, "hrvStatus" REAL, "hrvBaseline" REAL, "restingHr" INTEGER, "activeCalories" REAL, "totalCalories" REAL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "GarminDaily_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "GarminDaily_date_key" ON "GarminDaily"("date")`,
  `CREATE INDEX IF NOT EXISTS "GarminDaily_userId_idx" ON "GarminDaily"("userId")`,

  // SleepEntry
  `CREATE TABLE IF NOT EXISTS "SleepEntry" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "date" TEXT NOT NULL, "sleepScore" INTEGER, "durationMin" INTEGER NOT NULL, "deepMin" INTEGER, "lightMin" INTEGER, "remMin" INTEGER, "awakeMin" INTEGER, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "SleepEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "SleepEntry_userId_date_key" ON "SleepEntry"("userId", "date")`,
  `CREATE INDEX IF NOT EXISTS "SleepEntry_userId_idx" ON "SleepEntry"("userId")`,

  // TrainingPlan
  `CREATE TABLE IF NOT EXISTS "TrainingPlan" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, CONSTRAINT "TrainingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE INDEX IF NOT EXISTS "TrainingPlan_userId_idx" ON "TrainingPlan"("userId")`,

  // Routine
  `CREATE TABLE IF NOT EXISTS "Routine" ("id" TEXT NOT NULL PRIMARY KEY, "trainingPlanId" TEXT NOT NULL, "name" TEXT NOT NULL, "dayOfWeek" INTEGER, "sortOrder" INTEGER NOT NULL DEFAULT 0, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Routine_trainingPlanId_fkey" FOREIGN KEY ("trainingPlanId") REFERENCES "TrainingPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE INDEX IF NOT EXISTS "Routine_trainingPlanId_idx" ON "Routine"("trainingPlanId")`,

  // RoutineExercise
  `CREATE TABLE IF NOT EXISTS "RoutineExercise" ("id" TEXT NOT NULL PRIMARY KEY, "routineId" TEXT NOT NULL, "exerciseName" TEXT NOT NULL, "sets" INTEGER NOT NULL, "repsMin" INTEGER NOT NULL, "repsMax" INTEGER, "weightKg" REAL, "restSec" INTEGER, "notes" TEXT, "sortOrder" INTEGER NOT NULL DEFAULT 0, CONSTRAINT "RoutineExercise_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE INDEX IF NOT EXISTS "RoutineExercise_routineId_idx" ON "RoutineExercise"("routineId")`,

  // WorkoutLog
  `CREATE TABLE IF NOT EXISTS "WorkoutLog" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "routineId" TEXT, "date" TEXT NOT NULL, "durationMin" INTEGER, "notes" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, CONSTRAINT "WorkoutLog_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE SET NULL ON UPDATE CASCADE)`,
  `CREATE INDEX IF NOT EXISTS "WorkoutLog_userId_idx" ON "WorkoutLog"("userId")`,
  `CREATE INDEX IF NOT EXISTS "WorkoutLog_date_idx" ON "WorkoutLog"("date")`,

  // WorkoutSet
  `CREATE TABLE IF NOT EXISTS "WorkoutSet" ("id" TEXT NOT NULL PRIMARY KEY, "workoutLogId" TEXT NOT NULL, "exerciseName" TEXT NOT NULL, "setNumber" INTEGER NOT NULL, "reps" INTEGER NOT NULL, "weightKg" REAL, "rpe" REAL, CONSTRAINT "WorkoutSet_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "WorkoutLog" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE INDEX IF NOT EXISTS "WorkoutSet_workoutLogId_idx" ON "WorkoutSet"("workoutLogId")`,
];

const requests = statements.map(sql => ({ type: 'execute', stmt: { sql } }));
requests.push({ type: 'close' });

const res = await fetch(`${url}/v3/pipeline`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ requests }),
});

const data = await res.json();
console.log(JSON.stringify(data, null, 2));
console.log('\nTabellen erstellt:', statements.filter(s => s.startsWith('CREATE TABLE')).length);
console.log('Indexes erstellt:', statements.filter(s => s.startsWith('CREATE UNIQUE') || s.startsWith('CREATE INDEX')).length);
