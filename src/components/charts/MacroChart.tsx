"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface MacroChartProps {
  data: { date: string; protein: number; carbs: number; fat: number }[];
}

export default function MacroChart({ data }: MacroChartProps) {
  if (data.length === 0) return <p className="text-foreground/50 text-center py-8">Keine Ernaehrungsdaten</p>;

  const chartData = [...data].reverse().map((d) => ({
    date: d.date.slice(5),
    Protein: Math.round(d.protein),
    Kohlenhydrate: Math.round(d.carbs),
    Fett: Math.round(d.fat),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" fontSize={12} unit="g" />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Legend />
        <Bar dataKey="Protein" fill="#3b82f6" radius={[2, 2, 0, 0]} />
        <Bar dataKey="Kohlenhydrate" fill="#f59e0b" radius={[2, 2, 0, 0]} />
        <Bar dataKey="Fett" fill="#ef4444" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
