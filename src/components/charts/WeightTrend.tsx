"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface WeightTrendProps {
  data: { date: string; weightKg: number }[];
  goalWeight?: number;
}

export default function WeightTrend({ data, goalWeight }: WeightTrendProps) {
  if (data.length === 0) return <p className="text-foreground/50 text-center py-8">Keine Gewichtsdaten</p>;

  const chartData = [...data].reverse().map((d) => ({
    date: d.date.slice(5), // MM-DD
    kg: d.weightKg,
  }));

  // 7-day moving average
  const withAvg = chartData.map((d, i) => {
    const window = chartData.slice(Math.max(0, i - 6), i + 1);
    const avg = window.reduce((sum, w) => sum + w.kg, 0) / window.length;
    return { ...d, avg: Math.round(avg * 10) / 10 };
  });

  const weights = data.map((d) => d.weightKg);
  const min = Math.floor(Math.min(...weights) - 1);
  const max = Math.ceil(Math.max(...weights) + 1);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={withAvg}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
        <YAxis domain={[min, max]} stroke="#94a3b8" fontSize={12} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Line type="monotone" dataKey="kg" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} name="Gewicht" />
        <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" name="7-Tage Schnitt" />
        {goalWeight && <ReferenceLine y={goalWeight} stroke="#22c55e" strokeDasharray="8 4" label={{ value: `Ziel: ${goalWeight}kg`, fill: "#22c55e", fontSize: 12 }} />}
      </LineChart>
    </ResponsiveContainer>
  );
}
